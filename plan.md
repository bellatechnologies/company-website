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

## Homepage Structure (in progress, approved so far)

Sections, mobile-first, top to bottom. Stats bar, results/case studies, testimonials,
and pricing were dropped from the original draft — reconsider later if needed.

1. Nav (sticky, hamburger on mobile, "Book a Demo" CTA)
2. **Hero** (copy finalized — see below)
3. Problem
4. Solution / Services (4 cards: Frictionless Booking, Instant Lead Response,
   Automatic Re-booking, Works With What You Already Use)
5. Differentiators
6. How It Works (3 numbered steps)
7. Book a Demo (dedicated section — embedded scheduler, see Open Decisions)
8. FAQ (accordion)
9. CTA banner (closing, links back to Book a Demo)
10. Footer
11. Sticky mobile "Book a Demo" bar (persistent bottom bar, mobile only)

### Problem (finalized copy)

Headline framed as a question (same device as the hero).

- **H2:** "Is Every Missed Booking Costing You More Than You Think?"
- **Intro:** "A single lost lead can cost your spa $1,000+ in revenue over the next
  six months. Multiply that across every enquiry that slips through, and it adds up
  fast."
- **3 pain points:**
  1. **Booking Friction** — "Most booking systems make clients log in, create an
     account, or fill out long forms before they can book — and many just give up."
  2. **The 5-Minute Window** — "Leads contacted within 5 minutes are 21x more likely
     to convert than those contacted after 30 minutes — but most spas can't staff a
     human to respond that fast, every time." Cite: Harvard Business Review / MIT
     study, Dr. James Oldroyd, analysis of 15,000+ sales leads ("The Short Life of
     Online Sales Leads," HBR). Link this citation on the live page.
  3. **No Re-booking System** — "A haircut client needs a trim every three weeks.
     Without a simple reminder at the right time, that appointment — and the revenue
     — never gets rebooked."
- **Closing line:** "Here's how Bella Technologies closes each gap."

### Solution / Services (finalized copy)

- **H2:** "Here's How Bella Technologies Closes Each Gap"
- **Intro:** "Simple systems, working together, so no enquiry — and no returning
  client — falls through the cracks."
- **4 cards:**
  1. **Frictionless Booking** — "No logins, no long forms. Clients book in a couple
     of taps right from WhatsApp — so they don't give up halfway through."
  2. **Instant Lead Response** — "Every enquiry gets an immediate response — day or
     night — without you needing a human glued to the phone."
  3. **Automatic Re-booking** — "We track when clients are due back and reach out at
     the right time — so appointments (and revenue) don't get forgotten."
  4. **Works With What You Already Use** — "Keep your existing CRM or booking
     software. Bella Technologies plugs into your current systems — no migration, no
     disruption."
- **Closing line:** "Here's how it works, step by step."

### Hero (finalized copy)

Modeled on [anviksika.in](https://anviksika.in/)'s hero pattern: pain-first headline,
audience callout, first-step CTA — but leading with the positive value prop rather
than a blunt negative framing.

- **Headline:** "Turn More Enquiries Into Bookings — And Keep Clients Coming Back."
- **Subhead:** "Built for spa and wellness owners who are missing bookings to slow
  replies and no re-booking system. Book a free demo and see exactly where enquiries
  are falling through — and how to fix it." (Note: "Florida" intentionally left out of
  this copy, even though it remains the ICP for targeting/ads — see ICP note above.)
- **Primary CTA:** "Book a Demo"
- **Secondary CTA:** "How it works ↓" (anchor to How It Works section)
- No supporting stat line (cut — no credible numbers to cite yet)

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
