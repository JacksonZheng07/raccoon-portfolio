import { expect, type ConsoleMessage, type Page } from "@playwright/test";

/**
 * What the browser complained about while a page was open.
 *
 * `errors` is for genuine script problems. Subresource 404s are recorded
 * separately, by path, because the console only says "Failed to load
 * resource" without naming it -- and because one of them is expected until
 * the `/work` routes land on their own branch.
 */
export type PageWatch = {
  errors: string[];
  notFound: string[];
};

/** Start watching. Must be called before the first navigation. */
export function watchPage(page: Page): PageWatch {
  const watch: PageWatch = { errors: [], notFound: [] };

  page.on("console", (message: ConsoleMessage) => {
    if (message.type() !== "error") return;
    if (/Failed to load resource: the server responded with a status/.test(message.text())) {
      return;
    }
    watch.errors.push(`console.error: ${message.text()}`);
  });
  page.on("pageerror", (error) => {
    watch.errors.push(`pageerror: ${error.message}`);
  });
  page.on("response", (response) => {
    if (response.status() !== 404) return;
    watch.notFound.push(new URL(response.url()).pathname);
  });

  return watch;
}

/**
 * Assert the current path, tolerating the trailing slash the client router
 * drops on a route it has no build manifest entry for.
 */
export async function expectPath(page: Page, expected: string): Promise<void> {
  const normalise = (value: string) =>
    value.endsWith("/") ? value : `${value}/`;

  await expect
    .poll(() => normalise(new URL(page.url()).pathname), { timeout: 5_000 })
    .toBe(normalise(expected));
}

/** Every `img` in the document, with the alt attribute exactly as authored. */
export async function imageAlts(
  page: Page,
): Promise<{ src: string; alt: string | null }[]> {
  return page.$$eval("img", (images) =>
    images.map((image) => ({
      src: image.getAttribute("src") ?? "",
      alt: image.getAttribute("alt"),
    })),
  );
}

/** Heading levels in document order, e.g. [1, 2, 2, 3]. */
export async function headingLevels(page: Page): Promise<number[]> {
  return page.$$eval("h1, h2, h3, h4, h5, h6", (headings) =>
    headings.map((heading) => Number(heading.tagName.slice(1))),
  );
}
