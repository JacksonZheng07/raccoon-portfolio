"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { Note } from "@/lib/notes";
import { AUTHOR_EMAIL, SITE_NAME } from "@/lib/site";
import type { DesktopProject, WindowId } from "./types";

type Line = { kind: "in" | "out" | "err"; text: string };

const PROMPT_HOST = "jackson@jackson-os";

const HELP = `Commands:
  ls [projects|notes]   list what's on this machine
  cd <dir>              move into projects/ or notes/ (cd .. to go back)
  open <name>           open a project, note, or app (finder, chrome, github…)
  cat <note>            print a note
  whoami                who built this
  neofetch              system summary
  contact               how to reach me
  clear                 clear the screen
  history               commands you've run`;

export function TerminalApp({
  projects,
  notes,
  version,
  onOpen,
}: {
  projects: DesktopProject[];
  notes: Note[];
  version: string;
  onOpen: (id: WindowId) => void;
}) {
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: `Last login: ${new Date().toDateString()} on ttys000` },
    { kind: "out", text: `Type 'help' to see what you can do.` },
  ]);
  const [cwd, setCwd] = useState<"~" | "~/projects" | "~/notes">("~");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [recall, setRecall] = useState<number | null>(null);
  const screen = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight });
  }, [lines]);

  const findProject = (name: string) =>
    projects.find((p) => p.slug === name.toLowerCase() || p.name.toLowerCase() === name.toLowerCase());
  const findNote = (name: string) =>
    notes.find((n) => n.slug === name || n.number === name || n.slug.startsWith(name));

  function run(raw: string): Line[] {
    const [command = "", ...args] = raw.trim().split(/\s+/);
    const arg = args.join(" ");
    const here = arg || (cwd === "~/projects" ? "projects" : cwd === "~/notes" ? "notes" : "");

    switch (command) {
      case "":
        return [];
      case "help":
        return [{ kind: "out", text: HELP }];
      case "ls":
        if (here === "projects") return [{ kind: "out", text: projects.map((p) => p.slug).join("  ") }];
        if (here === "notes") return [{ kind: "out", text: notes.map((n) => `${n.number}-${n.slug}`).join("\n") }];
        if (!here) return [{ kind: "out", text: "projects/  notes/  README.md" }];
        return [{ kind: "err", text: `ls: ${arg}: No such file or directory` }];
      case "cd":
        if (!arg || arg === "~" || arg === "..") setCwd("~");
        else if (arg.replace(/\/$/, "") === "projects") setCwd("~/projects");
        else if (arg.replace(/\/$/, "") === "notes") setCwd("~/notes");
        else return [{ kind: "err", text: `cd: no such file or directory: ${arg}` }];
        return [];
      case "pwd":
        return [{ kind: "out", text: cwd.replace("~", "/Users/jackson") }];
      case "open": {
        const apps: Record<string, WindowId> = {
          finder: "finder",
          projects: "finder",
          chrome: "browser",
          github: "github",
          notes: "notes",
          messages: "messages",
          mail: "mail",
          settings: "update",
          trash: "trash",
          about: "about",
        };
        const app = apps[arg.toLowerCase()];
        const project = findProject(arg);
        if (app) onOpen(app);
        else if (project) onOpen(`project:${project.slug}`);
        else if (findNote(arg)) onOpen("notes");
        else return [{ kind: "err", text: `open: ${arg || "(nothing)"}: not found. Try 'ls projects'.` }];
        return [];
      }
      case "cat": {
        if (arg === "README.md" || (!arg && cwd === "~")) {
          return [{ kind: "out", text: `${SITE_NAME}: Jackson Zheng's portfolio. CS + Math at Northeastern.\nTry 'ls projects' or 'open pystruct'.` }];
        }
        const note = findNote(arg);
        if (!note) return [{ kind: "err", text: `cat: ${arg || "(nothing)"}: No such file` }];
        return [{ kind: "out", text: `# ${note.title}\n\n${note.body.join("\n\n")}` }];
      }
      case "whoami":
        return [{ kind: "out", text: "Jackson Zheng, CS + Math at Northeastern. Builds language runtimes and internal tooling." }];
      case "neofetch":
        return [
          {
            kind: "out",
            text: [
              `       .--.       jackson@jackson-os`,
              `      |o_o |      ------------------`,
              `      |:_/ |      OS: ${SITE_NAME} ${version}`,
              `     //   \\ \\     Host: Northeastern University`,
              `    (|     | )    Projects: ${projects.length}`,
              `   /'\\_   _/\`\\    Notes: ${notes.length}`,
              `   \\___)=(___/    Shell: zsh (in the browser)`,
            ].join("\n"),
          },
        ];
      case "contact":
        return [{ kind: "out", text: `Email: ${AUTHOR_EMAIL}\nOr run 'open messages' to send one from here.` }];
      case "date":
        return [{ kind: "out", text: new Date().toString() }];
      case "echo":
        return [{ kind: "out", text: arg }];
      case "history":
        return [{ kind: "out", text: history.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`).join("\n") }];
      case "sudo":
        return [{ kind: "err", text: "jackson is not in the sudoers file. This incident will be reported." }];
      default:
        return [{ kind: "err", text: `zsh: command not found: ${command}` }];
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const command = input;
    setInput("");
    setRecall(null);
    if (command.trim()) setHistory((h) => [...h, command]);
    if (command.trim() === "clear") {
      setLines([]);
      return;
    }
    // Run outside the state update: commands like `open` change other components' state.
    const output = run(command);
    setLines((ls) => [...ls, { kind: "in", text: `${PROMPT_HOST} ${cwd} % ${command}` }, ...output]);
  }

  // Up and down walk back through earlier commands, as in a real shell.
  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    if (history.length === 0) return;
    const next =
      e.key === "ArrowUp"
        ? Math.max(0, (recall ?? history.length) - 1)
        : Math.min(history.length, (recall ?? history.length) + 1);
    setRecall(next === history.length ? null : next);
    setInput(history[next] ?? "");
  }

  return (
    <div className="terminal" ref={screen} onClick={() => field.current?.focus()}>
      {lines.map((line, i) => (
        <pre key={i} className="terminal-line" data-kind={line.kind}>
          {line.text}
        </pre>
      ))}
      <form className="terminal-prompt" onSubmit={submit}>
        <label htmlFor="terminal-input">
          {PROMPT_HOST} {cwd} %
        </label>
        <input
          id="terminal-input"
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
  );
}
