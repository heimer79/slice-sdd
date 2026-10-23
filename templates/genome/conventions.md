# Conventions

> Limit: 150 lines. Only rules an agent needs in order not to get things wrong.

## Stack

<!-- language, framework, relevant versions, package manager -->

## Commands

| For | Command |
|---|---|
| Tests (all) |  |
| Tests (one) |  |
| Lint / format |  |
| Build |  |
| Run locally |  |

## Folder structure

<!-- short tree, first or second level only -->

## Style and patterns

- Use: <!-- e.g. constructor injection, typed errors -->
- Avoid: <!-- e.g. singletons, more than one level of inheritance, unused generic utilities -->

## Tests

- Every test name includes the slice and criterion: `S007_AC1_...` / `describe('S-007 AC-1 …')`.
- Test through the public interface. Mock only external systems, at their adapter.
- Tests are atomic, independent, repeatable and fast.

## Commits

`S-007: <slice title>`, with the covered ACs in the body.

## Definition of Done

- [ ] Every AC of the slice has a test and it passes
- [ ] The full suite passes
- [ ] Lint and build are clean
- [ ] No code outside the slice's scope and no unused abstractions
- [ ] Abuse-case ACs (untrusted input, auth, secrets, money) have passing tests
- [ ] No secrets in the diff; new dependencies are pinned and verified
- [ ] Genome updated if a decision, module, dependency or term changed
- [ ] Validated by a person (they saw the result working)
