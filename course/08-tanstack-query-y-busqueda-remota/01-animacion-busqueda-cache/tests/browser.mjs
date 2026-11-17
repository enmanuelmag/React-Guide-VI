import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {makeSteps,codeLines} from '../src/scenes.js';
await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1920,height:1180}});
const errors=[],external=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:5188')&&!r.url().startsWith('data:'))external.push(r.url());});
await page.goto('http://127.0.0.1:5188');await page.waitForLoadState('networkidle');
await page.locator('.code-line').first().waitFor();await page.evaluate(()=>document.fonts.ready);
const code=await page.locator('#code').innerText();
assert.deepEqual(await page.locator('.code-line code').allTextContents(),codeLines);
for(const token of ['variable','function','tag','attr-name'])assert.ok(await page.locator('#code .token.'+token).count()>0);
async function go(n){await page.locator('body').click({position:{x:5,y:5}});await page.keyboard.press('Home');for(let i=0;i<n;i++)await page.keyboard.press('ArrowRight');}
for(const scenario of ['success','empty','error']){
  await page.selectOption('#scenario',scenario);await go(0);
  for(let i=0;i<20;i++){
    if(i)await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#stage').getAttribute('data-step'),String(i));
    assert.equal(await page.locator('#code').innerText(),code);
    const view=makeSteps(scenario)[i].view;
    const expected={initial:'Envía una búsqueda',loading:'Cargando',error:'No pudimos buscar',empty:'Sin resultados',movie:'Resultados',series:'Resultados'}[view];
    assert.equal(await page.locator('#results .empty-message, #results .result-heading').innerText(),expected);
    assert.ok(code.includes("'"+expected+"'"),'El mensaje visible debe existir idéntico en el código.');
    const fit=await page.evaluate(()=>{
      const body=document.querySelector('.code-body'),code=document.querySelector('#code');
      return {scroll:getComputedStyle(body).overflowY==='auto',
        width:[...document.querySelectorAll('.code-line code')].every(n=>n.getBoundingClientRect().right<=body.getBoundingClientRect().right+1),
        preview:document.querySelector('.search-note').getBoundingClientRect().bottom<=document.querySelector('.browser-panel').getBoundingClientRect().bottom+1,
        console:document.querySelector('#console').scrollHeight<=document.querySelector('#console').clientHeight+1,
        canvas:document.querySelector('.controls').getBoundingClientRect().bottom<=1180};
    });
    assert.ok(Object.values(fit).every(Boolean),JSON.stringify({scenario,i,fit}));
  }
  await page.screenshot({path:'artifacts/'+scenario+'-final.png'});
}
await page.selectOption('#scenario','success');await go(2);assert.match(await page.locator('#network-count').innerText(),/0 POST/);
await go(14);assert.equal(await page.locator('#type-input').inputValue(),'series');
assert.ok(await page.locator('.code-body').evaluate(body=>{
  const row=body.querySelector('.active'),bounds=body.getBoundingClientRect(),active=row.getBoundingClientRect();
  return body.scrollHeight>body.clientHeight&&body.scrollTop>0&&active.top>=bounds.top&&active.bottom<=bounds.bottom;
}),'El paso debe llevar la línea activa al área visible del código.');
await page.locator('.code-body').evaluate(body=>{body.scrollTop=body.scrollHeight;});
assert.equal(await page.locator('#stage').getAttribute('data-step'),'14');
await page.keyboard.press('ArrowLeft');await page.keyboard.press('ArrowRight');
assert.match(await page.locator('#submitted-value').innerText(),/movie/);assert.match(await page.locator('#results').innerText(),/Dune: Parte dos/);
await page.screenshot({path:'artifacts/edit-without-submit.png'});
await go(17);await page.screenshot({path:'artifacts/two-cache-entries.png'});
await go(18);assert.match(await page.locator('#network-count').innerText(),/2 POST/);assert.equal(await page.locator('#fetch-status').innerText(),'idle');
await page.screenshot({path:'artifacts/reuse-fresh.png'});
await go(0);assert.equal(await page.locator('.code-body').evaluate(body=>body.scrollTop),0);
await go(12);await page.keyboard.press('ArrowLeft');await page.waitForTimeout(1400);assert.equal(await page.locator('#stage').getAttribute('data-step'),'11');
await go(19);await page.click('#play');assert.equal(await page.locator('#stage').getAttribute('data-step'),'0');await page.click('#play');
await go(18);await page.selectOption('#speed','1.4');await page.click('#play');await page.waitForTimeout(1550);
assert.equal(await page.locator('#play').innerText(),'▶ Reproducir');
await page.setViewportSize({width:1366,height:768});await go(9);await page.screenshot({path:'artifacts/loading-laptop.png'});
await page.emulateMedia({reducedMotion:'reduce'});
assert.equal(await page.locator('.spinner').evaluate(n=>getComputedStyle(n).animationName),'none');
await go(6);assert.equal(await page.locator('.cache-pulse').evaluate(n=>getComputedStyle(n).animationName),'none');
assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
console.log('60 snapshots OK: source complete, draft/submit, cache, errors, reverse, autoplay, laptop, reduced motion; no backend requests.');
await browser.close();
