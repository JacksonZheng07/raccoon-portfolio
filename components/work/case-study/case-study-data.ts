import type { Project } from "@/lib/projects";

/** One step of an architecture sketch. `label` is the "Browser IDE:" prefix. */
export type FlowStep = {
  label: string | undefined;
  text: string;
};

/**
 * A single sequence of steps. `title` is set when the flow began with a
 * labelled step, which is how the source folds a second flow into one array.
 */
export type ArchitectureFlow = {
  title: string | undefined;
  steps: FlowStep[];
};

/*
 * A labelled step looks like "Browser IDE: runCapture(code, env)": a short
 * capitalised phrase, no slashes or sentence punctuation, then a colon. The
 * length and character limits keep ordinary steps such as
 * "Pain / symptoms / wound / medication / mobility logs" out.
 */
const LABELLED_STEP = /^([A-Z][A-Za-z0-9 .+-]{0,30}):\s+(\S.*)$/;

function readStep(step: string): FlowStep {
  const match = LABELLED_STEP.exec(step);
  if (!match) {
    return { label: undefined, text: step };
  }
  return { label: match[1], text: match[2] ?? step };
}

/**
 * Split an architecture sketch into the flows it actually contains.
 *
 * The content layer stores the sketch as one flat array with the arrows
 * stripped, and a few projects fold a second flow into the same array by
 * naming it inline ("Browser IDE: runCapture(code, env)"). A labelled step
 * starts a new flow only when more steps follow it; a labelled step in last
 * position is a caption on that step, not a flow with nothing in it.
 */
export function splitArchitectureFlows(
  architecture: readonly string[],
): ArchitectureFlow[] {
  const flows: ArchitectureFlow[] = [];
  let current: ArchitectureFlow | undefined;

  architecture.forEach((raw, index) => {
    const step = readStep(raw);
    const startsFlow =
      step.label !== undefined &&
      current !== undefined &&
      current.steps.length > 0 &&
      index < architecture.length - 1;

    if (current === undefined) {
      current = { title: undefined, steps: [] };
      flows.push(current);
    }

    if (startsFlow) {
      current = { title: step.label, steps: [{ label: undefined, text: step.text }] };
      flows.push(current);
      return;
    }

    current.steps.push(step);
  });

  return flows;
}

/** An `Inference:` or `Fact:` line carried over verbatim from the source. */
export type Hedge = {
  kind: "Inference" | "Fact";
  text: string;
};

const HEDGE = /^(Inference|Fact):\s+(\S.*)$/;

/**
 * Pull the epistemic hedges out of the contributions list. They are the
 * source's own notes about what is inferred rather than verified, so they get
 * their own treatment instead of reading as one more equal bullet.
 */
export function splitContributions(contributions: readonly string[]): {
  bullets: string[];
  hedges: Hedge[];
} {
  const bullets: string[] = [];
  const hedges: Hedge[] = [];

  for (const contribution of contributions) {
    const match = HEDGE.exec(contribution);
    const kind = match?.[1];
    const text = match?.[2];

    if ((kind === "Inference" || kind === "Fact") && text !== undefined) {
      hedges.push({ kind, text });
    } else {
      bullets.push(contribution);
    }
  }

  return { bullets, hedges };
}

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

function monthAndYear(isoDate: string): { month: string; year: string } {
  const [year = "", month = "01"] = isoDate.split("-");
  return { month: MONTHS[Number(month) - 1] ?? month, year };
}

/**
 * The work's active window, to the month. ISO strings are read by their parts
 * rather than through `Date`, so a build in any timezone prints the same range.
 */
export function formatDateRange(start: string, end: string): string {
  const from = monthAndYear(start);
  const to = monthAndYear(end);

  if (from.year !== to.year) {
    return `${from.month} ${from.year} – ${to.month} ${to.year}`;
  }
  if (from.month !== to.month) {
    return `${from.month} – ${to.month} ${to.year}`;
  }
  return `${to.month} ${to.year}`;
}

/** The case studies either side of `slug`, in the order the index lists them. */
export function adjacentCaseStudies(
  projects: readonly Project[],
  slug: string,
): { previous: Project | undefined; next: Project | undefined } {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) {
    return { previous: undefined, next: undefined };
  }
  return { previous: projects[index - 1], next: projects[index + 1] };
}

/** The specimen number a case study carries, e.g. "03". */
export function specimenNumber(
  projects: readonly Project[],
  slug: string,
): string {
  const index = projects.findIndex((project) => project.slug === slug);
  return String(index + 1).padStart(2, "0");
}
