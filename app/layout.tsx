import type { Metadata } from "next";
import { ScrollPaws } from "@/components/site/ScrollPaws";
import { Frame } from "@/components/ui/Frame";
import { Label } from "@/components/ui/Label";
import { NAV_ITEMS } from "@/components/ui/nav-items";
import { TopNav } from "@/components/ui/TopNav";
import {
  AUTHOR_EMAIL,
  AUTHOR_GITHUB,
  AUTHOR_NAME,
  OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from "@/lib/site";
import "./globals.css";

const SITE_DESCRIPTION =
  "The field notebook of Jackson Zheng, a CS and Math student at Northeastern: ten builds — a language runtime written from the tokenizer up, a recovery tracker, a flight-emissions comparison — each written up while the decisions were still fresh.";

export const metadata: Metadata = {
  /*
   * `SITE_URL` already contains the deploy subpath (see lib/site.ts), so every
   * canonical and card URL below is built from it rather than from `basePath`.
   */
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: SITE_NAME,
    template: `%s — ${AUTHOR_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: AUTHOR_NAME, url: AUTHOR_GITHUB }],
  creator: AUTHOR_NAME,
  alternates: { canonical: absoluteUrl("/") },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: absoluteUrl("/"),
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
  },
};

const ELSEWHERE_LINKS = [
  { href: AUTHOR_GITHUB, label: "github" },
  { href: `mailto:${AUTHOR_EMAIL}`, label: "email" },
];

const FOOTER_LINK_CLASS =
  "link-rule tactile-quiet text-ink hover:text-mask";

/*
 * The colophon states only what the repository can back up: the framework,
 * the two faces the tokens name, and the two things the design spec puts out
 * of scope. Nothing here is a claim about the work.
 */
const COLOPHON =
  "Next.js, exported as static files. Georgia for display, Arial for text, monospace for the specimen labels. No analytics, no dark mode — the paper surface is the identity.";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-30 focus:border-2 focus:border-line focus:bg-paper focus:px-4 focus:py-2 focus:font-mono focus:text-[12px] focus:uppercase focus:tracking-[0.1em] focus:text-ink focus:no-underline"
        >
          Skip to content
        </a>
        <Frame>
          {/*
            The trail down the gutter. Inside the frame rather than fixed to
            the viewport, because the frame is 1260px wide and centred: a
            viewport-fixed rail would sit out on the shell background at any
            width above that. First child so the sticky header, which comes
            next and carries `z-20`, always paints over it.
          */}
          <ScrollPaws />
          <TopNav />
          {/*
            The skip link needs a focusable target, and `main` is rendered by
            each page rather than here, so the landmark keeps its own element
            and this wrapper only carries the id.
          */}
          <div id="content" tabIndex={-1}>
            {children}
          </div>
          {/*
            Back matter rather than a bare rule: a colophon, the index, and
            the two places to reach him, then the copyright line under a
            hairline. The shell tone gives the page a base to end on instead
            of running the paper off the bottom edge, and it is the one
            surface here that is not also a content band.
          */}
          <footer className="tone-shell border-t-2 border-line px-[65px] pb-[26px] pt-[38px] max-[740px]:px-[23px] max-[740px]:pt-[30px]">
            <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-12 max-[740px]:block max-[740px]:gap-0">
              <div className="max-[740px]:mb-8">
                <Label>colophon</Label>
                <p className="m-0 mt-3 max-w-[400px] text-[13px] text-muted">
                  {COLOPHON}
                </p>
              </div>
              <div className="max-[740px]:mb-8">
                <Label>index</Label>
                <ul className="m-0 mt-3 list-none p-0">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href} className="mt-[6px] first:mt-0">
                      <a href={item.href} className={FOOTER_LINK_CLASS}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="max-[740px]:mb-8">
                <Label>elsewhere</Label>
                <ul className="m-0 mt-3 list-none p-0">
                  {ELSEWHERE_LINKS.map((link) => (
                    <li key={link.href} className="mt-[6px] first:mt-0">
                      <a href={link.href} className={FOOTER_LINK_CLASS}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-[34px] flex justify-between border-t border-line pt-[14px] font-mono text-specimen uppercase text-muted max-[740px]:mt-6 max-[740px]:block">
              <span className="max-[740px]:my-1 max-[740px]:block">
                © 2026 Jackson Zheng
              </span>
              <a
                href="#content"
                className="tactile-quiet text-muted no-underline hover:text-ink max-[740px]:my-1 max-[740px]:block"
              >
                Back to top <span aria-hidden="true">&uarr;</span>
              </a>
            </div>
          </footer>
        </Frame>
      </body>
    </html>
  );
}
