import { readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { Project } from "./projects";

/*
 * The record `npm run sync:notion` leaves behind: when Notion was last pulled
 * and which projects that pull changed. The Software Update window reads it.
 */
export const SYNC_FILE = path.join(process.cwd(), "content", "sync.json");

const changeSchema = z.strictObject({
  slug: z.string().min(1),
  name: z.string().min(1),
  kind: z.enum(["new", "updated"]),
});

const syncSchema = z.strictObject({
  syncedAt: z.iso.datetime({ offset: true }),
  changes: z.array(changeSchema),
});

export type SyncChange = z.infer<typeof changeSchema>;
export type SyncRecord = z.infer<typeof syncSchema>;

export function serializeProject(project: Project): string {
  return `${JSON.stringify(project, null, 2)}\n`;
}

/** `committed` maps slug to the file text on disk before the pull. */
export function diffProjects(
  committed: ReadonlyMap<string, string>,
  pulled: readonly Project[],
): SyncChange[] {
  const changes: SyncChange[] = [];
  for (const project of pulled) {
    const before = committed.get(project.slug);
    if (before === serializeProject(project)) continue;
    changes.push({
      slug: project.slug,
      name: project.name,
      kind: before === undefined ? "new" : "updated",
    });
  }
  return changes;
}

export function getSyncRecord(): SyncRecord {
  return syncSchema.parse(JSON.parse(readFileSync(SYNC_FILE, "utf8")));
}
