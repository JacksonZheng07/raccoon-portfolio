import { readFileSync } from "node:fs";
import path from "node:path";

/*
 * Per-page editorial copy, kept in plain text so it can be reworded without
 * opening a component.
 *
 * One file per page in `content/pages/`. The format is a key in square
 * brackets on its own line, then the prose under it, up to the next key:
 *
 *     # a note to whoever edits this next
 *
 *     [hero.heading]
 *     i take things apart to see how they work.
 *
 *     [hero.intro]
 *     Ten builds, opened up with the parts
 *     still lying on the table.
 *
 * Two rules make that comfortable to edit by hand:
 *
 *   a single newline is whitespace   so the file can be hard-wrapped to any
 *                                    column without the wrapping reaching
 *                                    the page, exactly as in HTML
 *   a blank line is a paragraph      so prose that is genuinely two
 *                                    paragraphs stays two paragraphs without
 *                                    needing `body.1` and `body.2` keys
 *
 * A `#` in the first column is a comment, anywhere in the file. Prose that
 * has to begin with a hash can be indented one space.
 *
 * Everything here runs at build time. `next.config.ts` sets `output: export`,
 * so these files are read while the HTML is generated and none of this — not
 * the parser, not the text — is shipped to the browser.
 *
 * Every malformed file and every missing key throws. That is deliberate and
 * it matches `parseProject` in lib/projects.ts: the alternative to a build
 * that refuses to finish is a live page rendering an empty headline because
 * a key was misspelt, and that is strictly worse. `tests/unit/page-keys.test.ts`
 * catches the same class of mistake earlier still, before a build is even run.
 */

export const PAGES_DIR = path.join(process.cwd(), "content/pages");

/*
 * `section.field`, lowercase, dot separated. Middle segments may be numeric,
 * so a repeated row reads `observations.1.theme` rather than forcing a
 * separate key per field of every row.
 */
const KEY = /^[a-z][a-z0-9]*(?:\.[a-z0-9][a-z0-9-]*)+$/;

export type PageText = {
  /** The block at `key`, hard wrapping collapsed. Throws if absent. */
  (key: string): string;
  /** The block at `key` split on blank lines. Throws if absent. */
  paragraphs(key: string): string[];
  /** Every key in the file, in the order it was written. */
  keys(): string[];
};

/**
 * Parse one page file.
 *
 * Exported separately from `getPageText` so the format can be tested against
 * literal strings rather than against fixtures on disk.
 */
export function parsePageText(fileName: string, body: string): PageText {
  const blocks = new Map<string, string[]>();
  const order: string[] = [];
  let current: string | null = null;

  body.split(/\r?\n/).forEach((line, index) => {
    const where = `${fileName}:${index + 1}`;

    /*
     * A comment is a `#` in the first column, anywhere in the file --
     * including between two blocks, which is where a note to the next editor
     * naturally goes. Anchoring it to column 0 is what keeps prose safe: a
     * hash inside a sentence ("filed under #3") is never at the start of a
     * line, and a paragraph that genuinely has to open with one can be
     * indented by a single space.
     */
    if (line.startsWith("#")) return;

    const opener = line.match(/^\[(.*)\]\s*$/);
    if (opener) {
      const key = opener[1].trim();
      if (!KEY.test(key)) {
        throw new Error(
          `${where}: "${key}" is not a valid key. Keys are lowercase and dotted, like [hero.heading].`,
        );
      }
      if (blocks.has(key)) {
        throw new Error(`${where}: duplicate key "${key}".`);
      }
      blocks.set(key, []);
      order.push(key);
      current = key;
      return;
    }

    if (current === null) {
      if (line.trim() === "") return;
      throw new Error(
        `${where}: content before the first key. Every line belongs to a [key] block.`,
      );
    }

    blocks.get(current)?.push(line);
  });

  if (order.length === 0) {
    throw new Error(`${fileName}: no keys found.`);
  }

  /* Collapse each block once, at parse time, rather than on every read. */
  const paragraphs = new Map<string, string[]>();
  for (const key of order) {
    const parts = (blocks.get(key) ?? [])
      .join("\n")
      .split(/\n\s*\n/)
      .map((part) => part.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    if (parts.length === 0) {
      throw new Error(`${fileName}: the block for "${key}" is empty.`);
    }
    paragraphs.set(key, parts);
  }

  function read(key: string): string[] {
    const found = paragraphs.get(key);
    if (!found) {
      throw new Error(
        `${fileName}: no key "${key}". It has: ${order.join(", ")}.`,
      );
    }
    return found;
  }

  const text = ((key: string) => read(key).join("\n\n")) as PageText;
  text.paragraphs = (key: string) => [...read(key)];
  text.keys = () => [...order];
  return text;
}

const cache = new Map<string, PageText>();

/**
 * The copy for one page, by file stem: `getPageText("home")` reads
 * `content/pages/home.txt`.
 *
 * Cached, because several components on a page ask for the same file and a
 * static export builds every route in one process.
 */
export function getPageText(page: string): PageText {
  const hit = cache.get(page);
  if (hit) return hit;

  const fileName = `${page}.txt`;
  const full = path.join(PAGES_DIR, fileName);

  let body: string;
  try {
    body = readFileSync(full, "utf8");
  } catch {
    throw new Error(`No page copy at content/pages/${fileName}.`);
  }

  const parsed = parsePageText(fileName, body);
  cache.set(page, parsed);
  return parsed;
}

/** One run of a marked-up string: prose, or the emphasised span. */
export type MarkedRun = { text: string; mark: boolean };

/**
 * Split `*emphasis*` out of a line of copy.
 *
 * The hero headline is one sentence with one highlighted word, and it is the
 * copy most likely to be reworded. Splitting it across `heading.before`,
 * `heading.emphasis` and `heading.after` would make rewording it a
 * three-key balancing act, so the file carries the whole sentence and marks
 * the word inside it.
 *
 * Exactly one pair of asterisks is allowed. Two emphases have no treatment in
 * the design, and an unclosed marker is a typo that would otherwise print a
 * literal asterisk on the page -- both throw rather than render.
 */
export function splitMarked(value: string): MarkedRun[] {
  const marks = value.split("*").length - 1;
  if (marks === 0) return [{ text: value, mark: false }];
  if (marks % 2 !== 0) {
    throw new Error(`Unclosed * marker in copy: ${JSON.stringify(value)}`);
  }
  if (marks > 2) {
    throw new Error(
      `Copy may carry one emphasis, not ${marks / 2}: ${JSON.stringify(value)}`,
    );
  }

  const [before, marked, after] = value.split("*");
  return [
    { text: before, mark: false },
    { text: marked, mark: true },
    { text: after, mark: false },
  ].filter((run) => run.text !== "");
}
