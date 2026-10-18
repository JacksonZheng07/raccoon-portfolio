import type { Note } from "@/lib/notes";
import type { Project } from "@/lib/projects";
import type { SyncRecord } from "@/lib/sync";

/*
 * What ships to the browser. Resume bullets, talking points, the Notion URL
 * and the internal status are interview prep, not site copy, so they stay
 * on the server.
 */
export type DesktopProject = Omit<
  Project,
  "resumeBullets" | "talkingPoints" | "notionUrl" | "status" | "evidence"
>;

export type DesktopData = {
  projects: DesktopProject[];
  notes: Note[];
  sync: SyncRecord;
};

export type AppId = "finder" | "browser" | "notes" | "about" | "update" | "github" | "mail" | "trash";
/** A project window is keyed by its slug. */
export type WindowId = AppId | `project:${string}`;
