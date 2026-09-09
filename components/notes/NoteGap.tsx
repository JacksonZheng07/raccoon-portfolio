import { MoonPhases } from "@/components/nature/MoonPhases";
import { TrackTrail } from "@/components/nature/TrackTrail";
import { MaskEyes } from "@/components/raccoon/MaskEyes";
import { formatNoteGap } from "./format";

type NoteGapProps = {
  /** Whole days between the note above and the note below. */
  days: number;
  /** Which of the two dividers this is. */
  variant: "moon" | "tracks";
};

/**
 * The band between two printed notes. It carries one real fact — how long the
 * writer left between them, counted from the two dates — so the divider is a
 * measurement rather than a flourish, and the page gets a breath between two
 * 460-word essays.
 */
export function NoteGap({ days, variant }: NoteGapProps) {
  const gap = formatNoteGap(days);

  if (variant === "moon") {
    return (
      <div className="flex items-center justify-between gap-8 max-[740px]:flex-col max-[740px]:items-start max-[740px]:gap-5">
        <div className="flex items-center gap-5">
          <MaskEyes className="h-auto w-[92px] shrink-0 text-night-line" />
          <p className="m-0 font-mono text-specimen uppercase text-muted">
            {gap}
          </p>
        </div>
        <MoonPhases className="h-auto w-[190px] shrink-0 text-night-line" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-8 max-[740px]:flex-col max-[740px]:items-start max-[740px]:gap-5">
      <p className="m-0 font-mono text-specimen uppercase text-muted">{gap}</p>
      <TrackTrail steps={6} className="h-auto w-[210px] shrink-0 text-ringtail" />
    </div>
  );
}

export default NoteGap;
