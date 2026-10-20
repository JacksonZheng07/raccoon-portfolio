import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getSyncRecord } from "@/lib/sync";

export const dynamic = "force-static";

// One page: every project and note opens as a window on it.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: getSyncRecord().syncedAt,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
