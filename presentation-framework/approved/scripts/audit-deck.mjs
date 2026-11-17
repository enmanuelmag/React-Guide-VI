import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { chromium } from "playwright"
import { GEOMETRY_IDS, SEMANTIC_IDS } from "../src/layouts/layout-registry.js"
import { resolveDeck } from "./deck-context.mjs"
import { withDeckServer } from "./with-deck-server.mjs"

const context = await resolveDeck()
const externalRequests = []

const report = await withDeckServer(context.deckDir, async (url) => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })

  page.on("request", (request) => {
    const requestUrl = new URL(request.url())
    if (requestUrl.protocol.startsWith("http") && !["127.0.0.1", "localhost"].includes(requestUrl.hostname)) {
      externalRequests.push(request.url())
    }
  })

  try {
    await page.goto(url, { waitUntil: "networkidle" })
    await page.evaluate(() => window.deckReady)
    await page.evaluate(() => document.fonts.ready)

    return await page.evaluate(async () => {
      const slides = [...document.querySelectorAll(".reveal .slides > section")]
      const issues = []
      const seenIds = new Set()

      const addIssue = (slideId, type, detail) => issues.push({ slideId, type, detail })

      for (const [index, section] of slides.entries()) {
        window.RevealDeck.slide(index, 0, -1)
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

        const slideId = section.dataset.slideId ?? `index-${index}`
        const geometry = section.dataset.geometry ?? ""
        const semantic = (section.dataset.semantic ?? "").split(/\s+/).filter(Boolean)
        const frame = section.querySelector(":scope > .slide-frame")

        if (!section.dataset.slideId) addIssue(slideId, "metadata", "Falta data-slide-id")
        if (seenIds.has(slideId)) addIssue(slideId, "metadata", "data-slide-id duplicado")
        seenIds.add(slideId)
        if (!/^G(?:0[1-9]|1[0-8])$/.test(geometry)) addIssue(slideId, "metadata", `Geometría inválida: ${geometry || "vacía"}`)
        if (semantic.length === 0 || semantic.some((id) => !/^S(?:0[1-9]|[1-5][0-9])$/.test(id))) {
          addIssue(slideId, "metadata", `Casos semánticos inválidos: ${semantic.join(" ") || "vacíos"}`)
        }
        if (!section.querySelector("h1, h2, [aria-label]")) addIssue(slideId, "accessibility", "Falta título accesible")
        if (!frame) {
          addIssue(slideId, "structure", "Falta .slide-frame")
          continue
        }

        const sectionRect = section.getBoundingClientRect()
        const frameRect = frame.getBoundingClientRect()
        if (frameRect.left < sectionRect.left - 1 || frameRect.right > sectionRect.right + 1 || frameRect.top < sectionRect.top - 1 || frameRect.bottom > sectionRect.bottom + 1) {
          addIssue(slideId, "safe-area", "El frame sale del lienzo")
        }
        if (section.scrollWidth > section.clientWidth + 1 || section.scrollHeight > section.clientHeight + 1) {
          addIssue(slideId, "overflow", `${section.scrollWidth}×${section.scrollHeight} sobre ${section.clientWidth}×${section.clientHeight}`)
        }

        section.querySelectorAll("img").forEach((image) => {
          if (!image.alt.trim()) addIssue(slideId, "asset", `Alt vacío: ${image.getAttribute("src")}`)
          if (!image.complete || image.naturalWidth === 0) addIssue(slideId, "asset", `Imagen ausente: ${image.getAttribute("src")}`)
          if (/^https?:/i.test(image.getAttribute("src") ?? "")) addIssue(slideId, "asset", `Asset remoto: ${image.getAttribute("src")}`)
          const rect = image.getBoundingClientRect()
          if (rect.width > 0 && image.naturalWidth / rect.width < 1.5) addIssue(slideId, "asset", `Resolución menor a 1.5×: ${image.getAttribute("src")}`)
        })

        section.querySelectorAll("p, li, td, th, figcaption, .slide-label, .slide-folio, .state-index").forEach((element) => {
          if (element.closest("aside.notes") || element.classList.contains("visually-hidden")) return
          const size = Number.parseFloat(getComputedStyle(element).fontSize)
          if (size < 20) addIssue(slideId, "typography", `${element.tagName.toLowerCase()} usa ${size}px`)
        })

        section.querySelectorAll("pre code").forEach((element) => {
          const size = Number.parseFloat(getComputedStyle(element).fontSize)
          if (size < 25) addIssue(slideId, "typography", `Código usa ${size}px`)
          if (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1) {
            addIssue(
              slideId,
              "code-overflow",
              `Snippet recortado: ${element.scrollWidth}×${element.scrollHeight} sobre ${element.clientWidth}×${element.clientHeight}`,
            )
          }
        })
      }

      window.RevealDeck.slide(0, 0, -1)

      return {
        title: document.title,
        slideCount: slides.length,
        fontsReady: document.fonts.status === "loaded",
        notesCount: document.querySelectorAll("aside.notes").length,
        notes: [...document.querySelectorAll("aside.notes")].map((note) => note.textContent.trim()),
        issues,
      }
    })
  } finally {
    await browser.close()
  }
})

for (const id of report.issues.map((issue) => issue.detail.match(/G\d{2}|S\d{2}/g)).flat().filter(Boolean)) {
  if (!GEOMETRY_IDS.has(id) && !SEMANTIC_IDS.has(id)) {
    report.issues.push({ slideId: "deck", type: "metadata", detail: `ID fuera del catálogo: ${id}` })
  }
}

if (externalRequests.length > 0) {
  report.issues.push({ slideId: "deck", type: "network", detail: `Requests externos: ${externalRequests.join(", ")}` })
}

await mkdir(context.reviewDir, { recursive: true })
const reportPath = path.join(context.reviewDir, "audit.json")
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8")

console.log(`Audit: ${reportPath}`)
console.log(`Slides: ${report.slideCount} · Notas: ${report.notesCount} · Incidencias: ${report.issues.length}`)

if (report.issues.length > 0) {
  report.issues.forEach((issue) => console.error(`${issue.slideId} [${issue.type}] ${issue.detail}`))
  process.exitCode = 1
}
