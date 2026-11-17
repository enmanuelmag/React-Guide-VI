import { createDeckViteConfig } from "./scripts/vite-config.mjs"

export default createDeckViteConfig({
  deckArgument: process.env.DECK_ROOT ?? "gallery",
})
