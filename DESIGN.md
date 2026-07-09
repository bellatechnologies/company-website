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

## Fonts: self-hosted

Fonts should be self-hosted (as the legacy site did via `scripts/build-fonts.js`),
not pulled from Google Fonts CDN at runtime — rebuild this as part of the Astro
build pipeline.

## Open Items

- [ ] Confirm final page structure for the marketing site (see options in `plan.md`)
- [ ] Spacing scale / container widths
- [ ] Component-level tokens (buttons, cards, shadows) — old site had `card` /
      `card-hover` Tailwind shadow utilities; re-evaluate for the new build
