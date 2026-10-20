import type { Note } from "@/lib/notes";
import type { IconKind } from "./icons";
import type { DesktopProject, WindowId } from "./types";

/*
 * The one file tree Finder and Terminal both browse. Folders hold folders and
 * files; a file carries the action that opening it performs.
 */
export type FsAction =
  | { type: "window"; id: WindowId }
  | { type: "repo"; repo: string }
  | { type: "url"; url: string }
  | { type: "note"; slug: string };

export type FsNode = {
  name: string;
  icon: IconKind;
  kind: string;
  date?: string;
  children?: FsNode[];
  action?: FsAction;
};

export type AppEntry = { id: WindowId; name: string; icon: IconKind };

const latest = (dates: string[]) => dates.reduce((a, b) => (b > a ? b : a), "");

function projectFolder(p: DesktopProject): FsNode {
  const files: FsNode[] = [
    { name: "README.md", icon: "doc", kind: "Markdown document", date: p.end, action: { type: "window", id: `project:${p.slug}` } },
    { name: "Source Code", icon: "github", kind: "Alias", date: p.end, action: { type: "repo", repo: p.repo.replace("https://github.com/", "") } },
  ];
  if (p.demo) files.push({ name: "Live App", icon: "browser", kind: "Web link", date: p.end, action: { type: "url", url: p.demo } });
  return { name: p.name, icon: "folder", kind: "Folder", date: p.end, children: files };
}

export function buildTree(projects: DesktopProject[], notes: Note[], apps: AppEntry[]): FsNode {
  const domains = [...new Set(projects.map((p) => p.domain))];
  const projectsFolder: FsNode = {
    name: "Projects",
    icon: "folder",
    kind: "Folder",
    date: latest(projects.map((p) => p.end)),
    children: domains.map((d) => {
      const inDomain = projects.filter((p) => p.domain === d);
      return { name: d, icon: "folder", kind: "Folder", date: latest(inDomain.map((p) => p.end)), children: inDomain.map(projectFolder) };
    }),
  };
  const notesFolder: FsNode = {
    name: "Notes",
    icon: "folder",
    kind: "Folder",
    date: latest(notes.map((n) => n.date)),
    children: notes.map((n) => ({
      name: `${n.number} ${n.title}.md`,
      icon: "notes",
      kind: "Markdown document",
      date: n.date,
      action: { type: "note", slug: n.slug },
    })),
  };
  const applications: FsNode = {
    name: "Applications",
    icon: "folder",
    kind: "Folder",
    children: apps.map((a) => ({ name: `${a.name}.app`, icon: a.icon, kind: "Application", action: { type: "window", id: a.id } })),
  };
  return {
    name: "jackson",
    icon: "folder",
    kind: "Folder",
    children: [
      applications,
      notesFolder,
      projectsFolder,
      { name: "README.md", icon: "doc", kind: "Markdown document", action: { type: "window", id: "about" } },
      { name: "Resume.timeline", icon: "timeline", kind: "Timeline", action: { type: "window", id: "timeline" } },
      { name: "Class Notes", icon: "vault", kind: "Encrypted vault", action: { type: "window", id: "vault" } },
    ],
  };
}

/** The node at `path` (folder names from the root), or undefined. */
export function resolve(root: FsNode, path: readonly string[]): FsNode | undefined {
  let node: FsNode | undefined = root;
  for (const name of path) node = node?.children?.find((c) => c.name.toLowerCase() === name.toLowerCase());
  return node;
}

/** Every node under the root, with its path, for search and tag views. */
export function walk(root: FsNode, path: string[] = []): { node: FsNode; path: string[] }[] {
  return (root.children ?? []).flatMap((child) => [
    { node: child, path: [...path, child.name] },
    ...walk(child, [...path, child.name]),
  ]);
}

/** Shell-style path resolution: `..`, `~`, absolute and relative, trailing slashes. */
export function cd(cwd: readonly string[], target: string): string[] {
  if (!target || target === "~") return [];
  const parts = target.replace(/\/+$/, "").split("/");
  let next = target.startsWith("~") || target.startsWith("/") ? [] : [...cwd];
  for (const part of parts) {
    if (part === "" || part === "~" || part === ".") continue;
    if (part === "..") next = next.slice(0, -1);
    else next.push(part);
  }
  return next;
}
