// One entry per marketplace listing. The mark is the platform's official
// 24×24 monochrome-or-brand SVG, copied from pulse-frontend's integrations
// registry (lib/integrations.tsx) so every Pulse surface draws the same glyph.
// Adding a listing = one entry here + `npm run listing <key>`.
// `svg: null` renders the card with the Pulse mark alone and the platform in
// text only. Use it where the platform's brand rules do not allow its logo in
// third-party assets — the first Framer card, with Framer's mark on it, was
// hidden behind "Show reported content" within minutes of posting (15-09-2026).
export const platforms = {
  framer: {
    name: "Framer",
    svg: null,
  },
  // kept for reference; do not use in a listing unless Framer has said yes
  "framer-with-mark": {
    name: "Framer",
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#0055FF" d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/></svg>',
  },
}
