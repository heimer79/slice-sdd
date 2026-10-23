# S-003 · Merge two or more PDFs into one downloadable file

**Backlog:** B-003 · **Type:** feature · **Status:** closed

## Goal

A user without an account uploads several PDFs, orders them and downloads a single PDF. It is the most requested tool and it proves the upload → process → download flow.

## Acceptance criteria

- **AC-1** (main) Given `a.pdf` (2 pages) and `b.pdf` (3 pages) in that order, when I click "Merge", then I download `merged.pdf` with 5 pages: first those of `a`, then those of `b`.
- **AC-2** (alternative) Given I reorder them to `b`, `a`, when I click "Merge", then the 3 pages of `b` come first.
- **AC-3** (validation) Given a single file, when I try to merge, then the button is disabled and I see "Upload at least 2 PDFs".
- **AC-4** (validation) Given a password-protected PDF, when I upload it, then it is rejected with "This PDF is protected; unlock it first" and it is not processed.

## Out of scope

- Unlocking PDFs (B-005). Size limits per plan (B-007). Page preview.

## Touches

- `api/src/pdf/merge.service.ts`, `api/src/pdf/pdf.controller.ts`, `web/app/merge/page.tsx`

## Open questions

- Assumption: at most 20 files per operation (B-007 sets it if it changes).

---

## Closure

- **Tests:** 4 ACs → 5 tests (`S003_AC1…AC4`, AC-4 with two cases). Full suite green.
- **Validated by / how:** Heimer, locally, with 3 real PDFs and one protected PDF.
- **Genome updated:** architecture → Decisions: "pdf-lib for merging; Ghostscript rejected (server binary)". Glossary: "operation".
- **Deviations and lessons:** temporary files need cleanup → B-011 (pending). Not implemented here.
- **Commit:** `S-003: merge two or more PDFs into one downloadable file`
