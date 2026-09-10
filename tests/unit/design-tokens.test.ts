import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8");

describe("field notes design tokens", () => {
  it("declares the paper palette carried over from the wireframe", () => {
    expect(css).toContain("--color-paper: #f7f3e9");
    expect(css).toContain("--color-ink: #171717");
    expect(css).toContain("--color-line: #272727");
  });

  it("declares the raccoon palette extension", () => {
    expect(css).toContain("--color-mask: #2b2b30");
    expect(css).toContain("--color-ringtail: #8a8580");
  });

  it("respects reduced-motion preferences", () => {
    expect(css).toContain("prefers-reduced-motion: reduce");
  });
});

describe("texture and motion layer", () => {
  /*
   * `--color-muted-strong` is the one colour added for the tinted `Section`
   * tones: `--color-muted` measures 4.57:1 on shell and 4.21:1 on accent
   * pink, so it cannot carry 11px specimen labels there. Asserted here for
   * the same reason as the rest of the palette -- a rename must not silently
   * drop the surface that depends on it.
   */
  it("declares the darker muted grey the tinted tones need", () => {
    expect(css).toContain("--color-muted-strong: #50504e");
  });

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
    for (const tone of ["paper", "shell", "night", "blue", "pink"]) {
      expect(css).toContain(`.tone-${tone}`);
    }
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
 * `GRAIN_LOSS` is the measured worst case, not a guess: the 140px noise tile
 * composited over paper darkens its darkest single pixel by 5.2% of the
 * surface's channel values (247,243,233 -> 234,230,221). Every pairing is
 * asserted against that darkest pixel, so the numbers below are the floor,
 * not the average.
 */
const GRAIN_LOSS = 0.948;

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
    grained ? value * GRAIN_LOSS : value,
  ) as [number, number, number];
  const [lighter, darker] = [luminance(channels(foreground)), luminance(back)]
    .sort((a, b) => b - a) as [number, number];
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Section tone contrast", () => {
  /*
   * `muted` is tuned for paper. On shell it is 4.57:1 flat and 4.14:1 over
   * the grain, and on pink 4.21:1 flat, so the tinted tones re-resolve it to
   * `muted-strong` in `app/globals.css`. That remapping is the thing these
   * pairings depend on.
   */
  const PAIRINGS: [string, string][] = [
    ["ink", "paper"],
    ["muted", "paper"],
    ["line", "paper"],
    ["mask", "paper"],
    ["ink", "shell"],
    ["muted-strong", "shell"],
    ["ink", "accent-blue"],
    ["muted-strong", "accent-blue"],
    ["ink", "accent-pink"],
    ["muted-strong", "accent-pink"],
    ["night-text", "night"],
    ["shell", "night"],
    ["accent-green", "night"],
  ];

  for (const [foreground, background] of PAIRINGS) {
    it(`${foreground} on ${background} clears AA over the grain`, () => {
      const ratio = contrast(token(foreground), token(background), true);
      expect(
        ratio,
        `${foreground} on ${background} is ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(4.5);
    });
  }

  it("shows why the tinted tones cannot use plain muted", () => {
    expect(contrast(token("muted"), token("shell"), true)).toBeLessThan(4.5);
    expect(contrast(token("muted"), token("accent-pink"), true)).toBeLessThan(
      4.5,
    );
  });
});
