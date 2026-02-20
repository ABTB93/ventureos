# Step 2: Value Propositions and Concept Cards
<!-- Phase 4, Step 2 — Weeks 4-5 -->
<!-- Agent: Product Strategist + Customer Discovery -->

## Objective
Develop and test value propositions for the wedge. Create concept cards for customer testing. Run value prop testing (real interviews or synthetic). Select the winning value proposition.

---

## 2.1 Value Proposition Sprint

Using the "value-prop-sprint" brainstorming technique from `brainstorming-techniques.csv`:

1. Load `wedge-definition.md` and `icp-profile.md`
2. Generate 5+ value proposition statements using the format:
   > "For [ICP], who [pain], [venture name] is a [category] that [benefit]. Unlike [alternative], we [differentiator]."
3. For each VP: identify the core benefit, the key differentiator, and the customer emotion it targets

Fill in the `value-proposition.md` template with all candidate VPs.

---

## 2.2 Create Concept Cards

Using the `concept-card.md` template, create 3-5 concept cards representing different solution directions (or value proposition framings):

For each concept card:
- Problem statement (in customer language)
- Solution concept (plain language, no jargon)
- How it works (3-4 steps)
- Key benefit (one bold statement)
- Unlike alternatives section
- Visual description for interview use

Save cards to `{output_folder}/{venture_name}/concept-cards/card-{N}.md`

---

## 2.3 Test Value Propositions

**Option A: Real Concept Card Interviews**
Using the interview script from Phase 3 (concept card section):
1. Run 5-10 concept card interviews with ICP
2. Show each concept card and probe: resonance, differentiation, willingness to use/pay
3. Capture scores and quotes per card

**Option B: Synthetic Value Prop Testing**
Using the "synthetic-value-prop-testing" tool from `synthetic-tools.csv`:
1. Generate ICP personas from interview data
2. Run each persona through all 5 concept cards
3. Capture simulated reactions, resonance scores, objections
4. Label ALL output: "⚠️ SIMULATED — Not real customer data"

---

## 2.4 Synthesize Testing Results

Compile concept card / VP testing results:
- Resonance score per concept card (1-5)
- % who would use each
- Top objections per card
- Key quotes from testing
- Winner: which concept card / VP had the strongest resonance?

Update `value-proposition.md` with testing results.
Update `wedge-definition.md` with the validated value proposition.

---

## 2.5 Checkpoint

**GUIDED MODE:** Present value prop testing results. Ask: "Does the winning value prop feel right? Should we refine before moving to prototype?"

**YOLO MODE:** Proceed to Step 3.

---

## Step 2 Outputs
- `value-proposition.md` (with testing results)
- `concept-cards/card-{N}.md` (3-5 cards)
- Updated `wedge-definition.md`
