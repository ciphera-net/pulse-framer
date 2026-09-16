// One entry per marketplace listing. The mark is the platform's official
// 24×24 monochrome-or-brand SVG, copied from pulse-frontend's integrations
// registry (lib/integrations.tsx) so every Pulse surface draws the same glyph.
// Adding a listing = one entry here + `npm run listing <key>`.
// `svg: null` renders the card with the Pulse mark alone and the platform in
// text only. Use it where the platform's brand rules do not allow its logo in
// third-party assets — the first Framer card, with Framer's mark on it, was
// hidden behind "Show reported content" within minutes of posting (15-09-2026).
// `rev` is the card REVISION and it lands in the filename. The CDN caches
// pulse/listing/* immutably, so a redrawn card must arrive at a NEW URL or the
// old bytes are served forever under the old name — and for Framer the old
// bytes are the withdrawn card that carried Framer's own logo. Bump `rev` when
// the composition changes; never re-upload a changed card under a used name.
export const platforms = {
  framer: {
    name: "Framer",
    svg: null,
    rev: "v2",
  },
  drupal: {
    name: "Drupal",
    // 🔴 svg: null — NOT an oversight. drupal.org/about/trademark grants the
    // Druplicon automatically only in "standalone and unaltered form"; using it
    // "as part of another logo" sits in the licence-grant-required bucket, and
    // no grant was requested. Measured 15-09-2026, re-confirmed 16-09-2026.
    // README.md and the project page carry the independence disclaimer instead.
    svg: null,
  },
  joomla: {
    name: "Joomla",
    // 🔴 svg: null. Joomla's Conditional Use Logos may not be used "as a
    // trademark to promote your own products or services", and the extension
    // carve-out re-opens it only if OUR name and logo are "always larger and
    // more prominent" — subordinate, never co-equal. Measured 15-09-2026.
    // The verbatim OSM disclaimer goes on the listing instead; see
    // pulse-joomla/LISTING.md.
    svg: null,
  },
  // kept for reference; do not use in a listing unless Framer has said yes
  "framer-with-mark": {
    name: "Framer",
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#0055FF" d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/></svg>',
  },
}
