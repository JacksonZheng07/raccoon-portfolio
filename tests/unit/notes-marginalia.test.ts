import { describe, expect, it } from "vitest";
import {
  NOTE_FURNITURE,
  getNoteFurniture,
} from "@/components/notes/marginalia";
import {
  daysBetweenNotes,
  findQuoteParagraph,
  formatNoteGap,
  formatWordCount,
} from "@/components/notes/format";
import { getAllNotes } from "@/lib/notes";

const notes = getAllNotes();

describe("note marginalia", () => {
  it("furnishes every note that exists, and nothing that does not", () => {
    expect(Object.keys(NOTE_FURNITURE).sort()).toEqual(
      notes.map((note) => note.slug).sort(),
    );
  });

  it("quotes each note verbatim", () => {
    for (const note of notes) {
      const { quote } = getNoteFurniture(note.slug);
      expect(
        note.body.some((paragraph) => paragraph.includes(quote)),
        `${note.slug} no longer contains its pull quote`,
      ).toBe(true);
    }
  });

  it("keeps quotes short enough to sit in a margin", () => {
    for (const note of notes) {
      expect(getNoteFurniture(note.slug).quote.length).toBeLessThanOrEqual(90);
    }
  });

  it("keeps specimen labels short enough for the tag face", () => {
    for (const note of notes) {
      expect(getNoteFurniture(note.slug).specimenLabel.length).toBeLessThanOrEqual(6);
    }
  });

  it("throws for an unfurnished slug", () => {
    expect(() => getNoteFurniture("no-such-note")).toThrow(/no marginalia/);
  });
});

describe("findQuoteParagraph", () => {
  it("reports the one-based paragraph a quote came from", () => {
    expect(findQuoteParagraph(["alpha", "beta gamma"], "gamma")).toBe(2);
  });

  it("locates every real pull quote", () => {
    for (const note of notes) {
      const paragraph = findQuoteParagraph(
        note.body,
        getNoteFurniture(note.slug).quote,
      );
      expect(paragraph).toBeGreaterThanOrEqual(1);
      expect(paragraph).toBeLessThanOrEqual(note.body.length);
    }
  });

  it("throws when the quote is not in the body", () => {
    expect(() => findQuoteParagraph(["alpha"], "omega")).toThrow(/not in the note body/);
  });
});

describe("note gaps", () => {
  it("counts whole days between two note dates", () => {
    expect(daysBetweenNotes("2026-08-24", "2026-08-31")).toBe(7);
    expect(daysBetweenNotes("2026-12-31", "2027-01-01")).toBe(1);
  });

  it("writes small gaps as words and larger ones as numerals", () => {
    expect(formatNoteGap(0)).toBe("the same day");
    expect(formatNoteGap(1)).toBe("one day later");
    expect(formatNoteGap(7)).toBe("seven days later");
    expect(formatNoteGap(30)).toBe("30 days later");
  });

  it("rejects a gap that is not a whole number of days", () => {
    expect(() => formatNoteGap(-1)).toThrow(/whole number/);
    expect(() => formatNoteGap(1.5)).toThrow(/whole number/);
  });

  it("orders the real notes forwards in time", () => {
    for (let i = 1; i < notes.length; i += 1) {
      expect(daysBetweenNotes(notes[i - 1].date, notes[i].date)).toBeGreaterThan(0);
    }
  });
});

describe("formatWordCount", () => {
  it("groups thousands without a locale dependency", () => {
    expect(formatWordCount(9)).toBe("9");
    expect(formatWordCount(470)).toBe("470");
    expect(formatWordCount(1381)).toBe("1,381");
    expect(formatWordCount(1000000)).toBe("1,000,000");
  });
});
