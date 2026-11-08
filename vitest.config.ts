// Separate from vite.config.ts on purpose: the dev server's mkcert plugin
// downloads a certificate tool from GitHub at config time, which a test run
// (and CI) must never depend on. The tests cover src/pulse.ts, plus src/review.test.ts reading the plugin's source
// the way Framer's code review does.
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
})
