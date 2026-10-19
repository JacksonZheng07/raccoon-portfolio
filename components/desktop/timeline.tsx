"use client";

import { useState } from "react";
import data from "@/content/timeline.json";
import { Glyph, type GlyphName } from "./glyphs";
import type { WindowId } from "./types";

type Kind = "work" | "project" | "award";
type Entry = {
  kind: Kind;
  start: string;
  end?: string;
  title: string;
  org: string;
  slug?: string;
  points?: string[];
  stack?: string[];
};
type Course = { code?: string; name: string; topics?: string[]; vault?: string };
type Term = { term: string; start: string; current?: boolean; courses: Course[] };

const career = data.career as Entry[];
const academic = data.academic as Term[];
const KINDS: Record<Kind, { label: string; glyph: GlyphName }> = {
  work: { label: "Work", glyph: "briefcase" },
  project: { label: "Project", glyph: "code" },
  award: { label: "Award", glyph: "star" },
};
const FILTERS: { id: "all" | Kind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "work", label: "Work" },
  { id: "project", label: "Projects" },
  { id: "award", label: "Awards" },
];

const month = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
const fmt = (ym: string) => month.format(new Date(`${ym}-01`));
function span(e: Entry): string {
  if (!e.end) return fmt(e.start);
  return `${fmt(e.start)} – ${e.end === "present" ? "Present" : fmt(e.end)}`;
}

function Chips({ items, label }: { items: string[]; label: string }) {
  return (
    <ul className="tl-chips" aria-label={label}>
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

function CareerTimeline({ onOpen }: { onOpen: (id: WindowId) => void }) {
  const [filter, setFilter] = useState<"all" | Kind>("all");
  // Projects and awards are both things built; the Projects filter shows both.
  const shown = career.filter((e) => filter === "all" || e.kind === filter || (filter === "project" && e.kind === "award"));

  return (
    <>
      <div className="segmented tl-filter" role="group" aria-label="Show">
        {FILTERS.map((f) => (
          <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>
      <ol className="tl-rail">
        {shown.map((e) => (
          <li key={`${e.start}-${e.title}`} className="tl-entry" data-current={e.end === "present"}>
            <span className="tl-node" aria-hidden="true">
              <Glyph name={KINDS[e.kind].glyph} />
            </span>
            <div className="tl-card">
              <p className="tl-meta">
                <time>{span(e)}</time> · {KINDS[e.kind].label}
              </p>
              <h4>{e.title}</h4>
              <p className="tl-org">{e.org}</p>
              {e.points && (
                <ul className="tl-points">
                  {e.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              )}
              <div className="tl-foot">
                {e.stack && <Chips items={e.stack} label="Stack" />}
                {e.slug && (
                  <button type="button" className="link" onClick={() => onOpen(`project:${e.slug}`)}>
                    Open project
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

function AcademicTimeline({ onOpen }: { onOpen: (id: WindowId) => void }) {
  const edu = data.education;
  return (
    <>
      <div className="tl-edu">
        <h3>{edu.school}</h3>
        <p>
          {edu.degree} · expected {edu.expected}
        </p>
        <Chips items={edu.honors} label="Honors" />
      </div>
      <ol className="tl-rail">
        {academic.map((t) => (
          <li key={t.term} className="tl-entry" data-current={t.current === true}>
            <span className="tl-node" aria-hidden="true">
              <Glyph name="book" />
            </span>
            <div className="tl-card">
              <p className="tl-meta">
                <time>{fmt(t.start)}</time>
                {t.current ? " · Current term" : ""}
              </p>
              <h4>{t.term}</h4>
              <ul className="tl-courses">
                {t.courses.map((c) => (
                  <li key={c.name}>
                    <span className="tl-course">
                      {c.code && <span className="tl-code">{c.code}</span>}
                      {c.name}
                      {c.vault && (
                        <button type="button" className="link tl-vault" onClick={() => onOpen("vault")}>
                          <Glyph name="lock" /> Notes
                        </button>
                      )}
                    </span>
                    {c.topics && (
                      <details className="tl-topics">
                        <summary>{c.topics.length} topics covered</summary>
                        <Chips items={c.topics} label="Topics" />
                      </details>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

export function TimelineApp({ onOpen }: { onOpen: (id: WindowId) => void }) {
  const [view, setView] = useState<"career" | "academic">("career");
  return (
    <div className="timeline-app">
      <div className="tl-switch" role="tablist" aria-label="Timeline">
        <button type="button" role="tab" aria-selected={view === "career"} onClick={() => setView("career")}>
          Career &amp; Projects
        </button>
        <button type="button" role="tab" aria-selected={view === "academic"} onClick={() => setView("academic")}>
          Academic
        </button>
      </div>
      {view === "career" ? <CareerTimeline onOpen={onOpen} /> : <AcademicTimeline onOpen={onOpen} />}
    </div>
  );
}
