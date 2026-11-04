# Freedom — Harsh's portfolio (Next.js)

A house you walk through: each room is a page (Home, Projects, Case Study, About Me, Contact), and moving
between rooms plays rendered camera moves. Built with Next.js (static export) and React; the frame
sequences are drawn with three.js.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
npm start        # serves out/ locally
```

## Where things are

| Path | What it is |
| --- | --- |
| `app/(house)/` | `/` — the 3D house |
| `app/(projects)/projects/` | `/projects/` — the Bedroom PC screen (desktop OS on computers, project list on phones) |
| `app/(reading)/reading/` | `/reading/...` — the fast, text-only version |
| `components/house/` | House UI: scene, hotspots, room text, navigation, Contact window, Kitchen case study window |
| `components/projects/` | PC screen markup |
| `components/reading/` | Reading-version carousel and contact form |
| `content/` | Long text content (GluSight case study, project showcases, reading pages) |
| `lib/frames/` | three.js frame renderer (2D fallback) and the 24 fps sequence player |
| `lib/house/` | Room graph and hotspot data, frame loading, the house controller, Kitchen case study behaviour |
| `lib/projects/` | `/projects/` page controller and the Freedom OS desktop |
| `styles/` | Global stylesheets for each section |
| `public/` | Images, frame sequences and video (same URLs as before: `/Media/...`, `/projects/Media/...`, `/reading/img/...`) |

Moving between `/` and `/projects/` is a full page load on purpose: the Back button, the browser's
back/forward cache and the session flags that replay the PC zoom depend on it.

Add `?gl=0` to any address to draw frames with the old 2D canvas instead of three.js (for comparing).

## Deploy

`.github/workflows/deploy-pages.yml` builds the site and publishes `out/` to GitHub Pages on every push to
`main`. One-time setting: repository Settings → Pages → Build and deployment → Source: **GitHub Actions**.
`public/CNAME` keeps the custom domain.
