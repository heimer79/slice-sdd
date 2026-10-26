# Contributing to Slice

Thanks for your interest in improving Slice! Slice is just Markdown (7 commands, 5 templates) plus a small dependency-free Node installer, so contributions are easy to make and easy to review.

## Ways to contribute

- **Report a bug** or unclear wording in a command: open an issue using the bug template.
- **Propose an idea**: open an issue or a Discussion first, so we can agree on it before you invest time.
- **Improve docs, commands or templates**: send a pull request.
- **Share a real-world example** of a closed slice in `example/`.

## Workflow

1. Fork the repository and create a branch from `master`: `git checkout -b fix/short-description`.
2. Make a small, focused change. One concern per pull request.
3. Test it locally (see below).
4. Commit with a clear message, for example `fix(define): ask at most 3 questions`.
5. Open a pull request against `master` and fill in the template.

## Guidelines

Slice follows its own philosophy, so please respect its limits:

- Keep it small. Commands and templates should stay short; do not add ceremony.
- No new dependencies in the installer (`cli/slice-dd.js`). It must keep working with plain Node.js 18+.
- Do not add features nobody asked for. If it is not needed by a real use case, it does not belong here.
- Never weaken the security safeguards (no secrets in the repo, verified dependencies, installer does not follow symlinks).
- Write in clear English. Keep examples concrete (Given/when/then with real data).

## Testing your change

- Installer: run `node cli/slice-dd.js init <empty-test-dir>`, then `update` and `uninstall`, and check that only Slice's own files are touched.
- Commands and templates: install them in a throwaway project and run the affected command with Claude Code or another agent.

## Pull request review

The maintainer reviews every pull request. Expect questions about scope and size; small PRs are merged faster. By contributing you agree that your work is released under the MIT License.

## Code of Conduct

Participation is governed by our [Code of Conduct](CODE_OF_CONDUCT.md).
