/**
 * ALEX MERCER — Digital Marketing Portfolio
 * script.js — All Animations, Interactions & Logic
 */

'use strict';

/* ============================================================
   UTILITY HELPERS
   ============================================================ */

/** Shorthand querySelector */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/** Clamp a number between min and max */
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/** Easing function: ease-out cubic */
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

/** requestAnimationFrame-based counter animation */
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  function step(now) {
    const elapsed = now - start;
    const progress = clamp(elapsed / duration, 0, 1);
    const eased = easeOutCubic(progress);
    const current = eased * target;
    el.textContent = isFloat ? current.toFixed(1) : Math.round(current);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

/* ============================================================
   1. LOADING SCREEN
   ============================================================ */
(function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  document.body.classList.add('loading');

  // After progress bar finishes (~1.9s), hide loader
  setTimeout(() => {
    loader.classList.add('hide');
    document.body.classList.remove('loading');
    // Trigger hero animations
    setTimeout(triggerHeroAnimations, 200);
  }, 2000);
})();

/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const dot  = $('#cursor-dot');
  const ring = $('#cursor-ring');
  if (!dot || !ring) return;

  // Only on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot follows instantly
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
  });

  // Ring follows with lag (RAF loop)
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state on interactive elements
  const hoverTargets = 'a, button, .service-card, .portfolio-card, .filter-btn, .blog-card, .cert-card, .stat-card, .result-card';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      ring.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      ring.classList.remove('cursor-hover');
    }
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

/* ============================================================
   3. MAGNETIC BUTTONS
   ============================================================ */
(function initMagnetic() {
  const STRENGTH = 0.3;

  $$('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * STRENGTH;
      const dy   = (e.clientY - cy) * STRENGTH;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0)';
      el.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
    });

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform 0.1s linear';
    });
  });
})();

/* ============================================================
   4. STICKY NAVBAR
   ============================================================ */
(function initNavbar() {
  const nav = $('#navbar');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ============================================================
   5. MOBILE NAV
   ============================================================ */
(function initMobileNav() {
  const btn    = $('#hamburger');
  const drawer = $('#mobileNav');
  if (!btn || !drawer) return;

  btn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  $$('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ============================================================
   6. HERO ANIMATIONS (triggered after loader)
   ============================================================ */
function triggerHeroAnimations() {
  const elements = $$('.reveal-up, .reveal-right');

  elements.forEach((el, i) => {
    const delay = i * 120;
    setTimeout(() => {
      el.style.transition = `opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}ms`;
      el.style.opacity    = '1';
      el.style.transform  = 'translate(0,0)';
    }, 100 + delay);
  });
}

/* ============================================================
   7. TYPING EFFECT
   ============================================================ */
(function initTyping() {
  const el = $('#typedText');
  if (!el) return;

  const words  = ['Digital Marketer', 'Social Media Strategist', 'Performance Marketer', 'SEO Specialist'];
  let wordIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  const TYPE_SPEED   = 85;
  const DELETE_SPEED = 45;
  const PAUSE_END    = 2000;
  const PAUSE_START  = 300;

  function type() {
    const current = words[wordIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, PAUSE_END);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
        setTimeout(type, PAUSE_START);
        return;
      }
    }

    setTimeout(type, deleting ? DELETE_SPEED : TYPE_SPEED);
  }

  // Start after loader clears
  setTimeout(type, 2400);
})();

/* ============================================================
   8. INTERSECTION OBSERVER — Fade up sections
   ============================================================ */
(function initScrollAnimations() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el    = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => el.classList.add('in-view'), delay);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  $$('.fade-up').forEach((el, i) => {
    // Stagger children inside same section
    el.style.transitionDelay = (el.dataset.delay ? el.dataset.delay + 'ms' : '0ms');
    observer.observe(el);
  });
})();

/* ============================================================
   9. ANIMATED COUNTERS
   ============================================================ */
(function initCounters() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.target, 10);
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.4 }
  );

  $$('.counter').forEach(el => observer.observe(el));
})();

/* ============================================================
   10. SKILL PROGRESS BARS
   ============================================================ */
(function initSkillBars() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $$('.skill-fill', entry.target.closest('#skills') || document).forEach(fill => {
            const w = fill.dataset.width + '%';
            setTimeout(() => { fill.style.width = w; }, 200);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const skillsSection = $('#skills');
  if (skillsSection) observer.observe(skillsSection);
})();

/* ============================================================
   11. PORTFOLIO FILTER
   ============================================================ */
(function initPortfolioFilter() {
  const btns  = $$('.filter-btn');
  const cards = $$('.portfolio-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;

        if (match) {
          card.classList.remove('hidden');
          card.style.opacity   = '0';
          card.style.transform = 'translateY(20px)';
          // Re-animate in
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity    = '1';
              card.style.transform  = 'translateY(0)';
            });
          });
        } else {
          card.style.opacity   = '0';
          card.style.transform = 'translateY(10px)';
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          setTimeout(() => card.classList.add('hidden'), 300);
        }
      });
    });
  });
})();

/* ============================================================
   12. TESTIMONIAL SLIDER
   ============================================================ */
(function initTestimonialSlider() {
  const track  = $('#testimonialTrack');
  const prevBtn= $('#sliderPrev');
  const nextBtn= $('#sliderNext');
  const dotsEl = $('#sliderDots');
  if (!track) return;

  const cards  = $$('.testimonial-card', track);
  const total  = cards.length;
  let current  = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    $$('.slider-dot', dotsEl).forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  nextBtn && nextBtn.addEventListener('click', () => { clearInterval(autoTimer); next(); startAuto(); });
  prevBtn && prevBtn.addEventListener('click', () => { clearInterval(autoTimer); prev(); startAuto(); });

  function startAuto() {
    autoTimer = setInterval(next, 5000);
  }
  startAuto();

  // Swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      clearInterval(autoTimer);
      diff > 0 ? next() : prev();
      startAuto();
    }
  });
})();

/* ============================================================
   13. CONTACT FORM VALIDATION
   ============================================================ */
(function initContactForm() {
  const form       = $('#contactForm');
  const successMsg = $('#formSuccess');
  if (!form) return;

  const rules = {
    name:    { required: true, minLength: 2,  msg: 'Please enter your full name (min 2 chars).' },
    email:   { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Please enter a valid email address.' },
    message: { required: true, minLength: 10, msg: 'Please write a message (min 10 characters).' },
  };

  function validateField(name, value) {
    const rule = rules[name];
    if (!rule) return null;
    if (rule.required && !value.trim()) return rule.msg;
    if (rule.minLength && value.trim().length < rule.minLength) return rule.msg;
    if (rule.pattern && !rule.pattern.test(value.trim())) return rule.msg;
    return null;
  }

  function showError(fieldId, msg) {
    const input = $('#' + fieldId);
    const error = $('#' + fieldId + 'Error');
    if (input) input.classList.toggle('error', !!msg);
    if (error) error.textContent = msg || '';
  }

  // Live validation on blur
  Object.keys(rules).forEach(name => {
    const input = form.elements[name];
    if (!input) return;
    input.addEventListener('blur', () => {
      showError(name, validateField(name, input.value));
    });
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        showError(name, validateField(name, input.value));
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    Object.keys(rules).forEach(name => {
      const input = form.elements[name];
      if (!input) return;
      const err = validateField(name, input.value);
      showError(name, err);
      if (err) valid = false;
    });

    if (!valid) return;

    // Simulate submission
    const btn  = $('#submitText');
    btn.textContent = 'Sending...';
    form.querySelector('.form-submit').disabled = true;

    setTimeout(() => {
      successMsg.classList.add('show');
      form.reset();
      btn.textContent = 'Send Message';
      form.querySelector('.form-submit').disabled = false;
      // Hide success message after 5s
      setTimeout(() => successMsg.classList.remove('show'), 5000);
    }, 1200);
  });
})();

/* ============================================================
   14. SMOOTH SCROLL (for all anchor links)
   ============================================================ */
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = $(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // navbar height
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

/* ============================================================
   15. BACK TO TOP BUTTON
   ============================================================ */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   16. PARALLAX — hero blobs & grid on mouse move
   ============================================================ */
(function initParallax() {
  const hero = $('#hero');
  if (!hero) return;

  const blobs = $$('.blob', hero);
  const grid  = $('.hero-grid', hero);

  document.addEventListener('mousemove', e => {
    if (!hero.contains(document.elementFromPoint(e.clientX, e.clientY)) &&
        window.scrollY > window.innerHeight) return;

    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const rx = (e.clientX - cx) / cx; // -1 to 1
    const ry = (e.clientY - cy) / cy;

    blobs.forEach((blob, i) => {
      const depth = (i + 1) * 8;
      blob.style.transform = `translate(${rx * depth}px, ${ry * depth}px) scale(1)`;
    });

    if (grid) {
      grid.style.transform = `translate(${rx * 4}px, ${ry * 4}px)`;
    }
  });
})();

/* ============================================================
   17. SECTION ACTIVE NAV LINK HIGHLIGHT
   ============================================================ */
(function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('#navbar .nav-links a');
  if (!navLinks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            const href = link.getAttribute('href').slice(1);
            link.style.color = href === entry.target.id ? 'var(--accent)' : '';
          });
        }
      });
    },
    { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' }
  );

  sections.forEach(s => observer.observe(s));
})();

/* ============================================================
   18. CARD TILT EFFECT (subtle 3D tilt on hover)
   ============================================================ */
(function initCardTilt() {
  const INTENSITY = 8; // degrees max

  $$('.service-card, .result-card, .cert-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);

      card.style.transform = `perspective(600px) rotateY(${dx * INTENSITY}deg) rotateX(${-dy * INTENSITY}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform  = 'perspective(600px) rotateY(0) rotateX(0) translateZ(0)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.08s linear';
    });
  });
})();

/* ============================================================
   19. TEXT REVEAL — split-letter animation for section titles
   ============================================================ */
(function initTextReveal() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateTitleChars(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  $$('.section-title').forEach(el => observer.observe(el));

  function animateTitleChars(el) {
    // Store original HTML (with <em>) and restore after splitting
    const orig = el.innerHTML;

    // Wrap each text-node character in a span
    function wrapTextNodes(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        [...node.textContent].forEach((ch, i) => {
          const span = document.createElement('span');
          span.textContent = ch === ' ' ? '\u00A0' : ch;
          span.style.cssText = `
            display:inline-block;
            opacity:0;
            transform:translateY(20px);
            transition:opacity 0.5s ease, transform 0.5s ease;
            transition-delay:${i * 25}ms;
          `;
          frag.appendChild(span);
        });
        return frag;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(false);
        [...node.childNodes].forEach(child => clone.appendChild(wrapTextNodes(child)));
        return clone;
      }
      return node.cloneNode(true);
    }

    const frag = document.createDocumentFragment();
    [...el.childNodes].forEach(child => frag.appendChild(wrapTextNodes(child)));
    el.innerHTML = '';
    el.appendChild(frag);

    // Trigger animation
    requestAnimationFrame(() => {
      $$('span', el).forEach(span => {
        span.style.opacity   = '1';
        span.style.transform = 'translateY(0)';
      });
    });
  }
})();

/* ============================================================
   20. FLOATING BADGE PARALLAX (hero badges on scroll)
   ============================================================ */
(function initBadgeParallax() {
  const badges = $$('.hero-badge');
  if (!badges.length) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    badges.forEach((badge, i) => {
      const speed = 0.05 + i * 0.02;
      badge.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }, { passive: true });
})();

/* ============================================================
   21. PAGE VISIBILITY — pause slider & animations when hidden
   ============================================================ */
document.addEventListener('visibilitychange', () => {
  // Pause auto-play in slider handled by interval already; 
  // additional battery-saving logic can go here if needed.
});

/* ============================================================
   INIT LOG
   ============================================================ */
console.log('%c Alex Mercer Portfolio ', 'background:#C8A96B;color:#0F0F0F;font-weight:bold;padding:4px 12px;border-radius:4px;');
console.log('%c Built with precision, not templates. ', 'color:#C8A96B;font-size:11px;');
