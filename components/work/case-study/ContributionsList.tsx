import { Label } from "@/components/ui/Label";
import type { Hedge } from "./case-study-data";

type ContributionsListProps = {
  bullets: readonly string[];
  hedges: readonly Hedge[];
};

const HEDGE_CAPTION: Record<Hedge["kind"], string> = {
  Inference: "inference / not verified",
  Fact: "fact / stated in the source",
};

/**
 * What Jackson did, plus the source's own epistemic hedges.
 *
 * The `Inference:` and `Fact:` lines arrive inside `contributions`, but they
 * are notes about how much the list can be trusted, not more of the list. They
 * are printed under the rule, marked, so a reader can see exactly where the
 * claim stops being verified.
 */
export function ContributionsList({
  bullets,
  hedges,
}: ContributionsListProps) {
  return (
    <div>
      <ul className="m-0 grid list-none grid-cols-2 gap-x-[44px] p-0 max-[740px]:block">
        {bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex gap-3 border-b border-ringtail py-[11px]"
          >
            <span aria-hidden="true" className="font-mono text-muted">
              &mdash;
            </span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      {hedges.map((hedge) => (
        <aside
          key={hedge.text}
          className="mt-[26px] max-w-[660px] border-2 border-ringtail bg-shell px-[22px] py-[18px]"
        >
          <Label>{HEDGE_CAPTION[hedge.kind]}</Label>
          <p className="m-0 mt-[9px] max-w-[558px] font-display text-[17px] leading-[1.6] text-ink">
            {hedge.text}
          </p>
        </aside>
      ))}
    </div>
  );
}

export default ContributionsList;
