# Marketplace listing — Pulse Analytics

**Live:** <https://www.framer.com/marketplace/plugins/pulse-analytics/> — public
since 15-09-2026, after Marketplace Support reviewed and cleared the moderation
report that had held it behind "Reported · Only visible to you" since the
night before. Verified on the live page: title "Pulse Analytics — Plugin for
Framer", byline "Privacy-first analytics for Framer", category Integrations,
price Free (`price: 0`), author Usman Baig, and a cover that is
**byte-identical to `listing/out/framer-v2-4x3.png`** (sha256
`a764422b82d8…`) — i.e. provably the logo-free card, not the withdrawn one.
Framer re-hosts the cover on its own storage, so the CDN copy is the source,
not the thing being served.

🟢 **Measured 09-11-2026: the independence disclaimer IS on the live listing.**
The last paragraph below ("This plugin is independent of Framer…") is the
sentence Framer's trademark guidelines ask a marketplace listing to carry, and it
was the remedy offered to support during the hold. It was still missing on
16-09-2026 and is in the published description now. 🔁 **Corrected 16-09-2026:
the listing is automatically catchable, contrary to what this paragraph used to
say.** The listing's record is embedded in its public detail page, so the
description body can be read with one `curl`, and `updatedAt` moves the moment
the description is edited. The check is in `RELEASING.md` → Follow-up tracker.
What has no API is the VERSION, which is why `RELEASING.md` step 6 remains a
manual check.

🔁 **The description below was refreshed 09-11-2026.** It went through the
humanizer pass, and step 1 now matches plugin 1.0.2 and later, where the domain
field starts empty and the user types the domain. The Marketplace has no API for
the description, so paste this text from the dashboard to replace the live one.

The text below is what the Framer Marketplace form gets. Keep it in step with
the plugin; the form has no version control, this file does.

**Name:** Pulse Analytics

**Byline (34/34):** Privacy-first analytics for Framer

**Description** (paragraphs; the three short lines are headings; each paragraph is one line so it pastes without stray line breaks):

Pulse is privacy-first web analytics from Ciphera, a company in Belgium. It counts your visitors without cookies or stored IP addresses, and the script it adds to your site is under 3 KB. This plugin puts that script on every page of your Framer site, so you never open Site Settings for it.

How it works

1. Open the plugin and type your site's domain.
2. Click Install Pulse. Tick "Also track clicks, copies and form submits" if you want those as well.
3. Publish your site. Your dashboard at pulse.ciphera.net shows visitors as they arrive.

The panel shows what is installed and where, and warns you if someone switched the snippet off in Site Settings. You can change the domain or remove Pulse from the window menu. The plugin only touches its own tags, so any other custom code stays as you wrote it.

What Pulse measures

Pulse counts pageviews, referrers, countries, devices, time on page and scroll depth, plus the goals, funnels and campaigns you set up, in one dashboard hosted in Europe. It sets no cookies and never stores IP addresses. It does not count visitors whose browser sends Do Not Track or Global Privacy Control.

You need

A Pulse account with a site registered for the same domain. The free plan is enough to start. The plugin is open source under Apache 2.0: github.com/ciphera-net/pulse-framer.

This plugin is independent of Framer and is not authorized by, endorsed by, or otherwise approved by Framer B.V.

**Framer's rules that shape this listing** (framer.com/legal/trademark-guidelines/,
read 15-09-2026): "for Framer" phrasing is allowed and "Framer" may not be part
of the product name; the Framer logo may not be combined with other graphics
(the first cover paired it with the Pulse mark and was hidden within minutes);
listings should carry the independence disclaimer above. Questions go to
creators@framer.com. Community terms let Framer hold or remove content at its
discretion with no stated appeal path.

**Tags:** Analytics, Integrations

The Marketplace's tag taxonomy appears to be a fixed list, and peer plugins carry
Analytics and Integrations, so those are the two to set. This line used to carry
five free-form keywords (analytics, privacy, GDPR, tracking, statistics); they
were never applied.

🔴 **Measured 09-11-2026: the live listing still carries `tags: []`.** The same
was measured on 16-09-2026, when a peer plugin in the same category index also
carried **two** categories where ours has one. Both are set in the Marketplace
dashboard and both feed discovery, and the listing is not on page 1 of its own
Integrations category. `RELEASING.md` → Follow-up tracker reads the live values
back.

**Category:** Integrations

**Pricing:** Free

**Links:** Website https://pulse.ciphera.net · Docs https://docs.ciphera.net/pulse/framework-guides · Support hello@ciphera.net

**Card / thumbnail:** generated, see RELEASING.md → Listing image. The live set is
`cdn.ciphera.net/pulse/listing/framer-v2-{4x3,16x9,1x1,og}[@2x].png` — the `v2`
is the card revision and it comes from `rev` in `listing/platforms.mjs`, because
the CDN caches these immutably.
⚠️ **`framer-{4x3,16x9,1x1,og}[@2x].png` — no `v2` — are still live on the CDN and
are the WITHDRAWN card carrying Framer's logo** (measured 15-09-2026: 200, 929,706 B).
Nothing references them; they should be deleted from the bucket. Never publish a
card at one of those names again.

**Screenshots to take (light and dark):** the install form with a domain typed
in (the field starts empty since 1.0.2); the "Active on …" card with the
companion on; the window menu open.
