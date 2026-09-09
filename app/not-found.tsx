import type { Metadata } from "next";
import { ScatterMark } from "@/components/nature/ScatterMark";
import { Specimen } from "@/components/nature/Specimen";
import { SpecimenTag } from "@/components/nature/SpecimenTag";
import { TapeStrip } from "@/components/nature/TapeStrip";
import { TrackTrail } from "@/components/nature/TrackTrail";
import { MaskEyes } from "@/components/raccoon/MaskEyes";
import { Btn } from "@/components/ui/Btn";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";

/*
 * Internal hrefs are written by hand rather than through `next/link` because
 * `Btn` renders a plain anchor, and a plain anchor does not pick up
 * `basePath`. `trailingSlash` is on, so the paths carry their slash. The
 * illustration is a hand-written asset path for the same reason: see the note
 * in app/notes/page.tsx.
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
            Three places that do exist
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
          {/* eslint-disable-next-line @next/next/no-img-element -- see BASE_PATH note above */}
          <img
            src={`${BASE_PATH}/assets/raccoon/raccoon-peek.svg`}
            alt="Ink line drawing of a raccoon peeking over an edge with both paws on the rim"
            width={340}
            height={260}
            className="mx-auto block h-auto w-full max-w-[300px]"
          />
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
            <MaskEyes className="h-auto w-[92px] shrink-0 text-night-line" />
            <p className="m-0 max-w-[62ch] font-display text-[17px] leading-[1.6]">
              The drawer this address names is empty. The three above are not.
            </p>
          </div>
          <TrackTrail
            steps={6}
            direction="left"
            className="h-auto w-[210px] shrink-0 text-night-line"
          />
        </div>
      </Section>
    </main>
  );
}
