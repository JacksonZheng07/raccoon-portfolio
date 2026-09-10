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
