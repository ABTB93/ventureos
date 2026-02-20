# Step 4: Pain Atomization and FIP Scoring
<!-- Phase 3, Step 4 — Weeks 4-5 -->
<!-- Agent: Customer Discovery Specialist -->

## Objective
Decompose the validated broad pain into atomic, testable units. Score each unit on the FIP framework (Frequency / Intensity / Prevalence). Identify the sharpest, most actionable pain needle to anchor the venture solution.

---

## 4.1 Load FIP Framework and Context

Load:
- `{project-root}/ventureOS/data/scoring/pain-scoring.yaml` — FIP scoring framework
- `interview-synthesis.md` — all interview learnings
- `pain-hypothesis.md` — current pain hypothesis

Confirm the broad pain(s) to atomize:
- Primary pain from synthesis (highest frequency/intensity signal)
- Any secondary pains worth atomizing

---

## 4.2 Atomization Exercise

For the primary broad pain, decompose into atomic units:

**Instructions:**
1. Start with the broad pain statement (e.g., "ESG data is hard to incorporate into decisions")
2. Ask: "What specifically makes this hard? In what specific situations? For which specific role?"
3. Break down into 4-7 atomic pain units — each independently describable, testable, and scoreable
4. A good atomic pain:
   - Has a specific trigger ("when submitting the quarterly board report...")
   - Has a specific consequence ("...takes 3 days of manual data collection")
   - Can be scored independently on FIP

**Example atomization:**
- Broad pain: "ESG data is hard to incorporate into decisions"
- Atomic unit 1: "Finding ESG data across 15 different systems before board meetings"
- Atomic unit 2: "No way to compare ESG performance of projects side by side"
- Atomic unit 3: "Can't trace ESG claims back to source data for auditors"

---

## 4.3 FIP Scoring for Each Atomic Unit

Using the FIP framework (from pain-scoring.yaml), score each atomic unit:

**Frequency (1-5):** How often does the customer experience this specific pain?
- 5 = Daily or multiple times per day
- 4 = Weekly
- 3 = Monthly
- 2 = Quarterly or less
- 1 = Rarely

**Intensity (1-5):** How severe is the pain when experienced?
- 5 = Stops work, major cost or frustration
- 4 = Significant workaround required, time/money lost
- 3 = Annoying, some workaround exists
- 2 = Minor inconvenience
- 1 = Barely noticed

**Prevalence (1-5):** What % of the target market experiences this?
- 5 = >75%
- 4 = 50-75%
- 3 = 25-50%
- 2 = 10-25%
- 1 = <10%

**FIP Average = (F + I + P) / 3**
- ≥4.0 = Strong — sufficient to anchor a venture
- 3.0-3.99 = Moderate — warrants further investigation
- <3.0 = Weak — unlikely to support a business alone

**Evidence sources for scoring:**
- Frequency: direct interview data ("how often does this happen?")
- Intensity: direct interview data ("how painful is this on a 1-10 scale?") + consequence data
- Prevalence: desk research (industry reports, analyst data, LinkedIn company filters)

---

## 4.4 Pain Ranking and Desk Research

1. Rank all atomic units by FIP average
2. For the top 2-3: do desk research on PREVALENCE
   - Search for data on how many companies / people in the market face this specific situation
   - Look for: industry reports, job posting data, G2/review site patterns, regulatory filings
   - Update prevalence score based on desk research findings
3. Confirm market size signal: if FIP is strong, cross-reference with TAM data — how big is the market of people with this specific pain?

---

## 4.5 Select the Primary Pain to Solve

Choose the winning atomic pain unit based on:
- Highest FIP average AND
- Alignment with our ability to build a solution AND
- Clearest differentiation opportunity AND
- Best fit with mothership assets

Document the rationale. This is the pain that anchors Phase 4 (Define Solution).

---

## 4.6 Produce Pain Atomization Matrix

Using the `pain-atomization.md` template, fill in the full matrix:
- All atomic pain units with FIP scores
- Representative quotes for each
- Interview count per pain unit
- FIP ranking summary
- Prioritized pain to solve with rationale

Save: `{output_folder}/{venture_name}/pain-atomization.md`
Update `pain-hypothesis.md` with refined primary pain.
Update `venture-state.yaml`: hypotheses.problem, completed_artifacts.

---

## 4.7 Checkpoint

**GUIDED MODE:**
Present pain atomization matrix. Ask:
- "Does this FIP ranking align with your intuition from the interviews?"
- "Is there any pain unit we missed?"
- "Are you confident in the primary pain selection?"

**YOLO MODE:**
Proceed to Step 5.

---

## Step 4 Outputs

| Output | File |
|--------|------|
| Pain atomization matrix | `pain-atomization.md` |
| Updated pain hypothesis | `pain-hypothesis.md` |
| Desk research notes | `interviews/desk-research-prevalence.md` |
