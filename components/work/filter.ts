import type { Domain } from "@/lib/projects";

/** The one option that is not a domain: no narrowing at all. */
export const ALL_FILTER = "All";

export type DomainFilter = typeof ALL_FILTER | Domain;

/**
 * The filter row's options: "All" first, then the domains in the order
 * `DOMAINS` declares them. The domain list is passed in rather than imported
 * so this module stays free of the content loader, which reads the filesystem
 * and cannot be bundled for the browser.
 */
export function filterOptions(
  domains: readonly Domain[],
): readonly DomainFilter[] {
  return [ALL_FILTER, ...domains];
}

/** Whether a project in `domain` survives `filter`. */
export function matchesFilter(domain: Domain, filter: DomainFilter): boolean {
  return filter === ALL_FILTER || domain === filter;
}

/** How many of `projects` survive `filter`. */
export function countMatching(
  projects: readonly { domain: Domain }[],
  filter: DomainFilter,
): number {
  return projects.filter((project) => matchesFilter(project.domain, filter))
    .length;
}

/**
 * The sentence read out when the filter changes. Written so the "All" case
 * does not say "10 of 10", which sounds like something was excluded.
 */
export function filterSummary(
  filter: DomainFilter,
  shown: number,
  total: number,
): string {
  const unit = shown === 1 ? "project" : "projects";

  if (filter === ALL_FILTER) {
    return `Showing all ${total} ${total === 1 ? "project" : "projects"}.`;
  }

  if (shown === 0) {
    return `No projects filed under ${filter}.`;
  }

  return `Showing ${shown} of ${total} ${unit}, filed under ${filter}.`;
}
