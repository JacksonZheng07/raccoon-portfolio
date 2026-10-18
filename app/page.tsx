import { Desktop } from "@/components/desktop/Desktop";
import type { DesktopProject } from "@/components/desktop/types";
import { getAllNotes } from "@/lib/notes";
import { getAllProjects } from "@/lib/projects";
import { getSyncRecord } from "@/lib/sync";

export default function Home() {
  const projects: DesktopProject[] = getAllProjects().map(
    ({ resumeBullets, talkingPoints, notionUrl, status, evidence, ...rest }) => {
      void [resumeBullets, talkingPoints, notionUrl, status, evidence];
      return rest;
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
