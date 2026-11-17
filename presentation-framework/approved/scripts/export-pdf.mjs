import { mkdir } from "node:fs/promises"
import path from "node:path"
import { chromium } from "playwright"
import { resolveDeck } from "./deck-context.mjs"
import { withDeckServer } from "./with-deck-server.mjs"

const context = await resolveDeck()
await mkdir(context.artifactDir, { recursive: true })
const pdfPath = path.join(context.artifactDir, "presentation.pdf")

await withDeckServer(context.deckDir, async (url) => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })

  try {
    await page.goto(`${url}?print-pdf`, { waitUntil: "networkidle" })
    await page.evaluate(() => window.deckReady)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForFunction(() => {
      const slides = window.RevealDeck.getTotalSlides()
      return slides > 0 && document.querySelectorAll(".pdf-page").length >= slides
    })
    await page.evaluate(() => {
      document.querySelectorAll(".pdf-page section").forEach((slide) => {
        slide.removeAttribute("hidden")
        slide.removeAttribute("aria-hidden")
      })
      document.querySelectorAll(".pdf-page pre code.fragment").forEach((fragment) => fragment.remove())
    })
    await page.pdf({ path: pdfPath, printBackground: true, preferCSSPageSize: true })
  } finally {
    await browser.close()
  }
})

console.log(`PDF: ${pdfPath}`)
