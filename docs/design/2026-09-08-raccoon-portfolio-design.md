# Raccoon Portfolio — Design

Date: 2026-09-08
Status: approved

## Purpose

Replace a single-file wireframe and a Notion database with a real personal
site. The Notion `Project Index` database holds ten projects, each with a
detailed case study — overview, timeline, contributions, technical breakdown,
evidence, resume bullets, interview talking points, follow-ups. None of it is
reachable by anyone but Jackson. The site makes that work public, legible, and
linkable, one URL per project.

Success means: a recruiter lands on the home page, understands what Jackson
builds within one screen, and can reach a specific project's full story in one
click. A backlog of concrete polish tasks is tracked on a board rather than
living in Notion `Next Action` fields.

## Concept

"Field Notes" — a naturalist's field notebook where the naturalist is a
raccoon. The theme is load-bearing, not decorative: a raccoon takes things
apart to understand how they work, which is the actual through-line of
PyStruct (a language runtime written from scratch), Enigma (parsing), and the
MCP bridge work. Section labels read as field observations; the numbered
`01 /` `02 /` labels inherited from the wireframe already scan as specimen
tags.

## Visual system

Tokens are carried over from `docs/original-wireframe.html` unchanged, so the
site is recognisably the approved direction:

| Token | Value | Role |
| --- | --- | --- |
| `--color-paper` | `#f7f3e9` | page surface |
| `--color-ink` | `#171717` | body text |
| `--color-line` | `#272727` | every border |
| `--color-muted` | `#6f706d` | labels, captions |
| `--color-accent-blue` | `#cadcf1` | featured card, hover |
| `--color-accent-pink` | `#e9c8c6` | stamps, contact band |
| `--color-accent-green` | `#c8d66a` | button hover, night accents |

Extended with three raccoon tokens: `--color-mask` `#2b2b30`,
`--color-ringtail` `#8a8580`, and the wireframe's existing night green
`#1e2a27` for the observations band.

Rules: 2px hard borders, 9px offset shadow on the outer frame, Georgia for
display, Arial for body, monospace for specimen labels. No border radii, no
gradients, no blur. Type scale uses `clamp()` for the hero only.

## Raccoon artwork

The original design notes forbid AI-generated artwork, and only two real
raccoon photographs exist. The takeover is therefore delivered as
hand-authored SVG in a single-weight line style matching the 2px border
language, stored in `public/assets/raccoon/`:

`raccoon-hero`, `raccoon-tools`, `paw-print`, `ringtail-rule`,
`raccoon-peek` (404), `raccoon-reading` (notes), `raccoon-lantern` (contact),
`mark` (favicon).

The two photographs stay where photography reads better: the hero inset and
the contact band.

## Architecture

```
app/
  layout.tsx            frame, nav, footer, metadata
  page.tsx              hero, selected work, observations, about
  work/page.tsx         all ten projects, filterable
  work/[slug]/page.tsx  case study, generateStaticParams
  notes/page.tsx        short writing
  not-found.tsx         404
components/
  ui/                   Frame TopNav SectionRow Label Stamp Btn Modal
  raccoon/              RaccoonHero PawDivider RingtailRule MaskBadge
  work/                 WorkCard WorkGrid WorkFilter CaseStudy*
content/projects/*.json ten files, generated, committed
lib/projects.ts         typed loader + zod validation
scripts/sync-notion.ts  re-pull from Notion on demand
```

Static export via `output: "export"`. `basePath` is driven by the `BASE_PATH`
environment variable so the same build serves both
`jacksonzheng07.github.io/raccoon-portfolio` and a future apex domain.

### Data flow

Notion API → `scripts/sync-notion.ts` → `content/projects/*.json` (committed)
→ `lib/projects.ts` (validated at build) → static pages.

Notion is a build-time source, never a runtime dependency. The site builds and
deploys with no Notion token present. Re-syncing is an explicit, reviewable
action that produces a diff.

### Content model

```ts
type Priority = "Flagship" | "Strong" | "Supporting";

type Project = {
  slug: string;
  name: string;
  tagline: string;
  domain: "Systems" | "Product" | "Data" | "Infrastructure";
  priority: Priority;
  status: string;
  start: string;   // ISO date
  end: string;     // ISO date
  skills: string[];
  repo: string;
  notionUrl: string;
  overview: string;
  timeline: { date: string; evidence: string; what: string; how: string }[];
  contributions: string[];
  technical: { area: string; points: string[] }[];
  architecture: string[];      // the flow sketch, one step per line
  evidence: string[];
  skillsDemonstrated: string;
  resumeBullets: string[];
  talkingPoints: string[];
  followUps: string[];
};
```

Depth follows the Notion `Priority` field. `Flagship` and `Strong` projects
render a full case study at `/work/<slug>`. `Supporting` projects render a
card on `/work` that links to the repo, with no dedicated page — the card is
honest about there being less to show.

Flagship: PyStruct, SkyPrint, AfterCare, EmptyNEU.
Strong: Sprouted, L3.
Supporting: Portfolio, California Housing / ML, Enigma, MySneakyLink.

## Error handling

The content layer is the only place that can fail, and it fails at build time
by design. `lib/projects.ts` validates every JSON file against the schema and
throws with the offending file and field named. A missing or malformed project
breaks the build rather than shipping a blank page. `generateStaticParams`
derives slugs from the same validated set, so a case-study route cannot exist
without content behind it.

`scripts/sync-notion.ts` reads its token from `NOTION_TOKEN` and exits with a
clear message when it is absent. It writes only to `content/projects/`, never
partially: it validates every fetched project before writing any file.

## Testing

Vitest covers the content layer, which is where the real logic lives: schema
validation rejects malformed projects, slugs are unique and URL-safe, priority
ordering is stable, and the Flagship/Strong/Supporting split matches the
routes that get generated. Design tokens are asserted against
`app/globals.css` so a token rename cannot silently drop the palette.

Playwright smoke-tests the built static export: every route renders, the nav
reaches each section, the work filter narrows the grid, a case-study page
shows its timeline, and the 404 renders. Accessibility gets an explicit pass —
landmark structure, one `h1` per page, alt text on every image, visible focus
rings, and colour contrast on the night band.

## Delivery

Ten pull requests onto `main`, each independently reviewable:

1. scaffold, tooling, CI
2. design tokens and UI primitives
3. raccoon SVG asset set and motif components
4. Notion sync script, content model, ten JSON files
5. home page
6. `/work` index with filters
7. `/work/[slug]` case studies
8. `/notes`, 404, footer and contact
9. SEO, Open Graph, sitemap, accessibility pass
10. GitHub Pages deploy workflow

A Projects v2 board tracks these plus the backlog harvested from the Notion
`Next Action` and `What To Improve` fields — screenshots, an ER diagram, CI
workflow names, methodology citations, a resume download.

## Out of scope

A CMS or live Notion reads at runtime. A blog engine; `/notes` is static
content until there is something to publish. Analytics. Dark mode — the paper
surface is the identity. Custom domain migration, which stays a manual DNS
decision.
