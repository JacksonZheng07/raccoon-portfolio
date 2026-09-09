# raccoon-portfolio

Jackson Zheng's personal site — a naturalist's field notebook where the
naturalist is a raccoon.

Content is sourced from the `Project Index` Notion database at build time and
committed to `content/projects/` as JSON, so the site never depends on a live
Notion token.

## Stack

- Next.js 15 App Router, static export (`output: "export"`)
- Tailwind CSS 4, CSS-first tokens in `app/globals.css`
- Vitest for the content layer, Playwright for route smoke tests
- GitHub Pages via Actions

## Design system

"Field Notes": cream paper `#f7f3e9`, 2px hard borders, 9px offset shadows,
Georgia display / Arial body / monospace specimen labels, pastel accents. No
border radii, no gradients. Tokens live in `app/globals.css`; see
`docs/original-wireframe.html` for the source direction.

Raccoon illustrations in `public/assets/raccoon/` are hand-authored SVG in a
single-weight line style that matches the border language. No AI-generated
artwork — a deliberate constraint from the original design notes.

## Photography and licensing

The photographs in `public/assets/photos/` are third-party stock. Every one of
them is accounted for in
[`public/assets/photos/ATTRIBUTION.md`](public/assets/photos/ATTRIBUTION.md):
file name, photographer, source page, and the licence it is used under, checked
on each photo's own page rather than assumed from the platform default.

Two files predate that record — `raccoon.jpg` and `raccoon-glasses.jpg` — and
their provenance is genuinely unknown. They are unused by the site and flagged
in the attribution file. Verify them or delete them; do not use them.

Anything new added to that directory goes in the attribution table in the same
commit. On a public repository an unaccounted-for image is a liability, not a
loose end.

## Commands

```bash
npm install
npm run dev         # local dev
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run test        # vitest, content layer
npm run test:e2e    # playwright, route smoke
npm run build       # static export to out/
npm run sync:notion # re-pull content from Notion
```

## Layout

```
app/          routes: home, work, work/[slug], notes, 404
components/   ui/ primitives, raccoon/ motifs, work/ case-study pieces
content/      projects/*.json, generated from Notion, committed
lib/          typed content loader + validation
scripts/      sync-notion.ts
docs/         the spec, the original wireframe, raw Notion source
```
