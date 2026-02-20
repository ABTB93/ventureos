# Step 2: Landing Page and Ads (Vibe Code)
<!-- Phase 6, Market Experiments Step 2 -->
<!-- Agent: Growth Strategist -->

## Objective
Build a landing page to capture user interest and test messaging conversion. Create paid ad variants for A/B testing. Use AI-assisted vibe coding for rapid creation.

---

## 2.1 Landing Page Design

Using the "vibe-code-landing-page" tool from `synthetic-tools.csv` (Claude Code / Cursor):

**Define the landing page structure:**

| Section | Content |
|---------|---------|
| Hero headline | (from winning messaging variant) |
| Subheadline | |
| Problem statement | |
| Solution description | |
| Social proof / evidence | (customer quotes, interview stats, if available) |
| Key features / benefits | (3 bullets) |
| CTA (above fold) | |
| CTA (below fold) | |
| Trust signals | |

**A/B test variants:**
- Variant A (Control): Primary messaging from messaging-infrastructure.md
- Variant B: Alternative headline / CTA
- Select: which specific element to A/B test first (headline, CTA, or offer)

---

## 2.2 Vibe Code Landing Page

Generate prompting guidance for building the landing page with Claude Code / Cursor:

**Prompt 1 (Setup):**
> "Build a landing page for [venture name] — [tagline]. The target customer is [ICP]. The core problem we solve is [pain statement]. Build a clean, conversion-optimized landing page in [HTML/React/Next.js] with the following structure: [section list]."

**Prompt 2 (Hero section):**
> "The hero section should have: headline '[text]', subheadline '[text]', a CTA button '[text]' that opens a waitlist signup form. Make it visually impactful — [style direction]."

**Prompt 3 (Email capture):**
> "Add an email capture form that collects: email, [optional: company, role]. On submit, show a thank you message: '[text]'. Store submissions [in local state / send to webhook / send to Airtable]."

**Prompt 4 (Analytics):**
> "Add Google Analytics / Plausible / simple event tracking to track: page views, time on page, CTA clicks, form submissions."

Save: `{output_folder}/{venture_name}/landing-page-spec.md`

---

## 2.3 Ad Variants (Vibe Code)

Using the "vibe-code-ads" tool from `synthetic-tools.csv`:

**Generate 5+ ad copy variants for A/B testing:**

For **LinkedIn** (B2B primary channel):
- Variant A: Problem-focused headline
- Variant B: Benefit-focused headline
- Variant C: Social proof / data-led

For **Google Search:**
- Headline 1 (30 chars): [text]
- Headline 2 (30 chars): [text]
- Description (90 chars): [text]

For **Retargeting / Remarketing:**
- Nurture message for people who visited landing page

Include: targeting parameters for each ad variant (LinkedIn job titles, company sizes, industries).

Save: `{output_folder}/{venture_name}/ad-variants.md`

---

## 2.4 Tracking Setup

Define what to measure from the experiments:
- Landing page: visits, scroll depth, CTA clicks, email signups, conversion rate
- Ads: impressions, clicks, CTR, cost per click, cost per lead
- Email: open rate, click rate
- Goal: measure conversion funnel from ad impression → landing page visit → signup

---

## 2.5 Checkpoint

**GUIDED MODE:** Review landing page spec and ad variants with user. Ask: "Does the landing page messaging reflect what we want to test? Are the ad variants distinct enough for meaningful A/B testing?"

**YOLO MODE:** Proceed to Step 3.
