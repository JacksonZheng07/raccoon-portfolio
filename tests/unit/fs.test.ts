import { describe, expect, it } from "vitest";
import { buildTree, cd, resolve, walk } from "@/components/desktop/fs";
import type { DesktopProject } from "@/components/desktop/types";
import { getAllNotes } from "@/lib/notes";
import { getAllProjects } from "@/lib/projects";

const projects = getAllProjects() as DesktopProject[];
const root = buildTree(projects, getAllNotes(), [{ id: "browser", name: "Chrome", icon: "browser" }]);

describe("file tree", () => {
  it("files every project under its domain with a README and source alias", () => {
    for (const p of projects) {
      const folder = resolve(root, ["Projects", p.domain, p.name]);
      expect(folder?.children?.map((c) => c.name)).toEqual(expect.arrayContaining(["README.md", "Source Code"]));
    }
  });

  it("resolves case-insensitively and finds nothing for a bad path", () => {
    expect(resolve(root, ["projects", "systems"])?.name).toBe("Systems");
    expect(resolve(root, ["Projects", "Nope"])).toBeUndefined();
  });

  it("walks every node once", () => {
    const paths = walk(root).map((e) => e.path.join("/"));
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).toContain("Applications/Chrome.app");
  });
});

describe("cd", () => {
  it("handles relative, parent, home and absolute paths", () => {
    expect(cd(["Projects"], "Systems/PyStruct")).toEqual(["Projects", "Systems", "PyStruct"]);
    expect(cd(["Projects", "Systems"], "../..")).toEqual([]);
    expect(cd(["Projects"], "~/Notes/")).toEqual(["Notes"]);
    expect(cd(["Projects"], "")).toEqual([]);
  });
});
