import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parsePageText } from "../../lib/page-text";

/*
 * Keys are strings, so TypeScript cannot catch a typo in one. `getPageText`
 * throws at build time, which is already far better than rendering an empty
 * headline -- but a build is slow and this is not. These two assertions fail
 * in under a second and name the exact key.
 *
 * The pairing matters in both directions. A key used but not defined breaks
 * the page. A key defined but never used is copy somebody wrote, believes is
 * on the site, and is not: the quieter and more embarrassing of the two.
 */

const PAGES = path.join(process.cwd(), "content/pages");
const read = (p: string) => readFileSync(p, "utf8");

/** Which source file loads which page file, read from the source itself. */
const SOURCES: Record<string, string[]> = {
  home: ["app/page.tsx"],
  work: ["app/work/page.tsx"],
  notes: ["app/notes/page.tsx"],
  "not-found": ["app/not-found.tsx"],
};

const files = readdirSync(PAGES)
  .filter((f) => f.endsWith(".txt"))
  .map((f) => f.replace(/\.txt$/, ""))
  .sort();

/** Every `t("...")` and `t.paragraphs("...")` argument in a source file. */
function keysUsedIn(source: string): Set<string> {
  const used = new Set<string>();
  for (const m of source.matchAll(/\bt(?:\.paragraphs)?\(\s*"([^"]+)"\s*\)/g)) {
    used.add(m[1]);
  }
  /* Template-literal keys, as the observations and timeline rows build. */
  for (const m of source.matchAll(/\bt\(\s*`([^`]+)`\s*\)/g)) {
    const literal = m[1];
    const expanded = literal.match(/^([a-z]+)\.\$\{[^}]+\}\.([a-z-]+)$/);
    if (expanded) {
      /* `observations.${n}.theme` -> every numbered key of that shape. */
      used.add(`${expanded[1]}.*.${expanded[2]}`);
    } else {
      used.add(literal);
    }
  }
  return used;
}

/** Does a defined key match something the source asked for? */
function isUsed(key: string, used: Set<string>): boolean {
  if (used.has(key)) return true;
  const numbered = key.match(/^([a-z]+)\.\d+\.([a-z-]+)$/);
  return numbered ? used.has(`${numbered[1]}.*.${numbered[2]}`) : false;
}

describe("page copy keys", () => {
  it("has a text file for every page that loads one", () => {
    expect(files).toEqual(Object.keys(SOURCES).sort());
  });

  for (const page of files) {
    describe(`${page}.txt`, () => {
      const text = parsePageText(
        `${page}.txt`,
        read(path.join(PAGES, `${page}.txt`)),
      );
      const source = SOURCES[page].map((f) => read(path.join(process.cwd(), f)))
        .join("\n");
      const used = keysUsedIn(source);

      it("defines every key its page asks for", () => {
        const defined = new Set(text.keys());
        const missing = [...used].filter(
          (key) =>
            !key.includes(".*.") &&
            !defined.has(key) &&
            !key.startsWith("meta."),
        );
        expect(missing, `used in ${SOURCES[page]} but not defined`).toEqual([]);
      });

      it("defines nothing its page never asks for", () => {
        const orphans = text.keys().filter((key) => !isUsed(key, used));
        expect(orphans, "defined but never rendered").toEqual([]);
      });

      it("has no empty or whitespace-only copy", () => {
        for (const key of text.keys()) {
          expect(text(key).trim().length, `${key} is blank`).toBeGreaterThan(0);
        }
      });
    });
  }
});
