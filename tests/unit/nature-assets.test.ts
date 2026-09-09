import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(path.join(process.cwd(), p), "utf8");
const svgs = (dir: string) =>
  readdirSync(path.join(process.cwd(), dir))
    .filter((f) => f.endsWith(".svg"))
    .sort();

/** Every coordinate-bearing attribute, in document order. */
function geometry(source: string): string[] {
  return [...source.matchAll(/\s(?:d|cx|cy|r|rx|ry|transform)="([^"]+)"/g)].map(
    (m) => m[1].replace(/\s+/g, " ").trim(),
  );
}

/** The per-name source of a generated art registry, split on its entry keys. */
function entries(componentPath: string): Map<string, string> {
  const src = read(componentPath);
  const found = new Map<string, string>();
  const starts = [...src.matchAll(/^ {2}"([a-z-]+)": \{$/gm)];
  starts.forEach((m, i) => {
    const from = m.index ?? 0;
    const to = i + 1 < starts.length ? (starts[i + 1].index ?? src.length) : src.length;
    found.set(m[1], src.slice(from, to));
  });
  return found;
}

const SPECIMENS = [
  "acorn.svg",
  "bare-twig.svg",
  "berry-cluster.svg",
  "cattail.svg",
  "contour-fragment.svg",
  "dandelion-seed.svg",
  "feather.svg",
  "fern-frond.svg",
  "maple-leaf.svg",
  "moon-phases.svg",
  "mushroom-cluster.svg",
  "oak-leaf.svg",
  "pine-sprig.svg",
  "pine-tree.svg",
  "pinecone.svg",
  "pressed-flower.svg",
  "river-reed.svg",
  "seed-pod.svg",
  "star-cluster.svg",
  "water-ripple.svg",
];

const MARKS = [
  "arrow-hand.svg",
  "bracket.svg",
  "coffee-ring.svg",
  "paper-clip.svg",
  "push-pin.svg",
  "ruled-margin.svg",
  "scale-bar.svg",
  "specimen-tag.svg",
  "tape-strip.svg",
  "torn-edge.svg",
];

/** The new micro-details only. The eight set pieces are another agent's work. */
const MICRO = [
  "ears-peek.svg",
  "face-corner.svg",
  "mask-eyes.svg",
  "paw-reach.svg",
  "raccoon-tiny.svg",
  "tail-curl.svg",
  "tail-flick.svg",
  "track-single.svg",
  "track-trail.svg",
];

const LIBRARY: [string, string[]][] = [
  ["public/assets/nature", SPECIMENS],
  ["public/assets/marks", MARKS],
  ["public/assets/raccoon", MICRO],
];

const every = LIBRARY.flatMap(([dir, files]) => files.map((f) => `${dir}/${f}`));

describe("nature asset inventory", () => {
  it("ships the full botanical vocabulary", () => {
    expect(svgs("public/assets/nature")).toEqual(SPECIMENS);
  });

  it("ships the full set of notebook furniture", () => {
    expect(svgs("public/assets/marks")).toEqual(MARKS);
  });

  it("adds every raccoon micro-detail without disturbing the set pieces", () => {
    const present = svgs("public/assets/raccoon");
    for (const name of MICRO) expect(present).toContain(name);
    for (const name of ["raccoon-hero.svg", "mark.svg", "paw-print.svg"]) {
      expect(present).toContain(name);
    }
  });
});

describe.each(every)("%s", (file) => {
  const svg = read(file);

  it("scales instead of pinning a pixel size", () => {
    expect(svg).toContain("<svg");
    expect(svg).toContain("viewBox=");
    expect(svg).not.toMatch(/<svg[^>]*\s(?:width|height)=/);
  });

  it("is a single-weight line drawing", () => {
    expect(svg).toContain('stroke="currentColor"');
    expect(svg).toContain('stroke-width="2"');
    expect(svg).toContain('stroke-linecap="round"');
    expect(svg).toContain('stroke-linejoin="round"');
  });

  it("uses no filters, gradients or opacity tricks", () => {
    expect(svg).not.toMatch(/filter|Gradient|clip-path|opacity|blur/);
  });

  it("fills only with a token, never a loose hex", () => {
    expect(svg).not.toMatch(/#[0-9a-fA-F]{6}(?!\))/);
  });

  it("is decorative, so it is hidden from assistive technology", () => {
    expect(svg).toContain('aria-hidden="true"');
    expect(svg).not.toContain('role="img"');
  });
});

describe("the generated art registries cannot drift from the svg files", () => {
  const registries: [string, string, string[]][] = [
    ["components/nature/specimen-art.tsx", "public/assets/nature", SPECIMENS],
    ["components/nature/mark-art.tsx", "public/assets/marks", MARKS],
    ["components/raccoon/micro-art.tsx", "public/assets/raccoon", MICRO],
  ];

  it.each(registries)("%s covers exactly its directory", (registry, _dir, files) => {
    expect([...entries(registry).keys()].sort()).toEqual(
      files.map((f) => f.replace(/\.svg$/, "")),
    );
  });

  const pairs = registries.flatMap(([registry, dir, files]) =>
    files.map((file) => [registry, `${dir}/${file}`, file.replace(/\.svg$/, "")] as const),
  );

  it.each(pairs)("%s draws %s with the same coordinates", (registry, file, name) => {
    const entry = entries(registry).get(name);
    expect(entry).toBeDefined();
    const inline = geometry(entry as string);
    expect(inline.length).toBeGreaterThan(0);
    expect(inline).toEqual(geometry(read(file)));
  });

  it.each(pairs)("%s carries the viewBox of %s", (registry, file, name) => {
    const entry = entries(registry).get(name) as string;
    const declared = /viewBox: "([^"]+)"/.exec(entry)?.[1];
    const onDisk = /viewBox="([^"]+)"/.exec(read(file))?.[1];
    expect(declared).toBe(onDisk);
  });
});

describe("the component layer", () => {
  it("keeps the single-weight stroke settings in one place", () => {
    const src = read("components/nature/field-art.tsx");
    expect(src).toContain('stroke="currentColor"');
    expect(src).toContain('strokeWidth="2"');
    expect(src).toContain('strokeLinecap="round"');
    expect(src).toContain('strokeLinejoin="round"');
    expect(src).toContain('fill="none"');
    expect(src).toContain('aria-hidden="true"');
    expect(src).toContain('role="img"');
  });

  const components = [
    "components/nature/Specimen.tsx",
    "components/nature/MoonPhases.tsx",
    "components/nature/TapeStrip.tsx",
    "components/nature/SpecimenTag.tsx",
    "components/nature/TrackTrail.tsx",
    "components/nature/ScatterMark.tsx",
    "components/raccoon/RaccoonPeek.tsx",
    "components/raccoon/RaccoonMargin.tsx",
    "components/raccoon/MaskEyes.tsx",
    "components/raccoon/TailFlick.tsx",
  ];

  it.each(components)("%s draws through the shared wrapper, never its own copy", (file) => {
    const src = read(file);
    expect(src).toContain("FieldSvg");
    expect(src).not.toMatch(/\sd="/);
    expect(src).not.toMatch(/#[0-9a-fA-F]{6}(?!\))/);
  });

  it("names its specimens as a union, so a typo will not compile", () => {
    const src = read("components/nature/specimen-art.tsx");
    expect(src).toContain("export type SpecimenName =");
    expect(read("components/nature/Specimen.tsx")).toContain("name: SpecimenName");
    // the union carries every specimen
    for (const file of SPECIMENS) {
      expect(src).toContain(`| "${file.replace(/\.svg$/, "")}"`);
    }
  });

  it("builds the trail out of the single track mark", () => {
    const src = read("components/nature/TrackTrail.tsx");
    expect(src).toContain('MICRO_ART["track-single"]');
    expect(src).toContain("steps");
    expect(src).toContain("direction");
  });

  it("offers every corner for a scattered mark", () => {
    const src = read("components/nature/ScatterMark.tsx");
    for (const corner of ["top-left", "top-right", "bottom-left", "bottom-right"]) {
      expect(src).toContain(`"${corner}"`);
    }
  });
});
