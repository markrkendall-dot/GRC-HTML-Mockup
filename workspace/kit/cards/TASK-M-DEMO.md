# TASK M-DEMO - build modules/demo.js  (target v1.0.0)
PRODUCES: modules/demo.js   SIZE CEILING: 40 KB
ATTACH: CONTRACT.md, SCHEMA.md, this card.   PROMPT: BUILD

## BEFORE THE SESSION - fill these from your data (Worksheet W7)
Featured risk id: RSK-______   Its weak control: CTL-______
Framework with a gap: FRW-__   Overdue issue: ISS-______
Write them into the SPEC lines below (replace the placeholders) before
attaching this card. With synthetic data, any well-connected ids work -
find good ones in the Explorer.

## SPEC
GRC.register id "demo", title "Present", order 100.
ROUTE "demo": a g-card explaining demo mode, a table of the scenes
(number, title, route), and a g-btn--primary "Start presentation" that
calls GRC.tour(SCENES). Below, a muted note on how to edit scenes (they
live in this file as the SCENES array at the top, clearly commented).
SCENES - a const array at the top of the file, exactly these 8, each
{route, state, title, text} with speaker-note text 2-3 sentences,
plain-spoken, no jargon:
1. "dashboard" - Where we stand: the posture at a glance.
2. "dashboard" - Concentration: point at the heatmap's hot corner.
3. "risks/RSK-____" - One risk's story: scores, treatment, and everything
   it touches.
4. "controls/CTL-____" - The weak point: a control that is not doing its
   job, and what depends on it.
5. "compliance/FRW-__" - What that does to our framework story: the gap
   is visible, not anecdotal.
6. "issues/ISS-____" - The overdue fix: ownership, aging, and the paper
   trail.
7. "approvals" - How work moves: act on a queue item live (state
   {role:"Department Head"}).
8. "explorer/RSK-____" - Why one platform: every relationship on one
   screen. Close: this is what the real system gives us every day.

## ACCEPTANCE
1. Start presentation walks all 8 scenes; Prev/Next/Exit work; every scene
   lands on a real record (no empty or failed views).
2. Exit restores the org filter to All.
3. Scene 7's queue actually contains items for that role (pick a role with
   work in your data; adjust state in the scene if needed).
4. Under 40 KB; script tag added. This is the last module: the nav order
   now reads Dashboard, Risks, Controls, Compliance, Policies, Issues,
   Assessments, Approvals, Explorer, Present.
