"use client";

import { useState } from "react";
import data from "@/content/timeline.json";
import { Glyph, type GlyphName } from "./glyphs";
import type { WindowId } from "./types";

type Kind = "work" | "project" | "award" | "course";
type Course = { code: string; name: string; topics?: string[] };
type Entry = {
  kind: Kind;
  start: string;
  end?: string;
  title: string;
  org: string;
  slug?: string;
  points?: string[];
  stack?: string[];
  courses?: Course[];
};

const entries = data.entries as Entry[];
const KINDS: Record<Kind, { label: string; glyph: GlyphName }> = {
  work: { label: "Work", glyph: "briefcase" },
  project: { label: "Project", glyph: "code" },
  award: { label: "Award", glyph: "star" },
  course: { label: "Coursework", glyph: "book" },
};
const FILTERS: { id: "all" | Kind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "work", label: "Work" },
  { id: "project", label: "Projects" },
  { id: "award", label: "Awards" },
  { id: "course", label: "Coursework" },
];

const month = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
const fmt = (ym: string) => month.format(new Date(`${ym}-01`));
function span(e: Entry): string {
  if (!e.end) return fmt(e.start);
  return `${fmt(e.start)} – ${e.end === "present" ? "Present" : fmt(e.end)}`;
}

export function TimelineApp({ onOpen }: { onOpen: (id: WindowId) => void }) {
  const [filter, setFilter] = useState<"all" | Kind>("all");
  // Projects and awards are both things built; the Projects filter shows both.
  const shown = entries.filter(
    (e) => filter === "all" || e.kind === filter || (filter === "project" && e.kind === "award"),
  );
  const edu = data.education;

  return (
    <div className="timeline-app">
      <div className="tl-head">
        <div className="tl-edu">
          <p className="tl-eyebrow">Education</p>
          <h3>{edu.school}</h3>
          <p>
            {edu.degree} · expected {edu.expected}
          </p>
          <ul className="tl-chips" aria-label="Honors">
            {edu.honors.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
        <div className="segmented tl-filter" role="group" aria-label="Show">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
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
              {e.courses && (
                <ul className="tl-courses">
                  {e.courses.map((c) => (
                    <li key={c.code}>
                      <span className="tl-code">{c.code}</span> {c.name}
                      {c.topics && (
                        <details className="tl-topics">
                          <summary>{c.topics.length} topics covered</summary>
                          <ul className="tl-chips">
                            {c.topics.map((t) => (
                              <li key={t}>{t}</li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {(e.stack || e.slug) && (
                <div className="tl-foot">
                  {e.stack && (
                    <ul className="tl-chips" aria-label="Stack">
                      {e.stack.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  )}
                  {e.slug && (
                    <button type="button" className="link" onClick={() => onOpen(`project:${e.slug}`)}>
                      Open project
                    </button>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      <p className="tl-earlier">
        Earlier coursework: {edu.coursework.join(", ")}.
      </p>
    </div>
  );
}
