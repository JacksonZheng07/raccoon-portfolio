# jackson-os

Jackson Zheng's personal site, built as a desktop. There's a menu bar, icons, draggable
windows, and a dock. The Projects folder holds the case studies, Notes holds
the essays, and Software Update shows when the content was last pulled from
Notion.

## How Software Update works

Project content lives in the Notion `Project Index` database. The site never
calls Notion at runtime. Instead:

1. `npm run sync:notion` pulls every project, validates it against
   `lib/projects.ts`, writes `content/projects/*.json`, and, when anything
   changed, writes `content/sync.json`: the time of the pull and which projects
   were new or updated.
2. `.github/workflows/software-update.yml` runs that every day at 13:00 UTC (and
   on demand from the Actions tab). If Notion changed, it opens a
   **Software Update from Notion** PR.
3. Merging the PR is installing the update. Vercel deploys `main`. The version
   in the menu bar (`26.9.10`) is the date of the last pull.

Notes (`content/notes/*.json`) are written by hand, not synced.

### One-time setup

- Repo → Settings → Secrets and variables → Actions → add `NOTION_TOKEN` (an
  internal Notion integration that the Project Index database is shared with).
- Repo → Settings → Actions → General → enable **Allow GitHub Actions to create
  and approve pull requests**.

## Docker

```bash
docker compose up --build   # http://localhost:8080
```

Builds the static export and serves it from nginx. CI builds the image on every PR.

## Live apps

`content/demos.json` maps a project slug to its deployed site. Those projects get an **Open live app** button that runs the real app in the Chrome window. A site only works there if it allows framing (no `X-Frame-Options: DENY`).

## Deep links

Every window has a hash: `/#pystruct`, `/#notes`, `/#update`, `/#about`,
`/#finder`. The focused window's hash is kept in the address bar.

## Stack

- Next.js 15 App Router, static export (`output: "export"`), hosted on Vercel
- Plain CSS in `app/globals.css` (Tailwind is only the reset)
- Vitest for the content layer, Playwright + axe for the desktop

## Commands

```bash
npm run dev         # local dev
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run test        # vitest, content layer
npm run test:e2e    # playwright, desktop smoke + axe
npm run build       # static export to out/
npm run sync:notion # NOTION_TOKEN=... re-pull content from Notion
```

## Layout

```
app/                  layout, the one page, og.png, sitemap, robots, 404
components/desktop/   Desktop (window manager, menu bar, dock), apps, icons
content/              projects/*.json from Notion, notes/*.json, sync.json
lib/                  typed content loaders + validation
scripts/              sync-notion.ts
```

