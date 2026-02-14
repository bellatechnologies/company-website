---
description: "Create a release branch, update version, and deploy following git-flow workflow"
---
Create a release branch from develop, update package.json version, clean up old branches, merge to master and develop, tag the release, and push everything.

**Parameter**: `version` - Version number in format `v*` (e.g., `v1.2.0`, `v2.0.0`)

**Important**: 
- **All terminal commands must be executed with `required_permissions: ["all"]`** to ensure full permissions for git operations, network access, file modifications, and branch management operations.

Steps:
1) Validate version parameter format:
   - Check if version starts with 'v' followed by semantic version format (MAJOR.MINOR.PATCH)
   - Valid examples: `v1.0.0`, `v2.1.3`, `v10.5.0`
   - Invalid examples: `1.0.0` (missing v), `v1.0` (incomplete), `v1.0.0.0` (too many parts)
   - If format is incorrect, report error: "Error: Version format must be v*.*.* (e.g., v1.2.0)" and stop.

2) Check current branch - ensure you're not on a feature or release branch. If you are, report an error and stop.
   - Run: `git branch --show-current`

3) Ensure you're on `develop` branch:
   - Run `git checkout develop`
   - Pull latest changes: `git pull origin develop`

4) Create release branch:
   - Branch name format: `release/{version}` (e.g., `release/v1.2.0`)
   - Run: `git checkout -b release/{version}`

5) Update version in package.json:
   - Extract version number from parameter (remove 'v' prefix, e.g., `v1.2.0` -> `1.2.0`)
   - Update the "version" field in package.json with the extracted version
   - Commit the change: `git add package.json && git commit -m "chore: bump version to {version}"`

6) Merge release branch to master:
   - Switch to master: `git checkout master`
   - Pull latest: `git pull origin master`
   - Merge release branch: `git merge --no-ff release/{version} -m "chore: merge release/{version} into master"`
   - Create annotated tag: `git tag -a {version} -m "Release {version}"`

7) Merge release branch back to develop:
   - Switch to develop: `git checkout develop`
   - Merge release branch: `git merge --no-ff release/{version} -m "chore: merge release/{version} into develop"`

9) Delete local release branch:
   - `git branch -d release/{version}`

10) Clean up old feature and release branches (from delete-feature-release-branches.md):
    a) Ensure we're on develop branch (should already be there).
    b) List all local feature branches (`git branch | grep 'feature/'`) and show them for verification.
    c) List all local release branches (`git branch | grep 'release/'`) and show them for verification.
    d) List all remote feature branches (`git branch -r | grep 'origin/feature/'`) and show them for verification.
    e) List all remote release branches (`git branch -r | grep 'origin/release/'`) and show them for verification.
    f) Delete all local feature and release branches:
       - First try safe delete: `git branch | grep -E 'feature/|release/' | xargs git branch -d`
       - If any fail (not merged), force delete: `git branch | grep -E 'feature/|release/' | xargs git branch -D`
    g) Delete all remote feature and release branches:
       - `git branch -r | grep -E 'origin/feature/|origin/release/' | sed 's/origin\///' | xargs -I {} git push origin --delete {}`
    h) Prune stale remote references: `git remote prune origin`
    i) Report summary of what was deleted.

11) Push all changes:
    - Push master branch: `git push origin master`
    - Push develop branch: `git push origin develop`
    - Push tags: `git push origin {version}`

12) Report success summary with version, branch names, and what was pushed.

Safety: Always verify version format before proceeding. Never delete branches if currently on a feature or release branch.
