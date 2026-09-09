import type { Metadata } from "next";
import { Btn } from "@/components/ui/Btn";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";

/*
 * Internal hrefs are written by hand rather than through `next/link` because
 * `Btn` renders a plain anchor, and a plain anchor does not pick up
 * `basePath`. `trailingSlash` is on, so the paths carry their slash.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const WAYS_OUT = [
  {
    href: "/",
    label: "Home",
    gloss: "the front page, and the shortest description of what I build",
  },
  {
    href: "/work/",
    label: "Work",
    gloss: "the projects, each with its timeline and its open follow-ups",
  },
  {
    href: "/notes/",
    label: "Notes",
    gloss: "three pieces of writing, printed in full",
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
      <Section className="grid grid-cols-[1.1fr_0.9fr] items-center gap-[56px] border-b-0! max-[740px]:block">
        <div>
          <Label>error / 404</Label>
          <h1 className="m-0 mt-[18px] font-display text-[58px] leading-[0.94] tracking-[-0.065em] max-[740px]:text-[42px]">
            Nothing is filed at this address
          </h1>
          <p className="mb-0 mt-[24px] max-w-[56ch] font-display text-[18px] leading-[1.65]">
            The page you asked for does not exist. Either the address was
            mistyped, or it pointed at something that has since been renamed —
            this site gets rebuilt often enough for the second to happen. There
            is nothing wrong at your end and nothing to retry.
          </p>

          <h2 className="m-0 mt-[40px] font-display text-[26px] tracking-[-0.03em]">
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
              </li>
            ))}
          </ul>
          <p className="mb-0 mt-[22px] font-mono text-[11px] uppercase leading-[1.7] text-muted">
            The navigation at the top of the page reaches every section of the
            site.
          </p>
        </div>

        <figure className="relative m-0 border-2 border-line bg-accent-pink px-8 pb-0 pt-10 text-ink max-[740px]:mt-[34px]">
          {/* eslint-disable-next-line @next/next/no-img-element -- see BASE_PATH note above */}
          <img
            src={`${BASE_PATH}/assets/raccoon/raccoon-peek.svg`}
            alt="Ink line drawing of a raccoon peeking over an edge with both paws on the rim"
            width={340}
            height={260}
            className="mx-auto block h-auto w-full max-w-[300px]"
          />
          <figcaption className="border-t-2 border-line py-[14px] text-center font-mono text-[11px] uppercase text-ink">
            Specimen not in the notebook
          </figcaption>
        </figure>
      </Section>
    </main>
  );
}
