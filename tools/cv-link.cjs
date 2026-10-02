const icon = require('./icons.cjs');
module.exports = (site, prefix, esc) => site.cvUrl
  ? `<a class="header-cv" href="${esc(/^(https?:)?\/\//.test(site.cvUrl) ? site.cvUrl : prefix + site.cvUrl)}" download>Download CV${icon('arrow-down')}</a>`
  : `<button class="header-cv" type="button" data-cv-unavailable title="CV coming soon">Download CV${icon('arrow-down')}</button>`;
