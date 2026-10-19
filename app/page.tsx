import { Desktop } from "@/components/desktop/Desktop";
import type { DesktopProject } from "@/components/desktop/types";
import { getAllNotes } from "@/lib/notes";
import { getAllProjects } from "@/lib/projects";
import { getSyncRecord } from "@/lib/sync";
import demos from "@/content/demos.json";
import github from "@/content/github.json";

export default function Home() {
  const projects: DesktopProject[] = getAllProjects().map(
    ({ resumeBullets, talkingPoints, notionUrl, status, evidence, ...rest }) => {
      void [resumeBullets, talkingPoints, notionUrl, status, evidence];
      const demo = (demos as Record<string, string>)[rest.slug];
      const activity = (github.repos as Record<string, DesktopProject["activity"]>)[rest.slug];
      return { ...rest, ...(demo ? { demo } : {}), ...(activity ? { activity } : {}) };
    },
  );

  return (
    <Desktop
      projects={projects}
      notes={getAllNotes()}
      sync={getSyncRecord()}
    />
  );
}
