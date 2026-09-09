import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const assetDir = path.join(process.cwd(), "public/assets/raccoon");
const files = readdirSync(assetDir).filter((f) => f.endsWith(".svg"));
const read = (p: string) => readFileSync(path.join(process.cwd(), p), "utf8");
const asset = (name: string) => read(`public/assets/raccoon/${name}`);

/** Every coordinate-bearing attribute, in document order. */
function geometry(source: string): string[] {
  return [...source.matchAll(/\s(?:d|cx|cy|r|rx|ry|transform)="([^"]+)"/g)].map(
    (m) => m[1].replace(/\s+/g, " ").trim(),
  );
}

/* The set pieces the design spec names. */
const setPieces = [
  "mark.svg",
  "paw-print.svg",
  "raccoon-hero.svg",
  "raccoon-lantern.svg",
  "raccoon-peek.svg",
  "raccoon-reading.svg",
  "raccoon-tools.svg",
  "ringtail-rule.svg",
];

/*
 * The small marks that scatter across the pages. These are asserted in full by
 * tests/unit/nature-assets.test.ts; here they only have to satisfy the same
 * drawing conventions as the set pieces.
 */
const microDetails = [
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

const expected = [...setPieces, ...microDetails].sort();

describe("raccoon svg asset set", () => {
  it("ships every illustration the design calls for", () => {
    expect(files.sort()).toEqual(expected);
  });

  it.each(expected)("%s is a scalable, single-weight line drawing", (name) => {
    const svg = asset(name);
    expect(svg).toContain("<svg");
    expect(svg).toContain("viewBox=");
    expect(svg).not.toMatch(/<svg[^>]*\s(?:width|height)=/);
    expect(svg).toContain('stroke="currentColor"');
    expect(svg).toContain('stroke-width="2"');
    expect(svg).toContain('stroke-linecap="round"');
    expect(svg).toContain('stroke-linejoin="round"');
  });

  it.each(expected)("%s uses no filters, gradients or opacity tricks", (name) => {
    const svg = asset(name);
    expect(svg).not.toMatch(/filter|Gradient|clip-path|opacity|blur/);
  });

  it("labels the hero and hides the decorative pieces", () => {
    expect(asset("raccoon-hero.svg")).toContain('role="img"');
    expect(asset("raccoon-hero.svg")).toContain("aria-label=");
    expect(asset("paw-print.svg")).toContain('aria-hidden="true"');
    expect(asset("ringtail-rule.svg")).toContain('aria-hidden="true"');
    expect(asset("mark.svg")).toContain('aria-hidden="true"');
  });

  it("serves the mask glyph as the favicon unchanged", () => {
    expect(read("app/icon.svg")).toEqual(asset("mark.svg"));
  });
});

describe("inline components match their source svg", () => {
  it.each([
    ["RaccoonHero.tsx", "raccoon-hero.svg"],
    ["PawDivider.tsx", "paw-print.svg"],
    ["RingtailRule.tsx", "ringtail-rule.svg"],
    ["MaskBadge.tsx", "mark.svg"],
  ])("%s draws the same geometry as %s", (component, svg) => {
    const inline = geometry(read(`components/raccoon/${component}`));
    expect(inline.length).toBeGreaterThan(0);
    expect(inline).toEqual(geometry(asset(svg)));
  });

  it.each(["RaccoonHero.tsx", "PawDivider.tsx", "RingtailRule.tsx", "MaskBadge.tsx"])(
    "%s keeps the single-weight stroke settings",
    (component) => {
      const src = read(`components/raccoon/${component}`);
      expect(src).toContain('stroke="currentColor"');
      expect(src).toContain('strokeWidth="2"');
      expect(src).toContain('strokeLinecap="round"');
      expect(src).toContain('strokeLinejoin="round"');
      expect(src).not.toMatch(/#[0-9a-fA-F]{6}(?!\))/);
    },
  );
});
