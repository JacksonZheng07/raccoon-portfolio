# PyStruct

Repo: https://github.com/JacksonZheng07/PyStruct
# Project Overview
PyStruct is a Python-inspired programming language runtime written in TypeScript. It includes a tokenizer, recursive descent parser, AST representation, evaluator, lexical scoping, typed variables/functions, Python-style arithmetic and boolean semantics, built-ins such as print and type, property-based tests, and a browser-based IDE/playground.
# Timeline
Active window covered: July 1, 2025 to July 1, 2026.
Known phases:
- Core runtime and parser completion.
- Property-based testing helpers and typed generators.
- Math, boolean, and variable behavior tests.
- Standard library and built-in function work.
- README and documentation updates.
- Web playground, inspector panel, AST/steps/variables display.
- Deployment, import, and TypeScript type fixes.
# My Contributions
- Worked on parser/runtime behavior for arithmetic, booleans, variables, functions, and scoping.
- Added typed language features such as typed variables and functions.
- Created property-based testing helpers and typed generators.
- Wrote tests for math, boolean logic, variables, and parser behavior.
- Built a browser playground/IDE around the runtime.
- Added an inspector panel for AST, execution steps, and runtime variable state.
- Improved README documentation and fixed deployment/import/type issues.
# Technical Breakdown
## Frontend
- Browser IDE/playground.
- Inspector panel.
- AST, execution step, and variable state display.
## Language Runtime
- Tokenizer.
- Recursive descent parser.
- AST generation.
- Evaluator.
- Lexical scoping.
- Typed variables/functions.
- Python-style arithmetic and boolean semantics.
## Testing and Docs
- Property-based testing helpers.
- Typed generators.
- Math, boolean, variable, and parser tests.
- README/runtime documentation.
# Evidence From GitHub
- README evidence: tokenizer, parser, AST, evaluator, lexical scoping, typed variables/functions, Python-style semantics, built-ins, property-based tests, and browser IDE.
- Commit-history evidence: PBT helpers, typed generators, math/bool/var tests, parser completion, stdlib work, playground, inspector panel, AST/steps/variables display, deployment/import/type fixes.
# Skills Demonstrated
TypeScript, programming language implementation, parsing, AST modeling, interpreter design, lexical scoping, type-system basics, property-based testing, frontend tooling, debugging, and developer experience design.
# Resume Bullets
- Built a Python-inspired TypeScript runtime with tokenizer, recursive descent parser, AST generation, evaluator, lexical scoping, typed variables/functions, and Python-style arithmetic/boolean semantics.
- Developed a browser-based IDE and inspector for visualizing ASTs, execution steps, and runtime variables.
- Added property-based testing helpers and typed generators to validate parser/evaluator behavior across math, boolean, and variable semantics.
- Improved reliability through TypeScript type fixes, import/deployment cleanup, README documentation, and runtime test expansion.
# Interview Talking Points
- Why recursive descent parsing fit the project.
- How tokenizer, parser, AST, and evaluator stages connect.
- How lexical scoping was modeled.
- Why property-based tests are useful for a language runtime.
- How the browser inspector improves debugging.
# What To Improve / Follow-up
- Add grammar documentation.
- Add more syntax examples.
- Improve source-location error messages.
- Add more standard library functions.
- Add CI status, coverage, demo link, and a language limitations section.
# Enhanced Timeline + Build Breakdown
## Quick Work Map
  | Area | Weight | What it means |
  | --- | ---: | --- |
  | Language runtime | ██████████ | Tokenizer, AST, parser, evaluator, variables, functions, scoping |
  | Testing / correctness | ████████ | Property-based testing, math/bool/var tests, Python-like behavior checks |
  | Web IDE / DX | ██████ | Browser playground, tab behavior, inspector panel, AST/steps/vars display |
  | Docs / polish | ████ | README, docstrings, deployment/import/type fixes |
## Exact Timeline
  | Date | Evidence | What I did | How I did it |
  | Mar 24, 2026 | Initial commit; README PR; file structure | Started the repo, documented the goal, and laid down the base project structure. | Set up the TypeScript project around runtime modules instead of only a demo script. |
  | Mar 24, 2026 late | Property-based testing helpers, basic types, typed generators | Built the first correctness-testing layer. | Added typed random generators and helper types so runtime behavior could be tested over many generated inputs. |
  | Mar 26–27, 2026 | forAll fix; pair/triple generators; math runner with 10k trials | Made math testing more serious. | Refactored math properties to accept pair/triple inputs and ran repeated trials to compare behavior against expected Python-like arithmetic. |
  | Apr 6, 2026 | Boolean operators and test entry point | Added boolean logic support. | Added Equals, Not, And, Or, and ITE-style behavior, plus to_bool conversion and unified test scripts. |
  | Apr 14, 2026 | Variable assignment/getter/setter; print; type functions | Added basic runtime operations. | Modeled variables through environment lookup/update and mapped print behavior to captured output / console-style behavior. |
  | Apr 15, 2026 | AST, tokens, tokenization, environments | Built the core interpreter pipeline shape. | Split the system into token definitions, tokenizer, AST structures, and environment retrieval for vars/functions. |
  | Apr 25, 2026 | Parser finished | Completed the parser pass. | Connected token streams into AST output through recursive descent parsing. |
  | Apr 27, 2026 | print/type Python mirroring; README; online IDE tab support | Tightened standard functions and editor behavior. | Updated standard functions to better mirror Python output and improved editor usability with tab input. |
  | May 24, 2026 | Web playground wired to src interpreter; inspector panel | Turned the runtime into an interactive tool. | Wired the Next.js UI to the shared interpreter API and exposed runtime outputs: AST, execution steps, and variables. |
## Architecture Sketch
User code
→ Tokenizer
→ Token stream
→ Recursive descent parser
→ AST
→ Evaluator
→ Environment / scope chain
→ Output + inspector data
Browser IDE
→ runCapture(code, env)
→ output lines + AST + trace steps + variable table
→ UI tabs: Variables / Steps / AST
## What I Actually Built
  | System | Specific work | Why it mattered |
  | Tokenizer | Converted source text into typed tokens for numbers, strings, booleans, identifiers, keywords, operators, and punctuation. | Made the language parseable instead of treating input as raw strings. |
  | Parser | Used recursive descent parsing to turn tokens into AST nodes. | Created a clean middle layer between syntax and runtime execution. |
  | AST | Modeled expressions/statements as structured TypeScript types. | Made the evaluator easier to reason about and extend. |
  | Evaluator | Executed AST nodes using runtime rules for values, variables, functions, and control flow. | Made PyStruct an actual executable language instead of a parser-only project. |
  | Environment | Stored variables/functions with parent-scope lookup. | Supported lexical scoping and function-local state. |
  | Standard functions | Implemented print and type behavior. | Made programs feel more Python-like and easier to demo. |
  | Property tests | Added generated test cases for math, booleans, and variables. | Reduced the chance of subtle semantic bugs. |
  | Web IDE | Built a browser playground and inspector. | Turned the project into a usable developer/debugging tool. |
## Concise Resume Angle
Best framing: Programming language runtime + browser debugging IDE.
One-liner: Built a Python-inspired TypeScript interpreter with tokenizer, parser, AST, evaluator, lexical scoping, property-based tests, and a browser IDE with AST/trace/variable inspection.
## Still Needs Exact Follow-up
- Add commit links directly under each row.
- Add screenshots of the IDE inspector.
- Add a grammar/spec section for supported syntax.
- Add test coverage or CI badge if available.