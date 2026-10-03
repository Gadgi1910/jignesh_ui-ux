const fs = require('node:fs');
const { chromium } = require('../.tools/package');
const assert = require('node:assert/strict');
const { projects } = require('../js/content');
const files=['index.html','work.html','profile.html','contact.html',...projects.map(p=>p.link)];
const report={checks:[],errors:[],failedRequests:[]};
const save=()=>fs.writeFileSync('test-results/redesign.json',JSON.stringify(report,null,2));
async function check(name,fn){try{await fn();report.checks.push({name,passed:true});}catch(e){report.checks.push({name,passed:false,error:e.message});}save();}
(async()=>{
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage();
page.on('pageerror',e=>report.errors.push(e.message));
page.on('console',m=>{if(['error','warning'].includes(m.type()))report.errors.push(m.text());});
page.on('response',r=>{if(r.status()>=400)report.failedRequests.push(r.url());});
await page.goto('http://127.0.0.1:4173/');
for(const theme of ['light','dark']){
 await page.evaluate(theme=>localStorage.setItem('jg-theme',theme),theme);
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:width<768?844:1000});
  for(const file of files){
   await check(`${theme}: ${file} at ${width}px`,async()=>{
    await page.goto('http://127.0.0.1:4173/'+file,{waitUntil:'load'});
    await page.evaluate(()=>document.fonts.ready);
    const data=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,font:getComputedStyle(document.body).fontFamily,theme:document.documentElement.dataset.theme,loaded:document.fonts.check('400 16px "DM Sans"'),clock:document.querySelector('[data-location-clock] time').textContent,expected:new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date()),cta:document.querySelector('.button-primary')?getComputedStyle(document.querySelector('.button-primary')).backgroundColor:null}));
    assert(data.scroll<=data.width+1,`${data.scroll}px content in ${data.width}px viewport`);assert(data.font.includes('DM Sans'));assert(data.loaded);assert.equal(data.theme,theme);assert.equal(data.clock,data.expected);if(data.cta)assert.equal(data.cta,'rgb(249, 66, 0)');
    assert.equal(await page.locator('.site-header .availability').count(),0);
    if(file==='index.html')assert.equal(await page.locator('.hero-art, .hero-topline .edition, script[src*="three"]').count(),0);
    if(width===1440&&['index.html','projects/fitness-live.html'].includes(file))await page.screenshot({path:`test-results/redesign-${theme}-${file.startsWith('projects')?'case':'home'}.png`});
    if(width===390&&['index.html','projects/fitness-live.html','contact.html'].includes(file))await page.screenshot({path:`test-results/redesign-${theme}-${file.startsWith('projects')?'case':file.split('.')[0]}-mobile.png`});
   });
  }
 }
}
await check('Theme keyboard switch and persistence across navigation',async()=>{
 await page.goto('http://127.0.0.1:4173/');
 const toggle=page.locator('[data-theme-toggle]');
 await toggle.focus();await page.keyboard.press('Space');assert.equal(await toggle.getAttribute('aria-checked'),'false');
 await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
 await toggle.click();await page.goto('http://127.0.0.1:4173/work.html');assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
});
await check('Every case-study gallery image opens the correct artwork',async()=>{
 for(const p of projects){
  await page.goto('http://127.0.0.1:4173/'+p.link);
  const links=page.locator('[data-open-image]');assert.equal(await links.count(),3);
  for(let i=0;i<3;i++){const link=links.nth(i);const href=await link.getAttribute('href');await link.click();assert(await page.locator('.image-dialog').evaluate(el=>el.open));assert((await page.locator('.image-dialog img').getAttribute('src')).endsWith(href.replace('../','')));await page.keyboard.press('Escape');assert(await link.evaluate(el=>el===document.activeElement));}
 }
});
await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>localStorage.setItem('jg-theme','light'));await page.goto('http://127.0.0.1:4173/projects/fitness-live.html');await page.evaluate(()=>scrollTo(0,1000));await page.screenshot({path:'test-results/redesign-case-intro.png'});await page.locator('.case-gallery').scrollIntoViewIfNeeded();await page.screenshot({path:'test-results/redesign-case-gallery.png'});
await check('No browser errors or missing assets',()=>{assert.deepEqual(report.errors,[]);assert.deepEqual(report.failedRequests,[]);});
await browser.close();report.passed=report.checks.filter(x=>x.passed).length;report.failed=report.checks.filter(x=>!x.passed).length;report.finished=new Date().toISOString();save();
})().catch(e=>{report.fatal=e.stack;save();});
