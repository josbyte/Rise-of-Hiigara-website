document.addEventListener('DOMContentLoaded', () => {
  initRumorMillForm();
});

function initRumorMillForm() {
  const form = document.getElementById('rumor-mill-form');
  if (!form) return;

  const status = document.getElementById('rumor-status');
  const rumorText = document.getElementById('rumor-text');
  const counter = document.getElementById('rumor-counter');
  const captchaQuestion = document.getElementById('captcha-question');
  const captchaRefresh = document.getElementById('captcha-refresh');
  const captchaAnswerInput = document.getElementById('captcha-answer');
  const consent = document.getElementById('rumor-consent');
  const honeypot = document.getElementById('rumor-callsign');
  let captchaAnswer = '';

  const blockedPatterns = [
    /https?:\/\//i,
    /www\./i,
    /\bdiscord\b/i,
    /\b(?:porn|nsfw|nude)\b/i,
    /\b(?:slur|kill yourself)\b/i,
  ];

  function setStatus(message, state) {
    status.textContent = message;
    if (state) {
      status.dataset.state = state;
    } else {
      status.removeAttribute('data-state');
    }
  }

  function updateCounter() {
    const length = rumorText.value.trim().length;
    counter.textContent = length + ' / 800';

    if (!length) {
      setStatus('All submissions are reviewed before entering the cantina rotation.');
      return;
    }

    if (length < 30) {
      setStatus('Add a bit more detail so it sounds like real bar gossip.');
      return;
    }

    setStatus('Length looks good for an overheard rumor.');
  }

  function regenerateCaptcha() {
    const left = Math.floor(Math.random() * 8) + 2;
    const right = Math.floor(Math.random() * 8) + 1;
    captchaAnswer = String(left + right);
    captchaQuestion.textContent = 'Confirm: ' + left + ' + ' + right;
    captchaAnswerInput.value = '';
  }

  rumorText.addEventListener('input', updateCounter);
  captchaRefresh.addEventListener('click', regenerateCaptcha);
  regenerateCaptcha();
  updateCounter();

  function normalizeEndpoint(raw) {
    const input = String(raw || '').trim();
    if (!input) return '';

    let processed = input;

    const scheme = 'https';
    const base =  scheme + '//' + processed;

    // If no explicit path, assume collector path.
    const hasPath = /\/\/[^/]+\/.+/.test(base);
    return hasPath ? base : base + '';
  }



  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const endpoint =
      normalizeEndpoint(form.dataset.endpoint) || normalizeEndpoint('https://bot.riseofhiigara.com');
    if (!endpoint) {
      setStatus('Missing endpoint configuration.', 'error');
      return;
    }

    try {
      new URL(endpoint);
    } catch (_e) {
      setStatus('Invalid endpoint URL.', 'error');
      return;
    }

    const formData = new FormData(form);
    const contributorName = String(formData.get('contributor_name') || '').trim();
    const npcName = String(formData.get('npc_name') || '').trim();
    const faction = String(formData.get('faction') || '').trim();
    const rumor = String(formData.get('rumor') || '').trim();
    const captcha = String(formData.get('captcha') || '').trim();

    if (honeypot.value.trim()) {
      setStatus('Submission rejected.', 'error');
      return;
    }

    if (!contributorName || !faction || !rumor) {
      setStatus('Fill in contributor name, faction, and rumor before sending.', 'error');
      return;
    }

    if (rumor.length < 30) {
      setStatus('The rumor is too short. Give it more atmosphere.', 'error');
      return;
    }

    if (
      blockedPatterns.some(
        (pattern) => pattern.test(contributorName) || pattern.test(npcName) || pattern.test(rumor)
      )
    ) {
      setStatus(
        'This submission looks unsafe or out of bounds. Remove links or inappropriate wording and try again.',
        'error'
      );
      return;
    }

    if (!consent.checked) {
      setStatus('You need to accept the moderation notice before sending.', 'error');
      return;
    }

    if (captcha !== captchaAnswer) {
      setStatus('Captcha failed. Please solve the checkpoint again.', 'error');
      regenerateCaptcha();
      captchaAnswerInput.focus();
      return;
    }

    // Post to the local rumor collector (which relays to Discord).
    const apiUrl = endpoint + '/api/rumor';
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contributorName,
        npcName,
        faction,
        rumor,
        consent: consent.checked,
        honeypot: honeypot.value,
      }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.ok) throw new Error(data.error || 'request_failed');

        try {
          localStorage.setItem(
            'roh-latest-rumor',
            JSON.stringify({
              contributorName: contributorName,
              npcName: npcName,
              faction: faction,
              rumor: rumor,
              submittedAt: new Date().toISOString(),
            })
          );
        } catch (error) {
          console.warn('Rumor draft could not be cached locally.', error);
        }

        form.reset();
        regenerateCaptcha();
        updateCounter();
        setStatus(
          'Sent for review. If it fits the setting, it may appear in a future bar.',
          'success'
        );
      })
      .catch((error) => {
        console.warn('Rumor POST failed:', error);
        regenerateCaptcha();
        captchaAnswerInput.focus();
        setStatus(
          'Could not reach the bot endpoint or it rejected the submission. Check CORS configuration and that the endpoint is accessible.',
          'error'
        );
      });
  });
}
