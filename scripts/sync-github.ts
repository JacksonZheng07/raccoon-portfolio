/**
 * Pull each project's commit activity into content/github.json.
 *
 *   GITHUB_TOKEN=... npm run sync:github
 *
 * Build-time on purpose: the browser gets 60 unauthenticated GitHub calls an
 * hour, and this widget alone needs twenty. Private repos are recorded as
 * "private" and nothing else about them is written.
 */

import { writeFileSync } from "node:fs";
import path from "node:path";
import { getAllProjects } from "../lib/projects";

const OUT = path.join(process.cwd(), "content", "github.json");
const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

type Activity = { weeks: number[]; pushedAt: string } | "private";

async function get(url: string): Promise<Response> {
  // GitHub answers 202 while it computes stats; it settles within a few tries.
  for (let attempt = 0; attempt < 6; attempt++) {
    const r = await fetch(url, { headers });
    if (r.status !== 202) return r;
    await new Promise((done) => setTimeout(done, 3000));
  }
  throw new Error(`${url} still computing after 6 tries`);
}

async function activity(repo: string): Promise<Activity | undefined> {
  const meta = await get(`https://api.github.com/repos/${repo}`);
  if (meta.status === 404) return "private";
  if (!meta.ok) throw new Error(`${repo}: GitHub answered ${meta.status}`);
  const info = (await meta.json()) as { private: boolean; pushed_at: string };
  if (info.private) return "private";

  const stats = await get(`https://api.github.com/repos/${repo}/stats/commit_activity`);
  if (!stats.ok) throw new Error(`${repo} stats: GitHub answered ${stats.status}`);
  const weeks = ((await stats.json()) as { total: number }[]).map((w) => w.total);
  return { weeks, pushedAt: info.pushed_at };
}

async function main(): Promise<void> {
  const repos: Record<string, Activity> = {};
  for (const project of getAllProjects()) {
    const repo = project.repo.replace("https://github.com/", "");
    const result = await activity(repo);
    if (result) repos[project.slug] = result;
    console.log(`${project.slug}: ${result === "private" ? "private" : `${result?.weeks.reduce((a, b) => a + b, 0)} commits`}`);
  }
  writeFileSync(OUT, `${JSON.stringify({ repos }, null, 2)}\n`, "utf8");
  console.log(`Wrote content/github.json`);
}

main().catch((cause: unknown) => {
  console.error(cause instanceof Error ? cause.message : cause);
  process.exit(1);
});
