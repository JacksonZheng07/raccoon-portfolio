/*
 * A torn strip of masking tape, for pinning a card or a photograph to the
 * page. `tilt` rotates it off-axis the way a real strip never lands square.
 */
import { FieldSvg } from "./field-art";
import { MARK_ART } from "./mark-art";

const TILT = {
  none: "",
  left: "-rotate-3",
  right: "rotate-3",
} as const;

export function TapeStrip({
  tilt = "none",
  className,
}: {
  tilt?: keyof typeof TILT;
  className?: string;
}) {
  const { viewBox, art } = MARK_ART["tape-strip"];
  return (
    <FieldSvg
      viewBox={viewBox}
      className={["block", TILT[tilt], className].filter(Boolean).join(" ")}
    >
      {art}
    </FieldSvg>
  );
}

export default TapeStrip;
