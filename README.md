# Pulse Analytics for Framer

This is the official Framer plugin for [Pulse Analytics](https://pulse.ciphera.net),
Ciphera's privacy-first web analytics. It writes the Pulse tag into the site's
custom code, on every published page, without opening Site Settings.

- Type your site's domain and click **Install Pulse**. That completes the install.
- Scroll depth, outbound links, file downloads, and clicks, copies and form submits are each switched on or off in
  your site's settings in Pulse (Settings → General). The tag stays the same, so there is nothing to change here.
- The panel shows what is installed and where, and notices when someone turns
  the snippet off in Site Settings → Custom Code.
- **Remove Pulse** and **Change domain** live in the window's ··· menu.

You do not enter any account details in Framer. The domain must match a site in
your Pulse dashboard; create one at https://pulse.ciphera.net if it is not there
yet.

## What it writes

```html
<script defer data-domain="example.com" src="https://js.ciphera.net/script.js"></script>
```

It goes to **end of head**. Plugin versions before 1.1.0 could also write a second tag for
`https://js.ciphera.net/script.interactions.js`. Saving a domain with this version removes that tag, because the
script loads the interactions script by itself when your site's settings in Pulse ask for it.
The plugin leaves custom code that is not Pulse's exactly as it was. Install,
change and remove only ever touch the Pulse tags.

## Development

```bash
npm install
npm run dev        # then, in Framer: enable Developer Tools → Plugins → Open Development Plugin
npm test           # vitest over src/pulse.ts — the tag builder and the installed-state reader
npm run typecheck && npm run lint && npm run build
npm run pack       # plugin.zip for the Marketplace
```

Everything the plugin decides (what tag to write, what counts as installed,
what to strip on remove) is in `src/pulse.ts`, which does not use the Framer
API, so it is unit-tested. `src/App.tsx` is the panel.

The plugin is built on Framer's canvas plugin template (React, Vite and
`@framer/plugin`).

## What this plugin sends

The plugin itself sends nothing anywhere. It writes the Pulse tag into your
site's custom code, and it is the tag, running on your published site, that
talks to Pulse. What the tag collects and what it does not collect is documented
at https://docs.ciphera.net/pulse/privacy. In short, Pulse Analytics
sets no cookies and never stores IP addresses, and the tag stays silent for
visitors who send Do Not Track or Global Privacy Control.

## License

The plugin is licensed under Apache-2.0 (see `LICENSE`).
"Pulse" and the Pulse mark (`public/icon.svg`) are
trademarks of Ciphera BV; the licence covers the code, not the name or the
logo. `public/icon.svg` is the 512 x 512 vector from Ciphera's brand library.
