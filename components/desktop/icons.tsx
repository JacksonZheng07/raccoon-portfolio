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
  | "messages"
  | "terminal"
  | "timeline"
  | "vault"
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
          <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
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
        // Silver tile, dark toothed gear, three-spoke hub: the System Settings look.
        <Tile id={id} from="#ececf0" to="#a5a5ab">
          <g transform="translate(50 50)">
            {Array.from({ length: 32 }, (_, i) => (
              <rect key={i} x="-1.6" y="-34" width="3.2" height="6" rx="0.8" fill="#3a3a3e" transform={`rotate(${i * 11.25})`} />
            ))}
            <circle r="29" fill="#3a3a3e" />
            <circle r="25" fill="#8e8e93" />
            <circle r="21" fill="#2c2c30" />
            {[0, 120, 240].map((angle) => (
              <rect key={angle} x="-2.6" y="-19" width="5.2" height="19" rx="2.6" fill="#d1d1d6" transform={`rotate(${angle})`} />
            ))}
            <circle r="5.5" fill="#d1d1d6" />
            <circle r="2.2" fill="#5a5a5e" />
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
    case "messages":
      return (
        <Tile id={id} from="#6ff07a" to="#1fbf3a">
          <path d="M50 26c-17.7 0-32 11.6-32 26 0 8 4.5 15.2 11.6 20-.6 4.2-2.7 8-6.1 10.6 6.2.4 11.6-1.6 15.4-4.9 3.5 1 7.2 1.4 11.1 1.4 17.7 0 32-11.6 32-26S67.7 26 50 26z" fill="#fff" />
        </Tile>
      );
    case "vault":
      return (
        <Tile id={id} from="#5b5b62" to="#232327">
          <path d="M37 46V37a13 13 0 0 1 26 0v9" fill="none" stroke="#d8d8de" strokeWidth="6" strokeLinecap="round" />
          <rect x="29" y="45" width="42" height="32" rx="7" fill="#e8c55a" />
          <rect x="29" y="45" width="42" height="6" rx="3" fill="#fff" opacity="0.35" />
          <circle cx="50" cy="60" r="4.5" fill="#6b5410" />
          <rect x="48" y="62" width="4" height="8" rx="2" fill="#6b5410" />
        </Tile>
      );
    case "timeline":
      return (
        <Tile id={id} from="#7d7aff" to="#4a3fd6">
          <path d="M34 24v52" stroke="#fff" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
          {[30, 50, 70].map((y, i) => (
            <g key={y}>
              <circle cx="34" cy={y} r="6" fill="#fff" />
              <rect x="46" y={y - 4} width={[30, 22, 26][i]} height="8" rx="4" fill="#fff" opacity={i === 0 ? 1 : 0.7} />
            </g>
          ))}
        </Tile>
      );
    case "terminal":
      return (
        <Tile id={id} from="#4a4a4e" to="#1c1c1e">
          <rect x="18" y="24" width="64" height="52" rx="6" fill="#0d0d0f" stroke="#5a5a5e" />
          <path d="M28 40l10 8-10 8" fill="none" stroke="#f5f5f7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M44 58h16" stroke="#f5f5f7" strokeWidth="4" strokeLinecap="round" />
        </Tile>
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
