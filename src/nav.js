/**
 * nav.js — Scroll spy and smooth scroll for the Nav Bar.
 */

export function initNav() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  // Mobile menu toggle
  mobileBtn?.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden', isOpen);
    mobileBtn.setAttribute('aria-expanded', String(!isOpen));
  });

  // Close mobile menu on link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileBtn?.setAttribute('aria-expanded', 'false');
    });
  });

  // Smooth scroll on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        target?.scrollIntoView({ behavior: 'smooth' });
        link.blur(); // remove focus ring after click
      }
    });
  });

  // Scroll spy via IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const matches = link.getAttribute('data-section') === id;
            link.classList.toggle('active', matches);
          });
        }
      });
    },
    { threshold: 0.4, rootMargin: '-64px 0px 0px 0px' }
  );

  sections.forEach(section => observer.observe(section));
}
