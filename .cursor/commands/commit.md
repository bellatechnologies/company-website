---
description: "Check git changes and commit with Conventional Commits"
---
Check the repository status and commit all changes using Conventional Commits.

**Parameter**: `hotfix` - When specified, create a hotfix branch from master instead of a feature branch. Use when on master or when explicitly requesting a hotfix.

Steps:
1) Run `git status -sb` and `git diff --stat` to show modified files.
2) If there are no changes, report that and stop.
3) Create a Conventional Commit message based on the changes (the user will not provide one):
   - Use format: `<type>(<scope>): <summary>`
   - Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
   - Use `!` before `:` if the change is breaking
4) Check the current branch with `git branch --show-current`:
   - If on `develop` and hotfix not specified: create a feature branch from develop before committing. Branch name: `feature/<slug>` where slug is a kebab-case version of the commit summary (e.g., `feat(contact): add form validation` → `feature/add-form-validation`).
   - If on `master` and hotfix specified: create a hotfix branch from master. Branch name: `hotfix/<slug>` where slug is a kebab-case version of the commit summary.
   - If on `master` and hotfix not specified: report that commits must be made on a feature/release/hotfix branch (or run with hotfix parameter) and stop.
   - If already on a feature/hotfix/release branch: proceed without creating a new branch.
5) Stage all changes with `git add -A`.
6) Commit with `git commit -m "<message>"`.

Always write the commit message yourself from the changes and ensure it matches:
`^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]+\))?(!)?: .+`
