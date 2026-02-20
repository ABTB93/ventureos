# Customer Pain Discovery Workflow
<!-- Phase 3: Find Customer Pain — Weeks 2-7 -->
<!-- Agent: Customer Discovery Specialist -->
<!-- Step-file architecture: 5 sequential steps with checkpoints -->

## Overview

This is the most critical phase of incubation. The goal is to validate that a real, significant, and prevalent customer pain exists that can support a business. This workflow runs across Weeks 2-7, overlapping with Phase 2 (domain) and Phase 4 (solution).

**Three discovery modes** — select at the start:
- **[T] Toolkit:** Agent creates scripts. User runs real interviews. Agent synthesizes notes.
- **[S] Simulation:** AI generates synthetic customer/expert personas and simulates interviews. Clearly labeled SIMULATED.
- **[I] Integration:** Import data from Listen Labs, Maze, UserTesting, or any structured export.

Modes can be combined (e.g., run real interviews AND run synthetic simulations to fill gaps).

**Execution mode:**
- **Guided:** Pause and review at every template-output checkpoint
- **Yolo:** Run all 5 steps autonomously, present all outputs at the end

---

## Pre-flight Check

Before starting, the agent should:
1. Load `{project-root}/ventureOS/config.yaml`
2. Load `{project-root}/ventureOS/_memory/venture-sidecar/venture-state.yaml`
3. Load `pain-hypothesis.md` if it exists (from Phase 2)
4. Load `stakeholder-map.md` if it exists (from Phase 2)
5. Load `{project-root}/ventureOS/data/scoring/pain-scoring.yaml` (FIP framework)
6. Confirm: discovery mode (T/S/I) and execution mode (Guided/Yolo)

---

## Step 1: Pain Hypothesis and Interview Preparation
**File:** `{project-root}/ventureOS/workflows/3-find-pain/customer-pain-discovery/step-1-pain-hypothesis.md`

---

## Step 2: Interviews (Real, Synthetic, or Imported)
**File:** `{project-root}/ventureOS/workflows/3-find-pain/customer-pain-discovery/step-2-interviews.md`

---

## Step 3: Synthesis (Run after each interview batch)
**File:** `{project-root}/ventureOS/workflows/3-find-pain/customer-pain-discovery/step-3-synthesis.md`

---

## Step 4: Pain Atomization and Scoring
**File:** `{project-root}/ventureOS/workflows/3-find-pain/customer-pain-discovery/step-4-pain-atomization.md`

---

## Step 5: Pain Journey Map and ICP
**File:** `{project-root}/ventureOS/workflows/3-find-pain/customer-pain-discovery/step-5-pain-journey-map.md`

---

## Completion Criteria

Phase 3 is complete when ALL of the following guiding questions are answered with evidence:
- [ ] What do people need? (primary pain identified)
- [ ] Can the team prioritize the most important pain to solve?
- [ ] Is the pain frequent, intense, and/or prevalent enough to support a business? (FIP ≥ 3.0 average)
- [ ] Has the team validated the pain exists? (minimum 10 interviews recommended)
- [ ] Can they identify their ideal customer? (ICP defined)
- [ ] Does the team understand who the buyer is? (buyer vs. user mapped)

---

## Key Outputs

| Artifact | File | Status |
|---------|------|--------|
| Interview scripts | `interviews/scripts/` | |
| Interview notes | `interviews/notes/` | |
| Interview synthesis | `interview-synthesis.md` | |
| Pain atomization matrix | `pain-atomization.md` | |
| Pain scores (FIP) | _(in pain-atomization.md)_ | |
| Customer pain journey map | `pain-journey-map.md` | |
| ICP profile | `icp-profile.md` | |
