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

1. Nav (floating style, see Nav section below)
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

### Nav (finalized style)

Modeled on [smshorizon.in](https://www.smshorizon.in/)'s floating nav pattern.

- Not edge-to-edge — inset with margin on left/right and a small gap from the top of
  the viewport.
- Rounded corners (pill or rounded-rectangle), subtle shadow (`card` shadow token) to
  lift it visually off the page.
- Background: cream or white, slightly opaque/blurred if scrolled over content.
- Sticky/fixed — stays floating in place as the user scrolls.
- Mobile: same floating treatment, full inset width minus margin, hamburger icon
  right, logo left.
- Content: logo (left) — hamburger menu (mobile) / nav links (desktop) — "Book a
  Demo" CTA button (right, olive, rounded to match the floating bar's shape).

#### Nav Active State (pending decision — discuss tomorrow)

Hybrid approach implemented: URL match for real pages (e.g. `/contact`), scroll-spy
(`IntersectionObserver`) for in-page anchors (How It Works / FAQ) on the homepage.
Modeled on [smshorizon.in](https://www.smshorizon.in/)'s `.nav-link.active` pattern.

Current state: pill background, olive text (`#4B5A3F`) on a soft olive tint
(`rgba(75,90,63,0.12)`), rounded full, not bold. Flagged as low-contrast — options to
increase it:

1. **Deeper pill (recommended)** — same pill shape, darker/opaquer background so it
   reads at a glance: `background: rgba(75,90,63,0.18)` or a flat sage tint
   `#E8ECE4`, text stays `#4B5A3F`.
2. **Solid fill, inverted text** — active link gets a solid olive pill with cream
   text (`background: #4B5A3F; color: #FAF9F5;`), matching the "Book a Demo" button
   treatment. Highest contrast, but visually competes with the CTA button next to it.
3. **Underline indicator** — no background; a 2px olive bar under the active link
   (`border-bottom: 2px solid #4B5A3F` or a pseudo-element), text color unchanged.
   Common nav pattern, legible, no added visual weight.
4. **Pill + colored dot** — keep the current subtle pill, add a small olive dot
   before the label. Adds contrast without darkening the background much.

### Problem (finalized copy)

Headline framed as a question (same device as the hero).

- **H2:** "Is Every Missed Booking Costing You More Than You Think?"
- **Intro:** "A single lost lead can cost your spa or wellness business $1,000+ in
  revenue over the next six months. Multiply that across every enquiry that slips
  through, and it adds up fast."
- **3 pain points:**
  1. **Booking Friction** — "Most booking systems make clients log in, create an
     account, or fill out long forms before they can book, and many just give up."
  2. **The 5-Minute Window** — "Leads contacted within 5 minutes are 21x more likely
     to convert than those contacted after 30 minutes, but most spas and wellness
     businesses can't staff a human to respond that fast, every time." Cite: Harvard
     Business Review / MIT study, Dr. James Oldroyd, analysis of 15,000+ sales leads
     ("The Short Life of Online Sales Leads," HBR). Link this citation on the live
     page.
  3. **No Re-booking System** — "A haircut client needs a trim every three weeks.
     Without a simple reminder at the right time, that appointment (and the revenue)
     never gets rebooked."
- **Closing line:** "Here's how Bella Technologies closes each gap."

### Solution / Services (finalized copy)

- **H2:** "Here's How Bella Technologies Closes Each Gap"
- **Intro:** "Simple systems, working together, so no enquiry and no returning
  client falls through the cracks."
- **4 cards:**
  1. **Frictionless Booking** — "No logins, no long forms. Clients book in a couple
     of taps right from WhatsApp, so they don't give up halfway through."
  2. **Instant Lead Response** — "Every enquiry gets an immediate response, day or
     night, without you needing a human glued to the phone."
  3. **Automatic Re-booking** — "We track when clients are due back and reach out at
     the right time, so appointments (and revenue) don't get forgotten."
  4. **Works With What You Already Use** — "Keep your existing CRM or booking
     software. Bella Technologies plugs into your current systems. No migration, no
     disruption."
- **Closing line:** "Here's how it works, step by step."

### Differentiators (finalized copy)

- **H2:** "Why Spa & Wellness Owners Choose Bella Technologies"
- **Stacked checklist (5 items):**
  1. **Built for Spas & Wellness Businesses, Not Generic CRMs** — "Made specifically
     for how spa and wellness businesses actually book and retain clients, not a
     one-size-fits-all sales tool."
  2. **Works 24/7, Even When You're on Holiday** — "Enquiries get answered and
     bookings get made around the clock, whether you're on the floor with a client
     or on vacation."
  3. **Live in Days, Not Months** — "No developers, no IT team, no lengthy rollout.
     We get you set up fast."
  4. **No Long-Term Lock-In** — "Cancel anytime. We earn your business every month,
     not through a contract."
  5. **Backed by 15+ Years of Technical Expertise** — "Built by a team with over 15
     years of experience building reliable, secure software, so your booking system
     just works, every time."

### How It Works (finalized copy)

- **H2:** "Three Steps to More Bookings"
- **3 numbered steps:**
  1. **We Connect Your Channels** — "There's no app to install. Our developers set
     up WhatsApp/Telegram and your existing booking system for you. Done for you,
     not DIY."
  2. **The System Handles Every Enquiry** — "Once your WhatsApp/Telegram system is
     live, it responds to every enquiry instantly, 24/7, and guides leads straight to
     a booked appointment. No one on your end has to lift a finger."
  3. **Automatic Re-booking, Powered by Your Calendar** — "Based on your booking
     software or calendar, the system reaches out automatically when a client's due
     back, so re-booking happens on its own."
- **CTA below steps:** "Book a Demo" (olive button)

### Book a Demo (finalized copy)

- **H2:** "See It In Action"
- **Subhead:** "Book a free 15-minute demo. We'll show you exactly where your spa or
  wellness business is losing bookings, and how the system fixes it."
- **Embedded scheduler:** Google Calendar Appointment Schedule (Google Workspace
  account), inline iframe embed — generated via Calendar → Booking pages → Options →
  Sharing options → Website embed → "Inline booking page."
  - Technical note: Google's generated iframe code has fixed pixel width/height by
    default. On mobile this needs a responsive wrapper (`width: 100%`, height set via
    media query or `aspect-ratio`) rather than pasting Google's raw embed code as-is,
    so the widget doesn't overflow or get clipped on small screens.
- **Reassurance line below widget:** "No commitment. No credit card. Just a
  walkthrough."
- Background: cream, olive-outline container around the iframe to visually separate
  it from surrounding content.

### FAQ (finalized copy)

Styled on [smshorizon.in](https://www.smshorizon.in/)'s FAQ pattern: eyebrow pill
badge, H2, then a flat accordion list with no numbering, a `+` icon on the right of
each question (rotates/becomes `×` when expanded), and a thin divider line between
rows instead of card borders.

- **Eyebrow pill badge:** "FAQS"
- **H2:** "Common Questions"
- **Flat accordion (7 items, no numbering, `+` icon right-aligned, divider lines
  between rows):**
  - **Do I need to switch my current booking software or CRM?** — "No. Bella
    Technologies plugs into what you already use. No migration, no disruption."
  - **How long does setup take?** — "A few days, not months. Our developers handle
    connecting WhatsApp, Telegram, and your booking system. There's nothing for you
    to install."
  - **Does this replace my staff?** — "No. It handles the enquiries and follow-ups
    you don't have time for, especially outside business hours, so your staff can
    focus on clients in front of them."
  - **Is there a long-term contract?** — "No. You can cancel anytime. We don't lock
    you in."
  - **What if my clients don't use WhatsApp?** — "The system also works over
    Telegram and your website, so clients can reach you however they prefer."
  - **Is my clients' data secure?** — "Yes. It's built by a team with 15+ years of
    experience building secure, reliable software."
  - **Does Bella Technologies store data?** — "No, we don't. Your data never leaves
    your existing systems. It's only stored there, not with us."

### CTA Banner (finalized copy)

- Background: full-bleed olive `#4B5A3F`, cream text.
- **H2:** "Every Enquiry You Miss Costs You $1,000+ Over 6 Months." (echoes the
  Problem section's revenue framing at the closing point of the page)
- **Subhead:** "Ready to stop losing it? Book a free 15-minute demo and see how easy
  it is for clients to book through WhatsApp or Telegram. No friction, just a couple
  of taps."
- **CTA button:** "Book a Demo" (gold bg, charcoal text — highest-contrast pairing on
  the page, reserved for this final push). Links back to the Book a Demo section
  (Google Calendar widget).
- No secondary link — single, unambiguous action.

### Footer (finalized copy)

Modeled on [anviksika.in](https://anviksika.in/)'s footer pattern (stacked,
center-aligned, no social icons) but trimmed — no closing CTA heading/buttons, since
the CTA Banner section immediately above it already closes the sale.

- Background: cream, minimal. Text alignment: center throughout.
- **Stacked sections, top to bottom:**
  1. Company info: "Bella Technologies" wordmark + tagline "Turn Enquiries Into
     Bookings"
  2. Geographic identifier: "Florida · USA"
  3. Inline nav links: Home · How It Works · FAQ · Blog · Book a Demo
  4. Copyright: "© 2026 Bella Technologies. All rights reserved."
- No social icons.

### Hero (finalized copy)

Modeled on [anviksika.in](https://anviksika.in/)'s hero pattern: pain-first headline,
audience callout, first-step CTA — but leading with the positive value prop rather
than a blunt negative framing.

- **Headline:** "Turn More Enquiries Into Bookings and Keep Clients Coming Back."
- **Subhead:** "Built for spa and wellness owners who are missing bookings to slow
  replies and no re-booking system. Book a free demo and see exactly where enquiries
  are falling through, and how to fix it." (Note: "Florida" intentionally left out of
  this copy, even though it remains the ICP for targeting/ads. See ICP note above.)
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

## Build Approach

Build the homepage as plain HTML/Tailwind first (matching the finalized copy and
design in this doc), get it right visually and functionally, then port it into Astro
components. Astro migration happens after the HTML is approved, not before.

## Stack (proposed)

- Plain HTML + Tailwind CSS first pass (homepage build/approval stage)
- Astro (SSG output) — ported to once the HTML is approved
- Tailwind CSS (via Astro's official Tailwind integration, not CDN, after the port)
- Content collections for blog posts (Markdown/MDX) — added during the Astro port
- Self-hosted fonts (Figtree — see `DESIGN.md`)

## Open Decisions

- [ ] Contact form backend approach
- [ ] Blog post frontmatter schema (title, date, excerpt, tags, cover image, author?)
- [ ] Hosting/deploy target and CI workflow
- [ ] Whether case studies/testimonials become their own content collections or stay
      hardcoded in the page

## Next Steps

1. Build the homepage as plain HTML + Tailwind, using the finalized copy/design in
   this doc (Nav → Hero → Problem → Solution/Services → Differentiators →
   How It Works → Book a Demo → FAQ → CTA Banner → Footer).
2. Review and approve the HTML build.
3. Scaffold Astro project (`npm create astro@latest`) and port the approved HTML into
   Astro components + Tailwind integration.
4. Stand up blog content collection + listing/detail pages.
5. Re-decide and implement contact form backend.
6. Rebuild deploy workflow.
