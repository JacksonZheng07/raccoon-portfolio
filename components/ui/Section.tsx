import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  "aria-labelledby"?: string;
};

/** Bordered section wrapper carrying the standard wireframe padding rhythm. */
export function Section({
  children,
  id,
  className,
  "aria-labelledby": ariaLabelledBy,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`border-b-2 border-line px-[65px] py-[72px] max-[740px]:px-[23px] max-[740px]:py-[50px]${
        className ? ` ${className}` : ""
      }`}
    >
      {children}
    </section>
  );
}
