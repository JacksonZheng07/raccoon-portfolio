# The nocturnal palette — design

**Date:** 2026-09-13
**Status:** proposed, awaiting review
**Supersedes:** the palette section of `2026-09-08-raccoon-portfolio-design.md`
**Source:** the "Trashcan Detective" style tile supplied 2026-09-13

## What is changing, and what is not

The site becomes dark by default and fully neutral. Charcoal is the page, not
an occasional band. No hue survives anywhere: the blue highlight on *apart*,
the pink stamp, the green-on-night accent and the rust roundel all go.

The raccoon stays. This is a palette change and nothing else — no rebrand to
"The Trashcan Detective", no shift of the subject from the animal to the bin,
no change to any copy. The style tile proposes those things too; they were
considered and declined.

The tile's body copy is garbled placeholder text ("A case study murrtor
redesign of a specific dumpster redesign"). Nothing in it was read as content.
Only its palette and its treatment of plates informed this document.

## What the source actually specifies

The tile names four colours:

| Swatch | Hex | Labelled |
| --- | --- | --- |
| Primary Icon | `#333333` | icon strokes |
| Badge Fill | `#FFFFFF` | badge interiors |
| Badge Border | `#EFEFEF` | badge edges |
| Wireframe Lines | `#BBBBBB` | wireframe rules |

It does **not** give a hex for the dark surface its page mockup sits on, which
is the single most important colour in a dark-first system. `#2b2b2b` and
`#3a3a3a` below are read off the mockup panel, not supplied. They are the one
place this document invents a value, and they should be the first thing
checked against the source if the result looks wrong.

## The ramp

Ten tokens replace the fifteen the site will have once #107 lands (fourteen on
`main` today, plus `--color-rust`).

| Token | Value | Role | Replaces |
| --- | --- | --- | --- |
| `--color-surface` | `#2b2b2b` | the page | `paper`, `night` |
| `--color-surface-raised` | `#3a3a3a` | alternating band, card ground | `shell`, `accent-blue`, `accent-pink` |
| `--color-plate` | `#ffffff` | photograph and illustration ground | — (new) |
| `--color-plate-edge` | `#efefef` | secondary plate, plate borders | — (new) |
| `--color-ink` | `#efefef` | body text on dark | `ink`, `night-text` |
| `--color-ink-bright` | `#ffffff` | h1, current nav item, focus ring | `mask` |
| `--color-ink-plate` | `#333333` | text and strokes on a light plate | `ink` (on plates) |
| `--color-rule` | `#d4d4d4` | the 2px borders | `line`, `night-line` |
| `--color-muted` | `#bbbbbb` | specimen labels | `muted`, `muted-strong` |
| `--color-figure` | `#999999` | decorative art: tracks, debris, trails | `ringtail` |

Measured, from the WCAG relative-luminance formula rather than estimated:

| Foreground | on `#2b2b2b` | on `#3a3a3a` | needs |
| --- | --- | --- | --- |
| `--color-ink` `#efefef` | 12.31:1 | 9.89:1 | 4.5 (text) |
| `--color-ink-bright` `#ffffff` | 14.16:1 | 11.37:1 | 4.5 (text) |
| `--color-muted` `#bbbbbb` | 7.38:1 | 5.92:1 | 4.5 (text) |
| `--color-rule` `#d4d4d4` | 9.55:1 | 7.67:1 | 3.0 (non-text) |
| `--color-figure` `#999999` | 4.97:1 | 3.99:1 | 3.0 (non-text) |

`--color-ink-plate` `#333333` measures 12.63:1 on `--color-plate` and 10.99:1
on `--color-plate-edge`.

Every pair clears its requirement; the tightest margin is `--color-figure` on
`--color-surface-raised`, at 0.99 over the 3:1 non-text threshold. `figure` is
held to 3:1 rather than 4.5:1 deliberately — it draws paw prints and spilled
rubbish, never type. **If a future change sets text in it, it fails**, and that
is worth a comment in the token itself.

Two structural notes fall out of the ramp:

- **The two-step muted grey goes away.** `--color-muted-strong` exists only
  because `--color-muted` measured 4.21:1 on accent pink and 4.57:1 on shell.
  Neither surface survives, so one muted grey is enough again.
- **Rules invert their relationship to text.** Today `--color-line` `#272727`
  is *darker* than `--color-muted` `#5d5e5b`: rules are the stronger mark. On
  dark that means brighter, so `--color-rule` `#d4d4d4` sits above
  `--color-muted` `#bbbbbb`. Keeping rules subordinate would quietly dismantle
  the 2px border language the whole site is built on.

## Why the names change

The current tokens are named for materials — `paper`, `ink`, `line`, `shell`,
`night`. Those names encode a light-first assumption. Remapping their values
so `--color-paper` holds charcoal is the smallest possible diff and was
rejected: 326 inline art fills say `fill="var(--color-paper, #f7f3e9)"`,
meaning "fill me with the surface behind me", and under a remap every one of
them would name the opposite of what it does.

Semantic names survive a re-theme. Material names have to be re-lied about
every time.

`--color-night` disappears entirely rather than being renamed. In a dark-first
site the night band is not a special surface; it is the surface.

## Bands without hue

Six tones become three: `surface`, `raised`, and `plate`.

The alternation machinery is kept exactly as it is. `Section` already picks a
tone per band, and `main > section:nth-child(even of .tone-auto)` already
alternates the undecided ones. Only the two colours it alternates between
change. This is the part of the current design that survives the swap intact,
and it is why the swap is tractable at all.

What is genuinely lost: the site distinguishes nine bands partly by hue today,
and value alone is a weaker signal. The 11-point gap between `#2b2b2b` and
`#3a3a3a` is deliberately small — large enough to register as a change of
band, small enough not to read as a different page. Compensation comes from
the 2px rules, which get **brighter** relative to their surface than they are
now, and carry more of the structural load as a result.

## The plates are the reason this works

`mix-blend-multiply` is used on three photographs. Multiply over a dark ground
drives every pixel toward black, so on charcoal the photographs would be
destroyed.

The fix is the one the source tile already shows: photographs and
illustrations sit on a **light plate**, and the dark surface frames them. The
blend mode is dropped, not re-tuned — it existed to marry warm photographs to
a warm tinted ground, and neither the warmth nor the tint survives.

This also makes the hero's specimen card correct rather than accidental: it
already puts its photograph on a light ground inside a ruled window, which is
exactly the treatment every other plate now adopts.

## Consequences that are not colour

These are the things that break quietly. Each needs doing as part of the swap,
not after it.

1. **Hard offset shadows invert.** `--shadow-lift` and `--shadow-press` are
   `--color-line`, a near-black. On charcoal they are invisible. They become
   the rule colour, so the offset reads as a lift rather than a hole.
2. **`--shadow-stamp` loses its pink** and `--shadow-frame` its raw `#999`;
   both become ramp tokens.
3. **The focus ring vanishes.** `--color-mask` is `#2b2b30`, within a hair of
   `#2b2b2b`. The default ring becomes light, and the `.tone-night` override
   that currently lightens it is deleted along with the band it served.
4. **`app/og.png/route.tsx` reads token names out of `globals.css` by regex
   and throws when one is missing.** Renaming tokens is a hard dependency:
   the route updates in the same commit or the build fails.
5. **`app/icon.svg` hardcodes `#f7f3e9`.** The favicon is the one asset with
   no CSS context at all; it takes literal values.
6. **`#f7f3e9` appears in 326 inline art fills and 45 public SVGs** as the
   fallback in `var(--color-paper, #f7f3e9)`. The inline copies take the var
   and are fine on value; the public files are rendered without CSS when
   loaded as images, so their fallback is what actually paints. Both sides
   change. `tests/unit/raccoon-assets.test.ts` compares geometry only, never
   fills, so this migration is mechanically safe and well covered.
7. **The grain loses its second amplitude.** `--field-grain` has a full-strength
   tile and a reduced one for the night band, because mid-grey noise lightens a
   dark surface. Dark-first makes the reduced one the default and the
   full-strength one unnecessary.
8. **The token tests are rewritten.** `design-tokens.test.ts` asserts 26 values
   and `specimen-card.test.ts` asserts the rust token. Both must assert the new
   ramp, including the measured ratios, or the contrast work is unguarded.

## Testing

The existing gates are the right ones and mostly do not change:

- `tests/e2e/a11y.spec.ts` runs axe against every route and fails on serious
  and critical violations. A palette swap is exactly the change this exists
  for, and it is the primary proof that the new ramp holds. It measures the
  instant a page loads, which has already caught one contrast regression on
  this site.
- `design-tokens.test.ts` is rewritten to assert the ten values and every
  ratio in the table above, so the contrast work is guarded by the same
  mechanism that guards it today.
- `raccoon-assets.test.ts` and `nature-assets.test.ts` need no change —
  geometry-only, fill-agnostic.
- A new assertion that no `#f7f3e9`, no accent hue and no `--color-rust`
  survives anywhere under `app/` or `components/`, so a missed file fails the
  build rather than shipping as one warm rectangle on a dark page.

## Sequencing

This branches from `main` **after** PR #107 (the hero specimen card) merges.
Doing it before means resolving the same hero panel twice.

## Open questions

1. `#2b2b2b` and `#3a3a3a` are read off the mockup, not specified. Confirm or
   replace them.
2. The hero photograph carries a baked-in ivory ground that is warmer than
   `#ffffff`. On a white plate it will read very slightly warm. Accept, or
   set the plate to `#efefef` where photographs sit.
3. Nine bands separated by an 11-point value step is the weakest part of this
   design. It should be looked at on a real page before the whole site
   commits to it.
