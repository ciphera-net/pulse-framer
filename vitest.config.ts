// Separate from vite.config.ts on purpose: the dev server's mkcert plugin
// downloads a certificate tool from GitHub at config time, which a test run
// (and CI) must never depend on. The tests cover src/pulse.ts only.
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
})
