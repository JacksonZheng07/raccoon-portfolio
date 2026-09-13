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
single-weight line style that matches the border language. That is still the
rule for the illustration set, and it is why the set exists in the form it
does: the original design notes
(`docs/original-wireframe-notes.txt`) ruled out AI-generated artwork.

One deliberate exception, taken on 2026-09-13: the home page hero is a
generated render of the detective character,
`public/assets/photos/raccoon-detective.webp`. The constraint was aimed at
generic AI filler, and the hero is a specific commissioned character rather
than that — but it is generated, the original notes did say otherwise, and
the exception is written down here rather than left for a reader to notice.
It does not extend to the SVG set.

## Photography and licensing

The photographs in `public/assets/photos/` are third-party stock, with one
exception: `raccoon-detective.webp` is AI-generated artwork, filed there
because it is served the same way and separated under its own heading so it
is never mistaken for a licensed photograph. Every file in the directory is
accounted for in
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
