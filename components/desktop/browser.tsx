"use client";

import { useState, type FormEvent } from "react";

// Google serves an embeddable page under `igu=1`; most other sites refuse to load inside a frame.
const HOME = "https://www.google.com/webhp?igu=1";

type Tab = { id: number; history: string[]; index: number; reloads: number };

function toUrl(input: string): string {
  const text = input.trim();
  if (/^https?:\/\//i.test(text)) return text;
  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(text)) return `https://${text}`;
  return `https://www.google.com/search?igu=1&q=${encodeURIComponent(text)}`;
}

function label(url: string): string {
  const parsed = new URL(url);
  const query = parsed.searchParams.get("q");
  if (query) return `${query} - Google Search`;
  if (parsed.hostname === "www.google.com") return "Google";
  return parsed.hostname.replace(/^www\./, "");
}

let nextId = 1;
const newTab = (url = HOME): Tab => ({ id: nextId++, history: [url], index: 0, reloads: 0 });

export function BrowserApp() {
  const [tabs, setTabs] = useState<Tab[]>(() => [newTab()]);
  const [activeId, setActiveId] = useState(tabs[0]!.id);
  const [draft, setDraft] = useState<string | null>(null);

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0]!;
  const url = active.history[active.index]!;

  const change = (patch: (t: Tab) => Tab) =>
    setTabs((ts) => ts.map((t) => (t.id === active.id ? patch(t) : t)));

  function go(e: FormEvent) {
    e.preventDefault();
    if (!draft?.trim()) return;
    const next = toUrl(draft);
    change((t) => ({ ...t, history: [...t.history.slice(0, t.index + 1), next], index: t.index + 1 }));
    setDraft(null);
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
    <div className="browser">
      <div className="browser-tabs" role="tablist" aria-label="Tabs">
        {tabs.map((t) => (
          <div key={t.id} className="browser-tab" data-active={t.id === active.id}>
            <button
              type="button"
              role="tab"
              aria-selected={t.id === active.id}
              onClick={() => {
                setActiveId(t.id);
                setDraft(null);
              }}
            >
              <span className="browser-favicon" aria-hidden="true">
                {label(t.history[t.index]!).startsWith("Google") || label(t.history[t.index]!).endsWith("Search") ? "G" : "◎"}
              </span>
              <span className="browser-tab-title">{label(t.history[t.index]!)}</span>
            </button>
            <button type="button" className="browser-tab-close" aria-label="Close tab" onClick={() => closeTab(t.id)}>
              ×
            </button>
          </div>
        ))}
        <button type="button" className="browser-new" aria-label="New tab" onClick={addTab}>
          +
        </button>
      </div>

      <form className="browser-bar" onSubmit={go}>
        <button type="button" aria-label="Back" disabled={active.index === 0} onClick={() => change((t) => ({ ...t, index: t.index - 1 }))}>
          ‹
        </button>
        <button
          type="button"
          aria-label="Forward"
          disabled={active.index === active.history.length - 1}
          onClick={() => change((t) => ({ ...t, index: t.index + 1 }))}
        >
          ›
        </button>
        <button type="button" aria-label="Reload" onClick={() => change((t) => ({ ...t, reloads: t.reloads + 1 }))}>
          ↻
        </button>
        <input
          className="browser-omnibox"
          aria-label="Search Google or type a URL"
          placeholder="Search Google or type a URL"
          value={draft ?? url}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={(e) => e.target.select()}
        />
        <a className="browser-out" href={url.replace("igu=1&", "").replace("?igu=1", "")} target="_blank" rel="noreferrer" title="Open in a real browser tab">
          ↗
        </a>
      </form>

      {tabs.map((t) => (
        <iframe
          key={`${t.id}-${t.index}-${t.reloads}`}
          className="browser-frame"
          hidden={t.id !== active.id}
          src={t.history[t.index]}
          title={label(t.history[t.index]!)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer"
        />
      ))}
      <p className="browser-hint">Some sites refuse to open inside another page. If one stays blank, use ↗.</p>
    </div>
  );
}
