import test from 'node:test';
import assert from 'node:assert/strict';
import {codeLines,makeSteps} from '../src/scenes.js';
test('el código permanece fijo y cada marcador apunta a una línea existente',()=>{
  for(const scenario of ['success','http','network']){
    const steps=makeSteps(scenario);
    assert.equal(steps.length,20);
    for(const s of steps) for(const n of [...s.lines,...(s.waitLine?[s.waitLine]:[])]) assert.ok(n>0&&n<=codeLines.length);
    assert.deepEqual(makeSteps(scenario),steps);
  }
});
test('setters solicitados y commits visibles son pasos distintos',()=>{
  const s=makeSteps();
  assert.equal(s[2].loading,false);assert.equal(s[5].loading,true);
  assert.equal(s[8].clicks,0);assert.equal(s[9].clicks,1);
  assert.equal(s[16].loading,true);assert.equal(s[18].loading,false);
  assert.notEqual(s[6].waitLine,s[14].waitLine);
});
test('HTTP 500 tiene Response; rechazo de red no tiene Response',()=>{
  assert.match(makeSteps('http')[13].logs[0],/500/);
  assert.match(makeSteps('network')[13].logs[0],/No existe/);
  assert.equal(makeSteps('network')[12].packet,false);
  assert.equal(makeSteps('http')[18].message,'HTTP 500');
  assert.equal(makeSteps('network')[18].message,'Error de red');
});
