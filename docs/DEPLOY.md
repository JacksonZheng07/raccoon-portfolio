# Deploying raccoon-portfolio

The site is a Next.js static export (`output: "export"`). A build produces a
plain directory of HTML, CSS, JS and images in `out/` with no server component
at runtime, so it can be served by anything that serves files. Today that is
GitHub Pages.

## How the deploy works

`.github/workflows/deploy.yml` runs on every push to `main`, and can also be
started by hand from the Actions tab (`workflow_dispatch`).

It has two jobs:

1. **build** — checks out, installs Node 22 with an npm cache, runs
   `actions/configure-pages`, `npm ci`, then `npm run build` with
   `BASE_PATH=/raccoon-portfolio`, and uploads `out/` with
   `actions/upload-pages-artifact`.
2. **deploy** — takes that artifact and publishes it with
   `actions/deploy-pages` into the `github-pages` environment. The deployed URL
   shows up as the environment URL on the run.

The workflow requests `contents: read`, `pages: write` and `id-token: write`.
The OIDC token (`id-token`) is what `deploy-pages` uses to prove to GitHub Pages
that it is allowed to publish; without it the deploy step fails even though the
build succeeded.

Deploys are serialized by `concurrency: { group: pages, cancel-in-progress: true }`.
Two quick pushes will not race each other into the same environment; the older
run is cancelled and the newer one wins.

CI (`.github/workflows/ci.yml`) is separate and still runs lint, typecheck,
tests and a default build on pull requests. Deploy does not re-run the test
suite — a red PR should never have reached `main`.

## `basePath`, and why `BASE_PATH` exists

`next.config.ts` reads `BASE_PATH` from the environment:

```ts
const basePath = process.env.BASE_PATH ?? "";
```

A GitHub Pages *project* site is served from a subdirectory —
`jacksonzheng07.github.io/raccoon-portfolio` — so every absolute URL the build
emits has to be prefixed with `/raccoon-portfolio`. An apex domain
(`jacksonzheng.me`) serves from the root, so the prefix has to be empty. Same
codebase, one environment variable.

Verified with a real build:

```
$ BASE_PATH=/raccoon-portfolio npm run build
$ grep -o '/raccoon-portfolio/_next/[^"]*' out/index.html | sort -u
/raccoon-portfolio/_next/static/chunks/691ae7b9-1bedd4beb93f6132.js
/raccoon-portfolio/_next/static/chunks/987-a5fbf73cad0a2cca.js
/raccoon-portfolio/_next/static/chunks/main-app-0af8803c05bb67d0.js
/raccoon-portfolio/_next/static/chunks/polyfills-42372ed130431b0a.js
/raccoon-portfolio/_next/static/chunks/webpack-d2c17cdbf1a616a0.js
/raccoon-portfolio/_next/static/css/366e6e024941cc31.css
$ grep -o '"/_next/[^"]*' out/index.html     # no output: nothing left unprefixed
```

`basePath` covers what Next.js generates itself: `_next/*` asset URLs, `<Link>`
hrefs, the router, and `next/image` sources. It does **not** rewrite string
literals you write by hand. A raw `<img src="/assets/photos/raccoon.jpg">` or a
`url(/assets/…)` in CSS will 404 on the project site. For those, use
`next/image` or `<Link>`, or prefix with the exposed
`process.env.NEXT_PUBLIC_BASE_PATH` (set from the same value in
`next.config.ts`). Worth checking whenever a hand-written absolute path is added
under `app/` or `components/`.

## `public/.nojekyll` — do not delete this file

GitHub Pages was originally a Jekyll host, and Jekyll **excludes every file and
directory whose name starts with an underscore**. Next.js puts all of its
compiled assets in `_next/`. Publish a Next.js export to Pages without opting
out of Jekyll and you get a site that returns 200 for the HTML and 404 for all
of its CSS and JavaScript: unstyled, dead, with a completely green build log and
nothing in the Actions output to suggest anything went wrong.

The fix is an empty file named `.nojekyll` at the root of the published
directory. It lives at `public/.nojekyll` so that `next build` copies it into
`out/.nojekyll` on every export. The build step in `deploy.yml` asserts
`test -f out/.nojekyll` so that if the file ever disappears the deploy fails
loudly instead of shipping a broken site.

(In practice `actions/upload-pages-artifact` skips the Jekyll stage anyway, but
that is an implementation detail of the action, not a guarantee of Pages. The
file costs nothing and removes the failure mode entirely.)

## One-time setup a human has to do in the GitHub UI

Actions cannot enable Pages for a repository on their own. Someone with admin
rights on `JacksonZheng07/raccoon-portfolio` must:

1. Go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
   (not "Deploy from a branch").

That is the whole setup. Until it is done, `actions/configure-pages` /
`actions/deploy-pages` fail with an error about Pages not being enabled for the
repository. There is nothing to fix in the workflow when that happens — flip
the setting and re-run the workflow from the Actions tab.

Two things to check if the deploy step still fails:

- **Settings → Actions → General → Workflow permissions** must not be set in a
  way that blocks the workflow's own `permissions:` block. The per-workflow
  block above is what grants `pages: write`, but an org-level restriction can
  still override it.
- If the repository is under an organization with an environment protection
  rule on `github-pages`, a deploy may sit waiting for a manual approval.

The site is public, so no further access configuration is needed.

## Moving to a custom apex domain (jacksonzheng.me)

Three things change, in this order.

### 1. DNS at the registrar

For an **apex** domain (`jacksonzheng.me`, no subdomain), create four `A`
records and four `AAAA` records on `@`, all pointing at GitHub's Pages servers:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

These were read from GitHub's current documentation, "Managing a custom domain
for your GitHub Pages site". They have been stable for years, but they are
GitHub infrastructure and GitHub can change them — **re-read that page before
entering them** rather than trusting this table:
<https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site>

Do not use a `CNAME` on the apex — `CNAME` at a zone apex is not valid DNS.
(Some providers offer `ALIAS`/`ANAME`/"CNAME flattening" as a workaround; the
A/AAAA records above are the supported path.)

If `www.jacksonzheng.me` should also work, add one `CNAME` record for `www`
pointing at `jacksonzheng07.github.io.` — a subdomain does use `CNAME`.

Verify propagation before moving on:

```sh
dig +short jacksonzheng.me A
dig +short jacksonzheng.me AAAA
```

### 2. GitHub Pages settings

**Settings → Pages → Custom domain**: enter `jacksonzheng.me` and save. GitHub
will run a DNS check, then provision a Let's Encrypt certificate. Once that
finishes, tick **Enforce HTTPS**. Provisioning can take up to an hour; the
checkbox stays disabled until the certificate exists.

Entering the domain here makes GitHub commit a `CNAME` file containing
`jacksonzheng.me` to the published site. With `Source: GitHub Actions` there is
no publishing branch for it to live on, so it must instead be part of the
build output — otherwise the next deploy overwrites the domain configuration
and the custom domain silently reverts. Add it to the repository as:

```
public/CNAME     # one line, no scheme, no trailing slash:  jacksonzheng.me
```

`next build` copies `public/` verbatim into `out/`, so `out/CNAME` ships on
every deploy and the setting sticks.

### 3. The workflow

Drop the `BASE_PATH` prefix so the export targets the root. In
`.github/workflows/deploy.yml`, replace the build step's `env:` block:

```yaml
      - name: Build static export
        run: npm run build
```

An unset `BASE_PATH` falls back to `""` in `next.config.ts`, which is exactly
what an apex domain needs. Then check for hand-written `/raccoon-portfolio`
strings anywhere outside the workflow:

```sh
grep -rn "raccoon-portfolio" app components lib content public
```

and confirm the built HTML now references the root:

```sh
npm run build && grep -o '"/_next/[^"]*' out/index.html | head
```

### Order matters

Set up DNS first, then the Pages custom domain, and change `BASE_PATH` last.
Removing `BASE_PATH` while the site is still served from
`jacksonzheng07.github.io/raccoon-portfolio` breaks every asset URL on the live
site immediately.

## Serving a production build locally

```sh
BASE_PATH=/raccoon-portfolio npm run build
npx serve out
```

`serve` will not reproduce the `/raccoon-portfolio` prefix, so links will look
wrong — that is expected. For a faithful local check of the prefixed build,
serve `out/` from a parent directory under that path, or just build with
`BASE_PATH` unset for local browsing.
