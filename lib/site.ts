/*
 * Canonical site identity. Everything that has to print an absolute URL --
 * metadata, the sitemap, robots.txt, the JSON-LD graph -- reads it from here.
 *
 * `SITE_URL` carries the deploy subpath itself, because the GitHub Pages
 * project site lives at /raccoon-portfolio. It is therefore the whole origin
 * plus prefix, and `basePath` must not be added on top of it a second time.
 * A move to an apex domain is a one-variable change: set
 * NEXT_PUBLIC_SITE_URL=https://example.com and drop BASE_PATH from the deploy
 * workflow.
 */
const DEFAULT_SITE_URL = "https://jacksonzheng07.github.io/raccoon-portfolio";

/** Origin plus any deploy subpath, with no trailing slash. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
).replace(/\/+$/, "");

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
