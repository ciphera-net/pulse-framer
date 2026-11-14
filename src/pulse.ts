// Pure logic for the Pulse Framer plugin: what tag to write, and how to read
// back what is installed. No Framer API here, so all of it is unit-tested.
import type { CustomCode, CustomCodeLocation } from "@framer/plugin"

export const SCRIPT_URL = "https://js.ciphera.net/script.js"
export const DASHBOARD_URL = "https://pulse.ciphera.net/"
/** What Pulse collects and never touches, linked from the install form (Framer asks how users are informed). */
export const PRIVACY_URL = "https://docs.ciphera.net/pulse/privacy"

/** Where the tag goes. Pulse's Framer guide says head; `defer` makes the
 *  exact position irrelevant to correctness, and end-of-head keeps it clear of
 *  anything a user placed at the start. */
export const LOCATION: CustomCodeLocation = "headEnd"

const LOCATIONS: CustomCodeLocation[] = ["headStart", "headEnd", "bodyStart", "bodyEnd"]

/** A registrable hostname: labels of letters, digits and hyphens, at least one
 *  dot, a letter-only TLD. Deliberately strict — the value lands inside an
 *  HTML attribute, and this shape cannot carry a quote, a space or a bracket. */
const DOMAIN_RE = /^(?=.{1,253}$)(?!-)[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,63}$/

/** Lower-case, drop a scheme, path, port and trailing dot. Keeps `www.` —
 *  the Pulse site may be registered either way and the user can edit it. */
export function normalizeDomain(input: string): string {
  let s = input.trim().toLowerCase()
  s = s.replace(/^[a-z][a-z0-9+.-]*:\/\//, "")
  s = s.split("/")[0].split("?")[0].split("#")[0]
  s = s.split(":")[0]
  s = s.replace(/\.$/, "")
  return s
}

export function isValidDomain(domain: string): boolean {
  return DOMAIN_RE.test(domain)
}

/** Exactly the tag Pulse's install panel emits. The core script loads the interactions script by itself when
 *  the site's settings in Pulse switch clicks, copies and form submits on, so there is only ever one tag. */
export function buildCustomCode(domain: string): string {
  if (!isValidDomain(domain)) throw new Error(`not a valid domain: ${domain}`)
  return `<script defer data-domain="${domain}" src="${SCRIPT_URL}"></script>`
}

export interface PulseInstall {
  domain: string
  location: CustomCodeLocation
  /** The user switched the snippet off in Site Settings → Custom Code. A
   *  plugin cannot switch it back on; only the user can. */
  disabled: boolean
}

const CORE_TAG_RE = /<script\b[^>]*\bsrc=["']https:\/\/js\.ciphera\.net\/script\.js["'][^>]*>\s*<\/script>/gi
/** The second tag that plugin versions before 1.1.0 wrote. It is never written now, and stripped on every save. */
const COMPANION_TAG_RE = /<script\b[^>]*\bsrc=["']https:\/\/js\.ciphera\.net\/script\.interactions\.js["'][^>]*>\s*<\/script>/gi
const DOMAIN_ATTR_RE = /\bdata-domain=["']([^"']*)["']/i

/** Find a Pulse install anywhere in the site's custom code — including one a
 *  user pasted by hand into a different location. */
export function findPulseInstall(code: CustomCode | null | undefined): PulseInstall | null {
  if (!code) return null
  for (const location of LOCATIONS) {
    const entry = code[location]
    if (!entry?.html) continue
    const tags = entry.html.match(CORE_TAG_RE)
    if (!tags || tags.length === 0) continue
    const domain = tags[0].match(DOMAIN_ATTR_RE)?.[1] ?? ""
    return { domain, location, disabled: entry.disabled }
  }
  return null
}

/** Remove every Pulse tag from a custom-code block and leave the rest of the
 *  user's code exactly as it was. Returns null when nothing is left, which is
 *  what `setCustomCode` takes to clear a location. */
export function stripPulse(html: string | null | undefined): string | null {
  if (!html) return null
  const rest = html.replace(CORE_TAG_RE, "").replace(COMPANION_TAG_RE, "").replace(/\n{3,}/g, "\n\n").trim()
  return rest.length ? rest : null
}

/** The user's existing code in a location, with Pulse's tags replaced by the
 *  given ones — never wiping code that is not ours. */
export function withPulse(existingHtml: string | null | undefined, pulseTags: string): string {
  const rest = stripPulse(existingHtml)
  return rest ? `${rest}\n${pulseTags}` : pulseTags
}
