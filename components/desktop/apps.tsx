"use client";

import { useEffect, useState } from "react";
import type { Note } from "@/lib/notes";
import type { SyncRecord } from "@/lib/sync";
import { AUTHOR_EMAIL, AUTHOR_GITHUB, SITE_NAME } from "@/lib/site";
import { AppIcon } from "./icons";
import type { DesktopProject, WindowId } from "./types";

const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
const longDate = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });

function formatRange(start: string, end: string): string {
  const a = monthYear.format(new Date(start));
  const b = monthYear.format(new Date(end));
  return a === b ? a : `${a} – ${b}`;
}

/** The version is the date of the last Notion pull: 26.9.10. */
export function osVersion(sync: SyncRecord): string {
  const d = new Date(sync.syncedAt);
  return `${d.getUTCFullYear() % 100}.${d.getUTCMonth() + 1}.${d.getUTCDate()}`;
}

export function FinderApp({
  projects,
  onOpen,
}: {
  projects: DesktopProject[];
  onOpen: (slug: string) => void;
}) {
  const domains = [...new Set(projects.map((p) => p.domain))];
  const [filter, setFilter] = useState<string>("All");
  const shown = filter === "All" ? projects : projects.filter((p) => p.domain === filter);

  return (
    <div className="finder">
      <aside className="sidebar" aria-label="Filter projects">
        <p className="sidebar-heading">Favorites</p>
        {["All", ...domains].map((d) => (
          <button key={d} type="button" aria-pressed={filter === d} onClick={() => setFilter(d)}>
            {d === "All" ? "All Projects" : d}
          </button>
        ))}
      </aside>
      <div className="finder-main">
        <ul className="finder-grid">
          {shown.map((p) => (
            <li key={p.slug}>
              <button type="button" className="finder-item" onClick={() => onOpen(p.slug)} title={p.tagline}>
                <AppIcon kind="folder" />
                <span>{p.name}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="statusbar">
          {shown.length} items · click a folder to open it
        </p>
      </div>
    </div>
  );
}

export function ProjectApp({ project }: { project: DesktopProject }) {
  return (
    <article className="doc">
      <p className="doc-meta">
        {project.domain} · {formatRange(project.start, project.end)}
        {project.priority === "Flagship" ? " · Flagship" : ""}
      </p>
      <h3 className="doc-title">{project.name}</h3>
      <p className="doc-lede">{project.tagline}</p>
      <ul className="chips" aria-label="Skills">
        {project.skills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <a className="button" href={project.repo} target="_blank" rel="noreferrer">
        View source on GitHub ↗
      </a>

      <h4>Overview</h4>
      <p>{project.overview}</p>

      {project.contributions.length > 0 && (
        <>
          <h4>What I did</h4>
          <ul>
            {project.contributions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </>
      )}

      {project.timeline.length > 0 && (
        <>
          <h4>Timeline</h4>
          <ol className="timeline">
            {project.timeline.map((t) => (
              <li key={`${t.date}${t.what}`}>
                <span className="timeline-date">{t.date}</span>
                <span>
                  <strong>{t.what}</strong> {t.how}
                </span>
              </li>
            ))}
          </ol>
        </>
      )}

      {project.technical.map((section) => (
        <section key={section.area}>
          <h4>{section.area}</h4>
          <ul>
            {section.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ))}

      {project.architecture.length > 0 && (
        <>
          <h4>Architecture</h4>
          <ol>
            {project.architecture.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ol>
        </>
      )}

      {project.followUps.length > 0 && (
        <>
          <h4>Known issues in this release</h4>
          <ul>
            {project.followUps.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}

export function NotesApp({ notes }: { notes: Note[] }) {
  const [slug, setSlug] = useState(notes[0]?.slug);
  const note = notes.find((n) => n.slug === slug);

  return (
    <div className="notes">
      <aside className="notes-list" aria-label="All notes">
        {notes.map((n) => (
          <button key={n.slug} type="button" aria-pressed={n.slug === slug} onClick={() => setSlug(n.slug)}>
            <strong>{n.title}</strong>
            <span>
              {longDate.format(new Date(n.date))} · {n.dek}
            </span>
          </button>
        ))}
      </aside>
      {note && (
        <article className="note-body">
          <p className="doc-meta">
            {longDate.format(new Date(note.date))} · {note.readingMinutes} min read
          </p>
          <h3 className="doc-title">{note.title}</h3>
          {note.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </article>
      )}
    </div>
  );
}

export function AboutApp({
  projects,
  sync,
  onOpen,
}: {
  projects: DesktopProject[];
  sync: SyncRecord;
  onOpen: (id: WindowId) => void;
}) {
  return (
    <div className="about">
      <div className="about-avatar" aria-hidden="true">
        JZ
      </div>
      <h3>Jackson Zheng</h3>
      <p className="about-sub">CS + Math · Northeastern</p>
      <dl className="specs">
        <dt>Currently</dt>
        <dd>AI-assisted internal tooling at Foxfield</dd>
        <dt>Flagship</dt>
        <dd>
          <button type="button" className="link" onClick={() => onOpen("project:pystruct")}>
            PyStruct
          </button>
          , a Python-inspired runtime written from the tokenizer up
        </dd>
        <dt>Installed</dt>
        <dd>{projects.length} projects</dd>
        <dt>Software</dt>
        <dd>
          {SITE_NAME} {osVersion(sync)}
        </dd>
      </dl>
      <p className="about-intro">
        I wrote a Python-inspired runtime because reading about parsers stopped
        being enough. Every project here says what broke, what I decided, and
        what actually shipped.
      </p>
      <div className="about-actions">
        <button type="button" className="button" onClick={() => onOpen("finder")}>
          Browse Projects…
        </button>
        <a className="button" href={`mailto:${AUTHOR_EMAIL}`}>
          Email
        </a>
        <a className="button" href={AUTHOR_GITHUB} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
    </div>
  );
}

export function UpdateApp({
  projects,
  sync,
  onOpen,
}: {
  projects: DesktopProject[];
  sync: SyncRecord;
  onOpen: (id: WindowId) => void;
}) {
  const [checking, setChecking] = useState(false);
  useEffect(() => {
    if (!checking) return;
    const timer = window.setTimeout(() => setChecking(false), 1400);
    return () => window.clearTimeout(timer);
  }, [checking]);

  const history = [...projects].sort((a, b) => b.end.localeCompare(a.end));

  return (
    <div className="update">
      <div className="update-head">
        <AppIcon kind="update" />
        <div>
          <h3>
            {SITE_NAME} {osVersion(sync)}
          </h3>
          <p role="status">
            {checking
              ? "Checking for updates…"
              : `Up to date. Last pulled from Notion on ${longDate.format(new Date(sync.syncedAt))}.`}
          </p>
        </div>
        <button type="button" className="button" disabled={checking} onClick={() => setChecking(true)}>
          {checking ? <span className="spinner" aria-hidden="true" /> : "Check Now"}
        </button>
      </div>

      <p className="update-source">
        Updates install from the <strong>Project Index</strong> in Notion. When
        a page there changes, a nightly job pulls it into the site.
      </p>

      <h4>In this update</h4>
      {sync.changes.length === 0 ? (
        <p className="muted">Every project is current with Notion.</p>
      ) : (
        <ul className="update-list">
          {sync.changes.map((c) => (
            <li key={c.slug}>
              <button type="button" className="link" onClick={() => onOpen(`project:${c.slug}`)}>
                {c.name}
              </button>
              <span className="badge">{c.kind === "new" ? "New" : "Updated"}</span>
            </li>
          ))}
        </ul>
      )}

      <h4>Release history</h4>
      <ul className="update-list">
        {history.map((p) => (
          <li key={p.slug}>
            <button type="button" className="link" onClick={() => onOpen(`project:${p.slug}`)}>
              {p.name}
            </button>
            <span className="muted">{monthYear.format(new Date(p.end))}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
