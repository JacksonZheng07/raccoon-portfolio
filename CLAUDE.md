# Jackson OS — design blueprint

Read this before touching UI. The site is a macOS-style desktop (Sequoia, dark mode) built in Next.js as a static export.

## System
- Tokens live in `app/globals.css` (`@theme` + `:root`). Use them; don't add literal colours to components.
- Spacing on a 4/8px grid. Radii: windows 12, buttons 6, widgets 20, pills 999.
- One typeface: the system stack (`--font-system`), so Macs get SF Pro. One accent: `--color-accent` (#0a84ff).
- Icons are hand-drawn SVGs in `components/desktop/icons.tsx` on a 100-unit grid (82-unit rounded body, lit from above). No emoji as UI icons, and no Apple icons or logos. (The Sequoia wallpaper is Apple's and was the owner's explicit choice.)

## Structure
- `Desktop.tsx` is the window manager: apps registry (`APPS`), dock, menu bar, power states.
- Each app's window body lives in `apps.tsx`, `browser.tsx` (Chrome), `github.tsx`, `widgets.tsx`.
- Adding an app: `AppId` in `types.ts` → `APPS` entry → icon glyph → `contentFor` case → one e2e test.

## Behaviour rules
- Nothing navigates the top window away. External content opens in the Chrome app (iframe) or the GitHub app (API); a ↗ button is the only way to a real tab.
- Every visible button does something. Decorative-only controls are not buttons.
- Motion: springs under 350ms, respect `prefers-reduced-motion`.

## Design source (Figma)
With the Figma MCP connected (`claude plugin install figma@claude-plugins-official`, then authorise in `/plugin`), pull frames with the Figma tools and map their variables onto the tokens above rather than pasting raw values.

## Verify
`npm run lint && npm run typecheck && npm run test`, then `npm run test:e2e` (builds `out/`, so stop `npm run dev` first). Check 1440×900 and 390×844.
