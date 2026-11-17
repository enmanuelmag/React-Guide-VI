import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1920,height:1180}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const external=[];page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:5187')&&!r.url().startsWith('data:'))external.push(r.url())});
await page.goto('http://127.0.0.1:5187');
await page.waitForLoadState('networkidle');
await page.locator('.code-line').first().waitFor();
await page.evaluate(()=>document.fonts.ready);
const code=await page.locator('#code').innerText();
async function go(n){await page.locator('body').click({position:{x:5,y:5}});await page.keyboard.press('Home');for(let i=0;i<n;i++)await page.keyboard.press('ArrowRight');}
for(const scenario of ['success','http','network']){
  await page.selectOption('#scenario',scenario);
  await go(0);
  for(let i=0;i<20;i++){
    if(i)await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#code').innerText(),code);
    const fit=await page.evaluate(()=>{
      const code=document.querySelector('#code'),body=document.querySelector('.code-body');
      return {height:code.getBoundingClientRect().height<=body.getBoundingClientRect().height+1,
        width:[...document.querySelectorAll('.code-line code')].every(n=>n.getBoundingClientRect().right<=body.getBoundingClientRect().right+1),
        canvas:document.querySelector('.controls').getBoundingClientRect().bottom<=1180,
        preview:document.querySelector('#ui-note').getBoundingClientRect().bottom<=document.querySelector('.browser-panel').getBoundingClientRect().bottom+1,
        console:document.querySelector('#console').scrollHeight<=document.querySelector('#console').clientHeight+1};
    });
    assert.ok(Object.values(fit).every(Boolean),JSON.stringify({scenario,i,fit}));
  }
  await page.screenshot({path:'artifacts/'+scenario+'-final.png'});
}
await page.selectOption('#scenario','success');await go(7);
await page.click('#count');
assert.equal(await page.locator('#clicks').innerText(),'1');
assert.equal(await page.locator('#loading').isVisible(),true);
assert.match(await page.locator('#network-status').innerText(),/pendiente/);
assert.equal(await page.locator('#count').getAttribute('data-change-origin'),'usuario');
assert.equal(await page.locator('#counter').getAttribute('data-change-origin'),'react');
await page.screenshot({path:'artifacts/pending-interactive.png'});
await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowLeft');
assert.equal(await page.locator('#clicks').innerText(),'0');
await go(17);await page.keyboard.press('ArrowLeft');await page.waitForTimeout(1400);
assert.equal(await page.locator('#stage').getAttribute('data-step'),'16');
await go(18);await page.selectOption('#speed','1.4');await page.click('#play');await page.waitForTimeout(1550);
assert.equal(await page.locator('#play').innerText(),'▶ Reproducir');
await page.setViewportSize({width:1366,height:768});await go(7);
assert.ok(await page.locator('#next').isVisible());
await page.emulateMedia({reducedMotion:'reduce'});await page.click('#count');
assert.equal(await page.locator('.spinner').evaluate(n=>getComputedStyle(n).animationName),'none');
assert.equal(await page.locator('#count').evaluate(n=>getComputedStyle(n).animationName),'none');
assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
console.log('60 snapshots: código fijo completo, interacción pendiente, halos, navegación, autoplay, viewport y movimiento reducido OK.');
await browser.close();
