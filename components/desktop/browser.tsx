"use client";

import { useState, type FormEvent } from "react";
import type { WindowId } from "./types";

// Google serves an embeddable page under `igu=1`; most other sites refuse to load inside a frame.
const HOME = "https://www.google.com/webhp?igu=1";

type Tab = { id: number; history: string[]; index: number; reloads: number };

function toUrl(input: string): string {
  const text = input.trim();
  if (/^https?:\/\//i.test(text)) return text;
  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(text)) return `https://${text}`;
  return `https://www.google.com/search?igu=1&q=${encodeURIComponent(text)}`;
}

function title(url: string): string {
  const parsed = new URL(url);
  const query = parsed.searchParams.get("q");
  if (query) return `${query} - Google Search`;
  if (parsed.hostname === "www.google.com") return "Google";
  return parsed.hostname.replace(/^www\./, "");
}

/** What Chrome's omnibox shows: no scheme, no `www.`, none of the embedding flag. */
function display(url: string): string {
  return url
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/([?&])igu=1&?/, "$1")
    .replace(/[?&]$/, "");
}

function Favicon({ url }: { url: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- remote favicon, static export
    <img
      className="chrome-favicon"
      src={`https://www.google.com/s2/favicons?sz=32&domain=${new URL(url).hostname}`}
      alt=""
      width={16}
      height={16}
    />
  );
}

let nextId = 1;
const newTab = (url = HOME): Tab => ({ id: nextId++, history: [url], index: 0, reloads: 0 });

export function BrowserApp({ onOpen }: { onOpen: (id: WindowId) => void }) {
  const [tabs, setTabs] = useState<Tab[]>(() => [newTab()]);
  const [activeId, setActiveId] = useState(tabs[0]!.id);
  const [draft, setDraft] = useState<string | null>(null);

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0]!;
  const url = active.history[active.index]!;

  const change = (patch: (t: Tab) => Tab) =>
    setTabs((ts) => ts.map((t) => (t.id === active.id ? patch(t) : t)));

  const navigate = (next: string) =>
    change((t) => ({ ...t, history: [...t.history.slice(0, t.index + 1), next], index: t.index + 1 }));

  function go(e: FormEvent) {
    e.preventDefault();
    if (!draft?.trim()) return;
    navigate(toUrl(draft));
    setDraft(null);
    (document.activeElement as HTMLElement | null)?.blur();
  }

  function addTab() {
    const tab = newTab();
    setTabs((ts) => [...ts, tab]);
    setActiveId(tab.id);
    setDraft(null);
  }

  function closeTab(id: number) {
    const rest = tabs.filter((t) => t.id !== id);
    if (rest.length === 0) {
      const tab = newTab();
      setTabs([tab]);
      setActiveId(tab.id);
      return;
    }
    setTabs(rest);
    if (id === activeId) setActiveId(rest[rest.length - 1]!.id);
  }

  return (
    <div className="chrome">
      <div className="chrome-tabs" role="tablist" aria-label="Tabs">
        {tabs.map((t) => {
          const tabUrl = t.history[t.index]!;
          return (
            <div key={t.id} className="chrome-tab" data-active={t.id === active.id}>
              <button
                type="button"
                role="tab"
                aria-selected={t.id === active.id}
                onClick={() => {
                  setActiveId(t.id);
                  setDraft(null);
                }}
              >
                <Favicon url={tabUrl} />
                <span className="chrome-tab-title">{title(tabUrl)}</span>
              </button>
              <button type="button" className="chrome-tab-close" aria-label={`Close ${title(tabUrl)}`} onClick={() => closeTab(t.id)}>
                ×
              </button>
            </div>
          );
        })}
        <button type="button" className="chrome-new" aria-label="New tab" onClick={addTab}>
          +
        </button>
      </div>

      <form className="chrome-toolbar" onSubmit={go}>
        <button type="button" aria-label="Back" disabled={active.index === 0} onClick={() => change((t) => ({ ...t, index: t.index - 1 }))}>
          ←
        </button>
        <button
          type="button"
          aria-label="Forward"
          disabled={active.index === active.history.length - 1}
          onClick={() => change((t) => ({ ...t, index: t.index + 1 }))}
        >
          →
        </button>
        <button type="button" aria-label="Reload" onClick={() => change((t) => ({ ...t, reloads: t.reloads + 1 }))}>
          ↻
        </button>
        <label className="chrome-omnibox">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <rect x="3" y="7" width="10" height="7" rx="1.5" fill="currentColor" />
          </svg>
          <input
            aria-label="Search Google or type a URL"
            placeholder="Search Google or type a URL"
            value={draft ?? display(url)}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={(e) => e.target.select()}
            onBlur={() => setDraft(null)}
            spellCheck={false}
          />
        </label>
        <a className="chrome-out" href={url.replace(/([?&])igu=1&?/, "$1")} target="_blank" rel="noreferrer" title="Open in a real browser tab" aria-label="Open in a real browser tab">
          ↗
        </a>
      </form>

      <nav className="chrome-bookmarks" aria-label="Bookmarks">
        <button type="button" onClick={() => navigate(HOME)}>
          <Favicon url={HOME} />
          Google
        </button>
        <button type="button" onClick={() => onOpen("finder")}>
          <span aria-hidden="true">📁</span>
          Projects
        </button>
        <button type="button" onClick={() => onOpen("github")}>
          <Favicon url="https://github.com" />
          My GitHub
        </button>
        <button type="button" onClick={() => onOpen("notes")}>
          <span aria-hidden="true">📝</span>
          Notes
        </button>
      </nav>

      {tabs.map((t) => (
        <iframe
          key={`${t.id}-${t.index}-${t.reloads}`}
          className="chrome-frame"
          hidden={t.id !== active.id}
          src={t.history[t.index]}
          title={title(t.history[t.index]!)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer"
        />
      ))}
    </div>
  );
}
