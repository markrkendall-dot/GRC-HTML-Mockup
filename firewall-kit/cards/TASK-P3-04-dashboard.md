# TASK P3-04 - build modules/dashboard.js  (target v1.0.0)
PRODUCES: modules/dashboard.js   SIZE CEILING: 60 KB
ATTACH: CONTRACT.md, SCHEMA.md, this card.   PROMPT: BUILD

## SPEC
GRC.register id "dashboard", title "Dashboard", order 10. One route,
"dashboard". Everything reads ctx.data.metrics() and list()s so the global
org filter applies (trend chart excluded - label it "(all org units)").
Layout top to bottom:
1. KPI row (5 tiles): Open risks; High/Critical residual (kind warn, bad if
   any Critical exists); Overdue issues (bad if > 0); Control effectiveness
   pct; Avg policy attestation pct.
2. Split row: LEFT a g-card "Residual risk heatmap" using ctx.charts.heatmap
   of open risks by residualL/residualI; onCell -> if a "risks" module is
   registered, set state and go to it (state key "riskCell" = "L-I"), else
   ctx.ui.toast("Risk register arrives in a later phase"). RIGHT a g-card
   "Trend" with ctx.charts.line: series openRisks and overdueIssues from
   trend rows, plus a second small line chart beneath for
   controlEffectivePct.
3. Split row: LEFT "Top open risks" - horizontal bar of the 10 highest
   residual-score open risks (label = id + short title), clicking a bar ->
   "risks/<id>" if that module exists. RIGHT "Framework coverage" - one
   donut per framework: covered / partial / uncovered requirement counts,
   center label = coveragePct.
4. Footer line, muted: "Demo data - <total record count> records - generated
   <today>".
Handle empty data with ctx.ui.empty everywhere (never a blank card).

## ACCEPTANCE
1. Add script tag. Dashboard appears first in nav (order 10) and renders
   all sections with the synthetic data, no console errors.
2. KPI numbers reconcile with Preflight counts (spot-check openRisks).
3. Org filter changes every number except the trend card.
4. Heatmap cell click shows the toast (until the risks module exists).
5. Under 60 KB.
