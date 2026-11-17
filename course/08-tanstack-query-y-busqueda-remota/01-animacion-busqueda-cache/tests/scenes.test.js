import test from 'node:test';
import assert from 'node:assert/strict';
import {codeLines,makeSteps} from '../src/scenes.js';
test('borrador no envía peticiones ni modifica pedido',()=>{
  const s=makeSteps();for(let i=0;i<=4;i++){assert.equal(s[i].requests,0);assert.equal(s[i].submitted,null);}
  assert.equal(s[14].draftType,'series');assert.equal(s[14].submitted.mediaType,'movie');assert.equal(s[14].view,'movie');
});
test('keys separadas y caché fresco sin tercera petición',()=>{
  const s=makeSteps();assert.equal(s[16].requests,2);assert.equal(s[17].active,'series');
  assert.match(s[17].movie,/fresco/);assert.match(s[17].series,/fresco/);
  assert.equal(s[18].requests,2);assert.equal(s[18].fetchStatus,'idle');assert.equal(s[18].view,'movie');
});
test('vacío es éxito; error sin datos se recupera con otra petición',()=>{
  const e=makeSteps('empty');assert.equal(e[13].status,'success');assert.equal(e[13].view,'empty');assert.equal(e[18].requests,2);
  const f=makeSteps('error');assert.equal(f[13].status,'error');assert.equal(f[18].requests,3);assert.equal(f[19].view,'movie');
});
test('todos los marcadores apuntan a código fijo y snapshots reproducibles',()=>{
  for(const scenario of ['success','empty','error']){
    const s=makeSteps(scenario);assert.equal(s.length,20);assert.deepEqual(s,makeSteps(scenario));
    for(const step of s)for(const n of step.lines)assert.ok(n>0&&n<=codeLines.length);
  }
});
