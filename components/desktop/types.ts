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
> & {
  /** A deployed build that allows framing, from content/demos.json. */
  demo?: string;
  /** Weekly commits for the past year and the last push, from content/github.json. */
  activity?: { weeks: number[]; pushedAt: string } | "private";
};

export type DesktopData = {
  projects: DesktopProject[];
  notes: Note[];
  sync: SyncRecord;
};

export type AppId = "finder" | "browser" | "notes" | "about" | "update" | "github" | "mail" | "messages" | "terminal" | "timeline" | "vault" | "trash";
/** A project window is keyed by its slug. */
export type WindowId = AppId | `project:${string}`;
