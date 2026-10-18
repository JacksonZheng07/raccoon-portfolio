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
 * Satori cannot resolve CSS custom properties, so the palette is read straight
 * out of the token block at build time. A token rename breaks the card loudly
 * instead of silently drifting away from the site.
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

/** The share card: an About window on the desktop wallpaper. */
export function GET() {
  const tokens = readTokens();
  const wallA = token(tokens, "wallpaper-a");
  const wallB = token(tokens, "wallpaper-b");
  const windowBg = token(tokens, "window");
  const chrome = token(tokens, "chrome");
  const ink = token(tokens, "ink");
  const muted = token(tokens, "muted");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${wallA}, ${wallB})`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 820,
            borderRadius: 24,
            overflow: "hidden",
            background: windowBg,
            boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ display: "flex", gap: 14, padding: "22px 26px", background: chrome }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", padding: "48px 60px 56px", color: ink }}>
            <div style={{ display: "flex", fontSize: 30, color: muted }}>Jackson OS</div>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 700, marginTop: 8 }}>
              Jackson Zheng
            </div>
            <div style={{ display: "flex", fontSize: 34, color: muted, marginTop: 14 }}>
              CS + Math · Northeastern · ten builds inside
            </div>
          </div>
        </div>
      </div>
    ),
    { width: OG_IMAGE.width, height: OG_IMAGE.height },
  );
}
