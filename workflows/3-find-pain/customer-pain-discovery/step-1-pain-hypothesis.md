# Step 1: Pain Hypothesis and Interview Preparation
<!-- Phase 3, Step 1 — Weeks 2-3 -->
<!-- Agent: Customer Discovery Specialist -->

## Objective
Formulate or refine pain hypotheses from available research, and prepare interview scripts and outreach strategy.

---

## 1.0 Social Signal Scan

Before forming any hypothesis, mine publicly available sources for raw, unfiltered signals from the target ICP. The goal is to observe what people are already complaining about — not to confirm assumptions.

**Web search is ENABLED for this step. Use it actively.**

### 1.0.1 Define Search Terms

From the domain research and stakeholder map, identify:
- **ICP role terms:** e.g. "site manager", "procurement officer", "school principal"
- **Domain/industry terms:** e.g. "construction", "EdTech", "supply chain"
- **Competitor names:** any known players in the space
- **Pain keywords:** words that signal frustration — "struggle", "hate", "broken", "manual", "waste time", "can't", "always fails", "nobody solves"

### 1.0.2 Reddit Signal Mining

Run the following web searches and read the top 5–10 results for each:

1. `site:reddit.com "[ICP role]" "[domain]" problem OR struggle OR frustrated`
2. `site:reddit.com "[domain]" "[pain keyword]" — filter to threads with 10+ comments`
3. `site:reddit.com "[competitor name]" issue OR complaint OR alternative` — for each known competitor

For each thread: extract the core complaint, the verbatim quote that best captures it, and any signals about the poster's role/context.

### 1.0.3 Quora Signal Mining

Run the following web searches:

1. `site:quora.com "[ICP role]" "[pain area]"`
2. `site:quora.com how do "[ICP role]" deal with "[domain challenge]"`

Quora questions reveal what people don't know how to solve — treat the question itself as a pain signal, not just the answers.

### 1.0.4 G2 / Trustpilot / App Store Review Mining

This is the highest-signal source. **3-star reviews explicitly state what a product is missing.**

For each known competitor:
1. Search: `[competitor name] reviews site:g2.com` — fetch the page and read 3–4 star reviews
2. Search: `[competitor name] reviews site:trustpilot.com` — same
3. If mobile-relevant: `[competitor name] app reviews site:apps.apple.com`

Extract: what users liked (to understand the job-to-be-done), what they said was missing or broken (core pain signals), and any recurring patterns across competitors.

### 1.0.5 Produce Signal Map

Consolidate findings into `social-signal-scan.md`:

```
## Social Signal Scan — [Venture Name]
## Scanned: [date] | Sources: Reddit, Quora, G2/Trustpilot

### Top Pain Themes (ranked by signal frequency)

| # | Theme | Sources | Frequency | Best verbatim quote |
|---|-------|---------|-----------|---------------------|
| 1 | [theme] | Reddit / G2 | High / Medium / Low | "[quote]" |
...

### ICP Signals
- Who is posting: [roles, company types, contexts observed]
- Strongest pain segments: [which ICP profiles show the most frustration]

### Competitor Gaps (from reviews)
- [Competitor A]: praised for X, consistently criticized for Y
- [Competitor B]: ...

### Surprises
- [What came up that was not in the initial domain hypothesis]

### Evidence Quality
- All entries in this scan are [B] — publicly observed data, not primary research
- Do NOT use these as interview substitutes — use them to sharpen hypotheses
```

Save to: `{output_folder}/{venture_name}/social-signal-scan.md`

Register the top 3–5 quantitative signals (e.g. "X% of G2 reviews mention Y") in the evidence registry as `[B]` entries.

### 1.0.6 Feed into Hypothesis

Before moving to 1.1, answer:
- What are the top 3 pain themes the internet is already screaming about for this ICP?
- Do any of these contradict what the team assumed going in?
- Which pain theme has the most vivid, quotable evidence?

Use these answers to ground the hypothesis in 1.2 — not in internal assumptions.

---

## 1.1 Load and Review Existing Context

Load the following (if they exist from Phase 2):
- `pain-hypothesis.md` — initial pain hypothesis
- `stakeholder-map.md` — persona hypotheses and stakeholder map
- `market-landscape.md` / `competitive-analysis.md` — domain context

If pain-hypothesis.md exists: review and confirm with user. Update if needed.
If starting fresh: facilitate creation using the pain-hypothesis.md template.

---

## 1.2 Refine Pain Hypothesis

Work with the user to sharpen the pain hypothesis:

**Primary Pain Hypothesis:**
- Pain statement: "[Customer] struggles with [pain] when [trigger], causing [consequence]."
- Preliminary FIP estimate (before interviews)
- Key assumptions to test

**Secondary Hypotheses (2-3 alternatives):**
- List alternative pains to probe if the primary doesn't validate

**Prioritization rationale:**
- Why is the primary hypothesis the most promising to test first?

Save updates to `{output_folder}/{venture_name}/pain-hypothesis.md`.

---

## 1.3 Customer Outreach Planning

Define the interview target list:
1. **Number of interviews needed:** (minimum 10 recommended for validation; 20+ for strong signal)
2. **Interview types to run:** pain-point / expert / both
3. **Target profiles:** specific roles, company types, company sizes, geographies
4. **Where to find them:** LinkedIn, professional networks, mothership customer contacts, communities
5. **Outreach message:** (brief, value-exchange framing — "I want to learn from your experience, not sell anything")
6. **Timeline:** First batch of ___ interviews by Week ___

Create `{output_folder}/{venture_name}/interview-outreach-plan.md` with the target list and approach.

---

## 1.4 Generate Interview Scripts

Based on the pain hypothesis and stakeholder map, generate interview scripts using the `interview-script.md` template:

**Script 1: Pain-Point Interview Script** (for target customers)
- Sections: context setting → pain exploration → FIP probes → closing
- Tailor questions to the specific pain hypothesis

**Script 2: Expert Interview Script** (for domain experts who can validate prevalence)
- Tailor to elicit: how common is this pain? What do most companies do about it?

Save scripts to `{output_folder}/{venture_name}/interview-scripts/`.

---

## 1.5 Checkpoint

**GUIDED MODE:**
Present to user:
- Refined pain hypothesis
- Interview outreach plan
- Interview scripts

Ask: "Are you ready to start interviews? Any changes to the pain hypothesis or scripts before we begin?"

**YOLO MODE:**
Proceed directly to Step 2. If Simulation mode is selected, begin immediately.

---

## Step 1 Outputs

| Output | File |
|--------|------|
| Social signal scan | `social-signal-scan.md` |
| Pain hypothesis (refined) | `pain-hypothesis.md` |
| Interview outreach plan | `interview-outreach-plan.md` |
| Pain-point interview script | `interview-scripts/pain-point-script.md` |
| Expert interview script | `interview-scripts/expert-script.md` |
