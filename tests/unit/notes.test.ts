import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  countWords,
  estimateReadingMinutes,
  getAllNotes,
  getNote,
  parseNote,
} from "@/lib/notes";

const NOTES_DIR = path.join(process.cwd(), "content/notes");

const validNote = {
  slug: "a-valid-note",
  number: "007",
  title: "A valid note",
  dek: "One sentence that summarises the note.",
  date: "2026-09-01",
  body: ["First paragraph.", "Second paragraph.", "Third paragraph.", "Fourth paragraph."],
};

describe("note files on disk", () => {
  it("loads every JSON file in content/notes", () => {
    const files = readdirSync(NOTES_DIR).filter((file) => file.endsWith(".json"));
    expect(files).toHaveLength(3);
    expect(getAllNotes()).toHaveLength(files.length);
  });

  it("carries the three approved wireframe titles", () => {
    expect(getAllNotes().map((note) => note.title)).toEqual([
      "Making technical work legible",
      "Small tools, real leverage",
      "Learning without the theatre",
    ]);
  });

  it("uses unique, URL-safe slugs", () => {
    const slugs = getAllNotes().map((note) => note.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(encodeURIComponent(slug)).toBe(slug);
    }
  });

  it("numbers notes with zero-padded, sequential ids starting at 001", () => {
    const numbers = getAllNotes().map((note) => note.number);
    expect(numbers).toEqual(["001", "002", "003"]);
    for (const number of numbers) {
      expect(number).toMatch(/^\d{3}$/);
    }
  });

  it("sorts notes by number ascending", () => {
    const numbers = getAllNotes().map((note) => Number(note.number));
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
  });

  it("keeps every body between four and seven paragraphs", () => {
    for (const note of getAllNotes()) {
      expect(note.body.length).toBeGreaterThanOrEqual(4);
      expect(note.body.length).toBeLessThanOrEqual(7);
      for (const paragraph of note.body) {
        expect(paragraph.trim()).not.toBe("");
      }
    }
  });

  it("keeps every note between 350 and 550 words", () => {
    for (const note of getAllNotes()) {
      const words = countWords(note.body);
      expect(words, `${note.slug} has ${words} words`).toBeGreaterThanOrEqual(350);
      expect(words, `${note.slug} has ${words} words`).toBeLessThanOrEqual(550);
    }
  });

  it("gives each note an ISO date and a derived reading time", () => {
    for (const note of getAllNotes()) {
      expect(note.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(note.date))).toBe(false);
      expect(note.readingMinutes).toBe(estimateReadingMinutes(note.body));
      expect(note.readingMinutes).toBeGreaterThan(0);
    }
  });

  it("writes a dek that is a single sentence", () => {
    for (const note of getAllNotes()) {
      expect(note.dek.trim().endsWith(".")).toBe(true);
      expect(note.dek.trim().slice(0, -1)).not.toContain(".");
    }
  });
});

describe("getNote", () => {
  it("returns the note for a known slug", () => {
    const note = getNote("small-tools-real-leverage");
    expect(note?.title).toBe("Small tools, real leverage");
    expect(note?.number).toBe("002");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getNote("no-such-note")).toBeUndefined();
  });
});

describe("reading time derivation", () => {
  it("counts words across paragraphs, ignoring extra whitespace", () => {
    expect(countWords(["one two three", "  four   five  "])).toBe(5);
  });

  it("rounds 200 words per minute to the nearest minute", () => {
    const words = (count: number) => [Array.from({ length: count }, () => "word").join(" ")];
    expect(estimateReadingMinutes(words(200))).toBe(1);
    expect(estimateReadingMinutes(words(300))).toBe(2);
    expect(estimateReadingMinutes(words(420))).toBe(2);
    expect(estimateReadingMinutes(words(500))).toBe(3);
  });

  it("never reports less than one minute", () => {
    expect(estimateReadingMinutes(["short"])).toBe(1);
    expect(estimateReadingMinutes([])).toBe(1);
  });
});

describe("validation failures", () => {
  it("names the file and the field path when a field is missing", () => {
    const withoutDek: Record<string, unknown> = { ...validNote };
    delete withoutDek.dek;
    expect(() => parseNote("broken-note.json", withoutDek)).toThrowError(
      /broken-note\.json[\s\S]*\bdek\b/,
    );
  });

  it("names the offending paragraph index inside body", () => {
    const badParagraph = { ...validNote, body: [...validNote.body.slice(0, 3), ""] };
    expect(() => parseNote("empty-para.json", badParagraph)).toThrowError(
      /empty-para\.json[\s\S]*body\.3/,
    );
  });

  it("rejects a body with too few paragraphs", () => {
    expect(() => parseNote("thin-note.json", { ...validNote, body: ["a", "b"] })).toThrowError(
      /thin-note\.json[\s\S]*\bbody\b/,
    );
  });

  it("rejects a slug that is not URL-safe", () => {
    expect(() => parseNote("shouty.json", { ...validNote, slug: "Not A Slug" })).toThrowError(
      /shouty\.json[\s\S]*\bslug\b/,
    );
  });

  it("rejects an unpadded note number", () => {
    expect(() => parseNote("num.json", { ...validNote, number: "7" })).toThrowError(
      /num\.json[\s\S]*\bnumber\b/,
    );
  });

  it("rejects unknown keys so stale fields cannot ship silently", () => {
    expect(() => parseNote("extra.json", { ...validNote, readingMinutes: 9 })).toThrowError(
      /extra\.json[\s\S]*readingMinutes/,
    );
  });

  it("accepts a well-formed note and derives its reading time", () => {
    const note = parseNote("fine.json", validNote);
    expect(note.slug).toBe("a-valid-note");
    expect(note.readingMinutes).toBe(estimateReadingMinutes(validNote.body));
  });
});
