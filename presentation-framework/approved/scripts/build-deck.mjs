import { build } from "vite"
import { resolveDeck } from "./deck-context.mjs"
import { createDeckViteConfig } from "./vite-config.mjs"

const context = await resolveDeck()

await build(
  createDeckViteConfig({
    deckArgument: context.deckDir,
    outDir: context.buildDir,
  }),
)

console.log(`Build: ${context.buildDir}`)
