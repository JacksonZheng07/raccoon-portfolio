import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8");

describe("field notes design tokens", () => {
  /*
   * The ten tokens of the nocturnal ramp, by value. Two of them --
   * `surface` and `surface-raised` -- are derived from the source tile's
   * mockup rather than named in it, which is recorded in the design doc and
   * is the first thing to check if the result ever looks wrong.
   */
  it("declares the dark surfaces and the light plates", () => {
    expect(css).toContain("--color-surface: #2b2b2b");
    expect(css).toContain("--color-surface-raised: #3a3a3a");
    expect(css).toContain("--color-plate: #ffffff");
    expect(css).toContain("--color-plate-edge: #efefef");
  });

  it("declares the three inks", () => {
    expect(css).toContain("--color-ink: #efefef");
    expect(css).toContain("--color-ink-bright: #ffffff");
    expect(css).toContain("--color-ink-plate: #333333");
  });

  it("declares the rule, the muted grey and the figure grey", () => {
    expect(css).toContain("--color-line: #d4d4d4");
    expect(css).toContain("--color-muted: #bbbbbb");
    expect(css).toContain("--color-figure: #999999");
  });

  it("respects reduced-motion preferences", () => {
    expect(css).toContain("prefers-reduced-motion: reduce");
  });
});

describe("texture and motion layer", () => {
  it("declares the hard offset shadows the interaction states use", () => {
    expect(css).toContain("--shadow-lift: 4px 4px 0 var(--color-line)");
    expect(css).toContain("--shadow-press: 2px 2px 0 var(--color-line)");
  });

  it("declares a display scale that sets its own leading", () => {
    for (const step of [1, 2, 3, 4]) {
      expect(css).toContain(`--text-display-${step}:`);
      expect(css).toContain(`--text-display-${step}--line-height:`);
    }
    expect(css).toContain("--text-specimen:");
    expect(css).toContain("--text-specimen--letter-spacing:");
  });

  it("gives every Section tone a surface", () => {
    for (const tone of ["surface", "raised", "plate"]) {
      expect(css).toContain(`.tone-${tone}`);
    }
  });

  /*
   * The grain runs at one amplitude now. The light palette carried a second,
   * weaker tile for the night band, because mid-grey noise lightens a dark
   * surface; every surface is dark now, so the weak tile is the only tile.
   */
  it("carries one grain amplitude, not two", () => {
    expect(css).not.toContain("--field-grain-night");
  });

  it("applies the paper grain as a texture, not as a gradient fill", () => {
    expect(css).toContain("--field-grain:");
    expect(css).toContain("feTurbulence");
    /* The only repeating gradient allowed is the opt-in ruled line. */
    const gradients = css.match(/-gradient\(/g) ?? [];
    expect(gradients).toHaveLength(1);
    expect(css).toContain("--field-rule: repeating-linear-gradient(");
  });

  /*
   * The regression this guards: a `view()` or `scroll()` animation is driven
   * by scroll position, so the blanket `animation-duration: 0.01ms` in the
   * reduced-motion block does not stop it. Both scroll-driven classes have
   * to be named explicitly inside the guard.
   */
  it("neutralises both scroll-driven animations under reduced motion", () => {
    const guard = css.slice(css.indexOf("@media (prefers-reduced-motion"));
    expect(guard).toContain(".reveal");
    expect(guard).toContain(".sticky-lift");
    expect(guard).toContain("animation: none !important");
    expect(guard).toContain("animation-timeline: auto !important");
    expect(guard).toContain("transform: none !important");

    /* Every animated class declared above the guard must appear inside it. */
    const animated = [
      ...css.slice(0, css.indexOf("@media (prefers-reduced-motion")).matchAll(
        /\.([a-z-]+)\s*\{[^}]*animation-timeline:/g,
      ),
    ].map((match) => match[1]);
    expect(animated.length).toBeGreaterThan(0);
    for (const name of animated) {
      expect(guard).toContain(`.${name}`);
    }
  });

  it("guards the scroll-driven animations behind a @supports test", () => {
    expect(css).toContain("@supports (animation-timeline: view())");
    expect(css).toContain("@supports (animation-timeline: scroll())");
  });
});

/*
 * A texture costs us the automated contrast gate. axe cannot judge contrast
 * over a background-image, so every string of text on a grained surface comes
 * back "incomplete" rather than pass or fail -- the Playwright a11y suite
 * still passes, but it has stopped checking. These assertions put the gate
 * back where it can be checked, on the tokens themselves.
 *
 * THE DERATE INVERTS WITH THE PALETTE. The light system multiplied the
 * background DOWN, because mid-grey noise over cream darkens it and darkening
 * the surface under dark text is what costs contrast. Every surface is dark
 * now, and mid-grey noise over a dark surface LIGHTENS it -- the same tile,
 * the opposite direction -- so the worst case for light text on dark is the
 * background moving up, not down. A derate that still multiplied down would
 * report contrast that is better than reality and pass things that fail.
 *
 * `GRAIN_GAIN` is additive and deliberately pessimistic: +8 of 255 on every
 * channel, against a tile running at 0.06 opacity whose worst single speckle
 * is nearer +5. The numbers below are a floor, not an average.
 */
const GRAIN_GAIN = 8;

function token(name: string): string {
  const match = new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`).exec(css);
  if (!match?.[1]) {
    throw new Error(`token --color-${name} is not declared as a six-digit hex`);
  }
  return match[1];
}

function channels(hex: string): [number, number, number] {
  return [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16)) as [
    number,
    number,
    number,
  ];
}

function luminance([r, g, b]: [number, number, number]): number {
  const linear = (value: number) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function contrast(foreground: string, background: string, grained: boolean) {
  const back = channels(background).map((value) =>
    grained ? Math.min(255, value + GRAIN_GAIN) : value,
  ) as [number, number, number];
  const [lighter, darker] = [luminance(channels(foreground)), luminance(back)]
    .sort((a, b) => b - a) as [number, number];
  return (lighter + 0.05) / (darker + 0.05);
}

describe("the nocturnal ramp", () => {
  /*
   * Text pairs are held to 4.5, the AA threshold for the 11px specimen
   * labels that set the floor for this palette. There is no per-tone
   * remapping to depend on any more: one muted grey clears both surfaces,
   * which is the whole reason `muted-strong` could be deleted.
   */
  const TEXT: [string, string][] = [
    ["ink", "surface"],
    ["ink", "surface-raised"],
    ["ink-bright", "surface"],
    ["ink-bright", "surface-raised"],
    ["muted", "surface"],
    ["muted", "surface-raised"],
    ["ink-plate", "plate"],
    ["ink-plate", "plate-edge"],
  ];

  for (const [foreground, background] of TEXT) {
    it(`${foreground} on ${background} clears AA over the grain`, () => {
      const ratio = contrast(token(foreground), token(background), true);
      expect(
        ratio,
        `${foreground} on ${background} is ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(4.5);
    });
  }

  /*
   * `line` draws rules and `figure` draws paw prints and spilled rubbish, so
   * both are non-text and held to 1.4.11's 3:1 rather than 4.5. `figure` has
   * the least headroom of anything in the ramp, which is exactly why it is
   * asserted rather than assumed.
   */
  const NON_TEXT: [string, string][] = [
    ["line", "surface"],
    ["line", "surface-raised"],
    ["figure", "surface"],
    ["figure", "surface-raised"],
  ];

  for (const [foreground, background] of NON_TEXT) {
    it(`${foreground} on ${background} clears the non-text threshold`, () => {
      const ratio = contrast(token(foreground), token(background), true);
      expect(
        ratio,
        `${foreground} on ${background} is ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(3);
    });
  }

  /*
   * A rule is the stronger mark than a muted label, and on a dark surface
   * stronger means brighter. If this ever inverts, the 2px border language
   * the whole site is built on has quietly gone subordinate to its own
   * captions.
   */
  it("keeps the rules brighter than the muted text", () => {
    expect(luminance(channels(token("line")))).toBeGreaterThan(
      luminance(channels(token("muted"))),
    );
  });

  /*
   * `figure` is a hair under the text threshold on the raised surface. That
   * is intentional and documented in the token, and this asserts the fact so
   * nobody promotes it to a text colour by accident.
   */
  it("keeps figure below the text threshold, as documented", () => {
    expect(
      contrast(token("figure"), token("surface-raised"), true),
    ).toBeLessThan(4.5);
  });
});

describe("no hue survives", () => {
  /*
   * The palette is fully neutral, so every declared colour must have equal
   * channels. One stray tinted token would be the whole point of this change
   * quietly undone in a single line.
   */
  it("declares every colour as a pure grey", () => {
    const declared = [...css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{6})/g)];
    expect(declared.length).toBeGreaterThan(5);
    for (const [, name, hex] of declared) {
      const [r, g, b] = channels(hex);
      expect([r, g, b], `--color-${name} is ${hex}, which is not neutral`)
        .toEqual([r, r, r]);
      expect(g).toBe(r);
      expect(b).toBe(r);
    }
  });

  it("has retired the hue tokens by name", () => {
    for (const gone of [
      "accent-blue",
      "accent-pink",
      "accent-green",
      "night",
      "mask",
      "rust",
      "muted-strong",
      "paper",
      "shell",
      "ringtail",
    ]) {
      expect(css, `--color-${gone} is still declared`).not.toContain(
        `--color-${gone}:`,
      );
    }
  });
});
