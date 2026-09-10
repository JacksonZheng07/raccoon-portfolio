# Deploying

The site is hosted on **Vercel**, connected to this repository.

- Push to `main` → production deploy to https://raccoon-portfolio.vercel.app
- Push any other branch, or open a pull request → its own preview URL

Nothing needs to be run by hand. `vercel deploy` still works from a local
checkout if you want to push a build without committing, but the git
integration is the normal path.

## How the build is configured

`next.config.ts` uses `output: "export"`, so every route is emitted as static
HTML into `out/`. There is no server at runtime.

`BASE_PATH` is read from the environment and defaults to empty, which is what
Vercel wants — the site is served from the root of its domain. The variable
exists for the case where the site is ever served from a subpath instead; set
it and every asset URL and internal link picks up the prefix. Note that
`next/image` does *not* apply it, because `images.unoptimized` short-circuits
the loader, so hand-written asset paths interpolate
`process.env.NEXT_PUBLIC_BASE_PATH` themselves.

`NEXT_PUBLIC_SITE_URL` overrides the canonical origin used by metadata, the
sitemap, robots.txt and the JSON-LD. When it is unset the origin is derived
from Vercel's own `VERCEL_PROJECT_PRODUCTION_URL`, falling back to
`VERCEL_URL` so a preview build describes itself rather than production. Set
it explicitly once a custom domain is in place.

## Moving to a custom domain

1. Add the domain under the Vercel project's Domains settings.
2. Point DNS at Vercel as instructed there — an apex domain takes an `A`
   record, a subdomain takes a `CNAME`. Vercel prints the exact values, and
   they are worth reading from the dashboard rather than copying from here.
3. Set `NEXT_PUBLIC_SITE_URL` to the new origin so canonical tags, the
   sitemap and the structured data all agree.
4. Wait for the certificate to issue, then confirm HTTPS is enforced.

## Why not GitHub Pages

This repository previously carried a Pages workflow. It was removed.

Running both hosts meant each build emitted canonical tags pointing at
itself — the Vercel build at its own domain, the Pages build at
`jacksonzheng07.github.io/raccoon-portfolio` — which is a duplicate-content
problem for search, and it undercuts the metadata work for no benefit. Vercel
already provides production deploys on merge and a preview per pull request,
which Pages does not.

If Pages is ever wanted back, the workflow needs `actions/configure-pages`
with `enablement: true`, or Pages has to be turned on manually first under
Settings → Pages → Source: GitHub Actions. Without that the action fails on
its first step with `Get Pages site failed`, which is exactly how it failed
here.
