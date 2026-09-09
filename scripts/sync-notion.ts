/**
 * Re-pull the ten case studies from the Notion `Project Index` database into
 * content/projects/*.json.
 *
 *   NOTION_TOKEN=secret_... npm run sync:notion
 *
 * Notion is a build-time source only. Nothing here runs during `next build`;
 * the committed JSON is the site's input. The script validates every project
 * against the schema in lib/projects.ts before it writes any file, so a bad
 * pull leaves the committed content untouched rather than half-replaced.
 *
 * Taglines are hand-written editorial copy, not Notion content. If the Notion
 * page has no `Tagline` property, the tagline already committed for that slug
 * is kept.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { CONTENT_DIR, type Project, parseProject } from "../lib/projects";

const DATABASE_ID = "684e5341-744f-461f-b334-896cc257f0b9";
const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

/** Column names in the Notion `Project Index` database. */
const PROPERTY = {
  // Verified against the live Project Index database on 2026-09-08. The title
  // property is "Project", not "Name". "Slug" and "Tagline" do not exist as
  // properties: the slug is derived from the project name, and the tagline is
  // editorial copy preserved from the committed JSON (see readCommittedTagline).
  name: "Project",
  slug: "Slug",
  tagline: "Tagline",
  domain: "Domain",
  priority: "Priority",
  status: "Status",
  start: "Start",
  end: "End",
  dates: "Dates",
  skills: "Skills",
  repo: "Repo",
} as const;

/** Notion section heading → the `Project` field it feeds. */
const SECTION = {
  overview: ["project overview", "overview"],
  contributions: ["my contributions", "contributions"],
  technical: ["technical breakdown"],
  timeline: ["exact timeline"],
  architecture: [
    "architecture sketch",
    "app flow drawing",
    "deployment flow drawing",
    "ml workflow drawing",
    "flow drawing",
  ],
  evidence: ["evidence from github", "evidence"],
  skillsDemonstrated: ["skills demonstrated"],
  resumeBullets: ["resume bullets"],
  talkingPoints: ["interview talking points"],
  followUps: ["what to improve / follow-up", "still needs exact follow-up"],
} as const;

type Line =
  | { kind: "heading"; level: number; text: string }
  | { kind: "text"; text: string }
  | { kind: "table"; rows: string[][] };

type Section = { heading: string; level: number; lines: Line[] };

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Flatten a Notion rich-text array to plain text. */
function plainText(richText: unknown): string {
  return asArray(richText)
    .map((span) => asString(asRecord(span).plain_text))
    .join("")
    .trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function notionRequest(
  token: string,
  route: string,
  init?: { method: "GET" | "POST"; body?: unknown },
): Promise<Record<string, unknown>> {
  const method = init?.method ?? "GET";
  const response = await fetch(`${NOTION_API}${route}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
  });

  if (!response.ok) {
    fail(
      `Notion ${method} ${route} failed with ${response.status} ${response.statusText}:\n` +
        `${await response.text()}`,
    );
  }

  return asRecord(await response.json());
}

/** Every page in the Project Index database, following pagination. */
async function fetchDatabasePages(
  token: string,
): Promise<Record<string, unknown>[]> {
  const pages: Record<string, unknown>[] = [];
  let cursor: string | undefined;

  do {
    const body: Record<string, unknown> = { page_size: 100 };
    if (cursor !== undefined) body.start_cursor = cursor;

    const payload = await notionRequest(token, `/databases/${DATABASE_ID}/query`, {
      method: "POST",
      body,
    });

    for (const result of asArray(payload.results)) pages.push(asRecord(result));

    const next = payload.next_cursor;
    cursor = typeof next === "string" ? next : undefined;
  } while (cursor !== undefined);

  return pages;
}

/** A block and its descendants, flattened into ordered lines. */
async function fetchLines(token: string, blockId: string): Promise<Line[]> {
  const lines: Line[] = [];
  let cursor: string | undefined;

  do {
    const query = cursor === undefined ? "" : `&start_cursor=${cursor}`;
    const payload = await notionRequest(
      token,
      `/blocks/${blockId}/children?page_size=100${query}`,
    );

    for (const result of asArray(payload.results)) {
      const block = asRecord(result);
      const type = asString(block.type);
      const content = asRecord(block[type]);
      const text = plainText(content.rich_text);

      if (type === "heading_1" || type === "heading_2" || type === "heading_3") {
        lines.push({
          kind: "heading",
          level: Number(type.slice("heading_".length)),
          text,
        });
      } else if (type === "table") {
        lines.push({ kind: "table", rows: await fetchTableRows(token, asString(block.id)) });
        continue;
      } else if (text.length > 0) {
        lines.push({ kind: "text", text });
      }

      if (block.has_children === true) {
        lines.push(...(await fetchLines(token, asString(block.id))));
      }
    }

    const next = payload.next_cursor;
    cursor = typeof next === "string" ? next : undefined;
  } while (cursor !== undefined);

  return lines;
}

async function fetchTableRows(token: string, tableId: string): Promise<string[][]> {
  const payload = await notionRequest(token, `/blocks/${tableId}/children?page_size=100`);

  return asArray(payload.results).map((result) => {
    const row = asRecord(asRecord(result).table_row);
    return asArray(row.cells).map((cell) => plainText(cell));
  });
}

function toSections(lines: Line[]): Section[] {
  const sections: Section[] = [];

  for (const line of lines) {
    if (line.kind === "heading") {
      sections.push({ heading: line.text.toLowerCase(), level: line.level, lines: [] });
    } else if (sections.length > 0) {
      sections[sections.length - 1].lines.push(line);
    }
  }

  return sections;
}

function matchesHeading(headings: readonly string[], heading: string): boolean {
  return headings.some((candidate) => candidate === heading);
}

function sectionsFor(sections: Section[], headings: readonly string[]): Section[] {
  return sections.filter((section) => matchesHeading(headings, section.heading));
}

function textLines(sections: Section[]): string[] {
  return sections
    .flatMap((section) => section.lines)
    .filter((line): line is { kind: "text"; text: string } => line.kind === "text")
    .map((line) => line.text);
}

/** Bullet-style sections become string arrays, one entry per line. */
function listField(sections: Section[], headings: readonly string[]): string[] {
  return textLines(sectionsFor(sections, headings));
}

/** Prose sections become one paragraph. */
function textField(sections: Section[], headings: readonly string[]): string {
  return textLines(sectionsFor(sections, headings)).join(" ");
}

/**
 * `Architecture Sketch` is drawn as arrow-separated steps; split them so each
 * step is its own array entry.
 */
function architectureField(sections: Section[]): string[] {
  return textLines(sectionsFor(sections, SECTION.architecture))
    .flatMap((line) => line.split(/→|->/))
    .map((step) => step.trim())
    .filter((step) => step.length > 0);
}

/** Sub-headings under `Technical Breakdown` become `{ area, points }`. */
function technicalField(sections: Section[]): Project["technical"] {
  const start = sections.findIndex((section) =>
    matchesHeading(SECTION.technical, section.heading),
  );
  if (start === -1) return [];

  const parent = sections[start];
  const subsections: Project["technical"] = [];

  for (const section of sections.slice(start + 1)) {
    if (section.level <= parent.level) break;
    const points = textLines([section]);
    if (points.length > 0) subsections.push({ area: section.heading, points });
  }

  return subsections;
}

const TIMELINE_COLUMNS = {
  date: ["date", "date / time", "time"],
  evidence: ["evidence"],
  what: ["what i did", "what changed", "what"],
  how: ["how i did it", "how", "why it mattered"],
} as const;

function columnIndex(header: string[], names: readonly string[], fallback: number): number {
  const found = header.findIndex((cell) => names.includes(cell.trim().toLowerCase()));
  return found === -1 ? fallback : found;
}

/** The `Exact Timeline` table becomes one entry per row. */
function timelineField(sections: Section[]): Project["timeline"] {
  const table = sectionsFor(sections, SECTION.timeline)
    .flatMap((section) => section.lines)
    .find((line): line is { kind: "table"; rows: string[][] } => line.kind === "table");

  if (table === undefined || table.rows.length < 2) return [];

  const [header, ...rows] = table.rows;
  const date = columnIndex(header, TIMELINE_COLUMNS.date, 0);
  const evidence = columnIndex(header, TIMELINE_COLUMNS.evidence, -1);
  const what = columnIndex(header, TIMELINE_COLUMNS.what, 1);
  const how = columnIndex(header, TIMELINE_COLUMNS.how, 2);

  return rows
    .map((row) => ({
      date: row[date] ?? "",
      evidence: evidence === -1 ? "" : (row[evidence] ?? ""),
      what: row[what] ?? "",
      how: row[how] ?? "",
    }))
    .filter((entry) => entry.date.length > 0);
}

function property(page: Record<string, unknown>, name: string): Record<string, unknown> {
  return asRecord(asRecord(page.properties)[name]);
}

function propertyText(page: Record<string, unknown>, name: string): string {
  const field = property(page, name);
  return plainText(field.title ?? field.rich_text);
}

function propertySelect(page: Record<string, unknown>, name: string): string {
  const field = property(page, name);
  const select = field.select ?? field.status;
  return asString(asRecord(select).name);
}

function propertyMultiSelect(page: Record<string, unknown>, name: string): string[] {
  return asArray(property(page, name).multi_select)
    .map((option) => asString(asRecord(option).name))
    .filter((option) => option.length > 0);
}

function propertyUrl(page: Record<string, unknown>, name: string): string {
  return asString(property(page, name).url);
}

/** Reads either separate `Start`/`End` date columns or one `Dates` range. */
function propertyDates(page: Record<string, unknown>): { start: string; end: string } {
  const range = asRecord(property(page, PROPERTY.dates).date);
  const start =
    asString(asRecord(property(page, PROPERTY.start).date).start) ||
    asString(range.start);
  const end =
    asString(asRecord(property(page, PROPERTY.end).date).start) ||
    asString(range.end) ||
    start;

  return { start: start.slice(0, 10), end: end.slice(0, 10) };
}

/** The tagline already committed for this slug, if there is one. */
function committedTagline(slug: string): string {
  const filePath = path.join(CONTENT_DIR, `${slug}.json`);
  if (!existsSync(filePath)) return "";

  const existing = asRecord(JSON.parse(readFileSync(filePath, "utf8")));
  return asString(existing.tagline);
}

async function buildProject(
  token: string,
  page: Record<string, unknown>,
): Promise<{ fileName: string; project: Project }> {
  const name = propertyText(page, PROPERTY.name);
  const slug = slugify(propertyText(page, PROPERTY.slug) || name);
  const sections = toSections(await fetchLines(token, asString(page.id)));
  const { start, end } = propertyDates(page);

  const project = {
    slug,
    name,
    tagline: propertyText(page, PROPERTY.tagline) || committedTagline(slug),
    domain: propertySelect(page, PROPERTY.domain),
    priority: propertySelect(page, PROPERTY.priority),
    status: propertySelect(page, PROPERTY.status),
    start,
    end,
    skills: propertyMultiSelect(page, PROPERTY.skills),
    repo: propertyUrl(page, PROPERTY.repo),
    notionUrl: asString(page.url),
    overview: textField(sections, SECTION.overview),
    timeline: timelineField(sections),
    contributions: listField(sections, SECTION.contributions),
    technical: technicalField(sections),
    architecture: architectureField(sections),
    evidence: listField(sections, SECTION.evidence),
    skillsDemonstrated: textField(sections, SECTION.skillsDemonstrated),
    resumeBullets: listField(sections, SECTION.resumeBullets),
    talkingPoints: listField(sections, SECTION.talkingPoints),
    followUps: listField(sections, SECTION.followUps),
  };

  const fileName = `${slug}.json`;
  return { fileName, project: parseProject(fileName, project) };
}

async function main(): Promise<void> {
  const token = process.env.NOTION_TOKEN;

  if (token === undefined || token.trim() === "") {
    fail(
      "NOTION_TOKEN is not set. Create an internal Notion integration, share the\n" +
        "Project Index database with it, then run:\n" +
        "  NOTION_TOKEN=<secret> npm run sync:notion",
    );
  }

  const pages = await fetchDatabasePages(token);
  console.log(`Fetched ${pages.length} pages from the Project Index database.`);

  // Validate every project first: nothing is written unless all of them pass.
  const validated: { fileName: string; project: Project }[] = [];
  const failures: string[] = [];

  for (const page of pages) {
    try {
      validated.push(await buildProject(token, page));
    } catch (cause) {
      failures.push(cause instanceof Error ? cause.message : String(cause));
    }
  }

  if (failures.length > 0) {
    fail(
      `${failures.length} of ${pages.length} Notion pages failed validation. ` +
        `No files were written.\n\n${failures.join("\n\n")}`,
    );
  }

  for (const { fileName, project } of validated) {
    writeFileSync(
      path.join(CONTENT_DIR, fileName),
      `${JSON.stringify(project, null, 2)}\n`,
      "utf8",
    );
    console.log(`Wrote content/projects/${fileName}`);
  }

  console.log(`Synced ${validated.length} projects.`);
}

main().catch((cause: unknown) => {
  fail(cause instanceof Error ? cause.stack ?? cause.message : String(cause));
});
