import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { steps } from '../src/scenes.js';

const baseUrl = process.env.ANIMATION_URL ?? 'http://127.0.0.1:5185';
await mkdir(new URL('../artifacts/', import.meta.url), { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1180 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
const at = async index => {
  await page.locator('#stage').evaluate((node, target) => { node.dataset.expected = String(target); }, index);
  assert.equal(await page.locator('#stage').getAttribute('data-step'), String(index));
};
const capture = async name => page.screenshot({ path: new URL(`../artifacts/${name}.png`, import.meta.url).pathname });
try {
  await page.goto(baseUrl);
  await page.locator('#title').filter({ hasText: 'React llama' }).waitFor();
  const constantCode = await page.locator('#code').textContent();
  const lineCount = await page.locator('#code .code-line').count();
  await capture('01-primer-render');
  for (let index = 0; index < steps.length; index++) {
    await at(index);
    const geometry = await page.evaluate(() => {
      const code = document.querySelector('#code');
      const body = document.querySelector('.code-body');
      const controls = document.querySelector('.controls');
      const consolePanel = document.querySelector('.console-panel');
      const codeLines = [...code.querySelectorAll('.code-line code')];
      return {
        allCodeFits: code.scrollHeight <= document.querySelector('.code-scroll').clientHeight + 1,
        linesFit: codeLines.every(line => line.getBoundingClientRect().right <= body.getBoundingClientRect().right + 1),
        controlsFit: controls.getBoundingClientRect().bottom <= innerHeight,
        previewFits: document.querySelector('#app-preview').hidden || document.querySelector('#mode').getBoundingClientRect().bottom <= document.querySelector('.browser-panel').getBoundingClientRect().bottom,
        consoleFits: document.querySelector('#console').getBoundingClientRect().bottom <= consolePanel.getBoundingClientRect().bottom,
      };
    });
    assert.ok(Object.values(geometry).every(Boolean), `Layout step ${index}: ${JSON.stringify(geometry)}`);
    assert.equal(await page.locator('#code').textContent(), constantCode);
    assert.equal(await page.locator('#code .code-line').count(), lineCount);
    if (index < steps.length - 1) await page.keyboard.press('ArrowRight');
  }
  await page.keyboard.press('ArrowRight');
  await at(21);
  await page.keyboard.press('Home');
  await at(0);
  await page.keyboard.press('ArrowLeft');
  await at(0);
  await page.locator('[data-chapter="1"]').click();
  assert.equal(await page.locator('#query-input').getAttribute('data-change-origin'), 'usuario');
  assert.equal(await page.locator('#query-input').evaluate(node => getComputedStyle(node).animationName), 'change-halo');
  await page.locator('[data-step="8"]').click();
  await at(8);
  assert.equal(await page.locator('#state-query').textContent(), '""');
  assert.equal(await page.locator('#echo-value').textContent(), '""');
  assert.equal(await page.locator('#query-input').inputValue(), 'Dune');
  assert.equal(await page.locator('#queue .pending').count(), 1);
  await page.locator('[data-step="12"]').click();
  assert.equal(await page.locator('#echo').getAttribute('data-change-origin'), 'react');
  assert.equal(await page.locator('#query-input').getAttribute('data-change-origin'), null);
  assert.equal(await page.locator('#echo-value').textContent(), '"Dune"');
  await page.locator('#only-series').check();
  await at(13);
  assert.equal(await page.locator('#only-series').getAttribute('data-change-origin'), 'usuario');
  await page.locator('[data-step="16"]').click();
  assert.equal(await page.locator('#queue .pending').count(), 2);
  assert.equal(await page.locator('#state-series').textContent(), 'false');
  assert.equal(await page.locator('#echo-value').textContent(), '"Dune"');
  await capture('02-dos-setters-pendientes');
  await page.locator('[data-step="19"]').click();
  await page.waitForTimeout(350);
  await capture('03-barrido-render');
  await page.locator('[data-step="20"]').click();
  assert.equal(await page.locator('#view-series').textContent(), 'Solo series');
  assert.equal(await page.locator('#echo-value').textContent(), '""');
  assert.equal(await page.locator('#only-series').isChecked(), true);
  await capture('04-commit-agrupado');
  await page.locator('[data-step="16"]').click();
  assert.equal(await page.locator('#queue .pending').count(), 2);
  assert.equal(await page.locator('#view-series').textContent(), 'Todos');
  // Rapid navigation interrupts an unfinished sweep without stale callbacks.
  for (const key of ['End', 'Home', 'End', 'ArrowLeft', 'ArrowLeft', 'Home']) await page.keyboard.press(key);
  await at(0);
  assert.equal(await page.locator('#queue .pending').count(), 0);
  await page.locator('#help').click();
  assert.equal(await page.locator('#help-panel').isVisible(), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#help-panel').isVisible(), false);
  await page.locator('#speed').selectOption('1.4');
  await page.locator('#play').click();
  await page.waitForTimeout(1500);
  await at(1);
  await page.keyboard.press('ArrowLeft');
  await at(0);
  await page.waitForTimeout(1500);
  await at(0);
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowLeft');
  await page.locator('#play').click();
  await page.waitForTimeout(1500);
  await at(21);
  assert.match(await page.locator('#play').textContent(), /Reproducir/);
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.waitForFunction(() => document.querySelector('#stage').getBoundingClientRect().right <= innerWidth + 1);
  const fits = await page.locator('#stage').evaluate(node => { const rect = node.getBoundingClientRect(); return rect.left >= 0 && rect.top >= 0 && rect.right <= innerWidth + 1 && rect.bottom <= innerHeight + 1; });
  assert.ok(fits);
  await capture('05-portatil');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('[data-step="20"]').click();
  assert.equal(await page.locator('#echo').evaluate(node => getComputedStyle(node).animationName), 'none');
  await page.locator('[data-step="19"]').click();
  assert.equal(await page.locator('#sweep').evaluate(node => getComputedStyle(node).opacity), '0');
  // Emulate the DPR/CSS viewport relationship produced by 200% browser zoom.
  const beforeZoom = await page.locator('#stage').evaluate(node => node.getBoundingClientRect().width);
  await page.evaluate(() => Object.defineProperty(window, 'devicePixelRatio', { configurable: true, get: () => 2 }));
  await page.setViewportSize({ width: 683, height: 384 });
  await page.waitForFunction(() => document.body.scrollWidth > innerWidth);
  const zoom = await page.evaluate(() => ({ width: document.querySelector('#stage').getBoundingClientRect().width, scrollable: document.body.scrollWidth > innerWidth }));
  assert.ok(Math.abs(zoom.width - beforeZoom) < 1, 'Zoom must not shrink the fitting scale');
  assert.ok(zoom.scrollable, 'Enlarged canvas remains reachable through page scrolling');
  assert.deepEqual(errors, []);
  console.log('Browser OK: 22 stable code snapshots, layouts, keyboard, batching, autoplay, 1366×768, reduced motion and emulated browser zoom metrics.');
} finally { await browser.close(); }
