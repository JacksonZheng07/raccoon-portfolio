import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { z } from "zod";

export const CONTENT_DIR = path.join(process.cwd(), "content/projects");

export const PRIORITY_ORDER = ["Flagship", "Strong", "Supporting"] as const;
export const DOMAINS = ["Systems", "Product", "Data", "Infrastructure"] as const;

export type Priority = (typeof PRIORITY_ORDER)[number];
export type Domain = (typeof DOMAINS)[number];

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isoDate = z
  .string()
  .regex(ISO_DATE_PATTERN, "must be an ISO date (YYYY-MM-DD)")
  .refine((value) => !Number.isNaN(Date.parse(value)), "must be a real date");

const httpsUrl = z
  .string()
  .url("must be a URL")
  .refine((value) => value.startsWith("https://"), "must be an https URL");

const nonEmpty = z.string().min(1, "must not be empty");

const timelineEntrySchema = z.strictObject({
  date: nonEmpty,
  evidence: z.string(),
  what: nonEmpty,
  how: nonEmpty,
});

const technicalSectionSchema = z.strictObject({
  area: nonEmpty,
  points: z.array(nonEmpty).min(1, "must list at least one point"),
});

export const projectSchema = z
  .strictObject({
    slug: z
      .string()
      .regex(SLUG_PATTERN, "must be lowercase, URL-safe and hyphen-separated"),
    name: nonEmpty,
    tagline: nonEmpty,
    domain: z.enum(DOMAINS),
    priority: z.enum(PRIORITY_ORDER),
    status: nonEmpty,
    start: isoDate,
    end: isoDate,
    skills: z.array(nonEmpty),
    repo: httpsUrl,
    notionUrl: httpsUrl,
    overview: nonEmpty,
    timeline: z.array(timelineEntrySchema),
    contributions: z.array(nonEmpty),
    technical: z.array(technicalSectionSchema),
    architecture: z.array(nonEmpty),
    evidence: z.array(nonEmpty),
    skillsDemonstrated: nonEmpty,
    resumeBullets: z.array(nonEmpty),
    talkingPoints: z.array(nonEmpty),
    followUps: z.array(nonEmpty),
  })
  .refine((project) => Date.parse(project.end) >= Date.parse(project.start), {
    message: "end date must be on or after start date",
    path: ["end"],
  });

export type Project = z.infer<typeof projectSchema>;
export type TimelineEntry = Project["timeline"][number];
export type TechnicalSection = Project["technical"][number];

function describeIssue(issue: z.core.$ZodIssue): string {
  const fieldPath = issue.path.length > 0 ? issue.path.join(".") : "<root>";
  return `  ${fieldPath}: ${issue.message}`;
}

/**
 * Validate one project file's contents. Throws an error naming the file and
 * every offending field path, so a bad file breaks the build with a message
 * that says where to look.
 */
export function parseProject(fileName: string, data: unknown): Project {
  const result = projectSchema.safeParse(data);

  if (!result.success) {
    const issues = result.error.issues.map(describeIssue).join("\n");
    throw new Error(
      `Invalid project content in content/projects/${fileName}:\n${issues}`,
    );
  }

  const expectedFileName = `${result.data.slug}.json`;
  if (fileName !== expectedFileName) {
    throw new Error(
      `Invalid project content in content/projects/${fileName}:\n` +
        `  slug: expected the file to be named ${expectedFileName} to match slug "${result.data.slug}"`,
    );
  }

  return result.data;
}

function readProjectFile(fileName: string): Project {
  const filePath = path.join(CONTENT_DIR, fileName);
  let raw: unknown;

  try {
    raw = JSON.parse(readFileSync(filePath, "utf8"));
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    throw new Error(
      `Unreadable project content in content/projects/${fileName}:\n  <root>: ${detail}`,
    );
  }

  return parseProject(fileName, raw);
}

function byPriorityThenEndDateDescending(a: Project, b: Project): number {
  const priorityDelta =
    PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority);
  if (priorityDelta !== 0) return priorityDelta;

  const endDelta = Date.parse(b.end) - Date.parse(a.end);
  if (endDelta !== 0) return endDelta;

  return a.slug.localeCompare(b.slug);
}

function loadProjects(): Project[] {
  const fileNames = readdirSync(CONTENT_DIR)
    .filter((fileName) => fileName.endsWith(".json"))
    .sort();

  if (fileNames.length === 0) {
    throw new Error("No project content found in content/projects.");
  }

  const projects = fileNames.map(readProjectFile);
  const seen = new Map<string, string>();

  for (const project of projects) {
    const duplicate = seen.get(project.slug);
    if (duplicate !== undefined) {
      throw new Error(
        `Duplicate project slug "${project.slug}" in content/projects/${project.slug}.json ` +
          `and content/projects/${duplicate}`,
      );
    }
    seen.set(project.slug, `${project.slug}.json`);
  }

  return projects.sort(byPriorityThenEndDateDescending);
}

let cache: Project[] | undefined;

/** Every project, Flagship then Strong then Supporting, newest end date first. */
export function getAllProjects(): Project[] {
  cache ??= loadProjects();
  return cache;
}

/** One project by slug, or undefined when no content backs that slug. */
export function getProject(slug: string): Project | undefined {
  return getAllProjects().find((project) => project.slug === slug);
}

/** The Flagship and Strong projects — the ones that get their own page. */
export function getCaseStudyProjects(): Project[] {
  return getAllProjects().filter(
    (project) => project.priority === "Flagship" || project.priority === "Strong",
  );
}

/** Slugs for generateStaticParams on /work/[slug]. */
export function getProjectSlugs(): string[] {
  return getCaseStudyProjects().map((project) => project.slug);
}
