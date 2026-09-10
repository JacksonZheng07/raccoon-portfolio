"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import styles from "./bin-magnifier.module.css";

/*
 * The investigator's magnifier, following the pointer across the work grid.
 *
 * This is the only client component in the band. It wraps the grid rather
 * than living inside a card, so `WorkCard` and the page around it stay Server
 * Components: `children` is server-rendered markup this component only
 * parents. Nothing about the grid depends on the script arriving.
 *
 * -- WHY IT CANNOT BLOCK A CLICK ------------------------------------------
 * The cards are links. The lens is `aria-hidden`, `pointer-events: none`, and
 * absolutely positioned out of flow, so it is invisible to assistive
 * technology, transparent to hit testing, and incapable of shifting layout.
 * The system cursor is left exactly as it is — no `cursor: url(...)` — so a
 * card still shows the pointer that says it is clickable, and the glass is
 * drawn beside that pointer rather than in place of it. Keyboard focus is
 * untouched: tabbing to a card still gets the site's own focus ring, and the
 * lens never appears, because there is no pointer to follow.
 *
 * -- THROTTLING ------------------------------------------------------------
 * `onPointerMove` does no layout work at all. It writes two numbers to a ref
 * and returns. Every read (the wrapper's box) and every write (the lens's
 * transform) happens inside a `requestAnimationFrame` loop that only runs
 * while a card is actually hovered, so the cost is one rect read and one
 * transform write per frame no matter how many move events the device sends.
 * Reads come before writes in the same callback, so there is no layout
 * thrash.
 */

/** Only a mouse-like pointer gets a magnifier. */
const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const CALM = "(prefers-reduced-motion: reduce)";

/**
 * How much of the remaining distance the lens closes each frame. Below 1 the
 * lens trails the pointer by a few frames, which is what makes it read as
 * something held in a paw rather than something welded to the cursor. At 1 it
 * is exactly on the pointer, which is what reduced motion gets.
 */
const EASE = 0.22;

function matches(query: string): boolean {
  return typeof window !== "undefined" && window.matchMedia(query).matches;
}

export function BinMagnifier({ children }: { children: ReactNode }) {
  const field = useRef<HTMLDivElement>(null);
  const glass = useRef<HTMLSpanElement>(null);
  /** Where the pointer is, in client coordinates. Written by the handler. */
  const pointer = useRef({ x: 0, y: 0 });
  /** Where the lens is, in wrapper coordinates. Written by the frame loop. */
  const lens = useRef({ x: 0, y: 0 });
  /** Set on the first frame after the pointer enters, to skip the lerp in. */
  const placed = useRef(false);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (!held) {
      placed.current = false;
      return;
    }

    const ease = matches(CALM) ? 1 : EASE;
    let frame = 0;

    const tick = () => {
      const host = field.current;
      const node = glass.current;
      if (host && node) {
        /* One read, then one write, in that order. */
        const box = host.getBoundingClientRect();
        const x = pointer.current.x - box.left;
        const y = pointer.current.y - box.top;
        if (placed.current) {
          lens.current = {
            x: lens.current.x + (x - lens.current.x) * ease,
            y: lens.current.y + (y - lens.current.y) * ease,
          };
        } else {
          lens.current = { x, y };
          placed.current = true;
        }
        node.style.transform = `translate3d(${lens.current.x.toFixed(1)}px, ${lens.current.y.toFixed(1)}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [held]);

  /*
   * Positioning the lens the moment it attaches, rather than waiting for the
   * first animation frame. A ref callback runs during commit, before the
   * browser paints, so the lens is never painted once at the wrapper's origin
   * and then moved — which is exactly the frame a reduced-motion visitor
   * would see, since the fade-in that would otherwise hide it is switched off
   * for them.
   */
  const attach = (node: HTMLSpanElement | null) => {
    glass.current = node;
    const host = field.current;
    if (!node || !host) return;
    const box = host.getBoundingClientRect();
    lens.current = {
      x: pointer.current.x - box.left,
      y: pointer.current.y - box.top,
    };
    placed.current = true;
    node.style.transform = `translate3d(${lens.current.x.toFixed(1)}px, ${lens.current.y.toFixed(1)}px, 0)`;
  };

  const track = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !matches(FINE_POINTER)) return;
    pointer.current = { x: event.clientX, y: event.clientY };
    const over = Boolean(
      (event.target as Element | null)?.closest("[data-bin-card]"),
    );
    if (over !== held) setHeld(over);
  };

  return (
    <div
      ref={field}
      className={styles.field}
      onPointerMove={track}
      onPointerLeave={() => setHeld(false)}
    >
      {children}
      {held ? (
        <span ref={attach} aria-hidden="true" className={styles.glass}>
          <span className={styles.lens}>
            {/*
             * Hand-drawn, single weight, `currentColor`, like every other
             * illustration here. The lens glass is a paper wash at 0.16 —
             * enough that type under it lightens the way it does under real
             * glass, not enough to stop it being read — and the two short
             * bars raked across its upper left are the ring catching the
             * light. Both circles are genuine circles, which is the one
             * curve the house rules allow.
             */}
            <svg viewBox="0 0 96 96" className="block h-full w-full">
              <g
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M 58 58 L 82 82" strokeWidth="6" />
                <circle
                  cx="36"
                  cy="36"
                  r="26"
                  fill="var(--color-paper)"
                  fillOpacity="0.16"
                />
                <circle cx="36" cy="36" r="31" strokeWidth="3" />
                <path d="M 20 30 L 28 21" />
                <path d="M 24 39 L 31 31" />
              </g>
            </svg>
          </span>
        </span>
      ) : null}
    </div>
  );
}

export default BinMagnifier;
