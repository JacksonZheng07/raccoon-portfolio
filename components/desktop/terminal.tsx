"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { Note } from "@/lib/notes";
import { AUTHOR_EMAIL, SITE_NAME } from "@/lib/site";
import { type FsAction, type FsNode, cd, resolve } from "./fs";
import { Glyph } from "./glyphs";
import { AppIcon } from "./icons";
import type { DesktopProject } from "./types";

type Line = { kind: "in" | "out" | "err"; text: string };
type Session = { id: number; cwd: string[]; lines: Line[]; history: string[] };

const USER = "jackson";
const HOST = "jackson-os";

const HELP = `ls [dir]        list a folder
cd <dir>        change folder (.., ~, Projects/Systems …)
open <name>     open a file, folder, app or project
cat <file>      print a README or note
pwd             where you are
tree            the whole home folder
whoami          who built this
neofetch        system summary
contact         how to reach me
clear           clear this tab
history         commands run in this tab`;

let nextId = 1;
const newSession = (): Session => ({
  id: nextId++,
  cwd: [],
  lines: [{ kind: "out", text: `Last login: ${new Date().toString().slice(0, 24)} on ttys00${nextId - 1}` }],
  history: [],
});

const prompt = (cwd: string[]) => `${USER}@${HOST} ${cwd.length ? cwd.at(-1) : "~"} %`;

export function TerminalApp({
  root,
  projects,
  notes,
  version,
  onAction,
}: {
  root: FsNode;
  projects: DesktopProject[];
  notes: Note[];
  version: string;
  onAction: (action: FsAction) => void;
}) {
  const [sessions, setSessions] = useState<Session[]>(() => [newSession()]);
  const [activeId, setActiveId] = useState(sessions[0]!.id);
  const [input, setInput] = useState("");
  const [recall, setRecall] = useState<number | null>(null);
  const screen = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  const session = sessions.find((s) => s.id === activeId) ?? sessions[0]!;
  const patch = (fn: (s: Session) => Session) => setSessions((ss) => ss.map((s) => (s.id === session.id ? fn(s) : s)));

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight });
  }, [session.lines.length, activeId]);

  const label = (cwd: string[]) => `${cwd.length ? cwd.at(-1) : "~"} — -zsh`;

  function tree(node: FsNode, depth = 0): string[] {
    return (node.children ?? []).flatMap((c) => [
      `${"│   ".repeat(depth)}├── ${c.name}${c.children ? "/" : ""}`,
      ...(c.children && depth < 2 ? tree(c, depth + 1) : []),
    ]);
  }

  function run(raw: string, cwd: string[]): { out: Line[]; cwd: string[] } {
    const [command = "", ...args] = raw.trim().split(/\s+/);
    const arg = args.join(" ");
    const target = (p: string) => resolve(root, cd(cwd, p));
    const out = (text: string): Line[] => [{ kind: "out", text }];
    const err = (text: string): Line[] => [{ kind: "err", text }];

    switch (command) {
      case "":
        return { out: [], cwd };
      case "help":
        return { out: out(HELP), cwd };
      case "ls": {
        const node = target(arg);
        if (!node) return { out: err(`ls: ${arg}: No such file or directory`), cwd };
        if (!node.children) return { out: out(node.name), cwd };
        return { out: out(node.children.map((c) => (c.children ? `${c.name}/` : c.name)).join("\n")), cwd };
      }
      case "cd": {
        const next = cd(cwd, arg);
        const node = resolve(root, next);
        if (!node) return { out: err(`cd: no such file or directory: ${arg}`), cwd };
        if (!node.children) return { out: err(`cd: not a directory: ${arg}`), cwd };
        // Store the tree's own spelling, so `cd projects` shows as Projects.
        const canonical: string[] = [];
        let at = root;
        for (const part of next) {
          at = at.children!.find((c) => c.name.toLowerCase() === part.toLowerCase())!;
          canonical.push(at.name);
        }
        return { out: [], cwd: canonical };
      }
      case "pwd":
        return { out: out(`/Users/${USER}${cwd.length ? `/${cwd.join("/")}` : ""}`), cwd };
      case "tree":
        return { out: out(["~", ...tree(resolve(root, cwd) ?? root)].join("\n")), cwd };
      case "open": {
        const node = target(arg) ?? resolve(root, ["Applications", `${arg}.app`]);
        const project = projects.find((p) => p.slug === arg.toLowerCase() || p.name.toLowerCase() === arg.toLowerCase());
        if (node?.action) onAction(node.action);
        else if (project) onAction({ type: "window", id: `project:${project.slug}` });
        else if (node?.children) return { out: out(`Opening ${node.name} in Finder is not supported here yet; try ls ${arg}`), cwd };
        else return { out: err(`The file /Users/${USER}/${[...cwd, arg].join("/")} does not exist.`), cwd };
        return { out: [], cwd };
      }
      case "cat": {
        const node = target(arg);
        const project = node?.action?.type === "window" && node.action.id.startsWith("project:")
          ? projects.find((p) => node.action?.type === "window" && p.slug === node.action.id.slice(8))
          : undefined;
        const note = node?.action?.type === "note" ? notes.find((n) => node.action?.type === "note" && n.slug === node.action.slug) : undefined;
        if (project) return { out: out(`# ${project.name}\n\n${project.tagline}\n\n${project.overview}`), cwd };
        if (note) return { out: out(`# ${note.title}\n\n${note.body.join("\n\n")}`), cwd };
        if (node?.name === "README.md") return { out: out(`# ${SITE_NAME}\n\nJackson Zheng, CS + Math at Northeastern.\nTry: cd Projects/Systems && ls`), cwd };
        if (node?.children) return { out: err(`cat: ${arg}: Is a directory`), cwd };
        return { out: err(`cat: ${arg || "(nothing)"}: No such file or directory`), cwd };
      }
      case "whoami":
        return { out: out("Jackson Zheng, CS + Math at Northeastern. Builds language runtimes and internal tooling."), cwd };
      case "neofetch":
        return {
          out: out(
            [
              `${USER}@${HOST}`,
              `-------------------`,
              `OS        ${SITE_NAME} ${version}`,
              `Host      Northeastern University`,
              `Shell     zsh (in the browser)`,
              `Projects  ${projects.length}`,
              `Notes     ${notes.length}`,
            ].join("\n"),
          ),
          cwd,
        };
      case "contact":
        return { out: out(`Email: ${AUTHOR_EMAIL}\nOr: open Messages`), cwd };
      case "date":
        return { out: out(new Date().toString()), cwd };
      case "echo":
        return { out: out(arg), cwd };
      case "history":
        return { out: out(session.history.map((h, i) => `${String(i + 1).padStart(5)}  ${h}`).join("\n")), cwd };
      case "sudo":
        return { out: err(`${USER} is not in the sudoers file. This incident will be reported.`), cwd };
      default:
        return { out: err(`zsh: command not found: ${command}`), cwd };
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const command = input;
    setInput("");
    setRecall(null);
    if (command.trim() === "clear") {
      patch((s) => ({ ...s, lines: [], history: [...s.history, command] }));
      return;
    }
    // `&&` chains run left to right; cwd carries through, as in zsh.
    let cwd = session.cwd;
    const lines: Line[] = [{ kind: "in", text: `${prompt(cwd)} ${command}` }];
    for (const part of command.split("&&")) {
      const result = run(part, cwd);
      lines.push(...result.out);
      cwd = result.cwd;
      if (result.out.some((l) => l.kind === "err")) break;
    }
    patch((s) => ({ ...s, cwd, lines: [...s.lines, ...lines], history: command.trim() ? [...s.history, command] : s.history }));
  }

  // Up and down walk back through earlier commands.
  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    const { history } = session;
    if (history.length === 0) return;
    const from = recall ?? history.length;
    const next = e.key === "ArrowUp" ? Math.max(0, from - 1) : Math.min(history.length, from + 1);
    setRecall(next === history.length ? null : next);
    setInput(history[next] ?? "");
  }

  function addTab() {
    const s = newSession();
    setSessions((ss) => [...ss, s]);
    setActiveId(s.id);
    setInput("");
    field.current?.focus();
  }

  function closeTab(id: number) {
    const rest = sessions.filter((s) => s.id !== id);
    if (rest.length === 0) return;
    setSessions(rest);
    if (id === activeId) setActiveId(rest.at(-1)!.id);
  }

  return (
    <div className="term">
      <div className="term-title" aria-hidden="true">
        <AppIcon kind="folder" />
        {USER} — -zsh — 80×24
      </div>
      {sessions.length > 1 && (
        <div className="term-tabs" role="tablist" aria-label="Terminal tabs">
          {sessions.map((s) => (
            <div key={s.id} className="term-tab" data-active={s.id === session.id}>
              <button type="button" className="icon-button term-tab-close" aria-label={`Close ${label(s.cwd)}`} onClick={() => closeTab(s.id)}>
                <Glyph name="close" />
              </button>
              <button type="button" role="tab" aria-selected={s.id === session.id} onClick={() => setActiveId(s.id)}>
                {label(s.cwd)}
              </button>
            </div>
          ))}
          <button type="button" className="icon-button term-new" aria-label="New tab" onClick={addTab}>
            <Glyph name="plus" />
          </button>
        </div>
      )}
      <div className="term-screen" ref={screen} onClick={() => field.current?.focus()}>
        {session.lines.map((line, i) => (
          <pre key={i} className="term-line" data-kind={line.kind}>
            {line.text}
          </pre>
        ))}
        <form className="term-prompt" onSubmit={submit}>
          <label htmlFor={`term-${session.id}`}>{prompt(session.cwd)}</label>
          <input
            id={`term-${session.id}`}
            ref={field}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            autoFocus
          />
        </form>
      </div>
      {sessions.length === 1 && (
        <button type="button" className="icon-button term-new term-new-solo" aria-label="New tab" onClick={addTab}>
          <Glyph name="plus" />
        </button>
      )}
    </div>
  );
}
