const icon = require('./icons.cjs');
const previewCta = require('./preview-cta.cjs');
/* Shared editorial case study template. All six projects use this layout. */
const fs = require('node:fs');
const path = require('node:path');
module.exports = function projectPage(p, index, projects, helpers) {
  const { esc, label, textLink, arrow, contactBand } = helpers;
  const next = projects[(index + 1) % projects.length];
  const sector = p.category.split(' · ').pop();
  const coverImage = p.heroImage && fs.existsSync(path.resolve(__dirname, '..', p.heroImage)) ? p.heroImage : p.image;
  const galleryImage = (file, caption, wide = false) => `<figure class="case-gallery-item${wide ? ' is-wide' : ''}"><a href="../assets/images/${file}" data-open-image data-cursor="OPEN" aria-label="Open ${esc(caption)}"><img src="../assets/images/${file}" alt="${esc(caption)}" width="1200" height="900" loading="lazy" decoding="async"></a><figcaption>${caption}</figcaption></figure>`;
  return `<article class="case-study">
  <figure class="case-cover"><a href="../${coverImage}" data-open-image data-cursor="OPEN" aria-label="Open ${esc(p.title)} project overview"><img src="../${coverImage}" alt="${esc(p.title)} — complete interface concept" width="1200" height="900" fetchpriority="high" decoding="async"></a><figcaption><span>${p.title} / Design direction</span><span>0${index+1} — ${p.year}</span></figcaption></figure>
  <header class="case-intro container">
    <div class="case-breadcrumb">${textLink('ALL WORK', '../work.html')}${label(`CASE STUDY / 0${index + 1}`)}</div>
    <div class="case-intro-grid">
      <div><p class="case-client">${p.title}<span aria-hidden="true">®</span></p><h1 data-reveal>${p.headline}</h1></div>
      <div class="case-intro-aside"><div class="case-description"><p>${p.overview}</p>${previewCta(p, esc)}</div><dl class="case-facts"><div><dt>Services</dt><dd>${p.services.map(service => `<span>${service}</span>`).join('')}</dd></div><div><dt>Industry</dt><dd>${sector}</dd></div><div><dt>Year</dt><dd>${p.year}</dd></div><div><dt>Project type</dt><dd>Illustrative concept</dd></div></dl></div>
    </div>
  </header>

  <div class="container">
    <section class="case-editorial"><h2 data-reveal>Problem &amp;<br>perspective.</h2><div class="case-editorial-copy" data-reveal><h3>The challenge</h3><p>${p.challenge}</p><h3>A considered approach</h3><p>${p.approach}</p></div></section>
    <div class="case-gallery">${galleryImage(`${p.id}-detail.svg`, `${p.title} / Interface detail`)}<div class="case-brand-panel" style="--project-color:${p.color}"><span class="eyebrow">A CLEAR POINT OF VIEW</span><p>${p.title}<span>®</span></p><span class="case-brand-caption">${p.description}</span><span class="case-brand-arrow" aria-hidden="true">${icon("arrow-up-right")}</span></div>${galleryImage(`${p.id}-system.svg`, `${p.title} / A closer look at the visual system`, true)}</div>
    <section class="case-editorial"><h2 data-reveal>Designed around<br>the everyday.</h2><div class="case-editorial-copy" data-reveal><p>${p.solution}</p><div class="case-values">${p.principles.map((principle,i)=>`<div><span>0${i+1}</span><h3>${principle}</h3></div>`).join('')}</div></div></section>
    <section class="case-design-system"><div class="case-type-panel"><span class="eyebrow">TYPOGRAPHY / INTERFACE SYSTEM</span><p class="case-type-sample" aria-hidden="true">Aa</p><p class="case-type-family">DM Sans</p><p class="case-alphabet">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789 — !?&amp;@</p></div><div class="case-palette"><div style="background:${p.color};color:#111"><span>Project accent</span><strong>${p.color.toUpperCase()}</strong></div><div style="background:#111;color:#f5f4f0"><span>Foundation</span><strong>#111111</strong></div><div style="background:#f5f4f0;color:#111"><span>Canvas</span><strong>#F5F4F0</strong></div></div></section>
    <section class="case-editorial case-conclusion"><h2 data-reveal>The details.<br>The difference.</h2><div class="case-editorial-copy" data-reveal><p>${p.description} A visual direction built around ${p.principles.map(x=>x.toLowerCase()).join(', ')}.</p><p class="notice">Illustrative case study with original concept artwork. Replace these visuals and descriptions with approved project work; no client results or measured outcomes are claimed.</p>${textLink('LET’S DISCUSS YOUR PROJECT','../contact.html')}</div></section>
    <a class="case-next" href="${next.id}.html" data-cursor="VIEW"><div class="case-next-text"><span class="eyebrow">NEXT CASE STUDY / 0${(index+1)%projects.length+1}</span><h2>${next.title}</h2><p>${next.category}</p><span class="case-next-arrow" aria-hidden="true">${icon("arrow-up-right")}</span></div><img src="../${next.image}" alt="${esc(next.title)} preview" width="1200" height="900" loading="lazy"></a>
  </div>
  <dialog class="image-dialog" aria-label="Project artwork"><div class="image-dialog-top"><span class="eyebrow" data-image-caption>${p.title} / CONCEPT ARTWORK</span><button type="button" data-close-image aria-label="Close full-size image">CLOSE ${icon("x")}</button></div><img src="../${p.image}" alt="${esc(p.title)} concept artwork" width="1200" height="900" loading="lazy"></dialog>
  </article>${contactBand('../')}`;
};
