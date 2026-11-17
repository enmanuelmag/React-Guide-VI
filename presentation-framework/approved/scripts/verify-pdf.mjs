import { mkdir, readdir, readFile, unlink } from "node:fs/promises"
import { spawn } from "node:child_process"
import path from "node:path"
import { resolveDeck } from "./deck-context.mjs"

const context = await resolveDeck()
const pdfPath = path.join(context.artifactDir, "presentation.pdf")
const textPath = path.join(context.reviewDir, "presentation.txt")
const rasterDir = path.join(context.reviewDir, "pdf")
const rasterPrefix = path.join(rasterDir, "page")
const audit = JSON.parse(await readFile(path.join(context.reviewDir, "audit.json"), "utf8"))
await mkdir(rasterDir, { recursive: true })

async function run(command, args, { capture = false } = {}) {
  return await new Promise((resolve, reject) => {
    const chunks = []
    const child = spawn(command, args, { stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit" })
    if (capture) child.stdout.on("data", (chunk) => chunks.push(chunk))
    child.on("error", reject)
    child.on("exit", (code) => {
      if (code !== 0) return reject(new Error(`${command} terminó con código ${code}`))
      resolve(Buffer.concat(chunks).toString("utf8"))
    })
  })
}

const info = await run("pdfinfo", [pdfPath], { capture: true })
const pageMatch = info.match(/^Pages:\s+(\d+)$/m)
const pageCount = pageMatch ? Number(pageMatch[1]) : 0
if (pageCount !== audit.slideCount) {
  throw new Error(`El PDF tiene ${pageCount} páginas; se esperaban ${audit.slideCount}.`)
}

await run("pdftotext", [pdfPath, textPath])
const pdfText = (await readFile(textPath, "utf8")).replace(/\s+/g, " ").trim().toLocaleLowerCase("es")

for (const note of audit.notes ?? []) {
  const phrase = note.replace(/\s+/g, " ").trim().toLocaleLowerCase("es").split(" ").slice(0, 8).join(" ")
  if (phrase && pdfText.includes(phrase)) {
    throw new Error(`El PDF expone una nota docente: “${phrase}…”.`)
  }
}

for (const file of await readdir(rasterDir, { withFileTypes: true })) {
  if (file.isFile() && /^page-\d+.*\.png$/.test(file.name)) await unlink(path.join(rasterDir, file.name))
}

await run("pdftoppm", ["-png", "-r", "150", pdfPath, rasterPrefix])
const rasterCount = (await readdir(rasterDir)).filter((file) => /^page-\d+\.png$/.test(file)).length
if (rasterCount !== audit.slideCount) {
  throw new Error(`La rasterización produjo ${rasterCount} PNG; se esperaban ${audit.slideCount}.`)
}

console.log(`PDF verificado: ${pageCount} páginas · ${rasterCount} rasterizaciones · notas privadas ausentes`)
