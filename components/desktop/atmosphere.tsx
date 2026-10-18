"use client";

import { useEffect, useRef } from "react";

/*
 * Server-rendered and faded out by CSS alone, so the desktop never waits on
 * JavaScript. Repeat visits in the same tab skip it.
 */
/** `force` replays it, for Restart from the system menu. */
export function BootScreen({ force = false }: { force?: boolean }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (!force && sessionStorage.getItem("booted")) el.current?.remove();
      sessionStorage.setItem("booted", "1");
    } catch {}
  }, [force]);

  return (
    <div ref={el} className="boot" aria-hidden="true">
      <span className="boot-logo">J</span>
      <span className="boot-bar" />
    </div>
  );
}
