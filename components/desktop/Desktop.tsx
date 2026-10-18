"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { AUTHOR_EMAIL, AUTHOR_GITHUB, SITE_NAME } from "@/lib/site";
import { AboutApp, FinderApp, NotesApp, ProjectApp, UpdateApp, osVersion } from "./apps";
import { AppIcon, type IconKind } from "./icons";
import type { AppId, DesktopData, WindowId } from "./types";
import { Widgets } from "./widgets";

type Win = {
  id: WindowId;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
};

const MENU_BAR_HEIGHT = 28;
const MOBILE_QUERY = "(max-width: 740px)";

const APPS: Record<AppId, { title: string; menuName: string; icon: IconKind; w: number; h: number }> = {
  finder: { title: "Projects", menuName: "Finder", icon: "finder", w: 720, h: 460 },
  notes: { title: "Notes", menuName: "Notes", icon: "notes", w: 780, h: 520 },
  about: { title: "About Jackson", menuName: "About", icon: "about", w: 400, h: 540 },
  update: { title: "Software Update", menuName: "Software Update", icon: "update", w: 580, h: 540 },
};
const PROJECT_SIZE = { w: 720, h: 580 };

// Rendered on the server too, so these are fixed rather than viewport-derived.
const INITIAL_WINDOWS: Win[] = [
  { id: "about", x: 380, y: 52, w: 400, h: 540, z: 1, minimized: false, maximized: false },
  { id: "finder", x: 560, y: 150, w: 720, h: 460, z: 2, minimized: false, maximized: false },
];

function isApp(id: string): id is AppId {
  return id in APPS;
}

function slugOf(id: WindowId): string | undefined {
  return id.startsWith("project:") ? id.slice("project:".length) : undefined;
}

export function Desktop({ projects, notes, sync }: DesktopData) {
  const [windows, setWindows] = useState<Win[]>(INITIAL_WINDOWS);
  const hashReady = useRef(false);

  const visible = windows.filter((w) => !w.minimized);
  const focused = visible.reduce<Win | undefined>(
    (top, w) => (top === undefined || w.z > top.z ? w : top),
    undefined,
  );

  const projectFor = (id: WindowId) => projects.find((p) => p.slug === slugOf(id));

  const titleOf = (id: WindowId) =>
    isApp(id) ? APPS[id].title : (projectFor(id)?.name ?? "Untitled");

  const open = useCallback(
    (id: WindowId) =>
      setWindows((ws) => {
        const z = Math.max(0, ...ws.map((w) => w.z)) + 1;
        if (ws.some((w) => w.id === id)) {
          return ws.map((w) => (w.id === id ? { ...w, z, minimized: false } : w));
        }
        const size = isApp(id) ? APPS[id] : PROJECT_SIZE;
        const offset = (ws.length % 6) * 28;
        return [
          ...ws,
          {
            id,
            x: Math.max(16, Math.min(380 + offset, window.innerWidth - size.w - 90)),
            y: 56 + offset,
            w: Math.min(size.w, window.innerWidth - 32),
            h: Math.min(size.h, window.innerHeight - MENU_BAR_HEIGHT - 110),
            z,
            minimized: false,
            maximized: false,
          },
        ];
      }),
    [],
  );

  const update = (id: WindowId, patch: Partial<Win>) =>
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, ...patch } : w)));

  const close = useCallback(
    (id: WindowId) => setWindows((ws) => ws.filter((w) => w.id !== id)),
    [],
  );

  // #pystruct opens that project, #notes opens Notes: links into the desktop.
  useEffect(() => {
    const fromHash = () => {
      const key = decodeURIComponent(window.location.hash.slice(1));
      if (key === "") return;
      if (isApp(key)) open(key);
      else if (projects.some((p) => p.slug === key)) open(`project:${key}`);
    };
    fromHash();
    hashReady.current = true;
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [open, projects]);

  const focusedId = focused?.id;
  useEffect(() => {
    if (!hashReady.current) return;
    const hash = focusedId === undefined ? "" : `#${slugOf(focusedId) ?? focusedId}`;
    window.history.replaceState(null, "", `${window.location.pathname}${hash}`);
  }, [focusedId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && focusedId !== undefined) close(focusedId);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [focusedId, close]);

  function startDrag(e: ReactPointerEvent<HTMLElement>, win: Win) {
    open(win.id);
    if (e.button !== 0 || win.maximized || window.matchMedia(MOBILE_QUERY).matches) return;
    if ((e.target as HTMLElement).closest("button")) return;

    const bar = e.currentTarget;
    const dx = e.clientX - win.x;
    const dy = e.clientY - win.y;
    bar.setPointerCapture(e.pointerId);

    const move = (ev: PointerEvent) =>
      update(win.id, {
        x: Math.min(Math.max(ev.clientX - dx, 80 - win.w), window.innerWidth - 80),
        y: Math.min(Math.max(ev.clientY - dy, MENU_BAR_HEIGHT), window.innerHeight - 60),
      });
    const stop = () => {
      bar.removeEventListener("pointermove", move);
      bar.removeEventListener("pointerup", stop);
      bar.removeEventListener("pointercancel", stop);
    };
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", stop);
    bar.addEventListener("pointercancel", stop);
  }

  function contentFor(id: WindowId): ReactNode {
    switch (id) {
      case "finder":
        return <FinderApp projects={projects} onOpen={(slug) => open(`project:${slug}`)} />;
      case "notes":
        return <NotesApp notes={notes} />;
      case "about":
        return <AboutApp projects={projects} sync={sync} onOpen={open} />;
      case "update":
        return <UpdateApp projects={projects} sync={sync} onOpen={open} />;
      default: {
        const project = projectFor(id);
        return project ? <ProjectApp project={project} /> : null;
      }
    }
  }

  const desktopItems: { id: AppId; label: string }[] = [
    { id: "finder", label: "Projects" },
    { id: "notes", label: "Notes" },
    { id: "about", label: "About Me" },
    { id: "update", label: "Software Update" },
  ];

  const runningIds = new Set(windows.map((w) => w.id));
  const menuName =
    focused === undefined ? "Finder" : isApp(focused.id) ? APPS[focused.id].menuName : "Preview";

  return (
    <div className="desktop">
      <MenuBar appName={menuName} onOpen={open} version={osVersion(sync)} />

      <main className="desktop-icons" aria-label="Desktop">
        <h1 className="sr-only">
          {SITE_NAME}: Jackson Zheng, CS and Math at Northeastern
        </h1>
        {desktopItems.map((item) => (
          <button key={item.id} type="button" className="desktop-icon" onClick={() => open(item.id)}>
            <AppIcon kind={item.id === "finder" ? "folder" : APPS[item.id].icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </main>

      <Widgets projects={projects} onOpen={open} />

      {windows.map((win) => {
        const titleId = `title-${win.id.replace(":", "-")}`;
        return (
          <section
            key={win.id}
            role="dialog"
            aria-labelledby={titleId}
            hidden={win.minimized}
            className="window"
            data-focused={win.id === focusedId}
            data-maximized={win.maximized}
            style={
              win.maximized
                ? { zIndex: win.z }
                : { zIndex: win.z, left: win.x, top: win.y, width: win.w, height: win.h }
            }
            onPointerDown={() => win.id !== focusedId && open(win.id)}
          >
            <div className="titlebar" onPointerDown={(e) => startDrag(e, win)} onDoubleClick={() => update(win.id, { maximized: !win.maximized })}>
              <div className="traffic-lights">
                <button type="button" className="light light-close" aria-label={`Close ${titleOf(win.id)}`} onClick={() => close(win.id)} />
                <button type="button" className="light light-min" aria-label={`Minimize ${titleOf(win.id)}`} onClick={() => update(win.id, { minimized: true })} />
                <button type="button" className="light light-max" aria-label={`${win.maximized ? "Restore" : "Zoom"} ${titleOf(win.id)}`} onClick={() => update(win.id, { maximized: !win.maximized })} />
              </div>
              <h2 id={titleId} className="window-title">
                {titleOf(win.id)}
              </h2>
            </div>
            <div className="window-body">{contentFor(win.id)}</div>
          </section>
        );
      })}

      <nav className="dock" aria-label="Dock">
        {(Object.keys(APPS) as AppId[]).map((id) => (
          <button key={id} type="button" className="dock-item" data-running={runningIds.has(id)} onClick={() => open(id)}>
            <AppIcon kind={APPS[id].icon} />
            <span className="dock-label">{APPS[id].menuName}</span>
          </button>
        ))}
        {windows
          .filter((w) => !isApp(w.id))
          .map((w) => (
            <button key={w.id} type="button" className="dock-item" data-running="true" onClick={() => open(w.id)}>
              <AppIcon kind="doc" />
              <span className="dock-label">{titleOf(w.id)}</span>
            </button>
          ))}
        <span className="dock-divider" aria-hidden="true" />
        <a className="dock-item" href={AUTHOR_GITHUB} target="_blank" rel="noreferrer">
          <AppIcon kind="github" />
          <span className="dock-label">GitHub</span>
        </a>
        <a className="dock-item" href={`mailto:${AUTHOR_EMAIL}`}>
          <AppIcon kind="mail" />
          <span className="dock-label">Mail</span>
        </a>
      </nav>
    </div>
  );
}

function MenuBar({
  appName,
  version,
  onOpen,
}: {
  appName: string;
  version: string;
  onOpen: (id: WindowId) => void;
}) {
  const menu = useRef<HTMLDivElement>(null);
  const [clock, setClock] = useState<string | null>(null);

  // Client-only: a server-rendered time would never match hydration.
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    const tick = () => setClock(format.format(new Date()).replace(/,/g, ""));
    tick();
    const timer = window.setInterval(tick, 15_000);
    return () => window.clearInterval(timer);
  }, []);

  const pick = (id: WindowId) => {
    menu.current?.hidePopover();
    onOpen(id);
  };

  return (
    <header className="menubar">
      <button type="button" className="menubar-logo" popoverTarget="system-menu" aria-label="System menu">
        <AppIcon kind="logo" />
      </button>
      <div ref={menu} id="system-menu" popover="auto" className="menu-popover">
        <button type="button" onClick={() => pick("about")}>About Jackson</button>
        <button type="button" onClick={() => pick("update")}>Software Update…</button>
        <hr />
        <button type="button" onClick={() => pick("finder")}>Projects</button>
        <button type="button" onClick={() => pick("notes")}>Notes</button>
        <hr />
        <a href={AUTHOR_GITHUB} target="_blank" rel="noreferrer">GitHub</a>
        <a href={`mailto:${AUTHOR_EMAIL}`}>Email Jackson</a>
      </div>
      <span className="menubar-app">{appName}</span>
      <span className="menubar-os">{SITE_NAME} {version}</span>
      <time className="menubar-clock" suppressHydrationWarning>
        {clock}
      </time>
    </header>
  );
}
