# TASK P1-03 - build modules/hello.js AND data/sample.js
PRODUCES: TWO files, each in its own fenced code block, clearly labeled with
its path. (This card overrides the one-file contract rule.)
SIZE CEILING: 20 KB each.
ATTACH THIS SESSION: CONTRACT.md, SCHEMA.md, this card.   PROMPT: BUILD
(adjust the prompt's "single file" wording to "the two files")

## SPEC - data/sample.js (target v1.0.0)
- Sets window.GRC_DATA.orgUnits = { version:"sample", rows:[...] } with 5
  org units (1 enterprise, 2 divisions, 2 departments, correct parentIds).
- Sets window.GRC_DATA.risks = { version:"sample", rows:[...] } with 12
  schema-correct risks spread across those org units, varied statuses and
  scores, empty controlIds arrays. Follow SCHEMA.md field names exactly.
- This stub is REPLACED in Phase 2. Keep it small and boring.

## SPEC - modules/hello.js (target v1.0.0)
- GRC.register id "hello", title "Hello Check", order 999, version "1.0.0".
- Route "hello": a g-card headed "Wiring check", a line showing the current
  org-unit filter value and the count of risks in ctx.data.risks.list(),
  then a plain g-table of those risks (id, title, status, residual score via
  ctx.fmt) built with ctx.ui.el. Each row: onclick ctx.go("hello/"+id).
- Route "hello/:id": a g-card listing every field of the record verbatim,
  plus a g-btn "Back" that calls ctx.go("hello").

## ACCEPTANCE - this is the Phase 1 CANARY; all must pass
1. Save both files, refresh: nav shows "Hello Check", table renders 12 rows.
2. Clicking a row opens the detail; Back returns; browser Back button also
   works (hash routing).
3. Org-unit select filters the table; "All org units" restores it.
4. Preflight is green: no errors listed, both data entities counted.
5. Edit data/sample.js in Notepad (change one risk title), save, refresh:
   the change appears. This proves the whole edit loop.
