import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/* See the note in app/sitemap.ts: a robots route needs this under export. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
