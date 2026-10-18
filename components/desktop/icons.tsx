import { useId, type ReactNode } from "react";

export type IconKind =
  | "logo"
  | "folder"
  | "finder"
  | "browser"
  | "notes"
  | "about"
  | "update"
  | "doc"
  | "github"
  | "mail"
  | "trash";

// The GitHub mark, used to label links to GitHub as their brand guidelines allow.
const GITHUB_MARK =
  "M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3";

/*
 * macOS-proportioned icons: an 82-unit rounded-square body on a 100 grid,
 * lit from above. Drawn for this site; no Apple artwork ships with it.
 */
function Tile({ from, to, children, id }: { from: string; to: string; children: ReactNode; id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <rect x="9" y="9" width="82" height="82" rx="19" />
        </clipPath>
      </defs>
      <rect x="9" y="9" width="82" height="82" rx="19" fill={`url(#${id}-bg)`} />
      <g clipPath={`url(#${id}-clip)`}>{children}</g>
      <rect x="9" y="9" width="82" height="82" rx="19" fill={`url(#${id}-gloss)`} />
      <rect x="9.5" y="9.5" width="81" height="81" rx="18.5" fill="none" stroke="#000" strokeOpacity="0.12" />
    </>
  );
}

function glyph(kind: IconKind, id: string): ReactNode {
  switch (kind) {
    case "logo":
      return (
        <text x="50" y="72" textAnchor="middle" fontSize="64" fontWeight="700" fill="currentColor">
          J
        </text>
      );
    case "folder":
      return (
        <>
          <defs>
            <linearGradient id={`${id}-f`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7cc8fb" />
              <stop offset="1" stopColor="#3a9cf0" />
            </linearGradient>
          </defs>
          <path d="M10 26a6 6 0 0 1 6-6h20l7 7h41a6 6 0 0 1 6 6v4H10z" fill="#2f86dc" />
          <rect x="10" y="33" width="80" height="52" rx="6" fill={`url(#${id}-f)`} />
          <rect x="10" y="33" width="80" height="3" rx="1.5" fill="#fff" opacity="0.45" />
        </>
      );
    case "finder":
      return (
        <Tile id={id} from="#62c6fb" to="#1474e6">
          <rect x="50" y="9" width="41" height="82" fill="#0b4fb3" opacity="0.35" />
          <path d="M27 40a5 5 0 0 1 5-5h12l5 5h19a5 5 0 0 1 5 5v2H27z" fill="#e8f4ff" opacity="0.8" />
          <rect x="27" y="44" width="46" height="30" rx="5" fill="#fff" />
        </Tile>
      );
    case "browser":
      // Chrome's Mac icon is a bare roundel, not a tile.
      return (
        <>
          <path d="M50 50 L15.4 30 A40 40 0 0 1 84.6 30 Z" fill="#ea4335" />
          <path d="M50 50 L84.6 30 A40 40 0 0 1 50 90 Z" fill="#fbbc04" />
          <path d="M50 50 L50 90 A40 40 0 0 1 15.4 30 Z" fill="#34a853" />
          <circle cx="50" cy="50" r="18" fill="#fff" />
          <circle cx="50" cy="50" r="14" fill="#1a73e8" />
        </>
      );
    case "notes":
      return (
        <Tile id={id} from="#ffffff" to="#f1f1f1">
          <rect x="9" y="9" width="82" height="26" fill="#fcd34d" />
          <rect x="9" y="33" width="82" height="2" fill="#e6b82e" />
          {[47, 58, 69, 80].map((y) => (
            <line key={y} x1="20" x2="80" y1={y} y2={y} stroke="#d4d4d4" strokeWidth="2" />
          ))}
        </Tile>
      );
    case "about":
      return (
        <Tile id={id} from="#c79a6b" to="#8d6440">
          <rect x="22" y="20" width="56" height="64" rx="7" fill="#f7efe4" />
          <circle cx="50" cy="44" r="11" fill="#8d6440" />
          <path d="M31 74a19 14 0 0 1 38 0z" fill="#8d6440" />
        </Tile>
      );
    case "update":
      return (
        <Tile id={id} from="#9a9aa1" to="#4d4d54">
          <g transform="translate(50 50)" fill="#e5e5ea">
            {Array.from({ length: 12 }, (_, i) => (
              <rect key={i} x="-4" y="-33" width="8" height="12" rx="2" transform={`rotate(${i * 30})`} />
            ))}
            <circle r="24" />
            <circle r="13" fill="#6b6b72" />
            <circle r="7" fill="#e5e5ea" />
          </g>
        </Tile>
      );
    case "doc":
      return (
        <>
          <path d="M24 10h36l18 18v62H24z" fill="#fff" stroke="#c7c7cc" />
          <path d="M60 10v18h18" fill="#e5e5ea" />
          {[42, 52, 62, 72].map((y) => (
            <line key={y} x1="32" x2="70" y1={y} y2={y} stroke="#c7c7cc" strokeWidth="2.5" />
          ))}
        </>
      );
    case "github":
      return (
        <Tile id={id} from="#3d3d42" to="#0d0d10">
          <path d={GITHUB_MARK} fill="#fff" transform="translate(26 26) scale(2)" />
        </Tile>
      );
    case "trash":
      return (
        <>
          <defs>
            <linearGradient id={`${id}-can`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#a9a9b0" />
              <stop offset="0.5" stopColor="#e9e9ee" />
              <stop offset="1" stopColor="#9a9aa1" />
            </linearGradient>
          </defs>
          <path d="M24 26h52l-5 64H29z" fill={`url(#${id}-can)`} opacity="0.92" />
          {[34, 42, 50, 58, 66].map((x) => (
            <path key={x} d={`M${x} 30l${(x - 50) * 0.08} 56`} stroke="#7d7d84" strokeWidth="1.2" opacity="0.6" />
          ))}
          <ellipse cx="50" cy="26" rx="27" ry="6" fill="#d8d8de" stroke="#8e8e95" />
          <ellipse cx="50" cy="26" rx="22" ry="3.5" fill="#6e6e75" />
        </>
      );
    case "mail":
      return (
        <Tile id={id} from="#5ab8ff" to="#1a6ff0">
          <rect x="22" y="31" width="56" height="40" rx="5" fill="#fff" />
          <path d="M23 34l27 20 27-20" fill="none" stroke="#1a6ff0" strokeWidth="3.5" strokeLinejoin="round" />
        </Tile>
      );
  }
}

export function AppIcon({ kind }: { kind: IconKind }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={`app-icon app-icon-${kind}`} viewBox="0 0 100 100" aria-hidden="true">
      {glyph(kind, id)}
    </svg>
  );
}
