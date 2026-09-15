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

🔴 **One thing on the live listing does NOT match this file: the independence
disclaimer is missing.** The last paragraph below ("This plugin is independent
of Framer…") is the sentence Framer's trademark guidelines ask a marketplace
listing to carry, and it was the remedy offered to support during the hold — but
it is not in the published description. Paste it in from the Marketplace
dashboard. Nothing automated can catch this: the Marketplace has no version API,
which is the same reason `RELEASING.md` step 6 is a manual check.

The text below is what the Framer Marketplace form gets. Keep it in step with
the plugin; the form has no version control, this file does.

**Name:** Pulse Analytics

**Byline (34/34):** Privacy-first analytics for Framer

**Description** (paragraphs; the three short lines are headings):

Pulse is privacy-first web analytics from Ciphera, a company in Belgium. It
counts your visitors without cookies or personal data, and the script it adds
to your site is under 3 KB. This plugin puts that script on every page of your
Framer site, so you never open Site Settings for it.

How it works

1. Open the plugin. Your site's domain is already filled in from your published
   URL.
2. Click Install Pulse. Tick "Also track clicks, copies and form submits" if you
   want those as well.
3. Publish your site. Your dashboard at pulse.ciphera.net shows visitors as they
   arrive.

The panel shows what is installed and where, and warns you if someone switched
the snippet off in Site Settings. Change the domain or remove Pulse from the
window menu; the plugin only touches its own tags, so any other custom code
stays exactly as you wrote it.

What Pulse measures

Pageviews, referrers, countries, devices, time on page and scroll depth, plus
the goals, funnels and campaigns you set up: the reports most people open
Google Analytics for, in one dashboard hosted in Europe. It sets no cookies and
stores no personal data. Visitors whose browser sends Do Not Track or Global
Privacy Control are not counted at all.

You need

A Pulse account with a site registered for the same domain; the free plan is
enough to start. The plugin is open source under Apache 2.0:
github.com/ciphera-net/pulse-framer.

This plugin is independent of Framer and is not authorized by, endorsed by, or
otherwise approved by Framer B.V.

**Framer's rules that shape this listing** (framer.com/legal/trademark-guidelines/,
read 15-09-2026): "for Framer" phrasing is allowed and "Framer" may not be part
of the product name; the Framer logo may not be combined with other graphics
(the first cover paired it with the Pulse mark and was hidden within minutes);
listings should carry the independence disclaimer above. Questions go to
creators@framer.com. Community terms let Framer hold or remove content at its
discretion with no stated appeal path.

**Tags:** analytics, privacy, GDPR, tracking, statistics

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

**Screenshots to take (light and dark):** the install form with the domain
prefilled; the "Active on …" card with the companion on; the window menu open.
