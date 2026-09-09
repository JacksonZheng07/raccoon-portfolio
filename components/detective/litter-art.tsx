/*
 * The litter: solid-fill marks, built to survive being drawn at 20px.
 *
 * GENERATED FROM the .svg files in public/assets/detective. Every entry is a
 * verbatim inline copy of its file so the artwork can inherit `currentColor`
 * and be styled with Tailwind text utilities. tests/unit/nature-assets.test.ts
 * asserts each entry's geometry and viewBox still match the file on disk, so
 * the two cannot drift: change one and you must change the other.
 */
import type { FieldArt } from "../nature/field-art";

export type LitterName =
  | "banana-peel"
  | "fish-bone"
  | "crumpled-can"
  | "apple-core";

export const LITTER_ART: Record<LitterName, FieldArt> = {
  "banana-peel": {
    viewBox: "0 0 84 52",
    art: (
      <>
        <path d="M 26.1 31.3 L 23.7 28.9 L 21.8 26.5 L 20.2 24.3 L 18.9 22.1 L 17.8 19.9 L 16.8 17.8 L 15.8 15.8 L 14.8 13.8 L 13.6 11.9 L 12.1 10.1 L 10.2 8.7 L 8 7.7 L 6 12.3 L 6.9 13.1 L 7.5 14 L 7.9 15.1 L 8.3 16.5 L 8.7 18.3 L 9.2 20.4 L 9.8 22.9 L 10.6 25.6 L 11.8 28.6 L 13.3 31.8 L 15.3 35.2 L 17.9 38.7 Z" fill="currentColor" stroke="none"/>
        <path d="M 46.9 38.9 L 47.3 34.7 L 47.3 30.9 L 47.1 27.4 L 46.6 24.3 L 46 21.5 L 45.3 19 L 44.6 16.8 L 44 14.8 L 43.5 13.1 L 43.1 11.5 L 42.9 10 L 42.9 8.5 L 39.1 7.5 L 38.4 9.5 L 38.1 11.6 L 38 13.7 L 38.1 15.9 L 38.3 18 L 38.4 20.3 L 38.6 22.6 L 38.6 25.1 L 38.6 27.7 L 38.3 30.5 L 37.9 33.7 L 37.1 37.1 Z" fill="currentColor" stroke="none"/>
        <path d="M 65.5 39.2 L 68.5 36.1 L 70.8 33 L 72.6 29.9 L 74 27 L 74.9 24.3 L 75.6 21.8 L 76.2 19.6 L 76.6 17.7 L 77.1 16.2 L 77.6 15 L 78.1 14.1 L 79 13.3 L 77 8.7 L 74.8 9.7 L 72.9 11.2 L 71.4 13 L 70.2 15 L 69.1 17 L 68.1 19 L 67.1 21 L 65.9 23 L 64.5 25 L 62.9 26.9 L 60.9 28.9 L 58.5 30.8 Z" fill="currentColor" stroke="none"/>
        <path d="M 19 32 C 26 43 58 43 65 32 C 67 41 56 50 42 50 C 28 50 17 41 19 32 Z" fill="currentColor" stroke="none"/>
      </>
    ),
  },
  "fish-bone": {
    viewBox: "0 0 46 26",
    art: (
      <>
        <path d="M 4 13 C 8 5 17 4 23 7 L 23 19 C 17 22 8 21 4 13 Z" fill="currentColor" stroke="none"/>
        <circle cx="10" cy="12" r="1.9" fill="var(--color-paper, #f7f3e9)" stroke="none"/>
        <path d="M 23 10.6 L 36 10.6 L 36 15.4 L 23 15.4 Z" fill="currentColor" stroke="none"/>
        <path d="M 35 12 L 44 4 L 44 22 L 35 14 Z" fill="currentColor" stroke="none"/>
        <path d="M 25.5 11 L 29.5 2 L 32.1 3.4 L 28.1 12 Z" fill="currentColor" stroke="none"/>
        <path d="M 25.5 15 L 29.5 24 L 32.1 22.6 L 28.1 14 Z" fill="currentColor" stroke="none"/>
        <path d="M 30.5 11 L 34.5 2 L 37.1 3.4 L 33.1 12 Z" fill="currentColor" stroke="none"/>
        <path d="M 30.5 15 L 34.5 24 L 37.1 22.6 L 33.1 14 Z" fill="currentColor" stroke="none"/>
      </>
    ),
  },
  "crumpled-can": {
    viewBox: "0 0 30 50",
    art: (
      <>
        <path d="M 3 7 C 7 13 11 15 15 15 C 19 15 23 13 27 7 L 25 22 L 16 27 L 26 32 L 27 45 C 19 47 11 47 3 45 L 3 25 Z" fill="currentColor" stroke="none"/>
        <ellipse cx="15" cy="11" rx="8.5" ry="3.4" fill="var(--color-paper, #f7f3e9)" stroke="none"/>
      </>
    ),
  },
  "apple-core": {
    viewBox: "0 0 28 32",
    art: (
      <>
        <path d="M 5 9 C 10 11 14 11 19 9 C 16 15 16 21 19 27 C 14 25 10 25 5 27 C 8 21 8 15 5 9 Z" fill="currentColor" stroke="none"/>
        <path d="M 10.4 3 L 13.6 3 L 14 10 L 10 10 Z" fill="currentColor" stroke="none"/>
        <path d="M 14 4 C 19 1 24 3 24 7 C 19 9 15 7 14 4 Z" fill="currentColor" stroke="none"/>
      </>
    ),
  },
};
