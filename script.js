/* ===================================================================
   EXTRA LEMON — PARTNER PROGRAM
   Vanilla JS: nav state, mobile menu, scroll reveal,
   timeline progress, and FAQ accordion.
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav background on scroll ---------- */
  const nav = document.getElementById('nav');
  const setNavState = () => {
    if (window.scrollY > 12) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  };
  setNavState();
  window.addEventListener('scroll', setNavState, { passive: true });

  /* ---------- Mobile menu toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu after clicking a link
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll reveal for sections ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: no IntersectionObserver support
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Timeline scroll animation ---------- */
  const timeline = document.getElementById('timeline');
  const timelineFill = document.getElementById('timelineFill');
  const timelineItems = timeline ? Array.from(timeline.querySelectorAll('.timeline__item')) : [];

  if (timeline && timelineItems.length) {

    // Activate each step as it enters the viewport
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-active');
        }
      });
    }, { threshold: 0.5, rootMargin: '0px 0px -20% 0px' });

    timelineItems.forEach((item) => stepObserver.observe(item));

    // Fill the vertical line proportionally to scroll progress through the timeline
    const updateTimelineFill = () => {
      const rect = timeline.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // progress: 0 when timeline top hits bottom of viewport, 1 when timeline bottom hits top
      const total = rect.height + viewportH * 0.5;
      const progressed = viewportH * 0.75 - rect.top;
      let progress = progressed / total;
      progress = Math.max(0, Math.min(1, progress));

      timelineFill.style.height = (progress * 100) + '%';
    };

    updateTimelineFill();
    window.addEventListener('scroll', updateTimelineFill, { passive: true });
    window.addEventListener('resize', updateTimelineFill);
  }

  /* ---------- FAQ accordion (single item open) ---------- */
  const accordion = document.getElementById('accordion');

  if (accordion) {
    const triggers = Array.from(accordion.querySelectorAll('.accordion__trigger'));

    const closeItem = (trigger) => {
      const panel = trigger.nextElementSibling;
      trigger.setAttribute('aria-expanded', 'false');
      panel.style.maxHeight = null;
    };

    const openItem = (trigger) => {
      const panel = trigger.nextElementSibling;
      trigger.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';

        // Close any other open item
        triggers.forEach((t) => { if (t !== trigger) closeItem(t); });

        if (isOpen) {
          closeItem(trigger);
        } else {
          openItem(trigger);
        }
      });
    });
  }

});
