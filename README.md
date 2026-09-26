# Pierology

A complete, responsive editorial website for the fictional faith of Pierology. Plain HTML, CSS, and JavaScript, with a small Node server. No runtime dependencies, accounts, database, or build step.

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

The audio-only page uses `piero-loop.wav` (about 480 KB), which must be included in Git and in deployments. The small original `piero.ogg` can also be committed. Local video exports are ignored by Git and are not served or required by the website. The film uses YouTube video ID `4GpNXT_PuXU` in `app.js`.

Navigation uses URL hashes, so the static site does not need server-side route rewrites. For public hosting, serve `index.html`, `styles.css`, `app.js`, `content.js`, `assets/`, and `piero-loop.wav`. No local video files need to be uploaded. The website itself has not been published.

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
