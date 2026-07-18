# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Astro + Tailwind scaffold, ported from the static `build/index.html` homepage
- Clickable footer contact details with an official WhatsApp glyph
- Nav "Contact" link scrolls to the footer contact section
- README with setup instructions and project structure
- Tag-triggered deploy workflow to `bellatech-blr-prod` via GitHub Actions
- `CHANGELOG.md` following Keep a Changelog
- Google Tag Manager (`GTM-5ZN587DK`), loaded only in production builds

### Changed
- Astro dev toolbar disabled so it never renders in production
- `/release` command now also rewrites `CHANGELOG.md`'s Unreleased section into a dated version section as part of the release commit
- `.gitignore` narrowed from the whole `.claude/` directory to just `settings.local.json`, so shared config (slash commands, dev server launch config) is version-controlled

### Removed
- Superseded static homepage build output
