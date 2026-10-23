---
description: Periodic review (every ~5 slices or before a release) that detects genome/code drift, checks traceability and measures process health with 3 metrics.
argument-hint: "[optional focus]"
disable-model-invocation: true
---

User input: $ARGUMENTS

## Goal

Find what drifted and propose **few** adjustments. This review recommends; the user decides.

## Steps

1. **Genome vs. code.** Compare `architecture.md` and `conventions.md` with the repository: folders, declared dependencies, modules and who depends on whom. If a tool is available for the stack, look for **circular dependencies** between modules.
   - If they differ, the code wins and the genome is corrected… unless the code breaks a principle: then a `refactor` slice is added to the backlog.

2. **Traceability.** For every slice closed since the last review, search (grep) the tests for the `S-NNN`/`AC-N` IDs. Report ACs without a test and tests that reference slices that don't exist.

3. **Three metrics** (from the slice files and `git log`; trend only, no dashboards):
   - **Average slice size:** ACs and files touched per slice. If it grows, slices are bloating.
   - **Rework:** slices reopened, or `fix` slices correcting a recent slice.
   - **Escaped defects:** `fix` slices for bugs that reached users.
   For each one, one question: better, same or worse than the previous review?

4. **Backlog:** mark stale items as discarded (with a reason), reorder by risk and value, and confirm the next 3 can be defined now.

5. **Proposals:** at most 2 changes to principles or conventions, each with the evidence behind it. Don't apply them without approval.

6. Report in ≤ 15 lines. Add a line under "Changes" at the end of `principles.md` with the date of this review and what was decided.
