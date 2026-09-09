import path from "node:path";
import type { NextConfig } from "next";

/*
 * Empty for Vercel and for an apex domain; `/raccoon-portfolio` only for the
 * GitHub Pages project site, which serves under a subpath. The Pages workflow
 * sets it; nothing else does.
 */
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  /*
   * There is an unrelated package-lock.json in the home directory, so Next
   * inferred ~/ as the workspace root and warned on every build. Pin it to
   * this project.
   */
  outputFileTracingRoot: path.join(import.meta.dirname, "."),
};

export default nextConfig;
