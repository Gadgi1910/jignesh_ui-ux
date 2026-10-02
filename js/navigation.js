function initNavigation() {
  document.querySelector('[data-cv-unavailable]')?.addEventListener('click', () => Portfolio.toast('CV coming soon. Please contact me for a copy.'));
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const main = document.querySelector('main');
  const footer = document.querySelector('.site-footer');
  let open = false;
  let timeline;
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 20);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  function setOpen(value, immediate = false) {
    if (open === value) return;
    open = value;
    timeline?.kill();
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    document.body.classList.toggle('menu-open', open);
    main.inert = open;
    footer.inert = open;
    if (open) {
      menu.hidden = false;
      if (Portfolio.motion && Portfolio.hasGSAP && !immediate) {
        timeline = gsap.timeline({ onComplete: () => menu.querySelector('a').focus() });
        timeline.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .5, ease: 'power3.inOut' })
          .fromTo('.mobile-link', { y: 38, opacity: 0 }, { y: 0, opacity: 1, stagger: .065, duration: .4 }, '-=.15')
          .fromTo('.mobile-menu-bottom', { opacity: 0 }, { opacity: 1, duration: .25 }, '-=.15');
      } else menu.querySelector('a').focus();
    } else {
      toggle.focus({ preventScroll: true });
      if (Portfolio.motion && Portfolio.hasGSAP && !immediate) {
        timeline = gsap.timeline({ onComplete: () => { menu.hidden = true; } });
        timeline.to('.mobile-menu-bottom', { opacity: 0, duration: .1 })
          .to('.mobile-link', { y: -15, opacity: 0, stagger: -.035, duration: .18 }, 0)
          .to(menu, { clipPath: 'inset(0 0 100% 0)', duration: .4, ease: 'power3.inOut' }, .1);
      } else menu.hidden = true;
    }
  }
  toggle.addEventListener('click', () => setOpen(!open));
  document.addEventListener('keydown', event => {
    if (!open) return;
    if (event.key === 'Escape') setOpen(false);
    if (event.key === 'Tab') {
      const focusables = [...header.querySelectorAll('a, button'), ...menu.querySelectorAll('a, button')].filter(el => el.getClientRects().length > 0);
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  window.matchMedia('(min-width: 768px)').addEventListener('change', event => { if (event.matches) setOpen(false, true); });
  window.addEventListener('pageshow', event => { if (event.persisted) setOpen(false, true); });
}
