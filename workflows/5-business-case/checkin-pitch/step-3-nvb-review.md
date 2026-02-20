# Step 3: NVB Check-in Review Simulation
<!-- Phase 5, Check-in Pitch Step 3 -->
<!-- Agent: Venture Evaluator -->

## Objective
Simulate the New Venture Board check-in review. The Venture Evaluator acts as the NVB Chair, reviews the check-in pitch, evaluates the evidence against the gate rubric (focus criteria), asks hard questions, and produces a Go / No-Go / Revise decision.

---

## 3.1 Activate NVB Review Mode

Load:
- `pitch/checkin-pitch.md` (the deck)
- `checkin-evidence.md` (supporting evidence)
- `{project-root}/ventureOS/data/scoring/gate-rubric.yaml` (rubric + checkin_gate focus criteria)
- All completed artifacts from venture-state.yaml

Note: For the check-in gate, focus evaluation on:
- Customer Pain Validation (weight: 20%)
- Market Opportunity (weight: 15%)
- Wedge Clarity & Differentiation (weight: 15%)

Other criteria (business model, traction, feasibility, mothership/team) are noted but not decisive at this gate.

---

## 3.2 NVB Review Simulation

The Venture Evaluator simulates the NVB board session:

**Opening (as NVB Chair):**
"Thank you for the presentation. We've reviewed the deck. Let's go through each area..."

**For each of the 3 focus criteria:**
1. Read the evidence presented for this criterion
2. Assign a score (1-5) with rationale
3. Ask 2-3 probing NVB-style questions
4. Note the strongest evidence and the biggest gap

**NVB Hard Questions to ask (examples):**
- "You've done ___ interviews. How confident are you that ___ more interviews would change your view of the primary pain?"
- "The FIP score of ___ is [strong/moderate]. What's the riskiest assumption in that score?"
- "Your ICP is [description]. How do you know this is the right customer to target first?"
- "The market is sized at $___B TAM. What's your source, and how have you filtered to SAM?"
- "The wedge is [description]. Who would build this if you didn't?"

---

## 3.3 Weighted Score Calculation (Check-in Focus)

Calculate score for the 3 focus criteria:
- Customer Pain Validation: score × 0.20
- Market Opportunity: score × 0.15
- Wedge Clarity: score × 0.15

Note scores on other criteria (not weighted decisively at this gate):
- Technical Feasibility: score × 0.10
- Mothership & Team: score × 0.10

**Overall check-in score:** (sum of focus criteria weighted scores + other criteria)

Apply thresholds from gate-rubric.yaml:
- ≥3.5 → **GO: Continue to Phase 6**
- 2.5-3.49 → **REVISE: Specific gap must be addressed before Phase 6**
- <2.5 → **NO-GO: Not enough evidence. Revisit pain discovery or kill.**

---

## 3.4 Decision Output

Produce the NVB check-in decision record:

**Decision:** GO / REVISE / NO-GO

**Score Summary:**
| Criterion | Score | Weight | Weighted |
|-----------|-------|--------|---------|
| Customer Pain Validation | | 0.20 | |
| Market Opportunity | | 0.15 | |
| Wedge Clarity | | 0.15 | |
| Other criteria | | | |
| **Total** | | | |

**Key strengths:**
1.
2.

**Key concerns:**
1.
2.

**NVB Questions for the team to answer:**
1.
2.
3.

**If REVISE:** What specific evidence or work must be completed before Phase 6 can begin?

**If NO-GO:** Is this a Kill or a return to Phase 3 for further discovery?

---

## 3.5 Update Venture State

Save: `{output_folder}/{venture_name}/pitch/checkin-nvb-decision.md`

Update `venture-state.yaml`:
- `gate_history[0].date` and `gate_history[0].decision`
- If GO: `current_phase: "6-design-business"`, `current_week: 10`
- If REVISE: note what must be done, stay in Phase 5
- If NO-GO/KILL: trigger kill or pivot flow via Venture Master
