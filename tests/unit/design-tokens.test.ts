import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8");

describe("field notes design tokens", () => {
  it("declares the paper palette carried over from the wireframe", () => {
    expect(css).toContain("--color-paper: #f7f3e9");
    expect(css).toContain("--color-ink: #171717");
    expect(css).toContain("--color-line: #272727");
  });

  it("declares the raccoon palette extension", () => {
    expect(css).toContain("--color-mask: #2b2b30");
    expect(css).toContain("--color-ringtail: #8a8580");
  });

  it("respects reduced-motion preferences", () => {
    expect(css).toContain("prefers-reduced-motion: reduce");
  });
});
