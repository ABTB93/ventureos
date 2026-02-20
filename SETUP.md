# VentureOS Setup Guide

## Step 1 — Configure VentureOS

Open `ventureOS/config.yaml` and fill in your details:

```yaml
user_name: "Your Name"          # How agents will address you
venture_name: ""                # Leave blank to start a new venture
communication_language: "English"
output_folder: "_ventures"      # Where outputs are saved
research_depth: "standard"      # light | standard | deep
llm: "claude-code"              # claude-code | cursor | windsurf | other
default_mode: "guided"          # guided | yolo
```

**That is the only file you need to edit before your first session.**

---

## Step 2 — Load VentureOS (by tool)

### Claude Code

```bash
# From your project root, load the orchestrator:
claude venture-master.md
```

Or reference it in a conversation:
```
@ventureOS/venture-master.md
```

To load a specialist agent directly:
```
@ventureOS/agents/domain-explorer.md
```

### Cursor

In the chat panel, attach the file:
- Click the paperclip icon → select `ventureOS/venture-master.md`

Or type in chat:
```
Load @ventureOS/venture-master.md and activate Victor.
```

To load a specialist directly:
```
Load @ventureOS/agents/customer-discovery.md and activate Clara.
```

### Windsurf

In the Cascade panel:
```
Load the file ventureOS/venture-master.md and follow the activation instructions.
```

To load a specialist:
```
Load ventureOS/agents/domain-explorer.md and follow the activation instructions.
```

### Other AI Tools (ChatGPT, Gemini, etc.)

1. Open `ventureOS/venture-master.md` in a text editor
2. Copy the full file contents
3. Paste into a new conversation as the first message
4. The agent will activate and guide you from there

For specialist agents: copy the contents of the relevant file in `ventureOS/agents/` and paste to activate.

---

## Step 3 — First Session

When you load `venture-master.md`, Victor (the orchestrator) will:

1. Read your `config.yaml`
2. Load venture state from `_memory/venture-state.yaml`
3. Greet you and display the venture status banner
4. Show the phase-aware menu
5. Wait for your input

**If this is your first venture**, type `NV` (New Venture) and Victor will guide you through setup.

**If you have an existing venture**, Victor will pick up where you left off based on the saved state.

---

## Step 4 — Understanding the Menu

Victor's main menu:

| Command | Description |
|---------|-------------|
| `VS` | Venture Status — current phase, answered questions, artifacts |
| `NV` | New Venture — start a new venture (domain or idea entry) |
| `EX` | Explore Domain — opportunity discovery (pre-incubation) |
| `ST` | Setup the Team — team charter, parent org alignment (Phase 1) |
| `UM` | Understand the Market — competitive landscape, sizing (Phase 2) |
| `FP` | Find Customer Pain — discovery, synthesis, journey map (Phase 3) |
| `DS` | Define the Solution — wedge design, prototyping (Phase 4) |
| `BC` | Build Business Case — risks, experiment plan, check-in pitch (Phase 5) |
| `DB` | Design the Business — business model, GTM, final pitch (Phase 6) |
| `NVB` | Board Feedback — on-demand synthetic venture board feedback |
| `AG` | Agents — view all specialists and how to activate them |
| `CH` | Chat — free discussion with Victor |
| `DA` | Dismiss Agent |

You can type the command code (e.g., `FP`) or a natural language match (e.g., "customer pain", "find pain", "interviews").

---

## Step 5 — Loading Specialist Agents

When Victor routes you to a specialist, he will tell you which agent to load and how (based on your `llm` setting in `config.yaml`).

You can also load specialists directly at any time:

| Specialist | File |
|-----------|------|
| Victor (Orchestrator) | `ventureOS/venture-master.md` |
| Diana (Market Research) | `ventureOS/agents/domain-explorer.md` |
| Clara (Customer Discovery) | `ventureOS/agents/customer-discovery.md` |
| Paulo (Product Strategy) | `ventureOS/agents/product-strategist.md` |
| Bernard (Business Model) | `ventureOS/agents/business-architect.md` |
| Fiona (Financial Analysis) | `ventureOS/agents/financial-analyst.md` |
| Eva (Venture Board) | `ventureOS/agents/venture-evaluator.md` |
| Petra (Pitch Creation) | `ventureOS/agents/pitch-master.md` |
| Grace (GTM & Growth) | `ventureOS/agents/growth-strategist.md` |
| Olivia (Team & Ops) | `ventureOS/agents/venture-ops.md` |

---

## Output Files

All VentureOS outputs are saved to:
```
_ventures/{venture_name}/
```

Example output structure after a full incubation run:
```
_ventures/my-venture/
├── venture-canvas.md
├── team-charter.md
├── mothership-asset-map.md
├── market-sizing.md
├── competitive-analysis.md
├── interview-scripts/
├── interview-synthesis.md
├── pain-atomization.md
├── pain-journey-map.md
├── icp-profile.md
├── wedge-definition.md
├── value-proposition.md
├── solution-feasibility.md
├── business-model-canvas.md
├── financial-model.md
├── gtm-plan.md
├── experiment-plan.md
├── pitch/
│   ├── checkin-pitch.md
│   ├── pitch-deck.md
│   └── excalidraw-frames.md
└── pivots/              ← only if pivot was triggered
    └── pivot-1/
```

---

## Tips

**Guided vs Yolo mode**
- Guided: agent pauses at each step for your review. Best for real ventures.
- Yolo: agent runs everything and presents all outputs at once. Best for rapid screening of multiple ideas.

**Resuming a session**
- VentureOS saves state to `ventureOS/_memory/venture-state.yaml` after each step.
- Load `venture-master.md` at the start of any session — Victor reads the state and picks up where you left off.

**Multiple ventures**
- Change `venture_name` in `config.yaml` to switch between ventures.
- Each venture's state is tracked separately in `venture-state.yaml`.

**Research depth**
- `light` — high-level overview, fast. Good for early screening.
- `standard` — structured analysis with sourced data. Recommended for real incubation.
- `deep` — exhaustive multi-source research with cross-validation. Best for high-stakes decisions.
