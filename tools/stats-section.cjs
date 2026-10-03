module.exports = function statsSection(statistics, esc) {
  return `<section class="stats-section section container" aria-labelledby="stats-title">
    <div class="stats-heading"><p class="eyebrow"><span class="dot" aria-hidden="true"></span>Stats &amp; facts</p><h2 id="stats-title">Experience shaped by thoughtful design and collaboration.</h2></div>
    <div class="stats-cards">${statistics.map(stat => `<article class="stats-card"><p class="stats-value">${esc(stat.value)}</p><div class="stats-card-copy"><h3>${esc(stat.label)}</h3><p>${esc(stat.description)}</p></div></article>`).join('')}</div>
  </section>`;
};
