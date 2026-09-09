import type { MetadataRoute } from "next";
import { getAllNotes } from "@/lib/notes";
import { getProjectSlugs, getAllProjects } from "@/lib/projects";
import { absoluteUrl } from "@/lib/site";

/*
 * `output: "export"` needs every route to be statically resolvable, and a
 * sitemap is a route. Without `force-static` the build fails the same way a
 * route handler does. With it, `out/sitemap.xml` is written at build time.
 */
export const dynamic = "force-static";

/**
 * The newest end date across all projects, used as the home page's
 * lastModified: the home page changes when the work does.
 */
function newestProjectEnd(): string {
  const ends = getAllProjects().map((project) => project.end);
  return ends.reduce((latest, end) => (end > latest ? end : latest), ends[0] ?? "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const notes = getAllNotes();
  const notesUpdated = notes.reduce(
    (latest, note) => (note.date > latest ? note.date : latest),
    notes[0]?.date ?? "",
  );

  return [
    {
      url: absoluteUrl("/"),
      lastModified: newestProjectEnd(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/work/"),
      lastModified: newestProjectEnd(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Only Flagship and Strong projects get a case-study route, which is what
    // `getProjectSlugs` returns, so the sitemap cannot list a page that
    // `generateStaticParams` will not build.
    ...getProjectSlugs().map((slug) => ({
      url: absoluteUrl(`/work/${slug}/`),
      lastModified: newestProjectEnd(),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    {
      url: absoluteUrl("/notes/"),
      lastModified: notesUpdated,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
