/**
 * main.js — Entry point. Initialises all section modules.
 */
import { initAnimation } from './animation.js';
import { initNav }       from './nav.js';
import { initProjects }  from './projects.js';
import { initChat }      from './chat.js';

document.addEventListener('DOMContentLoaded', () => {
  initAnimation();
  initNav();
  initProjects();
  initChat();
  initScrollReveal();
  initContactForm();
});

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
