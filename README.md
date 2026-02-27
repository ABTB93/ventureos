# VentureOS

**Your AI co-founder. From raw idea to investor-ready pitch — step by step.**

VentureOS gives you a team of AI specialists that guide you through building a startup: researching the market, finding real customer problems, designing your solution, stress-testing your business model, and preparing your pitch. It follows a proven 12-week process so nothing gets skipped.

---

## What you need before starting

**1. Node.js** (a small program that runs VentureOS)
- Check if you already have it: open your terminal and type `node --version`
- If you see a number like `v20.x.x` you're good
- If not, download it free at [nodejs.org](https://nodejs.org) → click the big green "LTS" button → install it like any app

**2. An AI tool** — pick whichever you have:

| You have this | You need |
|---|---|
| Cursor, Windsurf, or Antigravity | Nothing else — they include AI |
| Claude Code | Nothing else — it includes AI |
| None of the above | An API key (explained below) |

> **Don't have any of these?** Antigravity is free and takes 2 minutes to install: [antigravity.google](https://antigravity.google)

---

## Get started

Open your terminal, create a folder for your project, and run one command:

```bash
mkdir my-venture
cd my-venture
npx ventureos
```

That's it. VentureOS will detect what AI tools you have, ask you a few quick questions, and tell you exactly how to start.

> **What's a terminal?**
> On Mac: press `Cmd + Space`, type "Terminal", press Enter.
> On Windows: press the Windows key, type "cmd", press Enter.

---

## What happens when you run it

**VentureOS scans your computer** and finds any AI tools you already have.

**Then it routes you to the best experience:**

### If you have Cursor, Windsurf, Antigravity, or Claude Code

VentureOS installs itself and gives you one line to type in your AI tool:

```
@ventureOS/venture-master.md
```

Type that in your AI chat panel and Victor — your AI co-founder — introduces himself and takes it from there. No API keys. No extra setup.

### If you have an API key

VentureOS asks which service (Claude, ChatGPT, or Gemini), walks you through entering your key, and launches the chat for you directly in the terminal.

**No key yet?** VentureOS will show you a link to get one. If you get stuck, it never just crashes — it always gives you options.

---

## Keeping VentureOS up to date

Already using VentureOS on a project? Run this from your project folder to get the latest version:

```bash
npx ventureos update
```

**What gets updated:**
- Victor (the orchestrator)
- All specialist agents
- All workflows, templates, and scoring files

**What is never touched:**
- `ventureOS/config.yaml` — your settings
- `ventureOS/_memory/` — your venture state and progress
- `_ventures/` — all your documents and outputs

You can update at any time without losing any work.

## Changing your settings

```bash
npx ventureos config
```

Change your name, research depth, execution mode, or AI provider anytime — without starting over.

---

## Meet Victor and your AI team

When you start a session, **Victor** greets you. He's the orchestrator — think of him as your main point of contact. He knows where you are in the journey, what's been done, and what comes next.

When you need deep specialist work, Victor brings in the right expert:

| Specialist | What they do |
|---|---|
| **Researcher** | Researches your market — competitors, trends, opportunities |
| **Discovery** | Helps you find and validate real customer pain |
| **Product** | Designs your product wedge and early solution |
| **Business** | Builds your business model and revenue logic |
| **Finance** | Sizes the market and builds your financial model |
| **NVB** | The New Venture Board — evaluates the venture at Week 8 and Week 12, challenges every assumption, issues GO / PIVOT / KILL |
| **Pitch** | Creates your pitch deck and investor narrative |
| **Growth** | Builds your go-to-market and growth strategy |
| **Ops** | Sets up your team structure and operations |
| **Designer** | Generates board-quality HTML slide decks for PDF export |

You talk to Victor. He calls in the right specialist at the right time.

---

## The journey (12 weeks)

VentureOS follows a structured process so you always know where you are and what's next.

```
      Week 1           Weeks 2–4         Weeks 5–8          Weeks 8–12
  ───────────────   ───────────────   ───────────────   ──────────────────
  Setup the team    Find customer     Design your       Build the business
  Understand    →   pain          →   solution      →   Financials, GTM,
  the market                              ↓             Prototype
                                      CHECK-IN              ↓
                                       Week 8           FINAL PITCH
                                    (Go/Pivot/Kill)       Week 12
                                                       (Go/Pivot/Kill)
```

> 💡 **No customers to interview yet? No problem.**
> Discovery — your customer discovery specialist — can simulate realistic interviews right now based on your market research. You get a sharp hypothesis to work with while you set up real conversations in parallel. Just tell her "simulate interviews" when you start Phase 2.

At each phase, VentureOS generates documents for you — market maps, interview guides, business model canvases, pitch decks — so you never start from a blank page.

Everything is saved automatically. Come back tomorrow and Victor picks up exactly where you left off.

---

## Three ways to work

**Guided mode** (default) — Victor pauses after each step, shows you the output, and asks for your approval before moving on. Best for real ventures where decisions matter.

**Yolo mode** — Victor runs the full phase on its own and shows you everything at the end. Best when you want to move fast without stopping at every checkpoint.

**Autopilot** — Type `AP` and Victor runs the entire 12-week journey in one go: market research, synthetic customer interviews, solution design, business case, board evaluation, and a full pitch deck. No input needed. You get a complete `venture-scan-report.md` at the end — a single document covering every phase, clearly marked as AI-generated, with a prioritised list of what to validate with real customers first.

> Use Autopilot to quickly stress-test an idea before committing to a full run. Estimated cost: ~$5–7 on Claude Opus.

---

## Your outputs

Everything VentureOS creates is saved as readable files in `_ventures/your-venture-name/`:

- Market research and competitive analysis
- Customer interview scripts and synthesis
- Problem and solution definition documents
- Business model canvas
- Financial model
- Go-to-market plan
- Check-in pitch, incubation pitch, and final investor pitch deck
- HTML slide deck (open in browser → print to PDF)

If you pivot or decide to stop, VentureOS archives everything and documents the decision with full rationale — so the work is never lost.

---

## Common questions

**Do I need to know how to code?**
No. You type in plain English. VentureOS handles everything else.

**What's an API key?**
It's like a password that gives you access to an AI service (like ChatGPT or Claude). If you use Cursor, Windsurf, or Antigravity, you don't need one — they include AI access in their apps.

**Does it save my work?**
Yes. Every session is saved automatically. Start and stop whenever you like.

**Can I use it for multiple ideas?**
Yes. Run `npx ventureos config` to switch ventures or start a new one.

**What if something goes wrong?**
VentureOS never just crashes. If there's a problem (wrong key, no connection, etc.), it shows you your options and waits for you to decide what to do next.

---

## Need help?

Open an issue on GitHub: [github.com/ABTB93/ventureos/issues](https://github.com/ABTB93/ventureos/issues)
