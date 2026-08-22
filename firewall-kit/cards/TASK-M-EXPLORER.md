# TASK M-EXPLORER - build modules/explorer.js  (target v1.0.0)
PRODUCES: modules/explorer.js   SIZE CEILING: 65 KB
ATTACH: CONTRACT.md, SCHEMA.md, this card.   PROMPT: BUILD

## SPEC
The relationship explorer - the reason the demo carries real data.
GRC.register id "explorer", title "Explorer", order 90.
ROUTE "explorer": a large searchBox (pre-filled from state "search" - the
top-bar search lands here). Live results grouped by entity (max 8 per
group): label = id + title/name, a small entity pill, buttons "Open"
(entity's detail route when registered) and "Map" -> "explorer/<id>".
Empty query: a short explainer card plus three example searches as g-pills
(clicking runs them).
ROUTE "explorer/:id": the graph. Resolve the id's entity by prefix
(RSK/CTL/POL/ISS/REQ/FRW/ASM/ORG). Render an SVG (full width, height
560): focus node center; ring 1 = direct links via ctx.data.links across
every relationship in SCHEMA.md; ring 2 = links of ring-1 nodes, capped at
40 total nodes (say "+n more" as a muted note when capped). Nodes:
rounded rects, entity-colored border (fixed per-entity color set from the
tokens), id + truncated title, positioned by simple polar layout (no
physics). Edges: lines with a subtle relationship label at midpoint
(controls / requirements / issues / policies / org). Node click ->
refocus "explorer/<that id>"; a "Open record" g-btn under the graph for
the focused record; a Back g-btn using history.back(). Legend row of
entity colors. Beneath the graph: a plain list of ring-1 records grouped
by entity (accessible fallback and stakeholder printout).

## ACCEPTANCE
1. Top-bar search from any page lands here with results.
2. Map of a risk shows its controls, issues, org unit; second ring shows
   requirements and policies through the controls; cap note appears on a
   heavily connected node.
3. Clicking any node refocuses; Open record navigates to the module.
4. A node with no links renders focus-only with the empty note.
5. Under 65 KB; script tag added.
