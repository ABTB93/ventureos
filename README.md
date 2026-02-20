# VentureOS

**A multi-agent AI framework for structured venture building.**

VentureOS guides teams from a raw domain or idea all the way to an investor-ready pitch — through a structured 12-week incubation process powered by specialized AI agents.

---

## Install

```bash
npx ventureos install
```

The installer asks 5 questions (your name, AI tool, language, research depth, execution mode), then sets up the full framework in your project in under 30 seconds.

**Requirements:** Node.js 18+

**Works with:** Claude Code, Cursor, Windsurf, and any other AI coding tool.

---

## What VentureOS Does

- Tracks where your venture is in the incubation journey
- Routes you to the right specialist agent for each phase
- Generates first drafts of every deliverable so you never start from a blank page
- Enforces evidence-based progression: guiding questions must be answered before advancing
- Manages two decision gates where ventures are evaluated for continuation, pivot, or kill

---

## How It Works

VentureOS is a collection of AI agent files and workflow files that you load into your preferred AI coding assistant. The agents collaborate through a shared venture state file to guide you through the full incubation lifecycle.

**Entry points:**
- **Domain exploration** — You have a domain (e.g., "energy management"). VentureOS maps the opportunity landscape first, then moves into incubation.
- **Idea development** — You have a specific idea. VentureOS jumps directly into incubation.

**Final output:** Investor-ready pitch deck (Markdown + Excalidraw) or a documented pivot/kill decision with full rationale and archived artifacts.

---

## The Incubation Journey (12 Weeks)

```
Week 1          Weeks 2-3           Weeks 4-7              Weeks 10-12
┌──────────┐   ┌──────────────┐   ┌────────────────────┐  ┌──────────────────┐
│ SETUP    │   │ UNDERSTAND   │   │ DEFINE SOLUTION    │  │ DESIGN BUSINESS  │
│ THE TEAM │   │ THE MARKET   │   │                    │  │                  │
└──────────┘   │              │   │                    │  │                  │
               │ FIND         │   │ BUILD INITIAL      │  │                  │
               │ CUSTOMER     │──▶│ BUSINESS CASE      │──▶│                  │
               │ PAIN         │   │                    │  │                  │
               └──────────────┘   └──────┬─────────────┘  └────────┬─────────┘
                                         │                          │
                                    CHECK-IN PITCH             FINAL PITCH
                                    to Venture Board           to Venture Board
                                    (Go/Pivot/Kill)            (Go/Pivot/Kill)
```

---

## The Agents

| Agent | Name | Role |
|-------|------|------|
| `venture-master.md` | Victor | Orchestrator — load this first |
| `agents/domain-explorer.md` | Diana | Market & domain research |
| `agents/customer-discovery.md` | Clara | Customer pain & interviews |
| `agents/product-strategist.md` | Paulo | Wedge design & prototyping |
| `agents/business-architect.md` | Bernard | Business model & revenue |
| `agents/financial-analyst.md` | Fiona | Market sizing & financial modeling |
| `agents/venture-evaluator.md` | Eva | Venture Board gate evaluation |
| `agents/pitch-master.md` | Petra | Pitch deck creation |
| `agents/growth-strategist.md` | Grace | GTM & market experiments |
| `agents/venture-ops.md` | Olivia | Team setup & parent org alignment |

---

## Directory Structure

```
ventureOS/
├── venture-master.md          ← START HERE — load this file first
├── workflow-engine.md         ← Workflow execution engine
├── config.yaml                ← Your configuration (edit before first use)
├── README.md                  ← This file
├── SETUP.md                   ← Installation guide
├── agents/                    ← Specialist agents (loaded on demand)
│   ├── domain-explorer.md
│   ├── customer-discovery.md
│   ├── product-strategist.md
│   ├── business-architect.md
│   ├── financial-analyst.md
│   ├── venture-evaluator.md
│   ├── pitch-master.md
│   ├── growth-strategist.md
│   └── venture-ops.md
├── workflows/                 ← Phase-specific workflow definitions
│   ├── 0-explore/
│   ├── 1-setup-team/
│   ├── 2-understand-market/
│   ├── 3-find-pain/
│   ├── 4-define-solution/
│   ├── 5-business-case/
│   ├── 6-design-business/
│   └── venture-status/
├── templates/                 ← Output document templates (30+)
├── scoring/                   ← Gate rubric, pain scoring, pivot triggers
├── techniques/                ← Brainstorming techniques, synthetic tools
└── _memory/
    └── venture-state.yaml     ← Active venture state (auto-managed)
```

Outputs are saved to: `_ventures/{venture_name}/`

---

## Quick Start

1. Edit `ventureOS/config.yaml` — add your name, venture name, preferred language
2. Load `ventureOS/venture-master.md` into your AI tool (see `SETUP.md` for your specific tool)
3. Victor greets you, shows the phase-aware menu, and asks what you want to work on
4. Type a command or number — Victor routes you to the right agent and workflow

See `SETUP.md` for detailed installation instructions for Claude Code, Cursor, Windsurf, and other tools.

---

## Two Execution Modes

**Guided mode (default):** The agent pauses at each checkpoint, shows you the output, and waits for your approval before proceeding. Best for real ventures where strategic decisions matter.

**Yolo mode:** The agent runs the full workflow autonomously and presents all outputs at the end for batch review. Best for rapid idea screening.

Set your preferred default in `config.yaml` or switch modes per workflow.

---

## Pivot & Kill Mechanism

VentureOS tracks every pivot and kill decision:

- **Pivot:** Archives current artifacts, classifies pivot type (customer/problem/solution/model/market), identifies re-entry phase, preserves relevant work
- **Kill:** Documents learnings, archives all artifacts, marks venture as killed with full rationale

Pivot history is preserved in `ventureOS/_memory/venture-state.yaml`.
