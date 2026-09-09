import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { z } from "zod";

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

const WORDS_PER_MINUTE = 200;
const MIN_PARAGRAPHS = 4;
const MAX_PARAGRAPHS = 7;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const NUMBER_PATTERN = /^\d{3}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const noteFileSchema = z
  .object({
    slug: z.string().regex(SLUG_PATTERN, "must be a lowercase, hyphenated slug"),
    number: z.string().regex(NUMBER_PATTERN, "must be a zero-padded three-digit number"),
    title: z.string().min(1),
    dek: z.string().min(1),
    date: z.string().regex(ISO_DATE_PATTERN, "must be an ISO date (YYYY-MM-DD)"),
    body: z
      .array(z.string().trim().min(1, "paragraph must not be empty"))
      .min(MIN_PARAGRAPHS, `body needs at least ${MIN_PARAGRAPHS} paragraphs`)
      .max(MAX_PARAGRAPHS, `body allows at most ${MAX_PARAGRAPHS} paragraphs`),
  })
  .strict();

export type NoteFile = z.infer<typeof noteFileSchema>;

export type Note = {
  slug: string;
  number: string;
  title: string;
  dek: string;
  date: string;
  readingMinutes: number;
  body: string[];
};

export function countWords(body: readonly string[]): number {
  return body
    .join(" ")
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

export function estimateReadingMinutes(body: readonly string[]): number {
  return Math.max(1, Math.round(countWords(body) / WORDS_PER_MINUTE));
}

export function parseNote(fileName: string, data: unknown): Note {
  const result = noteFileSchema.safeParse(data);

  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => {
        const field = issue.path.length > 0 ? issue.path.join(".") : "(root)";
        return `  ${field}: ${issue.message}`;
      })
      .join("\n");
    throw new Error(`Invalid note content/notes/${fileName}:\n${problems}`);
  }

  const note = result.data;

  return {
    slug: note.slug,
    number: note.number,
    title: note.title,
    dek: note.dek,
    date: note.date,
    readingMinutes: estimateReadingMinutes(note.body),
    body: note.body,
  };
}

function readNoteFile(fileName: string): Note {
  const raw = readFileSync(path.join(NOTES_DIR, fileName), "utf8");

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid note content/notes/${fileName}:\n  (root): not valid JSON (${reason})`);
  }

  return parseNote(fileName, data);
}

export function getAllNotes(): Note[] {
  const fileNames = readdirSync(NOTES_DIR)
    .filter((fileName) => fileName.endsWith(".json"))
    .sort();

  const notes = fileNames.map(readNoteFile);

  const seen = new Map<string, string>();
  for (const [index, note] of notes.entries()) {
    const fileName = fileNames[index] ?? note.slug;
    const previous = seen.get(note.slug);
    if (previous !== undefined) {
      throw new Error(
        `Invalid note content/notes/${fileName}:\n  slug: "${note.slug}" is already used by content/notes/${previous}`,
      );
    }
    seen.set(note.slug, fileName);
  }

  return notes.sort((a, b) => a.number.localeCompare(b.number));
}

export function getNote(slug: string): Note | undefined {
  return getAllNotes().find((note) => note.slug === slug);
}
