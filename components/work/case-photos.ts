/*
 * The photograph each case file is filed behind.
 *
 * These six are the licensed plates that went unused when the photographic
 * band was replaced. They are real photographs of the animal the notebook is
 * named after, already paid for in provenance: every one is recorded in
 * `public/assets/photos/ATTRIBUTION.md` with its photographer, source page
 * and licence.
 *
 * `raccoon.jpg` and `raccoon-glasses.jpg` are deliberately not here. The
 * attribution file flags both as unknown provenance and says in as many words
 * not to use them, and a portfolio is the last place to ship an image nobody
 * can account for.
 *
 * The crop anchors are carried over from the plates the photographs used to
 * sit in rather than guessed again: each one was chosen so the animal
 * survives a crop that is much wider than the photograph's own aspect.
 */
export type CasePhoto = {
  file: string;
  alt: string;
  /** Crop anchor, chosen per photograph so the animal survives the crop. */
  position: string;
};

export const CASE_PHOTOS: readonly CasePhoto[] = [
  {
    file: "raccoons-on-dumpster.jpg",
    alt: "Four raccoons piled against one another on the rim of a blue metal dumpster, a chain-link fence behind them and one ringed tail hanging over the edge",
    position: "object-[center_40%]",
  },
  {
    file: "raccoon-peeking-fence.jpg",
    alt: "A raccoon standing upright on its hind legs, both front paws gripping a wooden fence post, looking straight at the camera",
    position: "object-[62%_35%]",
  },
  {
    file: "raccoon-on-tree-trunk.jpg",
    alt: "A raccoon looking down from behind the trunk of a large tree at night, most of its body hidden in dark leaves",
    position: "object-[center_25%]",
  },
  {
    file: "raccoon-on-deck.jpg",
    alt: "A raccoon walking across the boards of a wooden deck in low sunlight, framed between two railing posts, with dense green foliage behind it",
    position: "object-[40%_center]",
  },
  {
    file: "raccoon-in-ferns.jpg",
    alt: "A raccoon sitting upright among dark green ferns in woodland, seen from above, looking up towards the camera",
    position: "object-[center_28%]",
  },
  {
    file: "raccoon-portrait-closeup.jpg",
    alt: "Close portrait of a raccoon's face, head tilted, whiskers lit against a dark blurred background",
    position: "object-[center_38%]",
  },
];

/**
 * Which photograph a project gets.
 *
 * Keyed on the slug rather than on filing order, so a project keeps its
 * photograph when another is added, removed or reordered — and so the same
 * project shows the same animal on every build.
 */
export function photoFor(slug: string): CasePhoto {
  const sum = [...slug].reduce((total, ch) => total + ch.charCodeAt(0), 0);
  return CASE_PHOTOS[sum % CASE_PHOTOS.length] as CasePhoto;
}
