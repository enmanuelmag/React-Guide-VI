import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const url = process.env.ANALOGY_URL || 'http://127.0.0.1:5198/'
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  reducedMotion: 'reduce',
})
const page = await context.newPage()
const errors = []
const external = []
page.on('pageerror', (error) => errors.push(error.message))
page.on('request', (request) => {
  const host = new URL(request.url()).hostname
  if (!['127.0.0.1', 'localhost'].includes(host)) external.push(request.url())
})
await mkdir('artifacts', { recursive: true })

async function fingerprint() {
  return page.evaluate(() => ({
    step: document.querySelector('#stage').dataset.step,
    title: document.querySelector('#step-title').textContent,
    count: document.querySelector('#request-count').textContent,
    movie: document.querySelector('#movie-state').textContent,
    series: document.querySelector('#series-state').textContent,
    visible: document.querySelector('#visible-results').textContent,
    fetch: document.querySelector('#fetch-label').textContent,
  }))
}

try {
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const snapshots = []

  for (let i = 0; i < 23; i++) {
    snapshots.push(await fingerprint())
    assert.equal(snapshots[i].step, String(i))
    const entries = page.locator('[data-cache-entry]:not([hidden])')
    const expectedEntries = i < 6 ? 0 : i < 14 ? 1 : 2
    assert.equal(await entries.count(), expectedEntries, 'Cajas guardadas en paso ' + i)
    assert.equal(await page.locator('#empty-cabinet').isVisible(), i < 6)
    await page.screenshot({ path: 'artifacts/step-' + String(i).padStart(2, '0') + '.png' })

    const outside = await page.evaluate(() => {
      const ids = ['step-title', 'description', 'takeaway', 'visible-results', 'chapters']
      return ids.filter((id) => {
        const el = document.getElementById(id)
        return el.scrollWidth > el.clientWidth + 2
      })
    })
    assert.deepEqual(outside, [], 'Texto recortado en paso ' + i)

    if (i < 22) await page.keyboard.press('ArrowRight')
  }

  assert.equal(snapshots[9].count, '1')
  assert.equal(snapshots[17].movie, 'Necesita revisión')
  assert.equal(snapshots[17].count, '2')
  assert.equal(snapshots[17].fetch, 'Sin petición en curso')
  assert.ok(snapshots[19].visible.includes('Dune'))
  assert.equal(snapshots[19].fetch, 'Petición en curso')

  for (let i = 22; i >= 0; i--) {
    assert.deepEqual(await fingerprint(), snapshots[i], 'Estado distinto al retroceder: ' + i)
    if (i > 0) await page.keyboard.press('ArrowLeft')
  }

  await page.getByRole('button', { name: 'Pasa el tiempo', exact: true }).click()
  assert.equal((await fingerprint()).step, '16')
  await page.locator('[data-step="17"]').click()
  assert.equal((await fingerprint()).movie, 'Necesita revisión')
  assert.equal((await fingerprint()).count, '2')

  await page.locator('#include-extra').check()
  await page.locator('#next').focus()
  await page.keyboard.press('End')
  assert.equal((await fingerprint()).step, '25')
  assert.equal((await fingerprint()).movie, 'Sin respuesta')
  assert.equal((await fingerprint()).series, 'Sin respuesta')
  assert.equal(await page.locator('[data-cache-entry]:not([hidden])').count(), 0)
  assert.ok(await page.locator('#empty-cabinet').isVisible())

  await page.locator('#include-extra').uncheck()
  assert.equal((await fingerprint()).step, '22')
  await page.getByRole('button', { name: 'Guía de uso' }).click()
  assert.ok(await page.locator('#help-dialog').isVisible())
  await page.keyboard.press('Escape')
  assert.ok(!await page.locator('#help-dialog').isVisible())

  await page.setViewportSize({ width: 1108, height: 1090 })
  await page.locator('#restart').click()
  await page.screenshot({ path: 'artifacts/laptop.png' })
  assert.ok(await page.locator('#next').isVisible())

  // Zoom de navegador: la página conserva flujo y desplazamiento en vez de anularlo.
  await page.evaluate(() => document.body.style.zoom = '1.25')
  const zoomOverflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > innerWidth + 2,
  )
  assert.equal(zoomOverflow, false)
  await page.screenshot({ path: 'artifacts/zoom.png', fullPage: true })
  await page.evaluate(() => document.body.style.zoom = '')

  await context.close()
  const motionPage = await browser.newPage({ viewport: { width: 1440, height: 1100 } })
  motionPage.on('pageerror', (error) => errors.push(error.message))
  await motionPage.goto(url, { waitUntil: 'networkidle' })
  await motionPage.keyboard.press('ArrowRight')
  await motionPage.keyboard.press('ArrowRight')
  await motionPage.keyboard.press('ArrowRight')
  await motionPage.waitForTimeout(400)
  assert.ok(Number(await motionPage.locator('#packet').evaluate((el) => getComputedStyle(el).opacity)) > .9)
  await motionPage.screenshot({ path: 'artifacts/travel.png' })
  await motionPage.locator('#play').click()
  await motionPage.locator('#speed').selectOption('3')
  await motionPage.waitForTimeout(3200)
  assert.equal(await motionPage.locator('#stage').getAttribute('data-step'), '4')
  await motionPage.locator('#play').click()

  assert.deepEqual(errors, [])
  assert.deepEqual(external, [])
  console.log('OK: 23 estados, reversibilidad, frescura, refetch, extra, flechas, autoplay, movimiento reducido, portátil y zoom. Sin errores ni requests externos.')
} finally {
  await browser.close()
}

