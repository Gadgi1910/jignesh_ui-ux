const icon = require('./icons.cjs');
const directions = [
  ['#26301e', '#f1f3e8', '#dce095', 'activity-heartbeat', 'Fitness<br>Live'],
  ['#382944', '#f4f0fa', '#cfbde6', 'route', 'Riderly'],
  ['#652b33', '#fff0ed', '#f2b8ad', 'droplet', 'Blood<br>Connect'],
  ['#192c24', '#e8f0e7', '#b7d38e', 'cpu', 'IIoT<span>Smart Equipment</span>'],
  ['#29312c', '#eeeadd', '#c1b18b', 'clock-hour-4', 'Watch<br>Commerce'],
  ['#442f25', '#f7eadb', '#e6a785', 'perspective', 'Nperspective']
];
module.exports = (projects, esc) => `<div class="selected-projects">${projects.map((p, i) => {
  const [background, foreground, accent, mark, wordmark] = directions[i];
  return `<article class="selected-project" aria-labelledby="selected-${p.id}">
    <p class="selected-index"><span aria-hidden="true"></span>Project ${String(i + 1).padStart(2, '0')}</p>
    <div class="selected-content">
      <h3 id="selected-${p.id}">${esc(p.title)}</h3>
      <div class="selected-meta"><ul class="selected-tags" aria-label="Services">${p.services.map(service => `<li>${esc(service)}</li>`).join('')}</ul><div class="selected-details"><span>${p.year}</span><a href="${p.link}" aria-label="View ${esc(p.title)} project">View Project</a></div></div>
      <div class="selected-media">
        <a class="selected-brand selected-media-link" href="${p.link}" data-cursor="VIEW" aria-label="Explore ${esc(p.title)} project" style="--brand-bg:${background};--brand-fg:${foreground};--brand-accent:${accent}"><div class="selected-brand-grid" aria-hidden="true"></div><div class="selected-lockup" aria-hidden="true">${icon(mark)}<span class="selected-wordmark">${wordmark}</span></div></a>
        <a class="selected-preview selected-media-link" href="${p.link}" data-cursor="VIEW" aria-label="View ${esc(p.title)} interface design" style="background:${p.color}"><img src="assets/images/${p.id}-detail.svg" alt="${esc(p.title)} interface concept" width="1200" height="900" loading="lazy" decoding="async"></a>
      </div>
    </div>
  </article>`;
}).join('')}</div>`;
