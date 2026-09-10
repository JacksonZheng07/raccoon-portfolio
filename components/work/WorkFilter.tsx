"use client";

import { useState, type ReactNode } from "react";
import { WorkGrid } from "@/components/work/WorkGrid";
import {
  ALL_FILTER,
  countMatching,
  filterOptions,
  filterSummary,
  type DomainFilter,
} from "@/components/work/filter";
import type { Domain } from "@/lib/projects";

type WorkFilterItem = {
  /** Stable key, and the value used for nothing else. */
  slug: string;
  /** The domain this entry is filed under. */
  domain: Domain;
  /** The already-rendered card. The server builds it; this only shows it. */
  card: ReactNode;
};

type WorkFilterProps = {
  /** The domain list, passed in from `DOMAINS` so it is declared in one place. */
  domains: readonly Domain[];
  /** Every project, in the order they should read. All of them get rendered. */
  items: readonly WorkFilterItem[];
};

const BUTTON_CLASS =
  "border border-line bg-transparent px-[9px] py-[5px] font-mono text-[11px] uppercase tracking-[0.08em] text-ink hover:bg-ink hover:text-white";

/**
 * The domain filter for the work index, and the only interactive component on
 * the site.
 *
 * Every card is rendered on the server and handed to this component as a
 * prop; filtering only sets `hidden` on the ones that do not match. That is
 * deliberate: with JavaScript disabled the initial "All" markup is what the
 * visitor gets, which is the complete list, rather than an empty grid waiting
 * for a client render that will never happen.
 */
export function WorkFilter({ domains, items }: WorkFilterProps) {
  const [active, setActive] = useState<DomainFilter>(ALL_FILTER);
  const options = filterOptions(domains);
  const shown = countMatching(items, active);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter projects by domain"
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const count = countMatching(items, option);
          const isActive = option === active;

          return (
            <button
              key={option}
              type="button"
              aria-pressed={isActive}
              aria-label={`${option}, ${count} ${
                count === 1 ? "project" : "projects"
              }`}
              onClick={() => setActive(option)}
              className={
                isActive ? `${BUTTON_CLASS} bg-ink text-white` : BUTTON_CLASS
              }
            >
              {option}{" "}
              <span aria-hidden="true" className="opacity-70">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <p
        role="status"
        className="mt-[14px] font-mono text-[11px] uppercase tracking-[0.08em] text-muted"
      >
        {filterSummary(active, shown, items.length)}
      </p>

      <noscript>
        <p className="mt-2 border-2 border-line bg-accent-blue px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink">
          Filtering needs JavaScript. All {items.length} projects are listed
          below regardless.
        </p>
      </noscript>

      <WorkGrid layout="uniform" className="mt-5">
        {items.map((item) => {
          const visible = active === ALL_FILTER || item.domain === active;

          return (
            <div
              key={item.slug}
              data-domain={item.domain}
              hidden={!visible}
              className={visible ? "grid grid-rows-[1fr_auto]" : "hidden"}
            >
              {item.card}
            </div>
          );
        })}
      </WorkGrid>
    </div>
  );
}

export default WorkFilter;
