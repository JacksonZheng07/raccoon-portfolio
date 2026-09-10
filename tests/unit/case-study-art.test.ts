import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  BIN_NOTES,
  POSE_NOTES,
  debrisCount,
  flowCount,
  hasSpareBag,
  openItemsBin,
  overviewPose,
  partsCount,
} from "@/components/work/case-study/case-study-art";
import { getAllProjects, getCaseStudyProjects } from "@/lib/projects";

/*
 * The art modules are .tsx and these unit tests run in a plain node
 * environment, so a drawing's existence is checked against the file the
 * module is generated from rather than against the module itself.
 */
const ART_DIR = path.join(process.cwd(), "public/assets/detective");

function drawingExists(name: string): boolean {
  return existsSync(path.join(ART_DIR, `${name}.svg`));
}

const projects = getAllProjects();
const caseStudies = getCaseStudyProjects();

describe("overviewPose", () => {
  it("gives every case study a pose that exists", () => {
    for (const project of caseStudies) {
      expect(drawingExists(overviewPose(projects, project.slug))).toBe(true);
    }
  });

  it("only ever picks a portrait pose, never one a later band owns", () => {
    const spokenFor = [
      "raccoon-notepad",
      "raccoon-evidence-bag",
      "raccoon-magnifier-ground",
      "raccoon-dusting",
      "raccoon-flashlight",
    ];

    for (const project of projects) {
      expect(spokenFor).not.toContain(overviewPose(projects, project.slug));
    }
  });

  it("does not repeat within a domain until the family runs out", () => {
    const product = projects.filter((project) => project.domain === "Product");
    expect(overviewPose(projects, product[0]?.slug ?? "")).not.toBe(
      overviewPose(projects, product[1]?.slug ?? ""),
    );
  });

  it("falls back to the deerstalker for an unknown slug", () => {
    expect(overviewPose(projects, "not-a-project")).toBe("raccoon-deerstalker");
  });
});

describe("openItemsBin", () => {
  it("gives every project a bin that exists", () => {
    for (const project of projects) {
      expect(drawingExists(openItemsBin(projects, project.slug))).toBe(true);
    }
  });

  it("always picks a bin, never a loose bag", () => {
    for (const project of projects) {
      expect(openItemsBin(projects, project.slug)).toMatch(/^trash-can-/);
    }
  });

  it("never picks a bin that is closed or intact", () => {
    for (const project of projects) {
      expect(openItemsBin(projects, project.slug)).not.toBe(
        "trash-can-closed",
      );
      expect(openItemsBin(projects, project.slug)).not.toBe(
        "trash-can-lid-hat",
      );
    }
  });

  it("stands a spare bag beside the bin only for the longest owed list", () => {
    const owesLots = { followUps: Array.from({ length: 9 }, (_, i) => `${i}`) };
    const owesFewer = { followUps: ["one", "two"] };

    expect(hasSpareBag(owesLots as never)).toBe(true);
    expect(hasSpareBag(owesFewer as never)).toBe(false);
  });

  it("turns with filing order rather than repeating one bin", () => {
    const bins = new Set(
      projects.map((project) => openItemsBin(projects, project.slug)),
    );
    expect(bins.size).toBeGreaterThan(1);
  });
});

describe("debrisCount", () => {
  it("stays inside the margin it is drawn in", () => {
    for (const project of projects) {
      const count = debrisCount(project);
      expect(count).toBeGreaterThanOrEqual(3);
      expect(count).toBeLessThanOrEqual(6);
    }
  });

  it("spills more for a project that owes more", () => {
    const owesLots = { followUps: Array.from({ length: 8 }, (_, i) => `${i}`) };
    const owesLittle = { followUps: ["one"] };

    expect(debrisCount(owesLots as never)).toBeGreaterThan(
      debrisCount(owesLittle as never),
    );
  });
});

describe("flowCount", () => {
  it("stays inside its clamp for every project", () => {
    for (const project of projects) {
      expect(flowCount(project)).toBeGreaterThanOrEqual(7);
      expect(flowCount(project)).toBeLessThanOrEqual(12);
    }
  });

  it("draws a longer trail for a longer flow", () => {
    const long = { architecture: Array.from({ length: 11 }, (_, i) => `${i}`) };
    const short = { architecture: ["one", "two", "three", "four", "five", "six"] };

    expect(flowCount(long as never)).toBeGreaterThan(flowCount(short as never));
  });
});

describe("partsCount", () => {
  it("stays inside its clamp for every project", () => {
    for (const project of projects) {
      const count = partsCount(project);
      expect(count).toBeGreaterThanOrEqual(2);
      expect(count).toBeLessThanOrEqual(5);
    }
  });
});

describe("the notes under the drawings", () => {
  const notes = [...Object.values(POSE_NOTES), ...Object.values(BIN_NOTES)];

  it("captions every pose and every bin", () => {
    expect(Object.keys(POSE_NOTES)).toHaveLength(7);
    expect(Object.keys(BIN_NOTES)).toHaveLength(6);
    for (const note of notes) {
      expect(note.length).toBeGreaterThan(0);
    }
  });

  /*
   * The whole point of keying these by pose: a caption is about the raccoon,
   * never about the project. These pages are hedged about team work and
   * unverified dates, and a caption must not be a side door around that.
   */
  it("never names a project, a person or a technology", () => {
    const forbidden = [
      ...projects.map((project) => project.name.toLowerCase()),
      ...projects.map((project) => project.slug),
      "jackson",
      "zheng",
      "this project",
      "this page",
      "the build",
      "the repo",
    ];

    for (const note of notes) {
      for (const word of forbidden) {
        expect(note.toLowerCase()).not.toContain(word);
      }
    }
  });

  it("keeps the register: lower case, no terminal punctuation, no emoji", () => {
    for (const note of notes) {
      expect(note).toBe(note.toLowerCase());
      expect(note).not.toMatch(/[.!?]$/);
      expect(note).toMatch(/^[a-z0-9 ,'-]+$/);
    }
  });

  it("gives no two poses the same note", () => {
    expect(new Set(notes).size).toBe(notes.length);
  });
});
