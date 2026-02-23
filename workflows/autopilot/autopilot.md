# VentureOS Autopilot
# Full synthetic venture run — Victor decides at every gate

These are your operating instructions for Autopilot mode. Follow every step in sequence.
Do not wait for user input unless explicitly marked **[USER INPUT REQUIRED]**.
Mark every AI-generated output with: `⚠️ SYNTHETIC — AI-generated hypothesis. Not validated with real customers.`

---

## PRE-FLIGHT

### Step 1 — Cost warning [USER INPUT REQUIRED]

Display this exact message before doing anything else:

---

> **⚡ Autopilot Mode**
>
> Victor will run a full synthetic venture scan — domain research, customer interviews, solution design, business case, board evaluation, and pitch deck — without pausing for your input.
>
> **Estimated token usage:** ~180,000 tokens
>
> | Provider | Estimated cost |
> |---|---|
> | Claude Opus | ~$5–7 |
> | GPT-4o | ~$3–4 |
> | Gemini Flash | ~$0.50–1 |
>
> **What you get:** A complete `venture-scan-report.md` in your `_ventures/` folder with every section clearly marked as synthetic — plus a prioritised list of what to validate with real customers next.
>
> Continue? **(Y/n)**

If user says n or no → return to main menu.
If user says y or yes → proceed to Step 2.

---

### Step 2 — Venture context [USER INPUT REQUIRED]

Read `{project-root}/ventureOS/_memory/venture-state.yaml` and `{project-root}/ventureOS/config.yaml`.

If `venture_name` is empty or no venture is active:
- Ask: **"What is the name of the venture (or working title)?"**
- Ask: **"Describe the idea or domain in 1–2 sentences."**
- Set `{autopilot_venture_name}` and `{autopilot_idea}` from answers.
- Create output folder: `{output_folder}/{autopilot_venture_name}/`
- Write initial venture-state.yaml with status: autopilot

If venture is already active:
- Use existing `{venture_name}` and load available context (completed artifacts, phase, hypotheses).
- Inform user: "Running Autopilot on **{venture_name}**. I'll build on your existing work."

Set `{ap_start_time}` = now.
Display: "**Autopilot started. Running full venture scan on {venture_name}...**"
Display a progress tracker that updates at each phase:
```
[ ] Phase 0 — Domain Scan
[ ] Phase 1 — Market Mapping
[ ] Phase 2 — Customer Pain Discovery
[ ] Gate 1  — Pain Validation
[ ] Phase 3 — Solution Design
[ ] Phase 4 — Business Case
[ ] Gate 2  — Check-in (Week 8)
[ ] Phase 5 — Business Design
[ ] Phase 6 — Pitch Deck
[ ] Final   — Venture Scan Report
```

---

## PHASE 0 — DOMAIN SCAN

### Step 3 — Domain exploration (Diana)

Load and follow `{project-root}/ventureOS/agents/domain-explorer.md` — activate Diana.

Run autonomously in research mode. Do not pause for checkpoints.

**Diana's task:**
- Map the domain landscape: key actors, emerging trends, regulatory context, technology shifts
- Identify 3–5 opportunity spaces within the domain
- Flag white spaces: problems that exist but have no strong solution yet
- Assess why now: what has changed in the last 2–3 years that creates an opening

**Output:** Save as `{output_folder}/{venture_name}/autopilot/domain-scan.md`

Header format:
```
# Domain Scan — {venture_name}
⚠️ SYNTHETIC — AI-generated from public knowledge. Not primary research.
Generated: {date} | VentureOS Autopilot
```

Update progress tracker: `[✓] Phase 0 — Domain Scan`

---

## PHASE 1 — MARKET MAPPING

### Step 4 — Market mapping (Diana)

Continue as Diana or reload if needed.

**Diana's task:**
- Competitive landscape: top 5 players, their positioning, pricing, key weaknesses
- Market sizing: TAM / SAM / SOM estimates with reasoning
- Stakeholder map: who has influence, who feels the pain, who pays
- Key barriers to entry and how to navigate them
- Identify the most underserved customer segment

**Output:** Save as `{output_folder}/{venture_name}/autopilot/market-mapping.md`

Header format:
```
# Market Mapping — {venture_name}
⚠️ SYNTHETIC — AI-generated estimates. Validate with industry reports and expert interviews.
Generated: {date} | VentureOS Autopilot
```

Update progress tracker: `[✓] Phase 1 — Market Mapping`

---

## PHASE 2 — CUSTOMER PAIN DISCOVERY

### Step 5 — Synthetic interviews (Clara — simulation mode)

Load and follow `{project-root}/ventureOS/agents/customer-discovery.md` — activate Clara.
**Mode: [S] Simulation — forced. Do not ask user for mode.**

**Clara's task:**

**Part A — Persona generation**
Generate 25 distinct customer personas based on domain scan and market mapping findings.
Vary across: role, company size, industry sub-vertical, geography, pain intensity, seniority, and tech-savviness.
For each persona define: name, role, company context, daily workflow, current tools, suspected pain level.

**Part B — Synthetic interviews**
Simulate a 30-minute pain interview for each of the 25 personas.
Each interview must include:
- Natural conversation (not Q&A format)
- Genuine moments of resistance and surprise
- Specific quotes capturing pain in the customer's own words
- Preliminary FIP signals embedded in responses

**Part C — Expert interviews**
Simulate 5 domain expert interviews (e.g. industry analyst, veteran practitioner, former competitor employee, market regulator, academic researcher).
Focus: pain prevalence across the market, why current solutions fail, what a breakthrough would look like.

**Total: minimum 30 interviews (25 customer + 5 expert).**

**All output labeled:**
```
⚠️ SIMULATED INTERVIEW — AI-generated persona. Not real customer data.
```

**Output:** Save as `{output_folder}/{venture_name}/autopilot/synthetic-interviews.md`

Update progress tracker: `[✓] Phase 2 — Customer Pain Discovery`

---

### Step 6 — Pain synthesis and FIP scoring (Clara)

**Clara's task:**
- Extract recurring pain themes across all 30 interviews
- Atomise into 4–6 distinct pain units
- Score each on FIP framework using `{project-root}/ventureOS/scoring/pain-scoring.yaml`
- Select primary pain: highest FIP AND most aligned with domain opportunity
- Define initial ICP: the persona profile that showed strongest, most consistent pain

**Output:** Save as `{output_folder}/{venture_name}/autopilot/pain-atomization.md`

---

## GATE 1 — PAIN VALIDATION

### Step 7 — Pain gate decision (Victor)

Read the FIP scores from pain-atomization.md.
Apply thresholds from `{project-root}/ventureOS/scoring/pain-scoring.yaml`:

| FIP Average | Decision |
|---|---|
| ≥ 3.5 | **STRONG** — proceed to solution design |
| 3.0–3.49 | **MODERATE** — proceed with caution, note risk |
| 2.5–2.99 | **WEAK** — attempt one hypothesis revision, re-run interviews for revised segment |
| < 2.5 | **KILL** — pain insufficient to support a venture |

**If STRONG or MODERATE:** Update progress tracker `[✓] Gate 1 — Pain Validation (GO)`. Proceed.

**If WEAK:** Revise the ICP hypothesis (try adjacent segment or reframe pain), re-run Steps 5–6 once. If still < 2.5 after second run → KILL.

**If KILL:** Generate `{output_folder}/{venture_name}/autopilot/kill-decision.md` with:
- Pain scores across all tested segments
- Reason for kill: pain insufficient
- What was learned
- Recommendation: pivot to different domain or validate assumptions with real customers first

Then display kill summary to user and return to main menu.

Update progress tracker: `[✓] Gate 1 — Pain Validation`

---

## PHASE 3 — SOLUTION DESIGN

### Step 8 — Wedge design (Paulo)

Load and follow `{project-root}/ventureOS/agents/product-strategist.md` — activate Paulo.
Run autonomously. Do not pause for checkpoints.

**Paulo's task:**
- Define the wedge: the smallest, most defensible entry point into the primary pain
- Generate 3 wedge options, evaluate each on: pain alignment, buildability, differentiation, path to big vision
- Select strongest wedge with clear rationale
- Draft value proposition for selected wedge
- Assess technical feasibility: build / buy / partner / invest
- Outline prototype concept (what the earliest testable version looks like)
- Map wedge → big vision scaling path

**Output:** Save as `{output_folder}/{venture_name}/autopilot/solution-design.md`

Header:
```
# Solution Design — {venture_name}
⚠️ SYNTHETIC — AI-generated solution hypothesis. Not validated with real users.
Generated: {date} | VentureOS Autopilot
```

Update progress tracker: `[✓] Phase 3 — Solution Design`

---

## PHASE 4 — BUSINESS CASE

### Step 9 — Business model and financials (Bernard + Fiona)

Load and follow `{project-root}/ventureOS/agents/business-architect.md` — activate Bernard.
Then load `{project-root}/ventureOS/agents/financial-analyst.md` — activate Fiona.
Run autonomously.

**Bernard's task:**
- Map 3 revenue model options for the wedge
- Select strongest model: justify with ICP willingness-to-pay signals from interviews
- Draft business model canvas (9 blocks)
- Identify top 3 venture-killer risks with mitigation plans

**Fiona's task:**
- Estimate market sizing: TAM / SAM / SOM (bottom-up from ICP count × ACV estimate)
- Build 3-year revenue projection (Year 1: wedge, Year 2: expand, Year 3: scale)
- Calculate unit economics: estimated CAC, LTV, LTV:CAC ratio
- Identify key financial assumptions that need validation

**Output:** Save as `{output_folder}/{venture_name}/autopilot/business-case.md`

Header:
```
# Business Case — {venture_name}
⚠️ SYNTHETIC — AI-generated model. All numbers are hypothesis-level estimates.
Generated: {date} | VentureOS Autopilot
```

Update progress tracker: `[✓] Phase 4 — Business Case`

---

## GATE 2 — CHECK-IN (WEEK 8)

### Step 10 — Synthetic board check-in (Eva)

Load and follow `{project-root}/ventureOS/agents/venture-evaluator.md` — activate Eva.

**Eva's task:**
Apply the **check-in gate variation** from `{project-root}/ventureOS/scoring/gate-rubric.yaml`.
Evaluate 3 criteria only (traction and full business model not yet expected):
1. Customer Pain Validation (weight 0.20) — based on synthetic interview quality and FIP scores
2. Market Opportunity Size (weight 0.15) — based on market mapping
3. Wedge Clarity & Differentiation (weight 0.15)

Simulate 4 board members with different perspectives:
- **VC Partner** — challenges market size and competitive moat
- **Corporate Innovation Director** — challenges mothership alignment and risk
- **Customer Champion** — challenges whether pain is real enough
- **Financial Skeptic** — challenges unit economics and revenue assumptions

Each board member scores independently, then Eva calculates weighted average.

**Decision thresholds (from gate-rubric.yaml):**

| Score | Decision |
|---|---|
| ≥ 3.5 | **GO** — proceed to business design |
| 2.5–3.49 | **PIVOT** — identify pivot type, revise |
| < 2.5 | **KILL** — insufficient evidence |

**Output:** Save as `{output_folder}/{venture_name}/autopilot/checkin-evaluation.md`

All output labeled:
```
⚠️ SYNTHETIC BOARD FEEDBACK — AI-simulated evaluation. Not a real investment decision.
```

---

### Step 11 — Gate 2 routing (Victor)

**If GO:** Update progress tracker `[✓] Gate 2 — Check-in (GO)`. Proceed to Phase 5.

**If PIVOT:**
- Read `{project-root}/ventureOS/scoring/pivot-triggers.yaml`
- Identify pivot type based on which criteria scored lowest
- Execute pivot: revise the relevant hypothesis, regenerate affected phases
  - Solution pivot (wedge scored low) → redo Step 8 only
  - Customer/problem pivot (pain scored low) → redo Steps 5–9
- Re-run Gate 2 (Step 10) with revised outputs
- **Maximum 1 pivot in Autopilot mode**
- If second gate also results in PIVOT → downgrade to KILL and document

**If KILL:**
Generate `{output_folder}/{venture_name}/autopilot/kill-decision.md` with full rationale.
Display summary and return to main menu.

Update progress tracker: `[✓] Gate 2 — Check-in`

---

## PHASE 5 — BUSINESS DESIGN

### Step 12 — Go-to-market and growth strategy (Grace)

Load and follow `{project-root}/ventureOS/agents/growth-strategist.md` — activate Grace.
Run autonomously.

**Grace's task:**
- Define GTM motion: how the first 100 customers will be acquired (channel, message, sequence)
- Identify top 3 acquisition channels with rationale
- Outline 2–3 market experiments to run in the first 90 days
- Define success metrics for each experiment (what GO looks like)
- Draft pilot customer outreach strategy: who to target, what to say

**Output:** Save as `{output_folder}/{venture_name}/autopilot/gtm-plan.md`

Header:
```
# Go-to-Market Plan — {venture_name}
⚠️ SYNTHETIC — AI-generated GTM hypothesis. Validate with real channel experiments.
Generated: {date} | VentureOS Autopilot
```

Update progress tracker: `[✓] Phase 5 — Business Design`

---

## PHASE 6 — PITCH DECK

### Step 13 — Investor pitch deck (Petra)

Load and follow `{project-root}/ventureOS/agents/pitch-master.md` — activate Petra.
Run autonomously.

**Petra's task:**
Build a complete investor pitch deck. Use the narrative-first format for every slide — no bullet dumps.

**Each slide must follow this exact structure:**
```
---
### Slide N — [Slide Title]

**Headline:** [One punchy sentence the investor reads and remembers — max 12 words]

**Visual:** [What goes on screen: one dominant image, chart, stat, or quote — described concisely]

**You say:** [2–3 sentences the presenter delivers out loud — the story, not a list]

**Proof:** [The one data point, quote, or evidence that makes this real]
---
```

**Slides to build (10):**
1. **Hook** — the market shift or undeniable truth that makes this venture inevitable
2. **Problem** — the primary pain with FIP evidence and a customer quote that lands like a gut-punch
3. **Customer** — ICP profile, their world before the solution, what they fear and want
4. **Solution** — the wedge and the big vision arc (smallest entry → where this goes)
5. **Why now** — the timing argument: what changed in the last 2–3 years that opens this window
6. **Market** — TAM / SAM / SOM with bottom-up reasoning, not just numbers
7. **Business model** — how money flows, pricing, unit economics in one clear visual
8. **Go-to-market** — the first 100 customers: who, where, how, in what sequence
9. **Traction** (synthetic) — what the 90-day experiments are designed to prove, and what GO looks like
10. **Team + The ask** — placeholder team section + what the venture needs to reach the next milestone

**Narrative arc rule:** Slides 1–3 build the villain (the problem). Slides 4–5 introduce the hero (the solution and timing). Slides 6–8 prove the business. Slides 9–10 close the deal.

**Output:** Save as `{output_folder}/{venture_name}/autopilot/pitch-deck.md`

Header:
```
# Investor Pitch Deck — {venture_name}
⚠️ SYNTHETIC — All data points are AI-generated hypotheses. Validate before presenting to real investors.
Generated: {date} | VentureOS Autopilot
```

Update progress tracker: `[✓] Phase 6 — Pitch Deck`

---

## FINAL — VENTURE SCAN REPORT

### Step 14 — Assemble venture scan report (Victor)

Using `{project-root}/ventureOS/templates/venture-scan-report.md` as the template, assemble the complete report by pulling key findings from all autopilot outputs.

Save as: `{output_folder}/{venture_name}/venture-scan-report.md`

This is the primary deliverable of Autopilot mode — a single skimmable document that captures everything.

Update progress tracker: `[✓] Final — Venture Scan Report`

---

### Step 15 — Autopilot complete [USER OUTPUT]

Display this summary to the user:

---

> ## ✅ Autopilot Complete — {venture_name}
>
> **Full venture scan finished.** Here's what was produced:
>
> | Output | File |
> |---|---|
> | Domain scan | `autopilot/domain-scan.md` |
> | Market mapping | `autopilot/market-mapping.md` |
> | Synthetic interviews | `autopilot/synthetic-interviews.md` |
> | Pain atomization | `autopilot/pain-atomization.md` |
> | Solution design | `autopilot/solution-design.md` |
> | Business case | `autopilot/business-case.md` |
> | Check-in evaluation | `autopilot/checkin-evaluation.md` |
> | GTM plan | `autopilot/gtm-plan.md` |
> | Pitch deck | `autopilot/pitch-deck.md` |
> | **Venture Scan Report** | **`venture-scan-report.md`** ← start here |
>
> **Gate results:**
> - Gate 1 (Pain): {gate1_result}
> - Gate 2 (Check-in): {gate2_result}
>
> ⚠️ **Everything above is synthetic.** Before taking this to real investors or building anything, validate these assumptions with real customers. See the **Validation Roadmap** in `venture-scan-report.md` for where to start.
>
> Type **VS** to see your venture status, or **NV** to start a real incubation run using these findings as your baseline.

---

Update `{project-root}/ventureOS/_memory/venture-state.yaml`:
- Set `status: autopilot-complete`
- Add all autopilot outputs to `completed_artifacts`
- Set `current_phase: autopilot`

Return to Victor main menu.
