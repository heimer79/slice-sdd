---
description: Write the micro-spec for ONE slice (≤ 1 page) with acceptance criteria that can become tests.
argument-hint: "<B-ID or short description; empty = first pending>"
disable-model-invocation: true
---

User input: $ARGUMENTS

## Goal

Create `.slice/slices/S-NNN-<slug>.md` from the `slice.md` template (`.slice/templates/slice.md` if it exists, otherwise `${CLAUDE_PLUGIN_ROOT}/templates/slice.md`). It is the slice's only specification and must fit on one screen.

## Steps

1. **Pick the slice:** the given B-ID, the given description (add a backlog line for it) or the first `pending` slice in the backlog. `S-NNN` uses the same number as the B-ID.

2. **Does it need a slice?** If the change is trivial (< 15 min, no behavior change: a copy fix, a minor dependency, a rename), say so and suggest doing it directly with its own commit. Not everything deserves ceremony.

3. **Minimal context:** read `principles.md`, `conventions.md`, the `architecture.md` rows for the modules it touches, and only the code of those modules.

4. **Write the micro-spec:**
   - **Goal:** 1–2 sentences including the why.
   - **Acceptance criteria (AC):** Given/when/then, with concrete data and an observable result. Cover, when they apply: the **main** flow, one **alternative** flow and one **validation/error** case. Every AC must be convertible into a test; if it isn't, rewrite it.
   - **Abuse case:** if the slice handles untrusted input (forms, uploads, URLs, webhooks), authentication or permissions, secrets, or money, add one AC for how it must fail safely (e.g. *given a 2 GB or password-protected PDF, when uploaded, then it is rejected with an error and nothing is stored*). It counts toward the 5-AC limit.
   - For a `fix`, AC-1 reproduces the bug as it happens today.
   - For a `spike`, instead of ACs write the **question to answer**, the **time box**, and which decision the answer will drive.
   - **Out of scope:** what someone might assume is included and isn't.
   - **Touches:** expected modules/files.

5. **Size check.** Split the slice if any of these holds:
   - more than 5 ACs,
   - more than 5 files or more than 1 module,
   - it integrates a new external system **and** adds business logic.
   When splitting: update the backlog with the new B-IDs and define only the first one.

6. **Principles check:** if the slice strains a principle, say so in one line under "Open questions".

7. **Open questions:** at most 3, only those that change behavior or the ACs. If there are any, present them with 2–3 options and your recommendation, then **stop**. Anything you assume without asking is written as `Assumption: …`.

8. Mark the slice `defined` in the backlog. Report the file and the next step: `/slice:test S-NNN` (ideally in a fresh session or with another agent).

## Limits

- ≤ 40 lines, not counting the closure block.
- Forbidden here: class design, choosing patterns, implementation plans. Those are decided in `/slice:build`, with the tests in front of you.
