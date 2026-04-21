/* =========================================
   HOMEWORLD 2 INTERFACE - JavaScript
   Faithful HW2 UI interactions
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavigation();
  initScrollProgress();
  initBackToTop();
  initScrollEffects();
  initGallery();
  initThemeSelector();
  initStatCounters();
  initModDBFeeds();
});

/* === PARTICLES EFFECT === */
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -8;
    pointer-events: none;
  `;
  
  document.body.insertBefore(canvas, document.body.firstChild);
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 20000);
    
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.8 ? '#FF9F1C' : '#FFFFFF'
      });
    }
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      // Draw glow
      if (p.radius > 0.8) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = p.opacity * 0.2;
        ctx.fill();
      }
      
      // Draw star
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });
    
    // Draw subtle connections
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = '#00BFFF';
          ctx.globalAlpha = (1 - dist / 100) * 0.08;
          ctx.stroke();
        }
      });
    });
  }
  
  function update() {
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });
  }
  
  function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
  }
  
  resize();
  createParticles();
  animate();
  
  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

/* === NAVIGATION === */
function initNavigation() {
  const nav = document.querySelector('.hw-nav');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
  
  // Mobile menu
  const toggle = document.querySelector('.hw-nav-toggle');
  const links = document.querySelector('.hw-nav-links');
  
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
      toggle.classList.toggle('active');
      
      // Update aria-expanded
      const expanded = toggle.classList.contains('active');
      toggle.setAttribute('aria-expanded', expanded);
    });
    
    // Close mobile menu when clicking a link
    links.querySelectorAll('.hw-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
  
  // Active section highlighting
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
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* === SCROLL EFFECTS === */
function initScrollEffects() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger the reveal for grid children
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
      }
    });
  }, { threshold: 0.1 });
  
  // Add staggered delays to grid items
  document.querySelectorAll('.hw-features').forEach(grid => {
    grid.querySelectorAll('.hw-feature').forEach((el, i) => {
      el.dataset.revealDelay = i * 100;
      el.classList.add('reveal');
      observer.observe(el);
    });
  });
  
  document.querySelectorAll('.hw-gallery').forEach(grid => {
    grid.querySelectorAll('.hw-gallery-item').forEach((el, i) => {
      el.dataset.revealDelay = i * 80;
      el.classList.add('reveal');
      observer.observe(el);
    });
  });
  
  document.querySelectorAll('.hw-stats').forEach(grid => {
    grid.querySelectorAll('.hw-stat').forEach((el, i) => {
      el.dataset.revealDelay = i * 120;
      el.classList.add('reveal');
      observer.observe(el);
    });
  });
  
  document.querySelectorAll('.hw-download-card, .hw-panel').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
  
  // Add reveal CSS
  const style = document.createElement('style');
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
}

/* === GALLERY === */
function initGallery() {
  const items = document.querySelectorAll('.hw-gallery-item');
  
  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        openLightbox(img.src);
      }
    });
  });
  
  // Create lightbox
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(5, 5, 10, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  
  const lightboxImg = document.createElement('img');
  lightboxImg.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    border: 1px solid rgba(var(--theme-base-rgb, 255, 159, 28), 0.5);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(var(--theme-base-rgb, 255, 159, 28), 0.1);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    transform: scale(0.9);
  `;
  
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

/* === THEME SELECTOR === */
function initThemeSelector() {
  const factionSelect = document.getElementById('faction-select');
  
  if (!factionSelect) return;
  
  // Load saved theme from localStorage
  const savedFaction = localStorage.getItem('hw-faction');
  if (savedFaction) {
    const option = factionSelect.querySelector(`option[value="${savedFaction}"]`);
    if (option) {
      factionSelect.value = savedFaction;
      applyTheme(option);
    }
  } else {
    // Apply default (Hiigaran) theme on first load
    const defaultOption = factionSelect.querySelector('option[selected]');
    if (defaultOption) {
      applyTheme(defaultOption);
    }
  }
  
  // Listen for changes
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
  
  // Convert hex to RGB for glow effects
  const baseRGB = hexToRgb(baseColor);
  const secondaryRGB = hexToRgb(secondaryColor);
  
  // Update CSS variables
  document.documentElement.style.setProperty('--theme-base', baseColor);
  document.documentElement.style.setProperty('--theme-secondary', secondaryColor);
  document.documentElement.style.setProperty('--theme-base-rgb', baseRGB);
  document.documentElement.style.setProperty('--theme-secondary-rgb', secondaryRGB);

  // --btn-color: use base unless it's too dark, then fall back to secondary
  const baseHexCheck = baseColor.replace(/^#/, '');
  const btnR = parseInt(baseHexCheck.substring(0, 2), 16);
  const btnG = parseInt(baseHexCheck.substring(2, 4), 16);
  const btnB = parseInt(baseHexCheck.substring(4, 6), 16);
  const btnBaseBrightness = (btnR * 299 + btnG * 587 + btnB * 114) / 1000;
  const btnColor = btnBaseBrightness < 60 ? secondaryColor : baseColor;
  const btnColorHex = btnColor.replace(/^#/, '');
  const btnCR = parseInt(btnColorHex.substring(0, 2), 16);
  const btnCG = parseInt(btnColorHex.substring(2, 4), 16);
  const btnCB = parseInt(btnColorHex.substring(4, 6), 16);
  document.documentElement.style.setProperty('--btn-color', btnColor);
  document.documentElement.style.setProperty('--btn-color-rgb', `${btnCR}, ${btnCG}, ${btnCB}`);

  // Adjust background for dark faction colors
  adjustBackgroundForDarkTheme(baseColor, option.value, secondaryColor);
  // Determine hero title color after background adjusted — if base would be too dark on hw-dark, use secondary
  try {
    const root = document.documentElement;
    const computed = getComputedStyle(root);
    const hwDarkVar = (computed.getPropertyValue('--hw-dark') || '').trim();
    const hwDarkHex = hwDarkVar.replace(/^#/, '') || '0a0a12';
    const hdR = parseInt(hwDarkHex.substring(0,2), 16);
    const hdG = parseInt(hwDarkHex.substring(2,4), 16);
    const hdB = parseInt(hwDarkHex.substring(4,6), 16);
    const hwDarkBrightness = (hdR * 299 + hdG * 587 + hdB * 114) / 1000;

    const baseHex = (baseColor || '').replace(/^#/, '') || '000000';
    const bR = parseInt(baseHex.substring(0,2), 16);
    const bG = parseInt(baseHex.substring(2,4), 16);
    const bB = parseInt(baseHex.substring(4,6), 16);
    const baseBrightness = (bR * 299 + bG * 587 + bB * 114) / 1000;

    // If both hw-dark and theme base are dark (low brightness), use secondary for hero title
    let heroColor = (baseBrightness < 80 && hwDarkBrightness < 80) ? secondaryColor : baseColor;
    // Ensure hero color isn't too dark; if so, force white for legibility
    try {
      const heroHexCheck = (heroColor || '#FFFFFF').replace(/^#/, '');
      const hhR = parseInt(heroHexCheck.substring(0,2), 16);
      const hhG = parseInt(heroHexCheck.substring(2,4), 16);
      const hhB = parseInt(heroHexCheck.substring(4,6), 16);
      const heroBrightness = (hhR * 299 + hhG * 587 + hhB * 114) / 1000;
      if (heroBrightness < 40) {
        heroColor = '#FFFFFF';
      }
      const heroHex = (heroColor || '#FFFFFF').replace(/^#/, '');
      const hR = parseInt(heroHex.substring(0,2), 16);
      const hG = parseInt(heroHex.substring(2,4), 16);
      const hB = parseInt(heroHex.substring(4,6), 16);
      root.style.setProperty('--hero-title-color', heroColor);
      root.style.setProperty('--hero-title-rgb', `${hR}, ${hG}, ${hB}`);
    } catch (e) {
      root.style.setProperty('--hero-title-color', '#FFFFFF');
      root.style.setProperty('--hero-title-rgb', `255, 255, 255`);
    }
  } catch (e) {
    // ignore parsing errors
  }
  
  // Update nav elements that use theme colors
  updateNavThemeColors(baseColor, secondaryColor);
}

function adjustBackgroundForDarkTheme(baseColor, faction, secondaryColor) {
  const root = document.documentElement;
  const hwBg = document.querySelector('.hw-bg');

  // --- Parse secondary color for tinting ---
  // If secondary is near-black (brightness < 30), fall back to base color for visible tint
  const secHex = (secondaryColor || baseColor).replace(/^#/, '');
  const secR = parseInt(secHex.substring(0, 2), 16);
  const secG = parseInt(secHex.substring(2, 4), 16);
  const secB = parseInt(secHex.substring(4, 6), 16);
  const secBrightness = (secR * 299 + secG * 587 + secB * 114) / 1000;

  const tintHex = secBrightness < 30 ? baseColor.replace(/^#/, '') : secHex;
  const tR = parseInt(tintHex.substring(0, 2), 16);
  const tG = parseInt(tintHex.substring(2, 4), 16);
  const tB = parseInt(tintHex.substring(4, 6), 16);

  // dark base colors will be derived after parsing the base color

  // --- Parse base color for brightness classification ---
  const baseHex = baseColor.replace(/^#/, '');
  const bR = parseInt(baseHex.substring(0, 2), 16);
  const bG = parseInt(baseHex.substring(2, 4), 16);
  const bB = parseInt(baseHex.substring(4, 6), 16);
  const baseBrightness = (bR * 299 + bG * 587 + bB * 114) / 1000;
  const baseMax = Math.max(bR, bG, bB);
  const baseMin = Math.min(bR, bG, bB);
  const baseSaturation = baseMax === 0 ? 0 : (baseMax - baseMin) / baseMax;
  const isNearWhite = baseBrightness > 210 && baseSaturation < 0.15;

  // --- Derive a very dark version of baseColor for the linear-gradient base ---
  // Clamp to max brightness of ~18 so it stays dark but holds the base hue
  const darkFactor = Math.min(18 / Math.max(bR, bG, bB, 1), 1);
  const d1R = Math.round(bR * darkFactor * 0.5);
  const d1G = Math.round(bG * darkFactor * 0.5);
  const d1B = Math.round(bB * darkFactor * 0.5);
  const d2R = Math.round(bR * darkFactor);
  const d2G = Math.round(bG * darkFactor);
  const d2B = Math.round(bB * darkFactor);
  const toHex2 = n => n.toString(16).padStart(2, '0');
  const darkBase1 = `#${toHex2(d1R)}${toHex2(d1G)}${toHex2(d1B)}`;
  const darkBase2 = `#${toHex2(d2R)}${toHex2(d2G)}${toHex2(d2B)}`;
  const darkBase3 = `#${toHex2(Math.round(d1R*0.7))}${toHex2(Math.round(d1G*0.7))}${toHex2(Math.round(d1B*0.7))}`;

  const forceLightBgFactions = [];
  const forceDarkBgFactions  = ['republic', 'imperial-elite'];

  // Explicit override: `imperial-elite` should be pure black background and all-white text
  if (faction === 'imperial-elite') {
    root.style.setProperty('--hw-dark', '#000000');
    root.style.setProperty('--hw-dark-panel', 'rgba(0, 0, 0, 0.95)');
    root.style.setProperty('--hw-dark-card', 'rgba(0, 0, 0, 0.9)');
    root.style.setProperty('--hw-text', '#FFFFFF');
    root.style.setProperty('--hw-text-dim', '#FFFFFF');
    if (hwBg) {
      hwBg.style.setProperty('background', '#000000', 'important');
    }
    return;
  }

  if (forceLightBgFactions.includes(faction)) {
    // Light-blue base tinted with secondary color radials
    const secNorm = secHex.toLowerCase();
    const hwDarkFromSecondary = (secNorm === '000000') ? '#FFFFFF' : secondaryColor;
    root.style.setProperty('--hw-dark', hwDarkFromSecondary);
    root.style.setProperty('--hw-dark-panel', 'rgba(120, 140, 170, 0.95)');
    root.style.setProperty('--hw-dark-card', 'rgba(105, 125, 155, 0.9)');
    root.style.setProperty('--hw-text', '#050505');
    root.style.setProperty('--hw-text-dim', '#2b3138');
    if (hwBg) {
      const bg = `radial-gradient(ellipse at 30% 20%, rgba(${tR}, ${tG}, ${tB}, 0.25) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(${tR}, ${tG}, ${tB}, 0.15) 0%, transparent 40%), linear-gradient(180deg, #9fc0e6 0%, #7f9ec0 50%, #6b8fb3 100%)`;
      hwBg.style.setProperty('background', bg, 'important');
    }
    return;
  }

  if (forceDarkBgFactions.includes(faction)) {
    // Dark base tinted with secondary color radials
    root.style.setProperty('--hw-dark', '#0A0A12');
    root.style.setProperty('--hw-dark-panel', 'rgba(15, 20, 30, 0.95)');
    root.style.setProperty('--hw-dark-card', 'rgba(12, 18, 28, 0.9)');
    root.style.setProperty('--hw-text', '#E8E8E8');
    root.style.setProperty('--hw-text-dim', '#8899AA');
    if (hwBg) {
      const bg = `radial-gradient(ellipse at 30% 20%, rgba(${tR}, ${tG}, ${tB}, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(${tR}, ${tG}, ${tB}, 0.10) 0%, transparent 40%), linear-gradient(180deg, ${darkBase1} 0%, ${darkBase2} 50%, ${darkBase3} 100%)`;
      hwBg.style.setProperty('background', bg, 'important');
    }
    return;
  }

  if (isNearWhite) {
    // Near-white base (Vaygr white, Republic) - medium gray base tinted with secondary
    root.style.setProperty('--hw-dark', '#9098a8');
    root.style.setProperty('--hw-dark-panel', 'rgba(130, 140, 160, 0.95)');
    root.style.setProperty('--hw-dark-card', 'rgba(115, 125, 145, 0.9)');
    root.style.setProperty('--hw-text', '#0a0a0a');
    root.style.setProperty('--hw-text-dim', '#2a2a3a');
    if (hwBg) {
      const bg = `radial-gradient(ellipse at 30% 20%, rgba(${tR}, ${tG}, ${tB}, 0.30) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(${tR}, ${tG}, ${tB}, 0.22) 0%, transparent 40%), linear-gradient(180deg, #7a8494 0%, #8a94a4 50%, #808a9a 100%)`;
      hwBg.style.setProperty('background', bg, 'important');
    }
  } else {
    // All other factions: dark space base + secondary color radial tint
    root.style.setProperty('--hw-dark', '#0A0A12');
    root.style.setProperty('--hw-dark-panel', 'rgba(15, 20, 30, 0.95)');
    root.style.setProperty('--hw-dark-card', 'rgba(12, 18, 28, 0.9)');
    root.style.setProperty('--hw-text', '#E8E8E8');
    root.style.setProperty('--hw-text-dim', '#8899AA');
    if (hwBg) {
      const bg = `radial-gradient(ellipse at 30% 20%, rgba(${tR}, ${tG}, ${tB}, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(${tR}, ${tG}, ${tB}, 0.10) 0%, transparent 40%), linear-gradient(180deg, ${darkBase1} 0%, ${darkBase2} 50%, ${darkBase3} 100%)`;
      hwBg.style.setProperty('background', bg, 'important');
    }
  }
}

function resetTheme() {
  // Reset to default Hiigaran theme
  document.documentElement.style.setProperty('--theme-base', '#5D8DAA');
  document.documentElement.style.setProperty('--theme-secondary', '#CCCCCC');
  document.documentElement.style.setProperty('--theme-base-rgb', '93, 141, 170');
  document.documentElement.style.setProperty('--theme-secondary-rgb', '204, 204, 204');
  
  // Reset background colors
  document.documentElement.style.setProperty('--hw-dark', '#0A0A12');
  document.documentElement.style.setProperty('--hw-dark-panel', 'rgba(15, 20, 30, 0.95)');
  document.documentElement.style.setProperty('--hw-dark-card', 'rgba(12, 18, 28, 0.9)');
  // Reset text colors
  document.documentElement.style.setProperty('--hw-text', '#E8E8E8');
  document.documentElement.style.setProperty('--hw-text-dim', '#8899AA');
  
  // Reset background to default CSS
  const hwBg = document.querySelector('.hw-bg');
  if (hwBg) {
    const defaultBg = `radial-gradient(ellipse at 30% 20%, rgba(0, 100, 150, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(100, 50, 0, 0.1) 0%, transparent 40%), linear-gradient(180deg, #020208 0%, #0A0A18 50%, #050512 100%)`;
    hwBg.style.setProperty('background', defaultBg, 'important');
  }
  
  updateNavThemeColors('#5D8DAA', '#CCCCCC');
}

function updateNavThemeColors(baseColor, secondaryColor) {
  // Update logo
  const logoIcon = document.querySelector('.hw-nav-logo-icon');
  if (logoIcon) {
    try {
      const root = document.documentElement;
      const computed = getComputedStyle(root);
      const hwDarkVar = (computed.getPropertyValue('--hw-dark') || '').trim() || '#0A0A12';
      const hwDarkHex = hwDarkVar.replace(/^#/, '');
      const hdR = parseInt(hwDarkHex.substring(0,2), 16);
      const hdG = parseInt(hwDarkHex.substring(2,4), 16);
      const hdB = parseInt(hwDarkHex.substring(4,6), 16);
      const hwDarkBrightness = (hdR * 299 + hdG * 587 + hdB * 114) / 1000;

      const baseHex = (baseColor || '').replace(/^#/, '');
      const bR = parseInt(baseHex.substring(0,2), 16);
      const bG = parseInt(baseHex.substring(2,4), 16);
      const bB = parseInt(baseHex.substring(4,6), 16);
      const baseBrightness = (bR * 299 + bG * 587 + bB * 114) / 1000;

      let useColor = (baseBrightness < 80 && hwDarkBrightness < 80) ? (secondaryColor || baseColor) : baseColor;
      // Force white if computed color is too dark for legibility
      try {
        const useHex = (useColor || '#FFFFFF').replace(/^#/, '');
        const uR = parseInt(useHex.substring(0,2), 16);
        const uG = parseInt(useHex.substring(2,4), 16);
        const uB = parseInt(useHex.substring(4,6), 16);
        const useBrightness = (uR * 299 + uG * 587 + uB * 114) / 1000;
        if (useBrightness < 40) useColor = '#FFFFFF';
        // expose CSS variables for nav logo
        root.style.setProperty('--nav-logo-color', useColor);
        root.style.setProperty('--nav-logo-rgb', `${useColor.replace(/^#/, '') ? parseInt(useColor.replace(/^#/, '').substring(0,2),16) : 255}, ${useColor.replace(/^#/, '') ? parseInt(useColor.replace(/^#/, '').substring(2,4),16) : 255}, ${useColor.replace(/^#/, '') ? parseInt(useColor.replace(/^#/, '').substring(4,6),16) : 255}`);
      } catch (e) {
        useColor = useColor || '#FFFFFF';
        root.style.setProperty('--nav-logo-color', useColor);
        root.style.setProperty('--nav-logo-rgb', `255, 255, 255`);
      }
      logoIcon.style.background = `linear-gradient(135deg, ${useColor}, ${adjustColor(useColor, -30)})`;
    } catch (e) {
      logoIcon.style.background = `linear-gradient(135deg, ${baseColor}, ${adjustColor(baseColor, -30)})`;
    }
  }
  
  // Update logo text
  const logoText = document.querySelector('.hw-nav-logo');
  if (logoText) {
    try {
      const root = document.documentElement;
      const computed = getComputedStyle(root);
      const hwDarkVar = (computed.getPropertyValue('--hw-dark') || '').trim() || '#0A0A12';
      const hwDarkHex = hwDarkVar.replace(/^#/, '');
      const hdR = parseInt(hwDarkHex.substring(0,2), 16);
      const hdG = parseInt(hwDarkHex.substring(2,4), 16);
      const hdB = parseInt(hwDarkHex.substring(4,6), 16);
      const hwDarkBrightness = (hdR * 299 + hdG * 587 + hdB * 114) / 1000;

      const baseHex = (baseColor || '').replace(/^#/, '');
      const bR = parseInt(baseHex.substring(0,2), 16);
      const bG = parseInt(baseHex.substring(2,4), 16);
      const bB = parseInt(baseHex.substring(4,6), 16);
      const baseBrightness = (bR * 299 + bG * 587 + bB * 114) / 1000;

      let useColor = (baseBrightness < 80 && hwDarkBrightness < 80) ? (secondaryColor || baseColor) : baseColor;
      try {
        const useHex = (useColor || '#FFFFFF').replace(/^#/, '');
        const uR = parseInt(useHex.substring(0,2), 16);
        const uG = parseInt(useHex.substring(2,4), 16);
        const uB = parseInt(useHex.substring(4,6), 16);
        const useBrightness = (uR * 299 + uG * 587 + uB * 114) / 1000;
        if (useBrightness < 40) useColor = '#FFFFFF';
        logoText.style.color = useColor;
        logoText.style.textShadow = `0 0 10px rgba(${hexToRgb(useColor)}, 0.5)`;
        // also expose nav logo color variables (defensive)
        root.style.setProperty('--nav-logo-color', useColor);
        root.style.setProperty('--nav-logo-rgb', `${uR}, ${uG}, ${uB}`);
      } catch (e) {
        logoText.style.color = '#FFFFFF';
        logoText.style.textShadow = `0 0 10px rgba(255, 255, 255, 0.5)`;
        root.style.setProperty('--nav-logo-color', '#FFFFFF');
        root.style.setProperty('--nav-logo-rgb', `255, 255, 255`);
      }
    } catch (e) {
      logoText.style.color = baseColor;
      logoText.style.textShadow = `0 0 10px rgba(${hexToRgb(baseColor)}, 0.5)`;
    }
  }
}

function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
}

function adjustColor(hex, amount) {
  // Remove leading # if present
  hex = (hex || '').replace(/^#/, '');
  if (hex.length < 6) hex = hex.padEnd(6, '0');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return '#000000';
  }
  
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/* === SCROLL PROGRESS BAR === */
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'hw-scroll-progress';
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  }, { passive: true });
}

/* === BACK TO TOP BUTTON === */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'hw-back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '▲';
  document.body.appendChild(btn);
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
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
  
  // Handle special formats like "8.3/10"
  if (text.includes('/')) {
    const parts = text.split('/');
    const target = parseFloat(parts[0]);
    const denom = parts[1];
    let current = 0;
    const duration = 1500;
    const startTime = performance.now();
    
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      current = (target * eased).toFixed(1);
      el.textContent = current + '/' + denom;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    return;
  }
  
  const target = parseInt(numStr.replace(/,/g, ''), 10);
  if (isNaN(target)) return;
  
  let current = 0;
  const duration = 1500;
  const startTime = performance.now();
  
  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    current = Math.round(target * eased);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* === MODDB RSS FEEDS (Gallery + Articles) === */
async function fetchWithCorsFallback(url) {
  try {
    const res = await fetch(url);
    if (res.ok) return await res.text();
    throw new Error('Direct fetch failed');
  } catch (err) {
    // Try AllOrigins proxy as a CORS fallback
    try {
      const proxy = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);
      const pres = await fetch(proxy);
      if (pres.ok) return await pres.text();
      throw new Error('Proxy fetch failed');
    } catch (e) {
      console.warn('RSS fetch failed for', url, err, e);
      return null;
    }
  }
}

async function fetchRssCached(url, ttlMs = 3600000) {
  try {
    const key = 'rsscache:' + url;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.ts && (Date.now() - parsed.ts) < ttlMs && parsed.text) {
          return parsed.text;
        }
      } catch (e) {
        // fall through to fetch
      }
    }

    const text = await fetchWithCorsFallback(url);
    if (text) {
      try {
        localStorage.setItem(key, JSON.stringify({ ts: Date.now(), text }));
      } catch (e) {
        // ignore localStorage quota errors
      }
    }
    return text;
  } catch (e) {
    console.warn('fetchRssCached error', e);
    return await fetchWithCorsFallback(url);
  }
}

function parseRSS(xmlText) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');
    return doc;
  } catch (e) {
    return null;
  }
}

function formatPubDate(pubDateStr) {
  try {
    const d = new Date(pubDateStr);
    if (isNaN(d)) return pubDateStr;
    const opts = { day: '2-digit', month: 'short', year: 'numeric' };
    return d.toLocaleDateString(undefined, opts);
  } catch (e) {
    return pubDateStr;
  }
}

async function updateGalleryFromRSS(rssUrl, limit = 8) {
  const text = await fetchRssCached(rssUrl, 60 * 60 * 1000);
  if (!text) return;
  const doc = parseRSS(text);
  if (!doc) return;

  const items = Array.from(doc.querySelectorAll('item'));
  if (!items.length) return;

  const container = document.querySelector('.hw-gallery');
  if (!container) return;

  // Build new gallery HTML
  const nodes = [];
  for (let i = 0; i < Math.min(limit, items.length); i++) {
    const it = items[i];
    // Prefer media:content url, fallback to enclosure or thumbnail in description
    let imgUrl = '';
    const media = it.querySelector('media\\:content, content');
    if (media && media.getAttribute('url')) imgUrl = media.getAttribute('url');
    if (!imgUrl) {
      const enclosure = it.querySelector('enclosure');
      if (enclosure && enclosure.getAttribute('url')) imgUrl = enclosure.getAttribute('url');
    }
    if (!imgUrl) {
      // Try to extract from description img src
      const desc = it.querySelector('description');
      if (desc && desc.textContent) {
        const m = desc.textContent.match(/src=\"([^\"]+)\"/i);
        if (m) imgUrl = m[1];
      }
    }

    const title = it.querySelector('title') ? it.querySelector('title').textContent.trim() : 'Image';
    if (!imgUrl) continue;

    const itemEl = document.createElement('div');
    itemEl.className = 'hw-gallery-item';
    itemEl.innerHTML = `
      <img src="${imgUrl}" alt="${escapeHtml(title)}">
      <div class="hw-gallery-overlay">${escapeHtml(title)}</div>
    `;
    nodes.push(itemEl);
  }

  // Replace existing items
  container.innerHTML = '';
  nodes.forEach(n => container.appendChild(n));
  // Re-initialize gallery click handlers
  initGallery();
}

async function updateArticlesFromRSS(rssUrl, limit = 3) {
  const text = await fetchRssCached(rssUrl, 60 * 60 * 1000);
  if (!text) return;
  const doc = parseRSS(text);
  if (!doc) return;

  const items = Array.from(doc.querySelectorAll('item'));
  if (!items.length) return;

  // Find the Latest News panel ul
  const panels = Array.from(document.querySelectorAll('.hw-panel'));
  const newsPanel = panels.find(p => p.querySelector('h4') && /Latest News/i.test(p.querySelector('h4').textContent));
  let listEl = newsPanel ? newsPanel.querySelector('ul') : null;
  if (!listEl) return;

  listEl.innerHTML = '';
  for (let i = 0; i < Math.min(limit, items.length); i++) {
    const it = items[i];
    const title = it.querySelector('title') ? it.querySelector('title').textContent.trim() : 'Article';
    const link = it.querySelector('link') ? it.querySelector('link').textContent.trim() : '#';
    const pubDate = it.querySelector('pubDate') ? it.querySelector('pubDate').textContent.trim() : '';

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = link;
    a.target = '_blank';
    a.style.cssText = 'display: flex; justify-content: space-between; font-size: var(--text-sm);';
    a.innerHTML = `<span>${escapeHtml(title)}</span><span class="text-dim">${escapeHtml(formatPubDate(pubDate))}</span>`;
    li.appendChild(a);
    listEl.appendChild(li);
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&"'<>]/g, (s) => ({'&':'&amp;','"':'&quot;',"'":"&#39;",'<':'&lt;','>':'&gt;'})[s]);
}

async function initModDBFeeds() {
  // Feeds
  const imagesFeed = 'https://rss.moddb.com/mods/homeworld-rise-of-hiigara/images/feed/rss.xml';
  const articlesFeed = 'https://rss.moddb.com/mods/homeworld-rise-of-hiigara/articles/feed/rss.xml';

  // Try update; do not block page if fails
  updateGalleryFromRSS(imagesFeed, 8).catch(e => console.warn('Gallery RSS update failed', e));
  updateArticlesFromRSS(articlesFeed, 3).catch(e => console.warn('Articles RSS update failed', e));
}
