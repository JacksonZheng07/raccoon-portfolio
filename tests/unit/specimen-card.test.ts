import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(path.join(process.cwd(), p), "utf8");
const at = (p: string) => path.join(process.cwd(), p);

const CARD = "components/detective/SpecimenCard.tsx";
const PHOTO = "public/assets/photos/raccoon-detective.webp";

const card = () => read(CARD);
const home = () => read("app/page.tsx");

describe("the detective specimen photograph", () => {
  it("ships the web encoding, not the full-resolution original", () => {
    expect(existsSync(at(PHOTO))).toBe(true);
    /*
     * The kit also contains a 1122x1402 PNG at just under 2 MB. It is the
     * hero of the page, so it is never lazy-loaded and never below the fold:
     * whatever is committed here is on the critical path of every first
     * visit. The webp is the same subject at the same proportions for a
     * tenth of the bytes, and the PNG is deliberately left out of the repo.
     */
    expect(statSync(at(PHOTO)).size).toBeLessThan(260_000);
    expect(existsSync(at("public/assets/photos/raccoon-detective.png"))).toBe(
      false,
    );
  });

  /*
   * Every other file in this directory is licensed photography of a real
   * animal, and ATTRIBUTION.md exists so a public repository can account for
   * each one. Generated artwork filed silently beside them would read as a
   * seventh photograph whose credit row somebody forgot to write.
   */
  it("is recorded as AI-generated, in those words", () => {
    const credits = read("public/assets/photos/ATTRIBUTION.md").toLowerCase();
    expect(credits).toContain("raccoon-detective.webp");
    /*
     * "generated" alone is too soft, and an earlier draft of this row said
     * "commissioned", which implies a human artist. The original design
     * notes ruled AI artwork out; shipping this file is a documented
     * exception, and an exception that does not say what it is exempting
     * is just an undocumented asset.
     */
    expect(credits).toContain("ai-generated");
  });

  it("keeps the exception written down where the rule is written down", () => {
    const readme = read("README.md").toLowerCase();
    const design = read(
      "docs/design/2026-09-08-raccoon-portfolio-design.md",
    ).toLowerCase();
    /*
     * Both documents stated the no-AI-artwork rule as absolute. A reader who
     * finds the rule and then finds the hero should find the amendment too,
     * rather than concluding the repo does not follow its own notes.
     */
    expect(readme).toContain("raccoon-detective.webp");
    expect(design).toContain("raccoon-detective.webp");
    expect(readme).not.toMatch(/no ai-generated\s*\n?artwork — a deliberate/);
  });

  it("keeps the 3D companion out of the deployed bundle", () => {
    /*
     * The GLB is version-controlled so it is there when the hero wants real
     * camera movement, but `public/` is copied verbatim into the static
     * export, so 1.4 MB parked there would deploy on every build for a file
     * nothing fetches.
     */
    expect(existsSync(at("assets/3d/raccoon-detective.glb"))).toBe(true);
    expect(existsSync(at("public/assets/3d/raccoon-detective.glb"))).toBe(
      false,
    );
  });
});

describe("SpecimenCard", () => {
  it("serves the photograph through the deploy subpath", () => {
    /*
     * The same trap `Plate` documents: `images.unoptimized` makes next/image
     * return the src verbatim without ever applying basePath, so a plain
     * <img> has to prepend it by hand or the hero 404s on GitHub Pages.
     */
    expect(card()).toMatch(
      /src=\{`\$\{basePath\}\/assets\/photos\/raccoon-detective\.webp`\}/,
    );
    expect(card()).not.toMatch(/<Image\b/);
  });

  it("describes the subject to a reader who cannot see it", () => {
    const source = card();
    /*
     * The description is bound to a name rather than inlined on the tag, so
     * the assertion follows the binding: find what `alt` is given, then read
     * that constant's own string.
     */
    const bound = source.match(/alt=\{([A-Z_]+)\}/);
    expect(bound, "the hero photograph has no alt attribute").not.toBeNull();

    const declared = source.match(
      new RegExp(`const ${bound?.[1]} =\\s*"([^"]+)"`),
    );
    expect(declared, `${bound?.[1]} is used but never declared`).not.toBeNull();

    /* The drawing it replaces carried a full sentence; so must this. */
    const alt = declared?.[1] ?? "";
    expect(alt.length).toBeGreaterThan(60);
    expect(alt.toLowerCase()).toContain("raccoon");
    /* The costume is the joke; a description without it describes an animal. */
    expect(alt.toLowerCase()).toContain("magnif");
  });

  it("prints the specimen furniture from the design study", () => {
    const source = card();
    expect(source).toContain("field specimen / 001");
    expect(source).toContain("j.z.");
    expect(source).toContain("the dumpster detective");
    expect(source).toContain("est. curious");
    expect(source).toContain("still investigating");
    expect(source).toContain("good things are worth a closer look");
  });

  it("draws itself in palette tokens rather than raw colour", () => {
    /*
     * A hex literal here is a colour that the tone classes and the contrast
     * table in globals.css do not know about, and that a palette change
     * would silently leave behind.
     */
    expect(card()).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });

  it("stays a server component", () => {
    /* No tilt, no pointer handlers, no hydration cost in this pass. */
    expect(card()).not.toContain("use client");
    expect(card()).not.toContain("onMouseMove");
  });
});

/*
 * The hero band alone, from its own <section> to the start of the work
 * section that follows it.
 *
 * Scoped rather than matched against the whole file, because the drawn
 * investigator did not leave the page when it left the hero -- it is still
 * mounted twice further down, in the dark band and beside the about copy.
 * A file-wide assertion that the drawing is gone would be wrong, and would
 * fail for the right reasons on a page that is behaving correctly.
 */
function heroBand(): string {
  const source = home();
  const from = source.indexOf('aria-labelledby="hero-heading"');
  const to = source.indexOf('<Section id="work"');
  expect(from, "the hero section is not where it was").toBeGreaterThan(0);
  expect(to, "the work section is not where it was").toBeGreaterThan(from);
  return source.slice(from, to);
}

describe("the hero after the swap", () => {
  it("mounts the card", () => {
    expect(heroBand()).toContain("<SpecimenCard");
  });

  /*
   * The drawn investigator, its blinking lens, the falling rubbish and the
   * occupied bin were one composition. Leaving any single piece behind
   * would leave a drawn raccoon standing beside a photographed one.
   */
  it("retires the drawn investigator and its scene", () => {
    const hero = heroBand();
    expect(hero).not.toContain("<Investigator");
    expect(hero).not.toContain("trash-can-raccoon-inside");
    expect(hero).not.toContain("<Litter");
    /* The lens overlay was the hero's alone: it goes from the whole file. */
    expect(home()).not.toContain("LensLife");
    expect(home()).not.toContain("HERO_FALLING");
  });

  it("keeps the drawing everywhere it was not the hero", () => {
    /*
     * The point of the swap was the hero panel, not the illustration set.
     * The dark band and the about column still mount the investigator, and
     * a change that quietly took those with it would have gone too far.
     */
    expect(home().split("<Investigator").length - 1).toBeGreaterThanOrEqual(2);
  });

  it("keeps the left column's own floor furniture", () => {
    /* The tipped bin and its spill are the column's floor, not the panel. */
    const hero = heroBand();
    expect(hero).toContain("trash-can-tipped");
    expect(hero).toContain("<DebrisTrail");
    expect(home()).toContain("HERO_PRINTS");
  });

  it("leaves one stamp in the hero, not two", () => {
    /* The card's roundel replaces CASE STILL OPEN; both would compete. */
    expect(heroBand()).not.toContain("<Stamp");
  });

  it("drops the motion the retired scene owned", () => {
    const css = read("components/site/hero-motion.module.css");
    for (const dead of ["lidTop", "lidBottom", "glint", "peer", "binRock"]) {
      expect(css, `.${dead} outlived the drawing it animated`).not.toContain(
        `.${dead}`,
      );
    }
    /* The prints still walk across the left column. */
    expect(css).toContain(".paw1");
  });

  /*
   * The card's entrance moves it and never fades it, and that is a
   * correctness rule rather than a taste one. The paw prints can fade
   * because a paw print is a decorative mark; the card is a box full of
   * 11px specimen labels, and fading it makes its own paper translucent
   * over the blue panel underneath. For the few hundred milliseconds that
   * takes, the labels are below AA on contrast -- which is not a
   * theoretical objection, it is the axe-core failure on `/` that this
   * animation shipped with on its first draft. `tests/e2e/a11y.spec.ts`
   * measures the instant the page loads, so it saw it.
   */
  it("moves the card without fading the type inside it", () => {
    const css = read("components/site/hero-motion.module.css");
    const rule = css.slice(css.indexOf(".settle {"));
    const settleRule = rule.slice(0, rule.indexOf("}"));
    expect(settleRule).not.toContain("opacity");

    const frames = css.slice(css.indexOf("@keyframes hero-settle"));
    expect(frames.slice(0, frames.indexOf("\n}"))).not.toContain("opacity");
  });
});
