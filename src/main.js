/**
 * main.js — Entry point. Initialises all section modules.
 */
import { initNav }       from './nav.js';
import { initProjects }  from './projects.js';
import { initChat }      from './chat.js';
import { initNeuralMap } from './neuralmap.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initProjects();
  initChat();
  initNeuralMap();
  initScrollReveal();
  initContactForm();
});

// ── Scroll-reveal ─────────────────────────────────────────────────────────────
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  const observer = new IntersectionObserver((items) => {
    items.forEach(item => {
      if (!item.isIntersecting) return;
      const dir = item.target.dataset.direction;
      const isMilestone = item.target.closest('#timeline-entries') !== null;

      if (!prefersReduced.matches) {
        if (isMilestone) {
          // Enhanced milestone animation with border flash
          item.target.classList.add(dir === 'right' ? 'milestone-animate-right' : 'milestone-animate-left');
          item.target.classList.add('milestone-flash');
        } else {
          if (dir === 'left')       item.target.classList.add('animate-fade-in-left');
          else if (dir === 'right') item.target.classList.add('animate-fade-in-right');
          else                      item.target.classList.add('animate-fade-up');
        }
      }
      item.target.classList.remove('reveal');
      item.target.style.opacity = '1';
      observer.unobserve(item.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Divider explosion animation
  const dividerObserver = new IntersectionObserver((items) => {
    items.forEach(item => {
      if (!item.isIntersecting) return;
      const d = item.target;
      dividerObserver.unobserve(d);
      if (prefersReduced.matches) { d.classList.add('exploded', 'pulsing'); return; }
      setTimeout(() => d.classList.add('charged'), 100);
      setTimeout(() => { d.classList.remove('charged'); d.classList.add('exploded'); }, 600);
      setTimeout(() => d.classList.add('pulsing'), 1200);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.section-divider').forEach(d => dividerObserver.observe(d));
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

    form.querySelectorAll('.contact-error').forEach(el => el.classList.add('hidden'));
    fields.forEach(f => f?.classList.remove('border-red-500'));

    let valid = true;
    fields.forEach(field => {
      if (!field) return;
      const isEmpty = !field.value.trim();
      const isInvalidEmail = field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
      if (isEmpty || isInvalidEmail) {
        valid = false;
        field.classList.add('border-red-500');
        form.querySelector(`.contact-error[data-field="${field.name}"]`)?.classList.remove('hidden');
      }
    });

    if (!valid) return;

    const submitBtn = form.querySelector('#contact-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const res = await fetch('https://formspree.io/f/mdayylzr', {
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