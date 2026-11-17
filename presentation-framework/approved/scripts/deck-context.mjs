import { access } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

export const packageRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)))
export const repositoryRoot = path.resolve(packageRoot, "../..")

export function readArgument(name, fallback) {
  const index = process.argv.indexOf(`--${name}`)
  return index >= 0 ? process.argv[index + 1] : fallback
}

export async function resolveDeck(deckArgument = readArgument("deck")) {
  if (!deckArgument) {
    throw new Error("Falta --deck <ruta>.")
  }

  const deckDir = path.resolve(process.cwd(), deckArgument)
  const indexPath = path.join(deckDir, "index.html")
  await access(indexPath)

  return {
    deckDir,
    indexPath,
    artifactDir: path.join(deckDir, "artifacts"),
    buildDir: path.join(deckDir, "artifacts", "build"),
    reviewDir: path.join(deckDir, "artifacts", "review"),
  }
}
