---
description: "Check git changes and commit with Conventional Commits"
---
Check the repository status and commit all changes using Conventional Commits.

Steps:
1) Run `git status -sb` and `git diff --stat` to show modified files.
2) Check the current branch with `git branch --show-current`. If it is `develop` or `master`, report that commits must be made on a feature/release/hotfix branch and stop.
3) If there are no changes, report that and stop.
4) Create a Conventional Commit message based on the changes (the user will not provide one):
   - Use format: `<type>(<scope>): <summary>`
   - Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
   - Use `!` before `:` if the change is breaking
5) Stage all changes with `git add -A`.
6) Commit with `git commit -m "<message>"`.

Always write the commit message yourself from the changes and ensure it matches:
`^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]+\))?(!)?: .+`
