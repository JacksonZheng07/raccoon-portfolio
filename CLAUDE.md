# Jackson OS — design blueprint

Read this before touching UI. The site is a macOS Sequoia–style desktop built in Next.js as a static export. It follows the visitor's system appearance (light or dark).

## Design system (app/globals.css → tokens)
- Every colour, space, radius, shadow and curve is a token in `:root`; light mode only redefines tokens. Components never use raw values.
- Space: `--space-1…10` on a 4px grid. Type: `--text-xs…display` (11/12/13/15/17/22/28/44). Radii: `--radius-sm…2xl`, `--radius-pill`.
- One typeface: the system stack (SF Pro on Macs). One accent: `--color-accent` for links and icons; `--color-accent-fill` for filled surfaces under white text (AA contrast).
- Motion: `--ease-out`, `--ease-spring`, `--dur-fast|base|slow`. Windows spring open, minimize pours into the Dock (Web Animations API), close scales away. Everything respects `prefers-reduced-motion`.

## Iconography
- App icons: hand-drawn SVGs in `icons.tsx` on a 100-unit grid (82-unit rounded body). No Apple icons or logos. (The Sequoia wallpaper is Apple's and was the owner's explicit choice.)
- UI glyphs: monoline SVGs in `glyphs.tsx`, stroked in `currentColor`. Never emoji or text characters as icons.

## Structure
- `Desktop.tsx` is the window manager: `APPS` registry, dock (left/bottom/right), menu bar, Stage Manager, power states, movable desktop items.
- App bodies: `apps.tsx` (Finder, project docs, Notes, About, Software Update, Trash, Mail), `browser.tsx` (Chrome), `github.tsx`, `messages.tsx`, `terminal.tsx`, `widgets.tsx`.
- Adding an app: `AppId` in `types.ts` → `APPS` entry → icon in `icons.tsx` → `contentFor` case → e2e test.
- Finder and Chrome merge their toolbars into the title bar (`.window[data-app=…] .titlebar`).

## Behaviour rules
- Nothing navigates the top window away. External content opens in Chrome (iframe) or the GitHub app (API); a ↗ button is the only way to a real tab.
- Every visible button does something. Decorative-only controls are not buttons.
- Finder rules: click selects, double-click or Return opens.

## Design source (Figma)
With the Figma MCP connected (`claude plugin install figma@claude-plugins-official`, then authorise in `/plugin`), pull frames with the Figma tools and map their variables onto the tokens above rather than pasting raw values.

## Verify before shipping
`npm run lint && npm run typecheck && npm run test`, then `npm run test:e2e` (builds `out/`; stop `npm run dev` first). Check 1440×900 light and dark, and 380px wide: no page overflow (`scrollWidth` vs `clientWidth`), axe clean.
