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
    expect(css).toContain("--color-surface: #fffdf5");
    expect(css).toContain("--color-surface-raised: #f4efe2");
    expect(css).toContain("--color-surface-deep: #1d1b17");
    expect(css).toContain("--color-plate: #ffffff");
    expect(css).toContain("--color-plate-edge: #efece2");
  });

  it("declares the two inks", () => {
    expect(css).toContain("--color-ink: #141210");
    expect(css).toContain("--color-ink-light: #fffdf5");
  });

  it("declares the five band accents", () => {
    expect(css).toContain("--color-citron: #d9f24b");
    expect(css).toContain("--color-sky: #7fd4ff");
    expect(css).toContain("--color-tangerine: #ff9e4f");
    expect(css).toContain("--color-magenta: #ff8fc4");
    expect(css).toContain("--color-violet: #bfa8ff");
  });

  it("declares the rule, the muted grey and the figure grey", () => {
    expect(css).toContain("--color-line: #141210");
    expect(css).toContain("--color-muted: #38352f");
    expect(css).toContain("--color-figure: #504b43");
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
    for (const tone of [
      "paper",
      "raised",
      "deep",
      "citron",
      "sky",
      "tangerine",
      "magenta",
      "violet",
      "plate",
    ]) {
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
 * THE DERATE FOLLOWS THE PALETTE. It subtracts here, because mid-grey noise
 * over a light surface darkens it and darkening the surface under dark ink
 * is what costs contrast. The dark palette this replaced needed the opposite
 * and had it backwards for a while; a derate pointed the wrong way reports
 * better contrast than reality and passes things that fail.
 *
 * `GRAIN_LOSS` is deliberately pessimistic: 10 of 255 off every channel,
 * against a tile whose worst single speckle is nearer 12 at full strength
 * and whose mean shift is about 3.
 */
const GRAIN_LOSS = 10;

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
    grained ? Math.max(0, value - GRAIN_LOSS) : value,
  ) as [number, number, number];
  const [lighter, darker] = [luminance(channels(foreground)), luminance(back)]
    .sort((a, b) => b - a) as [number, number];
  return (lighter + 0.05) / (darker + 0.05);
}

/** Every band a section can be painted, light ones first. */
const BANDS = [
  "surface",
  "surface-raised",
  "citron",
  "sky",
  "tangerine",
  "magenta",
  "violet",
];

describe("the daylight palette", () => {
  /*
   * One ink on every band. That is what keeps a loud palette readable: the
   * type never changes colour, only the paper under it does -- so there is
   * no per-band remapping to get wrong.
   */
  for (const band of BANDS) {
    for (const [ink, need] of [
      ["ink", 4.5],
      ["muted", 4.5],
      ["line", 3],
      ["figure", 3],
    ] as [string, number][]) {
      it(`${ink} on ${band} clears its threshold over the grain`, () => {
        const ratio = contrast(token(ink), token(band), true);
        expect(
          ratio,
          `${ink} on ${band} is ${ratio.toFixed(2)}:1`,
        ).toBeGreaterThanOrEqual(need);
      });
    }
  }

  it("inverts the ink on the one dark band", () => {
    const ratio = contrast(token("ink-light"), token("surface-deep"), true);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
    /* And the page ink would be unreadable there, which is why it inverts. */
    expect(contrast(token("ink"), token("surface-deep"), true)).toBeLessThan(3);
  });

  /*
   * `figure` is what caps how far the accents may be pushed. It draws paw
   * prints and debris, never type, so it is held to 3:1 -- and it is the
   * first thing to fail if an accent is darkened.
   */
  it("keeps figure below the text threshold, as documented", () => {
    expect(contrast(token("figure"), token("magenta"), true)).toBeLessThan(4.5);
  });
});

describe("the palette carries real hue", () => {
  const ACCENTS = ["citron", "sky", "tangerine", "magenta", "violet"];

  /*
   * The inverse of the gate the neutral palette needed. That one asserted
   * every colour was a pure grey; this one asserts the accents are not,
   * because a pastel on cream is the same monotone problem in a warmer key
   * and it is an easy thing to drift back into one value at a time.
   */
  it("keeps every accent strongly saturated", () => {
    for (const name of ACCENTS) {
      const [r, g, b] = channels(token(name));
      const spread = Math.max(r, g, b) - Math.min(r, g, b);
      expect(spread, `--color-${name} spread is only ${spread}`).toBeGreaterThan(
        70,
      );
    }
  });

  it("gives the accents five distinguishable hues", () => {
    const hues = ACCENTS.map((name) => {
      const [r, g, b] = channels(token(name)).map((v) => v / 255);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const d = max - min;
      const h =
        max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      return h * 60;
    });
    for (let i = 0; i < hues.length; i += 1) {
      for (let j = i + 1; j < hues.length; j += 1) {
        const apart = Math.min(
          Math.abs(hues[i] - hues[j]),
          360 - Math.abs(hues[i] - hues[j]),
        );
        expect(
          apart,
          `${ACCENTS[i]} and ${ACCENTS[j]} are ${apart.toFixed(0)} degrees apart`,
        ).toBeGreaterThan(25);
      }
    }
  });

  it("has retired the neutral ramp's tokens", () => {
    for (const gone of ["surface-high", "ink-bright", "ink-plate"]) {
      expect(css, `--color-${gone} is still declared`).not.toContain(
        `--color-${gone}:`,
      );
    }
  });
});
