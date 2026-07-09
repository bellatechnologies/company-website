# Bella Technologies — Design System (v0.3.0)

Carried over from the previously agreed redesign direction. Structure modeled on a
long-scroll conversion page (nav → hero → stats → problem → services →
differentiators → pricing → how-it-works → results → FAQ → CTA → footer) — to be
finalized during the Astro rebuild.

## Approach: Mobile-first

Design and build mobile-first — base styles target small screens, larger breakpoints
are progressive enhancements (Tailwind's default `sm:`/`md:`/`lg:` convention), not
the other way around.

**Reference:** [smshorizon.in](https://www.smshorizon.in/) — hero-first layout
(nav → hero with headline + CTA → service/feature cards → social proof →
comparison/testimonials → FAQ → footer). Patterns to borrow:

- Sections and cards stack vertically on mobile; arrange horizontally only at wider
  breakpoints.
- Generous whitespace between sections; centered, contained content width (avoid
  excessive line length even on desktop).
- High-contrast, recurring CTA buttons ("Start free trial"-style) repeated at multiple
  points down the page rather than a single hero CTA.
- Short, scannable copy blocks — mobile-readable paragraph lengths.
- Hamburger nav on mobile.
- Note: Figtree (see Typography below) was sourced from this site's actual `h1–h6`
  CSS, confirmed by checking selector context, not just font-face declarations.

## Layout: content width vs. full-bleed sections

- **Content max-width: `1340px`**, centered, with side padding/gutters on smaller
  viewports. All body copy, cards, and standard sections sit inside this container.
- **Full-bleed background sections:** the section's background color spans the full
  browser width, but the actual content inside it is still constrained to the
  `1340px` container (same as everywhere else) — the background is full width, the
  content is not.
  - **Hero:** full-bleed background color, content in `1340px` container.
  - **CTA Banner:** full-bleed olive background, content in `1340px` container
    (already specified in the CTA Banner section of `plan.md`).
  - **Footer:** full-bleed background color, content in `1340px` container.
- Standard content sections (Problem, Solution/Services, Differentiators, How It
  Works, Book a Demo, FAQ) use the cream page background, so they don't need an
  explicit full-bleed treatment, but their content still respects the same `1340px`
  max-width for consistency.

## Colors

| Role              | Name    | Hex       |
|-------------------|---------|-----------|
| Primary CTA       | Olive   | `#4B5A3F` |
| Accent            | Sage    | `#7C9470` |
| Background        | Cream   | `#FAF9F5` |
| Text              | Charcoal| `#2B2B26` |
| Secondary accent  | Gold    | `#C9A24B` |

## Typography

- **Headings:** Figtree, weight 600–700
- **Body:** Figtree, weight 400–500
- **Stats / numeric callouts:** JetBrains Mono

Figtree is used for both headings and body — no separate display serif. Do not
reintroduce Fraunces or any serif display font without explicit approval.

## Icons

[Lucide](https://lucide.dev/) — same library the legacy site used (self-hosted, not
CDN, matching the Fonts approach below). Clean, minimal stroke-based icon set that
fits the Figtree/mobile-first aesthetic better than filled/emoji icons.

Icon mapping for the homepage sections in `plan.md`:

| Section | Item | Lucide icon |
|---|---|---|
| Problem | Booking Friction | `lock` |
| Problem | The 5-Minute Window | `clock` |
| Problem | No Re-booking System | `calendar` |
| Solution / Services | Frictionless Booking | `unlock` |
| Solution / Services | Instant Lead Response | `zap` |
| Solution / Services | Automatic Re-booking | `calendar-clock` |
| Solution / Services | Works With What You Already Use | `plug` |
| Differentiators | checklist marker (all 5 items) | `check-circle` |
| How It Works | step badges | numbered, no icon |
| Book a Demo | section container | `calendar-check` (optional header icon) |
| FAQ | accordion toggle | `plus` (collapsed) / `x` (expanded) |
| Nav | mobile menu toggle | `menu` |

## Fonts: self-hosted

Fonts should be self-hosted (as the legacy site did via `scripts/build-fonts.js`),
not pulled from Google Fonts CDN at runtime — rebuild this as part of the Astro
build pipeline.

## Open Items

- [ ] Confirm final page structure for the marketing site (see options in `plan.md`)
- [ ] Component-level tokens (buttons, cards, shadows) — old site had `card` /
      `card-hover` Tailwind shadow utilities; re-evaluate for the new build
