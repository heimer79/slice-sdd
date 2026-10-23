---
description: Implement the slice, pair-programming style, until its tests pass, with the simplest solution and without leaving its scope.
argument-hint: "<S-ID> [auto]"
disable-model-invocation: true
---

User input: $ARGUMENTS

## Goal

Turn the slice's tests green with the minimum code, clean it up, and do nothing else. By default you work in **pair mode** (the user approves the plan); with `auto` you continue without waiting as long as you stay within "Touches".

## Fixed rules

- **Do not modify the slice's tests.** If one looks wrong, stop and explain why; changing it requires the user's approval because it changes the specification.
- **Do not implement anything no AC asks for.** A requirement discovered along the way goes into the backlog as a new line (`B-0NN`, status `pending`) and you carry on.
- If you find that a decision in `architecture.md` doesn't hold, stop and say so: that is a spike or a decision, not a detail.
- **No secrets in the repository.** Credentials, tokens and keys go in environment variables or the project's secret store, never in code, tests, the genome or slice files. Tests use fake values.
- **Never weaken a security control to turn a test green** (disabling validation, auth, TLS checks or escaping). Stop and explain instead.

## Steps

1. Read the slice, its tests, `principles.md`, `conventions.md` and the architecture rows for the modules it touches. Run the tests and confirm they fail.

2. **Short plan (≤ 5 steps)**, each with the files it touches. Call out separately anything in this list, which needs approval even in auto mode:
   - a file or module outside "Touches",
   - a new dependency: give its exact registry name, confirm it exists and is maintained (AI agents invent plausible package names), and pin the version,
   - a new abstraction (interface, base class, factory, layer).
   In pair mode, wait for the OK.

3. **Implement step by step.** After each step, run the slice's tests. Write the minimum needed to move forward.

4. **Refactor with green tests:** clear names, no obvious duplication, everything in its layer according to the dependency rule.

5. **Over-engineering check.** Review your diff and remove:
   - interfaces with a single implementation that aren't a boundary to an external system,
   - configuration or parameters for things that don't vary today,
   - patterns applied without a present problem they solve,
   - code that no AC exercises,
   - "generic" utilities used only once.

6. Run the full suite, lint and build. If something unrelated broke, fix it within the slice or explain why not.

7. Report: changed files, green tests, new backlog lines and any tension with the genome. Next step: `/slice:close S-NNN`.
