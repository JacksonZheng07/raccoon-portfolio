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

type WorkFilterGroup = {
  /** The group's own name, e.g. "Flagship". Also its key. */
  name: string;
  /** One written line saying what being in this group means. */
  blurb: string;
  /** The group's specimen mark, rendered on the server. Decorative. */
  mark?: ReactNode;
  /** How wide the group's cards sit. */
  layout: "pair" | "uniform";
  /** The cards in this group, in filing order. */
  items: readonly WorkFilterItem[];
};

type WorkFilterProps = {
  /** The domain list, passed in from `DOMAINS` so it is declared in one place. */
  domains: readonly Domain[];
  /** The groups, in the order they should read. All of them get rendered. */
  groups: readonly WorkFilterGroup[];
};

const BUTTON_CLASS =
  "tactile-quiet border border-line px-[9px] py-[5px] font-mono text-[11px] uppercase tracking-[0.08em]";

/*
 * Inactive and active carry the same CSS properties, so they must never both
 * be applied. Tailwind emits utilities in stylesheet order, not in the order
 * they appear in the class attribute -- concatenating `bg-ink` onto a base
 * that already has `bg-transparent` lets the transparent rule win, which
 * rendered the selected chip as white text on cream paper.
 */
const BUTTON_INACTIVE = "bg-transparent text-ink hover:bg-ink hover:text-white";

const BUTTON_ACTIVE = "bg-ink text-white";

/**
 * The domain filter for the work index, and the only interactive component on
 * the site.
 *
 * Every card is rendered on the server and handed to this component as a
 * prop; filtering only sets `hidden` on the ones that do not match. That is
 * deliberate: with JavaScript disabled the initial "All" markup is what the
 * visitor gets, which is the complete list, rather than an empty grid waiting
 * for a client render that will never happen.
 *
 * The cards arrive already grouped by rank, and a group whose every card is
 * filtered out drops its own heading too, so narrowing to one domain never
 * leaves a titled band with nothing under it.
 */
export function WorkFilter({ domains, groups }: WorkFilterProps) {
  const [active, setActive] = useState<DomainFilter>(ALL_FILTER);
  const options = filterOptions(domains);
  const all = groups.flatMap((group) => group.items);
  const shown = countMatching(all, active);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter projects by domain"
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const count = countMatching(all, option);
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
              className={`${BUTTON_CLASS} ${
                isActive ? BUTTON_ACTIVE : BUTTON_INACTIVE
              }`}
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
        {filterSummary(active, shown, all.length)}
      </p>

      <noscript>
        <p className="mt-2 border-2 border-line bg-accent-blue px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink">
          Filtering needs JavaScript. All {all.length} projects are listed
          below regardless.
        </p>
      </noscript>

      {groups.map((group) => {
        const visible = countMatching(group.items, active);

        return (
          <section
            key={group.name}
            hidden={visible === 0}
            className={visible === 0 ? "hidden" : "mt-[46px]"}
          >
            <div className="flex items-end justify-between gap-6 border-b-2 border-line pb-[10px]">
              <div className="flex items-end gap-4">
                {group.mark ? (
                  <span className="mb-[3px] block w-[38px] shrink-0 text-ringtail max-[740px]:hidden">
                    {group.mark}
                  </span>
                ) : null}
                <div>
                  <h3 className="m-0 font-display text-display-3">
                    {group.name}
                  </h3>
                  <p className="m-0 mt-[4px] max-w-[62ch] text-[14px] text-muted">
                    {group.blurb}
                  </p>
                </div>
              </div>
              <p className="m-0 shrink-0 font-mono text-specimen font-bold uppercase tabular-nums text-muted">
                {visible} {visible === 1 ? "card" : "cards"}
              </p>
            </div>

            <WorkGrid layout={group.layout} className="mt-5">
              {group.items.map((item) => {
                const shows = active === ALL_FILTER || item.domain === active;

                return (
                  <div
                    key={item.slug}
                    data-domain={item.domain}
                    hidden={!shows}
                    className={shows ? "flex flex-col" : "hidden"}
                  >
                    {item.card}
                  </div>
                );
              })}
            </WorkGrid>
          </section>
        );
      })}
    </div>
  );
}

export default WorkFilter;
