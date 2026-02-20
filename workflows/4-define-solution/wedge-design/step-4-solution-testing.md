# Step 4: Solution Testing and Refinement
<!-- Phase 4, Step 4 — Weeks 6-7 -->
<!-- Agent: Product Strategist + Customer Discovery -->

## Objective
Test the prototype with target customers. Gather usability and desirability feedback. Refine the wedge definition, value proposition, feasibility assessment, and product roadmap. Complete Phase 4.

---

## 4.1 Solution Testing Interviews

Using the solution testing section of `interview-script.md`:

**Conduct 5-10 solution testing interviews:**
1. Walkthrough the prototype with the ICP persona
2. Ask participants to think aloud as they interact
3. Probe: What's confusing? What's delightful? What would you do next?
4. After walkthrough: "Would you use this in your current work? Under what conditions?"
5. "What would you need to see to recommend this to your team?"
6. Desirability score: "On a scale of 1-5, how valuable would this be in your work?"

**Synthetic Solution Testing (if needed):**
Using "synthetic-solution-testing" tool from `synthetic-tools.csv`:
1. Generate ICP personas from interview data
2. Simulate 5+ personas experiencing the prototype walkthrough
3. Label ALL output: "⚠️ SIMULATED — Not real user testing"

---

## 4.2 Solution Testing Synthesis

Compile solution testing results:
- Usability issues (what confused people)
- Desirability signals (what delighted people)
- Feature gaps (what they expected but didn't see)
- Average desirability score (1-5)
- % who would use in current work
- % who would recommend to team
- Key quotes

Update `wedge-definition.md` with testing insights.

---

## 4.3 ICP Refinement from Solution Testing

Based on who responded best to the prototype:
- Refine the ICP: which specific profiles showed the strongest positive reaction?
- Update `icp-profile.md` with solution testing signals
- Narrow or expand the ICP based on new evidence

---

## 4.4 Product Roadmap

Using the `product-roadmap.md` template, create the wedge-to-vision roadmap:
- **Phase 1 (Wedge):** Core features, success metrics, scope boundary
- **Phase 2 (Expand):** How the wedge deepens or broadens
- **Phase 3 (Vision):** The full platform/ecosystem

Note what we explicitly are NOT building in Phase 1.

Save: `{output_folder}/{venture_name}/product-roadmap.md`

---

## 4.5 Vision Story

Using the `vision-story.md` template, write the From/To narrative:
- ACT 1: The world before — the customer's pain state
- ACT 2: The shift — the enabling insight / technology
- ACT 3: The world after — the transformed customer experience

Save: `{output_folder}/{venture_name}/vision-story.md`

---

## 4.6 Phase 4 Completion Gate

Verify all guiding questions are answered:

| Guiding Question | Answered? | Evidence |
|-----------------|-----------|---------|
| Can the team describe the wedge? | | wedge-definition.md |
| Can the team articulate the big vision? | | vision-story.md |
| Is the solution technically feasible? | | solution-feasibility.md |
| What makes the solution special? | | value-proposition.md |
| Wedge-to-vision scaling hypothesis? | | wedge-definition.md + product-roadmap.md |
| Can the target customer use the product? | | Solution testing results |

Update `venture-state.yaml`:
- `hypotheses.solution` and `hypotheses.wedge`
- `guiding_questions.solution` — mark all answered
- `completed_artifacts` — add all Phase 4 artifacts
- `category_progress.venture` — Phase 4 complete

---

## Step 4 Outputs

| Output | File |
|--------|------|
| Solution testing synthesis | `solution-testing-synthesis.md` |
| Updated wedge definition | `wedge-definition.md` |
| Updated ICP profile | `icp-profile.md` |
| Product roadmap | `product-roadmap.md` |
| Vision story | `vision-story.md` |
