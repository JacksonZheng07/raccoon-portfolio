import type { Metadata } from "next";
import { Frame } from "@/components/ui/Frame";
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

const FOOTER_LINKS = [
  { href: AUTHOR_GITHUB, label: "github" },
  { href: `mailto:${AUTHOR_EMAIL}`, label: "email" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:border-2 focus:border-line focus:bg-paper focus:px-4 focus:py-2 focus:font-mono focus:text-[12px] focus:uppercase focus:tracking-[0.1em] focus:text-ink focus:no-underline"
        >
          Skip to content
        </a>
        <Frame>
          <TopNav />
          {/*
            The skip link needs a focusable target, and `main` is rendered by
            each page rather than here, so the landmark keeps its own element
            and this wrapper only carries the id.
          */}
          <div id="content" tabIndex={-1}>
            {children}
          </div>
          <footer className="flex justify-between border-t-2 border-line px-[65px] py-[22px] font-mono text-[11px] uppercase max-[740px]:block max-[740px]:px-[23px] max-[740px]:py-5">
            <span className="max-[740px]:my-1 max-[740px]:block">
              © 2026 Jackson Zheng
            </span>
            <span className="max-[740px]:my-1 max-[740px]:block">
              {FOOTER_LINKS.map((link, index) => (
                <span key={link.href}>
                  {index > 0 ? <span aria-hidden="true"> · </span> : null}
                  <a
                    href={link.href}
                    className="text-ink underline decoration-1 underline-offset-2"
                  >
                    {link.label}
                  </a>
                </span>
              ))}
            </span>
          </footer>
        </Frame>
      </body>
    </html>
  );
}
