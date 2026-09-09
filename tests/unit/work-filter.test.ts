import { describe, expect, it } from "vitest";
import {
  ALL_FILTER,
  countMatching,
  filterOptions,
  filterSummary,
  matchesFilter,
} from "@/components/work/filter";
import { DOMAINS, getAllProjects } from "@/lib/projects";

describe("filterOptions", () => {
  it("puts All first and keeps the declared domain order", () => {
    expect(filterOptions(DOMAINS)).toEqual([
      "All",
      "Systems",
      "Product",
      "Data",
      "Infrastructure",
    ]);
  });
});

describe("matchesFilter", () => {
  it("keeps everything under All", () => {
    for (const domain of DOMAINS) {
      expect(matchesFilter(domain, ALL_FILTER)).toBe(true);
    }
  });

  it("keeps only the matching domain otherwise", () => {
    expect(matchesFilter("Systems", "Systems")).toBe(true);
    expect(matchesFilter("Systems", "Data")).toBe(false);
  });
});

describe("countMatching", () => {
  const projects = getAllProjects();

  it("counts every project under All", () => {
    expect(countMatching(projects, ALL_FILTER)).toBe(projects.length);
  });

  it("partitions the real content exactly once per project", () => {
    const perDomain = DOMAINS.map((domain) =>
      countMatching(projects, domain),
    ).reduce((total, count) => total + count, 0);

    expect(perDomain).toBe(projects.length);
  });

  it("matches the counts the ten committed projects actually have", () => {
    expect(countMatching(projects, "Systems")).toBe(1);
    expect(countMatching(projects, "Product")).toBe(5);
    expect(countMatching(projects, "Data")).toBe(2);
    expect(countMatching(projects, "Infrastructure")).toBe(2);
  });
});

describe("filterSummary", () => {
  it("does not say 10 of 10 when nothing is excluded", () => {
    expect(filterSummary(ALL_FILTER, 10, 10)).toBe("Showing all 10 projects.");
  });

  it("names the domain and the count when narrowed", () => {
    expect(filterSummary("Data", 2, 10)).toBe(
      "Showing 2 of 10 projects, filed under Data.",
    );
  });

  it("uses the singular for one result", () => {
    expect(filterSummary("Systems", 1, 10)).toBe(
      "Showing 1 of 10 project, filed under Systems.",
    );
  });

  it("says so plainly when a domain is empty", () => {
    expect(filterSummary("Infrastructure", 0, 10)).toBe(
      "No projects filed under Infrastructure.",
    );
  });
});
