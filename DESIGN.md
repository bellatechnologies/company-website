# Bella Technologies — Design System (v0.3.0)

Carried over from the previously agreed redesign direction. Structure modeled on a
long-scroll conversion page (nav → hero → stats → problem → services →
differentiators → pricing → how-it-works → results → FAQ → CTA → footer) — to be
finalized during the Astro rebuild.

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
