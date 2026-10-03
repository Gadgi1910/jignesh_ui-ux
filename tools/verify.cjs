const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('../.tools/package');
const { projects } = require('../js/content');
const base = 'http://127.0.0.1:4173/';
const files = ['index.html','work.html','profile.html','contact.html',...projects.map(p=>p.link)];
const report = { started: new Date().toISOString(), checks:[], errors:[], requests:[] };
const save = () => fs.writeFileSync('test-results/verification.json',JSON.stringify(report,null,2));
async function check(name, run) {
  try { const detail = await run(); report.checks.push({name,passed:true,...(detail?{detail}:{})}); }
  catch(error) { report.checks.push({name,passed:false,error:error.message}); }
  save();
}
(async () => {
  fs.mkdirSync('test-results',{recursive:true});
  await check('All local HTML links, assets, and scripts exist', () => {
    let count=0;
    for (const file of files) {
      const html=fs.readFileSync(file,'utf8');
      for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        if (/^(?:https?:|mailto:|#)/.test(url)) continue;
        const target=path.resolve(path.dirname(file),url.split('#')[0]);
        assert(fs.existsSync(target),`${file}: missing ${url}`); count++;
      }
      assert.equal((html.match(/<h1\b/g)||[]).length,1,`${file}: needs one H1`);
      assert(html.includes('name="description"'));
      assert(html.includes('rel="canonical"'));
      assert(!/elliot|framerusercontent|react|tailwind/i.test(html),`${file}: unexpected source content`);
    }
    return `${count} local references across ${files.length} pages`;
  });
  const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
  const context = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('console',m=>{ if(m.type()==='error'||m.type()==='warning') report.errors.push(m.type()+': '+m.text()); });
  page.on('response',r=>{if(r.status()>=400)report.requests.push({url:r.url(),status:r.status()});});
  for(const width of [1440,1024,768,390,320]) {
    await page.setViewportSize({width,height:width<768?844:1000});
    for(const file of files) {
      await check(`${file} renders at ${width}px without overflow`,async()=>{
        await page.goto(base+file,{waitUntil:'load'});
        await page.evaluate(()=>document.fonts.ready);
        const data=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src),h1:!!document.querySelector('h1')?.getBoundingClientRect().height,canvas:!!document.querySelector('.hero-art canvas')}));
        assert(data.scrollWidth<=data.width+1,`${data.scrollWidth}px content in ${data.width}px viewport`);
        assert.deepEqual(data.broken,[]); assert(data.h1); assert(!data.canvas,'Reduced motion must avoid creating WebGL canvas');
        if(width===390 && ['contact.html','profile.html','work.html','projects/fitness-live.html'].includes(file)) await page.screenshot({path:`test-results/${file.replaceAll('/','-').replace('.html','')}-mobile.png`,fullPage:true});
      });
    }
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto(base+'index.html');
  await check('Mobile menu: focus, focus trap, Escape, resize, and navigation',async()=>{
    const toggle=page.locator('.menu-toggle');
    await toggle.click();
    assert.equal(await toggle.getAttribute('aria-expanded'),'true');
    assert(await page.locator('main').evaluate(el=>el.inert));
    assert.equal(await page.evaluate(()=>document.activeElement.textContent.trim()),'Work01');
    await page.locator('.mobile-link').last().focus();
    await page.keyboard.press('Tab');
    assert(await page.locator('.wordmark').evaluate(el=>el===document.activeElement));
    await page.keyboard.press('Escape');
    assert.equal(await toggle.getAttribute('aria-expanded'),'false');
    assert(await toggle.evaluate(el=>el===document.activeElement));
    await toggle.click();
    await page.setViewportSize({width:1024,height:900});
    assert(await page.locator('.mobile-menu').isHidden());
    assert(!await page.locator('main').evaluate(el=>el.inert));
  });
  await page.goto(base+'contact.html');
  await check('Form: empty errors, email format, short message, success, email draft, edit',async()=>{
    await page.locator('button[type=submit]').click();
    assert.equal(await page.locator('[aria-invalid=true]').count(),4);
    assert(await page.locator('#name').evaluate(el=>el===document.activeElement));
    await page.locator('#name').fill('Test Designer');
    await page.locator('#email').fill('not-an-email');
    await page.locator('#project-type').selectOption({label:'Product design'});
    await page.locator('#message').fill('Too short');
    await page.locator('button[type=submit]').click();
    assert.equal(await page.locator('[aria-invalid=true]').count(),2);
    await page.locator('#email').fill('test@example.com');
    await page.locator('#message').fill('A thoughtful mobile application for a community project.');
    await page.locator('button[type=submit]').click();
    assert(await page.locator('.form-success').isVisible());
    assert(await page.locator('#contact-form').isHidden());
    assert((await page.locator('.form-success').textContent()).includes('no message has been sent'));
    assert((await page.locator('[data-email-draft]').getAttribute('href')).startsWith('mailto:jigneshgadgi1929@gmail.com?subject='));
    await page.locator('[data-reset-form]').click();
    assert(await page.locator('#contact-form').isVisible());
    assert.equal(await page.locator('#name').inputValue(),'Test Designer');
  });
  await check('Email clipboard and feedback',async()=>{
    await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:base});
    await page.locator('[data-copy-email]').click();
    await page.waitForFunction(()=>document.querySelector('.copy-feedback').textContent.includes('COPIED'));
    assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'jigneshgadgi1929@gmail.com');
  });
  await check('Full-size project artwork opens and returns keyboard focus',async()=>{
    await page.goto(base+'projects/fitness-live.html');
    const trigger=page.locator('[data-open-image]').first();
    await trigger.focus(); await page.keyboard.press('Enter');
    assert(await page.locator('.image-dialog').evaluate(el=>el.open));
    await page.keyboard.press('Escape');
    assert(!await page.locator('.image-dialog').evaluate(el=>el.open));
    assert(await trigger.evaluate(el=>el===document.activeElement));
    await trigger.click(); await page.locator('[data-close-image]').click();
    assert(!await page.locator('.image-dialog').evaluate(el=>el.open));
  });
  await check('All pages remain readable with JavaScript disabled',async()=>{
    const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
    const staticPage=await noJS.newPage();
    for(const file of files){await staticPage.goto(base+file); assert(await staticPage.locator('h1').isVisible()); assert.equal(await staticPage.locator('a[href]').count()>10,true);}
    await noJS.close();
  });
  const animated=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
  const live=await animated.newPage();
  live.on('pageerror',e=>report.errors.push(e.message));
  live.on('console',m=>{if(m.type()==='error'||m.type()==='warning')report.errors.push(m.type()+': '+m.text());});
  await check('GSAP, ScrollTrigger, removed hero artwork, loader, and hover interactions',async()=>{
    await live.goto(base+'index.html');
    await live.waitForTimeout(2200);
    const state=await live.evaluate(()=>({gsap:typeof gsap,st:ScrollTrigger.getAll().length,canvas:!!document.querySelector('.hero-art canvas'),loader:getComputedStyle(document.querySelector('.loader')).display}));
    assert.equal(state.gsap,'object');assert(state.st>0);assert(!state.canvas);assert.equal(state.loader,'none');
    await live.locator('.selected-media-link').first().hover();
    await live.waitForTimeout(700);
    assert(await live.locator('.selected-lockup').first().evaluate(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).a>1.02));
    assert.equal(await live.locator('.cursor').textContent(),'VIEW');
    return state;
  });
  await check('Work listing shows all 6 projects in paired rows',async()=>{
    await live.goto(base+'work.html');
    assert.equal(await live.locator('#project-archive .selected-project').count(),6);
    assert.equal(await live.locator('#project-archive .selected-media-link').count(),12);
    await live.locator('.selected-details a').first().focus();
    assert(await live.locator('.selected-details a').first().evaluate(el=>el===document.activeElement));
    await live.screenshot({path:'test-results/work-list-desktop.png'});
  });
  await check('Page transition and browser back restore content',async()=>{
    await live.locator('.selected-media-link').first().click();
    await live.waitForURL('**/projects/fitness-live.html');
    await live.waitForTimeout(1000);
    assert.equal(await live.locator('h1').textContent(),projects[0].headline);
    await live.goBack();
    await live.waitForTimeout(1000);
    assert(live.url().endsWith('/work.html'), 'Browser back must stay on the archive');
    assert.equal(await live.locator('main').evaluate(el=>getComputedStyle(el).opacity),'1');
  });
  await check('Animated mobile menu opens, closes, and follows a link',async()=>{
    await live.setViewportSize({width:390,height:844});
    await live.goto(base+'index.html');
    await live.waitForTimeout(1200);
    await live.locator('.menu-toggle').click();
    await live.waitForTimeout(1000);
    await live.screenshot({path:'test-results/mobile-menu.png'});
    await live.keyboard.press('Escape');
    await live.waitForTimeout(650);
    assert(await live.locator('.mobile-menu').isHidden());
    await live.locator('.menu-toggle').click();
    await live.waitForTimeout(950);
    await live.locator('.mobile-link').nth(3).click();
    await live.waitForURL('**/contact.html');
    assert(!await live.locator('main').evaluate(el=>el.inert));
  });
  await check('Touch device hides cursor and keeps navigation usable',async()=>{
    const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
    const touchPage=await touch.newPage();
    await touchPage.goto(base+'index.html');
    assert(await touchPage.locator('.cursor').isHidden());
    await touchPage.locator('.menu-toggle').tap();
    assert(await touchPage.locator('.mobile-menu').isVisible());
    await touchPage.locator('.mobile-link').first().tap();
    await touchPage.waitForURL('**/work.html');
    await touch.close();
  });
  await check('No browser console errors or failed local requests',()=>{
    assert.deepEqual(report.errors,[]); assert.deepEqual(report.requests,[]);
  });
  await browser.close();
  report.finished=new Date().toISOString();
  report.passed=report.checks.filter(c=>c.passed).length;
  report.failed=report.checks.filter(c=>!c.passed).length;
  save();
})().catch(error=>{report.fatal=error.stack;report.finished=new Date().toISOString();save();});
