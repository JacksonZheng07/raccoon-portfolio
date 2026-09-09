# MySneakyLink

Repo: https://github.com/MySneakyLink/main
# Project Overview
MySneakyLink is a Next.js project where Jackson’s work appears focused on project infrastructure, repository organization, CI/CD, deployment checks, lint/type cleanup, schema utilities, and prompt utilities.
This page emphasizes engineering infrastructure rather than product ownership unless additional product commits are verified.
# Timeline
Active window covered: July 1, 2025 to July 1, 2026.
Provided commit history includes moving project structure into src, test folder setup, GitHub Actions CI/CD, deployment YAML, Vercel deployment checks, type/lint fixes, rollback target, questSchema.ts, and prompt utility work. Exact active dates need GitHub verification.
# My Contributions
- Moved project structure into src.
- Set up test folder structure.
- Added GitHub Actions CI/CD.
- Created or edited deployment YAML.
- Added Vercel deployment checks.
- Fixed type and lint issues.
- Created rollback target.
- Worked on questSchema.ts.
- Added or updated prompt utility code.
Inference: contributions were primarily infrastructure, codebase organization, deployment reliability, and schema/prompt utility support.
# Technical Breakdown
## Frontend
- Next.js project structure.
- Source tree migration into src.
## Testing/CI
- Test folder setup.
- GitHub Actions CI/CD.
- Type checks.
- Lint checks.
## Deployment
- Deployment YAML.
- Vercel deployment checks.
- Rollback target.
## Backend/API / Utilities
- questSchema.ts.
- Prompt utility code.
# Evidence From GitHub
- Commit-history evidence: moving structure into src, test folder setup, GitHub Actions CI/CD, deployment YAML, Vercel deployment checks, type/lint fixes, rollback target, questSchema.ts, and prompt utility.
# Skills Demonstrated
Next.js project organization, CI/CD setup, GitHub Actions, Vercel deployment workflows, TypeScript, lint/type debugging, repository restructuring, deployment rollback planning, and schema utility development.
# Resume Bullets
- Improved Next.js project infrastructure by migrating code into a src structure, setting up test folders, and resolving TypeScript/lint issues.
- Added CI/CD and deployment automation using GitHub Actions, deployment YAML, Vercel checks, and rollback-target support.
- Contributed schema and prompt utility code, including questSchema.ts, to improve maintainability of project logic.
# Interview Talking Points
- Why moving into src improved project organization.
- How GitHub Actions fit into the development workflow.
- What deployment checks were added before Vercel releases.
- How type/lint cleanup reduced deployment risk.
- Why rollback targets are useful.
- What questSchema.ts and prompt utilities were responsible for.
# What To Improve / Follow-up
- Add README documentation for CI/CD workflow.
- Add test coverage once test folder exists.
- Add deployment status badges.
- Document rollback procedure.
- Add architecture notes for schema and prompt utilities.
- Separate infrastructure contributions from product-feature contributions.
# Enhanced Timeline + Build Breakdown
## Quick Work Map
  | Area | Weight | What it means |
  | --- | ---: | --- |
  | CI/CD | ██████████ | GitHub Actions, build/test workflow, CI fixes |
  | Repo structure | ███████ | Moving frontend/backend/tests into src, npm script updates |
  | Deployment | ██████ | Vercel deployment YAML, deploy checks, rollback target |
  | Type/schema utilities | ████ | questSchema.ts, prompt function, validator/type fixes |
## Exact Timeline
  | Date | Evidence | What I did | How I did it |
  | Mar 5, 2026 | Initial commit + Node.js CI workflow | Started repo and first CI workflow. | Added a Node pipeline for install/build/test across Node versions. |
  | Mar 23, 2026 | Next.js components, lint fixes, GitHub Action testing | Brought Next.js app pieces together and tested CI. | Added components, fixed lint errors, then iterated on workflow failures. |
  | Mar 23, 2026 | test folder + CI | Added testing structure. | Created test folder structure and wired it into CI. |
  | Mar 25, 2026 | moved project into src | Reorganized the codebase. | Moved frontend/backend/test-related pieces into src and updated npm scripts. |
  | Mar 25, 2026 | script runner and type validator fixes | Fixed broken workflow/code checks. | Corrected a script runner issue and fixed a types.validator.ts type error. |
  | Mar 26, 2026 | GitHub Actions CI/CD | Added full CI/CD workflow. | Created workflow files to run checks and support deployment. |
  | Mar 26, 2026 | deployment YAML + Vercel deploy check | Added deploy workflow. | Added a deployment YAML to test deployment behavior when code is deployed to Vercel. |
  | Mar 26, 2026 | CI YAML fixes, lint/typecheck changes | Debugged the pipeline. | Fixed YAML naming/issues, temporarily removed failing steps, then restored type/lint steps with dependency fixes. |
  | Mar 26, 2026 | rollback target | Added safer deployment support. | Added a rollback target in the deploy flow. |
  | Apr 14, 2026 | questSchema.ts  • prompt function | Added typed utility work. | Created a quest schema type and prompt function that takes two strings and returns a string. |
## Architecture Sketch
Source files
→ src/ organization
→ npm scripts
→ GitHub Actions CI
→ lint/type/build/test checks
→ deployment YAML
→ Vercel deploy check
→ rollback target
## What I Actually Built
  | System | Specific work | How it worked |
  | Repo structure | Moved app/test/backend/frontend pieces into src. | Made project layout cleaner and scripts easier to reason about. |
  | CI workflow | GitHub Actions for Node app checks. | Automated install/build/test/lint/type style checks. |
  | Deployment workflow | Deployment YAML and Vercel checks. | Added a workflow path for deploy validation. |
  | Debugging | Fixed CI YAML, dev dependency install, lint/type failures. | Iterated on the pipeline until it could run more reliably. |
  | Utility code | questSchema.ts, prompt helper, function renames. | Added typed schema/prompt utilities for cleaner app logic. |
## Concise Resume Angle
Best framing: Next.js infrastructure and CI/CD cleanup.
One-liner: Reorganized a Next.js codebase into src, added GitHub Actions CI/CD, wired test/build/deployment workflows, debugged TypeScript/lint/YAML failures, added Vercel deployment checks, and contributed typed schema/prompt utilities.
## Still Needs Exact Follow-up
- Add workflow file names.
- Add final CI status screenshot.
- Add README section explaining CI/CD.
- Add tests to match the test folder structure.