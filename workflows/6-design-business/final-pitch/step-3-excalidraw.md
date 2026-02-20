# Step 3: Excalidraw Visual Frames
<!-- Phase 6, Final Pitch Step 3 -->
<!-- Agent: Pitch Master -->

## Objective
Generate Excalidraw visual frame descriptions for the pitch deck. These are visual representations of key slides — charts, diagrams, maps — that make the pitch visually compelling and easier to understand.

---

## 3.1 Identify Slides Needing Visuals

Review `pitch/pitch-deck.md` and identify which slides would benefit most from visuals:

| Slide | Visual Type | Description |
|-------|------------|-------------|
| Slide 1: Hook | Trend line / dramatic stat | Market growth curve or "then vs now" |
| Slide 2: Problem | Pain journey arc | Customer emotional journey curve |
| Slide 3: Solution | Before/After diagram | Split screen showing transformation |
| Slide 4: Market | Funnel / concentric circles | TAM → SAM → SOM nested circles |
| Slide 5: Product | Screen mockup or flow | Key product screen or 3-step flow |
| Slide 6: Business Model | Revenue stream diagram | Visual BMC or revenue stream map |
| Slide 7: Traction | Conversion funnel | Funnel chart with conversion rates |
| Slide 9: Competitive | 2x2 positioning matrix | Competitor map on two key dimensions |
| Slide 10: Financial | Revenue growth chart | ARR growth bar chart (3 years) |
| Slide 11: Team | Team org + mothership diagram | Team structure with mothership connection |

---

## 3.2 Generate Excalidraw Frame Descriptions

For each priority visual, produce:
1. A text description of what the visual should show
2. The data/content to display
3. The layout / structure
4. Styling guidance (color palette, font style)

**Excalidraw Design Standards:**
- Colors: Use a consistent 2-3 color palette (suggest: brand primary + accent + neutral)
- Typography: Clean, readable labels
- Style: Simple and bold — avoid complexity that distracts
- Each frame should stand alone as a visual

---

## 3.3 Produce Excalidraw Frame Content

For each visual, provide:
- A detailed natural language description that an Excalidraw user can recreate
- Key text labels to include
- Layout coordinates (relative: top-left / center / bottom-right placement)
- Arrow/connector logic (if any)

Example format for each frame:
```
FRAME: Market Opportunity (Slide 4)
Type: Nested circles (TAM → SAM → SOM)
Center circle (largest): TAM = $[X]B — labeled "[Market name]"
Middle circle: SAM = $[X]M — labeled "North America, [segment]"
Inner circle (smallest): SOM = $[X]M — labeled "Year 3 target"
Color: outer = light blue, middle = medium blue, inner = brand color
Label positioning: right of each circle with $ figure
```

---

## 3.4 Investor Q&A Preparation

While building the visual layer, also prepare investor Q&A:

Using the investor-qa.md (from pitch-master.md [QA] menu item), generate the 15 hardest questions:

**Categories:**
- Market skepticism: "Is $[TAM] really addressable for you?"
- Competitive threats: "What stops Google/Salesforce/[big co] from copying this?"
- Unit economics: "When does this become profitable?"
- Team: "Why are YOU the right team for this?"
- Traction: "Why haven't you closed more pilots?"
- Mothership: "What happens if the mothership pulls funding?"

For each question: provide a confident, evidence-backed suggested answer.

Save: `{output_folder}/{venture_name}/pitch/investor-qa.md`

---

## 3.5 Save All Pitch Assets

Save Excalidraw frames: `{output_folder}/{venture_name}/pitch/excalidraw-frames.md`

**Checkpoint:**
**GUIDED MODE:** Review visual frame descriptions with user. Ask: "Are these the right visuals? Any slide you want to visualize differently?"
**YOLO MODE:** Proceed to Step 4.
