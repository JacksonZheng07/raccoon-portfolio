"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { Glyph } from "./glyphs";

const USER = "JacksonZheng07";
const API = "https://api.github.com";
const HTML = "application/vnd.github.html";

// GitHub's pages refuse to be framed, so the app reads the public API (60 requests an hour per visitor) instead.
const cache = new Map<string, Promise<unknown>>();

function gh<T>(path: string, accept = "application/vnd.github+json"): Promise<T> {
  const key = `${accept} ${path}`;
  let request = cache.get(key);
  if (!request) {
    request = fetch(`${API}${path}`, { headers: { Accept: accept } }).then((r) => {
      if (r.status === 403 || r.status === 429) {
        throw new Error("GitHub's hourly limit for visitors was reached. Try again in a few minutes.");
      }
      if (!r.ok) throw new Error(`GitHub answered ${r.status}.`);
      return accept === HTML ? r.text() : r.json();
    });
    request.catch(() => cache.delete(key));
    cache.set(key, request);
  }
  return request as Promise<T>;
}

function useGh<T>(path: string, accept?: string) {
  const [state, setState] = useState<{ path: string; data?: T; error?: string }>({ path });
  useEffect(() => {
    let live = true;
    gh<T>(path, accept).then(
      (data) => live && setState({ path, data }),
      (e: Error) => live && setState({ path, error: e.message }),
    );
    return () => {
      live = false;
    };
  }, [path, accept]);
  return state.path === path ? state : { path };
}

type User = { avatar_url: string; name: string | null; bio: string | null; public_repos: number; followers: number };
type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  pushed_at: string;
  homepage: string | null;
  html_url: string;
};
type Commit = { sha: string; commit: { message: string; author: { date: string } } };

const date = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

function Status({ error }: { error?: string }) {
  return <p className="gh-status">{error ?? "Loading…"}</p>;
}

function Profile({ onOpen }: { onOpen: (repo: string) => void }) {
  const user = useGh<User>(`/users/${USER}`);
  const repos = useGh<Repo[]>(`/users/${USER}/repos?sort=pushed&per_page=100`);

  return (
    <div className="gh-page">
      {user.data ? (
        <header className="gh-profile">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, remote avatar */}
          <img src={user.data.avatar_url} alt="" width={72} height={72} />
          <div>
            <h3>{user.data.name ?? USER}</h3>
            <p className="muted">@{USER}</p>
            {user.data.bio && <p>{user.data.bio}</p>}
            <p className="muted">
              {user.data.public_repos} repositories · {user.data.followers} followers
            </p>
          </div>
        </header>
      ) : (
        <Status error={user.error} />
      )}

      <h4>Repositories</h4>
      {repos.data ? (
        <ul className="gh-repos">
          {repos.data
            .filter((r) => !r.fork)
            .map((r) => (
              <li key={r.name}>
                <button type="button" onClick={() => onOpen(`${USER}/${r.name}`)}>
                  <strong>{r.name}</strong>
                  {r.description && <span>{r.description}</span>}
                  <span className="gh-meta">
                    {r.language && <>{r.language} · </>}★ {r.stargazers_count} · updated {date.format(new Date(r.pushed_at))}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      ) : (
        <Status error={repos.error} />
      )}
    </div>
  );
}

/** `name` is owner/repo: some projects live under teammates' accounts. */
function RepoPage({ name, onOpen }: { name: string; onOpen: (repo: string) => void }) {
  const repo = useGh<Repo>(`/repos/${name}`);
  const languages = useGh<Record<string, number>>(`/repos/${name}/languages`);
  const commits = useGh<Commit[]>(`/repos/${name}/commits?per_page=6`);
  const readme = useGh<string>(`/repos/${name}/readme`, HTML);

  const total = Object.values(languages.data ?? {}).reduce((a, b) => a + b, 0);

  // README links to a repository stay in the app; anything else gets its own tab.
  function onReadmeClick(e: MouseEvent<HTMLDivElement>) {
    const link = (e.target as Element).closest("a");
    const href = link?.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    e.preventDefault();
    const repoLink = href.match(/^https:\/\/github\.com\/([\w.-]+\/[\w.-]+)\/?$/i);
    if (repoLink?.[1]) onOpen(repoLink[1]);
    else window.open(new URL(href, `https://github.com/${name}/blob/HEAD/`).href, "_blank", "noopener");
  }

  if (!repo.data) {
    return (
      <Status
        error={repo.error === "GitHub answered 404." ? "This repository is private, so GitHub only shows it to its owner." : repo.error}
      />
    );
  }

  return (
    <div className="gh-page">
      <header className="gh-repo-head">
        <h3>
          <span className="muted">{name.split("/")[0]} /</span> {repo.data.name}
        </h3>
        {repo.data.description && <p>{repo.data.description}</p>}
        <p className="gh-meta">
          ★ {repo.data.stargazers_count} stars · {repo.data.forks_count} forks · last push{" "}
          {date.format(new Date(repo.data.pushed_at))}
        </p>
      </header>

      {total > 0 && (
        <>
          <div className="gh-langbar" aria-hidden="true">
            {Object.entries(languages.data ?? {}).map(([lang, bytes], i) => (
              <span key={lang} style={{ flexGrow: bytes, background: `hsl(${(i * 67 + 210) % 360} 70% 60%)` }} />
            ))}
          </div>
          <p className="gh-meta">
            {Object.entries(languages.data ?? {})
              .map(([lang, bytes]) => `${lang} ${((bytes / total) * 100).toFixed(1)}%`)
              .join(" · ")}
          </p>
        </>
      )}

      <h4>Recent commits</h4>
      {commits.data ? (
        <ul className="gh-commits">
          {commits.data.map((c) => (
            <li key={c.sha}>
              <code>{c.sha.slice(0, 7)}</code>
              <span>{c.commit.message.split("\n")[0]}</span>
              <span className="muted">{date.format(new Date(c.commit.author.date))}</span>
            </li>
          ))}
        </ul>
      ) : (
        <Status error={commits.error} />
      )}

      <h4>README</h4>
      {readme.data ? (
        // GitHub sanitises rendered READMEs before serving them.
        <div className="readme" onClick={onReadmeClick} dangerouslySetInnerHTML={{ __html: readme.data }} />
      ) : (
        <Status error={readme.error === "GitHub answered 404." ? "This repository has no README." : readme.error} />
      )}
    </div>
  );
}

export function GithubApp({ repo, onNavigate }: { repo: string | null; onNavigate: (repo: string | null) => void }) {
  const address = `github.com/${repo ?? USER}`;
  return (
    <div className="gh">
      <div className="gh-toolbar">
        <button type="button" className="icon-button" disabled={repo === null} onClick={() => onNavigate(null)} aria-label="Back to profile">
          <Glyph name="back" />
        </button>
        <span className="gh-address">{address}</span>
        <a className="icon-button" href={`https://${address}`} target="_blank" rel="noreferrer" title="Open on github.com" aria-label="Open on github.com">
          <Glyph name="external" />
        </a>
      </div>
      <div className="gh-scroll">
        {repo ? <RepoPage key={repo} name={repo} onOpen={onNavigate} /> : <Profile onOpen={onNavigate} />}
      </div>
    </div>
  );
}
