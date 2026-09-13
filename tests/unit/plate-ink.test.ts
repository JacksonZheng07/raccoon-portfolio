import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/*
 * The one pairing mistake this palette makes easy, and the one the automated
 * gate cannot see.
 *
 * `--color-ink` is #efefef: near-white, correct on every dark surface, and
 * invisible on a light plate. axe does not catch it, because every surface
 * carries the grain as a background-image and axe returns "incomplete"
 * rather than a ratio over an image -- which is the same blind spot
 * design-tokens.test.ts exists to cover at the token level. This covers it
 * at the call site.
 *
 * It found a real bug when it was written: a blanket bg-white -> bg-plate
 * substitution turned the flagship work cards white and left their text
 * near-white.
 */

const FILES = [
  "app/page.tsx",
  "app/work/page.tsx",
  "app/work/[slug]/page.tsx",
  "app/notes/page.tsx",
  "app/not-found.tsx",
];

function sources(): { file: string; body: string }[] {
  const dirs = ["components"];
  const found = FILES.map((f) => ({
    file: f,
    body: readFileSync(path.join(process.cwd(), f), "utf8"),
  }));
  for (const dir of dirs) {
    const walk = (d: string): string[] =>
      readdirSync(d, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)],
      );
    for (const f of walk(path.join(process.cwd(), dir))) {
      if (f.endsWith(".tsx")) {
        found.push({ file: path.relative(process.cwd(), f), body: readFileSync(f, "utf8") });
      }
    }
  }
  return found;
}

/** Every quoted class list in a source file. */
function classLists(body: string): string[] {
  return [...body.matchAll(/"([^"\n]*\b(?:bg|text)-[a-z-]+[^"\n]*)"/g)].map(
    (m) => m[1],
  );
}

/*
 * Group a class list by variant prefix, so `bg-surface ... hover:bg-plate
 * hover:text-ink-plate` is read as two independent states rather than as one
 * contradictory element. The base state is its own group under "".
 */
function states(list: string): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  for (const raw of list.split(/\s+/).filter(Boolean)) {
    const at = raw.lastIndexOf(":");
    const prefix = at === -1 ? "" : raw.slice(0, at);
    const cls = at === -1 ? raw : raw.slice(at + 1);
    groups.set(prefix, [...(groups.get(prefix) ?? []), cls]);
  }
  /* A variant inherits whatever the base state set and did not override. */
  const base = groups.get("") ?? [];
  for (const [prefix, classes] of groups) {
    if (prefix === "") continue;
    const kinds = new Set(classes.map((c) => c.split("-")[0]));
    groups.set(prefix, [...classes, ...base.filter((c) => !kinds.has(c.split("-")[0]))]);
  }
  return groups;
}

const PAGE_INK = /^text-(?:ink|muted)$/;
const PLATE_INK = /^text-ink-plate$/;
const PLATE_BG = /^bg-plate(-edge)?$/;
const DARK_BG = /^bg-(surface|surface-raised|ink)$/;

function offendersIn(
  wrongPair: (classes: string[]) => boolean,
): string[] {
  const out: string[] = [];
  for (const { file, body } of sources()) {
    for (const list of classLists(body)) {
      for (const [prefix, classes] of states(list)) {
        if (wrongPair(classes)) {
          out.push(`${file} [${prefix || "base"}]: ${list}`);
        }
      }
    }
  }
  return out;
}

describe("the palette is the only source of colour", () => {
  /*
   * Raw Tailwind colour utilities bypass the ramp entirely, so nothing
   * measured in design-tokens.test.ts applies to them and they do not move
   * when the palette does. This found `bg-ink text-white` on the work-index
   * filter chips: harmless when ink was #171717, white on white the moment
   * ink became #efefef. axe on CI caught it; nothing local did.
   */
  it("uses no raw colour utility", () => {
    const raw = /\b(?:bg|text|border)-(?:white|black|transparent|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3})\b/;
    const offenders: string[] = [];
    for (const { file, body } of sources()) {
      for (const list of classLists(body)) {
        for (const cls of list.split(/\s+/)) {
          const bare = cls.slice(cls.lastIndexOf(":") + 1);
          /* `bg-transparent` is an absence of colour, not a colour. */
          if (bare === "bg-transparent") continue;
          if (raw.test(bare)) offenders.push(`${file}: ${bare}`);
        }
      }
    }
    expect(offenders, "colour outside the palette").toEqual([]);
  });
});

describe("plate grounds carry plate ink", () => {
  it("never puts the page ink on a light plate", () => {
    const bad = offendersIn(
      (cs) => cs.some((c) => PLATE_BG.test(c)) && cs.some((c) => PAGE_INK.test(c)),
    );
    expect(bad, "near-white ink on a light plate").toEqual([]);
  });

  it("never puts plate ink on a dark surface", () => {
    const bad = offendersIn(
      (cs) => cs.some((c) => DARK_BG.test(c)) && cs.some((c) => PLATE_INK.test(c)),
    );
    expect(bad, "dark ink on a dark surface").toEqual([]);
  });
});
