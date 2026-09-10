import type { TimelineEntry } from "@/lib/projects";

type CaseTimelineProps = {
  entries: readonly TimelineEntry[];
};

/**
 * The build log. A mono date column against the entry, in the wireframe's
 * `.timeline` proportions, with `what` set in the display face so the sequence
 * can be skimmed by outcome and `how` read underneath for the method.
 *
 * `evidence` is absent on some projects — the Notion tables behind them had no
 * such column — so the whole evidence line, marker included, is dropped rather
 * than left as an empty box.
 */
export function CaseTimeline({ entries }: CaseTimelineProps) {
  return (
    <ol className="m-0 list-none border-t-2 border-line p-0">
      {entries.map((entry, index) => (
        <li
          key={`${entry.date}-${entry.what}`}
          className="grid grid-cols-[150px_minmax(0,1fr)] gap-[40px] border-b border-ringtail py-[24px] max-[740px]:block max-[740px]:py-[20px]"
        >
          <div className="max-[740px]:mb-[12px] max-[740px]:flex max-[740px]:items-baseline max-[740px]:justify-between max-[740px]:gap-4">
            <span
              aria-hidden="true"
              className="block font-display text-[26px] leading-none text-ringtail"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="mt-[10px] block font-mono text-[11px] uppercase leading-[1.55] tracking-[0.04em] text-ink max-[740px]:mt-0 max-[740px]:text-right">
              {entry.date}
            </span>
          </div>
          <div>
            <h3 className="m-0 max-w-[46ch] font-display text-[23px] leading-[1.15] tracking-[-0.03em]">
              {entry.what}
            </h3>
            <p className="m-0 mt-[9px] max-w-[558px]">{entry.how}</p>
            {entry.evidence !== "" ? (
              <p className="m-0 mt-[14px] flex flex-wrap items-baseline gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                <span className="border-2 border-line px-[7px] py-[2px] text-ink">
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
