# Step 5: Pain Journey Map and ICP Definition
<!-- Phase 3, Step 5 — Weeks 5-7 -->
<!-- Agent: Customer Discovery Specialist -->

## Objective
Map the customer's end-to-end pain journey for the primary pain. Define the Ideal Customer Profile (ICP) from accumulated evidence. Map buyer vs. user. Identify the best solution entry points. Complete Phase 3 and prepare handoff to Phase 4.

---

## 5.1 Load All Phase 3 Context

Load:
- `pain-atomization.md` — primary pain and FIP scores
- `interview-synthesis.md` — all interview learnings and archetypes
- `stakeholder-map.md` — buyer/user mapping

Confirm the primary pain to map (winning atomic pain from Step 4).

---

## 5.2 Pain Journey Mapping

Using the `pain-journey-map.md` template, map the customer's pain journey for the primary pain:

**Journey stages to map:**
1. **Trigger:** What specific event or situation causes the pain to surface?
2. **Awareness:** The customer realizes there's a problem — what do they see/feel?
3. **Struggle:** They try to deal with it — what do they do? What goes wrong?
4. **Workaround:** They settle on a workaround — what is it? How good is it?
5. **Outcome:** The pain episode ends — how satisfied are they? What residue remains?

**For each stage capture:**
- Customer action (what they do)
- Customer thought (what they think/say)
- Emotional state (frustrated / resigned / anxious / overwhelmed)
- Pain touchpoints (specific moments of friction)
- Tools / systems involved
- Workaround used at this stage

**Map the emotional arc:**
Draw the emotional curve — where does it dip lowest? That's the intervention point.

---

## 5.3 Buyer vs. User Mapping

From the journey map, clarify the buyer/user relationship:
1. **Who is the user?** Who experiences this journey daily?
2. **Who is the buyer?** Who approves the budget for a solution?
3. **Are they the same?** If not: map both journeys and their priorities
4. **Decision-making process:** How does the buyer learn about solutions? What triggers a buying decision?
5. **Implication for sales motion:** Should we sell top-down (to buyers) or bottom-up (to users)?

---

## 5.4 Solution Entry Point Identification

Based on the pain journey:
1. Where in the journey does the pain reach maximum intensity? (highest intervention value)
2. Where is the customer most motivated to try something new?
3. Where does a solution create the biggest before/after contrast?
4. Which entry point is most tractable as a first wedge product?

List 2-3 candidate solution entry points ranked by: pain intensity × feasibility × wedge potential.

---

## 5.5 Define the Ideal Customer Profile (ICP)

Using all Phase 3 evidence, define the ICP using the `icp-profile.md` template:

**From interview synthesis:**
- Which participant profiles showed the strongest pain?
- Which roles, company types, company sizes, geographies?

**ICP dimensions to define:**
- Demographics/firmographics: role, industry, company size, geography, company stage
- Psychographics: what they're measured on, what they fear, how they make decisions
- Pain profile: primary pain, FIP score, workaround, switching motivation
- Buying behavior: how they discover solutions, buying process, typical budget

**Buyer vs. User ICP:**
If buyer ≠ user, define both with separate profiles.

**ICP exclusion criteria:**
Who explicitly does NOT fit? (Helps focus GTM.)

---

## 5.6 Produce Phase 3 Outputs

Save all final documents:

**Pain Journey Map:**
Save: `{output_folder}/{venture_name}/pain-journey-map.md`

**ICP Profile:**
Save: `{output_folder}/{venture_name}/icp-profile.md`

**Update venture-state.yaml:**
- `hypotheses.customer` → update with final ICP definition
- `hypotheses.problem` → update with final primary pain statement
- `guiding_questions.pain` → mark all answered (with evidence file references)
- `completed_artifacts` → add pain-journey-map, icp-profile
- `category_progress.venture` → update to reflect Phase 3 completion

---

## 5.7 Phase 3 Completion Gate

Before declaring Phase 3 complete, verify all guiding questions:

| Guiding Question | Answered? | Evidence File |
|-----------------|-----------|--------------|
| What do people need? | Yes/No | |
| Can the team prioritize the most important pain? | Yes/No | pain-atomization.md |
| Is the pain frequent, intense, prevalent enough? | Yes/No | pain-atomization.md (FIP ≥ 3.0) |
| Has the team validated the pain exists? (10+ interviews) | Yes/No | interview-synthesis.md |
| Can they identify their ideal customer? | Yes/No | icp-profile.md |
| Does the team understand who the buyer is? | Yes/No | icp-profile.md |

If any question is NOT answered: identify what additional interviews or research is needed.

---

## 5.8 Handoff to Phase 4

When Phase 3 is complete, brief the Venture Master and Product Strategist:
1. Primary pain validated: [pain statement] | FIP: ___
2. ICP: [brief description]
3. Buyer: [role] | User: [role] — same/different
4. Solution entry point recommendation: [entry point description]
5. What must the solution do to address the validated pain?

**Phase 4 can begin when:**
- Primary pain FIP ≥ 3.0 (weak signal — need more interviews)
- ICP is defined
- At least 10 interviews completed
- Pain journey map shows at least one viable solution entry point

---

## Step 5 Outputs

| Output | File |
|--------|------|
| Pain journey map | `pain-journey-map.md` |
| ICP profile | `icp-profile.md` |
| Phase 3 completion gate | _(in venture-state.yaml guiding_questions)_ |
| Phase 4 brief | `phase-4-brief.md` |
