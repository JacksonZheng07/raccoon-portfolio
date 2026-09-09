# SkyPrint

Repo: https://github.com/JacksonZheng07/SkyPrint
# Project Overview
SkyPrint is a climate-tech aviation platform for comparing flights based on CO2 and contrail impact. The README describes a stack using Next.js, React, Tailwind, a Python/FastAPI contrail engine, climate reasoning, guide behavior, notification flow, aircraft/CO2/contrail scoring, and greener alternative logic.
The product helps users compare aviation climate impact using deterministic aircraft and emissions data plus explanation features.
# Timeline
Active window covered: July 1, 2025 to July 1, 2026.
Known phases:
- Hero page and product UI.
- Purchase and comparison pages.
- Guide behavior.
- Climate reasoning pipeline.
- Deterministic CO2 and contrail calculations.
- Centralized aircraft data.
- Greener alternative logic.
- Glassmorphism redesign and final polish.
# My Contributions
- Built the landing/hero page and main product UI.
- Created purchase and flight comparison pages.
- Implemented or integrated guide behavior.
- Worked on climate reasoning pipeline behavior.
- Implemented deterministic CO2 and contrail calculations.
- Centralized aircraft data for scoring.
- Added greener alternative recommendations.
- Redesigned UI with a glassmorphism visual style.
- Polished product flows and presentation.
# Technical Breakdown
## Frontend
- Next.js app.
- React components.
- Tailwind styling.
- Hero page and product UI.
- Purchase flow.
- Flight comparison pages.
- Glassmorphism redesign.
- Notification flow.
- Guide UI behavior.
## Backend/API and Data
- Python/FastAPI contrail engine.
- Climate calculation support.
- Aircraft data.
- CO2 scoring.
- Contrail scoring.
- Greener alternative logic.
## Docs
- README explaining product, stack, and climate scoring features.
# Evidence From GitHub
- README evidence: Next.js, React, Tailwind, Python/FastAPI contrail engine, climate reasoning, guide behavior, notification flow, aircraft/CO2/contrail scoring.
- Commit-history evidence: hero page, product UI, purchase/comparison pages, guide behavior, climate pipeline, deterministic calculations, centralized aircraft data, greener alternative logic, glassmorphism redesign, and final polish.
# Skills Demonstrated
Next.js, React, Tailwind CSS, product UI design, climate-tech modeling, API integration, Python/FastAPI, data-driven scoring, AI-guide integration, UX polish, and technical storytelling.
# Resume Bullets
- Built a climate-aware aviation comparison platform using Next.js, React, Tailwind, and a Python/FastAPI contrail engine to score flights by CO2 and contrail impact.
- Implemented deterministic aircraft, CO2, and contrail scoring logic with centralized aircraft data and greener alternative recommendations.
- Developed product flows including landing, purchase, comparison, notification, and guide experiences, then polished the interface with a glassmorphism redesign.
# Interview Talking Points
- How CO2 and contrail impact differ as climate signals.
- Why deterministic calculations were useful for flight scoring.
- How centralized aircraft data supports consistent comparisons.
- How the FastAPI engine fits with the Next.js frontend.
- How guide behavior explains climate impact to users.
# What To Improve / Follow-up
- Add citations or methodology notes for CO2 and contrail calculations.
- Add tests for scoring logic.
- Add calibration against real aviation datasets.
- Add clearer explanation of AI/model roles.
- Add error handling for missing aircraft/route data.
- Add screenshots and example comparisons.
# Enhanced Timeline + Build Breakdown
## Quick Work Map
  | Area | Weight | What it means |
  | --- | ---: | --- |
  | Product UI | ██████████ | Landing page, purchase flow, comparison pages, simulation polish |
  | Climate scoring logic | ████████ | CO2 scaling, contrail score, aircraft data, deterministic scoring |
  | AI / explanation layer | █████ | K2 reasoning, guide behavior, climate explanation sections |
  | Deployment / polish | ████ | Vercel config, merge conflict cleanup, type fixes, final UI cleanup |
## Exact Timeline
  | Date / time | Evidence | What I did | How I did it |
  | Apr 18, 2026 3:08 PM | feat: initial commit | Started the SkyPrint codebase. | Created the base app structure. |
  | Apr 18, 2026 4:04 PM | basic UI/UX design | Built first UI direction. | Added early layout and visual flow for the product. |
  | Apr 18, 2026 8:47 PM | UI/UX flow fixes | Improved the interaction path. | Adjusted page flow so the product felt less like separate screens and more like one experience. |
  | Apr 18, 2026 9:15–11:56 PM | deployment + Vercel + gradient fixes | Cleaned deployment and visual seams. | Removed bad config, fixed merge conflicts, and replaced disconnected dividers with gradient overlays. |
  | Apr 19, 2026 12:18 AM | hero page | Built the landing/hero experience. | Fleshed out the page that explains the product and draws users into comparison flows. |
  | Apr 19, 2026 2:53 AM | Aero movement + purchase/comparison pages | Built the core user-facing flow. | Added guide behavior and designed purchase/comparison pages together. |
  | Apr 19, 2026 3:08–3:14 AM | rough UI finished + simulation fixes | Completed UI pass for teammates/demo. | Pushed a rough but complete interface and fixed simulation details. |
  | Apr 19, 2026 early AM | K2 climate pipeline + CO2 scaling | Added climate reasoning and corrected scoring scale. | Added reasoning output while fixing CO2 scaling by flight duration. |
  | Apr 19, 2026 5:00 AM | fallback date + simulation polish | Made demo flights dynamic and cleaner. | Replaced hardcoded dates and polished quick-flight cards / metric displays. |
  | Apr 19, 2026 5:11 AM | glassmorphism redesign + greener-alt type fix | Polished UI and fixed type issue. | Reworked panels/cards with glass styling and fixed greener alternative metric typing. |
  | Apr 19, 2026 5:20 AM onward | deterministic ICAO numbers + aircraft data centralization | Made scoring more reliable. | Moved hard numbers into deterministic local formulas and centralized aircraft utility data. |
## Architecture Sketch
User searches route
→ flight options loaded
→ aircraft / route data normalized
→ CO2 + contrail score calculated
→ total climate impact score
→ comparison cards + detail page
→ guide explains tradeoffs
→ greener alternative shown if better option exists
## What I Actually Built
  | System | Specific work | How it worked |
  | Landing/product UI | Hero page, story sections, product flow. | Used strong visual sections and gradients to explain why contrails/CO2 matter. |
  | Flight comparison | Purchase and comparison pages. | Designed cards that compare route, airline, timing, climate score, and alternatives. |
  | Climate scoring | CO2 scaling, contrail scoring, deterministic calculations. | Moved hard numbers away from unstable model output and into local formulas/utilities. |
  | Aircraft data | Centralized aircraft and airline scoring data. | Created one source of truth so cards, detail pages, and reasoning used consistent numbers. |
  | Guide layer | Aero / explanation behavior. | Added UI behavior for explaining climate impact instead of only showing raw numbers. |
  | Visual polish | Glassmorphism redesign, overlays, metric pills. | Reworked panels and selected states to make the demo feel polished. |
  | Deployment cleanup | Vercel config and merge conflict fixes. | Removed invalid config and resolved broken files before demo/publish. |
## Concise Resume Angle
Best framing: Climate-tech product with data-driven flight scoring and polished UX.
One-liner: Built a climate-aware flight comparison platform with Next.js, deterministic CO2/contrail scoring, centralized aircraft data, greener alternative recommendations, AI-style explanation layers, and polished purchase/comparison flows.
## Still Needs Exact Follow-up
- Add methodology citations for CO2 and contrail formulas.
- Add screenshots of compare, purchase, and guide flows.
- Add tests around aircraft scoring and fallback data.
- Add a diagram showing how the Python/FastAPI contrail engine connects to the Next.js app.