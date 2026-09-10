"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink } from "./NavLink";
import { NAV_ITEMS } from "./nav-items";

const MENU_ID = "top-nav-menu";

/**
 * The below-740px disclosure menu. A real button with `aria-expanded`, closed
 * by Escape, with focus returned to the toggle.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  return (
    <div className="hidden max-[740px]:block">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={() => setOpen((value) => !value)}
        className="tactile border-2 border-line bg-paper px-3 py-1 font-mono text-specimen-lg font-bold uppercase text-ink hover:bg-accent-green"
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id={MENU_ID}
        aria-label="Primary"
        hidden={!open}
        className="tone-paper absolute left-0 right-0 top-full z-10 border-b-2 border-line"
      >
        <ul className="m-0 list-none p-0">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="border-t-2 border-line">
              <NavLink
                href={item.href}
                onNavigate={() => setOpen(false)}
                className="tactile-quiet flex items-center gap-3 px-[18px] py-4 font-mono text-specimen-lg uppercase text-muted no-underline hover:bg-accent-blue hover:text-ink aria-[current=page]:bg-accent-blue aria-[current=page]:text-ink"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
