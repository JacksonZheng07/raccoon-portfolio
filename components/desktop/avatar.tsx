const SRC = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/avatar.jpg`;

/*
 * The source photo is a tight 300px crop, so it sits slightly inset over a
 * blurred copy of itself: reads as a wider shot and keeps the softness from
 * showing at the edges.
 */
export function Avatar({ className = "" }: { className?: string }) {
  return (
    <span className={`about-avatar avatar ${className}`} style={{ "--avatar": `url("${SRC}")` } as React.CSSProperties} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
      <img src={SRC} alt="" />
    </span>
  );
}
