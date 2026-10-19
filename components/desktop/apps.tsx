"use client";

import { useEffect, useState } from "react";
import type { Note } from "@/lib/notes";
import type { SyncRecord } from "@/lib/sync";
import { AUTHOR_EMAIL, SITE_NAME, SOURCE_REPO } from "@/lib/site";
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

export function ProjectApp({
  project,
  onOpenRepo,
  onOpenUrl,
}: {
  project: DesktopProject;
  onOpenRepo: (repo: string) => void;
  onOpenUrl: (url: string) => void;
}) {
  return (
    <article className="doc">
      <p className="doc-meta">
        {project.domain} · {formatRange(project.start, project.end)}
      </p>
      <h3 className="doc-title">{project.name}</h3>
      <p className="doc-lede">{project.tagline}</p>
      <ul className="chips" aria-label="Skills">
        {project.skills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <button type="button" className="button" onClick={() => onOpenRepo(project.repo.replace("https://github.com/", ""))}>
        View source on GitHub
      </button>
      {project.demo && (
        <button type="button" className="button button-primary" onClick={() => onOpenUrl(project.demo!)}>
          Open live app
        </button>
      )}

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

export function NotesApp({ notes, request }: { notes: Note[]; request: { slug: string; n: number } | null }) {
  const [slug, setSlug] = useState(request?.slug ?? notes[0]?.slug);
  const requested = request?.slug;
  const requestN = request?.n;
  useEffect(() => {
    if (requested) setSlug(requested);
  }, [requested, requestN]);
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
      <svg className="about-laptop" viewBox="0 0 200 120" aria-hidden="true">
        <defs>
          <linearGradient id="about-screen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7cc0ff" />
            <stop offset="1" stopColor="#3b7fe0" />
          </linearGradient>
        </defs>
        <rect x="34" y="6" width="132" height="90" rx="6" fill="#1c1c1e" stroke="#5a5a5e" />
        <rect x="40" y="12" width="120" height="78" rx="2" fill="url(#about-screen)" />
        <rect x="92" y="6" width="16" height="4" rx="2" fill="#1c1c1e" />
        <path d="M10 98h180l-6 8H16z" fill="#9a9aa0" />
        <rect x="86" y="98" width="28" height="3" rx="1.5" fill="#6e6e73" />
      </svg>
      <h3>Jackson Zheng</h3>
      <p className="about-sub">CS + Math, Northeastern</p>
      <dl className="specs">
        <dt>Currently</dt>
        <dd>AI-assisted internal tooling at Foxfield</dd>
        <dt>Featured</dt>
        <dd>
          <button type="button" className="link" onClick={() => onOpen("project:pystruct")}>
            PyStruct
          </button>
          , a runtime from the tokenizer up
        </dd>
        <dt>Projects</dt>
        <dd>{projects.length} installed</dd>
        <dt>GitHub</dt>
        <dd>
          <button type="button" className="link" onClick={() => onOpen("github")}>
            @JacksonZheng07
          </button>
        </dd>
        <dt>Software</dt>
        <dd>
          {SITE_NAME} {osVersion(sync)}
        </dd>
      </dl>
      <div className="about-actions">
        <button type="button" className="button" onClick={() => onOpen("finder")}>
          More Info…
        </button>
        <button type="button" className="button" onClick={() => onOpen("mail")}>
          Contact
        </button>
      </div>
      <p className="about-legal">™ and © 2026 Jackson Zheng. All Rights Reserved.</p>
    </div>
  );
}

export function TrashApp({ onOpenRepo }: { onOpenRepo: (repo: string) => void }) {
  return (
    <div className="finder">
      <aside className="sidebar" aria-label="Locations">
        <p className="sidebar-heading">Favorites</p>
        <button type="button" aria-pressed="true">
          Trash
        </button>
      </aside>
      <div className="finder-main">
        <ul className="finder-grid">
          <li>
            <button
              type="button"
              className="finder-item"
              title="The raccoon field-notebook theme this site replaced"
              onClick={() => onOpenRepo("JacksonZheng07/raccoon-portfolio")}
            >
              <AppIcon kind="doc" />
              <span>Field Notes (raccoon theme)</span>
            </button>
          </li>
        </ul>
        <p className="statusbar">1 item · moved to the Trash Oct 18, 2026</p>
      </div>
    </div>
  );
}

export function MailApp({ onOpen }: { onOpen: (id: WindowId) => void }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(AUTHOR_EMAIL);
      setCopied(true);
    } catch {
      document.getSelection()?.selectAllChildren(document.getElementById("mail-address")!);
    }
  }

  return (
    <div className="mail">
      <div className="about-avatar" aria-hidden="true">
        JZ
      </div>
      <h3>Jackson Zheng</h3>
      <p className="about-sub">CS + Math · Northeastern</p>
      <dl className="specs">
        <dt>Email</dt>
        <dd id="mail-address">{AUTHOR_EMAIL}</dd>
        <dt>GitHub</dt>
        <dd>
          <button type="button" className="link" onClick={() => onOpen("github")}>
            @JacksonZheng07
          </button>
        </dd>
      </dl>
      <div className="about-actions">
        <button type="button" className="button" onClick={copy}>
          {copied ? "Copied" : "Copy email"}
        </button>
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
  const [status, setStatus] = useState<"idle" | "checking" | "current" | "available" | "failed">("idle");

  // The live check: is the sync record on main newer than the one this page was built from?
  async function check() {
    setStatus("checking");
    try {
      const r = await fetch(`https://raw.githubusercontent.com/${SOURCE_REPO}/main/content/sync.json`, { cache: "no-store" });
      if (!r.ok) throw new Error();
      const latest = (await r.json()) as { syncedAt: string };
      setStatus(Date.parse(latest.syncedAt) > Date.parse(sync.syncedAt) ? "available" : "current");
    } catch {
      setStatus("failed");
    }
  }

  const message = {
    idle: `Up to date. Last pulled from Notion on ${longDate.format(new Date(sync.syncedAt))}.`,
    checking: "Checking for updates…",
    current: "Jackson OS is up to date.",
    available: "A newer version is available.",
    failed: "Couldn't reach the update server. Try again later.",
  }[status];

  const history = [...projects].sort((a, b) => b.end.localeCompare(a.end));

  return (
    <div className="update">
      <div className="update-head">
        <AppIcon kind="update" />
        <div>
          <h3>
            {SITE_NAME} {osVersion(sync)}
          </h3>
          <p role="status">{message}</p>
        </div>
        {status === "available" ? (
          <button type="button" className="button button-primary" onClick={() => window.location.reload()}>
            Update Now
          </button>
        ) : (
          <button type="button" className="button" disabled={status === "checking"} onClick={check}>
            {status === "checking" ? <span className="spinner" aria-hidden="true" /> : "Check Now"}
          </button>
        )}
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
