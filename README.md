# Pulse Analytics for Framer

The official Framer plugin for [Pulse](https://pulse.ciphera.net), Ciphera's
privacy-first web analytics. It writes the Pulse tag into the site's custom
code, on every published page, without opening Site Settings.

- Type your site's domain (prefilled from the published URL), click **Install
  Pulse**. Done.
- Optionally turn on the companion script that records clicks, copies and form
  submits.
- The panel shows what is installed and where, and notices when someone turns
  the snippet off in Site Settings → Custom Code.
- **Remove Pulse** and **Change domain** live in the window's ··· menu.

No account details are entered in Framer. The domain must match a site in your
Pulse dashboard; create one at https://pulse.ciphera.net if it is not there yet.

## What it writes

```html
<script defer data-domain="example.com" src="https://js.ciphera.net/script.js"></script>
```

and, when the companion is on, a second tag for
`https://js.ciphera.net/script.interactions.js`. Both go to **end of head**.
Custom code that is not Pulse's is left exactly as it was — install, change and
remove only ever touch the Pulse tags.

## Development

```bash
npm install
npm run dev        # then, in Framer: enable Developer Tools → Plugins → Open Development Plugin
npm test           # vitest over src/pulse.ts — the tag builder and the installed-state reader
npm run typecheck && npm run lint && npm run build
npm run pack       # plugin.zip for the Marketplace
```

Everything the plugin decides (what tag to write, what counts as installed,
what to strip on remove) is in `src/pulse.ts` with no Framer API, so it is
unit-tested. `src/App.tsx` is the panel.

Built on Framer's canvas plugin template: React, Vite, `@framer/plugin`.

## What this plugin sends

The plugin itself sends nothing anywhere. It writes the Pulse tag into your
site's custom code, and it is the tag, running on your published site, that
talks to Pulse. What the tag collects and what it does not is documented at
https://docs.ciphera.net/pulse/privacy; the short version is no cookies, no
personal data, and it stays silent for visitors who send Do Not Track or Global
Privacy Control.

## License

Apache-2.0 — see `LICENSE`. "Pulse" and the Pulse mark (`public/icon.svg`) are
trademarks of Ciphera BV; the licence covers the code, not the name or the
logo.
