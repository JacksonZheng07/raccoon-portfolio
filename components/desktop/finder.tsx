"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { type FsAction, type FsNode, resolve, walk } from "./fs";
import { Glyph } from "./glyphs";
import { AppIcon } from "./icons";

type Location = { path: string[] };
type Row = { node: FsNode; path: string[] };

const date = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});
const key = (l: Location) => l.path.join("/");

export function FinderApp({
  root,
  request,
  onAction,
}: {
  root: FsNode;
  /** A folder another part of the desktop asked to show; `n` changes on every request. */
  request: { path: string[]; n: number } | null;
  onAction: (action: FsAction) => void;
}) {
  const [trail, setTrail] = useState<{ stops: Location[]; at: number }>({
    stops: [{ path: ["Projects"] }],
    at: 0,
  });
  const [view, setView] = useState<"list" | "icons">("list");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const toggle = (id: string, open?: boolean) =>
    setExpanded((all) => {
      const next = new Set(all);
      if (open ?? !next.has(id)) next.add(id);
      else next.delete(id);
      return next;
    });
  const here = trail.stops[trail.at]!;

  const go = (next: Location) => {
    setQuery("");
    setSelected(null);
    if (key(next) === key(here)) return;
    setTrail(({ stops, at }) => ({
      stops: [...stops.slice(0, at + 1), next],
      at: at + 1,
    }));
  };

  const served = useRef(0);
  const requestN = request?.n ?? 0;
  const requestPath = request?.path.join("/");
  useEffect(() => {
    if (requestPath === undefined || served.current === requestN) return;
    served.current = requestN;
    go({ path: requestPath ? requestPath.split("/") : [] });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per request
  }, [requestN, requestPath]);

  const needle = query.trim().toLowerCase();
  let rows: Row[];
  let title: string;
  if (needle) {
    rows = walk(root).filter((r) => r.node.name.toLowerCase().includes(needle));
    title = `Searching “${query.trim()}”`;
  } else {
    const folder = resolve(root, here.path);
    rows = (folder?.children ?? []).map((node) => ({
      node,
      path: [...here.path, node.name],
    }));
    title = here.path.at(-1) ?? root.name;
  }

  // List view is an outline: expanded folders show their contents inline, indented.
  const outline = (list: Row[], depth: number): { row: Row; depth: number }[] =>
    list.flatMap((row) => [
      { row, depth },
      ...(row.node.children && expanded.has(row.path.join("/"))
        ? outline(
            row.node.children.map((node) => ({
              node,
              path: [...row.path, node.name],
            })),
            depth + 1,
          )
        : []),
    ]);

  const open = (row: Row) =>
    row.node.children
      ? go({ path: row.path })
      : row.node.action && onAction(row.node.action);

  // One click selects, a double click or Return opens: Finder's own rules.
  const rowProps = (row: Row) => {
    const id = row.path.join("/");
    return {
      "aria-pressed": selected === id,
      onClick: () => setSelected(id),
      onDoubleClick: () => open(row),
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          open(row);
        } else if (
          row.node.children &&
          (e.key === "ArrowRight" || e.key === "ArrowLeft")
        ) {
          e.preventDefault();
          toggle(id, e.key === "ArrowRight");
        }
      },
    };
  };

  const place = (label: string, target: Location, icon: ReactNode) => (
    <button
      key={key(target)}
      type="button"
      aria-pressed={key(here) === key(target)}
      onClick={() => go(target)}
    >
      {icon}
      {label}
    </button>
  );

  const crumbs = "path" in here && !needle ? [root.name, ...here.path] : [];

  return (
    <div className="finder">
      <aside className="sidebar" aria-label="Locations">
        <p className="sidebar-heading">Favorites</p>
        {place(root.name, { path: [] }, <Glyph name="home" />)}
        {place(
          "Applications",
          { path: ["Applications"] },
          <Glyph name="apps" />,
        )}
        {place("Projects", { path: ["Projects"] }, <Glyph name="folder" />)}
        {place("Notes", { path: ["Notes"] }, <Glyph name="folder" />)}
      </aside>

      <div className="finder-main">
        <div className="finder-toolbar">
          <button
            type="button"
            className="icon-button"
            aria-label="Back"
            disabled={trail.at === 0}
            onClick={() => setTrail((t) => ({ ...t, at: t.at - 1 }))}
          >
            <Glyph name="back" />
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Forward"
            disabled={trail.at === trail.stops.length - 1}
            onClick={() => setTrail((t) => ({ ...t, at: t.at + 1 }))}
          >
            <Glyph name="forward" />
          </button>
          <h2 className="finder-title">{title}</h2>
          <div className="segmented" role="group" aria-label="View">
            <button
              type="button"
              aria-pressed={view === "icons"}
              aria-label="as Icons"
              onClick={() => setView("icons")}
            >
              <Glyph name="grid" />
            </button>
            <button
              type="button"
              aria-pressed={view === "list"}
              aria-label="as List"
              onClick={() => setView("list")}
            >
              <Glyph name="list" />
            </button>
          </div>
          <label className="finder-search">
            <Glyph name="search" />
            <input
              aria-label="Search"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>

        {view === "list" ? (
          <div className="finder-list">
            <div className="finder-row finder-head" aria-hidden="true">
              <span>Name</span>
              <span>Kind</span>
              <span>Date Modified</span>
            </div>
            {outline(rows, 0).map(({ row, depth }) => {
              const id = row.path.join("/");
              const isOpen = expanded.has(id);
              return (
                <div
                  key={id}
                  className="finder-entry"
                  style={{ "--depth": depth } as CSSProperties}
                >
                  {row.node.children && (
                    <button
                      type="button"
                      className="finder-disclosure"
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? "Collapse" : "Expand"} ${row.node.name}`}
                      onClick={() => toggle(id)}
                    >
                      <Glyph name="chevron" />
                    </button>
                  )}
                  <button
                    type="button"
                    className="finder-row"
                    {...rowProps(row)}
                  >
                    <span className="finder-name">
                      <AppIcon kind={row.node.icon} />
                      {row.node.name}
                    </span>
                    <span>{row.node.kind}</span>
                    <span>
                      {row.node.date
                        ? date.format(new Date(row.node.date))
                        : "--"}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <ul className="finder-grid">
            {rows.map((row) => (
              <li key={row.path.join("/")}>
                <button
                  type="button"
                  className="finder-item"
                  {...rowProps(row)}
                >
                  <AppIcon kind={row.node.icon} />
                  <span>{row.node.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {crumbs.length > 0 ? (
          <nav className="finder-path" aria-label="Path">
            {crumbs.map((name, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go({ path: crumbs.slice(1, i + 1) })}
              >
                <AppIcon kind="folder" />
                {name}
              </button>
            ))}
          </nav>
        ) : (
          <p className="statusbar">
            {rows.length} {rows.length === 1 ? "item" : "items"}
          </p>
        )}
      </div>
    </div>
  );
}
