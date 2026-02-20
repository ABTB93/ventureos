# Step 2: Conduct Interviews
<!-- Phase 3, Step 2 — Weeks 3-5 -->
<!-- Agent: Customer Discovery Specialist -->

## Objective
Gather raw interview data using the selected mode: Toolkit (real interviews), Simulation (AI-generated), or Integration (external platform import). Process runs iteratively — run Step 3 (Synthesis) after each batch of 5-10 interviews.

---

## Mode: [T] Toolkit — Real Interview Support

### 2T.1 Before Each Interview
Agent provides:
- Interview script reminder (load from `interview-scripts/`)
- Reminder of key pain hypotheses to probe
- Top 3 things to listen for
- "Listen for 'yeah but...' moments — that's where the real pain lives"

### 2T.2 Capturing Interview Notes
After each interview, user pastes notes or bullet points. Agent:
1. Structures notes into the post-interview template from `interview-script.md`
2. Flags: any FIP signals, surprising moments, hypothesis confirmations/contradictions
3. Assigns preliminary FIP scores for this interview
4. Identifies any follow-up questions for next interviews

Save each interview: `{output_folder}/{venture_name}/interviews/notes/interview-{N}.md`

### 2T.3 Batch Trigger
After every 5-10 interviews: prompt user to proceed to Step 3 (Synthesis) before continuing.

---

## Mode: [S] Simulation — Synthetic Interviews

⚠️ **ALL output from this mode is AI-generated. Label every output: "SIMULATED — Not real customer data. Treat as hypothesis validation only."**

### 2S.1 Generate Customer Personas

Using the ICP hypothesis and domain research:
1. Generate 4-6 distinct customer personas representing the ICP
2. Vary across: role, company size, industry vertical, level of pain, context
3. Each persona: name, role, company context, day-in-the-life, technology stack, reporting structure

### 2S.2 Simulate Pain-Point Interviews

For each persona, simulate a 30-minute pain-point interview:
1. Run the persona through the pain-point interview script
2. Generate realistic responses: how they experience the pain, frequency, intensity, workarounds
3. Include: moments of surprise, resistance, and genuine pain signal
4. Vary responses — not all personas should validate the hypothesis identically
5. Include representative quotes that feel authentic to the persona

Save: `{output_folder}/{venture_name}/interviews/synthetic/synthetic-interviews.md`

### 2S.3 Simulate Expert Interviews

Generate 2 domain expert personas (consultant, industry analyst, ex-practitioner):
1. Run expert interview script
2. Simulate responses about: pain prevalence across the market, what companies typically do, where the biggest gaps are
3. Label all output: "⚠️ SIMULATED EXPERT — AI-generated"

Save: `{output_folder}/{venture_name}/interviews/synthetic/synthetic-expert-interviews.md`

Proceed to Step 3 after simulation.

---

## Mode: [I] Integration — Import External Data

### 2I.1 Accept Import

Ask user for the data source format:
- Listen Labs export (JSON/CSV)
- Maze export
- UserTesting export
- Other structured format (CSV, JSON, paste)

Accept the data.

### 2I.2 Normalize to VB Format

Parse and normalize the imported data:
1. Extract: participant profiles, questions asked, responses given
2. Map to VB interview structure: context, pain signals, FIP indicators, quotes
3. Flag: any data that cannot be mapped (incomplete responses, missing context)

### 2I.3 Create Normalized Interview Records

For each imported interview/session:
- Save normalized record: `{output_folder}/{venture_name}/interviews/imported/interview-{N}.md`

Proceed to Step 3.

---

## Step 2 Outputs

| Output | Location |
|--------|----------|
| Interview notes (Toolkit) | `interviews/notes/` |
| Synthetic interviews (Simulation) | `interviews/synthetic/` |
| Normalized imports (Integration) | `interviews/imported/` |

**→ After every 5-10 interviews: proceed to Step 3 (Synthesis)**
