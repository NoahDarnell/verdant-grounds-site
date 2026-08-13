gsap.registerPlugin(ScrollTrigger);

/* ---------- Loader ---------- */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('done'), 400);
});

/* ---------- Year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Nav scroll state ---------- */
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 'top -60',
  end: 99999,
  toggleClass: { targets: nav, className: 'scrolled' }
});

/* ---------- Mobile menu ---------- */
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

/* ---------- Scroll progress bar ---------- */
gsap.to('#progressBar', {
  width: '100%',
  ease: 'none',
  scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
});

/* ---------- Floating leaves in hero ---------- */
const leafContainer = document.getElementById('floatingLeaves');
const leafEmojis = ['🍃', '🌿', '🍀'];
for (let i = 0; i < 14; i++) {
  const leaf = document.createElement('span');
  leaf.className = 'leaf';
  leaf.textContent = leafEmojis[i % leafEmojis.length];
  leaf.style.left = Math.random() * 100 + '%';
  leaf.style.animationDuration = (10 + Math.random() * 12) + 's';
  leaf.style.animationDelay = (Math.random() * -20) + 's';
  leaf.style.fontSize = (0.9 + Math.random() * 1.1) + 'rem';
  leafContainer.appendChild(leaf);
}

/* ---------- Hero entrance timeline ---------- */
const heroTl = gsap.timeline({ delay: 0.6 });
heroTl
  .to('.hero-title .reveal-line span', {
    y: 0, duration: 1.1, ease: 'power4.out', stagger: 0.12
  })
  .to('.hero .eyebrow.reveal-up', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.9')
  .to('.hero-sub.reveal-up', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.7')
  .to('.hero-cta.reveal-up', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');

/* ---------- Parallax blobs ---------- */
gsap.to('.blob-1', { y: 120, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
gsap.to('.blob-2', { y: -80, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
gsap.to('.blob-3', { y: 160, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

/* ---------- Generic reveal-up on scroll ---------- */
gsap.utils.toArray('.reveal-up').forEach((el) => {
  if (el.closest('.hero')) return; // hero handled by its own timeline
  gsap.to(el, {
    opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%' }
  });
});

/* ---------- Stagger service cards ---------- */
gsap.utils.toArray('.service-card').forEach((card, i) => {
  gsap.to(card, {
    opacity: 1, y: 0, duration: 0.8, delay: (i % 3) * 0.08, ease: 'power3.out',
    scrollTrigger: { trigger: card, start: 'top 90%' }
  });
});

/* ---------- Tilt effect on service cards ---------- */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, { rotateX: y * -8, rotateY: x * 8, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
  });
});

/* ---------- Stat counters ---------- */
document.querySelectorAll('.stat').forEach(stat => {
  const target = parseInt(stat.dataset.count, 10);
  const numEl = stat.querySelector('.num');
  const counter = { val: 0 };
  ScrollTrigger.create({
    trigger: stat,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to(counter, {
        val: target, duration: 1.6, ease: 'power2.out',
        onUpdate: () => numEl.textContent = Math.round(counter.val)
      });
    }
  });
});

/* ---------- Before/after sliders ---------- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('[data-ba]').forEach((slider) => {
  const frame = slider.querySelector('.ba-frame');
  let dragging = false;

  const setPos = (pct) => {
    const clamped = Math.min(96, Math.max(4, pct));
    frame.style.setProperty('--ba-pos', clamped + '%');
    frame.setAttribute('aria-valuenow', Math.round(clamped));
  };

  const posFromClientX = (clientX) => {
    const rect = frame.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  };

  frame.addEventListener('pointerdown', (e) => {
    dragging = true;
    frame.setPointerCapture(e.pointerId);
    setPos(posFromClientX(e.clientX));
  });
  frame.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    setPos(posFromClientX(e.clientX));
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(evt =>
    frame.addEventListener(evt, () => { dragging = false; })
  );
  frame.addEventListener('keydown', (e) => {
    const current = parseFloat(getComputedStyle(frame).getPropertyValue('--ba-pos')) || 50;
    if (e.key === 'ArrowLeft') { setPos(current - 5); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setPos(current + 5); e.preventDefault(); }
  });

  // One-time nudge on scroll-in so the drag affordance is discoverable
  if (!prefersReducedMotion) {
    ScrollTrigger.create({
      trigger: slider,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.fromTo(frame, { '--ba-pos': '50%' }, {
          '--ba-pos': '34%', duration: 0.85, ease: 'power2.inOut', yoyo: true, repeat: 1,
          onUpdate: () => {
            const v = parseFloat(getComputedStyle(frame).getPropertyValue('--ba-pos'));
            frame.setAttribute('aria-valuenow', Math.round(v));
          }
        });
      }
    });
  }
});

/* ---------- FAQ accordion ---------- */
document.querySelectorAll('.faq-q').forEach((btn) => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
  });
});

/* ---------- Gallery items stagger ---------- */
gsap.utils.toArray('.gallery-item').forEach((item, i) => {
  gsap.to(item, {
    opacity: 1, y: 0, duration: 0.9, delay: (i % 4) * 0.06, ease: 'power3.out',
    scrollTrigger: { trigger: item, start: 'top 92%' }
  });
});

/* ---------- Timeline fill ---------- */
gsap.to('.timeline-line-fill', {
  height: '100%', ease: 'none',
  scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 80%', scrub: 0.5 }
});
gsap.utils.toArray('.timeline-dot').forEach(dot => {
  gsap.fromTo(dot, { scale: 0.6, opacity: 0.4 }, {
    scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)',
    scrollTrigger: { trigger: dot, start: 'top 80%' }
  });
});

/* ---------- Testimonials auto-scroll marquee-drag ---------- */
const track = document.getElementById('testimonialTrack');
if (track) {
  const clone = track.innerHTML;
  track.innerHTML += clone; // seamless loop
  let autoScroll = gsap.to(track, {
    x: () => -(track.scrollWidth / 2),
    duration: 28,
    ease: 'none',
    repeat: -1
  });
  track.addEventListener('mouseenter', () => autoScroll.pause());
  track.addEventListener('mouseleave', () => autoScroll.resume());
}

/* ---------- Contact form (demo only, no backend) ---------- */
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formNote.textContent = 'Thanks! This is a demo form, no message was actually sent.';
  gsap.fromTo(formNote, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5 });
  contactForm.reset();
});
