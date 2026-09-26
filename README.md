# Pierology

A complete, responsive editorial website for the fictional faith of Pierology. Plain HTML, CSS, and JavaScript, with a small Node server for local development. No runtime dependencies, accounts, or database. The production build copies the public site files into `dist/`.

## Run locally

```powershell
npm run dev
```

Open **http://localhost:4173**. To choose another port, set `$env:PORT` before starting the server.

## What's included

- Photographic homepage, formal masthead, nine-section navigation, three manually controlled featured stories, and a Pierology Network panel.
- Six complete journal articles with category filtering and text search.
- Piero Almighty, the Eternal Question, KPF57APQ4, and an expandable FAQ.
- Three suggested personal observances with working `.ics` calendar downloads. These are fictional-world invitations to read and contemplate at home; they do not claim to register anyone for a hosted event.
- Four-photo gallery with captions, photographer credits, keyboard navigation, and a lightbox.
- The original five-second Piero refrain, with play/pause, volume, looping, and download.
- The complete ten-hour film embedded from [YouTube](https://www.youtube.com/watch?v=4GpNXT_PuXU), with a direct YouTube link. The embed loads only when opened; the thirty-second preview has been removed.

## Edit the site

| File | Purpose |
| --- | --- |
| `content.js` | Articles, event dates and UTC times, FAQs, and photographs |
| `app.js` | Page templates, hash-based navigation, players, search, and calendar downloads |
| `index.html` | Shared masthead, navigation, footer, and metadata |
| `styles.css` | Desktop, tablet, and mobile layouts |
| `assets/` | Local photographs, fonts, and emblem |
| `server.mjs` | Local static server, media range requests, and public-file allowlist |
| `scripts/build.mjs` | Packages only the public site and small audio loop into `dist/` |
| `wrangler.jsonc` | Cloudflare Worker name, compatibility date, and static asset directory |

The audio-only page uses `piero-loop.wav` (about 480 KB), which must be included in Git and in deployments. The small original `piero.ogg` can also be committed. Local video exports are ignored by Git and are not served or required by the website. The film uses YouTube video ID `4GpNXT_PuXU` in `app.js`.

Navigation uses URL hashes, so the static site does not need server-side route rewrites. For public hosting, use the output from `npm run build`. It includes the HTML, CSS, JavaScript, public images and fonts, and `piero-loop.wav`. Video exports, source scripts, dependencies, and repository metadata are excluded.

## Cloudflare deployment on push

`wrangler.jsonc` targets the existing **pierology** Worker and serves `dist/` as Workers Static Assets. Cloudflare's native Git integration triggers the deployment; a GitHub Actions workflow is not required.

In the connected Worker's **Settings → Builds**, use:

| Setting | Value |
| --- | --- |
| Git repository | `WildMix/pierology` |
| Production branch | `master` |
| Root directory | Repository root (`/`) |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

After these configuration files are committed and pushed to `master`, the connected Cloudflare build runs the build command and deploys the resulting static site. Cloudflare supplies deployment authentication through the repository connection; do not put API tokens in the repository. Wrangler is pinned in `package.json` and `package-lock.json`.

For local checks without publishing:

```powershell
npm run check
npm run deploy:check
```

`deploy:check` builds the files and runs `wrangler deploy --dry-run`. For an intentional manual deployment, `npm run deploy` builds and publishes using your local Cloudflare authentication.

The connected production branch and build commands are dashboard settings, not fields in `wrangler.jsonc`. See [Cloudflare's Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/).

## Suggested additions

Submit stories, sacred tales, events, and other additions through GitHub pull requests. Most content edits belong in `content.js`; include any new photographs in `assets/` with their credits. Keep the existing editorial layout and check the relevant pages on mobile before submitting. Do not add local video exports to a PR; use hosted video links and keep the small audio refrain in the repository.

## Verification

```powershell
npm install --registry=https://registry.npmjs.org
npm run check
npm test
```

Start the site before running `npm test`. Browser checks use installed Google Chrome through the Playwright development dependency. Set `SITE_URL` to test another local port. Screenshots and the verification report are written to `test-results/`.

Checks cover the story carousel, article filtering and navigation, search and empty results, FAQs, calendar downloads, gallery keyboard controls, actual audio playback, the YouTube embed URL and dialog cleanup, mobile overflow, and audio byte-range behavior. They verify the site's YouTube integration without asserting third-party streaming availability.

## Assets and credits

The visual structure was studied from [scientology.org](https://www.scientology.org/); the branding and text are original to Pierology. The site is independent and not affiliated with Scientology. Real photographs illustrate the fictional stories rather than documenting them.

- [Luca Micheli — Val d'Orcia](https://unsplash.com/photos/r9RW20TrQ0Y)
- [Rafael Peier — Tuscan villa](https://unsplash.com/photos/h2m-eLgr6i8)
- [Hanlin Sun — Erice at night](https://unsplash.com/photos/T6vp11wAMRU)
- [Peter Herrmann — Candlelight](https://unsplash.com/photos/mM62QHucU7s)

Photography is used under the [Unsplash License](https://unsplash.com/license). Jost and Libre Caslon Display are hosted locally; their SIL Open Font License files are included in `assets/fonts/`. Asset refresh scripts are in `scripts/` and are not required to run the site.
