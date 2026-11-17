import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import { packageRoot, repositoryRoot } from "./deck-context.mjs"

export function createDeckViteConfig({ deckArgument, outDir, server = {} }) {
  const deckDir = path.resolve(process.cwd(), deckArgument)

  return {
    root: deckDir,
    base: "./",
    publicDir: path.join(packageRoot, "public"),
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "/src": path.join(packageRoot, "src"),
      },
    },
    server: {
      host: "127.0.0.1",
      fs: {
        allow: [repositoryRoot, packageRoot, deckDir],
      },
      ...server,
    },
    build: {
      outDir: outDir ?? path.join(deckDir, "artifacts", "build"),
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        input: path.join(deckDir, "index.html"),
      },
    },
  }
}
