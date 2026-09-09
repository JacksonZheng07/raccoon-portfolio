import type { TimelineEntry } from "@/lib/projects";

/**
 * The build log. A mono date column against a 2px spine, in the wireframe's
 * `.timeline` proportions, with `what` set in the display face so the
 * sequence can be skimmed by outcome and `how` read underneath for the
 * method. The band it sits in is the one ruled surface on the page, which is
 * what makes this section read as a log rather than as one more list.
 *
 * `evidence` is where the page earns its claims, so the chip is the loudest
 * small thing here: a hard-bordered plate in the accent green nothing else
 * on the page uses. `evidence` is absent on some projects — the Notion tables
 * behind them had no such column — so the whole line, chip included, is
 * dropped rather than left as an empty box.
 */
export function CaseTimeline({ entries }: { entries: readonly TimelineEntry[] }) {
  return (
    <ol className="m-0 list-none border-t-2 border-line p-0">
      {entries.map((entry, index) => (
        <li
          key={`${entry.date}-${entry.what}`}
          className="grid grid-cols-[132px_minmax(0,1fr)] gap-[34px] border-b border-ringtail py-[26px] max-[740px]:block max-[740px]:py-[20px]"
        >
          <div className="max-[740px]:mb-[12px] max-[740px]:flex max-[740px]:items-baseline max-[740px]:justify-between max-[740px]:gap-4">
            {/*
              * `text-muted`, not `text-ringtail`: at 30px normal weight this
              * is still under the 24px-bold / 18.66px large-text threshold in
              * the display face, so it needs 4.5:1. Ringtail on paper is
              * 3.29:1; muted is 5.89:1.
              */}
            <span
              aria-hidden="true"
              className="block font-display text-[30px] leading-none tabular-nums text-muted"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="mt-[10px] block font-mono text-[11px] uppercase leading-[1.55] tracking-[0.04em] text-ink max-[740px]:mt-0 max-[740px]:text-right">
              {entry.date}
            </span>
          </div>
          <div className="border-l-2 border-line pl-[30px] max-[740px]:border-l-0 max-[740px]:pl-0">
            <h3 className="m-0 max-w-[46ch] font-display text-display-4">
              {entry.what}
            </h3>
            <p className="m-0 mt-[10px] max-w-[558px]">{entry.how}</p>
            {entry.evidence !== "" ? (
              <p className="m-0 mt-[16px] flex flex-wrap items-baseline gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                <span className="border-2 border-line bg-accent-green px-[9px] py-[3px] font-bold tracking-[0.14em] text-ink">
                  evidence
                </span>
                <span className="max-w-[500px]">{entry.evidence}</span>
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default CaseTimeline;
