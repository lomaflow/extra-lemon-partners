// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Nav background on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Generic reveal-on-scroll
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// Signature moment: predictability line morph (random -> smooth)
const predictability = document.getElementById('predictability');
if (predictability) {
  const predictObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        predictability.classList.add('in-view');
        predictObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  predictObserver.observe(predictability);
}

// Timeline progress fill tied to scroll position within the section
const timelineFill = document.getElementById('timeline-fill');
const timelineSection = document.querySelector('.process');
if (timelineFill && timelineSection) {
  const updateTimeline = () => {
    const rect = timelineSection.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height + vh * 0.5;
    const progressed = vh - rect.top;
    const pct = Math.min(1, Math.max(0, progressed / total));
    timelineFill.style.height = (pct * 100) + '%';
  };
  window.addEventListener('scroll', updateTimeline, { passive: true });
  window.addEventListener('resize', updateTimeline);
  updateTimeline();
}

// Ambient hero canvas: slow-drifting soft gradient blobs
(function heroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  const blobs = [
    { x: 0.25, y: 0.35, r: 260, dx: 0.00012, dy: 0.00009, t: 0 },
    { x: 0.7, y: 0.55, r: 220, dx: -0.00010, dy: 0.00013, t: 100 },
    { x: 0.5, y: 0.2, r: 180, dx: 0.00008, dy: -0.00011, t: 200 },
  ];

  function draw(time) {
    ctx.clearRect(0, 0, w, h);
    blobs.forEach(b => {
      const x = (b.x + Math.sin(time * b.dx + b.t) * 0.06) * w;
      const y = (b.y + Math.cos(time * b.dy + b.t) * 0.06) * h;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, b.r);
      grad.addColorStop(0, 'rgba(255,193,7,0.10)');
      grad.addColorStop(1, 'rgba(255,193,7,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });
    if (!prefersReducedMotion) requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
