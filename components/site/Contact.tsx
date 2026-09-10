import { Specimen } from "@/components/nature/Specimen";
import { TapeStrip } from "@/components/nature/TapeStrip";
import { TrackTrail } from "@/components/nature/TrackTrail";
import { Btn } from "@/components/ui/Btn";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";

const EMAIL = "jacksonzheng425@gmail.com";

// next/image is not usable for assets here: with `images: { unoptimized: true }`
// generateImgAttrs returns the src verbatim and never applies basePath, so the
// URL has to carry the deploy subpath itself.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * The pink closing band. Nav and footer both point at `/#contact`, so the id
 * is part of the contract.
 *
 * `tone="pink"` rather than a `bg-accent-pink` utility: the tone re-resolves
 * `text-muted` to `--color-muted-strong`, which is 5.21:1 on pink where plain
 * muted measured 4.21:1 and failed AA. It also brings the paper grain, so the
 * closing band is the same stock as the rest of the page.
 */
export function Contact({ number = "05" }: { number?: string }) {
  return (
    <Section
      id="contact"
      tone="pink"
      className="relative grid grid-cols-[1fr_260px] items-center gap-[50px] max-[740px]:block"
    >
      <div className="reveal">
        <Label>{number} / contact</Label>
        <h2 className="mb-6 mt-3 font-display text-[58px] leading-[0.9] tracking-[-0.07em] max-[740px]:text-[42px]">
          Have a good problem?
        </h2>
        <p className="mb-7 max-w-[470px] text-[18px] max-[740px]:text-base">
          Internships, systems work, or a build that needs taking apart — mail
          reaches me faster than anything else.
        </p>
        <div className="flex items-center gap-5">
          <Btn href={`mailto:${EMAIL}`}>
            Send me a note <span aria-hidden="true">&rarr;</span>
          </Btn>
          {/* Something walked over to the letterbox. */}
          <TrackTrail
            steps={5}
            className="h-[38px] w-[112px] text-line max-[740px]:hidden"
          />
        </div>
        <p className="mt-4 font-mono text-specimen uppercase text-ink">
          {EMAIL}
        </p>
      </div>
      <div className="relative max-[740px]:mt-8">
        {/* eslint-disable-next-line @next/next/no-img-element -- next/image
            drops basePath under images.unoptimized; see the note above. */}
        <img
          src={`${basePath}/assets/raccoon/raccoon-lantern.svg`}
          alt="Line drawing of a raccoon holding up a lantern"
          width={340}
          height={400}
          className="h-[250px] w-full border-2 border-line bg-paper object-contain p-2"
        />
        <TapeStrip
          tilt="right"
          className="absolute -top-[12px] left-1/2 h-[26px] w-[72px] -translate-x-1/2 text-line"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[26px] -left-[24px] block h-[44px] w-[44px] text-ringtail max-[740px]:hidden"
        >
          <Specimen name="maple-leaf" className="h-full w-full" />
        </span>
      </div>
    </Section>
  );
}

export default Contact;
