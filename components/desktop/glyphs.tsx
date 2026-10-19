/*
 * Monoline UI glyphs on a 24-unit grid, stroked in currentColor so they take
 * the colour of whatever control holds them.
 */
const PATHS = {
  back: "M15 5l-7 7 7 7",
  forward: "M9 5l7 7-7 7",
  reload: "M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5",
  external: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  close: "M6 6l12 12M18 6L6 18",
  plus: "M12 5v14M5 12h14",
  send: "M12 19V5M6 11l6-6 6 6",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z",
  sun: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
  moon: "M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z",
  cloud: "M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18z",
  rain: "M7 15h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 15zM8 18l-1 3M12 18l-1 3M16 18l-1 3",
  snow: "M7 14h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 14zM8 18h.01M12 20h.01M16 18h.01",
  storm: "M7 15h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 15zM13 15l-3 5h4l-3 4",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  list: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  home: "M4 11l8-7 8 7M6 9.5V20h4v-6h4v6h4V9.5",
  apps: "M12 3l9 16H3zM8 14h8",
  chevron: "M10 7l5 5-5 5",
  briefcase: "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
  code: "M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
  book: "M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11",
} as const;

export type GlyphName = keyof typeof PATHS | "up" | "dot";

export function Glyph({ name, label }: { name: GlyphName; label?: string }) {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };
  if (name === "up" || name === "dot") {
    return (
      <svg className="glyph" viewBox="0 0 24 24" {...a11y}>
        {name === "up" ? <path d="M12 4l9 16H3z" fill="currentColor" /> : <circle cx="12" cy="12" r="8" fill="currentColor" />}
      </svg>
    );
  }
  return (
    <svg className="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...a11y}>
      <path d={PATHS[name]} />
    </svg>
  );
}
