import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { NAV_ITEMS } from "./nav-items";

/** The 66px site header: wordmark on the left, nav on the right. */
export function TopNav() {
  return (
    <header className="relative flex h-[66px] items-center justify-between border-b-2 border-line px-[34px] max-[740px]:px-[18px]">
      <p className="m-0 flex items-baseline">
        <Link
          href="/"
          className="font-display text-[20px] font-bold text-ink no-underline"
        >
          JZ
        </Link>
        <span className="ml-2 font-mono text-[11px] text-muted">
          field notes / software + math
        </span>
      </p>
      <nav aria-label="Primary" className="max-[740px]:hidden">
        <ul className="m-0 flex list-none p-0">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="ml-[27px]">
              <Link
                href={item.href}
                className="border-b-2 border-transparent text-[12px] uppercase tracking-[0.1em] text-ink no-underline hover:border-line"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <MobileNav />
    </header>
  );
}
