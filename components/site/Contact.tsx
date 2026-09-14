import { TrackTrail } from "@/components/nature/TrackTrail";
import { Btn } from "@/components/ui/Btn";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";

const EMAIL = "jacksonzheng425@gmail.com";

// next/image is not usable for assets here: with `images: { unoptimized: true }`
// generateImgAttrs returns the src verbatim and never applies basePath, so the
// URL has to carry the deploy subpath itself.
/**
 * The pink closing band. Nav and footer both point at `/#contact`, so the id
 * is part of the contract.
 *
 * `tone="raised"` rather than a `bg-plate` utility: the tone re-resolves
 * `text-muted` to `--color-muted-strong`, which is 5.21:1 on pink where plain
 * muted measured 4.21:1 and failed AA. It also brings the paper grain, so the
 * closing band is the same stock as the rest of the page.
 */
/*
 * The copy is passed in rather than read from a page file here: this is a
 * shared band, and a component that reached into content/pages/home.txt
 * itself could only ever be used on the home page.
 */
type ContactProps = {
  number?: string;
  heading: string;
  body: string;
  cta: string;
};

export function Contact({ number = "05", heading, body, cta }: ContactProps) {
  return (
    <Section
      id="contact"
      tone="raised"
      className="relative"
    >
      <div className="reveal">
        <Label>{number} / contact</Label>
        <h2 className="mb-6 mt-3 font-display text-[58px] leading-[0.9] tracking-[-0.07em] max-[740px]:text-[42px]">
          {heading}
        </h2>
        <p className="mb-7 max-w-[470px] text-[18px] max-[740px]:text-base">
          {body}
        </p>
        <div className="flex items-center gap-5">
          <Btn href={`mailto:${EMAIL}`}>
            {cta} <span aria-hidden="true">&rarr;</span>
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
    </Section>
  );
}

export default Contact;
