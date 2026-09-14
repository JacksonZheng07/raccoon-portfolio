# Photography credits

Every photograph shipped from this directory, where it came from, and the
licence it is used under. This repository is public, so the licence for each
file was checked on that file's own source page rather than assumed from the
platform's general terms — Unsplash hosts two different licences side by side
and the free one is not the default for every photo.

## Licensed photography

All six were verified individually on their Unsplash photo pages, each of
which states "Free to use under the Unsplash License". The Unsplash License
permits commercial use and does not require attribution; the credits below are
recorded because a public repository should be able to account for its assets,
not because the licence compels them.

| File | Photographer | Source page | Licence |
| --- | --- | --- | --- |
| `raccoon-portrait-closeup.jpg` | Chris Ensminger | https://unsplash.com/photos/gWo-hfRotrI | Unsplash License |
| `raccoons-on-dumpster.jpg` | JD-Photos | https://unsplash.com/photos/a-group-of-raccoons-sitting-on-top-of-a-metal-container-kdi6BbzUY4A | Unsplash License |
| `raccoon-peeking-fence.jpg` | fr0ggy5 | https://unsplash.com/photos/5lq_93YTP4s | Unsplash License |
| `raccoon-on-deck.jpg` | fr0ggy5 | https://unsplash.com/photos/cHyTr1fTiN0 | Unsplash License |
| `raccoon-in-ferns.jpg` | Toan Chu | https://unsplash.com/photos/VEzDhGMlyb8 | Unsplash License |
| `raccoon-on-tree-trunk.jpg` | Yann Allegre | https://unsplash.com/photos/black-and-white-raccoon-NMUkamFAS-s | Unsplash License |

The Unsplash License itself: https://unsplash.com/license

All six were resized to roughly 1400px on the long edge at quality 82 and
stripped of metadata, which is why they no longer carry the photographer in
EXIF. This file is the record instead. `raccoon-portrait-closeup.jpg` was also
cropped to 3:4 around the animal's head to suit the portrait slot on the home
page; nothing else was altered.

## AI-generated artwork

One file here is not a photograph and is not licensed stock. It is filed in
this directory because it is served exactly like the plates are, and separated
under its own heading so it is never mistaken for a seventh animal somebody
forgot to credit.

| File | Origin | Source page | Licence |
| --- | --- | --- | --- |
| `raccoon-detective.webp` | **AI-generated artwork**, produced for the home page hero and delivered in the `raccoon-hero-kit` handoff | none — no photographer, no stock library, no source page | owner's own asset; no third-party rights known to attach |

Stated plainly because a public repository should not make a reader guess: it
was generated, not drawn by a person and not photographed. The original design
notes ruled out AI-generated artwork, and shipping this one is a documented
exception to that rule rather than an oversight — see `README.md` and
`docs/design/2026-09-08-raccoon-portfolio-design.md`.

It depicts a raccoon in a deerstalker and coat holding a magnifier over a
circuit board: a character, not an observation of a real animal. The delivered
kit also held a 1122x1402 PNG original and a glTF model of the same character;
the PNG is not committed, and the model is parked outside `public/` in
`assets/3d/`. See `assets/3d/README.md`.

## No longer referenced by the site

As of 2026-09-13 the home page's photographic band was replaced by the case
bins, so the five plate photographs — `raccoons-on-dumpster.jpg`,
`raccoon-on-tree-trunk.jpg`, `raccoon-peeking-fence.jpg`, `raccoon-on-deck.jpg`
and `raccoon-in-ferns.jpg` — are no longer used anywhere.

They are kept rather than deleted: they are correctly licensed, they are
recorded here, and a licence record that points at files somebody removed is
worse than a few unused images. `raccoon-portrait-closeup.jpg` is still in
use, in the about band.

## Rejected

| Candidate | Photographer | Source page | Why not used |
| --- | --- | --- | --- |
| "A raccoon climbs a tree at night" | Giulia Squillace | https://unsplash.com/photos/a-raccoon-climbs-a-tree-at-night-ae5UTC45r5U | Unsplash+ photo, licensed under the **Unsplash+ License**, not the free Unsplash License. It is a paid subscription licence with different terms and it is not ours to use. It was the best night shot available, and it is the reason every other photo here was checked one at a time. |

Several other raccoon results in the same search — credited to Getty Images,
Jason Leung, Paris Bilal and Zdeněk Macháček — carried the Unsplash+ badge on
the search listing. They were skipped on that basis rather than opened
individually, so treat the badge as the only evidence here; the point is that
they were not candidates, not that their licences have been confirmed.

## Unknown provenance — needs action

| File | Photographer | Source page | Licence |
| --- | --- | --- | --- |
| `raccoon.jpg` | **unknown** | **unknown** | **unknown** |
| `raccoon-glasses.jpg` | **unknown** | **unknown** | **unknown** |

These two arrived from the owner's local working folder. They carry no EXIF, no
copyright field, and no licence record anywhere in this repository, and no
source has been established for either of them. Nothing above should be read as
covering them.

Neither is referenced by the site any more — `raccoon-glasses.jpg` was the
About-section portrait and has been replaced by
`raccoon-portrait-closeup.jpg`. They remain committed only so this record has
something to point at. **They should be either verified against a real licence
or deleted from the repository and from git history.** Until one of those
happens, do not use them anywhere, and do not treat their presence here as
permission.
