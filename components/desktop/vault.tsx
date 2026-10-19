"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Glyph } from "./glyphs";
import { Markdown } from "./markdown";
import { lock, openFile, reopen, unlock, type VaultCourse, type VaultFile } from "./vault-crypto";

type Opened = { file: VaultFile; url: string; text?: string };

const size = (bytes: number) => (bytes > 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1000))} KB`);

export function VaultApp() {
  const [courses, setCourses] = useState<VaultCourse[] | null>(null);
  const [state, setState] = useState<"checking" | "locked" | "unlocking" | "wrong" | "error">("checking");
  const [password, setPassword] = useState("");
  const [courseId, setCourseId] = useState<string | null>(null);
  const [tab, setTab] = useState<"notes" | "files">("notes");
  const [opened, setOpened] = useState<Opened | null>(null);

  // Reopening the window in the same page load stays unlocked.
  useEffect(() => {
    reopen()
      .then((c) => (c ? setCourses(c) : setState("locked")))
      .catch(() => setState("locked"));
  }, []);

  useEffect(() => () => void (opened && URL.revokeObjectURL(opened.url)), [opened]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!password) return;
    setState("unlocking");
    try {
      setCourses(await unlock(password));
      setPassword("");
    } catch (err) {
      setState(err instanceof Error && err.message === "wrong-password" ? "wrong" : "error");
    }
  }

  async function view(file: VaultFile) {
    const blob = await openFile(file);
    const url = URL.createObjectURL(blob);
    setOpened({ file, url, text: file.type.startsWith("text/") ? await blob.text() : undefined });
  }

  if (!courses) {
    return (
      <form className="vault-lock" onSubmit={submit}>
        <span className="vault-lock-icon">
          <Glyph name="lock" />
        </span>
        <h3>Class Notes</h3>
        <p>This vault is encrypted. Enter the password to open it.</p>
        <input
          type="password"
          aria-label="Vault password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (state === "wrong") setState("locked");
          }}
          data-wrong={state === "wrong"}
          disabled={state === "checking" || state === "unlocking"}
          autoFocus
        />
        <button type="submit" className="button button-primary" disabled={!password || state === "unlocking"}>
          {state === "unlocking" ? <span className="spinner" aria-hidden="true" /> : "Unlock"}
        </button>
        <p className="vault-status" role="status">
          {state === "wrong" ? "That password didn't open the vault." : state === "error" ? "The vault couldn't be loaded. Try again." : ""}
        </p>
      </form>
    );
  }

  const course = courses.find((c) => c.id === courseId) ?? courses[0];
  const terms = [...new Set(courses.map((c) => c.term))];

  return (
    <div className="vault">
      <aside className="sidebar" aria-label="Courses">
        {terms.map((term) => (
          <div key={term}>
            <p className="sidebar-heading">{term}</p>
            {courses
              .filter((c) => c.term === term)
              .map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={c.id === course?.id}
                  onClick={() => {
                    setCourseId(c.id);
                    setOpened(null);
                  }}
                >
                  <span className="vault-code">{c.code}</span>
                  <span className="vault-name">{c.name}</span>
                </button>
              ))}
          </div>
        ))}
      </aside>

      {course && (
        <section className="vault-main" aria-label={`${course.code} ${course.name}`}>
          <div className="vault-bar">
            <div className="segmented" role="group" aria-label="Show">
              <button type="button" aria-pressed={tab === "notes"} onClick={() => setTab("notes")}>
                Notes
              </button>
              <button
                type="button"
                aria-pressed={tab === "files"}
                onClick={() => {
                  setTab("files");
                  setOpened(null);
                }}
              >
                Files · {course.files.length}
              </button>
            </div>
            <button
              type="button"
              className="button"
              onClick={() => {
                lock();
                setCourses(null);
                setOpened(null);
                setState("locked");
              }}
            >
              <Glyph name="lock" /> Lock
            </button>
          </div>

          {tab === "notes" ? (
            <article className="doc vault-notes" tabIndex={0} aria-label={`${course.code} notes`}>
              <p className="doc-meta">
                {course.code} · {course.term}
              </p>
              {course.notes ? <Markdown source={course.notes} /> : <p className="muted">No notes for this course yet.</p>}
            </article>
          ) : opened ? (
            <div className="vault-viewer">
              <button type="button" className="link" onClick={() => setOpened(null)}>
                ‹ All files
              </button>
              {opened.text !== undefined ? (
                <pre className="vault-text">{opened.text}</pre>
              ) : (
                <iframe className="vault-pdf" src={opened.url} title={opened.file.name} />
              )}
            </div>
          ) : (
            <ul className="vault-files">
              {course.files.map((f) => (
                <li key={f.blob}>
                  <button type="button" onClick={() => void view(f)}>
                    <Glyph name={f.type === "application/pdf" ? "doc" : "code"} />
                    <span>{f.name}</span>
                    <span className="muted">{size(f.size)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
