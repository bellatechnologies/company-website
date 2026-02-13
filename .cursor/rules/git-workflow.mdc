---
description: Git workflow standards: branching model, commit conventions, and semantic versioning
alwaysApply: true
---

# Git Workflow Standards

This rule combines git-flow branching model, conventional commits standards, and semantic versioning for a complete git workflow.

## 1. Git Branching Model (Git-flow)

Follow the [git-flow branching model](https://nvie.com/posts/a-successful-git-branching-model/) for organized development workflow.

### Main Branches

- **`master`**: Production-ready code, only updated via merges from release or hotfix branches
- **`develop`**: Integration branch for features, latest development changes

### Supporting Branches

#### Feature Branches (`feature-*`)
- Branch from: `develop`
- Merge back to: `develop`
- Naming: `feature/description` or `feature/issue-123-description`
- When to create: Starting new feature development
- When to merge: Feature is complete and tested

```bash
# Create feature branch
git checkout -b feature/user-authentication develop

# Work on feature, then merge back
git checkout develop
git merge --no-ff feature/user-authentication
git branch -d feature/user-authentication
```

#### Release Branches (`release-*`)
- Branch from: `develop`
- Merge back to: `develop` AND `master`
- Naming: `release/v1.2.0` or `release/1.2.0`
- When to create: When develop has enough features for a release
- When to merge: Release is ready for production

```bash
# Create release branch
git checkout -b release/v1.2.0 develop

# Finalize release, then merge
git checkout master
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"

git checkout develop
git merge --no-ff release/v1.2.0
git branch -d release/v1.2.0
```

#### Hotfix Branches (`hotfix-*`)
- Branch from: `master`
- Merge back to: `master` AND `develop`
- Naming: `hotfix/critical-bug-fix` or `hotfix/issue-456-fix`
- When to create: Critical bug in production
- When to merge: Hotfix is tested and ready

```bash
# Create hotfix branch
git checkout -b hotfix/critical-security-fix master

# Fix the issue, then merge
git checkout master
git merge --no-ff hotfix/critical-security-fix
git tag -a v1.1.1 -m "Hotfix for critical security issue"

git checkout develop
git merge --no-ff hotfix/critical-security-fix
git branch -d hotfix/critical-security-fix
```

### Branch Management Rules

- Never commit directly to `master` or `develop`
- Use `--no-ff` flag for all merges to preserve branch history
- Delete branches after successful merge
- Tag releases on master branch
- Keep branch names descriptive and prefixed appropriately

## 2. Conventional Commits

Follow the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) for standardized commit messages.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- **`feat`**: New feature
- **`fix`**: Bug fix
- **`docs`**: Documentation changes
- **`style`**: Code style changes (formatting, semicolons, etc.)
- **`refactor`**: Code refactoring without feature or bug changes
- **`test`**: Adding or updating tests
- **`chore`**: Maintenance tasks (build, dependencies, etc.)
- **`perf`**: Performance improvements
- **`ci`**: CI/CD changes
- **`build`**: Build system changes

### Examples

#### Basic Commits
```bash
git commit -m "feat: add user authentication system"

git commit -m "fix: resolve memory leak in data processing"

git commit -m "docs: update API documentation for v2.0"

git commit -m "style: format code according to prettier rules"

git commit -m "refactor: extract validation logic to separate module"

git commit -m "test: add unit tests for user service"

git commit -m "chore: update dependencies to latest versions"
```

#### With Scope
```bash
git commit -m "feat(auth): implement OAuth2 login flow"

git commit -m "fix(api): handle null response from external service"

git commit -m "refactor(db): optimize query performance"
```

#### Breaking Changes
```bash
git commit -m "feat!: remove deprecated API endpoints

BREAKING CHANGE: The /v1/users endpoint has been removed.
Use /v2/users instead."

git commit -m "fix(auth): update token validation

BREAKING CHANGE: Token format now requires 'type' field"
```

#### With Body and Footer
```bash
git commit -m "feat: implement user profile system

- Add profile picture upload
- Support for bio and social links
- Privacy settings for profile visibility

Closes #123"
```

### Guidelines

- Use present tense ("add" not "added")
- Start with lowercase letter
- No period at end of description
- Keep first line under 72 characters
- Use scope for related changes (component, module, etc.)
- Use `!` after type for breaking changes
- Reference issues with `Closes #123`, `Fixes #456`
- Separate body from header with blank line
- Wrap body at 72 characters

## 3. Semantic Versioning

Follow [Semantic Versioning (SemVer)](https://semver.org/) for all releases to ensure consistent and predictable version numbering.

### Version Format

All versions must follow the `MAJOR.MINOR.PATCH` format:

- **MAJOR**: Increment when you make incompatible API changes or breaking changes
- **MINOR**: Increment when you add functionality in a backward-compatible manner
- **PATCH**: Increment when you make backward-compatible bug fixes

### Version Numbering Rules

1. **MAJOR version** (`X.0.0`): Increment when:
   - Breaking changes are introduced
   - Public APIs are removed or changed incompatibly
   - Significant architectural changes occur

2. **MINOR version** (`x.Y.0`): Increment when:
   - New features are added in a backward-compatible manner
   - New functionality is introduced without breaking existing APIs
   - Deprecations are added (but not removals)

3. **PATCH version** (`x.y.Z`): Increment when:
   - Bug fixes are made
   - Security patches are applied
   - Minor improvements that don't change functionality

### Version Format Requirements

- Versions must be numeric: `1.0.0`, `2.1.3`, `10.5.0`
- Pre-release versions use hyphens: `1.0.0-alpha.1`, `1.0.0-beta.2`, `1.0.0-rc.1`
- Build metadata uses plus signs: `1.0.0+20130313144700`, `1.0.0-beta.1+exp.sha.5114f85`
- Always start from `0.1.0` for initial development
- Move to `1.0.0` when the API is stable and production-ready

### Release Branch and Tag Naming

Release branches and tags must use semantic versioning:

```bash
# Release branch naming
release/v1.2.0
release/2.0.0
release/1.0.0-rc.1

# Git tag naming (always include 'v' prefix)
v1.2.0
v2.0.0
v1.0.0-rc.1
```

### Version Increment Guidelines

When determining the next version, analyze commits since the last release:

- **MAJOR**: Contains commits with `BREAKING CHANGE` footer or `feat!`/`fix!` types
- **MINOR**: Contains `feat:` commits (new features) without breaking changes
- **PATCH**: Contains only `fix:` commits (bug fixes)

### Examples

#### Initial Release
```bash
# First release
git checkout -b release/v0.1.0 develop
# ... finalize release ...
git tag -a v0.1.0 -m "Release version 0.1.0"
```

#### Minor Release (New Features)
```bash
# Adding new features (backward-compatible)
git checkout -b release/v1.3.0 develop
# ... finalize release ...
git tag -a v1.3.0 -m "Release version 1.3.0"
```

#### Patch Release (Bug Fixes)
```bash
# Bug fixes only
git checkout -b release/v1.2.1 develop
# ... finalize release ...
git tag -a v1.2.1 -m "Release version 1.2.1"
```

#### Major Release (Breaking Changes)
```bash
# Breaking changes introduced
git checkout -b release/v2.0.0 develop
# ... finalize release ...
git tag -a v2.0.0 -m "Release version 2.0.0"
```

#### Hotfix Release
```bash
# Critical bug fix in production
git checkout -b hotfix/critical-security-fix master
# ... fix the issue ...
git checkout master
git merge --no-ff hotfix/critical-security-fix
git tag -a v1.2.1 -m "Hotfix: critical security fix"
```

#### Pre-release Versions
```bash
# Release candidate
git checkout -b release/v1.2.0-rc.1 develop
git tag -a v1.2.0-rc.1 -m "Release candidate 1.2.0-rc.1"

# Alpha/Beta versions
git tag -a v1.2.0-alpha.1 -m "Alpha release 1.2.0-alpha.1"
git tag -a v1.2.0-beta.1 -m "Beta release 1.2.0-beta.1"
```

### Best Practices

- Always tag releases on the `master` branch
- Use annotated tags (`-a`) with descriptive messages
- Document breaking changes in release notes
- Never skip version numbers (e.g., don't go from 1.0.0 to 1.2.0 without 1.1.0)
- Use pre-release versions for testing before final release
- Keep a changelog that correlates with version numbers
