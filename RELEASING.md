# Releasing Pulse Analytics for Framer

Framer Marketplace plugins are uploaded by hand as a zip and go live
immediately — there is no review queue, no fee, and no public version API.
That last point matters: unlike wordpress.org, **nothing in the estate can
read back what the Marketplace serves**, so the checklist below is the whole
control.

1. Bump `version` in `package.json` and note the change in the listing's
   version notes. This is not optional: the Marketplace identifies a version by
   the uploaded bundle and rejects a duplicate ("unique constraint violation …
   already exists"); the version is baked into the bundle, so a bump is what
   makes the next zip a new version.
2. Merge to `main`. CI (`.woodpecker/test.yml`) typechecks, lints, tests,
   builds and packs on every PR and push.
3. Tag it: `git tag -a vX.Y.Z -m "Release X.Y.Z" && git push origin vX.Y.Z`.
4. `npm run pack` locally (or download `Pulse Analytics.zip` from the CI log — it is
   printed, not stored) and check `unzip -l "Pulse Analytics.zip"` lists `framer.json`,
   `index.html`, `icon.svg` and the `assets/` bundle.
5. Marketplace dashboard → the plugin → ··· → **Publish New Version** → upload
   `Pulse Analytics.zip` with change notes → Publish.
   First release: Marketplace → Post → Plugin, with byline, description, icon,
   screenshots and tags. The listing name is **Pulse Analytics** (matching the
   wordpress.org listing, owner ruling 14-09-2026).
6. Open the plugin in a Framer site and confirm the panel shows the new
   behaviour. That fetch is the verification; a successful upload is not.

## Testing in Framer

The plugin cannot be exercised outside Framer's editor. `npm run dev` serves it
on localhost with a self-signed certificate; in Framer enable **Developer
Tools** (Plugins section of the main menu), then Plugins → **Open Development
Plugin**. Test on a **free** site first: `setCustomCode` is a permission-gated
method, and whether the free plan grants it is not documented anywhere — the
plugin's "not allowed" state exists for that case.

## Icon

`public/icon.svg` wraps the 64 px PNG mark from the CDN because no vector Pulse
mark exists yet. Replace it with the real SVG when one does; nothing else
references it.

## Listing image

The Marketplace card is generated, never drawn by hand, so every Pulse listing
shares one look (owner pick 15-09-2026: the two-marks card on the ciphera.net
ember horizon). `listing/card.html` is the composition, `listing/platforms.mjs`
the platform slot, `listing/render.mjs` the renderer.

```bash
npx playwright install chromium   # once per machine
npm run listing                   # → listing/out/framer-v2-{4x3,16x9,1x1,og}.png, plus @2x
```

The `v2` is the card REVISION, read from `rev` in `listing/platforms.mjs`. It is
in the filename on purpose: `pulse/listing/*` is cached immutably at the edge, so
a redrawn card uploaded under a name already in use is invisible — the old bytes
are served forever. **Changing the composition means bumping `rev` in the same
commit**, which moves the URL with the pixels. (Same failure this estate already
paid for once on status.ciphera.net, where a stable `/static/status.css` served
an eight-hour-old stylesheet against new markup, every pipeline green.)

⚠️ `framer-{4x3,16x9,1x1,og}[@2x].png` — the un-revved names — are the first
Framer card, the one carrying Framer's own logo that got the listing hidden.
They are still live on the CDN and nothing references them. Do not reuse those
names, and delete them when convenient.

The render is deterministic: re-running `npm run listing` on 15-09-2026
reproduced all four published formats byte-for-byte, and the 4:3 output matched
the cover Framer itself is serving. A re-render is therefore a safe way to check
the committed recipe still makes the live card.

Upload the results with the workspace script and use the CDN copies in the
form (a revision is a NEW filename, the CDN caches immutably):

```bash
./scripts/cdn-upload.sh Pulse/pulse-framer/listing/out pulse/listing
```

A new listing (Shopify, Tag Manager, …) is one entry in `platforms.mjs` — copy
the platform's mark from pulse-frontend's `lib/integrations.tsx` so every Pulse
surface draws the same glyph — then `npm run listing <key>`.

🔴 **Start from `svg: null` and only add a mark if that platform's own policy
says the logo may appear in third-party assets, in words.** This was checked
against the current policy for all eight wave-A surfaces on 15-09-2026 (Astro,
Nuxt, GTM/Google, Docusaurus/Meta, Drupal, Joomla, TYPO3, Odoo) and **not one of
them permits it** — the permissions are for linking, for "built with", or for
paid members' badges, never for a co-branded card. Silence in a policy is not
permission. The first Framer card carried Framer's mark and was hidden behind
"Show reported content" within minutes of posting. Evidence and the governing
sentence per platform: `Pulse/docs/plans/14-09-2026-integration-marketplaces-strategy.md` §11a.1.
