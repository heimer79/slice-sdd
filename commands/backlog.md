---
description: Turn an idea or feature into small backlog lines ordered by risk and value. Does not write specifications.
argument-hint: "<idea, feature or problem>"
disable-model-invocation: true
---

User input: $ARGUMENTS

## Goal

Split the idea into **slices**: vertical slices, each with a result a person can observe, that fit in 1–2 hours and can be tested on their own. One line per slice; detail is written later, right before building.

## Steps

1. Read `.slice/backlog.md`, `.slice/genome/principles.md` and the modules section of `architecture.md`. Don't read code unless you need it to understand the scope.

2. If the input is ambiguous in a way that changes the split (who uses it, what the minimum useful version is), ask **one** question and wait. Otherwise continue.

3. Split the idea:
   - Name = **verb + observable result** ("Merge two PDFs into one", not "PDF service").
   - Vertical: it crosses the layers it needs; "build the database" is never a slice.
   - If a part depends on something uncertain (unknown library, external API, performance), create a **spike** slice first, with a concrete question and a maximum time.
   - A bug is a `fix` slice.

4. **Just-in-time detail:** detail at most the first 3–5 slices. If there are more than 8, the rest stay as one line under "To refine". This prevents disguised waterfall.

5. **Order:** highest risk first; at equal risk, higher value first. Mark dependencies only when they are real.

6. Add the rows to `.slice/backlog.md` with consecutive IDs (`B-0NN`), status `pending`. Do not reorder or delete existing slices without saying so.

7. Report the new list (ID + name) and the next step: `/slice:define B-0NN`.
