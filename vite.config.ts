import { existsSync } from "node:fs"
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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert({ mkcertPath: localMkcert, autoUpgrade: false }), framer()],
})
