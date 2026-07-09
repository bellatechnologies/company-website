# Bella Technologies — Astro Rebuild Plan (v0.3.0)

## Why Astro

The site is moving from a static `index.html` + Tailwind CDN + Express contact-form
backend to [Astro](https://astro.build). The primary driver is adding a **blog** —
Astro's content collections give us type-checked frontmatter, per-post routing, and
RSS generation without hand-rolling a templating layer. Astro ships zero client JS by
default, which keeps the conversion-focused marketing pages fast.

## Audience & Positioning (carried over, not re-derived)

- **ICP:** Spa and wellness business owners in the United States, specifically Florida.
- **Value prop:** Help spa/wellness owners convert more enquiries into bookings, and
  keep clients coming back more often (lead-to-booking conversion + retention).
- Do not reintroduce the old manufacturing/supply-chain copy — that was for the wrong
  audience and has been fully removed in this rebuild.

## Scope of this Rebuild

1. **Marketing site** — nav, hero, solution/CTA, how-it-works, case studies, CTA
   banner, testimonials, contact, footer (structure to be revisited during build,
   not assumed to carry over verbatim from the old site).
2. **Blog** — Astro content collection (`src/content/blog/`), listing page, individual
   post pages, RSS feed.
3. **Contact form** — needs a backend decision (Astro API route / serverless function
   vs. reviving something like the old Express+SES flow). Not yet decided.
4. **Deployment** — old `.github/workflows/deploy.yml` and systemd service
   (`scripts/bellatechnologies.service`) were removed with the rest of the legacy
   files; CI/CD will be rebuilt for the Astro build output.

## Stack (proposed)

- Astro (SSG output)
- Tailwind CSS (via Astro's official Tailwind integration, not CDN)
- Content collections for blog posts (Markdown/MDX)
- Self-hosted fonts (Figtree — see `DESIGN.md`)

## Open Decisions

- [ ] Contact form backend approach
- [ ] Blog post frontmatter schema (title, date, excerpt, tags, cover image, author?)
- [ ] Hosting/deploy target and CI workflow
- [ ] Whether case studies/testimonials become their own content collections or stay
      hardcoded in the page

## Next Steps

1. Scaffold Astro project (`npm create astro@latest`).
2. Wire up Tailwind + design tokens from `DESIGN.md`.
3. Rebuild marketing page sections in Astro components.
4. Stand up blog content collection + listing/detail pages.
5. Re-decide and implement contact form backend.
6. Rebuild deploy workflow.
