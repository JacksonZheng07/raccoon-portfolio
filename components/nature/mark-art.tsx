/*
 * The notebook furniture: tape, pins, tags and the other apparatus.
 *
 * GENERATED FROM the .svg files in public/assets/marks. Every entry is a verbatim
 * inline copy of its file so the artwork can inherit `currentColor` and be
 * styled with Tailwind text utilities. tests/unit/nature-assets.test.ts
 * asserts each entry's geometry and viewBox still match the file on disk, so
 * the two cannot drift: change one and you must change the other.
 */
import type { FieldArt } from "./field-art";

export type MarkName =
  | "arrow-hand"
  | "bracket"
  | "coffee-ring"
  | "paper-clip"
  | "push-pin"
  | "ruled-margin"
  | "scale-bar"
  | "specimen-tag"
  | "tape-strip"
  | "torn-edge";

export const MARK_ART: Record<MarkName, FieldArt> = {
  "arrow-hand": {
    viewBox: "0 0 40 24",
    art: (
      <>
        <path d="M 2 19 C 11 18.4 21 14 34 6"/>
        <path d="M 34 6 L 25.4 7.6"/>
        <path d="M 34 6 L 32 14.4"/>
      </>
    ),
  },
  "bracket": {
    viewBox: "0 0 16 48",
    art: (
      <>
        <path d="M 12 2 C 6.5 2 6 6 6 10 L 6 21 C 6 23 4 24 2 24 C 4 24 6 25 6 27 L 6 38 C 6 42 6.5 46 12 46"/>
      </>
    ),
  },
  "coffee-ring": {
    viewBox: "0 0 40 40",
    art: (
      <>
        <path d="M 34.9 20.2 L 34.9 21.2 L 34.8 22.2 L 34.5 23.1 L 34.2 24.1 L 33.7 25.1 L 33.2 26.0 L 32.6 27.0 L 31.9 27.9 L 31.2 28.8 L 30.5 29.6 L 29.7 30.4 L 28.9 31.2 L 28.1 32.0 L 27.3 32.6 L 26.3 33.2 L 25.4 33.7 L 24.4 34.1 L 23.4 34.4 L 22.3 34.6 L 21.2 34.7 L 20.1 34.8 L 18.9 34.7 L 17.8 34.6 L 16.6 34.4 L 15.5 34.2 L 14.4 33.9 L 13.2 33.6 L 12.1 33.2 L 11.1 32.7 L 10.1 32.1 L 9.2 31.4 L 8.4 30.7 L 7.7 29.8 L 7.2 28.9 L 6.8 27.9 L 6.5 26.8 L 6.3 25.8 L 6.2 24.7 L 6.2 23.6 L 6.3 22.4 L 6.4 21.3 L 6.5 20.2 L 6.6 19.0 L 6.8 17.9 L 6.9 16.8 L 7.1 15.8 L 7.3 14.7 L 7.6 13.7 L 7.9 12.7 L 8.3 11.8 L 8.8 10.9 L 9.4 10.0 L 10.0 9.2 L 10.8 8.5 L 11.6 7.7 L 12.5 7.1 L 13.5 6.5 L 14.5 6.0 L 15.6 5.5 L 16.7 5.1 L 17.8 4.8 L 18.9 4.5 L 20.0 4.4 L 21.2 4.4 L 22.3 4.5 L 23.4 4.7 L 24.5 5.1 L 25.5 5.6 L 26.4 6.2 L 27.3 6.9 L 28.1 7.7 L 28.9 8.5 L 29.6 9.4 L 30.3 10.4 L 30.9 11.3 L 31.6 12.2 L 32.2 13.2 L 32.8 14.2 L 33.4 15.1 L 33.9 16.1 L 34.3 17.1 L 34.6 18.1 L 34.8 19.2 L 34.9 20.2 L 39.3 19.8 L 39.0 18.3 L 38.6 16.8 L 38.0 15.5 L 37.3 14.2 L 36.6 13.1 L 35.8 12.1 L 35.0 11.1 L 34.2 10.2 L 33.4 9.3 L 32.6 8.5 L 31.7 7.6 L 30.9 6.7 L 29.9 5.8 L 28.9 5.0 L 27.8 4.2 L 26.6 3.5 L 25.4 2.9 L 24.1 2.5 L 22.7 2.2 L 21.3 2.0 L 20.0 2.0 L 18.6 2.0 L 17.3 2.2 L 15.9 2.5 L 14.6 2.8 L 13.4 3.2 L 12.1 3.6 L 10.9 4.2 L 9.7 4.8 L 8.5 5.6 L 7.4 6.4 L 6.3 7.4 L 5.4 8.5 L 4.6 9.7 L 3.9 11.0 L 3.4 12.3 L 3.0 13.6 L 2.7 14.9 L 2.5 16.2 L 2.3 17.4 L 2.2 18.6 L 2.1 19.8 L 2.1 21.1 L 2.1 22.3 L 2.1 23.7 L 2.3 25.1 L 2.6 26.5 L 3.0 27.9 L 3.6 29.3 L 4.3 30.6 L 5.3 31.7 L 6.3 32.8 L 7.5 33.7 L 8.7 34.4 L 10.0 35.0 L 11.3 35.5 L 12.5 35.9 L 13.8 36.2 L 15.0 36.5 L 16.2 36.7 L 17.5 36.9 L 18.7 37.1 L 19.9 37.2 L 21.2 37.2 L 22.5 37.2 L 23.8 37.1 L 25.2 36.9 L 26.5 36.5 L 27.7 36.1 L 29.0 35.5 L 30.1 34.8 L 31.2 34.1 L 32.3 33.3 L 33.3 32.4 L 34.2 31.5 L 35.2 30.6 L 36.0 29.6 L 36.9 28.4 L 37.6 27.2 L 38.3 25.9 L 38.8 24.5 L 39.2 23.0 L 39.3 21.4 L 39.3 19.8 Z" fill="currentColor" stroke="none"/>
      </>
    ),
  },
  "paper-clip": {
    viewBox: "0 0 20 36",
    art: (
      <>
        <path d="M 7 12 L 7 26 C 7 30.5 13.5 30.5 13.5 26 L 13.5 10 C 13.5 5.5 4 5.5 4 10 L 4 24"/>
      </>
    ),
  },
  "push-pin": {
    viewBox: "0 0 24 32",
    art: (
      <>
        <path d="M 4 3.5 C 4 1 20 1 20 3.5 C 20 8 16.5 11 15.5 12 L 8.5 12 C 7.5 11 4 8 4 3.5 Z" fill="currentColor" stroke="none"/>
        <path d="M 4 3.5 C 4 1 20 1 20 3.5 C 20 8 16.5 11 15.5 12 L 8.5 12 C 7.5 11 4 8 4 3.5 Z"/>
        <path d="M 8.4 12 L 15.6 12 L 15 16.4 L 9 16.4 Z" fill="currentColor" stroke="none"/>
        <path d="M 12 16.4 L 12 30"/>
      </>
    ),
  },
  "ruled-margin": {
    viewBox: "0 0 24 64",
    art: (
      <>
        <path d="M 17 2 L 17 62"/>
        <path d="M 20 2 L 20 62"/>
        <path d="M 2 10 L 14 10"/>
        <path d="M 2 21 L 14 21"/>
        <path d="M 2 32 L 14 32"/>
        <path d="M 2 43 L 14 43"/>
        <path d="M 2 54 L 14 54"/>
      </>
    ),
  },
  "scale-bar": {
    viewBox: "0 0 64 20",
    art: (
      <>
        <path d="M 4 8 L 18 8 L 18 14 L 4 14 Z" fill="currentColor" stroke="none"/>
        <path d="M 18 8 L 32 8 L 32 14 L 18 14 Z" fill="var(--color-paper, #f7f3e9)" stroke="none"/>
        <path d="M 32 8 L 46 8 L 46 14 L 32 14 Z" fill="currentColor" stroke="none"/>
        <path d="M 46 8 L 60 8 L 60 14 L 46 14 Z" fill="var(--color-paper, #f7f3e9)" stroke="none"/>
        <path d="M 4 8 L 60 8 L 60 14 L 4 14 Z"/>
        <path d="M 4 14 L 4 18"/>
        <path d="M 32 14 L 32 18"/>
        <path d="M 60 14 L 60 18"/>
      </>
    ),
  },
  "specimen-tag": {
    viewBox: "0 0 40 56",
    art: (
      <>
        <path d="M 6 14 L 14 6 L 34 6 L 34 50 L 6 50 Z" fill="var(--color-paper, #f7f3e9)"/>
        <path d="M 6 14 L 14 14 L 14 6"/>
        <circle cx="10.5" cy="10.5" r="2.4" fill="var(--color-paper, #f7f3e9)"/>
        <path d="M 10.5 10.5 C 5 6 4 2 8 1"/>
        <path d="M 11 26 L 29 26"/>
        <path d="M 11 34 L 29 34"/>
        <path d="M 11 42 L 22 42"/>
      </>
    ),
  },
  "tape-strip": {
    viewBox: "0 0 64 24",
    art: (
      <>
        <path d="M 4.0 4.0 L 60.0 5.0 L 58.5 8.0 L 60.5 11.0 L 58.5 14.0 L 60.0 17.0 L 59.0 19.0 L 5.0 18.0 L 3.5 15.0 L 5.5 12.0 L 3.5 9.0 L 5.0 6.0 Z" fill="var(--color-paper, #f7f3e9)"/>
        <path d="M 16 8 L 22 16"/>
        <path d="M 30 8 L 36 16"/>
        <path d="M 44 8 L 50 16"/>
      </>
    ),
  },
  "torn-edge": {
    viewBox: "0 0 120 16",
    art: (
      <>
        <path d="M 2.0 7.9 L 9.2 9.2 L 16.1 8.0 L 23.5 9.7 L 30.5 8.4 L 38.7 6.9 L 44.9 6.9 L 53.1 11.1 L 58.3 9.4 L 67.1 8.4 L 74.6 7.0 L 79.7 10.7 L 84.9 7.1 L 90.9 6.7 L 97.7 7.8 L 106.1 10.7 L 113.7 8.0 L 118.0 8.2 L 118.0 0.0 L 2.0 0.0 Z" fill="var(--color-paper, #f7f3e9)" stroke="none"/>
        <path d="M 2.0 7.9 L 9.2 9.2 L 16.1 8.0 L 23.5 9.7 L 30.5 8.4 L 38.7 6.9 L 44.9 6.9 L 53.1 11.1 L 58.3 9.4 L 67.1 8.4 L 74.6 7.0 L 79.7 10.7 L 84.9 7.1 L 90.9 6.7 L 97.7 7.8 L 106.1 10.7 L 113.7 8.0 L 118.0 8.2"/>
      </>
    ),
  },
};
