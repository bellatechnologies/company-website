---
allowed-tools: Bash(git branch:*), Bash(git checkout:*), Bash(git status:*), Bash(git log:*), Bash(git commit:*), Bash(git add:*), Bash(npm version:*), Bash(npm --prefix *), Bash(node -p *), Bash(find *), Bash(date:*), Read, Edit
description: Create a release branch from develop, bump package.json version, update CHANGELOG.md, and commit
---

## Context

- Current branch: !`git branch --show-current`
- Git status: !`git status`
- package.json path: !`find . -name "package.json" -not -path "*/node_modules/*" -maxdepth 3 | head -1`
- Current package.json version: !`node -p "require(require('path').resolve(require('child_process').execSync('find . -name package.json -not -path */node_modules/* -maxdepth 3 | head -1').toString().trim())).version"`
- Recent log: !`git log --oneline -5`
- Today's date: !`date +%Y-%m-%d`

## Rules

- Always branch from `develop`
- Release branch name must be `release/<version>` (e.g. `release/1.2.0`)
- Must bump `package.json` version to the given version
- Must update `CHANGELOG.md` following [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)
- Working tree must be clean before starting
- Commit the version bump and changelog update together on the release branch with message: `chore(release): v<version>`

## Your task

The user will provide a version number (e.g. `1.2.0`). If they have not, ask for it before proceeding.

1. Verify the working tree is clean. If there are uncommitted changes, stop and tell the user to commit or stash them first.

2. Check that the current branch is `develop` (or switch to it):
   ```
   git checkout develop
   ```

3. Create and check out the release branch:
   ```
   git checkout -b release/<version> develop
   ```

4. Find the `package.json` file (it may not be at the project root):
   ```
   find . -name "package.json" -not -path "*/node_modules/*" -maxdepth 3 | head -1
   ```

5. Update the `version` field in the located `package.json` using `npm version --no-git-tag-version` from its directory:
   ```
   npm --prefix <dir> version <version> --no-git-tag-version
   ```

6. Update `CHANGELOG.md` at the repo root:
   - Read the file. If there is no `## [Unreleased]` section, stop and tell the user — there's nothing to release.
   - Rename `## [Unreleased]` to `## [<version>] - <today's date, YYYY-MM-DD>`.
   - Insert a fresh, empty section above it:
     ```
     ## [Unreleased]

     ### Added

     ### Changed

     ### Deprecated

     ### Removed

     ### Fixed

     ### Security

     ```
   - Drop any `###` subheadings under the newly-dated version section that ended up with no bullets under them (don't leave empty `### Fixed` etc. in the released section).
   - If the file has a compare-links footer (`[Unreleased]: .../compare/...`), refresh it: point `[Unreleased]` at `v<version>...HEAD` and add a `[<version>]: .../compare/v<previous-tag>...v<version>` line. If there's no previous tag for this codebase yet, link `[<version>]` to the release tag directly instead of a compare range.

7. Stage and commit the version bump and changelog together:
   ```
   git add <path/to/package.json> CHANGELOG.md
   git commit -m "chore(release): v<version>"
   ```

8. Report the result: confirm the release branch, new version, and changelog section. Remind the user of the next steps:
   - Make any remaining release fixes on this branch (add their own changelog entries if needed)
   - When ready: merge into `main` (with `--no-ff`), tag with `v<version>`, then merge back into `develop`

Do not output any other text — only make the necessary tool calls and the final report.
