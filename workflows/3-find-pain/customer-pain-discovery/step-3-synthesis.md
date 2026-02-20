# Step 3: Interview Synthesis
<!-- Phase 3, Step 3 — Run after each batch of 5-10 interviews -->
<!-- Agent: Customer Discovery Specialist -->

## Objective
Extract patterns, themes, and insights from a batch of interviews. Update the hypothesis based on emerging evidence. This step runs ITERATIVELY — after each batch, not just at the end.

---

## 3.1 Load Interview Data for This Batch

Load all interviews from this batch:
- Toolkit: `interviews/notes/interview-{N}.md` files for this batch
- Simulation: `interviews/synthetic/synthetic-interviews.md`
- Integration: `interviews/imported/interview-{N}.md` files

Also load prior synthesis (if batch > 1) to build on previous patterns.

---

## 3.2 Pattern Extraction

Analyze the batch for patterns:

**Identify recurring pain themes:**
- What pains came up in 2+ interviews in this batch?
- How do they cluster? Are they variants of the same pain or distinct?
- Rank by: how many mentioned it + how strongly they reacted

**Identify hypothesis confirmations:**
- Which hypotheses from pain-hypothesis.md were confirmed?
- Which were partially confirmed? (some signal but mixed)
- Which were contradicted or absent?

**Identify surprises:**
- What came up that was NOT in the hypothesis?
- What was the most surprising or unexpected insight?
- What did you think you'd hear that you didn't?

**Identify ICP signals:**
- Which participant profiles showed the strongest pain?
- Which were most indifferent?
- Are there patterns in: role, company size, industry, geography, context?

---

## 3.3 Archetype / Persona Development

Based on this batch:
- Are 2-3 distinct customer archetypes emerging?
- For each archetype: name/label, profile characteristics, core pain, current workaround
- Which archetype has the strongest, most frequent, most intense pain?

---

## 3.4 Produce Synthesis Report

Using the `interview-synthesis.md` template, produce the batch synthesis report:
- Batch #, interview count, cumulative count
- Participant overview table
- Top 3 pain themes with representative quotes
- Surprises and unexpected insights
- ICP signals
- Hypothesis validation status table
- Emerging archetypes
- Quotes bank
- Next steps

Save: `{output_folder}/{venture_name}/interview-synthesis-batch-{N}.md`
Update cumulative synthesis: `{output_folder}/{venture_name}/interview-synthesis.md`

---

## 3.5 Hypothesis Update

Based on synthesis findings:
1. Is the primary pain hypothesis confirmed, partially confirmed, or contradicted?
2. Should any secondary hypothesis be elevated to primary?
3. Should the ICP hypothesis be updated?
4. Should the interview script be updated for the next batch?

Update `pain-hypothesis.md` if changes are needed. Note version and rationale.

---

## 3.6 Checkpoint

**GUIDED MODE:**
Present synthesis findings. Ask:
- "Does this match what you experienced in the interviews?"
- "Any insights I missed?"
- "Are we ready to do more interviews? Or do we have enough signal to proceed to atomization?"
- "Should we adjust the ICP or pain focus before the next batch?"

**YOLO MODE:**
Update files and continue to next batch or Step 4 if minimum interview count is reached.

---

## Proceed to Next Batch or Step 4?

**Continue to more interviews (Step 2)** if:
- Fewer than 10 interviews conducted AND pain hypothesis is unconfirmed
- New pain theme emerged that needs dedicated investigation
- ICP hypothesis shifted significantly — new personas to interview

**Proceed to Step 4 (Pain Atomization)** if:
- 10+ interviews conducted AND a clear primary pain is emerging
- FIP signals are strong enough to atomize
- Pattern saturation — new interviews are repeating the same themes

---

## Step 3 Outputs

| Output | File |
|--------|------|
| Batch synthesis | `interview-synthesis-batch-{N}.md` |
| Cumulative synthesis | `interview-synthesis.md` |
| Updated pain hypothesis | `pain-hypothesis.md` |
