/* Runs before styles paint to prevent a flash of the wrong color theme. */
(() => {
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let saved;
  try { saved = localStorage.getItem('jg-theme'); } catch {}
  const valid = value => value === 'light' || value === 'dark';
  function apply(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#171717' : '#f5f5f5');
    document.querySelectorAll('[data-theme-mode]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.themeMode === theme));
    });
    document.dispatchEvent(new CustomEvent('portfolio:theme', { detail: theme }));
  }
  apply(valid(saved) ? saved : preference.matches ? 'dark' : 'light');
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme);
    document.querySelectorAll('[data-theme-mode]').forEach(button => button.addEventListener('click', () => {
      saved = button.dataset.themeMode;
      try { localStorage.setItem('jg-theme', saved); } catch {}
      apply(saved);
    }));
  });
  preference.addEventListener('change', event => { if (!valid(saved)) apply(event.matches ? 'dark' : 'light'); });
  window.addEventListener('storage', event => {
    if (event.key !== 'jg-theme' && event.key !== null) return;
    saved = event.newValue;
    apply(valid(saved) ? saved : preference.matches ? 'dark' : 'light');
  });
})();
