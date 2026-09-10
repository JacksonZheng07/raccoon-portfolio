import { ScatterMark } from "@/components/nature/ScatterMark";
import { Label } from "@/components/ui/Label";
import type { Hedge } from "./case-study-data";

const HEDGE_CAPTION: Record<Hedge["kind"], string> = {
  Inference: "inference / not verified",
  Fact: "fact / stated in the source",
};

/*
 * The two hedges are not the same claim and must not look the same. An
 * inference sits on plain cream stock; a fact stated by the source sits on
 * the blue the site uses for things it is sure of. Both plates are pinned,
 * because both are notes laid over the page rather than part of the list.
 *
 * Cream rather than shell because the band under them is already shell:
 * muted-strong on paper is 7.29:1, on blue 5.78:1, and ink clears 11:1 on
 * both.
 */
const HEDGE_TONE: Record<Hedge["kind"], string> = {
  Inference: "bg-paper",
  Fact: "bg-accent-blue",
};

/**
 * What Jackson did, plus the source's own epistemic hedges.
 *
 * The `Inference:` and `Fact:` lines arrive inside `contributions`, but they
 * are notes about how much the list can be trusted, not more of the list. They
 * are printed under the rule, pinned and captioned, so a reader can see
 * exactly where the claim stops being verified.
 */
export function ContributionsList({
  bullets,
  hedges,
}: {
  bullets: readonly string[];
  hedges: readonly Hedge[];
}) {
  return (
    <div>
      <ul className="m-0 grid list-none grid-cols-2 gap-x-[44px] border-t border-ringtail p-0 max-[740px]:block">
        {bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex gap-3 border-b border-ringtail py-[12px]"
          >
            <span aria-hidden="true" className="font-mono text-muted">
              &mdash;
            </span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      {hedges.length > 0 ? (
        <div className="mt-[38px] grid gap-6 grid-cols-2 max-[740px]:block">
          {hedges.map((hedge) => (
            <aside
              key={hedge.text}
              className={`relative border-2 border-line px-[24px] py-[22px] max-[740px]:mb-5 ${
                HEDGE_TONE[hedge.kind]
              }`}
            >
              <ScatterMark
                mark="push-pin"
                corner="top-left"
                className="w-[30px] text-line"
              />
              <Label className="text-muted-strong!">
                {HEDGE_CAPTION[hedge.kind]}
              </Label>
              <p className="m-0 mt-[10px] font-display text-[18px] leading-[1.55] text-ink">
                {hedge.text}
              </p>
            </aside>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ContributionsList;
