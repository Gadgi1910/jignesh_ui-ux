function initPageTransitions() {
  const layer = document.querySelector('.page-wipe');
  let leaving = false;
  let navigationTimer;
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank' || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    const local = url.origin === location.origin && url.pathname.endsWith('.html');
    if (!local || (url.pathname === location.pathname && url.hash) || !Portfolio.motion || !Portfolio.hasGSAP) return;
    event.preventDefault();
    if (leaving) return;
    leaving = true;
    layer.style.visibility = 'visible';
    const navigate = () => {
      clearTimeout(navigationTimer);
      location.assign(url.href);
    };
    // Fallback handles a paused animation or a backgrounded tab.
    navigationTimer = setTimeout(navigate, 900);
    gsap.timeline({ onComplete: navigate })
      .to('main', { opacity: .35, y: -8, duration: .25, ease: 'power2.in' })
      .to(layer, { y: '0%', duration: .45, ease: 'power3.inOut' }, .05);
  });
  window.addEventListener('pageshow', event => {
    clearTimeout(navigationTimer);
    if (!event.persisted) return;
    leaving = false;
    if (Portfolio.hasGSAP) {
      gsap.set(layer, { y: '101%', visibility: 'hidden' });
      gsap.set('main', { clearProps: 'opacity,transform' });
    }
  });
}
