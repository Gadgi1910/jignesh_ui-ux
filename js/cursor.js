function initCustomCursor() {
  if (!Portfolio.finePointer || !Portfolio.motion || !Portfolio.hasGSAP) return;
  const cursor = document.querySelector('.cursor');
  cursor.classList.add('active');
  const xTo = gsap.quickTo(cursor, 'x', { duration: .2, ease: 'power3.out' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: .2, ease: 'power3.out' });
  let current = null;
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    xTo(event.clientX); yTo(event.clientY);
    cursor.style.opacity = '1';
  }, { passive: true });
  document.addEventListener('pointerover', event => {
    const target = event.target.closest('a, button, summary, [data-cursor]');
    if (target === current) return;
    current = target;
    const label = target?.dataset.cursor || '';
    cursor.textContent = label;
    cursor.classList.toggle('is-label', Boolean(label));
    const size = label ? 64 : target ? 27 : 12;
    const palette = getComputedStyle(document.documentElement);
    gsap.to(cursor, { width: size, height: size, margin: -size / 2, backgroundColor: palette.getPropertyValue(label ? '--accent' : '--ink').trim(), duration: .25, overwrite: 'auto' });
  });
  document.documentElement.addEventListener('pointerleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('focusin', () => { cursor.style.opacity = '0'; });
}
