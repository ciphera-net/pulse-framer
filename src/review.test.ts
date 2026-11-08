import { readFileSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

// Framer reviews the code of every uploaded version and hides one it fails (RELEASING.md, "Framer's automatic code
// review"). These read the source the way that review does: the plugin never reads project or publish information
// (19-10-2026), and its first read of the custom code has a failure path (08-11-2026).
const dir = fileURLToPath(new URL(".", import.meta.url))
const source = readdirSync(dir)
  .filter((f) => /\.tsx?$/.test(f) && !/\.test\.tsx?$/.test(f))
  .map((f) => readFileSync(dir + f, "utf8"))
  .join("\n")

describe("what Framer's code review reads", () => {
  it("never reads the project's publish or project information", () => {
    expect(source).not.toMatch(/getPublishInfo|getProjectInfo/)
  })

  it("handles a failed first read of the custom code", () => {
    expect(source).toMatch(/getCustomCode\(\)\.then\(\s*\([^)]*\)\s*=>[^\n]*,\s*\(\)\s*=>/)
  })
})
