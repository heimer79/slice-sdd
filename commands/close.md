---
description: Verify and validate the slice, update the genome so nothing drifts, record the closure and prepare the commit.
argument-hint: "<S-ID>"
disable-model-invocation: true
---

User input: $ARGUMENTS

## Goal

Close the slice by keeping two different questions apart: **is it built right?** (verification, answered by the machine) and **is it the right thing?** (validation, answered by a person). And keep the genome alive.

## Steps

1. **Verification.** Run the full suite, lint and build. Go through the *Definition of Done* in `conventions.md`, marking each item `yes / no / n.a.`.
   - Before proposing the commit, check the diff for secrets (keys, tokens, passwords, `.env` files). If you find one, stop: it must be removed and, if it was real, rotated.
   - Every `no` gets an action. The slice is not closed with a `no` unless the user explicitly accepts it as debt; in that case create a `B-0NN` line (type `refactor` or `fix`) in the backlog.

2. **Validation.** Give the user 1–3 concrete steps to see the result working (URL, command, screen, test data) and ask whether it is what they expected. Do not validate yourself. If the answer is "this isn't it", the slice goes back to `defined` with what was learned.

3. **Genome anti-drift.** Compare what was built against the genome and update it in the same commit:
   - new module or moved responsibility? → modules table,
   - new dependency or external system? → stack / integrations,
   - a decision taken or changed? → one line under Decisions with the S-ID,
   - a new domain term? → glossary,
   - a rule the agent must always follow? → conventions.
   If a file goes past 150 lines, condense it instead of growing it.

4. **Fill in "Closure"** in the slice file (tests, who validated and how, genome changes, deviations, commit). From here on the file is **not edited**: it is history, not a source of truth.

5. **Backlog:** status `closed`, file path, and any new lines discovered during the slice.

6. **Commit:** propose `S-NNN: <title>` with the covered ACs in the body. Commit only if the user allows it.

7. **Mini-retro (1 line):** what to keep or improve. If the same problem shows up a second time, propose a concrete convention or principle to prevent it.

8. If this is the 5th slice closed since the last review, suggest `/slice:review`. Otherwise, next step: `/slice:define` with the next pending slice.
