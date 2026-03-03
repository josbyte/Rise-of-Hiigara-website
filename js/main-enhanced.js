/* =========================================
   HOMEWORLD 2 INTERFACE - Enhanced JavaScript
   Faithful HW2 UI interactions + Accessibility
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavigation();
  initScrollEffects();
  initGallery();
  initThemeSelector();
  initModDBFeeds();
  initAccessibility();
});

/* === ACCESSIBILITY INITIALIZATION === */
function initAccessibility() {
  // Ensure all images have alt text
  document.querySelectorAll('img:not([alt])').forEach(img => {
    img.setAttribute('alt', 'Image');
  });

  // Keyboard navigation for gallery
  document.querySelectorAll('.hw-gallery-item').forEach((item, index) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    
    item.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        item.click();
      }
    });
  });

  // Improve button contrast
  document.querySelectorAll('.hw-btn').forEach(btn => {
    btn.setAttribute('role', 'button');
  });

  // Add ARIA labels to interactive sections
  document.querySelectorAll('section').forEach(section => {
    if (!section.hasAttribute('aria-labelledby')) {
      const heading = section.querySelector('h1, h2, h3, h4');
      if (heading && heading.id) {
        section.setAttribute('aria-labelledby', heading.id);
      }
    }
  });
}

/* === PARTICLES EFFECT === */
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.setAttribute('aria-hidden', 'true');
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
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });
    
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
  const toggle = document.querySelector('.hw-nav-toggle');
  const links = document.querySelector('.hw-nav-links');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.background = 'rgba(10, 10, 18, 0.98)';
    } else {
      nav.style.background = 'linear-gradient(180deg, rgba(10,10,18,0.98) 0%, rgba(10,10,18,0.9) 100%)';
    }
  });
  
  // Mobile menu toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
      links.classList.toggle('active');
    });

    // Close menu when link clicked
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('active');
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
            link.setAttribute('aria-current', 'page');
          } else {
            link.removeAttribute('aria-current');
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
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.hw-feature, .hw-gallery-item, .hw-download-card, .hw-stat').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
  
  // Add reveal CSS
  const style = document.createElement('style');
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(25px);
      transition: opacity 0.5s ease, transform 0.5s ease;
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
  // Gallery interaction (lightbox can be added here later)
  document.querySelectorAll('.hw-gallery-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.hw-gallery-overlay').textContent;
      console.log('Gallery item clicked:', title);
      // Future: Open lightbox
    });
  });
}

/* === THEME SELECTOR === */
function initThemeSelector() {
  const select = document.getElementById('faction-select');
  
  if (!select) return;
  
  // Load saved faction
  const saved = localStorage.getItem('hw-faction');
  if (saved) {
    select.value = saved;
    applyTheme(select);
  }
  
  select.addEventListener('change', () => {
    applyTheme(select);
    localStorage.setItem('hw-faction', select.value);
  });
  
  function applyTheme(selectElement) {
    const option = selectElement.options[selectElement.selectedIndex];
    const base = option.getAttribute('data-base') || '#8E9FA1';
    const secondary = option.getAttribute('data-secondary') || '#FFFFFF';
    
    // Parse RGB values for glow effects
    const rgbBase = hexToRgb(base);
    
    // Apply CSS variables
    document.documentElement.style.setProperty('--theme-base', base);
    document.documentElement.style.setProperty('--theme-secondary', secondary);
    document.documentElement.style.setProperty('--theme-base-rgb', `${rgbBase.r}, ${rgbBase.g}, ${rgbBase.b}`);
    
    // Update button CSS variables
    document.documentElement.style.setProperty('--btn-color-rgb', `${rgbBase.r}, ${rgbBase.g}, ${rgbBase.b}`);
  }
  
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }
}

/* === MODDB FEEDS === */
function initModDBFeeds() {
  // ModDB feed integration can be added here
  console.log('ModDB feeds initialized');
}
