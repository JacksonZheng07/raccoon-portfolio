import { describe, expect, it } from "vitest";
import { PRIORITY_SCENE, projectBin } from "@/components/work/field-marks";
import { PRIORITY_ORDER, getAllProjects } from "@/lib/projects";

/*
 * The bins on the work index are derived, not assigned, so the thing worth
 * asserting is the derivation: same input, same bin; two projects filed under
 * one domain never share a bin while the family lasts; and a slug that is not
 * in the set still gets a bin rather than throwing on the page.
 */
describe("projectBin", () => {
  const projects = getAllProjects();

  it("gives every project a bin", () => {
    for (const project of projects) {
      expect(projectBin(projects, project.slug)).toBeTruthy();
    }
  });

  it("is stable for the same project", () => {
    for (const project of projects) {
      expect(projectBin(projects, project.slug)).toBe(
        projectBin(projects, project.slug),
      );
    }
  });

  it("does not repeat a bin inside one domain", () => {
    const domains = new Set(projects.map((project) => project.domain));

    for (const domain of domains) {
      const bins = projects
        .filter((project) => project.domain === domain)
        .map((project) => projectBin(projects, project.slug));

      expect(new Set(bins).size).toBe(bins.length);
    }
  });

  it("gives the four repo-only cards four different bins", () => {
    const bins = projects
      .filter((project) => project.priority === "Supporting")
      .map((project) => projectBin(projects, project.slug));

    expect(bins).toHaveLength(4);
    expect(new Set(bins).size).toBe(4);
  });

  it("falls back rather than throwing on an unknown slug", () => {
    expect(projectBin(projects, "not-a-project")).toBeTruthy();
  });
});

describe("PRIORITY_SCENE", () => {
  it("heads every tier the index renders", () => {
    for (const priority of PRIORITY_ORDER) {
      expect(PRIORITY_SCENE[priority].pose).toBeTruthy();
      expect(PRIORITY_SCENE[priority].bin).toBeTruthy();
    }
  });

  it("gives each tier its own pose and its own bin", () => {
    const poses = PRIORITY_ORDER.map((p) => PRIORITY_SCENE[p].pose);
    const bins = PRIORITY_ORDER.map((p) => PRIORITY_SCENE[p].bin);

    expect(new Set(poses).size).toBe(poses.length);
    expect(new Set(bins).size).toBe(bins.length);
  });
});
