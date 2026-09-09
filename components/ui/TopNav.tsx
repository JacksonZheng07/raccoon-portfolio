import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { NavLink } from "./NavLink";
import { NAV_ITEMS } from "./nav-items";

/**
 * The 66px site header: wordmark on the left, nav on the right.
 *
 * Sticky, so the wordmark and the route indicator stay reachable down a long
 * case study. It keeps its own opaque paper tone because content scrolls
 * underneath it, and `sticky-lift` thickens the rule under it once the page
 * has moved — the only cue that it is stuck, and a CSS-only one.
 */
export function TopNav() {
  return (
    <header className="tone-paper sticky-lift sticky top-0 z-20 flex h-[66px] items-center justify-between border-b-2 border-line px-[34px] max-[740px]:px-[18px]">
      <p className="m-0 flex items-baseline">
        <Link
          href="/"
          className="tactile inline-block border-2 border-line bg-ink px-[9px] py-[4px] font-display text-[17px] font-bold leading-none text-paper no-underline hover:bg-accent-green hover:text-ink"
        >
          JZ
        </Link>
        <span className="ml-[10px] font-mono text-specimen uppercase text-muted max-[560px]:hidden">
          field notes / software + math
        </span>
      </p>
      <nav aria-label="Primary" className="max-[740px]:hidden">
        <ul className="m-0 flex list-none items-center p-0">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="ml-[27px]">
              <NavLink
                href={item.href}
                className="rule-grow inline-block pb-[3px] font-mono text-specimen-lg uppercase text-muted no-underline hover:text-ink aria-[current=page]:border-line aria-[current=page]:text-ink"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <MobileNav />
    </header>
  );
}
