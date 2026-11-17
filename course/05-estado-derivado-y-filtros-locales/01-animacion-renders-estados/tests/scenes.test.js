import test from 'node:test';
import assert from 'node:assert/strict';
import { steps, chapters, boundedStep, visibleCode } from '../src/scenes.js';

test('single setter preserves the old snapshot and view until render and commit', () => {
  assert.equal(steps[8].snapshot.query, '');
  assert.equal(steps[8].committed.query, '');
  assert.deepEqual(steps[8].queue, [{ state: 'query', value: 'Dune' }]);
  assert.equal(steps[10].snapshot.query, 'Dune');
  assert.equal(steps[10].committed.query, '');
  assert.equal(steps[12].committed.query, 'Dune');
});

test('two updates in one event never commit a half-applied state', () => {
  assert.equal(steps[15].queue.length, 1);
  assert.equal(steps[16].queue.length, 2);
  for (const step of steps.slice(13, 20)) {
    assert.deepEqual(step.committed, { query: 'Dune', onlySeries: false });
  }
  assert.deepEqual(steps[18].snapshot, { query: '', onlySeries: true });
  assert.deepEqual(steps[20].committed, { query: '', onlySeries: true });
});

test('snapshots are recoverable without depending on previously visited milestones', () => {
  const original = JSON.stringify(steps[8]);
  for (const index of [20, 0, 15, 8, 21, 8]) assert.equal(steps[boundedStep(index)].index, index);
  assert.equal(JSON.stringify(steps[8]), original);
  assert.equal(boundedStep(-1), 0);
  assert.equal(boundedStep(100), steps.length - 1);
});

test('chapters cover all steps and every highlighted line is visible', () => {
  assert.deepEqual(chapters.flatMap(chapter => Array.from({ length: chapter.end - chapter.start + 1 }, (_, offset) => chapter.start + offset)), steps.map(step => step.index));
  for (const step of steps) {
    const numbers = visibleCode(step.codeMode, step.lines).map(line => line.number);
    assert.ok(step.lines.every(line => numbers.includes(line)), step.title);
  }
});

test('all milestones preserve exactly the same source lines, including blank lines and comments', () => {
  const original = visibleCode();
  assert.ok(original.some(line => line.text === ''));
  assert.ok(original.some(line => line.text.includes('// Estados')));
  assert.ok(original.some(line => line.text.includes('// Interfaz')));
  for (const step of steps) assert.deepEqual(visibleCode(step.codeMode, step.lines), original);
});
