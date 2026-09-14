// Render the marketplace listing card for one platform in every format.
//
//   npm run listing            → framer, all formats, 1× and 2×
//   npm run listing shopify    → once shopify exists in platforms.mjs
//
// Output: listing/out/<platform>-<format>.png and …@2x.png (gitignored; the
// rendered files go to the CDN under pulse/listing/, see RELEASING.md).
//
// Why a script and not a screenshot: a listing image is re-made for every
// platform and every brand change. A recipe nobody committed is a recipe that
// vanishes — the Pulse OG cards were redrawn from the live PNG once already.
import { chromium } from "playwright"
import { mkdirSync } from "node:fs"
import { fileURLToPath, pathToFileURL } from "node:url"
import { dirname, join } from "node:path"
import { platforms } from "./platforms.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const key = process.argv[2] ?? "framer"
const platform = platforms[key]
if (!platform) {
  console.error(`unknown platform "${key}" — add it to listing/platforms.mjs (known: ${Object.keys(platforms).join(", ")})`)
  process.exit(2)
}

// Every store wants a different box. Render all of them from one composition.
const FORMATS = {
  "4x3": [1600, 1200],
  "16x9": [1920, 1080],
  "1x1": [1200, 1200],
  og: [1200, 630],
}

mkdirSync(join(here, "out"), { recursive: true })
const browser = await chromium.launch()
try {
  for (const [format, [w, h]] of Object.entries(FORMATS)) {
    for (const scale of [1, 2]) {
      const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: scale })
      await page.goto(pathToFileURL(join(here, "card.html")).href, { waitUntil: "networkidle" })
      await page.evaluate(
        ({ w, h, svg, name }) => {
          document.documentElement.style.setProperty("--w", `${w}px`)
          document.documentElement.style.setProperty("--h", `${h}px`)
          document.getElementById("plat").innerHTML = svg
          document.getElementById("for").textContent = `for ${name}`
        },
        { w, h, svg: platform.svg, name: platform.name },
      )
      // The face must be the real Geist, not a fallback that renders silently.
      await page.evaluate(() => document.fonts.ready)
      const geist = await page.evaluate(() => document.fonts.check('600 20px "Geist"'))
      if (!geist) throw new Error("Geist did not load — the card would render in a fallback face")
      const file = join(here, "out", `${key}-${format}${scale === 2 ? "@2x" : ""}.png`)
      await page.locator("#art").screenshot({ path: file, type: "png" })
      console.log(`${file}  ${w * scale}×${h * scale}`)
      await page.close()
    }
  }
} finally {
  await browser.close()
}
