const icon = require('./icons.cjs');
const cvLink = require('./cv-link.cjs');

module.exports = (site, active, prefix, esc) => {
  const nav = [['home', 'index', 'Home'], ['work', 'work', 'Work'], ['profile', 'profile', 'About Me'], ['contact', 'contact', 'Contact Me']];
  const links = mobile => nav.map(([id, file, title], i) => `<a class="${mobile ? 'mobile-link' : 'nav-link'}" href="${prefix}${file}.html"${active === id ? ' aria-current="page"' : ''}>${mobile ? `<span>${title}</span><span class="eyebrow">0${i + 1}</span>` : title}</a>`).join('');
  return `<a class="skip-link" href="#main">Skip to content</a><div class="scroll-progress" aria-hidden="true"></div>
  <header class="site-header"><div class="container header-inner">
    <a class="wordmark" href="${prefix}index.html" aria-label="Jignesh Gadgi — Home">JIGNESH GADGI<span class="wordmark-dot" aria-hidden="true"></span></a>
    <div class="theme-toggle" role="group" aria-label="Color theme"><button type="button" data-theme-mode="light" aria-pressed="true">Light</button><button type="button" data-theme-mode="dark" aria-pressed="false">Dark</button></div>
    <nav class="desktop-nav" aria-label="Main navigation">${links(false)}</nav>
    <div class="header-tools"><p class="location-clock" data-location-clock aria-label="Local time in ${esc(site.location)}"><time>--:--</time>, <span data-location>${esc(site.location)}</span></p>${cvLink(site, prefix, esc)}</div>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open navigation menu"><span class="menu-plus" aria-hidden="true">${icon('plus')}</span></button>
  </div></header>
  <div class="mobile-menu" id="mobile-menu" hidden><nav aria-label="Mobile navigation">${links(true)}</nav><div class="mobile-menu-bottom"><p class="eyebrow"><span class="dot"></span>AVAILABLE FOR<br>SELECTED PROJECTS</p><p class="eyebrow">THOUGHTFUL DESIGN.<br>HUMAN AT HEART.</p></div></div>`;
};
