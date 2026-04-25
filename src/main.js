/**
 * main.js — Entry point. Initialises all section modules.
 */
import { initAnimation } from './animation.js';
import { initNav }       from './nav.js';
import { initProjects }  from './projects.js';
import { initChat }      from './chat.js';
import { initNeuralMap } from './neuralmap.js?v=38';

document.addEventListener('DOMContentLoaded', () => {
  // initAnimation() — replaced by Vanta NET global background
  initNav();
  initProjects();
  initChat();
  initNeuralMap();
  initScrollReveal();
  initContactForm();
  initDimMode();
});

// ── Dim mode toggle ───────────────────────────────────────────────────────────
function initDimMode() {
  const btn  = document.getElementById('dim-toggle');
  const moon = document.getElementById('dim-icon-moon');
  const sun  = document.getElementById('dim-icon-sun');
  if (!btn) return;

  if (localStorage.getItem('lightMode') === 'on') {
    document.body.classList.add('light-mode');
    moon.classList.add('hidden');
    sun.classList.remove('hidden');
    updateVantaColors(true);
  }

  btn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    moon.classList.toggle('hidden', isLight);
    sun.classList.toggle('hidden', !isLight);
    localStorage.setItem('lightMode', isLight ? 'on' : 'off');
    updateVantaColors(isLight);
  });
}

// Keep track of the active Vanta instance globally or in your state
let currentVantaEffect = null;

function updateVantaColors(isLight) {
  // 1. Completely destroy the existing effect if it exists
  const el = document.getElementById('vanta-bg');
  
  if (currentVantaEffect) {
    currentVantaEffect.destroy();
  } else if (el && el._vanta) {
    // Fallback just in case it was initialized elsewhere
    el._vanta.destroy(); 
  }

  // 2. Re-initialize a brand new instance with the exact theme settings
  if (isLight) {
    currentVantaEffect = VANTA.NET({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x581c87,         // Dark purple forces line visibility
      backgroundColor: 0xf0eeff, 
      points: 10.00,           // Original density
      maxDistance: 20.00,
      spacing: 15.00,
      showDots: true
    });
  } else {
    currentVantaEffect = VANTA.NET({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x7c3aed,         // Original neon purple
      backgroundColor: 0x080810,
      points: 10.00,           // Original density
      maxDistance: 20.00,
      spacing: 15.00,
      showDots: true
    });
  }

  // Store the new instance back on the element
  if (el) el._vanta = currentVantaEffect;
}

// ── Scroll-reveal for Journey milestones ──────────────────────────────────────
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const entries = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (items) => {
      items.forEach(item => {
        if (item.isIntersecting) {
          const dir = item.target.dataset.direction;
          if (!prefersReduced.matches) {
            if (dir === 'left')  item.target.classList.add('animate-fade-in-left');
            else if (dir === 'right') item.target.classList.add('animate-fade-in-right');
            else item.target.classList.add('animate-fade-up');
          }
          item.target.classList.remove('reveal');
          item.target.style.opacity = '1';
          observer.unobserve(item.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  entries.forEach(el => observer.observe(el));

  // ── Divider explosion animation ──────────────────────────────────────────
  const dividers = document.querySelectorAll('.section-divider');
  const dividerObserver = new IntersectionObserver(
    (items) => {
      items.forEach(item => {
        if (item.isIntersecting) {
          const divider = item.target;
          dividerObserver.unobserve(divider);
          if (prefersReduced.matches) {
            divider.classList.add('exploded', 'pulsing');
            return;
          }
          // Step 1: diamond appears charged
          setTimeout(() => divider.classList.add('charged'), 100);
          // Step 2: explosion + lines shoot out
          setTimeout(() => {
            divider.classList.remove('charged');
            divider.classList.add('exploded');
          }, 600);
          // Step 3: pulse starts
          setTimeout(() => divider.classList.add('pulsing'), 1200);
        }
      });
    },
    { threshold: 0.5 }
  );
  dividers.forEach(d => dividerObserver.observe(d));
}

// ── Contact form ──────────────────────────────────────────────────────────────
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('contact-success');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.querySelector('#contact-name');
    const email   = form.querySelector('#contact-email');
    const message = form.querySelector('#contact-message');
    const fields  = [name, email, message];

    // Clear previous errors
    form.querySelectorAll('.contact-error').forEach(el => el.classList.add('hidden'));
    fields.forEach(f => f?.classList.remove('border-red-500'));

    // Validate
    let valid = true;
    fields.forEach(field => {
      if (!field) return;
      const isEmpty = !field.value.trim();
      const isInvalidEmail = field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
      if (isEmpty || isInvalidEmail) {
        valid = false;
        field.classList.add('border-red-500');
        const errEl = form.querySelector(`.contact-error[data-field="${field.name}"]`);
        errEl?.classList.remove('hidden');
      }
    });

    if (!valid) return;

    const submitBtn = form.querySelector('#contact-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      // Replace with your Formspree endpoint: https://formspree.io/f/YOUR_ID
      const FORMSPREE_URL = "https://formspree.io/f/mdayylzr";
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: name.value.trim(),
          email: email.value.trim(),
          message: message.value.trim(),
        }),
      });

      if (res.ok) {
        form.classList.add('hidden');
        success?.classList.remove('hidden');
      } else {
        submitBtn.textContent = 'Failed — try again';
        submitBtn.disabled = false;
      }
    } catch {
      submitBtn.textContent = 'Network error — try again';
      submitBtn.disabled = false;
    }
  });
}
