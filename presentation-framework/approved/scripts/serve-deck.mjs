import { createServer } from "vite"
import { readArgument, resolveDeck } from "./deck-context.mjs"
import { createDeckViteConfig } from "./vite-config.mjs"

const context = await resolveDeck()
const port = Number(readArgument("port", "4173"))
const open = readArgument("open", "false") === "true"
const server = await createServer(
  createDeckViteConfig({
    deckArgument: context.deckDir,
    server: { port, strictPort: false, open },
  }),
)

await server.listen()
server.printUrls()
