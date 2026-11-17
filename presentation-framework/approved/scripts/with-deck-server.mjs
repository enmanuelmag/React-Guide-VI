import { createServer } from "vite"
import { createDeckViteConfig } from "./vite-config.mjs"

export async function withDeckServer(deckDir, callback) {
  const server = await createServer(
    createDeckViteConfig({
      deckArgument: deckDir,
      server: { port: 0, strictPort: false },
    }),
  )

  await server.listen()
  const url = server.resolvedUrls?.local?.[0]

  if (!url) {
    await server.close()
    throw new Error("Vite no devolvió una URL local.")
  }

  try {
    return await callback(url)
  } finally {
    await server.close()
  }
}
