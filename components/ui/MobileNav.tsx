"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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
        className="border-2 border-line bg-paper px-3 py-1 font-mono text-[12px] font-bold uppercase tracking-[0.1em] text-ink"
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id={MENU_ID}
        aria-label="Primary"
        hidden={!open}
        className="absolute left-0 right-0 top-full z-10 border-b-2 border-line bg-paper"
      >
        <ul className="m-0 list-none p-0">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="border-t-2 border-line">
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-[18px] py-4 text-[12px] uppercase tracking-[0.1em] text-ink no-underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
