const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/**
 * Renders an ISO note date as "August 24, 2026". Deliberately not
 * `toLocaleDateString`: the build machine and the visitor's browser must agree
 * on the string, or the static HTML and the hydrated DOM disagree.
 */
export function formatNoteDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    throw new Error(`Note date "${isoDate}" is not an ISO date (YYYY-MM-DD)`);
  }

  const [, year, month, day] = match;
  const monthName = MONTHS[Number(month) - 1];
  if (monthName === undefined) {
    throw new Error(`Note date "${isoDate}" has no month ${month}`);
  }

  return `${monthName} ${Number(day)}, ${year}`;
}

const MS_PER_DAY = 86_400_000;

/** Cardinal words up to twelve; past that the numeral reads faster. */
const SMALL_NUMBERS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
] as const;

function parseIsoDate(isoDate: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    throw new Error(`Note date "${isoDate}" is not an ISO date (YYYY-MM-DD)`);
  }
  const [, year, month, day] = match;
  return Date.UTC(Number(year), Number(month) - 1, Number(day));
}

/**
 * Whole days from one note's date to the next. UTC on both sides, so the gap
 * printed into the static HTML does not depend on the build machine's zone.
 */
export function daysBetweenNotes(fromIso: string, toIso: string): number {
  return Math.round((parseIsoDate(toIso) - parseIsoDate(fromIso)) / MS_PER_DAY);
}

/**
 * The between-notes divider's caption: "seven days later". Written out up to
 * twelve, then numeric, and singular at one.
 */
export function formatNoteGap(days: number): string {
  if (!Number.isInteger(days) || days < 0) {
    throw new Error(`Note gap ${days} is not a whole number of days`);
  }
  if (days === 0) {
    return "the same day";
  }
  const word = SMALL_NUMBERS[days] ?? String(days);
  return days === 1 ? "one day later" : `${word} days later`;
}

/**
 * Thousands separators without `toLocaleString`, for the same reason
 * `formatNoteDate` avoids it: the server and the browser must agree.
 */
export function formatWordCount(words: number): string {
  return String(words).replace(/\B(?=(\d{3})+$)/g, ",");
}

/**
 * Which paragraph a marginal pull quote was lifted from, one-based. The
 * marginal attribution has to point at the real paragraph, so a quote that is
 * no longer in the essay is a build error rather than a wrong label.
 */
export function findQuoteParagraph(
  paragraphs: readonly string[],
  quote: string,
): number {
  const index = paragraphs.findIndex((paragraph) => paragraph.includes(quote));
  if (index === -1) {
    throw new Error(`Pull quote is not in the note body: "${quote}"`);
  }
  return index + 1;
}
