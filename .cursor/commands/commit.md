---
description: "Check git changes and commit with Conventional Commits"
---
Check the repository status and commit all changes using Conventional Commits.

Steps:
1) Run `git status -sb` and `git diff --stat` to show modified files.
2) If there are no changes, report that and stop.
3) Create a Conventional Commit message based on the changes (the user will not provide one):
   - Use format: `<type>(<scope>): <summary>`
   - Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
   - Use `!` before `:` if the change is breaking
4) Stage all changes with `git add -A`.
5) Commit with `git commit -m "<message>"`.

Always write the commit message yourself from the changes and ensure it matches:
`^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]+\))?(!)?: .+`
