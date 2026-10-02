function initProjectAnimations() {
  if (Portfolio.hasGSAP && Portfolio.motion && Portfolio.finePointer) {
    document.querySelectorAll('.project-link').forEach(link => {
      const image = link.querySelector('.project-image-motion');
      const title = link.querySelector('h3');
      const arrow = link.querySelector('.project-heading > .arrow');
      const meta = link.querySelector('.project-subline');
      let bounds;
      const xTo = gsap.quickTo(image, 'x', { duration: .6, ease: 'power3.out' });
      link.addEventListener('mouseenter', () => {
        bounds = link.getBoundingClientRect();
        gsap.to(image, { scale: 1.04, duration: .65, ease: 'power3.out' });
        gsap.to(title, { y: -4, duration: .35 });
        gsap.to(arrow, { x: 6, y: -3, duration: .35 });
        gsap.to(meta, { opacity: .65, duration: .35 });
      });
      link.addEventListener('mousemove', event => xTo((event.clientX - bounds.left - bounds.width / 2) * .01));
      link.addEventListener('mouseleave', () => {
        xTo(0);
        gsap.to(image, { scale: 1, duration: .65, ease: 'power3.out' });
        gsap.to([title, arrow], { x: 0, y: 0, duration: .35 });
        gsap.to(meta, { opacity: 1, duration: .35 });
      });
    });
  }
  const toggle = document.querySelector('.view-toggle');
  if (!toggle) return;
  const grid = document.querySelector('#project-archive');
  let busy = false;
  toggle.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    if (busy || button.getAttribute('aria-pressed') === 'true') return;
    const setLayout = () => {
      grid.classList.toggle('is-list', button.dataset.view === 'list');
      toggle.querySelectorAll('button').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    };
    if (!Portfolio.motion || !Portfolio.hasGSAP) { setLayout(); window.ScrollTrigger?.refresh(); return; }
    busy = true;
    toggle.setAttribute('aria-busy', 'true');
    const oldHeight = grid.offsetHeight;
    gsap.to(grid, { opacity: 0, y: 10, scale: .995, duration: .2, onComplete: () => {
      setLayout();
      const newHeight = grid.offsetHeight;
      gsap.fromTo(grid, { height: oldHeight, overflow: 'hidden' }, { height: newHeight, duration: .45, ease: 'power3.inOut', onComplete: () => {
        gsap.set(grid, { clearProps: 'height,overflow' });
        gsap.to(grid, { opacity: 1, y: 0, scale: 1, duration: .35, onComplete: () => { busy = false; toggle.setAttribute('aria-busy', 'false'); } });
        window.ScrollTrigger?.refresh();
      } });
    } });
  }));
}
