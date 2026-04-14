/* =========================================
   THE RELIC INTERFACE - JavaScript
   Cinematic Interactions
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavigation();
  initScrollProgress();
  initBackToTop();
  initScrollEffects();
  initCarousel();
  initFactionShowcase();
  initThemeSelector();
  initStatCounters();
  initModDBFeeds();
});

/* === PARTICLES === */
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-8;pointer-events:none;';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 25000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2 + 0.3,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.9 ? '#0071ff' : '#FFFFFF'
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      if (p.radius > 0.6) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = p.opacity * 0.15;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#0071ff';
          ctx.globalAlpha = (1 - dist / 80) * 0.04;
          ctx.stroke();
        }
      }
    }
  }

  function update() {
    particles.forEach(p => {
      p.x += p.speedX; p.y += p.speedY;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });
  }

  function animate() { update(); draw(); requestAnimationFrame(animate); }
  resize(); createParticles(); animate();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

/* === NAVIGATION === */
function initNavigation() {
  const nav = document.querySelector('.hw-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  const toggle = document.querySelector('.hw-nav-toggle');
  const links = document.querySelector('.hw-nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', toggle.classList.contains('active'));
    });
    links.querySelectorAll('.hw-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY > top && scrollY <= top + height) {
        document.querySelectorAll('.hw-nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) link.classList.add('active');
        });
      }
    });
  }, { passive: true });
}

/* === SCROLL EFFECTS === */
function initScrollEffects() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => { entry.target.classList.add('revealed'); }, delay);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.hw-features').forEach(grid => {
    grid.querySelectorAll('.hw-feature').forEach((el, i) => {
      el.dataset.revealDelay = i * 100;
      el.classList.add('reveal');
      observer.observe(el);
    });
  });

  document.querySelectorAll('.hw-carousel-card').forEach((el, i) => {
    el.dataset.revealDelay = i * 80;
    el.classList.add('reveal');
    observer.observe(el);
  });

  document.querySelectorAll('.hw-news-card').forEach((el, i) => {
    el.dataset.revealDelay = i * 120;
    el.classList.add('reveal');
    observer.observe(el);
  });

  document.querySelectorAll('.hw-stat').forEach((el, i) => {
    el.dataset.revealDelay = i * 120;
    el.classList.add('reveal');
    observer.observe(el);
  });

  document.querySelectorAll('.hw-timeline').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  document.querySelectorAll('.hw-download-panel, .hw-social-card, .hw-faction-showcase').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  const style = document.createElement('style');
  style.textContent = '.reveal{opacity:0;transform:translateY(30px);transition:opacity 0.6s cubic-bezier(0.16,1,0.3,1),transform 0.6s cubic-bezier(0.16,1,0.3,1)}.reveal.revealed{opacity:1;transform:translateY(0)}';
  document.head.appendChild(style);
}

/* === CAROUSEL === */
function initCarousel() {
  const track = document.getElementById('gallery-track');
  const prevBtn = document.querySelector('.hw-carousel-prev');
  const nextBtn = document.querySelector('.hw-carousel-next');
  if (!track || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  function getVisibleCards() {
    const width = window.innerWidth;
    if (width <= 768) return 1;
    if (width <= 1024) return 2;
    return 3;
  }

  function getCardWidth() {
    const card = track.querySelector('.hw-carousel-card');
    if (!card) return 0;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.gap) || 20;
    return card.offsetWidth + gap;
  }

  function updatePosition() {
    const cardWidth = getCardWidth();
    track.style.transform = 'translateX(' + (-currentIndex * cardWidth) + 'px)';
  }

  function getMaxIndex() {
    const cards = track.querySelectorAll('.hw-carousel-card').length;
    const visible = getVisibleCards();
    return Math.max(0, cards - visible);
  }

  nextBtn.addEventListener('click', () => {
    const max = getMaxIndex();
    if (currentIndex < max) {
      currentIndex++;
      updatePosition();
    } else {
      currentIndex = 0;
      updatePosition();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updatePosition();
    } else {
      currentIndex = getMaxIndex();
      updatePosition();
    }
  });

  // Also click to open lightbox
  track.querySelectorAll('.hw-carousel-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (img && window.openLightbox) window.openLightbox(img.src);
    });
  });

  window.addEventListener('resize', () => {
    const max = getMaxIndex();
    if (currentIndex > max) currentIndex = max;
    updatePosition();
  });

  // Create lightbox
  if (!document.getElementById('lightbox')) {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,14,26,0.95);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);z-index:9999;display:none;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity 0.3s ease;';
    const lightboxImg = document.createElement('img');
    lightboxImg.style.cssText = 'max-width:90%;max-height:90%;box-shadow:0 0 40px rgba(0,0,0,0.8),0 0 20px rgba(0,113,255,0.1);transition:transform 0.4s cubic-bezier(0.16,1,0.3,1);transform:scale(0.9);';
    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);

    lightbox.addEventListener('click', () => {
      lightbox.style.opacity = '0';
      lightboxImg.style.transform = 'scale(0.9)';
      setTimeout(() => { lightbox.style.display = 'none'; }, 300);
    });

    window.openLightbox = (src) => {
      lightboxImg.src = src;
      lightbox.style.display = 'flex';
      requestAnimationFrame(() => {
        lightbox.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      });
    };
  }
}

/* === FACTION SHOWCASE === */
function initFactionShowcase() {
  const items = document.querySelectorAll('.hw-faction-item');
  const factionImage = document.getElementById('faction-image');
  const factionTitle = document.getElementById('faction-title');
  const factionDesc = document.getElementById('faction-desc');
  if (!items.length || !factionImage) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const img = item.dataset.img;
      const title = item.dataset.title;
      const desc = item.dataset.desc;
      if (img) factionImage.src = img;
      if (title) factionTitle.textContent = title;
      if (desc) factionDesc.textContent = desc;
    });
  });
}

/* === THEME SELECTOR === */
function initThemeSelector() {
  const factionSelect = document.getElementById('faction-select');
  if (!factionSelect) return;

  const savedFaction = localStorage.getItem('hw-faction');
  if (savedFaction) {
    const option = factionSelect.querySelector('option[value="' + savedFaction + '"]');
    if (option) { factionSelect.value = savedFaction; applyTheme(option); }
  }

  factionSelect.addEventListener('change', (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    if (selectedOption.value === 'default') {
      resetTheme();
      localStorage.removeItem('hw-faction');
    } else {
      applyTheme(selectedOption);
      localStorage.setItem('hw-faction', selectedOption.value);
    }
  });
}

function applyTheme(option) {
  const baseColor = option.dataset.base;
  const secondaryColor = option.dataset.secondary;
  const baseRGB = hexToRgb(baseColor);
  const secondaryRGB = hexToRgb(secondaryColor);
  const root = document.documentElement;
  root.style.setProperty('--theme-base', baseColor);
  root.style.setProperty('--theme-secondary', secondaryColor);
  root.style.setProperty('--theme-base-rgb', baseRGB);
  root.style.setProperty('--theme-secondary-rgb', secondaryRGB);

  const baseHex = baseColor.replace(/^#/, '');
  const bR = parseInt(baseHex.substring(0, 2), 16);
  const bG = parseInt(baseHex.substring(2, 4), 16);
  const bB = parseInt(baseHex.substring(4, 6), 16);
  const baseBrightness = (bR * 299 + bG * 587 + bB * 114) / 1000;

  let primaryColor = baseBrightness > 60 ? baseColor : secondaryColor;
  const priHex = primaryColor.replace(/^#/, '');
  const pR = parseInt(priHex.substring(0, 2), 16);
  const pG = parseInt(priHex.substring(2, 4), 16);
  const pB = parseInt(priHex.substring(4, 6), 16);
  const priBrightness = (pR * 299 + pG * 587 + pB * 114) / 1000;
  if (priBrightness < 40) primaryColor = '#0071ff';

  root.style.setProperty('--primary', primaryColor);
  root.style.setProperty('--primary-rgb', hexToRgb(primaryColor));
}

function resetTheme() {
  const root = document.documentElement;
  root.style.setProperty('--primary', '#0071ff');
  root.style.setProperty('--primary-rgb', '0, 113, 255');
  root.style.setProperty('--theme-base', '#0071ff');
  root.style.setProperty('--theme-secondary', '#e8a020');
  root.style.setProperty('--theme-base-rgb', '0, 113, 255');
  root.style.setProperty('--theme-secondary-rgb', '232, 160, 32');
}

function hexToRgb(hex) {
  hex = (hex || '').replace(/^#/, '');
  if (hex.length < 6) hex = hex.padEnd(6, '0');
  return parseInt(hex.substring(0, 2), 16) + ', ' + parseInt(hex.substring(2, 4), 16) + ', ' + parseInt(hex.substring(4, 6), 16);
}

/* === SCROLL PROGRESS BAR === */
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'hw-scroll-progress';
  document.body.appendChild(progressBar);
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrollTop / docHeight) * 100 + '%';
  }, { passive: true });
}

/* === BACK TO TOP === */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'hw-back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '\u25B2';
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

/* === STAT COUNTER ANIMATION === */
function initStatCounters() {
  const stats = document.querySelectorAll('.hw-stat-value');
  if (!stats.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(stat => observer.observe(stat));
}

function animateCounter(el) {
  const text = el.textContent.trim();
  const suffix = text.replace(/[\d,.]+/, '');
  const numStr = text.replace(/[^\d,.]/g, '');
  const target = parseInt(numStr.replace(/,/g, ''), 10);
  if (isNaN(target)) return;
  let current = 0;
  const duration = 1500;
  const startTime = performance.now();
  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    current = Math.round(target * eased);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* === MODDB RSS FEEDS === */
async function fetchWithCorsFallback(url) {
  try {
    const res = await fetch(url);
    if (res.ok) return await res.text();
    throw new Error('Direct fetch failed');
  } catch (err) {
    try {
      const proxy = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);
      const pres = await fetch(proxy);
      if (pres.ok) return await pres.text();
      throw new Error('Proxy fetch failed');
    } catch (e) { console.warn('RSS fetch failed for', url, err, e); return null; }
  }
}

async function fetchRssCached(url, ttlMs) {
  ttlMs = ttlMs || 3600000;
  try {
    const key = 'rsscache:' + url;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.ts && (Date.now() - parsed.ts) < ttlMs && parsed.text) return parsed.text;
      } catch (e) { /* fall through */ }
    }
    const text = await fetchWithCorsFallback(url);
    if (text) {
      try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), text: text })); } catch (e) { /* ignore */ }
    }
    return text;
  } catch (e) { console.warn('fetchRssCached error', e); return await fetchWithCorsFallback(url); }
}

function parseRSS(xmlText) {
  try { return new DOMParser().parseFromString(xmlText, 'application/xml'); } catch (e) { return null; }
}

function formatPubDate(pubDateStr) {
  try {
    const d = new Date(pubDateStr);
    if (isNaN(d)) return pubDateStr;
    return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) { return pubDateStr; }
}

async function updateGalleryFromRSS(rssUrl, limit) {
  limit = limit || 6;
  const text = await fetchRssCached(rssUrl, 3600000);
  if (!text) return;
  const doc = parseRSS(text);
  if (!doc) return;
  const items = Array.from(doc.querySelectorAll('item'));
  if (!items.length) return;

  const track = document.getElementById('gallery-track');
  if (!track) return;

  const nodes = [];
  for (let i = 0; i < Math.min(limit, items.length); i++) {
    const it = items[i];
    let imgUrl = '';
    const media = it.querySelector('media\\:content, content');
    if (media && media.getAttribute('url')) imgUrl = media.getAttribute('url');
    if (!imgUrl) {
      const enclosure = it.querySelector('enclosure');
      if (enclosure && enclosure.getAttribute('url')) imgUrl = enclosure.getAttribute('url');
    }
    if (!imgUrl) {
      const desc = it.querySelector('description');
      if (desc && desc.textContent) {
        const m = desc.textContent.match(/src="([^"]+)"/i);
        if (m) imgUrl = m[1];
      }
    }
    const title = it.querySelector('title') ? it.querySelector('title').textContent.trim() : 'Image';
    if (!imgUrl) continue;

    const card = document.createElement('div');
    card.className = 'hw-carousel-card';
    card.innerHTML = '<div class="hw-carousel-img"><img src="' + escapeHtml(imgUrl) + '" alt="' + escapeHtml(title) + '" loading="lazy"></div><div class="hw-carousel-caption">' + escapeHtml(title) + '</div>';
    nodes.push(card);
  }
  if (nodes.length) {
    track.innerHTML = '';
    nodes.forEach(n => track.appendChild(n));
    // Re-bind click for lightbox
    track.querySelectorAll('.hw-carousel-card').forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        if (img && window.openLightbox) window.openLightbox(img.src);
      });
    });
  }
}

async function updateNewsFromRSS(rssUrl, limit) {
  limit = limit || 3;
  const text = await fetchRssCached(rssUrl, 3600000);
  if (!text) return;
  const doc = parseRSS(text);
  if (!doc) return;
  const items = Array.from(doc.querySelectorAll('item'));
  if (!items.length) return;

  const container = document.getElementById('news-cards');
  if (!container) return;

  const nodes = [];
  for (let i = 0; i < Math.min(limit, items.length); i++) {
    const it = items[i];
    const title = it.querySelector('title') ? it.querySelector('title').textContent.trim() : 'Article';
    const link = it.querySelector('link') ? it.querySelector('link').textContent.trim() : '#';
    const pubDate = it.querySelector('pubDate') ? it.querySelector('pubDate').textContent.trim() : '';

    let imgUrl = '';
    const media = it.querySelector('media\\:content, content');
    if (media && media.getAttribute('url')) imgUrl = media.getAttribute('url');
    if (!imgUrl) {
      const enclosure = it.querySelector('enclosure');
      if (enclosure && enclosure.getAttribute('url')) imgUrl = enclosure.getAttribute('url');
    }
    if (!imgUrl) {
      const desc = it.querySelector('description');
      if (desc && desc.textContent) {
        const m = desc.textContent.match(/src="([^"]+)"/i);
        if (m) imgUrl = m[1];
      }
    }

    let excerpt = '';
    const descEl = it.querySelector('description');
    if (descEl && descEl.textContent) {
      const tmp = document.createElement('div');
      tmp.innerHTML = descEl.textContent;
      excerpt = tmp.textContent.substring(0, 150).trim();
      if (tmp.textContent.length > 150) excerpt += '...';
    }

    const card = document.createElement('a');
    card.href = link;
    card.target = '_blank';
    card.className = 'hw-news-card';
    card.innerHTML =
      (imgUrl ? '<div class="hw-news-card-img"><img src="' + escapeHtml(imgUrl) + '" alt="" loading="lazy"></div>' : '') +
      '<div class="hw-news-card-body">' +
      '<span class="hw-news-card-date">' + escapeHtml(formatPubDate(pubDate)) + '</span>' +
      '<h3 class="hw-news-card-title">' + escapeHtml(title) + '</h3>' +
      (excerpt ? '<p class="hw-news-card-excerpt">' + escapeHtml(excerpt) + '</p>' : '') +
      '</div>';
    nodes.push(card);
  }
  if (nodes.length) {
    container.innerHTML = '';
    nodes.forEach(n => container.appendChild(n));
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&"'<>]/g, function(s) {
    return ({'&':'&amp;','"':'&quot;',"'":'&#39;','<':'&lt;','>':'&gt;'})[s];
  });
}

async function initModDBFeeds() {
  const imagesFeed = 'https://rss.moddb.com/mods/homeworld-rise-of-hiigara/images/feed/rss.xml';
  const articlesFeed = 'https://rss.moddb.com/mods/homeworld-rise-of-hiigara/articles/feed/rss.xml';
  updateGalleryFromRSS(imagesFeed, 9).catch(function(e) { console.warn('Gallery RSS update failed', e); });
  updateNewsFromRSS(articlesFeed, 3).catch(function(e) { console.warn('News RSS update failed', e); });
}
