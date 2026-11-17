import test from 'node:test'
import assert from 'node:assert/strict'
import { makeStory, dataFor } from '../story.js'

test('el recorrido principal no incluye el epílogo de retirada', () => {
  assert.equal(makeStory().length, 23)
  assert.equal(makeStory(true).length, 26)
  assert.ok(makeStory().every((step) => !step.optional))
})

test('las primeras respuestas se almacenan después del viaje de vuelta', () => {
  const story = makeStory()
  assert.equal(story[5].movie, 'empty')
  assert.equal(story[6].movie, 'fresh')
  assert.equal(story[13].series, 'empty')
  assert.equal(story[14].series, 'fresh')
})

test('reutilizar una respuesta reciente no añade peticiones', () => {
  const story = makeStory()
  assert.equal(story[9].requests, 1)
  assert.equal(story[15].requests, 2)
  assert.equal(story[9].fetching, false)
  assert.equal(story[15].served, 'movie')
})

test('otra etiqueta no usa las películas como respuesta de series', () => {
  const story = makeStory()
  assert.equal(story[10].served, 'none')
  assert.equal(story[11].series, 'empty')
  assert.equal(story[11].movie, 'fresh')
  assert.equal(story[12].requests, 2)
})

test('vencer staleTime conserva los datos y no inicia una petición', () => {
  const story = makeStory()
  assert.equal(story[17].movie, 'stale')
  assert.equal(story[17].series, 'fresh')
  assert.equal(story[17].requests, 2)
  assert.equal(story[17].fetching, false)
  assert.equal(story[17].active, 'series')
})

test('reactivar una consulta stale muestra datos mientras actualiza', () => {
  const story = makeStory()
  assert.equal(story[18].served, 'movie')
  assert.equal(story[18].servedVersion, 1)
  assert.equal(story[18].fetching, true)
  assert.equal(story[18].requests, 3)
  assert.equal(story[21].movie, 'fresh')
  assert.equal(story[21].servedVersion, 2)
  assert.equal(story[21].fetching, false)
})

test('retirar es distinto de marcar stale y no escribe en el servidor', () => {
  const story = makeStory(true)
  assert.equal(story[23].active, null)
  assert.equal(story[24].movie, 'stale')
  assert.equal(story[25].movie, 'empty')
  assert.equal(story[25].series, 'empty')
  assert.equal(story[25].requests, 3)
})

test('reconstruir o recorrer al revés no altera las fotografías anteriores', () => {
  const story = makeStory(true)
  const initial = JSON.stringify(story)
  for (const step of [...story].reverse()) {
    assert.ok(Object.isFrozen(step))
    dataFor(step.served, step.servedVersion)
  }
  assert.equal(JSON.stringify(story), initial)
  assert.deepEqual(makeStory(true), story)
})

