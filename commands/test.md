---
description: Turn a slice's acceptance criteria into failing automated tests. The tests become the specification.
argument-hint: "<S-ID>"
disable-model-invocation: true
---

User input: $ARGUMENTS

## Goal

Write the slice's tests **before** the code. Ideally run this in a different session or agent from the one that will build it: whoever writes the test should not be the one who has to pass it.

## Steps

1. Read the slice, `conventions.md` (Tests and Commands sections) and the **public interfaces** that already exist in the modules it touches. Don't read plans or internal implementations that don't exist yet.

2. If the slice has unresolved open questions, stop. If it is a `spike`, say so: spikes have no acceptance tests.

3. **At least one test per AC:**
   - The name includes slice and criterion (`S007_AC2_rejects_protected_file`).
   - Use the AC's concrete data. Assert the observable result, not internal details.
   - Test at the highest level that is still fast (service/endpoint before private method).
   - Mock only external systems, and only at their adapter. Don't mock your own code.
   - If the language needs it to compile, create minimal empty signatures marked `// TODO S-NNN`. No logic.

4. **Run the tests.** They must fail **for the right reason** (the behavior is missing, not an import or syntax error).
   - If one already passes: either the behavior exists (say so and suggest closing that AC) or the test is weak (rewrite it).

5. Show the user the list `AC → test → why it fails`. Ask them to review it: **changing a test later means changing the specification.**

6. Mark the slice `in progress`. Next step: `/slice:build S-NNN`.
