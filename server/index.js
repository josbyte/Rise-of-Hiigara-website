const express = require('express');
const cors = require('cors');
const { Client, GatewayIntentBits } = require('discord.js');

const PORT = Number(process.env.PORT || 5174);
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID || '1496083776617447505';

if (!DISCORD_BOT_TOKEN) {
  // eslint-disable-next-line no-console
  console.error('Missing DISCORD_BOT_TOKEN env var.');
  process.exit(1);
}

const discord = new Client({ intents: [GatewayIntentBits.Guilds] });

discord.once('ready', () => {
  // eslint-disable-next-line no-console
  console.log(`Discord bot logged in as ${discord.user?.tag || 'unknown'}`);
});

function sanitizeInline(value, maxLen) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  return text.length > maxLen ? text.slice(0, maxLen - 1) + '…' : text;
}

function sanitizeMultiline(value, maxLen) {
  const text = String(value || '').replace(/\r\n/g, '\n').trim();
  if (!text) return '';
  return text.length > maxLen ? text.slice(0, maxLen - 1) + '…' : text;
}

function looksLikeLink(text) {
  return /https?:\/\//i.test(text) || /\bwww\./i.test(text);
}

async function postRumorToChannel(payload) {
  const channel = await discord.channels.fetch(DISCORD_CHANNEL_ID);
  if (!channel || !channel.isTextBased()) throw new Error('Discord channel not found or not text-based.');

  const contributorName = sanitizeInline(payload.contributorName, 48) || 'Anonymous';
  const npcName = sanitizeInline(payload.npcName, 48);
  const faction = sanitizeInline(payload.faction, 64);
  const rumor = sanitizeMultiline(payload.rumor, 1500);

  const lines = [
    '**New Rumor Submission**',
    `Contributor: \`${contributorName}\``,
    npcName ? `NPC: \`${npcName}\`` : null,
    faction ? `Faction: \`${faction}\`` : null,
    '',
    rumor ? `> ${rumor.split('\n').join('\n> ')}` : '> (empty)',
  ].filter(Boolean);

  await channel.send(lines.join('\n'));
}

async function main() {
  await discord.login(DISCORD_BOT_TOKEN);

  const app = express();
  app.use(cors({ origin: true }));
  app.use(express.json({ limit: '40kb' }));

  // Basic in-memory rate limit per IP.
  const ipBuckets = new Map();
  const WINDOW_MS = 60_000;
  const MAX_PER_WINDOW = 10;

  app.post('/api/rumor', async (req, res) => {
    try {
      const ip =
        req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
        req.socket.remoteAddress ||
        'unknown';
      const now = Date.now();
      const bucket = ipBuckets.get(ip) || [];
      const recent = bucket.filter(ts => now - ts < WINDOW_MS);
      recent.push(now);
      ipBuckets.set(ip, recent);
      if (recent.length > MAX_PER_WINDOW) {
        res.status(429).json({ ok: false, error: 'rate_limited' });
        return;
      }

      const { contributorName, npcName, faction, rumor, consent, honeypot } = req.body || {};

      if (String(honeypot || '').trim()) {
        res.status(400).json({ ok: false, error: 'bot_trap' });
        return;
      }
      if (!consent) {
        res.status(400).json({ ok: false, error: 'consent_required' });
        return;
      }

      const rumorText = String(rumor || '').trim();
      if (rumorText.length < 30) {
        res.status(400).json({ ok: false, error: 'rumor_too_short' });
        return;
      }
      if (
        looksLikeLink(rumorText) ||
        looksLikeLink(String(contributorName || '')) ||
        looksLikeLink(String(npcName || ''))
      ) {
        res.status(400).json({ ok: false, error: 'links_not_allowed' });
        return;
      }

      await postRumorToChannel({
        contributorName,
        npcName,
        faction,
        rumor: rumorText,
      });

      res.json({ ok: true });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      res.status(500).json({ ok: false, error: 'server_error' });
    }
  });

  app.get('/health', (_req, res) => res.type('text').send('ok'));

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Rumor collector listening on http://localhost:${PORT}`);
  });
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});

