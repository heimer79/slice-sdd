# Project principles

> At most 10 principles. If you need an eleventh, one of the existing ones has to go.
> The first 8 come from Slice; edit them only with a reason written under "Changes".

## Base principles

1. **Internal quality is non-negotiable; external quality is negotiated through scope.** Design, readability and tests are not cut to meet a date; what gets cut is the amount of functionality.
2. **Small slices.** A slice fits in 1–2 hours and in one person's head. If it doesn't, split it.
3. **The test is the specification.** Every acceptance criterion has at least one automated test. The session that writes the test is not the session that writes the code.
4. **The minimum that passes the tests.** A new abstraction needs three real uses or a real boundary (external system, layer). Nothing "just in case".
5. **Risk first.** The most uncertain thing is proven first (spike or walking skeleton). Never build in bulk on an unproven architecture.
6. **The truth lives in the code.** Order of authority: tests > code > genome > micro-spec. The genome is updated in the same commit that changes the decision.
7. **Boundaries by reason to change.** A module groups what changes for the same reason and at the same rate.
8. **Done means integrated.** A slice is finished when it builds, passes every test and the linter, and is in the repository.

## Project principles

<!-- Optional, at most 2. E.g. "Money is stored in cents (integers), never as floats." -->

## Changes

<!-- date · principle · what changed · why -->
