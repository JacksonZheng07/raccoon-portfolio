"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { SITE_NAME } from "@/lib/site";
import { FinderApp } from "./finder";
import { buildTree, type FsAction } from "./fs";
import { AboutApp, MailApp, NotesApp, ProjectApp, TrashApp, UpdateApp, osVersion } from "./apps";
import { BootScreen } from "./atmosphere";
import { BrowserApp } from "./browser";
import { GithubApp } from "./github";
import { AppIcon, type IconKind } from "./icons";
import type { AppId, DesktopData, WindowId } from "./types";
import { MessagesApp } from "./messages";
import { TerminalApp } from "./terminal";
import { TimelineApp } from "./timeline";
import { ProjectsWidget, WeatherWidget } from "./widgets";

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

type Power = "on" | "sleep" | "locked" | "off";

const MENU_BAR_HEIGHT = 28;
const MOBILE_QUERY = "(max-width: 740px)";

const APPS: Record<AppId, { title: string; menuName: string; icon: IconKind; w: number; h: number }> = {
  finder: { title: "Projects", menuName: "Finder", icon: "finder", w: 720, h: 460 },
  browser: { title: "Google Chrome", menuName: "Chrome", icon: "browser", w: 1040, h: 680 },
  notes: { title: "Notes", menuName: "Notes", icon: "notes", w: 780, h: 520 },
  about: { title: "About Jackson", menuName: "About", icon: "about", w: 340, h: 520 },
  update: { title: "Software Update", menuName: "System Settings", icon: "update", w: 580, h: 540 },
  github: { title: "GitHub", menuName: "GitHub", icon: "github", w: 860, h: 620 },
  mail: { title: "Contact Jackson", menuName: "Mail", icon: "mail", w: 440, h: 380 },
  messages: { title: "Messages", menuName: "Messages", icon: "messages", w: 400, h: 560 },
  timeline: { title: "Timeline", menuName: "Timeline", icon: "timeline", w: 760, h: 640 },
  terminal: { title: "jackson — -zsh — 80×24", menuName: "Terminal", icon: "terminal", w: 680, h: 420 },
  trash: { title: "Trash", menuName: "Finder", icon: "trash", w: 600, h: 380 },
};
const DOCK_APPS: AppId[] = ["finder", "timeline", "browser", "messages", "notes", "terminal", "update", "github", "mail"];
const PROJECT_SIZE = { w: 720, h: 580 };

type Spot = { x: number; y: number };
type DockSide = "left" | "bottom" | "right";
type Prefs = { spots: Record<string, Spot>; dock: DockSide; stage: boolean };

// v2: the desktop became folders and Stage Manager now starts off, as on a new Mac.
const PREFS_KEY = "jackson-os:prefs:v2";
const DEFAULT_PREFS: Prefs = { spots: {}, dock: "right", stage: false };
const DESKTOP_FOLDERS = ["Applications", "Projects", "Notes"];
const ICON_ORDER = DESKTOP_FOLDERS.map((name) => `folder:${name}`);
const DEFAULT_SPOTS: Record<string, Spot> = {
  weather: { x: 14, y: 14 },
  projects: { x: 14, y: 232 },
  ...Object.fromEntries(ICON_ORDER.map((id, i) => [id, { x: 330, y: 12 + i * 106 }])),
};

// Rendered on the server too, so these are fixed rather than viewport-derived.
const INITIAL_WINDOWS: Win[] = [
  { id: "finder", x: 560, y: 72, w: 720, h: 460, z: 1, minimized: false, maximized: false },
];

function isApp(id: string): id is AppId {
  return id in APPS;
}

function slugOf(id: WindowId): string | undefined {
  return id.startsWith("project:") ? id.slice("project:".length) : undefined;
}

export function Desktop({ projects, notes, sync }: DesktopData) {
  const [windows, setWindows] = useState<Win[]>(INITIAL_WINDOWS);
  const [repo, setRepo] = useState<string | null>(null);
  const [power, setPower] = useState<Power>("on");
  const [boots, setBoots] = useState(0);
  const hashReady = useRef(false);
  const dockMenu = useRef<HTMLDivElement>(null);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const prefsLoaded = useRef(false);

  // Layout and dock side are per-visitor conveniences, so they live in this browser only.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREFS_KEY);
      if (saved) setPrefs({ ...DEFAULT_PREFS, ...(JSON.parse(saved) as Partial<Prefs>) });
    } catch {}
    prefsLoaded.current = true;
  }, []);
  useEffect(() => {
    if (!prefsLoaded.current) return;
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {}
  }, [prefs]);

  const lastField = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const remember = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) lastField.current = e.target;
    };
    document.addEventListener("focusin", remember);
    return () => document.removeEventListener("focusin", remember);
  }, []);

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
            x: Math.max(16, Math.min(470 + offset, window.innerWidth - size.w - 90)),
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

  const openRepo = useCallback(
    (name: string | null) => {
      setRepo(name);
      open("github");
    },
    [open],
  );

  const [chromeRequest, setChromeRequest] = useState<{ url: string; n: number } | null>(null);
  const openInChrome = useCallback(
    (url: string) => {
      setChromeRequest((r) => ({ url, n: (r?.n ?? 0) + 1 }));
      open("browser");
    },
    [open],
  );

  const [finderRequest, setFinderRequest] = useState<{ path: string[]; n: number } | null>(null);
  const openFolder = useCallback(
    (path: string[]) => {
      setFinderRequest((r) => ({ path, n: (r?.n ?? 0) + 1 }));
      open("finder");
    },
    [open],
  );
  const [noteRequest, setNoteRequest] = useState<{ slug: string; n: number } | null>(null);

  // What opening a file in Finder or Terminal does.
  const act = useCallback(
    (action: FsAction) => {
      if (action.type === "window") open(action.id);
      else if (action.type === "repo") openRepo(action.repo);
      else if (action.type === "url") openInChrome(action.url);
      else {
        setNoteRequest((r) => ({ slug: action.slug, n: (r?.n ?? 0) + 1 }));
        open("notes");
      }
    },
    [open, openRepo, openInChrome],
  );

  const tree = useMemo(
    () =>
      buildTree(
        projects,
        notes,
        DOCK_APPS.map((id) => ({ id, name: APPS[id].menuName, icon: APPS[id].icon })),
      ),
    [projects, notes],
  );

  const update = (id: WindowId, patch: Partial<Win>) =>
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, ...patch } : w)));

  const close = useCallback(
    (id: WindowId) =>
      animateWindow(id, [{ opacity: 0 }], 110).then(() =>
        setWindows((ws) => ws.filter((w) => w.id !== id)),
      ),
    [],
  );

  // Minimize pours the window into the dock, as the Mac's scale effect does.
  const minimize = (id: WindowId) => {
    const dock = document.querySelector(".dock")?.getBoundingClientRect();
    const el = document.querySelector<HTMLElement>(`[data-win="${id}"]`)?.getBoundingClientRect();
    const frames =
      dock && el
        ? [
            {
              opacity: 0.2,
              transform: `translate(${dock.left + dock.width / 2 - (el.left + el.width / 2)}px, ${
                dock.top + dock.height / 2 - (el.top + el.height / 2)
              }px) scale(0.08)`,
            },
          ]
        : [{ opacity: 0 }];
    animateWindow(id, frames, 320).then(() => update(id, { minimized: true }));
  };

  const restart = () => {
    setWindows(INITIAL_WINDOWS);
    setPower("on");
    setBoots((b) => b + 1);
  };

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
      if (power === "sleep") setPower("on");
      else if (e.key === "Escape" && focusedId !== undefined && power === "on") close(focusedId);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [focusedId, close, power]);

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
        return <FinderApp root={tree} request={finderRequest} onAction={act} />;
      case "browser":
        return <BrowserApp onOpen={open} request={chromeRequest} />;
      case "notes":
        return <NotesApp notes={notes} request={noteRequest} />;
      case "about":
        return <AboutApp projects={projects} sync={sync} onOpen={open} />;
      case "update":
        return <UpdateApp projects={projects} sync={sync} onOpen={open} />;
      case "github":
        return <GithubApp repo={repo} onNavigate={openRepo} />;
      case "mail":
        return <MailApp onOpen={open} />;
      case "messages":
        return <MessagesApp />;
      case "timeline":
        return <TimelineApp onOpen={open} />;
      case "terminal":
        return <TerminalApp root={tree} projects={projects} notes={notes} version={osVersion(sync)} onAction={act} />;
      case "trash":
        return <TrashApp onOpenRepo={openRepo} />;
      default: {
        const project = projectFor(id);
        return project ? <ProjectApp project={project} onOpenRepo={openRepo} onOpenUrl={openInChrome} /> : null;
      }
    }
  }


  const spotOf = (id: string) => prefs.spots[id] ?? DEFAULT_SPOTS[id] ?? { x: 0, y: 0 };
  const moveSpot = useCallback(
    (id: string, spot: Spot) => setPrefs((p) => ({ ...p, spots: { ...p.spots, [id]: spot } })),
    [],
  );
  const setDock = (dock: DockSide) => {
    dockMenu.current?.hidePopover();
    setPrefs((p) => ({ ...p, dock }));
  };
  // Stage Manager shows the windows behind the front one, most recent first.
  const stage = visible
    .filter((w) => w.id !== focusedId)
    .sort((a, b) => b.z - a.z)
    .slice(0, 5);

  const runningIds = new Set(windows.map((w) => w.id));
  const minimized = windows.filter((w) => w.minimized);
  const menuName =
    focused === undefined ? "Finder" : isApp(focused.id) ? APPS[focused.id].menuName : "Preview";

  // One listener drives both the wallpaper parallax and the tilt of whichever widget is hovered.
  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const root = e.currentTarget.style;
    root.setProperty("--px", (e.clientX / window.innerWidth - 0.5).toFixed(3));
    root.setProperty("--py", (e.clientY / window.innerHeight - 0.5).toFixed(3));

    const widget = (e.target as Element).closest<HTMLElement>(".widget");
    if (widget) {
      const box = widget.getBoundingClientRect();
      const x = (e.clientX - box.left) / box.width;
      const y = (e.clientY - box.top) / box.height;
      widget.style.setProperty("--rx", `${((0.5 - y) * 10).toFixed(2)}deg`);
      widget.style.setProperty("--ry", `${((x - 0.5) * 12).toFixed(2)}deg`);
      widget.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
      widget.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    }
  }

  const toggleZoom = focused ? () => update(focused.id, { maximized: !focused.maximized }) : undefined;

  // Opening a menu moves focus to it, so Edit commands go back to the last text field first.
  const run = (command: string) => () => {
    const selected = document.getSelection()?.toString();
    if (command === "copy" && selected) {
      navigator.clipboard.writeText(selected).catch(() => {});
      return;
    }
    lastField.current?.focus();
    document.execCommand(command);
  };
  const paste = async () => {
    const text = await navigator.clipboard.readText().catch(() => "");
    lastField.current?.focus();
    if (text) document.execCommand("insertText", false, text);
  };

  const menus: MenuSpec[] = [
    {
      label: "System menu",
      icon: true,
      items: [
        { label: "About This Mac", run: () => open("about") },
        "-",
        {
          label: "System Settings…",
          badge: sync.changes.length > 0 ? `${sync.changes.length} update` : undefined,
          run: () => open("update"),
        },
        "-",
        { label: "Force Quit…", keys: "⌥⌘⎋", run: () => setWindows([]) },
        "-",
        { label: "Sleep", run: () => setPower("sleep") },
        { label: "Restart…", run: restart },
        { label: "Shut Down…", run: () => setPower("off") },
        "-",
        { label: "Lock Screen", keys: "⌃⌘Q", run: () => setPower("locked") },
        {
          label: "Log Out Jackson Zheng…",
          keys: "⇧⌘Q",
          run: () => {
            setWindows([]);
            setPower("locked");
          },
        },
      ],
    },
    {
      label: "File",
      items: [
        { label: "New Chrome Window", run: () => open("browser") },
        { label: "Open Projects", run: () => openFolder(["Projects"]) },
        "-",
        { label: "Close Window", keys: "esc", run: focusedId ? () => close(focusedId) : undefined },
      ],
    },
    {
      label: "Edit",
      items: [
        { label: "Undo", keys: "⌘Z", run: run("undo") },
        { label: "Redo", keys: "⇧⌘Z", run: run("redo") },
        "-",
        { label: "Cut", keys: "⌘X", run: run("cut") },
        { label: "Copy", keys: "⌘C", run: run("copy") },
        { label: "Paste", keys: "⌘V", run: paste },
        { label: "Select All", keys: "⌘A", run: run("selectAll") },
      ],
    },
    {
      label: "View",
      items: [
        { label: focused?.maximized ? "Exit Full Screen" : "Enter Full Screen", run: toggleZoom },
        "-",
        { label: "Stage Manager", checked: prefs.stage, run: () => setPrefs((p) => ({ ...p, stage: !p.stage })) },
        "-",
        { label: "Dock on Left", checked: prefs.dock === "left", run: () => setDock("left") },
        { label: "Dock on Bottom", checked: prefs.dock === "bottom", run: () => setDock("bottom") },
        { label: "Dock on Right", checked: prefs.dock === "right", run: () => setDock("right") },
        "-",
        { label: "Reset Desktop Layout", run: () => setPrefs((p) => ({ ...p, spots: {} })) },
      ],
    },
    {
      label: "Go",
      items: [
        { label: "Home", run: () => openFolder([]) },
        { label: "Applications", run: () => openFolder(["Applications"]) },
        { label: "Projects", run: () => openFolder(["Projects"]) },
        { label: "Notes", run: () => openFolder(["Notes"]) },
        { label: "Timeline", run: () => open("timeline") },
        { label: "GitHub", run: () => open("github") },
        { label: "Chrome", run: () => open("browser") },
        { label: "Terminal", run: () => open("terminal") },
        "-",
        { label: "Trash", run: () => open("trash") },
      ],
    },
    {
      label: "Window",
      items: [
        { label: "Minimize", keys: "⌘M", run: focused ? () => minimize(focused.id) : undefined },
        { label: "Zoom", run: toggleZoom },
        "-",
        ...windows.map((w) => ({ label: titleOf(w.id), checked: w.id === focusedId, run: () => open(w.id) })),
      ],
    },
    {
      label: "Help",
      items: [
        { label: `About ${SITE_NAME}`, run: () => open("about") },
        { label: "Send Jackson a Message", run: () => open("messages") },
        { label: "Contact Jackson", run: () => open("mail") },
      ],
    },
  ];

  return (
    <div
      className="desktop"
      data-dock={prefs.dock}
      data-stage={prefs.stage && stage.length > 0}
      onPointerMove={onPointerMove}
    >
      <div className="wallpaper" aria-hidden="true" />
      <BootScreen key={boots} force={boots > 0} />
      <MenuBar appName={menuName} menus={menus} onSearch={() => open("browser")} />

      <main className="desktop-layer" aria-label="Desktop">
        <h1 className="sr-only">
          {SITE_NAME}: Jackson Zheng, CS and Math at Northeastern
        </h1>
        <Movable id="weather" spot={spotOf("weather")} onMove={moveSpot}>
          <WeatherWidget onOpenUrl={openInChrome} />
        </Movable>
        <Movable id="projects" spot={spotOf("projects")} onMove={moveSpot}>
          <ProjectsWidget projects={projects} onOpen={open} />
        </Movable>
        {/* Desktop as stacks: three folders, the apps live in the Dock. */}
        {DESKTOP_FOLDERS.map((name) => (
          <Movable key={name} id={`folder:${name}`} spot={spotOf(`folder:${name}`)} onMove={moveSpot}>
            <button type="button" className="desktop-icon" onClick={() => openFolder([name])}>
              <AppIcon kind="folder" />
              <span>{name}</span>
            </button>
          </Movable>
        ))}
      </main>

      {prefs.stage && stage.length > 0 && (
        <aside className="stage" aria-label="Stage Manager">
          {stage.map((w) => (
            <button key={w.id} type="button" className="stage-card" onClick={() => open(w.id)} aria-label={`Bring ${titleOf(w.id)} forward`}>
              <span className="stage-window">
                <span className="stage-bar">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="stage-title">{titleOf(w.id)}</span>
              </span>
              <AppIcon kind={isApp(w.id) ? APPS[w.id].icon : "doc"} />
            </button>
          ))}
        </aside>
      )}

      {windows.map((win) => {
        const titleId = `title-${win.id.replace(":", "-")}`;
        return (
          <section
            key={win.id}
            data-win={win.id}
            role="dialog"
            aria-labelledby={titleId}
            hidden={win.minimized}
            className="window"
            data-app={isApp(win.id) ? win.id : "doc"}
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
                <button type="button" className="light light-min" aria-label={`Minimize ${titleOf(win.id)}`} onClick={() => minimize(win.id)} />
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

      {/* Apps, a divider, minimized windows, then the Trash: the Mac's order. */}
      <div ref={dockMenu} id="dock-menu" popover="auto" className="menu-popover">
        {(["left", "bottom", "right"] as const).map((side) => (
          <button key={side} type="button" onClick={() => setDock(side)}>
            <span>
              <span className="menu-check">{prefs.dock === side ? "✓" : ""}</span>
              Position on {side[0]!.toUpperCase() + side.slice(1)}
            </span>
          </button>
        ))}
      </div>
      <nav
        className="dock"
        aria-label="Dock"
        onContextMenu={(e) => {
          e.preventDefault();
          const menu = dockMenu.current;
          if (!menu) return;
          menu.style.left = `${Math.min(e.clientX, window.innerWidth - 260)}px`;
          menu.style.top = `${Math.min(e.clientY, window.innerHeight - 120)}px`;
          menu.showPopover();
        }}
      >
        {DOCK_APPS.map((id) => (
          <button key={id} type="button" className="dock-item" data-running={runningIds.has(id)} onClick={() => open(id)}>
            <AppIcon kind={APPS[id].icon} />
            <span className="dock-label">{APPS[id].menuName}</span>
          </button>
        ))}
        <span className="dock-divider" aria-hidden="true" />
        {minimized.map((w) => (
          <button key={w.id} type="button" className="dock-item" onClick={() => open(w.id)}>
            <AppIcon kind={isApp(w.id) ? APPS[w.id].icon : "doc"} />
            <span className="dock-label">{titleOf(w.id)}</span>
          </button>
        ))}
        <button type="button" className="dock-item" onClick={() => open("trash")}>
          <AppIcon kind="trash" />
          <span className="dock-label">Trash</span>
        </button>
      </nav>

      {power === "sleep" && <button type="button" className="power-screen" aria-label="Wake" onClick={() => setPower("on")} />}
      {power === "off" && (
        <div className="power-screen">
          <button type="button" className="power-button" onClick={restart}>
            Power On
          </button>
        </div>
      )}
      {power === "locked" && <LockScreen onUnlock={() => setPower("on")} />}
    </div>
  );
}

type MenuItem = { label: string; keys?: string; badge?: string; checked?: boolean; run?: () => void } | "-";
type MenuSpec = { label: string; icon?: boolean; items: MenuItem[] };

function Menu({ spec, index }: { spec: MenuSpec; index: number }) {
  const panel = useRef<HTMLDivElement>(null);
  const id = `menu-${index}`;
  return (
    <>
      <button
        type="button"
        className={spec.icon ? "menubar-logo" : "menubar-menu"}
        popoverTarget={id}
        onClick={(e) => {
          // Each menu drops from its own title, as on a Mac.
          if (panel.current) panel.current.style.left = `${e.currentTarget.getBoundingClientRect().left}px`;
        }}
        aria-label={spec.icon ? spec.label : undefined}
      >
        {spec.icon ? <AppIcon kind="logo" /> : spec.label}
      </button>
      <div ref={panel} id={id} popover="auto" className="menu-popover" data-menu={index}>
        {spec.items.map((item, i) =>
          item === "-" ? (
            <hr key={i} />
          ) : (
            <button
              key={i}
              type="button"
              disabled={!item.run}
              onClick={() => {
                panel.current?.hidePopover();
                item.run?.();
              }}
            >
              <span>
                {item.checked !== undefined && <span className="menu-check">{item.checked ? "✓" : ""}</span>}
                {item.label}
              </span>
              {item.badge && <span className="menu-badge">{item.badge}</span>}
              {item.keys && <span className="menu-keys">{item.keys}</span>}
            </button>
          ),
        )}
      </div>
    </>
  );
}

function useClock(options: Intl.DateTimeFormatOptions) {
  const [text, setText] = useState<string | null>(null);
  const key = JSON.stringify(options);
  // Client-only: a server-rendered time would never match hydration.
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-US", JSON.parse(key) as Intl.DateTimeFormatOptions);
    const tick = () => setText(format.format(new Date()).replace(/,/g, ""));
    tick();
    const timer = window.setInterval(tick, 15_000);
    return () => window.clearInterval(timer);
  }, [key]);
  return text;
}

type Battery = EventTarget & { level: number; charging: boolean };

// Chromium exposes the real battery; other browsers simply don't show the icon.
function useBattery() {
  const [state, setState] = useState<{ pct: number; charging: boolean } | null>(null);
  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<Battery> };
    let battery: Battery | undefined;
    const read = () => battery && setState({ pct: Math.round(battery.level * 100), charging: battery.charging });
    nav.getBattery?.().then((b) => {
      battery = b;
      read();
      b.addEventListener("levelchange", read);
      b.addEventListener("chargingchange", read);
    });
    return () => {
      battery?.removeEventListener("levelchange", read);
      battery?.removeEventListener("chargingchange", read);
    };
  }, []);
  return state;
}

function MenuBar({ appName, menus, onSearch }: { appName: string; menus: MenuSpec[]; onSearch: () => void }) {
  const clock = useClock({ weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  const battery = useBattery();
  const [system, ...rest] = menus;

  return (
    <header className="menubar">
      <Menu spec={system!} index={0} />
      <span className="menubar-app">{appName}</span>
      {rest.map((m, i) => (
        <Menu key={m.label} spec={m} index={i + 1} />
      ))}
      <div className="menubar-status">
        {battery && (
          <span className="menubar-battery" title={`Battery ${battery.pct}%${battery.charging ? ", charging" : ""}`}>
            <svg viewBox="0 0 28 13" aria-hidden="true">
              <rect x="0.5" y="0.5" width="24" height="12" rx="3.5" fill="none" stroke="currentColor" opacity="0.5" />
              <rect x="2" y="2" width={(21 * battery.pct) / 100} height="9" rx="2" fill="currentColor" />
              <path d="M26 4.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
            <span className="sr-only">Battery {battery.pct}%</span>
          </span>
        )}
        <svg className="menubar-wifi" viewBox="0 0 20 15" aria-label="Wi-Fi connected" role="img">
          <path d="M10 13.5l2.4-2.9a3.6 3.6 0 0 0-4.8 0z" fill="currentColor" />
          <path d="M5.2 8.5a7 7 0 0 1 9.6 0M2.4 5.3a11 11 0 0 1 15.2 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <button type="button" className="menubar-search" aria-label="Search the web" onClick={onSearch}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="6.5" cy="6.5" r="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M10.3 10.3L15 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <time className="menubar-clock" suppressHydrationWarning>
          {clock}
        </time>
      </div>
    </header>
  );
}

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const date = useClock({ weekday: "long", month: "long", day: "numeric" });
  const time = useClock({ hour: "numeric", minute: "2-digit" });
  return (
    <div className="lock-screen">
      <p className="lock-date">{date}</p>
      <p className="lock-time">{time?.replace(/\s?[AP]M$/, "")}</p>
      <div className="lock-user">
        <div className="about-avatar" aria-hidden="true">
          JZ
        </div>
        <p>Jackson Zheng</p>
        <button type="button" className="lock-unlock" onClick={onUnlock} autoFocus>
          Click to unlock
        </button>
      </div>
    </div>
  );
}

/** Drag with the mouse to rearrange; a press that never moves still clicks through. */
function Movable({
  id,
  spot,
  onMove,
  children,
}: {
  id: string;
  spot: Spot;
  onMove: (id: string, spot: Spot) => void;
  children: ReactNode;
}) {
  const moved = useRef(false);

  function down(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || e.button !== 0 || window.matchMedia(MOBILE_QUERY).matches) return;
    const start = { x: e.clientX, y: e.clientY };
    const origin = spot;
    moved.current = false;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      if (!moved.current && Math.hypot(dx, dy) < 5) return;
      moved.current = true;
      onMove(id, {
        x: Math.min(Math.max(origin.x + dx, 0), window.innerWidth - 80),
        y: Math.min(Math.max(origin.y + dy, 0), window.innerHeight - 120),
      });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  return (
    <div
      className="movable"
      style={{ left: spot.x, top: spot.y }}
      onPointerDown={down}
      onClickCapture={(e) => {
        if (!moved.current) return;
        e.stopPropagation();
        e.preventDefault();
        moved.current = false;
      }}
    >
      {children}
    </div>
  );
}

/** Plays a one-shot animation on a window, then resolves; instant when motion is reduced. */
function animateWindow(id: WindowId, frames: Keyframe[], duration: number): Promise<void> {
  const el = document.querySelector<HTMLElement>(`[data-win="${id}"]`);
  if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return Promise.resolve();
  const animation = el.animate(frames, { duration, easing: "cubic-bezier(0.4, 0, 0.6, 1)", fill: "forwards" });
  // Held on the last frame until the caller hides the window, then dropped so a restore starts clean.
  return animation.finished.then(
    () => void requestAnimationFrame(() => animation.cancel()),
    () => undefined,
  );
}
