# Releasing Pulse Analytics for Framer

Framer Marketplace plugins are uploaded by hand as a zip and go live
immediately — there is no review queue, no fee, and no public version API.
That last point matters: unlike wordpress.org, **nothing in the estate can
read back what the Marketplace serves**, so the checklist below is the whole
control.

1. Bump `version` in `package.json` and note the change in the listing's
   version notes.
2. Merge to `main`. CI (`.woodpecker/test.yml`) typechecks, lints, tests,
   builds and packs on every PR and push.
3. Tag it: `git tag -a vX.Y.Z -m "Release X.Y.Z" && git push origin vX.Y.Z`.
4. `npm run pack` locally (or download `Pulse Analytics.zip` from the CI log — it is
   printed, not stored) and check `unzip -l plugin.zip` lists `framer.json`,
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
npm run listing                   # → listing/out/framer-{4x3,16x9,1x1,og}.png, plus @2x
```

Upload the results with the workspace script and use the CDN copies in the
form (a revision is a NEW filename, the CDN caches immutably):

```bash
./scripts/cdn-upload.sh Pulse/pulse-framer/listing/out pulse/listing
```

A new listing (Shopify, Tag Manager, …) is one entry in `platforms.mjs` — copy
the platform's mark from pulse-frontend's `lib/integrations.tsx` so every Pulse
surface draws the same glyph — then `npm run listing <key>`.
