import { describe, expect, it } from "vitest"
import type { CustomCode } from "@framer/plugin"
import {
  buildCustomCode,
  findPulseInstall,
  hostnameFromPublishUrl,
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

describe("hostnameFromPublishUrl", () => {
  it("reads the production hostname", () => {
    expect(hostnameFromPublishUrl("https://example.com/")).toBe("example.com")
    expect(hostnameFromPublishUrl("https://fancy-site.framer.website/about")).toBe("fancy-site.framer.website")
  })
  it("is null for an unpublished site or garbage", () => {
    expect(hostnameFromPublishUrl(null)).toBeNull()
    expect(hostnameFromPublishUrl(undefined)).toBeNull()
    expect(hostnameFromPublishUrl("not a url")).toBeNull()
  })
})

describe("buildCustomCode", () => {
  it("is exactly the Pulse tag", () => {
    expect(buildCustomCode("example.com", false)).toBe(
      '<script defer data-domain="example.com" src="https://js.ciphera.net/script.js"></script>',
    )
  })
  it("adds the companion as a second tag, never inside the core", () => {
    const html = buildCustomCode("example.com", true)
    expect(html.split("\n")).toHaveLength(2)
    expect(html).toContain('src="https://js.ciphera.net/script.interactions.js"')
  })
  it("refuses a domain that could break the attribute", () => {
    expect(() => buildCustomCode('x.com"><script>', false)).toThrow()
  })
})

describe("findPulseInstall", () => {
  it("finds the plugin's own install", () => {
    const code = empty()
    code.headEnd.html = buildCustomCode("example.com", true)
    expect(findPulseInstall(code)).toEqual({ domain: "example.com", companion: true, location: "headEnd", disabled: false })
  })
  it("finds a hand-pasted tag in another location, and reports disabled", () => {
    const code = empty()
    code.bodyEnd = { html: "<script defer data-domain='hand.example' src='https://js.ciphera.net/script.js'></script>", disabled: true }
    expect(findPulseInstall(code)).toEqual({ domain: "hand.example", companion: false, location: "bodyEnd", disabled: true })
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
    const html = `${theirs}\n${buildCustomCode("example.com", true)}`
    expect(stripPulse(html)).toBe(theirs)
  })
  it("returns null when nothing is left, which clears the location", () => {
    expect(stripPulse(buildCustomCode("example.com", false))).toBeNull()
    expect(stripPulse(null)).toBeNull()
    expect(stripPulse("   \n ")).toBeNull()
  })
  it("replaces an old Pulse install and keeps the rest", () => {
    const before = `${theirs}\n${buildCustomCode("old.example", false)}`
    const after = withPulse(before, buildCustomCode("new.example", true))
    expect(after.startsWith(theirs)).toBe(true)
    expect(after).toContain('data-domain="new.example"')
    expect(after).not.toContain("old.example")
    expect(after.match(/script\.js/g)).toHaveLength(1)
  })
  it("installs cleanly into an empty location", () => {
    expect(withPulse(null, "X")).toBe("X")
  })
})
