# Yarda website

A single-page landing site for Yarda. It is plain HTML, CSS and one script, with no build step and no dependencies.

## What's here

| File | Purpose |
| --- | --- |
| `index.html` | The page |
| `styles.css` | All styles. Colours and fonts mirror the app (cream, warm ink, near-black, gold accent; Inter and Source Serif 4) |
| `app.js` | Download links, the verse demo, the mode tabs, reveal-on-scroll |
| `fonts/` | Self-hosted Inter and Source Serif 4 (copied from the app's `@fontsource` packages) |
| `assets/` | App icon, favicon, three public-domain / CC BY pictures (credits in `credits.json` and in the page footer) |

## Downloads

`app.js` asks the GitHub API for the latest release of `yarda-studio/desktop` and points the buttons at:

- `*_aarch64.dmg` for macOS (Apple silicon)
- `*_x64-setup.exe` for Windows, with the `*_x64_en-US.msi` as an alternative link

The visitor's platform is detected to choose the hero button. If the API is unreachable (rate limit, offline) every download link falls back to `https://github.com/yarda-studio/desktop/releases/latest`, so the page never needs editing when you ship a new version. If you change how releases are named in `.github/workflows/build.yml`, update the three patterns in `applyDownloads()`.

## Run it locally

```bash
npx vite website --port 5188
```

or any static server pointed at this folder.

## Deploy

It is a static folder, so any static host works. Set the publish directory to `website` with no build command:

- **Cloudflare Pages / Netlify**: connect the repo, publish directory `website`.
- **GitHub Pages**: publish the `website` folder (for example with the `actions/upload-pages-artifact` + `actions/deploy-pages` actions, `path: website`).

## Before launch

- Replace the interface fragments (the Romans 8 pane, the Live Show console, and so on) with real screenshots of the app if you prefer. They are drawn in HTML to match the app.
- The demo holds 24 KJV verses. Add more in `VERSES` in `app.js` if you want.
- Add a custom domain and, if you want link previews, an `og:image`.
