# Slice

**Slice-Driven Development: AI-assisted development in small vertical slices, driven by acceptance tests, with a living genome.**

Slice keeps the useful idea behind Spec-Driven Development (give the AI clear context and rules) and drops what makes it slow: the giant upfront specification, documentation nobody maintains, and bulk execution. The acronym is still SDD, but the center moves from the *spec* to the *slice*.

It is just Markdown: 7 commands, 5 templates and a dependency-free installer. It runs natively as a Claude Code plugin and works with any agent that accepts prompts.

---

## Contents

1. [What a slice is](#what-a-slice-is)
2. [Slice and ATDD](#slice-and-atdd)
3. [Why it exists](#why-it-exists)
4. [Installation](#installation)
5. [Step-by-step usage](#step-by-step-usage)
6. [Command reference](#command-reference)
7. [Files it creates](#files-it-creates)
8. [Limits](#limits-the-defense-against-over-engineering)
9. [Scale: not everything deserves ceremony](#scale-not-everything-deserves-ceremony)
10. [FAQ](#faq)
11. [What we took from spec-kit](#what-we-took-from-spec-kit-and-what-we-left-out)
12. [Software engineering foundations](#software-engineering-foundations)
13. [Security](#security)

---

## What a slice is

A **vertical slice** is a thin increment that cuts through every layer it needs (interface → logic → data) and delivers something a person can see working. It is the term the industry already uses to split user stories and plan deliveries.

In Slice, every slice:

- has an observable result ("Merge two PDFs into one downloadable file", not "PDF service");
- fits in 1–2 hours and in one person's head;
- has acceptance criteria that become automated tests;
- is closed integrated (builds, passes tests, is in the repository) and validated by a person.

The first slice of a new project is a **walking skeleton**: the thinnest end-to-end path that proves the architecture works.

## Slice and ATDD

Slice does not invent a new practice. Its technical core is **ATDD (Acceptance Test-Driven Development)**, an established industry practice:

> In ATDD, before writing code, the acceptance criteria are agreed with whoever requests the feature; those criteria become failing automated tests, and code is written until they pass.

| Classic ATDD | In Slice |
|---|---|
| Discuss: team and customer agree on concrete examples | `/slice:define`: Given/when/then criteria with concrete data, at most 3 questions to the user |
| Distill: examples become acceptance tests | `/slice:test`: each criterion (AC) becomes at least one failing test, with its ID in the name |
| Develop: implement until the tests pass (TDD inside) | `/slice:build`: minimum code to green, then refactor |
| Demo: show the result to the customer | `/slice:close`: a person validates it by seeing it work |

**What Slice adds to ATDD for working with AI agents:**

1. **Small vertical slices.** AI fails more the bigger the instruction, so every ATDD cycle is limited to a 1–2 hour slice.
2. **Separate authors.** The session that writes the tests is not the one that writes the code, so the AI can't bend the tests to fit its implementation.
3. **Living genome.** Three short files (principles, architecture, conventions) the agent always reads and that are updated at every close. They replace the memory a human team has and an AI doesn't.
4. **Over-engineering controls.** Size limits plus a diff review against unnecessary abstractions, the typical model failure.
5. **Risk first.** Walking skeleton and spikes before building in bulk, taken from the spiral model and the Unified Process.

In one sentence: **Slice is ATDD applied through vertical slices, with an AI agent as your pair and a genome that keeps context from getting lost.**

## Why it exists

| Classic SDD problem | Slice's answer |
|---|---|
| **Disguised waterfall:** everything is specified and the AI implements it in one go | The backlog has **one line per slice**. Detail is written just before building, one slice at a time. |
| **Unmaintainable documentation:** thousands of spec lines | Micro-spec of **≤ 40 lines**. Genome of **3 files of ≤ 150 lines**. |
| **Spec drift:** the spec goes stale | Explicit hierarchy: **tests > code > genome > micro-spec**. The micro-spec is frozen at close (it is history) and the genome is updated in the same commit that changes a decision. |
| **Non-deterministic AI:** big instructions make it invent abstractions | 1–2 h slices, **tests before code** written by another session, a ≤ 5-step plan and an over-engineering check. |

---

## Installation

There are three ways to install Slice. Pick one.

| Method | Best for | Commands appear as |
|---|---|---|
| **A. Claude Code plugin** (recommended) | Claude Code users; install once, available in every project, updates from the marketplace | `/slice:init`, `/slice:define`, … |
| **B. npm / npx** | Installing into one repository (and committing it for your team), or using other agents | `/slice:init`, … (Claude Code) or prompt files |
| **C. Manual copy** | No Node.js, or you want to customize everything | Same as B |

### Requirements

- A git repository (new or existing).
- An AI coding agent. Recommended: **Claude Code**.
- For method B: Node.js 18 or later.
- To get the most out of it: a test command that runs from the terminal.

### A. As a Claude Code plugin (recommended)

Inside Claude Code:

```text
/plugin marketplace add OWNER/slice-dd
/plugin install slice@slice-dd
```

`OWNER/slice-dd` is the GitHub repository that hosts Slice. The first command registers the repository as a marketplace (it reads `.claude-plugin/marketplace.json`); the second installs the `slice` plugin from it. Restart Claude Code if the commands don't show up, then type `/slice` to see all 7.

To update: `/plugin marketplace update slice-dd`. To remove: `/plugin uninstall slice@slice-dd`.

The plugin ships its own templates, so you don't need anything inside the project until you run `/slice:init`.

### B. With npm / npx

```bash
cd /path/to/my-project
npx slice-dd init                 # Claude Code: commands in .claude/commands/slice/
npx slice-dd init --agent other   # other agents: commands in .slice/commands/
```

This creates:

```
my-project/
├── .claude/commands/slice/    ← the 7 commands: /slice:init, /slice:define, …
└── .slice/
    ├── templates/             ← genome, backlog and slice templates (edit them freely)
    └── slices/                ← micro-specs live here
```

Commit both folders and everyone on the team gets the same commands.

| Command | What it does |
|---|---|
| `npx slice-dd init [dir]` | Installs commands and templates |
| `npx slice-dd update [dir]` | Refreshes commands; keeps your templates |
| `npx slice-dd uninstall [dir]` | Removes only Slice's command files; keeps `.slice/` and any command you added |

None of them ever touches `.slice/genome/`, `.slice/backlog.md` or `.slice/slices/`.

### C. Manual copy

Copy `commands/*.md` into `.claude/commands/slice/` in your project, and `templates/` into `.slice/templates/`.

### Other agents (Codex, Copilot, Cursor, Gemini…)

Use `npx slice-dd init --agent other`. Each file in `.slice/commands/` is a prompt: paste it into your agent (or register it as a custom command) and replace `$ARGUMENTS` with your input.

### First run

```bash
cd /path/to/my-project
claude
```

```text
/slice:init
```

---

## Step-by-step usage

### The cycle

```
   once                 per slice (1–2 h)                                       every ~5 slices
 ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌───────────┐  ┌─────────┐   ┌─────────┐
 │  init   │─▶│ backlog │─▶│ define  │─▶│  test   │─▶│   build   │─▶│  close  │──▶│ review  │
 │ genome  │  │ 1 line  │  │ micro-  │  │ tests   │  │ minimum   │  │validate,│   │ drift,  │
 └─────────┘  │ /slice  │  │ spec    │  │ red     │  │ code      │  │ genome  │   │ metrics │
              └─────────┘  └─────────┘  └─────────┘  └───────────┘  └────┬────┘   └─────────┘
                   ▲                                                     │
                   └──────────── discoveries go back to the backlog ─────┘
```

### Full example

**1. Init (once).**

```text
/slice:init Web suite of PDF tools. Next.js + NestJS + MySQL.
```

For a new project it asks up to 5 questions (problem, external systems, stack, quality attributes, biggest uncertainty). For existing code it reads it and describes what it observes. It creates the genome and leaves `B-001` in the backlog: the walking skeleton (new project) or a test safety net (existing project).

**2. Fill the backlog.**

```text
/slice:backlog Merge several PDFs into one
```

Returns short lines ordered by risk, e.g. `B-003 Merge two or more PDFs into one downloadable file`. No specifications yet.

**3. Define a slice.**

```text
/slice:define B-003
```

Creates `.slice/slices/S-003-merge-pdfs.md` with goal, acceptance criteria (AC-1 main, AC-2 alternative, AC-3 validation…), out of scope and expected files. If the slice is too big, it splits it. If there are questions that change behavior, it asks and stops.

**4. Write the tests (in another session).**

```text
/clear
/slice:test S-003
```

Use `/clear` or another terminal so the session writing the tests is not the one that will write the code. The tests must fail for the right reason. Review them: **they are the specification.**

**5. Build.**

```text
/slice:build S-003
```

Proposes a ≤ 5-step plan and waits for your OK. Implements step by step with tests running, refactors, and reviews its own diff for over-engineering. With `/slice:build S-003 auto` it doesn't wait, unless it needs to touch unexpected files, add dependencies or create abstractions.

**6. Close.**

```text
/slice:close S-003
```

Verifies (full suite, lint, build, Definition of Done), gives you 1–3 steps to see the result working, updates the genome if something changed, fills the slice's closure, updates the backlog and proposes the commit `S-003: …`.

**7. Repeat** with the next slice. Every ~5 slices:

```text
/slice:review
```

The result of this example, already closed, is in [`example/S-003-merge-pdfs.md`](example/S-003-merge-pdfs.md).

---

## Command reference

| Command | Arguments | When | Produces |
|---|---|---|---|
| `/slice:init` | project description (optional if code exists) | Once per project | `.slice/genome/`, `.slice/backlog.md` with B-001, a block in `CLAUDE.md`/`AGENTS.md` |
| `/slice:backlog` | idea, feature or problem | When new work arrives | `B-0NN` lines ordered by risk and value |
| `/slice:define` | `B-ID`, short description, or empty (= next pending) | Right before working on a slice | `.slice/slices/S-NNN-*.md` |
| `/slice:test` | `S-ID` | After define, in a clean session | Red tests, one or more per AC |
| `/slice:build` | `S-ID`, optionally `auto` | With approved tests | Green, refactored code |
| `/slice:close` | `S-ID` | When everything passes | Slice closure, genome and backlog up to date, commit |
| `/slice:review` | optional focus | Every ~5 slices or before a release | Drift, traceability, 3 metrics and ≤ 2 proposals |

### Command details

**`/slice:init`** reads existing code or asks up to 5 questions. Fills in only what it knows and marks inferences as `(inferred — confirm)`. Draws module boundaries by reason to change. Writes no application code. If `.slice/genome/` already exists, it sends you to `/slice:review`.

**`/slice:backlog`** splits an idea into vertical slices named "verb + result". Creates spikes for anything uncertain. Details at most 3–5 slices; the rest stay under "To refine" to avoid planning everything upfront.

**`/slice:define`** writes the micro-spec. Requires a main, an alternative and a validation AC when they apply. Splits the slice if it has more than 5 ACs, more than 5 files or more than 1 module. For a `fix`, AC-1 reproduces the bug. For a `spike`, instead of ACs it writes the question, the time box and the expected decision. If the change is trivial, it tells you it doesn't need a slice.

**`/slice:test`** turns each AC into tests named like `S003_AC2_rejects_protected_pdf`. Tests through the public interface and mocks only external systems. Runs the tests and checks they fail for the right reason. If one already passes, it tells you.

**`/slice:build`** cannot modify the tests without your permission. Doesn't implement anything no AC asks for: new things go to the backlog. Before finishing it removes single-implementation interfaces, unnecessary configuration, patterns without a problem to solve, and code no AC exercises.

**`/slice:close`** separates **verification** (is it built right? the machine answers) from **validation** (is it the right thing? you answer). A `no` in the Definition of Done blocks the close unless you accept it as debt, which is recorded in the backlog. Updates the genome in the same commit and freezes the micro-spec.

**`/slice:review`** compares the genome with the code (the code wins, unless it breaks a principle), looks for circular dependencies, checks that every closed AC has its test, and tracks three trends: slice size, rework and defects that reached users. Proposes at most 2 changes; you decide.

---

## Files it creates

```
.slice/
├── genome/
│   ├── principles.md      ≤ 10 principles (8 come pre-written)
│   ├── architecture.md    context, modules by reason to change, integrations,
│   │                      quality attributes, decisions, glossary
│   └── conventions.md     stack, commands, style, tests, commits, Definition of Done
├── backlog.md             one line per slice
└── slices/
    └── S-003-merge-pdfs.md micro-spec + closure (frozen after close)
```

**IDs and traceability:** `B-003` (backlog line) → `S-003` (micro-spec) → `AC-2` (criterion) → `S003_AC2_…` (test) → `S-003: …` (commit). A plain text search tells you which test covers which requirement and in which commit it landed.

**Order of authority:** tests > code > genome > micro-spec. When two of them disagree, the one on the left wins and the other is corrected.

## Limits (the defense against over-engineering)

| Thing | Limit | If exceeded |
|---|---|---|
| Slice | 1–2 h · ≤ 5 ACs · ≤ 5 files · 1 module | Split it |
| Micro-spec | ≤ 40 lines · ≤ 3 open questions | Split or ask |
| Genome file | ≤ 150 lines | Condense |
| Principles | ≤ 10 | One has to go |
| Detailed backlog | 3–5 slices per idea | The rest stays under "To refine" |
| Build plan | ≤ 5 steps | The slice is too big |
| New abstraction | 3 real uses or a real boundary | Not created |
| Periodic review | ≤ 2 proposals | Prioritize |

## Scale: not everything deserves ceremony

- **Trivial change** (< 15 min, no behavior change): commit directly, no slice.
- **Bug:** `/slice:define` with type `fix`; AC-1 reproduces the bug. Then test → build → close.
- **Technical uncertainty:** a `spike` slice with a question, a time box and an expected decision. Spike code is thrown away; the decision goes into `architecture.md`.
- **Refactor:** a `refactor` slice; the ACs state which behavior must stay the same.

## FAQ

**Do I have to use all 7 commands every time?** No. The minimum cycle per slice is `define → test → build → close`. `backlog` is for new work and `review` is periodic.

**Why write the tests in another session?** If the same conversation writes the test and the code, the AI tends to write tests that confirm what it was already planning to do. It's the same reason quality engineering keeps the verifier separate from the builder.

**What if the AI discovers something that wasn't in the micro-spec?** It doesn't implement it. It adds a new backlog line and carries on. The micro-spec doesn't change during build.

**What if a test is wrong?** `build` stops and explains. Changing a test means changing the specification, so you decide.

**Does it work for existing projects?** Yes. `init` describes what's there and, if there are no tests, the first slice builds a safety net over the main flow.

**What happens to old micro-specs?** They stay as history. They are not maintained: what's current lives in the tests, the code and the genome.

**When NOT to use Slice?** When the contract fixes closed requirements and per-phase documentation deliverables (public tenders, regulated software with document audits). A plan-driven process fits better there. Slice assumes scope varies in a controlled way and that someone is available to validate every few hours.

---

## What we took from spec-kit and what we left out

| From spec-kit | In Slice |
|---|---|
| Constitution | `principles.md`, at most 10, with 8 base principles pre-written |
| `specify` + `clarify` | `define`, with the same 3-question cap, but for one slice instead of a whole feature |
| `plan` | No longer a file: lasting decisions → `architecture.md`; a ≤ 5-step tactical plan inside `build` |
| `tasks` | Gone: the slice is the task; the backlog is the list |
| `implement` | `build`, preceded by `test` (tests first, in another session) |
| `analyze` + `converge` | `close` (per slice) and `review` (periodic) |
| `checklist` | The Definition of Done in `conventions.md` |
| Prioritized, independent stories (P1, P2…) | Slices ordered by risk and value |

**What we deliberately left out:** a Python CLI, scripts in 3 languages, feature branches, extensions, hooks, presets, catalogs, workflows and bundles. They are useful for an organization distributing processes; for building software they are weight. spec-kit has ~2,450 lines of prompts across its 10 commands; Slice has ~260 across 7.

## Software engineering foundations

The rules come from the book *Ingeniería de Software* (Alfaomega). Where each one lives:

| Rule from the book | In Slice |
|---|---|
| Adapt the methodology to the context | Scale (trivial / fix / spike / refactor / feature) and "When NOT to use Slice" |
| Each iteration closes a milestone that reduces a risk · proven architecture before building in bulk | Principle 5, B-001 walking skeleton, spikes, backlog ordered by risk (spiral) |
| Each iteration delivers an evaluated, working increment | Every slice is vertical and validated by a person in `close` |
| Iteration scope frozen; living backlog | The micro-spec doesn't change during `build`; new things go to the backlog |
| Always plan, even lightly | Backlog + ≤ 5-step plan |
| Atomic requirements with IDs, no ambiguity | ACs with IDs, Given/when/then, concrete data |
| Requirement → test traceability | B-ID → S-ID → AC-N → test name; checked by grep in `review` |
| Main, alternative and validation scenarios → test cases | AC structure in `define` |
| Validation ≠ verification | Steps 1 and 2 of `close` |
| Start from the business; boundaries by reason to change | Context and modules table with "Reason to change" (principle 7) |
| Layers with stable interfaces; anti-corruption layer for external systems | Dependency rule; integrations with adapter; the only abstraction allowed without 3 uses |
| Choose components with explicit criteria and team skills | Question 3 of `init`; Decisions table with rejected alternatives |
| Quality attribute → concrete decision | Quality attributes table with decision and verification |
| Test the architecture: no cycles | `review`, step 1 |
| Testability as a design criterion; early, atomic tests in CI | Principles 3 and 8; `test` before `build` |
| Internal quality non-negotiable, external negotiable | Principle 1 |
| Checklists with an owner and an action per non-conformity | Definition of Done with yes/no/n.a. and an action or recorded debt |
| GQM; process vs. product measures | 3 metrics in `review`, each with its question |
| Independent quality that recommends; management decides | Tests written by another session; `review` proposes and the user decides |
| Retrospective at the end | One-line mini-retro in `close` |
| UML as a sketch | No mandatory diagrams |

**Deliberately not brought in:** an organizational quality department, a formal quality plan, CMMI/ISO and the Unified Process's per-phase documents. They are right at organization scale; here they would be the bureaucracy Slice tries to avoid.

---

## Security

Slice is Markdown plus a small installer, but it steers an agent that writes and runs code, so it builds a few safeguards into the cycle:

- **Abuse cases are acceptance criteria.** When a slice handles untrusted input, authentication, secrets or money, `/slice:define` adds an AC for how it must fail safely, and `/slice:test` turns it into a test like any other.
- **No secrets in the repository.** Code, tests, the genome and slice files never hold credentials; `/slice:close` checks the diff for them before proposing the commit.
- **Dependencies are verified.** A new package needs approval even in `auto` mode, with its exact name confirmed in the registry and its version pinned (agents sometimes invent plausible package names).
- **Security controls are never weakened to pass a test.** The agent stops and explains instead.
- **The installer doesn't follow symlinks.** It refuses to write or delete through a symlink inside the project, copies only `.md` files, and `uninstall` removes only the files Slice ships.

Slice does not replace a security review, SAST or dependency scanning; it makes sure security has an AC and a test in each slice.

## License

MIT
