import { describe, expect, it } from "vitest"

// Framer reviews the code of every uploaded version and hides one it fails (RELEASING.md, "Framer's automatic code
// review"). These read the source the way that review does: the plugin never reads project or publish information
// (19-10-2026), and its first read of the custom code has a failure path (08-11-2026). The files come in through
// Vite's raw import, so the test needs no Node types.
const files = import.meta.glob<string>(["./*.ts", "./*.tsx", "!./*.test.ts"], {
  query: "?raw",
  import: "default",
  eager: true,
})
const source = Object.values(files).join("\n")

describe("what Framer's code review reads", () => {
  it("reads the plugin's own source", () => {
    expect(Object.keys(files)).toEqual(expect.arrayContaining(["./App.tsx", "./pulse.ts"]))
  })

  it("never reads the project's publish or project information", () => {
    expect(source).not.toMatch(/getPublishInfo|getProjectInfo/)
  })

  it("handles a failed first read of the custom code", () => {
    expect(source).toMatch(/getCustomCode\(\)\.then\(\s*\([^)]*\)\s*=>[^\n]*,\s*\(\)\s*=>/)
  })

  // The second review (08-11-2026) asked how users are told what the installed script collects; 1.0.3 answers in the
  // install form itself, with a link to the published list.
  it("tells the user what Pulse collects before they install it", () => {
    expect(files["./pulse.ts"]).toContain('PRIVACY_URL = "https://docs.ciphera.net/pulse/privacy"')
    expect(files["./App.tsx"]).toMatch(/never stores IP addresses[\s\S]{0,200}href=\{PRIVACY_URL\}[\s\S]{0,120}What Pulse collects/)
  })
})
