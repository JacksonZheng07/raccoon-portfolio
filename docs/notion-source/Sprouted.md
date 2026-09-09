# Sprouted

Repo: https://github.com/zachwaffle4/cs3200-sprouted
# Project Overview
Sprouted is a full-stack community garden management platform. The README lists Jackson Zheng as a team member. The stack includes Python, Streamlit frontend, Flask REST API, MySQL, Docker, and Docker Compose.
The app supports community garden operations through database-backed workflows, REST routes, volunteer pages, role navigation, and seeded persona data.
# Timeline
Active window covered: July 1, 2025 to July 1, 2026.
Provided commit history indicates work on database schema/seeding, Docker boot behavior, persona data, REST API routes, volunteer pages, role navigation, and UI fixes. Exact active commit dates and Jackson-authored commits should be verified.
# My Contributions
- Worked on database schema and seed data.
- Updated seed.py data initialization.
- Worked on Docker boot changes.
- Added persona data seeding.
- Added or updated REST API routes.
- Built volunteer pages.
- Worked on role-based navigation.
- Fixed UI button issues.
Fact: README lists Jackson Zheng as a team member.
# Technical Breakdown
## Frontend
- Streamlit frontend.
- Volunteer pages.
- Role navigation.
- UI button fixes.
## Backend/API
- Flask REST API.
- REST route implementation.
- Backend data access flows.
## Database
- MySQL schema.
- Seed data.
- Persona data seeding.
- seed.py.
## Deployment
- Docker.
- Docker Compose.
- Docker boot changes.
# Evidence From GitHub
- README evidence: Jackson Zheng listed as a team member; stack includes Python, Streamlit, Flask REST API, MySQL, Docker, and Docker Compose.
- Commit-history evidence: database schema/seed work, seed.py, Docker boot changes, persona data seeding, REST API routes, volunteer pages, role navigation, and UI button fixes.
# Skills Demonstrated
Python, Streamlit, Flask REST APIs, MySQL, Docker, Docker Compose, database seeding, full-stack development, team collaboration, role-based UI flows, and data modeling.
# Resume Bullets
- Contributed to a full-stack community garden platform using Streamlit, Flask REST APIs, MySQL, Docker, and Docker Compose.
- Implemented database schema and seeding workflows, including persona data and seed.py, to support realistic demo scenarios.
- Built backend REST routes and frontend volunteer/role-navigation flows, improving usability across garden-management roles.
- Fixed Docker boot and UI issues to improve local development reliability and application polish.
# Interview Talking Points
- How the MySQL schema modeled garden operations.
- How seed data/personas helped test real workflows.
- How Flask routes connected frontend to database.
- Why Docker Compose helped standardize development.
- How Streamlit influenced frontend design tradeoffs.
# What To Improve / Follow-up
- Add ER diagram.
- Add API route documentation.
- Add screenshots of volunteer and role-specific flows.
- Add tests for backend routes.
- Add clearer Docker Compose setup instructions.
- Add exact contribution references for each teammate.
# Enhanced Timeline + Build Breakdown
## Quick Work Map
  | Area | Weight | What it means |
  | --- | ---: | --- |
  | Database / seed data | ██████████ | SQL setup, seed.py, persona data, realistic demo data |
  | Backend/API | ███████ | Flask routes, field mapping, persona-specific backend support |
  | Frontend / Streamlit | ██████ | Persona pages, Home/nav updates, UI button cleanup |
  | Docker/dev setup | ████ | Docker Compose boot flow and startup automation |
## Exact Timeline
  | Date / time | Evidence | What I did | How I did it |
  | Apr 15, 2026 | SQL/seeding setup | Started database setup work. | Added schema/seed material from the shared project source into the repo. |
  | Apr 20, 2026 9:44 PM | Seeding data (#3) | Improved seed data workflow. | Refactored seed.py so it could retrieve/print database data without manual prompting. |
  | Apr 20, 2026 11:10 PM | Frontend personas (#10) | Helped merge persona-driven frontend work. | Updated Home/nav to reflect personas/pages and helped resolve navigation conflicts. |
  | Apr 21, 2026 1:07 AM | Frontend personas (#13) | Continued persona integration. | Helped combine persona pages, role nav, and backend table changes into the main app. |
  | Apr 21, 2026 3:44 AM | API/field mapping work | Helped fix route/data integration. | Worked through API route and field mapping issues across persona pages. |
  | Apr 21, 2026 3:54 AM | persona seeding info | Added persona seed details. | Added realistic persona data so role-based pages had data to display. |
  | Apr 21, 2026 4:06 AM | UI button fix | Cleaned duplicate button behavior. | Fixed the UI so there was only one proper button per Lucia flow. |
  | Apr 21, 2026 4:47 AM | seed.py  • Docker Compose boot | Improved local startup. | Changed seed script and Docker Compose flow so seeding ran during boot instead of requiring a separate manual exec step. |
## Architecture Sketch
Streamlit UI
→ role/persona navigation
→ Flask REST API
→ MySQL database
→ schema + seed.py
→ Docker Compose boots services and seeds data
## What I Actually Built
  | System | Specific work | How it worked |
  | Seed data | SQL seed files, persona data, seed.py updates. | Populated realistic app data so each role page had something useful to show. |
  | Docker startup | Docker Compose + seed script boot flow. | Made local setup easier by running seed logic during startup. |
  | Backend routes | Persona-specific API routes and field mapping fixes. | Connected frontend role pages to backend/database data. |
  | Frontend personas | Home/nav updates and persona pages. | Let users enter the app through role-specific workflows. |
  | UI cleanup | Button fixes and navigation conflict cleanup. | Reduced duplicate controls and merge-conflict breakage. |
## Concise Resume Angle
Best framing: Full-stack database-backed class/team app.
One-liner: Contributed to a Streamlit + Flask + MySQL + Docker community garden app by building seed data flows, persona-based navigation/pages, backend route fixes, API field mapping, Docker startup automation, and UI cleanup.
## Still Needs Exact Follow-up
- Add ER diagram.
- Add API route list.
- Add screenshots for each role/persona page.
- Add exact ownership notes for team-authored PRs.