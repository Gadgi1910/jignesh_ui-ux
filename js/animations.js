function initHeroAnimation() {
  if (!Portfolio.hasGSAP || !Portfolio.motion) return;
  const heading = document.querySelector('.hero-title, .page-title, .profile-title, .contact-title, .project-intro h1');
  const lines = heading && lineReveal(heading);
  const loader = document.querySelector('.loader');
  let firstVisit = false;
  try { firstVisit = !sessionStorage.getItem('jg-visited'); sessionStorage.setItem('jg-visited', '1'); } catch {}
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (loader && firstVisit) {
    loader.style.display = 'flex';
    const progress = { value: 0 };
    tl.from('.loader-mark', { y: 15, opacity: 0, duration: .25 })
      .to(progress, { value: 100, duration: .45, ease: 'power1.inOut', onUpdate: () => { document.querySelector('.loader-count').textContent = String(Math.round(progress.value)).padStart(3, '0'); } }, 0)
      .to('.loader-line', { width: '100%', duration: .45 }, 0)
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: .5, ease: 'power3.inOut', onComplete: () => { loader.style.display = 'none'; } }, .45);
    // A stalled animation must never cover usable content indefinitely.
    setTimeout(() => { loader.style.display = 'none'; }, 2300);
  }
  tl.from('.site-header', { opacity: 0, y: -10, duration: .5 }, firstVisit && loader ? .65 : 0);
  const introLabels = document.querySelectorAll('.hero-topline, .page-intro > .eyebrow, .project-intro .back-link');
  if (introLabels.length) tl.from(introLabels, { opacity: 0, y: 10, duration: .4 }, '-=.25');
  if (lines?.length) tl.from(lines, { yPercent: 112, stagger: .12, duration: .9 }, '-=.2');
  else if (heading) tl.from(heading, { y: 25, opacity: 0, duration: .7 }, '-=.2');
  const content = document.querySelectorAll('.hero-description, .page-deck, .project-lead, .hero-actions, .project-facts');
  if (content.length) tl.from(content, { opacity: 0, y: 15, stagger: .09, duration: .55 }, '-=.45');
  if (document.querySelector('.hero-art')) tl.from('.hero-art', { opacity: 0, scale: .85, duration: .9 }, '-=.4');
  if (document.querySelector('.hero-meta')) tl.from('.hero-meta', { opacity: 0, y: 8, duration: .4 }, '-=.5');
}

function initScrollAnimations() {
  if (!Portfolio.hasGSAP || !window.ScrollTrigger || !Portfolio.motion) return;
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, context => {
    const distance = context.conditions.desktop ? 30 : 16;
    const elements = gsap.utils.toArray('[data-reveal]');
    if (elements.length) {
      gsap.set(elements, { opacity: 0, y: distance });
      ScrollTrigger.batch(elements, { start: 'top 94%', once: true, onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: .065, duration: .75, ease: 'power3.out', overwrite: true }) });
    }
    document.querySelectorAll('[data-quote]').forEach(quote => {
      const words = wordReveal(quote);
      gsap.from(words, { yPercent: 110, opacity: .2, stagger: .018, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: quote, start: 'top 90%', once: true } });
    });
    const track = document.querySelector('.timeline-progress');
    if (track) gsap.to(track, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 75%', end: 'bottom 70%', scrub: .5 } });
  });
  Portfolio.cleanups.push(() => mm.revert());
}

function initImageReveals() {
  if (!Portfolio.hasGSAP || !window.ScrollTrigger || !Portfolio.motion) return;
  document.querySelectorAll('.project-visual, .case-hero, .case-cover > a, .case-gallery-item > a').forEach(wrapper => {
    gsap.fromTo(wrapper, { clipPath: 'inset(7% 0 7% 0)' }, { clipPath: 'inset(0% 0 0% 0)', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: wrapper, start: 'top 94%', once: true } });
    const img = wrapper.querySelector('img');
    gsap.fromTo(img, { scale: 1.1 }, { scale: 1, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: wrapper, start: 'top 94%', once: true } });
    if (innerWidth >= 1024 && wrapper.classList.contains('project-visual')) {
      gsap.fromTo(img, { yPercent: -2 }, { yPercent: 2, ease: 'none', scrollTrigger: { trigger: wrapper, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    }
  });
}

function initServiceAnimations() {
  document.querySelectorAll('.service-row').forEach(row => {
    row.addEventListener('toggle', () => {
      if (row.open && Portfolio.motion && Portfolio.hasGSAP) gsap.fromTo(row.querySelector('.service-body'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .35 });
      window.ScrollTrigger?.refresh();
    });
    if (!Portfolio.finePointer || !Portfolio.motion || !Portfolio.hasGSAP) return;
    const title = row.querySelector('summary h2, summary h3');
    row.addEventListener('mouseenter', () => gsap.to(title, { x: 8, duration: .4, ease: 'power2.out' }));
    row.addEventListener('mouseleave', () => gsap.to(title, { x: 0, duration: .4, ease: 'power2.out' }));
  });
}

function initMagneticButtons() {
  if (!Portfolio.hasGSAP || !Portfolio.finePointer || !Portfolio.motion) return;
  document.querySelectorAll('[data-magnetic]').forEach(button => {
    const xTo = gsap.quickTo(button, 'x', { duration: .4, ease: 'power3.out' });
    const yTo = gsap.quickTo(button, 'y', { duration: .4, ease: 'power3.out' });
    let bounds;
    button.addEventListener('mouseenter', () => { bounds = button.getBoundingClientRect(); });
    button.addEventListener('mousemove', event => { xTo((event.clientX - bounds.left - bounds.width / 2) * .13); yTo((event.clientY - bounds.top - bounds.height / 2) * .18); });
    button.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
  });
}
