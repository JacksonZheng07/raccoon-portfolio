import { FieldSvg } from "@/components/nature/field-art";
import { MICRO_ART } from "@/components/raccoon/micro-art";
import styles from "./scroll-paws.module.css";

/*
 * The trail of tracks that walks down the page as you scroll it.
 *
 * A Server Component with no script behind it: the whole behaviour is the
 * scroll-driven animation in `scroll-paws.module.css`, which is why this file
 * is only markup. Decorative and `aria-hidden` — the tracks say nothing the
 * page does not already say, and a screen reader has no scroll position to
 * describe.
 *
 * The mark is `track-single` from the existing library rather than a new
 * drawing, so the trail down the margin is the same foot as the trails on the
 * home page and in the hero.
 */

const STEPS = 10;

/** The stagger classes, indexed by step. Named so Tailwind never sees them. */
const RANGE = [
  styles.s0,
  styles.s1,
  styles.s2,
  styles.s3,
  styles.s4,
  styles.s5,
  styles.s6,
  styles.s7,
  styles.s8,
  styles.s9,
];

const { viewBox, art } = MICRO_ART["track-single"];

export function ScrollPaws() {
  return (
    <div aria-hidden="true" className={styles.rail}>
      <div className={styles.gait}>
        {Array.from({ length: STEPS }, (_, index) => (
          <span key={index} className={`${styles.step} ${RANGE[index]}`}>
            <span
              className={index % 2 === 0 ? styles.footLeft : styles.footRight}
            >
              <FieldSvg viewBox={viewBox} className="block h-full w-full">
                {art}
              </FieldSvg>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default ScrollPaws;
