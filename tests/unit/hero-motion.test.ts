import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/*
 * `tests/unit/design-tokens.test.ts` reads `app/globals.css` and nothing else,
 * so every animation that lives in a CSS module next to the component that
 * uses it is outside its reach. This file is the same gate for the same
 * failure mode, over every module the repository has: an animation the
 * reduced-motion guard forgets, or one that leaves an element stranded at zero
 * opacity when the guard switches it off.
 *
 * The module list is discovered from the filesystem rather than written down,
 * so adding a `*.module.css` anywhere under `components/` puts it under this
 * gate immediately. There is no way to add an animation to the site and not
 * be checked.
 */
const ROOT = path.join(process.cwd(), "components");

function findModules(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return findModules(full);
    return entry.endsWith(".module.css") ? [full] : [];
  });
}

const MODULES = findModules(ROOT).sort();

/** Every class in `source` that starts an animation, by name. */
function animatedClasses(source: string): string[] {
  return [
    ...source.matchAll(
      /\.([A-Za-z][\w-]*)\s*\{[^}]*animation(?:-name)?:\s*(?!none)/g,
    ),
  ].map((match) => match[1]);
}

/*
 * Every declaration block in `source`, as `[selector, body]`. The pattern
 * matches innermost blocks only -- neither group may contain a brace -- which
 * is what lets it see through an `@supports` or `@media` wrapper to the rules
 * inside it. Blocks whose selector names no class (a keyframe's `from`, an
 * at-rule prelude) are dropped.
 */
function rules(source: string): { selector: string; body: string }[] {
  return [...source.matchAll(/([^{}]+)\{([^{}]+)\}/g)]
    .map((match) => ({ selector: match[1].trim(), body: match[2] }))
    .filter((rule) => rule.selector.includes("."));
}

/** Every class whose resting state hides it, wherever in the block it is set. */
function hiddenClasses(source: string): string[] {
  return rules(source)
    .filter((rule) => /(^|[\s;])opacity:\s*0;/.test(rule.body))
    .flatMap((rule) =>
      [...rule.selector.matchAll(/\.([A-Za-z][\w-]*)/g)].map(
        (match) => match[1],
      ),
    );
}

it("finds the CSS modules to check", () => {
  /* A refactor that moves every module out from under `components/` should
     fail here rather than pass a suite that now checks nothing. */
  expect(MODULES.length).toBeGreaterThanOrEqual(3);
});

describe.each(MODULES.map((file) => [path.relative(process.cwd(), file), file]))(
  "%s",
  (_name, file) => {
    const css = readFileSync(file, "utf8");
    const GUARD_AT = css.indexOf("@media (prefers-reduced-motion");
    const above = css.slice(0, GUARD_AT);
    const guard = css.slice(GUARD_AT);

    it("has a reduced-motion guard at all", () => {
      expect(GUARD_AT).toBeGreaterThan(0);
      expect(guard).toContain("animation: none !important");
      expect(guard).toContain("animation-timeline: auto !important");
    });

    /*
     * The regression this guards is the one already found and fixed once in
     * `app/globals.css`: the blanket `animation-duration: 0.01ms` in the
     * global guard does not stop a scroll-driven `view()` or `scroll()`
     * timeline, and even for a time-driven animation it only decides how fast
     * the animation runs, not where it stops. Naming every animated class is
     * the only mechanism that actually holds.
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
        const named = new RegExp(`\\.${name}\\s*[,{]`).test(guard);
        expect(
          named,
          `.${name} declares a scroll timeline the guard never clears`,
        ).toBe(true);
      }
    });

    /*
     * The one-shot entrances start at `opacity: 0` and rely on their animation
     * to bring them in. Switching the animation off without asserting the end
     * state would hide them from exactly the visitors who asked for less
     * motion, not more.
     */
    it("leaves anything that rests hidden visible when motion is off", () => {
      const hidden = hiddenClasses(above);
      if (hidden.length === 0) return;

      const mark = guard.indexOf("opacity: 1 !important");
      expect(mark, "nothing in the guard restores opacity").toBeGreaterThan(0);
      /*
       * Only the selectors that come before the restoring declaration can be
       * the ones carrying it, which is what makes this check about the right
       * rule rather than about the guard containing the name anywhere.
       */
      const selectors = guard.slice(0, mark);
      for (const name of hidden) {
        const named = new RegExp(`\\.${name}\\s*[,{]`).test(selectors);
        expect(
          named,
          `.${name} rests hidden but the guard never restores it`,
        ).toBe(true);
      }
    });

    /* The house rules, checked here because these files are not scanned
       elsewhere. */
    it("uses tokens rather than literal colours, and no soft edges", () => {
      expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
      expect(css).not.toContain("border-radius");
      expect(css).not.toContain("gradient");
      expect(css).not.toContain("blur");
      expect(css).not.toContain("box-shadow");
    });

    /*
     * Anything that animates a layout property can shift the page while it is
     * being read. Every module animates transforms and opacity only.
     */
    it("animates nothing that reflows the page", () => {
      const keyframes = [...css.matchAll(/@keyframes[^{]+\{([\s\S]*?)\n\}/g)]
        .map((match) => match[1])
        .join("\n");
      expect(keyframes).not.toBe("");
      const properties = new Set(
        [...keyframes.matchAll(/^\s{4}([a-z-]+):/gm)].map((match) => match[1]),
      );
      for (const property of properties) {
        expect(["opacity", "transform"]).toContain(property);
      }
      expect(properties.size).toBeGreaterThan(0);
    });
  },
);

/*
 * The scroll-driven trail has two requirements the generic checks above
 * cannot express, and both of them were failure modes found in
 * `app/globals.css` before this branch existed.
 */
describe("the scroll trail", () => {
  const css = readFileSync(
    path.join(ROOT, "site/scroll-paws.module.css"),
    "utf8",
  );

  it("is driven by scroll position rather than by a listener", () => {
    expect(css).toContain("animation-timeline: scroll(root block)");
  });

  /*
   * Behind the `@supports` guard, so a browser without scroll-driven
   * animation gets no trail at all rather than a JavaScript fallback -- and,
   * more importantly, rather than ten prints stranded at `opacity: 0` with
   * nothing to bring them in.
   */
  it("only animates where scroll timelines exist", () => {
    const supports = css.indexOf("@supports (animation-timeline: scroll())");
    expect(supports).toBeGreaterThan(0);
    const declaration = css.indexOf("animation: field-paw-step");
    expect(declaration).toBeGreaterThan(supports);
  });

  /* A print that never lands, or two that land together, is not a gait. */
  it("gives every print its own tenth of the scroll range", () => {
    const ranges = [...css.matchAll(/animation-range:\s*([\d.]+)%\s*([\d.]+)%/g)]
      .map((match) => [Number(match[1]), Number(match[2])] as const);
    expect(ranges).toHaveLength(10);
    ranges.forEach(([start, end], index) => {
      expect(start).toBeCloseTo(index * 10, 1);
      expect(end).toBeCloseTo(index * 10 + 10, 1);
    });
  });
});
