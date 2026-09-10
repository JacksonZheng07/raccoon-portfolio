/*
 * A tied-on specimen tag. The drawing is decorative; anything passed as
 * children is real text laid over the tag face, so it stays selectable and
 * legible to a screen reader.
 */
import type { ReactNode } from "react";
import { FieldSvg } from "./field-art";
import { MARK_ART } from "./mark-art";

export function SpecimenTag({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const { viewBox, art } = MARK_ART["specimen-tag"];
  return (
    <span className={["relative inline-block", className].filter(Boolean).join(" ")}>
      <FieldSvg viewBox={viewBox} className="block h-full w-full">
        {art}
      </FieldSvg>
      {children ? (
        <span className="absolute inset-x-[18%] bottom-[16%] font-mono text-[10px] leading-tight text-muted">
          {children}
        </span>
      ) : null}
    </span>
  );
}

export default SpecimenTag;
