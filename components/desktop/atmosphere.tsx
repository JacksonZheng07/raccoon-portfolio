"use client";

import { useEffect, useRef } from "react";

/*
 * Server-rendered and faded out by CSS alone, so the desktop never waits on
 * JavaScript. Repeat visits in the same tab skip it.
 */
export function BootScreen() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("booted")) el.current?.remove();
      sessionStorage.setItem("booted", "1");
    } catch {}
  }, []);

  return (
    <div ref={el} className="boot" aria-hidden="true">
      <span className="boot-logo">J</span>
      <span className="boot-bar" />
    </div>
  );
}
