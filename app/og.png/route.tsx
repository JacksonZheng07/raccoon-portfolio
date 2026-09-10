import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { OG_IMAGE } from "@/lib/site";

/*
 * Required under `output: "export"`: without it the build fails with
 * "export const dynamic = force-static ... not configured on route".
 */
export const dynamic = "force-static";

/*
 * Satori cannot resolve CSS custom properties, and the brief forbids hex
 * literals, so the palette is read straight out of the token block at build
 * time. A token rename breaks the card loudly instead of silently drifting
 * away from the site.
 */
function readTokens(): Record<string, string> {
  const css = readFileSync(
    path.join(process.cwd(), "app", "globals.css"),
    "utf8",
  );
  const tokens: Record<string, string> = {};
  for (const match of css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{3,8})/gi)) {
    const [, name, value] = match;
    if (name !== undefined && value !== undefined) tokens[name] = value;
  }
  return tokens;
}

function token(tokens: Record<string, string>, name: string): string {
  const value = tokens[name];
  if (value === undefined) {
    throw new Error(`app/globals.css no longer declares --color-${name}`);
  }
  return value;
}

/**
 * The share card: a typographic plate in the Field Notes palette. No
 * artwork -- rules, a specimen label and the one line the home page leads
 * with. Georgia is a system font and cannot be embedded, so the card renders
 * in Satori's bundled sans face.
 */
export function GET() {
  const tokens = readTokens();
  const paper = token(tokens, "paper");
  const ink = token(tokens, "ink");
  const line = token(tokens, "line");
  const muted = token(tokens, "muted");
  const blue = token(tokens, "accent-blue");
  const pink = token(tokens, "accent-pink");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: paper,
          color: ink,
          border: `16px solid ${line}`,
          padding: "56px 64px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: muted,
          }}
        >
          <div style={{ display: "flex" }}>
            Jackson Zheng / CS + Math / Northeastern
          </div>
          <div
            style={{
              display: "flex",
              background: pink,
              border: `4px solid ${line}`,
              padding: "10px 16px",
              color: ink,
            }}
          >
            Field Notes
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 86, lineHeight: 1.05 }}>
            i take things
            <div
              style={{
                display: "flex",
                background: blue,
                padding: "0 14px",
                margin: "0 14px",
              }}
            >
              apart
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 86, lineHeight: 1.05 }}>
            to see how they work.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `4px solid ${line}`,
            paddingTop: 28,
            fontSize: 26,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: ink,
          }}
        >
          <div style={{ display: "flex" }}>Ten builds, written up in full</div>
          <div style={{ display: "flex", color: muted }}>
            github.com/JacksonZheng07
          </div>
        </div>
      </div>
    ),
    { width: OG_IMAGE.width, height: OG_IMAGE.height },
  );
}
