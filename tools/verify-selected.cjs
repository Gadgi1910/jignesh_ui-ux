const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require('../.tools/package');
const { projects } = require('../js/content');
const target = process.argv[2] === 'work' ? 'work' : 'index';
(async () => {
  const report = { checks: [], errors: [] };
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  page.on('pageerror', e => report.errors.push(e.message));
  try {
    for (const theme of ['light', 'dark']) {
      for (const width of [1600, 1024, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(`http://127.0.0.1:4173/${target}.html`);
        await page.evaluate(t => { document.documentElement.dataset.theme = t; }, theme);
        assert.equal(await page.locator('.selected-project').count(), 6);
        assert.equal(await page.locator('.selected-media-link').count(), 12);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        for (let i = 0; i < 6; i++) {
          const row = page.locator('.selected-project').nth(i);
          await row.scrollIntoViewIfNeeded();
          const img = row.locator('img');
          await img.evaluate(el => el.decode());
          assert.equal(await row.locator('.selected-details a').getAttribute('href'), projects[i].link);
          const brand = await row.locator('.selected-brand').boundingBox();
          const preview = await row.locator('.selected-preview').boundingBox();
          if (width > 767) { assert(Math.abs(brand.width / preview.width - 2) < .02); assert(Math.abs(brand.height - preview.height) < 1); }
          if (width <= 480) assert(preview.y > brand.y + brand.height);
        }
        await page.locator('.selected-project').first().scrollIntoViewIfNeeded();
        if (width === 1600 || width === 390) await page.screenshot({ path: `test-results/${target}-selected-${theme}-${width}.png` });
        report.checks.push(`${theme}, ${width}px: six rows, links, images, layout and overflow passed`);
      }
    }
    for (const file of ['index.html','work.html','profile.html','contact.html', ...projects.map(p=>p.link)]) {
      const html = fs.readFileSync(file, 'utf8');
      assert(html.includes('tabler-icon'));
      assert(!/[↗↑↓✓×]/u.test(html), `${file}: old interface glyph`);
      assert(!/<svg(?![^>]*class="tabler-icon)/.test(html), `${file}: non-Tabler inline icon`);
    }
    report.checks.push('All 11 pages use decorative, inline Tabler icons');
    assert.deepEqual(report.errors, []);
  } catch (e) { report.failure = e.stack; }
  await browser.close();
  report.finished = new Date().toISOString();
  fs.writeFileSync(`test-results/${target}-selected-verification.json`, JSON.stringify(report, null, 2));
})();
