import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  PRIORITY_ORDER,
  getAllProjects,
  getCaseStudyProjects,
  getProject,
  getProjectSlugs,
  parseProject,
  projectSchema,
} from "@/lib/projects";

const EXPECTED_SLUGS = [
  "aftercare",
  "california-housing",
  "emptyneu",
  "enigma",
  "l3",
  "mysneakylink",
  "portfolio",
  "pystruct",
  "skyprint",
  "sprouted",
] as const;

function validFixture() {
  const raw = readFileSync(
    path.join(process.cwd(), "content/projects/pystruct.json"),
    "utf8",
  );
  return JSON.parse(raw) as Record<string, unknown>;
}

describe("projectSchema", () => {
  it("accepts a real committed project file", () => {
    expect(projectSchema.safeParse(validFixture()).success).toBe(true);
  });

  it("rejects a malformed project with a message naming the file and the field path", () => {
    const broken = { ...validFixture(), priority: "Legendary" };
    expect(() => parseProject("pystruct.json", broken)).toThrowError(
      /pystruct\.json/,
    );
    expect(() => parseProject("pystruct.json", broken)).toThrowError(
      /priority/,
    );
  });

  it("names a nested field path when a timeline row is malformed", () => {
    const project = validFixture();
    const timeline = [...(project.timeline as unknown[])];
    timeline[0] = { date: "Mar 24, 2026", evidence: "x", what: "y" };
    expect(() => parseProject("pystruct.json", { ...project, timeline })).toThrowError(
      /timeline\.0\.how/,
    );
  });

  it("rejects a slug that is not lowercase and URL-safe", () => {
    expect(() =>
      parseProject("pystruct.json", { ...validFixture(), slug: "Py Struct" }),
    ).toThrowError(/slug/);
  });

  it("rejects an unknown extra field so stale keys cannot ship silently", () => {
    expect(() =>
      parseProject("pystruct.json", { ...validFixture(), legacyField: "x" }),
    ).toThrowError(/legacyField/);
  });

  it("rejects a file whose name does not match its slug", () => {
    expect(() => parseProject("wrong-name.json", validFixture())).toThrowError(
      /wrong-name\.json/,
    );
  });
});

describe("getAllProjects", () => {
  it("loads all ten project files", () => {
    expect(getAllProjects()).toHaveLength(10);
  });

  it("exposes exactly the expected slugs", () => {
    expect([...getAllProjects().map((p) => p.slug)].sort()).toEqual([
      ...EXPECTED_SLUGS,
    ]);
  });

  it("has unique slugs", () => {
    const slugs = getAllProjects().map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has lowercase URL-safe slugs", () => {
    for (const project of getAllProjects()) {
      expect(project.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(encodeURIComponent(project.slug)).toBe(project.slug);
    }
  });

  it("sorts Flagship before Strong before Supporting", () => {
    const ranks = getAllProjects().map((p) => PRIORITY_ORDER.indexOf(p.priority));
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
  });

  it("sorts by end date descending inside a priority band", () => {
    for (const priority of PRIORITY_ORDER) {
      const ends = getAllProjects()
        .filter((p) => p.priority === priority)
        .map((p) => p.end);
      expect(ends).toEqual([...ends].sort().reverse());
    }
  });

  it("puts PyStruct first and California Housing last", () => {
    const slugs = getAllProjects().map((p) => p.slug);
    expect(slugs[0]).toBe("pystruct");
    expect(slugs[slugs.length - 1]).toBe("california-housing");
  });

  it("gives every project a non-empty tagline, overview and repo", () => {
    for (const project of getAllProjects()) {
      expect(project.tagline.length).toBeGreaterThan(0);
      expect(project.overview.length).toBeGreaterThan(0);
      expect(project.repo.length).toBeGreaterThan(0);
    }
  });

  it("uses a valid https URL for every repo and Notion link", () => {
    for (const project of getAllProjects()) {
      expect(() => new URL(project.repo)).not.toThrow();
      expect(new URL(project.repo).protocol).toBe("https:");
      expect(() => new URL(project.notionUrl)).not.toThrow();
      expect(new URL(project.notionUrl).protocol).toBe("https:");
    }
  });

  it("has parseable ISO dates with end on or after start", () => {
    for (const project of getAllProjects()) {
      const start = new Date(project.start);
      const end = new Date(project.end);
      expect(Number.isNaN(start.getTime())).toBe(false);
      expect(Number.isNaN(end.getTime())).toBe(false);
      expect(end.getTime()).toBeGreaterThanOrEqual(start.getTime());
    }
  });
});

describe("getCaseStudyProjects", () => {
  it("returns exactly the six Flagship and Strong projects", () => {
    const slugs = getCaseStudyProjects().map((p) => p.slug);
    expect(slugs).toEqual([
      "pystruct",
      "skyprint",
      "aftercare",
      "emptyneu",
      "sprouted",
      "l3",
    ]);
  });

  it("excludes every Supporting project", () => {
    expect(
      getCaseStudyProjects().some((p) => p.priority === "Supporting"),
    ).toBe(false);
  });

  it("gives every case study a timeline and an architecture sketch", () => {
    for (const project of getCaseStudyProjects()) {
      expect(project.timeline.length).toBeGreaterThan(0);
      expect(project.architecture.length).toBeGreaterThan(0);
    }
  });
});

describe("getProject", () => {
  it("finds a project by slug", () => {
    expect(getProject("skyprint")?.name).toBe("SkyPrint");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProject("not-a-project")).toBeUndefined();
  });
});

describe("getProjectSlugs", () => {
  it("returns one slug per case study route", () => {
    expect(getProjectSlugs()).toEqual(getCaseStudyProjects().map((p) => p.slug));
  });
});
