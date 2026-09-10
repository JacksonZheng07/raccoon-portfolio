import { describe, expect, it } from "vitest";
import { formatNoteDate } from "@/components/notes/format";
import { getAllNotes } from "@/lib/notes";

describe("formatNoteDate", () => {
  it("renders an ISO date as a long-form date without a locale dependency", () => {
    expect(formatNoteDate("2026-08-24")).toBe("August 24, 2026");
    expect(formatNoteDate("2026-01-01")).toBe("January 1, 2026");
    expect(formatNoteDate("2026-12-31")).toBe("December 31, 2026");
  });

  it("formats every real note date", () => {
    for (const note of getAllNotes()) {
      expect(formatNoteDate(note.date)).toMatch(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/);
    }
  });

  it("rejects anything that is not an ISO date", () => {
    expect(() => formatNoteDate("24/08/2026")).toThrow(/not an ISO date/);
    expect(() => formatNoteDate("2026-13-01")).toThrow(/no month 13/);
  });
});
