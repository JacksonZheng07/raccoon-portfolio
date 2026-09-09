/*
 * A row of paw prints used as a section divider. Inline copy of
 * public/assets/raccoon/paw-print.svg, repeated `count` times. Decorative.
 */
function PawPrint() {
  return (
    <svg viewBox="0 0 48 56" className="h-6 w-5 shrink-0">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="7" cy="27" rx="3.4" ry="7" transform="rotate(-38 7 27)" fill="currentColor" stroke="none"/>
        <ellipse cx="15" cy="17" rx="3.4" ry="7" transform="rotate(-19 15 17)" fill="currentColor" stroke="none"/>
        <ellipse cx="24" cy="12" rx="3.4" ry="7" transform="rotate(0 24 12)" fill="currentColor" stroke="none"/>
        <ellipse cx="33" cy="17" rx="3.4" ry="7" transform="rotate(19 33 17)" fill="currentColor" stroke="none"/>
        <ellipse cx="41" cy="27" rx="3.4" ry="7" transform="rotate(38 41 27)" fill="currentColor" stroke="none"/>
        <path d="M 13 40 C 11 31 17 26 24 26 C 31 26 37 31 35 40 C 33 48 29 51 24 51 C 19 51 15 48 13 40 Z" fill="currentColor" stroke="none"/>
      </g>
    </svg>
  );
}

export function PawDivider({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const paws = Array.from({ length: Math.max(0, count) }, (_, i) => i);
  return (
    <div
      aria-hidden="true"
      className={["flex items-center justify-center gap-5", className]
        .filter(Boolean)
        .join(" ")}
    >
      {paws.map((i) => (
        <PawPrint key={i} />
      ))}
    </div>
  );
}

export default PawDivider;
