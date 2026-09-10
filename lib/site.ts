/*
 * Canonical site identity. Everything that has to print an absolute URL --
 * metadata, the sitemap, robots.txt, the JSON-LD graph -- reads it from here.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL      an explicit custom domain, always wins
 *   2. VERCEL_PROJECT_PRODUCTION_URL  the stable production host on Vercel
 *   3. VERCEL_URL                this specific deployment, so preview builds
 *                                describe themselves instead of production
 *   4. the GitHub Pages project site
 *
 * Steps 2 and 3 matter because the Pages default carries a /raccoon-portfolio
 * subpath that does not exist on Vercel: without them every canonical tag,
 * Open Graph URL and sitemap entry on a Vercel deploy would point at a page
 * that 404s.
 *
 * `SITE_URL` is the whole origin plus any deploy subpath, so `basePath` must
 * never be added on top of it a second time.
 */
const PAGES_SITE_URL = "https://jacksonzheng07.github.io/raccoon-portfolio";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelHost) return `https://${vercelHost}`;

  return PAGES_SITE_URL;
}

/** Origin plus any deploy subpath, with no trailing slash. */
export const SITE_URL = resolveSiteUrl().replace(/\/+$/, "");

export const SITE_NAME = "Jackson Zheng — Field Notes";
export const AUTHOR_NAME = "Jackson Zheng";
export const AUTHOR_EMAIL = "jacksonzheng425@gmail.com";
export const AUTHOR_GITHUB = "https://github.com/JacksonZheng07";

/**
 * An absolute URL for a route. `trailingSlash` is on, so route paths are
 * written with their slash and the home route is the bare prefix.
 */
export function absoluteUrl(routePath: string): string {
  if (routePath === "/") return `${SITE_URL}/`;
  const withLeadingSlash = routePath.startsWith("/")
    ? routePath
    : `/${routePath}`;
  return `${SITE_URL}${withLeadingSlash}`;
}

/**
 * The Open Graph card. A route handler rather than the `opengraph-image`
 * file convention: under `output: "export"` the convention emits an
 * extension-less `out/opengraph-image`, which GitHub Pages serves as
 * application/octet-stream. `app/og.png/route.tsx` emits a real `out/og.png`.
 */
export const OG_IMAGE = {
  url: `${SITE_URL}/og.png`,
  width: 1200,
  height: 630,
  alt: "Field Notes — Jackson Zheng, CS and Math at Northeastern",
} as const;
