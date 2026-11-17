import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { makeSteps } from '../src/scenes.js';
import { sources } from '../src/sources.js';

await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1920,height:1180}});
const errors=[],external=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('request',request=>{if(!request.url().startsWith('http://127.0.0.1:5189')&&!request.url().startsWith('data:'))external.push(request.url());});
await page.goto('http://127.0.0.1:5189');
await page.waitForLoadState('networkidle');
await page.locator('.code-line').first().waitFor();
await page.evaluate(()=>document.fonts.ready);
async function key(key){await page.locator('body').click({position:{x:2,y:2}});await page.keyboard.press(key);}
async function go(index){await key('Home');for(let i=0;i<index;i++)await key('ArrowRight');}
let count=0;
for(const scenario of ['main','invalid','unknown','missing','redirect','direct','link-back']){
  await page.selectOption('#scenario',scenario);
  const steps=makeSteps(scenario);
  for(let i=0;i<steps.length;i++){
    if(i)await key('ArrowRight');
    const step=steps[i];count++;
    assert.equal(await page.locator('#stage').getAttribute('data-step'),String(i));
    assert.equal(await page.locator('#file').inputValue(),step.file);
    assert.deepEqual(await page.locator('.code-line code').allTextContents(),sources[step.file].split('\n'));
    assert.equal(await page.locator('#address').innerText(),step.url);
    assert.equal(await page.locator('#outlet').getAttribute('data-view'),step.view);
    assert.equal(await page.locator('#history .current').innerText(),step.history.entries[step.history.position]);
    assert.equal(page.url(),'http://127.0.0.1:5189/');
    const fit=await page.evaluate(()=>{
      const body=document.querySelector('.code-body'),row=document.querySelector('.code-line.active'),r=row.getBoundingClientRect(),b=body.getBoundingClientRect();
      const elements=['.demo','.engine','.controls','.browser','#detail-value','#explanation'];
      return {line:r.top>=b.top-1&&r.bottom<=b.bottom+1,codeWidth:body.scrollWidth<=body.clientWidth+1,panels:elements.every(selector=>{const n=document.querySelector(selector);return n.scrollHeight<=n.clientHeight+1&&n.scrollWidth<=n.clientWidth+1;}),bottom:document.querySelector('.controls').getBoundingClientRect().bottom<=1180};
    });
    if (!Object.values(fit).every(Boolean)) {
      await page.screenshot({path:'artifacts/failure.png'});
      console.log(await page.evaluate(()=>['.demo','.engine','.controls','.browser','#detail-value','#explanation'].map(selector=>{const n=document.querySelector(selector);return [selector,n.scrollHeight,n.clientHeight,n.scrollWidth,n.clientWidth];})));
    }
    assert.ok(Object.values(fit).every(Boolean),JSON.stringify({scenario,i,fit}));
  }
  await page.screenshot({path:'artifacts/'+scenario+'.png'});
}
await page.selectOption('#scenario','main');
await go(5);await page.waitForTimeout(1000);await page.screenshot({path:'artifacts/click.png'});
await go(13);await page.screenshot({path:'artifacts/outlet.png'});
await page.click('[data-return]');
assert.equal(await page.locator('#history span').count(),3);
assert.match(await page.locator('#title').innerText(),/enlace/);
await page.selectOption('#scenario','main');
await go(15);assert.match(await page.locator('#outlet').innerText(),/Escribe un título/);
await page.selectOption('#file','src/components/media-search-results.tsx');
await page.locator('.code-body').evaluate(body=>body.scrollTop=body.scrollHeight);
assert.equal(await page.locator('#stage').getAttribute('data-step'),'15');
await key('ArrowRight');assert.equal(await page.locator('#file').inputValue(),'src/pages/media-detail-page.tsx');
await go(5);await key('ArrowLeft');await page.waitForTimeout(1000);
assert.equal(await page.locator('#stage').getAttribute('data-step'),'4');
await page.selectOption('#speed','1500');await page.click('#play');await page.waitForTimeout(1650);await page.click('#play');
assert.equal(await page.locator('#stage').getAttribute('data-step'),'5');
await page.setViewportSize({width:1366,height:768});await go(9);await page.screenshot({path:'artifacts/laptop.png'});
await page.emulateMedia({reducedMotion:'reduce'});await go(5);
const before=await page.locator('#cursor').getAttribute('style');await page.waitForTimeout(750);
assert.equal(await page.locator('#cursor').getAttribute('style'),before);
await page.click('#help');assert.ok(await page.locator('#help-panel').evaluate(n=>n.open));await page.keyboard.press('Escape');
assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
console.log(count+' snapshots OK: source, params, history, reset, cursor, reverse, autoplay, laptop, reduced motion; no backend requests.');
await browser.close();
