# TASK P3-02 - build kernel/charts.js  (target v1.0.0)
PRODUCES: kernel/charts.js   SIZE CEILING: 50 KB
ATTACH: CONTRACT.md, SCHEMA.md, this card.   PROMPT: BUILD

## SPEC
Define window.GRC.chartsExt = { bar, line, donut, heatmap }; core.js v2
merges chartsExt into ctx.charts at boot. Every function returns an <svg>
element (viewBox-based, width 100%, height per cfg, default 220), pure SVG,
no animation, colors from the design tokens (read getComputedStyle of
document.documentElement once, cache). Every mark gets a <title> child so
hover shows the value. Axis text 11px, muted color. All charts must render
sanely with 0, 1, or many points.
- bar({items:[{label,value,color?}], horizontal?, height, valueFmt?}):
  auto scale, gridlines at nice steps, value labels at bar ends; horizontal
  mode for top-N lists (labels left, bars right).
- line({series:[{label, points:[{x,y}]}], height, yFmt?, xLabels?}): x is an
  index or "YYYY-MM" string (spread evenly, label every 3rd); one color per
  series from a fixed 4-color ramp of the tokens; small legend row above.
- donut({items:[{label,value,color?}], centerLabel?}): ring with center
  total or centerLabel; legend to the right with values.
- heatmap({size (default 5), cells:{"L-I":count}, onCell?, xLabel, yLabel}):
  grid of size x size; x = impact 1..size left-to-right, y = likelihood
  1..size bottom-to-top; cell background from the band of (L*I) per
  SCHEMA.md (Low ok-tint, Moderate info-tint, High warn-tint, Critical
  bad-tint), count centered, zero cells faint; onCell(L,I) click handler;
  axis labels.

## ACCEPTANCE
1. Add the script tag (after ui.js). Page boots clean.
2. Console test renders into the hello page:
   document.getElementById("outlet").appendChild(GRC.chartsExt.heatmap(
   {cells:{"5-5":3,"1-1":9,"3-4":2}}))
   shows a 5x5 grid with 3 in the top-right, 9 bottom-left.
3. Same quick test for bar, line, donut with 3 items/points each.
4. Under 50 KB.
