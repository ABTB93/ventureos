# Step 3: Prototype
<!-- Phase 4, Step 3 — Weeks 5-6 -->
<!-- Agent: Product Strategist -->

## Objective
Build the earliest testable version of the wedge product. Progress from low-fidelity (wireframe) to a working prototype using vibe coding (AI-assisted rapid build). Use the prototype for solution testing in Step 4.

---

## 3.1 Choose Prototype Fidelity

Based on wedge complexity and time available:

| Fidelity | What it is | Best for | Time |
|---------|-----------|---------|------|
| **Lo-fi** | Sketches / wireframes / Figma mockup | Early concept testing | 1-2 days |
| **Clickable mockup** | Figma/Framer prototype | Flow testing | 2-5 days |
| **Vibe-coded prototype** | Working app (AI-assisted) | Usability + desirability testing | 3-7 days |
| **MVP** | Functional product | Real usage data | 2-4 weeks |

For the incubation timeframe: aim for a **vibe-coded prototype** as the target.

---

## 3.2 Lo-Fi Specification

Before building, produce a clear specification:

**Core user story:** "As a [ICP user], I want to [action] so that [benefit]."

**Core flow (3-5 steps):**
1.
2.
3.

**Key screens / states:**
- Screen 1: [what the user sees and does]
- Screen 2:
- Screen 3:

**What we explicitly are NOT building in the prototype:**
(scope boundary — what to fake / stub out)

---

## 3.3 Vibe Code the Wedge Prototype

Using the "vibe-code-wedge" tool from `synthetic-tools.csv`:

Reference: Claude Code / Cursor / Replit

**Prompting guidance for vibe coding:**

Prompt 1 (Setup):
> "I'm building a prototype of [wedge description] for [ICP]. The core flow is [steps]. Build [tech stack — e.g., a Next.js app / React app / Python Flask app] with [key features]."

Prompt 2 (Core feature):
> "Build the [core feature name] — it should [behavior]. The data model is [description]. Keep it simple — this is a prototype."

Prompt 3 (UI/UX):
> "Style this for [ICP context — e.g., enterprise SaaS, clean and minimal]. Add [specific UI elements]."

Produce a prompting guide with 5-8 prompts that will build the prototype when used in Claude Code / Cursor. Save to `{output_folder}/{venture_name}/prototype/build-guide.md`.

---

## 3.4 Checkpoint

**GUIDED MODE:** Review prototype specification. Ask: "Does this capture the core value prop? Is there anything critical that's not in scope that we need for testing?"

**YOLO MODE:** Proceed to Step 4 with prototype specification in hand.

---

## Step 3 Outputs
- `prototype/wireframes.md` (lo-fi specification + flow)
- `prototype/build-guide.md` (vibe code prompting guide)
- Prototype built and ready for testing (via Claude Code / Cursor)
