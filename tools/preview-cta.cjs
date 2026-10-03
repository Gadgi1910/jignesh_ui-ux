const icon = require('./icons.cjs');
module.exports = function previewCta(project, esc) {
  const contents = `<span class="preview-icon" aria-hidden="true">${icon('arrow-right')}</span><span class="preview-label">Preview Site</span>`;
  if (project.previewUrl && /^https?:\/\//i.test(project.previewUrl)) {
    return `<a class="preview-cta" href="${esc(project.previewUrl)}" target="_blank" rel="noopener noreferrer">${contents}<span class="sr-only"> (opens in a new tab)</span></a>`;
  }
  return `<button class="preview-cta" type="button" disabled aria-label="Preview Site — link coming soon" title="Live preview link coming soon">${contents}</button>`;
};
