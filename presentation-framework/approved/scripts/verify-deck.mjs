import { spawn } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { readArgument } from "./deck-context.mjs"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const deck = readArgument("deck")

if (!deck) throw new Error("Falta --deck <ruta>.")

const scripts = ["build-deck.mjs", "audit-deck.mjs", "capture-deck.mjs", "export-pdf.mjs", "verify-pdf.mjs"]

for (const script of scripts) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(scriptDir, script), "--deck", deck], {
      stdio: "inherit",
    })
    child.on("error", reject)
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${script} terminó con código ${code}`))))
  })
}
