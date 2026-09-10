import type { Metadata } from "next";
import { DebrisTrail } from "@/components/detective/DebrisTrail";
import { Investigator } from "@/components/detective/Investigator";
import { TrashCan } from "@/components/detective/TrashCan";
import { ScatterMark } from "@/components/nature/ScatterMark";
import { Specimen } from "@/components/nature/Specimen";
import { SpecimenTag } from "@/components/nature/SpecimenTag";
import { TapeStrip } from "@/components/nature/TapeStrip";
import { Btn } from "@/components/ui/Btn";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";

/*
 * Internal hrefs are written by hand rather than through `next/link` because
 * `Btn` renders a plain anchor, and a plain anchor does not pick up
 * `basePath`. `trailingSlash` is on, so the paths carry their slash. The
 * artwork needs none of this: it is inline JSX, so it inherits `currentColor`
 * and never resolves a URL.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const WAYS_OUT = [
  {
    href: "/",
    label: "Home",
    gloss: "the front page, and the shortest description of what I build",
    specimen: "pine-tree",
  },
  {
    href: "/work/",
    label: "Work",
    gloss: "the projects, each with its timeline and its open follow-ups",
    specimen: "acorn",
  },
  {
    href: "/notes/",
    label: "Notes",
    gloss: "three pieces of writing, printed in full",
    specimen: "maple-leaf",
  },
] as const;

/*
 * The case notes on this address, printed as the investigator would leave
 * them: what was in the bin, whose prints are on it, what came out. Written
 * as rows of plain elements rather than a list, because the three exits above
 * are the page's list and a second one would compete with it.
 */
const FIELD_REPORT = [
  { of: "the bin", found: "already turned out" },
  { of: "the prints", found: "its own, heading back out" },
  { of: "the haul", found: "one apple core, no page" },
] as const;

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "Nothing is filed at this address. The navigation reaches every section of the site, and the home, work and notes pages all still exist.",
  // Next already emits `noindex` for the not-found route; the canonical is
  // dropped so a 404 does not claim to be the home page.
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <main>
      <Section
        tone="paper"
        ruled
        density="loose"
        className="grid grid-cols-[1.1fr_0.9fr] items-center gap-[56px] max-[740px]:block"
      >
        <div>
          <Label>error / 404</Label>
          <h1 className="m-0 mt-[18px] font-display text-display-1">
            Nothing is filed at this address
          </h1>
          <p className="mb-0 mt-[26px] max-w-[56ch] font-display text-[18px] leading-[28px] text-pretty">
            The page you asked for does not exist. Either the address was
            mistyped, or it pointed at something that has since been renamed —
            this site gets rebuilt often enough for the second to happen. There
            is nothing wrong at your end and nothing to retry.
          </p>

          <h2 className="m-0 mt-[40px] font-display text-display-3">
            Three drawers that are not empty
          </h2>
          <ul className="m-0 mt-[20px] list-none border-t-2 border-line p-0">
            {WAYS_OUT.map((way) => (
              <li
                key={way.href}
                className="flex items-center gap-5 border-b-2 border-line py-[18px] max-[740px]:block"
              >
                <Btn
                  href={`${BASE_PATH}${way.href}`}
                  className="w-[124px] shrink-0 text-center"
                >
                  {way.label}
                </Btn>
                <span className="max-w-[46ch] text-muted max-[740px]:mt-3 max-[740px]:block">
                  {way.gloss}
                </span>
                {/*
                 * One specimen per exit, so the list reads as three drawers in
                 * the notebook rather than three buttons. Decorative, and the
                 * first thing to go when the row runs out of width.
                 */}
                <Specimen
                  name={way.specimen}
                  className="ml-auto h-[42px] w-auto shrink-0 text-ringtail max-[900px]:hidden"
                />
              </li>
            ))}
          </ul>
          <p className="mb-0 mt-[22px] font-mono text-specimen uppercase leading-[1.7] text-muted">
            The navigation at the top of the page reaches every section of the
            site.
          </p>
        </div>

        <figure className="relative m-0 border-2 border-line bg-accent-pink px-8 pb-0 pt-10 text-ink max-[740px]:mt-[40px]">
          <TapeStrip
            tilt="right"
            className="absolute -top-[13px] right-[13%] h-auto w-[104px] text-mask"
          />
          {/* A pin in the corner: this sheet is in the notebook even if the page is not. */}
          <ScatterMark
            mark="push-pin"
            corner="top-left"
            className="h-[30px] w-[22px] text-mask"
          />
          {/*
           * Somebody got here first. The bin is on its side with its mouth to
           * the left, the raccoon is flat on the floor with the glass on what
           * fell out, and the spill runs along under both of them. One scene,
           * laid out in flow: the row sets the ground line, and the debris
           * sits below it rather than on top of either drawing.
           */}
          <div className="flex items-end justify-center gap-2">
            <TrashCan
              name="trash-can-tipped"
              className="h-[124px] w-auto shrink-0 text-line max-[900px]:h-[104px]"
            />
            {/*
             * The pose is drawn lying down in a portrait box, so the top
             * third of its viewBox is empty sky. Left alone at this size that
             * empty third is 70-odd pixels of blank pink above the animal and
             * the plate reads as a mistake, so the box is clipped to the ink
             * and the drawing is scaled up to fill what is left.
             */}
            <span className="block h-[150px] shrink-0 overflow-hidden max-[900px]:h-[126px]">
              <Investigator
                name="raccoon-magnifier-ground"
                label="Ink line drawing of a raccoon lying flat on the ground, holding a magnifying glass over what spilled out of a tipped-over bin"
                className="-mt-[73px] h-[226px] w-auto text-ink max-[900px]:-mt-[61px] max-[900px]:h-[190px]"
              />
            </span>
          </div>
          <DebrisTrail
            count={5}
            direction="right"
            className="mx-auto mt-1 h-[38px] w-[214px] text-mask"
          />

          <div className="mt-7 border-t-2 border-line pt-3 font-mono text-specimen uppercase">
            <p className="m-0 font-bold text-muted-strong">
              field report / this address
            </p>
            {FIELD_REPORT.map((row) => (
              <div
                key={row.of}
                className="flex items-baseline justify-between gap-4 border-b border-line py-[7px] last:border-b-0"
              >
                <span>{row.of}</span>
                <span className="text-muted-strong">{row.found}</span>
              </div>
            ))}
          </div>
          <figcaption className="flex items-center justify-between gap-4 border-t-2 border-line py-[14px] font-mono text-specimen uppercase text-ink">
            Specimen not in the notebook
            {/*
             * The tag's own text class is `text-muted`, which measures 4.21:1
             * on accent pink and misses AA. `muted-strong` is 5.21:1 on the
             * same surface, and the child selector outweighs the component's
             * single class.
             */}
            <SpecimenTag className="h-[66px] w-[47px] shrink-0 text-mask [&>span]:text-muted-strong">
              404
            </SpecimenTag>
          </figcaption>
        </figure>
      </Section>

      <Section tone="night" density="tight">
        <div className="flex items-center justify-between gap-8 max-[740px]:flex-col max-[740px]:items-start max-[740px]:gap-6">
          <div className="flex items-center gap-5">
            {/* Wearing the lid. It has been in there. */}
            <TrashCan
              name="trash-can-lid-hat"
              className="h-[104px] w-auto shrink-0 text-night-line"
            />
            <p className="m-0 max-w-[62ch] font-display text-[17px] leading-[1.6]">
              The drawer this address names is empty. The three above are not.
            </p>
          </div>
          {/* What it left behind, rather than where it walked. */}
          <DebrisTrail
            count={6}
            direction="left"
            className="h-[52px] w-[232px] shrink-0 text-night-line"
          />
        </div>
      </Section>
    </main>
  );
}
