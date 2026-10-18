export type IconKind =
  | "logo"
  | "folder"
  | "finder"
  | "notes"
  | "about"
  | "update"
  | "doc"
  | "github"
  | "mail";

const GLYPHS: Record<IconKind, React.ReactNode> = {
  logo: (
    <text x="32" y="44" textAnchor="middle" fontSize="38" fontWeight="700" fill="currentColor">
      J
    </text>
  ),
  folder: (
    <>
      <path d="M6 14a4 4 0 0 1 4-4h14l5 5h25a4 4 0 0 1 4 4v3H6z" fill="#4a9ee8" />
      <rect x="6" y="20" width="52" height="34" rx="4" fill="#6fb8f5" />
      <rect x="6" y="20" width="52" height="3" fill="#8fcbfa" />
    </>
  ),
  finder: (
    <>
      <path d="M14 22a3 3 0 0 1 3-3h10l4 4h16a3 3 0 0 1 3 3v2H14z" fill="#fff" opacity=".75" />
      <rect x="14" y="26" width="36" height="22" rx="3" fill="#fff" />
    </>
  ),
  notes: (
    <>
      <rect x="0" y="0" width="64" height="18" fill="#f7c843" />
      {[28, 37, 46].map((y) => (
        <line key={y} x1="12" x2="52" y1={y} y2={y} stroke="#c9c9c9" strokeWidth="2" />
      ))}
    </>
  ),
  about: (
    <text x="32" y="41" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff">
      JZ
    </text>
  ),
  update: (
    <>
      <path
        d="M44 22a15 15 0 1 0 4 12"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M38 14l10 8-12 4z" fill="#fff" />
    </>
  ),
  doc: (
    <>
      <path d="M18 8h20l10 10v38H18z" fill="#fff" />
      <path d="M38 8v10h10" fill="#d9d9d9" />
      {[28, 35, 42].map((y) => (
        <line key={y} x1="24" x2="42" y1={y} y2={y} stroke="#b5b5b5" strokeWidth="2" />
      ))}
    </>
  ),
  github: (
    <text x="32" y="41" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff" fontFamily="ui-monospace, monospace">
      {"</>"}
    </text>
  ),
  mail: (
    <>
      <rect x="12" y="18" width="40" height="28" rx="3" fill="#fff" />
      <path d="M13 20l19 14 19-14" fill="none" stroke="#2f7de1" strokeWidth="3" />
    </>
  ),
};

/** Tiles are drawn, not borrowed: no Apple artwork ships with this site. */
export function AppIcon({ kind }: { kind: IconKind }) {
  return (
    <svg className={`app-icon app-icon-${kind}`} viewBox="0 0 64 64" aria-hidden="true">
      {GLYPHS[kind]}
    </svg>
  );
}
