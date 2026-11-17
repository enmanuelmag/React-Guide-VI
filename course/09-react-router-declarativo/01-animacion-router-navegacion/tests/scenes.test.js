import test from 'node:test';
import assert from 'node:assert/strict';
import { makeSteps, moveHistory, resolvePath } from '../src/scenes.js';
import { sources } from '../src/sources.js';

test('Link añade, Atrás y Adelante recorren, replace sustituye', () => {
  const start = {entries:['/'],position:0};
  const search = moveHistory(start,'REPLACE','/search');
  const detail = moveHistory(search,'PUSH','/media/movie/438631');
  assert.deepEqual(search,{entries:['/search'],position:0});
  assert.equal(moveHistory(detail,'BACK').position,0);
  assert.equal(moveHistory(moveHistory(detail,'BACK'),'FORWARD').position,1);
  const branch = moveHistory(moveHistory(detail,'BACK'),'PUSH','/otra');
  assert.deepEqual(branch.entries,['/search','/otra']);
  assert.deepEqual(start,{entries:['/'],position:0});
});
test('coincidencia y validación de dominio son decisiones distintas', () => {
  assert.equal(resolvePath('/media/anime/438631').route,'media/:mediaType/:externalId');
  assert.equal(resolvePath('/media/anime/438631').view,'invalid');
  assert.equal(resolvePath('/media/movie').route,'*');
  assert.equal(resolvePath('/una-cosa').view,'missing');
  assert.equal(resolvePath('/media/movie/438631').params.externalId,'438631');
});
test('regresar no restaura estado local ni añade historial', () => {
  const steps=makeSteps();
  assert.equal(steps[13].view,'detail');
  assert.equal(steps[15].view,'empty');
  assert.deepEqual(steps[15].history.entries,steps[13].history.entries);
  assert.equal(steps[15].history.position,0);
  assert.equal(steps[16].history.position,1);
});
test('cada escenario es reproducible y sus marcadores existen en la fuente', () => {
  for(const scenario of ['main','invalid','unknown','missing','redirect','direct','link-back']){
    assert.deepEqual(makeSteps(scenario),makeSteps(scenario));
    for(const step of makeSteps(scenario)){
      assert.ok(sources[step.file].split('\n')[step.line-1].includes(step.marker));
      assert.equal(step.url,step.history.entries[step.history.position]);
    }
  }
});
