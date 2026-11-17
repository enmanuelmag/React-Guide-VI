import { mkdir, rm } from "node:fs/promises"
import path from "node:path"
import { chromium } from "playwright"
import { resolveDeck } from "./deck-context.mjs"
import { withDeckServer } from "./with-deck-server.mjs"

const context = await resolveDeck()
const slidesDir = path.join(context.reviewDir, "slides")
await rm(slidesDir, { recursive: true, force: true })
await mkdir(slidesDir, { recursive: true })

const count = await withDeckServer(context.deckDir, async (url) => {
  const browser = await chromium.launch({ headless: true })

  try {
    const indexPage = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })
    await indexPage.goto(url, { waitUntil: "networkidle" })
    await indexPage.evaluate(() => window.deckReady)
    const slideCount = await indexPage.evaluate(() => window.RevealDeck.getTotalSlides())
    await indexPage.close()

    for (let index = 0; index < slideCount; index += 1) {
      const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })
      await page.goto(url, { waitUntil: "networkidle" })
      await page.evaluate(() => window.deckReady)
      await page.evaluate(() => document.fonts.ready)
      await page.evaluate(() => document.documentElement.classList.add("capture-mode"))
      await page.evaluate((slideIndex) => window.RevealDeck.slide(slideIndex, 0, -1), index)
      await page.waitForFunction((slideIndex) => window.RevealDeck.getIndices().h === slideIndex, index)
      await page.waitForTimeout(1000)
      await page.evaluate(() => {
        window.RevealDeck.getCurrentSlide().querySelectorAll(".fragment").forEach((fragment) => {
          if (!fragment.closest("pre")) fragment.classList.add("visible")
        })
      })
      await page.waitForTimeout(300)
      const slideId = await page.locator(".reveal .slides > section.present").getAttribute("data-slide-id")
      const fileName = `${String(index + 1).padStart(2, "0")}-${slideId ?? `slide-${index + 1}`}.png`
      await page.screenshot({ path: path.join(slidesDir, fileName), fullPage: false })
      await page.close()
    }

    return slideCount
  } finally {
    await browser.close()
  }
})

console.log(`PNG: ${count} slides en ${slidesDir}`)
