import { describe, expect, it } from "vitest";
import {
  adjacentCaseStudies,
  formatDateRange,
  splitArchitectureFlows,
  splitContributions,
} from "@/components/work/case-study/case-study-data";
import { getCaseStudyProjects, getProject } from "@/lib/projects";

describe("splitArchitectureFlows", () => {
  it("keeps a plain sequence as one unnamed flow", () => {
    const flows = splitArchitectureFlows([
      "Data inputs",
      "Scoring logic",
      "Dashboard cards",
    ]);

    expect(flows).toEqual([
      {
        title: undefined,
        steps: [
          { label: undefined, text: "Data inputs" },
          { label: undefined, text: "Scoring logic" },
          { label: undefined, text: "Dashboard cards" },
        ],
      },
    ]);
  });

  it("starts a new flow at a labelled step that has steps after it", () => {
    const flows = splitArchitectureFlows([
      "User code",
      "Tokenizer",
      "Browser IDE: runCapture(code, env)",
      "Output lines",
    ]);

    expect(flows).toHaveLength(2);
    expect(flows[0]).toEqual({
      title: undefined,
      steps: [
        { label: undefined, text: "User code" },
        { label: undefined, text: "Tokenizer" },
      ],
    });
    expect(flows[1]).toEqual({
      title: "Browser IDE",
      steps: [
        { label: undefined, text: "runCapture(code, env)" },
        { label: undefined, text: "Output lines" },
      ],
    });
  });

  it("keeps a trailing labelled step inside the flow it belongs to", () => {
    const flows = splitArchitectureFlows([
      "User code",
      "Browser IDE: runCapture(code, env)",
      "Output lines",
      "UI tabs: Variables / Steps / AST",
    ]);

    expect(flows).toHaveLength(2);
    expect(flows[1]?.steps).toEqual([
      { label: undefined, text: "runCapture(code, env)" },
      { label: undefined, text: "Output lines" },
      { label: "UI tabs", text: "Variables / Steps / AST" },
    ]);
  });

  it("does not treat prose containing a slash-heavy step as a label", () => {
    const flows = splitArchitectureFlows([
      "Pain / symptoms / wound / medication / mobility logs",
      "Risk signals",
    ]);

    expect(flows).toHaveLength(1);
    expect(flows[0]?.steps.every((step) => step.label === undefined)).toBe(true);
  });

  it("returns no flows for an empty sketch", () => {
    expect(splitArchitectureFlows([])).toEqual([]);
  });

  it("splits PyStruct's folded sketch into the runtime flow and the IDE flow", () => {
    const pystruct = getProject("pystruct");
    if (!pystruct) throw new Error("pystruct content is missing");

    const flows = splitArchitectureFlows(pystruct.architecture);

    expect(flows).toHaveLength(2);
    expect(flows[0]?.steps).toHaveLength(8);
    expect(flows[1]?.title).toBe("Browser IDE");
    expect(flows[1]?.steps).toHaveLength(3);
  });
});

describe("splitContributions", () => {
  it("separates an Inference line from the ordinary bullets", () => {
    const { bullets, hedges } = splitContributions([
      "Worked on scoring logic.",
      "Inference: the project focused on dashboard scores.",
    ]);

    expect(bullets).toEqual(["Worked on scoring logic."]);
    expect(hedges).toEqual([
      {
        kind: "Inference",
        text: "the project focused on dashboard scores.",
      },
    ]);
  });

  it("separates a Fact line and keeps its wording", () => {
    const { bullets, hedges } = splitContributions([
      "Worked on database schema and seed data.",
      "Fact: README lists Jackson Zheng as a team member.",
    ]);

    expect(bullets).toHaveLength(1);
    expect(hedges).toEqual([
      { kind: "Fact", text: "README lists Jackson Zheng as a team member." },
    ]);
  });

  it("leaves a project without hedges alone", () => {
    const { bullets, hedges } = splitContributions(["One.", "Two."]);

    expect(bullets).toEqual(["One.", "Two."]);
    expect(hedges).toEqual([]);
  });

  it("finds exactly one hedge on each project that carries one", () => {
    for (const slug of ["aftercare", "l3", "sprouted"]) {
      const project = getProject(slug);
      if (!project) throw new Error(`${slug} content is missing`);
      expect(splitContributions(project.contributions).hedges).toHaveLength(1);
    }
  });
});

describe("formatDateRange", () => {
  it("collapses a same-month range to one month", () => {
    expect(formatDateRange("2026-04-11", "2026-04-12")).toBe("April 2026");
  });

  it("names both months within one year", () => {
    expect(formatDateRange("2026-03-24", "2026-05-24")).toBe(
      "March – May 2026",
    );
  });

  it("names both years when the range crosses one", () => {
    expect(formatDateRange("2025-10-17", "2026-01-05")).toBe(
      "October 2025 – January 2026",
    );
  });

  it("reads the date in UTC, not the local timezone", () => {
    expect(formatDateRange("2026-01-01", "2026-01-01")).toBe("January 2026");
  });
});

describe("adjacentCaseStudies", () => {
  const projects = getCaseStudyProjects();

  it("has no previous entry for the first case study", () => {
    const first = projects[0];
    if (!first) throw new Error("no case studies found");

    const { previous, next } = adjacentCaseStudies(projects, first.slug);

    expect(previous).toBeUndefined();
    expect(next?.slug).toBe(projects[1]?.slug);
  });

  it("has no next entry for the last case study", () => {
    const last = projects[projects.length - 1];
    if (!last) throw new Error("no case studies found");

    const { previous, next } = adjacentCaseStudies(projects, last.slug);

    expect(next).toBeUndefined();
    expect(previous?.slug).toBe(projects[projects.length - 2]?.slug);
  });

  it("returns both neighbours in the middle of the list", () => {
    const middle = projects[1];
    if (!middle) throw new Error("no case studies found");

    const { previous, next } = adjacentCaseStudies(projects, middle.slug);

    expect(previous?.slug).toBe(projects[0]?.slug);
    expect(next?.slug).toBe(projects[2]?.slug);
  });

  it("returns nothing for a slug that is not a case study", () => {
    expect(adjacentCaseStudies(projects, "portfolio")).toEqual({
      previous: undefined,
      next: undefined,
    });
  });
});
