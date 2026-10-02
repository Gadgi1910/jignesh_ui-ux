document.addEventListener('DOMContentLoaded', () => {
  // Independent initialization keeps a failed enhancement from blocking the site.
  const initializers = [initNavigation, initLocationClock, initSmoothScroll, initPageTransitions, initHeroAnimation, initScrollAnimations, initImageReveals, initProjectAnimations, initServiceAnimations, initCustomCursor, initMagneticButtons, initContactForm, initImageViewer];
  initializers.forEach(init => { try { init(); } catch (error) { console.warn(`${init.name}: enhancement unavailable`, error); } });
  document.querySelectorAll('[data-copy-email]').forEach(button => button.addEventListener('click', () => copyEmail(button)));
  document.querySelectorAll('[data-social-placeholder]').forEach(button => button.addEventListener('click', () => Portfolio.toast(`${button.dataset.socialPlaceholder} profile will be added soon.`)));
});
