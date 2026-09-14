"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
 * The rail's paging controls.
 *
 * This is the one client component on the home page, and it is here because
 * CSS genuinely cannot do the job: fragment navigation scrolls the minimum
 * distance needed to bring a target into view, so an anchor to the fourth
 * bin lands it at the right-hand edge rather than paging the rail. Measured,
 * not assumed -- an anchor moved the rail 386px where a page is 1158px, and
 * under `scroll-snap-type: x mandatory` it did not move at all.
 *
 * The buttons are rendered by this component rather than by the server, so a
 * visitor without JavaScript is not given two controls that do nothing. They
 * lose nothing else: the rail is a native scroll container, so swipe,
 * trackpad, shift-scroll and keyboard all still reach every bin.
 */
export function RailArrows({ railId }: { railId: string }) {
  const [at, setAt] = useState({ start: true, end: false });
  const rail = useRef<HTMLElement | null>(null);

  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    setAt({
      start: el.scrollLeft < 8,
      end: el.scrollLeft >= el.scrollWidth - el.clientWidth - 8,
    });
  }, []);

  useEffect(() => {
    const el = document.getElementById(railId);
    rail.current = el;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [railId, measure]);

  /* One page is one viewport of the rail, whatever the breakpoint has made
     that -- three bins on a wide screen, two at 900px, one on a phone. */
  const page = (direction: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
  };

  const style =
    "tactile border-2 border-line bg-plate px-4 py-2 font-mono text-specimen font-bold uppercase text-ink disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <button
        type="button"
        className={style}
        onClick={() => page(-1)}
        disabled={at.start}
      >
        <span aria-hidden="true">&larr;</span> previous
      </button>
      <button
        type="button"
        className={style}
        onClick={() => page(1)}
        disabled={at.end}
      >
        next <span aria-hidden="true">&rarr;</span>
      </button>
    </div>
  );
}

export default RailArrows;
