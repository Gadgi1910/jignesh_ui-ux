/* Shared helpers. All motion has a readable, usable no-animation fallback. */
window.Portfolio = {
  motion: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  finePointer: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  hasGSAP: typeof window.gsap !== 'undefined',
  cleanups: [],
  toast(message) {
    const el = document.querySelector('.toast');
    if (!el) return;
    clearTimeout(this.toastTimer);
    el.textContent = message;
    el.classList.add('visible');
    if (this.motion && this.hasGSAP) gsap.fromTo(el, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: .25 });
    this.toastTimer = setTimeout(() => el.classList.remove('visible'), 3500);
  },
};

function splitTextReveal(element, mode = 'word') {
  if (!element || element.dataset.split) return element?.querySelectorAll('.word-inner, .character') || [];
  const text = element.textContent.trim();
  element.setAttribute('aria-label', text);
  element.textContent = '';
  const parts = mode === 'character' ? Array.from(text) : text.split(/\s+/);
  parts.forEach((part, index) => {
    const span = document.createElement('span');
    span.setAttribute('aria-hidden', 'true');
    if (mode === 'character') {
      span.className = 'character';
      span.textContent = part === ' ' ? '\u00a0' : part;
    } else {
      span.className = 'word-mask';
      const inner = document.createElement('span');
      inner.className = 'word-inner';
      inner.textContent = part;
      span.append(inner);
    }
    element.append(span);
    if (mode !== 'character' && index < parts.length - 1) element.append(' ');
  });
  element.dataset.split = 'true';
  return element.querySelectorAll('.word-inner, .character');
}
function wordReveal(element) { return splitTextReveal(element, 'word'); }
function characterReveal(element) { return splitTextReveal(element, 'character'); }
function lineReveal(element) { return element.querySelectorAll('.line-inner'); }

async function copyEmail(button) {
  const email = window.PortfolioData.site.email;
  let copied = false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(email);
      copied = true;
    } else {
      const input = document.createElement('textarea');
      input.value = email;
      input.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.append(input);
      input.select();
      copied = document.execCommand('copy');
      input.remove();
      button.focus();
    }
  } catch { copied = false; }
  const feedback = document.querySelector('.copy-feedback');
  if (feedback) {
    clearTimeout(button.feedbackTimer);
    feedback.textContent = copied ? 'COPIED ' : 'Copy unavailable — select the address above.';
    const checkIcon = document.querySelector('.success-mark .tabler-icon');
    if (copied && checkIcon) feedback.append(checkIcon.cloneNode(true));
    if (Portfolio.motion && Portfolio.hasGSAP) gsap.fromTo(feedback, { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: .3 });
    button.feedbackTimer = setTimeout(() => { feedback.textContent = 'CLICK TO COPY EMAIL'; }, 3000);
  }
  Portfolio.toast(copied ? 'Email address copied.' : `Email: ${email}`);
}

function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const controls = Array.from(form.querySelectorAll('input, select, textarea'));
  form.querySelector('[type="submit"]').disabled = false;
  function validate(control) {
    let message = '';
    if (!control.value.trim()) message = control.dataset.error || 'Please complete this field.';
    else if (control.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value)) message = 'Please enter a valid email address.';
    else if (control.name === 'message' && control.value.trim().length < 20) message = 'Please tell me a little more (at least 20 characters).';
    control.setAttribute('aria-invalid', String(Boolean(message)));
    document.getElementById(`${control.id}-error`).textContent = message;
    return !message;
  }
  controls.forEach(control => {
    const update = () => {
      control.closest('.form-field').classList.toggle('has-value', Boolean(control.value));
      if (control.getAttribute('aria-invalid') === 'true') validate(control);
    };
    control.addEventListener('input', update);
    control.addEventListener('change', update);
    control.addEventListener('blur', () => { if (control.value) validate(control); });
    update();
  });
  form.noValidate = true;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const results = controls.map(validate);
    if (results.some(valid => !valid)) {
      controls[results.indexOf(false)].focus();
      return;
    }
    // Frontend demonstration only. No data is transmitted or stored.
    form.hidden = true;
    const success = document.querySelector('.form-success');
    const draft = success.querySelector('[data-email-draft]');
    if (draft) {
      const values = new FormData(form);
      const subject = `${values.get('project-type')} enquiry from ${values.get('name')}`;
      const body = `Name: ${values.get('name')}\nEmail: ${values.get('email')}\nProject: ${values.get('project-type')}\n\n${values.get('message')}`;
      draft.href = `mailto:${window.PortfolioData.site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    success.hidden = false;
    success.focus({ preventScroll: true });
    if (Portfolio.motion && Portfolio.hasGSAP) gsap.from(success, { opacity: 0, y: 15, duration: .45 });
    window.ScrollTrigger?.refresh();
  });
  document.querySelector('[data-reset-form]')?.addEventListener('click', () => {
    document.querySelector('.form-success').hidden = true;
    form.hidden = false;
    controls[0].focus({ preventScroll: true });
    window.ScrollTrigger?.refresh();
  });
}

function initImageViewer() {
  const dialog = document.querySelector('.image-dialog');
  const triggers = document.querySelectorAll('[data-open-image]');
  if (!dialog || !triggers.length || !dialog.showModal) return;
  let trigger;
  let previousOverflow = '';
  triggers.forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    trigger = link;
    const source = link.querySelector('img');
    const image = dialog.querySelector('img');
    image.src = link.href;
    image.alt = source?.alt || 'Project concept artwork';
    const caption = dialog.querySelector('[data-image-caption]');
    if (caption) caption.textContent = image.alt;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    if (Portfolio.motion && Portfolio.hasGSAP) gsap.fromTo(dialog, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .3 });
  }));
  dialog.querySelector('[data-close-image]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.style.overflow = previousOverflow; trigger.focus({ preventScroll: true }); });
}
