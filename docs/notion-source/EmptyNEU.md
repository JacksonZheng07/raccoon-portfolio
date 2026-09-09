# EmptyNEU

Repo: https://github.com/Oasis-NEU/f25-group-17
# Project Overview
EmptyNEU is a Northeastern study-space discovery app. The README says it includes authentication, study-space discovery, profiles, course management, Supabase/Postgres, Next.js, React, TypeScript, Tailwind, and Vercel.
The app helps students find study spaces and manage profile/course-related data.
# Timeline
Active window covered: July 1, 2025 to July 1, 2026.
Provided commit/PR history includes study page features, database fetches, login/routing fixes, profile dropdown updates, localStorage persistence, course persistence, refactoring, styling, linting, and deployment/package cleanup. Exact active dates and PR numbers should be verified.
# My Contributions
- Built or refined study page features.
- Worked on database fetches.
- Fixed login and routing issues.
- Added profile dropdown updates for major/year.
- Added localStorage persistence.
- Worked on course persistence.
- Refactored pages/components.
- Improved styling.
- Cleaned up linting, deployment, and package issues.
# Technical Breakdown
## Frontend
- Next.js.
- React.
- TypeScript.
- Tailwind.
- Study-space discovery pages.
- Profile dropdown major/year updates.
- Login/routing fixes.
- Styling/refactoring.
## Backend/API and Database
- Database fetches.
- Course persistence flows.
- Supabase/Postgres.
- User/profile/course data persistence.
## Deployment and CI
- Vercel.
- Package cleanup.
- Deployment cleanup.
- Linting cleanup.
# Evidence From GitHub
- README evidence: auth, study-space discovery, profiles, course management, Supabase/Postgres, Next.js, React, TypeScript, Tailwind, and Vercel.
- Commit/PR evidence: study page features, database fetches, login/routing fixes, profile dropdown major/year update, localStorage persistence, course persistence, refactoring, styling, linting, deployment/package cleanup.
# Skills Demonstrated
Next.js, React, TypeScript, Tailwind CSS, Supabase, PostgreSQL, auth flow debugging, client-side persistence, deployment cleanup, team collaboration, and refactoring.
# Resume Bullets
- Contributed to a Northeastern study-space discovery app using Next.js, React, TypeScript, Tailwind, Supabase/Postgres, and Vercel.
- Built and refined study-page features, profile dropdown fields, login/routing behavior, and course/profile persistence flows.
- Improved reliability through database fetch fixes, localStorage persistence, refactoring, styling, linting, and deployment/package cleanup.
# Interview Talking Points
- How study-space discovery data was fetched and displayed.
- How Supabase/Postgres supported profiles and courses.
- How localStorage was used and where database persistence was preferable.
- What caused login/routing issues and how they were fixed.
- How deployment cleanup improved Vercel readiness.
# What To Improve / Follow-up
- Add screenshots and user-flow demo.
- Document Supabase schema and auth flow.
- Add tests for persistence and routing.
- Add error/loading states for database fetches.
- Clarify what data lives in localStorage versus the database.
- Add exact PR links for Jackson’s contributions.
# Enhanced Timeline + Build Breakdown
## Quick Work Map
  | Area | Weight | What it means |
  | --- | ---: | --- |
  | Frontend product pages | ██████████ | Layout, login/signup, profile, about, study/course pages |
  | Study-space logic | ████████ | Study page buttons, card data, time/weekend/current-day room fixes |
  | Profile/course persistence | ███████ | Major/year dropdown, course storage, localStorage persistence |
  | Backend/deployment cleanup | ██████ | Backend start, database fetch, Vercel config, lint/path/package fixes |
## Exact Timeline
  | Date | Evidence | What I did | How I did it |
  | Oct 17, 2025 | Frontend page PRs, basic layout, login cards | Helped create the initial frontend layout. | Built early pages/cards so the app had navigable screens. |
  | Oct 19, 2025 | login and signup pages | Added authentication-facing pages. | Built the login/signup UI foundation. |
  | Oct 26, 2025 | package/gitignore/theme, profile page, compile fixes, Vercel config | Stabilized frontend setup. | Moved package files, cleaned .gitignore, installed theme support, made code compile, and added Vercel config. |
  | Oct 26–27, 2025 | profile/about/images/component cleanup | Built/profiled public pages and cleaned duplicated code. | Created profile section, rough about page, fixed images, and removed duplicate component folders. |
  | Oct 27, 2025 | started a backend | Began backend work. | Added backend structure so frontend pages could later pull data. |
  | Nov 2, 2025 | add course function, sign-in design, year button, lint/env fixes | Improved signup/course flow. | Added course functionality and fixed form/button/lint setup. |
  | Nov 4, 2025 | study page button/function work | Made study page interactions work. | Added function button behavior on study/page.tsx. |
  | Nov 7, 2025 | routing, login failure, about href, study fixes | Fixed broken navigation/auth flow. | Corrected routing across pages, login failures, and bad links. |
  | Nov 9, 2025 | database fetch, time/weekend logic, cards, full study page, course page fixes | Connected study data and polished study/course features. | Fetched backend data into cards and fixed logic for current time, weekends, course pages, and disabled buttons. |
  | Nov 13–16, 2025 | path/deploy fixes, localStorage, course persistence, UI redesign, major/year dropdown, profile fixes | Refactored and stabilized user profile/course behavior. | Added localStorage persistence, stored enrolled courses, redesigned page boxes, added major/year update dropdowns, and fixed profile update bugs. |
  | Nov 15–16, 2025 | sidebar/home/about refactors, display/update/localStorage fixes | Cleaned structure. | Refactored pages into sidebar-style navigation and fixed display/update issues. |
  | Nov 20, 2025 | current day rooms fix | Fixed room/date logic. | Restored room display to the correct current-day behavior. |
  | Dec 30, 2025 | package updates | Maintenance pass. | Updated packages after the main feature work. |
## Architecture Sketch
User
→ login/signup
→ profile + major/year + courses
→ study-space page
→ backend/database fetch
→ room/course cards
→ localStorage for temporary page-to-page persistence
→ Vercel deployment
## What I Actually Built
  | System | Specific work | How it worked |
  | Study page | Buttons, cards, time/weekend/current-day logic, full study page features. | Made the room/study-space UI interactive and tied it to backend/card data. |
  | Profile/course flow | Profile page, major/year dropdown, course enrollment persistence. | Let users store academic info and preserve selected courses between pages. |
  | Auth/navigation | Login/signup pages, routing fixes, about href fixes. | Made the app usable across pages without broken navigation. |
  | Persistence | localStorage for page-to-page data. | Prevented user selections from disappearing during navigation. |
  | Backend/data | Started backend and fetched database data into cards. | Replaced dummy card behavior with backend-driven data. |
  | Deployment | Vercel config, path config, deployment script, package updates. | Made the app easier to deploy and maintain. |
  | Refactor | Sidebar refactor, home/about/course cleanup, duplicate component removal. | Reduced messy structure after rapid feature development. |
## Concise Resume Angle
Best framing: Team-built full-stack campus product.
One-liner: Contributed to EmptyNEU, a Northeastern study-space discovery app, by building study/course/profile flows, login/signup pages, backend data fetches, localStorage persistence, routing fixes, UI refactors, and Vercel deployment cleanup.
## Still Needs Exact Follow-up
- Add screenshots for study, profile, login, and course pages.
- Document Supabase/Postgres schema.
- Add a clear localStorage-vs-database note.
- Add PR links for each cluster of work.