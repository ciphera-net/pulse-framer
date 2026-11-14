import { describe, expect, it } from "vitest"
import type { CustomCode } from "@framer/plugin"
import {
  buildCustomCode,
  findPulseInstall,
  isValidDomain,
  normalizeDomain,
  stripPulse,
  withPulse,
} from "./pulse"

const empty = (): CustomCode => ({
  headStart: { html: null, disabled: false },
  headEnd: { html: null, disabled: false },
  bodyStart: { html: null, disabled: false },
  bodyEnd: { html: null, disabled: false },
})

describe("normalizeDomain / isValidDomain", () => {
  it("strips scheme, path, port and case", () => {
    expect(normalizeDomain(" HTTPS://Example.COM:443/path?x#y ")).toBe("example.com")
    expect(normalizeDomain("example.com.")).toBe("example.com")
  })
  it("keeps www — the Pulse site may be registered with it", () => {
    expect(normalizeDomain("www.example.com")).toBe("www.example.com")
  })
  it("accepts real hostnames and rejects attribute-breaking input", () => {
    expect(isValidDomain("example.com")).toBe(true)
    expect(isValidDomain("shop.example.co.uk")).toBe(true)
    expect(isValidDomain("xn--bcher-kva.example")).toBe(true)
    expect(isValidDomain("")).toBe(false)
    expect(isValidDomain("localhost")).toBe(false)
    expect(isValidDomain('a.com" onload="x')).toBe(false)
    expect(isValidDomain("a b.com")).toBe(false)
    expect(isValidDomain("-a.com")).toBe(false)
  })
})

describe("buildCustomCode", () => {
  it("is exactly the Pulse tag", () => {
    expect(buildCustomCode("example.com")).toBe(
      '<script defer data-domain="example.com" src="https://js.ciphera.net/script.js"></script>',
    )
  })
  it("is one tag, with no interactions script and no flag attributes", () => {
    const html = buildCustomCode("example.com")
    expect(html.split("\n")).toHaveLength(1)
    expect(html).not.toContain("script.interactions.js")
    expect(html).not.toMatch(/data-(no-|ignore-)/)
  })
  it("refuses a domain that could break the attribute", () => {
    expect(() => buildCustomCode('x.com"><script>')).toThrow()
  })
})

describe("findPulseInstall", () => {
  it("finds the plugin's own install", () => {
    const code = empty()
    code.headEnd.html = buildCustomCode("example.com")
    expect(findPulseInstall(code)).toEqual({ domain: "example.com", location: "headEnd", disabled: false })
  })
  it("finds a hand-pasted tag in another location, and reports disabled", () => {
    const code = empty()
    code.bodyEnd = { html: "<script defer data-domain='hand.example' src='https://js.ciphera.net/script.js'></script>", disabled: true }
    expect(findPulseInstall(code)).toEqual({ domain: "hand.example", location: "bodyEnd", disabled: true })
  })
  it("is null when there is no Pulse tag, even with other custom code present", () => {
    const code = empty()
    code.headEnd.html = "<meta name=\"x\" content=\"y\">"
    expect(findPulseInstall(code)).toBeNull()
    expect(findPulseInstall(null)).toBeNull()
  })
})

describe("stripPulse / withPulse — never touch code that is not ours", () => {
  const theirs = '<link rel="preconnect" href="https://fonts.gstatic.com">'
  it("removes only Pulse's tags", () => {
    const html = `${theirs}\n${buildCustomCode("example.com")}`
    expect(stripPulse(html)).toBe(theirs)
  })
  it("returns null when nothing is left, which clears the location", () => {
    expect(stripPulse(buildCustomCode("example.com"))).toBeNull()
    expect(stripPulse(null)).toBeNull()
    expect(stripPulse("   \n ")).toBeNull()
  })
  it("replaces an old Pulse install and keeps the rest", () => {
    const before = `${theirs}\n${buildCustomCode("old.example")}`
    const after = withPulse(before, buildCustomCode("new.example"))
    expect(after.startsWith(theirs)).toBe(true)
    expect(after).toContain('data-domain="new.example"')
    expect(after).not.toContain("old.example")
    expect(after.match(/script\.js/g)).toHaveLength(1)
  })
  const legacy = (domain: string) =>
    `<script defer data-domain="${domain}" src="https://js.ciphera.net/script.js"></script>\n<script defer src="https://js.ciphera.net/script.interactions.js"></script>`
  it("removes the interactions tag that versions before 1.1.0 wrote", () => {
    expect(stripPulse(`${theirs}\n${legacy("example.com")}`)).toBe(theirs)
    expect(stripPulse(legacy("example.com"))).toBeNull()
  })
  it("saving over an older install leaves exactly one tag and no interactions script", () => {
    const after = withPulse(`${theirs}\n${legacy("example.com")}`, buildCustomCode("example.com"))
    expect(after).not.toContain("script.interactions.js")
    expect(after.match(/<script/g)).toHaveLength(1)
    expect(after.startsWith(theirs)).toBe(true)
  })
  it("installs cleanly into an empty location", () => {
    expect(withPulse(null, "X")).toBe("X")
  })
})
