# Releasing Pulse Analytics for Framer

Framer Marketplace plugins are uploaded by hand as a zip and go live
immediately — there is no review queue, no fee, and no public version API.
🔁 **Corrected 16-09-2026 — this paragraph used to say "nothing in the estate
can read back what the Marketplace serves", and that was too strong.** There is
no VERSION anywhere, so step 6 below is still the only check that a new upload
behaves. But the listing's own record — `reported`, `featuredAt`, `updatedAt`,
`publishedAt`, `paid`, `categories`, `tags` — is embedded in the public detail
page and readable with one `curl`. A re-report and a description edit are both
watchable; see the follow-up tracker below.

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

## 📍 Follow-up tracker — where this plugin is listed, and how to chase it

State captured **16-09-2026**. Four directory submissions are with their
maintainers; none needs anything from us. The two items that do need a human are
the owner actions at the bottom.

🔑 **Framer is a different shape from Astro and Docusaurus and the hunt must not
assume otherwise.** `package.json` is `private: true`, the plugin ships as a zip
whose filename is the listing name, and there is **no npm surface and no keyword
index**. Do not "fix" that by publishing it to npm. Everything below is a
directory a human maintains.

Check all of it with one command — **run verbatim and confirmed working**, and
every branch of it proven to fail on a control (a wrong slug reports
`RECORD NOT FOUND`; the disclaimer detector reports `PRESENT` on text that has
it; the directory grep reports `LISTED` on a page that contains us):

```bash
# --- 1. The Framer Marketplace listing itself (its record is embedded in the page; there is no API)
curl -sS "https://www.framer.com/marketplace/plugins/pulse-analytics/" | python3 -c '
import sys,re
u=sys.stdin.read().encode().decode("unicode_escape","replace")
i=u.find("\"framerPluginId\":\"423b340zmq149u9iu2mq23fj7\"")
if i<0: print("listing     : RECORD NOT FOUND — listing removed, renamed, or page shape changed"); raise SystemExit(1)
r=u[i-600:i+400]
g=lambda p,d="?": (re.search(p,r).group(1) if re.search(p,r) else d)
print("listing     : live")
print("updatedAt   :", g(r"\"updatedAt\":\"([^\"]+)\""), " (moves when the description is edited)")
print("reported    :", g(r"\"reported\":(true|false)"), " (true = hidden behind a moderation report)")
print("featuredAt  :", g(r"\"featuredAt\":(null|\"[^\"]*\")"))
print("tags        :", g(r"\"tags\":(\[[^\]]*\])"), " (LISTING.md specifies five)")
print("categories  :", ", ".join(re.findall(r"\"name\":\"([^\"]+)\",\"slug\":\"[a-z-]+\"",r)) or "?")
print("disclaimer  :", "PRESENT" if "independent of Framer" in u else "ABSENT  <-- owner action 1")
'
# --- 2. The four directory submissions (all made 16-09-2026). Listed = our name appears.
for s in "AllFramer|https://allframer.club/sitemap.xml" \
         "Frameplugins|https://frameplugins.com/categories/analytics" \
         "Frameplate|https://frameplate.co/plugins/analytics" \
         "Framer.zone|https://www.framer.zone/all-plugins"; do
  n=$(curl -sS -L --max-time 30 "${s#*|}" | grep -ciE "pulse-analytics|Pulse Analytics" || true)
  printf "%-12s: %s\n" "${s%%|*}" "$([ "$n" -gt 0 ] && echo "LISTED ($n hits)" || echo "not yet")"
done
```

Output at capture: listing live, `reported: false`, `featuredAt: null`,
`tags: []`, categories `Integrations`, `updatedAt 2026-09-14T22:51:11.260Z`,
disclaimer **ABSENT**; all four directories `not yet`.

| # | Where | State at capture | Done looks like | If it stalls |
|---|---|---|---|---|
| 1 | **Framer Marketplace** — [`/marketplace/plugins/pulse-analytics/`](https://www.framer.com/marketplace/plugins/pulse-analytics/) | 🟢 live, `reported:false` | n/a — this is the listing | ⚠️ It is **not on page 1 of its own Integrations category** (24 cards, default sort, we are not among them); it *is* in the index under `?sort=recent`. That is ranking, not a defect — a new free plugin with no installs. It is the reason the directories below matter |
| 2 | **AllFramer** — `allframer.club` | submitted 16-09, free tier. Receipt: *"Thank you for submitting your Product. Your Product will be listed on the https://allframer.club/ within couple of weeks."* | an entry at `allframer.club/plugins/<slug>/`, filed under **SEO & Analytics** | Free tier is a stated **7+ day queue**; the paid tiers ($12/$49/$99 per month) are the upsell and we do not take them. Contact `allframer@themeselection.com`. Chase after ~3 weeks |
| 3 | **Frameplugins** — `frameplugins.com` | submitted 16-09 via `tally.so/r/w4okxO`. Receipt: *"Thanks for completing this form!"* | an entry under [`/categories/analytics`](https://frameplugins.com/categories/analytics), which today holds exactly **three**: `fathom-analytics`, `humblytics`, `simple-analytics` | No stated SLA. Operator is Julien V / 88 Pixels (`julien@88pixels.co`) |
| 4 | **Frameplate** — `frameplate.co` | submitted 16-09 via `tally.so/r/nGXpJe` (form title "FMPT Plugins"). Receipt: *"Thanks for completing this form!"* | an entry at [`/plugins/analytics`](https://frameplate.co/plugins/analytics), beside Simple Analytics, Fathom and Humblytics | ⚠️ **Same operator as Frameplugins but a DIFFERENT form id** — the two pages look identical down to the placeholder text, so it is easy to conclude one submission covers both. It does not. Both were sent |
| 5 | **Framer.zone** — `framer.zone` | submitted 16-09, **Standard ($0)** pack. Receipt: *"✅ Thank you! We'll be in touch shortly!"* | an entry in [`/all-plugins`](https://www.framer.zone/all-plugins) (102 today), category **Analytics** | Free tier is a stated **4–10 weeks, reviewed in order of submission**. 🔴 **Do not pay the $19 Fast Track** without an owner call. Contact `framerdotzone@gmail.com` — they also invite a 1600×1200 thumbnail by email, which is exactly `listing/out/framer-v2-4x3.png` |

### 🔴 Two findings about the listing that were not known before 16-09

- **The listing IS machine-readable, contradicting this file and `LISTING.md`.**
  Both said "no version API, so nothing can watch this listing". True of the
  *version* — but the plugin's record is embedded in the public detail page and
  carries `reported`, `featuredAt`, `updatedAt`, `publishedAt`, `paid`,
  `categories` and `tags`. So the two things that actually matter **are**
  watchable with one `curl`: a **re-report** (`reported` flips to `true`, which
  is what hid the listing on 15-09) and the **disclaimer paste**
  (`updatedAt` moves). The command above does both.
- 🔴 **The listing carries `tags: []` and a single category.** `LISTING.md`
  specifies five tags (analytics, privacy, GDPR, tracking, statistics) and they
  were never applied; a peer plugin in the same category index carries **two**
  categories. Both are set in the Marketplace dashboard and both feed discovery.
  Owner action 3 below.

### Surfaces checked and deliberately NOT used

Recorded so the search is not repeated.

**Inside Framer's own ecosystem — there is exactly one plugin surface, and we are in it:**

- 🔴 **`github.com/framer/plugins` is CLOSED to third parties, measured.** Its
  README says *"Have a polished Plugin you'd like to share with others?
  Contributions are welcome"*, which reads as an invitation. It is not one. A
  third party filed exactly our shape (PR **#655**, "Add First Rank Pro plugin",
  a commercial plugin already live on the Marketplace) and it was closed unmerged
  the next day with, verbatim: *"This GitHub repository is only for plugins which
  are published under the Framer profile on the marketplace, not third-party
  plugins. If you'd like to make your plugin open source, you can publish it in a
  separate repo."* All 32 plugin folders are Framer's own, every merge is staff or
  dependabot, and PR #548 is *"Add CI for submitting plugins to Marketplace on
  merge"* — it is Framer's first-party release pipeline, not a community index.
- **`framer.community` is DEAD.** The old forum (including its `/c/plugins`
  category) **307-redirects wholesale to `framer.com/marketplace/`**. Search
  results still carry cached thread titles; the domain serves nothing.
- **`framer.com/community/hype/` is templates-only** — 14 templates, **zero**
  plugins in the page's own payload. Not a plugin surface.
- **`framer.com/community/feed/`** is a social feed and our listing already has a
  post object attached (0 likes, 0 comments). Posting to it needs a logged-in
  human; see owner action 4.
- `framer.com/showcase`, `/gallery` (websites), `/experts`, `/agencies` (people
  and studios) — wrong content type. `/resources` and `/creators` 404.
  `/integrations` and `/community/marketplace/plugins/` are **aliases of the same
  Marketplace listing**. `developers.framer.com` does not resolve.
- **Framer's blog and `/updates` have no plugin-roundup route.** The only two
  plugin posts are the Oct-2024 feature launch and Mar-2025 "Plugins 3.0"; no
  recurring roundup exists to pitch into.

**Curated lists and directories:**

- 🔴 **`podo/awesome-framer` is the WRONG PRODUCT and effectively dormant.** 624
  stars is the trap. It is *"a curated list of Framer prototyping tool articles"*
  — Framer Classic, the CoffeeScript desktop app — with sections for Modules and
  UI Libraries and **no plugins section at all**. Of its 14 merged PRs, **13 are
  from 2017–2018**; one merged in 2026 and one has sat open since 31-07-2026.
  `robbschiller/awesome-framer` (18 stars, last pushed 2017) and
  `davo/awesome-react-framer-x` (Framer X era) are the same era and dead.
  `avathiery/awesome-framer-templates` is templates, 4 stars.
  🔑 **There is no awesome-list for the modern Framer web builder.** Do not keep
  looking for one; the directories in the table are what exists.
- **`segmentui.com/listing/analytics`** — the richest analytics list found (it
  carries Simple Analytics, Fathom and Humblytics) but it is **editorial with no
  submission path**. Reaching it means an outreach email to `hello@segmentui.com`,
  not a form. Left as an owner option, not done unprompted.
- **`framojo.com`** — a blog, not a directory: every "plugin" is a post under
  `/blog/<name>`. No submission route exists. An editorial pitch, not a listing.
- **`framerlists.com`** (5 items, one person's own plugins),
  **`everythingframer.com`** (templates only, footer © 2024),
  **`framebite.com`** (ex-FramerBite; editorial roundups, newest dated Sep 2025),
  **`framer.university`** (components and effects, no plugin section),
  **`toolfolio.com/integrations/framer`** (category renders zero tools) — each
  fails on content type, activity, or both.
- ⛔ **Generic SaaS/startup directory spam** was excluded on sight under the
  estate's standing decline on bulk directory submission. Every surface above was
  required to clear two bars: a human curates it, and it has moved in the last
  six months.

### 📍 Owner actions

1. 🔴 **Paste the independence disclaimer into the Marketplace description.**
   Still absent — re-verified 16-09, zero hits for "independent", "endorsed" and
   "Framer B.V." in both the rendered page and the embedded description JSON, and
   `updatedAt` has not moved since 14-09. The paragraph is the last one in
   `LISTING.md`. Framer's trademark guidelines ask a listing to carry it and it
   was the remedy offered to support during the hold, so its absence re-opens the
   exact ground the moderation report was filed on. ✅ **It is now watchable** —
   the command above reports `disclaimer: PRESENT` once it lands.
2. ⚠️ **Delete the withdrawn Framer cards from the CDN.** All eight
   `pulse/listing/framer-{4x3,16x9,1x1,og}[@2x].png` — no `v2` — still return
   **200** (re-verified 16-09; 12.2 MB across the set). They are the card that
   paired Framer's mark with the Pulse mark and got the listing hidden. Nothing
   references them. ⚠️ Dual-write: **Bunny Edge Storage and Exoscale SOS**. The
   assistant has the credentials and can do it on one word.
3. 🔴 **Add the five tags and a second category in the Marketplace dashboard.**
   The listing has `tags: []` and only `Integrations`. `LISTING.md` specifies
   analytics, privacy, GDPR, tracking, statistics, and a peer in the same index
   carries two categories. This is free discovery we are not taking.
4. 📍 **Optional, needs a human: announce in Framer's community.** The Community
   Feed (`framer.com/community/feed/`) takes a post from the creator account, and
   Framer's official Discord (`discord.com/invite/framer`, `VERIFIED` and
   `PARTNERED`, ~25.6k members) is the informal channel. ⚠️ Neither has a
   documented editorial pickup — no example of Framer featuring a community
   plugin from either was found, so treat it as reach, not a review queue.
   **`reddit.com/r/framer` still needs a human check** — Reddit 403s every
   automated fetch, so its size and self-promotion rules are unmeasured here.

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
