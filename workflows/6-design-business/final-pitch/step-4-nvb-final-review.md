# Step 4: NVB Final Gate Review
<!-- Phase 6, Final Pitch Step 4 -->
<!-- Agent: Venture Evaluator -->

## Objective
Simulate the full NVB final gate review. The Venture Evaluator acts as the NVB panel, evaluates all evidence against the complete gate rubric (all 7 criteria), and produces the formal Go / Pivot / Kill decision.

---

## 4.1 Activate Full NVB Panel

Load:
- `pitch/pitch-deck.md` — the final deck
- ALL completed artifacts from venture-state.yaml
- `{project-root}/ventureOS/data/scoring/gate-rubric.yaml` — full rubric (all 7 criteria + weights)
- `{project-root}/ventureOS/data/scoring/pivot-triggers.yaml` — if pivot is needed

The Venture Evaluator simulates a 5-person NVB panel:
1. **NVB Chair** — overall investment thesis
2. **Market Expert** — market size and competitive dynamics
3. **Customer Champion** — is the customer evidence strong?
4. **Financial Skeptic** — do the numbers work?
5. **Corporate Innovation Director** — mothership alignment and strategic fit

---

## 4.2 Full Gate Evaluation

For each of the 7 criteria in gate-rubric.yaml:

1. Review evidence from completed artifacts
2. Assign score (1-5) using the scoring guide
3. Note key evidence cited
4. Note biggest gap for this criterion
5. State which NVB member would most scrutinize this criterion

**Criteria:**
1. Customer Pain Validation (weight: 0.20)
2. Market Opportunity Size (weight: 0.15)
3. Wedge Clarity & Differentiation (weight: 0.15)
4. Business Model & Revenue Viability (weight: 0.15)
5. Traction / Market Experiment Results (weight: 0.15)
6. Technical Feasibility (weight: 0.10)
7. Mothership Advantage & Team Readiness (weight: 0.10)

---

## 4.3 Calculate Weighted Score

| Criterion | Score | Weight | Weighted Score |
|-----------|-------|--------|---------------|
| Customer Pain Validation | | 0.20 | |
| Market Opportunity | | 0.15 | |
| Wedge Clarity & Differentiation | | 0.15 | |
| Business Model & Revenue | | 0.15 | |
| Traction / Experiments | | 0.15 | |
| Technical Feasibility | | 0.10 | |
| Mothership & Team | | 0.10 | |
| **TOTAL** | | 1.00 | |

Apply thresholds:
- ≥ 3.5 → **GO** — proceed to acceleration / fund
- 2.5 – 3.49 → **PIVOT** — specific pivot with re-entry phase
- < 2.5 → **KILL** — document learnings and archive

---

## 4.4 NVB Questions and Deliberation

Simulate NVB deliberation — each panel member speaks:

**NVB Chair:** "My overall read on this venture is..."
**Market Expert:** "On the market side, I'm [confident/concerned] about..."
**Customer Champion:** "The customer evidence [is/is not] strong enough because..."
**Financial Skeptic:** "The numbers [work/don't work] because... My biggest concern is..."
**Corporate Innovation Director:** "The mothership fit [is/is not] strong because..."

Top 5 NVB questions for the team to answer:
1.
2.
3.
4.
5.

---

## 4.5 Decision Output

**Formal NVB Decision: GO / PIVOT / KILL**

Save gate evaluation to `gate-evaluation.md` using the template.

### If GO:
- Confirm the funding ask (from pitch Slide 11)
- Note: conditions or milestones attached to the GO decision
- Recommended next steps (acceleration program, investor introductions, etc.)
- Update venture-state.yaml: status = "funded", gate_history[1].decision = "GO"

### If PIVOT:
- Execute pivot classification from pivot-triggers.yaml
- Specify: pivot type, re-entry phase, artifacts to preserve/regenerate
- Trigger pivot-archive action (Venture Master handles)
- Update venture-state.yaml: status = "active", pivot_count + 1
- Create pivot-log.md entry

### If KILL:
- Document top 3 learnings
- Archive all artifacts to `{output_folder}/{venture_name}/archived/`
- Create kill decision record: why, what was learned, what would need to change for a second attempt
- Update venture-state.yaml: status = "killed"

---

## 4.6 Save Final Gate Record

Save: `{output_folder}/{venture_name}/pitch/final-nvb-decision.md`
Save: `{output_folder}/{venture_name}/gate-evaluation.md`

Update `venture-state.yaml`:
- `gate_history[1].date`, `gate_history[1].score`, `gate_history[1].decision`
- `status`: "funded" / "active" (pivot) / "killed"
