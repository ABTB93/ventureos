# Step 4: Measure, Analyze, Iterate
<!-- Phase 6, Market Experiments Step 4 -->
<!-- Agent: Financial Analyst + Growth Strategist -->

## Objective
Analyze all experiment results. Calculate CAC by channel. Run A/B test analysis. Compile conversion funnel data. Identify bottlenecks and iterate. Produce the market experiment results report for the final pitch.

---

## 4.1 Collect All Experiment Data

Gather from all experiments run in Steps 2-3:
- Landing page: visits, signups, conversion rate, time on page
- Paid ads: impressions, clicks, CTR, cost per click, leads, cost per lead
- Outbound: outreach sent, replies, demos, pilots agreed
- Demo conversion: demos → pilots agreed rate
- Pricing: % who accepted the pricing offer, average deal size discussed

---

## 4.2 Conversion Funnel Analysis

Using the `conversion-analysis.md` template:

Build the full funnel:
- Awareness (ad impressions / outreach sent) → Click/Reply rate
- Interest (landing page visits / email replies) → Signup/Demo request rate
- Evaluation (demos) → Pilot agreement rate
- Activation (pilot starts) → Paying customer rate

For each funnel step:
- Conversion rate achieved
- Industry benchmark (if available)
- Gap assessment
- Root cause for underperformance

**Biggest bottleneck:** Which funnel step has the largest gap?

---

## 4.3 CAC Analysis by Channel

Using conversion-analysis.md:

| Channel | Spend | Customers Acquired | CAC | LTV:CAC |
|---------|-------|-------------------|-----|---------|
| Paid social | | | | |
| Paid search | | | | |
| Outbound | | | | |
| Referral/warm intro | | | | |
| **Blended CAC** | | | | |

**Blended CAC vs. LTV:** Is this a viable business?
**CAC trend:** improving / stable / deteriorating as experiments ran?

---

## 4.4 A/B Test Analysis

For each A/B test run (landing page headlines, ad copy variants, email subject lines):

| Test | Variant A | Variant B | Winner | Lift | Statistical confidence |
|------|----------|----------|--------|------|----------------------|
| | | | | % | |

**Winning message from A/B tests:**
**Key insight that explains why this won:**

---

## 4.5 Desirability Score

Compile the desirability score across all testing touchpoints:
- Concept card testing (Phase 4)
- Landing page conversion rate (% who signed up)
- Demo → Pilot conversion (% who agreed to pilot)
- Pilot → Paid conversion (if applicable)

**Overall desirability interpretation:**
- Strong (≥3.5/5 desirability AND positive CAC trend) → Strong GO signal
- Moderate (3.0-3.5/5) → Proceed with caveats — specific GTM adjustment needed
- Weak (<3.0/5) → PIVOT signal for GTM or solution

---

## 4.6 Iterate Based on Findings

Based on bottleneck analysis:
- **If landing page conversion is low:** A/B test new headlines, adjust value prop
- **If demo → pilot conversion is low:** Adjust pilot offer, pricing, or demo flow
- **If CAC is too high:** Test lower-cost channels (referral, SEO, content)
- **If no demos are happening:** Adjust messaging, targeting, or outreach channel

Run iteration sprint if time allows before final pitch.

---

## 4.7 Market Experiment Results Report

Compile all experiment data into the `market-experiment.md` template (Results section):
- Experiment summaries (what we tested, what we found)
- Desirability score tracking
- CAC summary by channel
- Key learnings and recommended actions

Also complete `conversion-analysis.md` template with all funnel data.

Save:
- `{output_folder}/{venture_name}/market-experiment.md`
- `{output_folder}/{venture_name}/conversion-analysis.md`

Update `venture-state.yaml`:
- `completed_artifacts` — market-experiment, conversion-analysis
- `guiding_questions.design_business` — mark traction questions answered
