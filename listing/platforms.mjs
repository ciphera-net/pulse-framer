// One entry per marketplace listing. The mark is the platform's official
// 24×24 monochrome-or-brand SVG, copied from pulse-frontend's integrations
// registry (lib/integrations.tsx) so every Pulse surface draws the same glyph.
// Adding a listing = one entry here + `npm run listing <key>`.
export const platforms = {
  framer: {
    name: "Framer",
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#0055FF" d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/></svg>',
  },
}
