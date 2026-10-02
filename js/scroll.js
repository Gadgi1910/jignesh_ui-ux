function initSmoothScroll() {
  // Keep native scrolling, touch inertia, and browser find intact. GSAP smooths
  // anchor travel and ScrollTrigger's scrub smooths scroll-linked visuals.
  let scrollTween;
  const cancel = () => scrollTween?.kill();
  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchstart', cancel, { passive: true });
  window.addEventListener('keydown', event => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) cancel(); });
  document.querySelectorAll('a[href^="#"], [data-back-top]').forEach(link => {
    link.addEventListener('click', event => {
      const id = link.getAttribute('href');
      const target = link.hasAttribute('data-back-top') ? document.querySelector('main') : document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      const destination = link.hasAttribute('data-back-top') ? 0 : Math.max(0, target.getBoundingClientRect().top + scrollY - 100);
      const finish = () => { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); };
      if (Portfolio.motion && Portfolio.hasGSAP) {
        const position = { y: scrollY };
        scrollTween = gsap.to(position, { y: destination, duration: .85, ease: 'power3.inOut', onUpdate: () => window.scrollTo(0, position.y), onComplete: finish });
      } else { window.scrollTo(0, destination); finish(); }
    });
  });
  if (Portfolio.hasGSAP && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => { document.querySelector('.scroll-progress').style.transform = `scaleX(${self.progress})`; } });
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    document.querySelectorAll('img').forEach(img => { if (!img.complete) img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true }); });
  }
}
