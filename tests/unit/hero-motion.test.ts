import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/*
 * The hero's motion lives in its own CSS module rather than in the shared
 * style layer, which means `tests/unit/design-tokens.test.ts` -- which reads
 * `app/globals.css` and nothing else -- does not cover it. This file is the
 * same gate for the same failure mode: an animation that the reduced-motion
 * guard forgets, or one that leaves an element stranded at zero opacity when
 * the guard switches it off.
 */
const css = readFileSync(
  path.join(process.cwd(), "components/site/hero-motion.module.css"),
  "utf8",
);

const GUARD_AT = css.indexOf("@media (prefers-reduced-motion");
const above = css.slice(0, GUARD_AT);
const guard = css.slice(GUARD_AT);

/** Every class in `source` that starts an animation, by name. */
function animatedClasses(source: string): string[] {
  return [
    ...source.matchAll(
      /\.([A-Za-z][\w-]*)\s*\{[^}]*animation(?:-name)?:\s*(?!none)/g,
    ),
  ].map((match) => match[1]);
}

describe("hero motion", () => {
  it("has a reduced-motion guard at all", () => {
    expect(GUARD_AT).toBeGreaterThan(0);
    expect(guard).toContain("animation: none !important");
    expect(guard).toContain("animation-timeline: auto !important");
  });

  /*
   * The regression this guards is the one already found and fixed once in
   * `app/globals.css`: the blanket `animation-duration: 0.01ms` in the global
   * guard does not stop a scroll-driven `view()` or `scroll()` timeline, and
   * even for a time-driven animation it only decides how fast the animation
   * runs, not where it stops. Naming every animated class is the only
   * mechanism that actually holds.
   */
  it("names every animated class inside the guard", () => {
    const animated = animatedClasses(above);
    expect(animated.length).toBeGreaterThan(0);
    for (const name of animated) {
      /* `.name` as a whole selector: followed by a comma or a brace. */
      const named = new RegExp(`\\.${name}\\s*[,{]`).test(guard);
      expect(named, `.${name} is animated but not named in the guard`).toBe(
        true,
      );
    }
  });

  it("clears any scroll-driven timeline it declares", () => {
    const timelines = [
      ...above.matchAll(/\.([A-Za-z][\w-]*)\s*\{[^}]*animation-timeline:/g),
    ].map((match) => match[1]);
    for (const name of timelines) {
      expect(guard).toContain(`.${name}`);
    }
  });

  /*
   * The one-shot entrances start at `opacity: 0` and rely on their animation
   * to bring them in. Switching the animation off without asserting the end
   * state would hide them from exactly the visitors who asked for less
   * motion, not more.
   */
  it("leaves the one-shot entrances visible when motion is off", () => {
    const hidden = [
      ...above.matchAll(/\.([A-Za-z][\w-]*)[^{]*\{\s*opacity:\s*0;\s*\}/g),
    ].map((match) => match[1]);
    expect(hidden.length).toBeGreaterThan(0);

    const restored = guard.slice(guard.indexOf("opacity: 1 !important"));
    const selectors = guard.slice(0, guard.indexOf("opacity: 1 !important"));
    expect(restored).not.toBe("");
    for (const name of hidden) {
      expect(
        selectors,
        `.${name} starts hidden but the guard never restores it`,
      ).toContain(`.${name}`);
    }
  });

  /* The house rules, checked here because this file is not scanned elsewhere. */
  it("uses tokens rather than literal colours, and no soft edges", () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(css).not.toContain("border-radius");
    expect(css).not.toContain("gradient");
    expect(css).not.toContain("blur");
    expect(css).not.toContain("box-shadow");
  });

  /*
   * Anything that animates a layout property can shift the headline while it
   * is being read. The hero animates transforms and opacity only.
   */
  it("animates nothing that reflows the page", () => {
    const keyframes = [...css.matchAll(/@keyframes[^{]+\{([\s\S]*?)\n\}/g)]
      .map((match) => match[1])
      .join("\n");
    expect(keyframes).not.toBe("");
    const properties = new Set(
      [...keyframes.matchAll(/^\s{4}([a-z-]+):/gm)].map((match) => match[1]),
    );
    expect([...properties].sort()).toEqual(["opacity", "transform"]);
  });
});
