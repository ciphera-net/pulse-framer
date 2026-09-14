import { existsSync, readFileSync } from "node:fs"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import mkcert from "vite-plugin-mkcert"
import framer from "vite-plugin-framer"

// Framer loads a development plugin from https://localhost, so the dev server
// needs a locally trusted certificate. vite-plugin-mkcert otherwise DOWNLOADS
// the mkcert binary through the GitHub API on first run, which fails on a
// rate-limited network (measured 15-09-2026: "403: rate limit exceeded").
// Prefer a locally installed mkcert (`brew install mkcert`) and never upgrade
// it from the network. Run `mkcert -install` once so the browser trusts the CA.
const localMkcert = ["/opt/homebrew/bin/mkcert", "/usr/local/bin/mkcert"].find((p) => existsSync(p))

// The Marketplace derives a version's identity from the uploaded bundle, and
// rejects a duplicate ("unique constraint violation … already exists", measured
// 15-09-2026 on a re-pack of the same build). Baking package.json's version into
// the bundle makes every release a distinct upload.
const { version } = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")) as { version: string }

// https://vitejs.dev/config/
export default defineConfig({
  define: { __PLUGIN_VERSION__: JSON.stringify(version) },
  plugins: [react(), mkcert({ mkcertPath: localMkcert, autoUpgrade: false }), framer()],
})
