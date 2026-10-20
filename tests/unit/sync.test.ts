import { describe, expect, it } from "vitest";
import { getAllProjects } from "@/lib/projects";
import { diffProjects, getSyncRecord, serializeProject } from "@/lib/sync";

describe("diffProjects", () => {
  const [first, second] = getAllProjects();

  it("reports nothing when the pull matches what is committed", () => {
    const committed = new Map([[first!.slug, serializeProject(first!)]]);
    expect(diffProjects(committed, [first!])).toEqual([]);
  });

  it("marks unseen slugs new and edited ones updated", () => {
    const committed = new Map([[first!.slug, serializeProject(first!)]]);
    const edited = { ...first!, tagline: `${first!.tagline} (edited)` };
    expect(diffProjects(committed, [edited, second!])).toEqual([
      { slug: first!.slug, name: first!.name, kind: "updated" },
      { slug: second!.slug, name: second!.name, kind: "new" },
    ]);
  });
});

describe("content/sync.json", () => {
  it("parses", () => {
    expect(() => getSyncRecord()).not.toThrow();
  });
});
