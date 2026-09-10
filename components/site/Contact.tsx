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
 */
export function Contact({ number = "05" }: { number?: string }) {
  return (
    <Section
      id="contact"
      className="grid grid-cols-[1fr_260px] items-center gap-[50px] bg-accent-pink max-[740px]:block"
    >
      <div>
        <Label className="text-ink!">{number} / contact</Label>
        <h2 className="mb-6 mt-3 font-display text-[58px] leading-[0.9] tracking-[-0.07em] max-[740px]:text-[49px]">
          Have a good problem?
        </h2>
        <p className="mb-6 max-w-[470px] text-[18px] max-[740px]:text-base">
          Internships, systems work, or a build that needs taking apart — mail
          reaches me faster than anything else.
        </p>
        <Btn href={`mailto:${EMAIL}`}>
          Send me a note <span aria-hidden="true">&rarr;</span>
        </Btn>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.08em] text-ink">
          {EMAIL}
        </p>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- next/image
          drops basePath under images.unoptimized; see the note above. */}
      <img
        src={`${basePath}/assets/raccoon/raccoon-lantern.svg`}
        alt="Line drawing of a raccoon holding up a lantern"
        width={340}
        height={400}
        className="h-[250px] w-full border-2 border-line bg-paper object-contain p-2 max-[740px]:mt-6"
      />
    </Section>
  );
}

export default Contact;
