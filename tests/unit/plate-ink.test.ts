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

/*
 * The hazard inverted with the palette.
 *
 * Under the dark ramp the mistake was near-white ink on a light plate. Page
 * ink is #141210 now, so that pairing is correct and the dangerous one is
 * its mirror: the inverted ink (`ink-light`) left on a light surface, or the
 * page ink left on the one dark band.
 *
 * axe cannot see either, because every surface carries the grain as a
 * background-image and axe returns "incomplete" rather than a ratio over an
 * image. This is the call-site half of the gate that design-tokens.test.ts
 * covers at the token level.
 */
const LIGHT_INK = /^text-ink-light$/;
const PAGE_INK = /^text-(?:ink|muted)$/;
const LIGHT_BG = /^bg-(?:surface|surface-raised|plate|plate-edge|citron|sky|tangerine|magenta|violet)$/;
const DARK_BG = /^bg-surface-deep$/;

function offendersIn(wrongPair: (classes: string[]) => boolean): string[] {
  const out: string[] = [];
  for (const { file, body } of sources()) {
    for (const list of classLists(body)) {
      for (const [prefix, classes] of states(list)) {
        if (wrongPair(classes)) out.push(`${file} [${prefix || "base"}]: ${list}`);
      }
    }
  }
  return out;
}

describe("ink follows its ground", () => {
  it("never leaves the inverted ink on a light surface", () => {
    const bad = offendersIn(
      (cs) => cs.some((c) => LIGHT_BG.test(c)) && cs.some((c) => LIGHT_INK.test(c)),
    );
    expect(bad, "pale ink on a pale ground").toEqual([]);
  });

  it("never leaves the page ink on the dark band", () => {
    const bad = offendersIn(
      (cs) => cs.some((c) => DARK_BG.test(c)) && cs.some((c) => PAGE_INK.test(c)),
    );
    expect(bad, "near-black ink on the dark band").toEqual([]);
  });
});
