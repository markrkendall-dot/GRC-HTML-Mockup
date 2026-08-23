# TASK P3-01 - build kernel/ui.js  (target v1.0.0)
PRODUCES: kernel/ui.js   SIZE CEILING: 60 KB
ATTACH: CONTRACT.md, SCHEMA.md, this card.   PROMPT: BUILD

## SPEC
Assign window.GRC.uiExt = { table, card, kpi, badge, drawer, tabs, toolbar,
select, searchBox, empty, toast, css }. Do NOT touch core.js: core.js v2
already merges every GRC.uiExt key into ctx.ui at boot.
All builders return a DOM element, use only the contract's CSS classes, and
take the cfg shapes named in the contract:
- table({cols, rows, onRow, page, empty}): cols = [{key, label, render?,
  sort?}] (render(record) -> string|Node; sort true enables click-to-sort
  on the header, toggling asc/desc); pagination with page size (default 25),
  Prev/Next and "x-y of n"; empty message when no rows; onRow(record) makes
  rows clickable (pointer cursor).
- card({title, body, actions}): body string|Node|array; actions = array of
  Nodes right-aligned in the header.
- kpi({label, value, sub, kind}): big number tile; kind tints the value
  (ok/warn/bad/info or none).
- badge(text, kind) -> span.g-badge.g-badge--<kind>.
- drawer({title, body}): opens a right-side overlay (60% width, max 720px)
  with a close X and backdrop click-to-close; returns {close}.
- tabs({items:[{id,label,render}]}): render(container) called lazily on
  first activation; remembers active tab per page render.
- toolbar(children), select({label, options, value, onchange}) where options
  = [{value,label}] or plain strings, searchBox({value, oninput,
  placeholder}) debounced 200ms, empty(msg), toast(msg) bottom-right 2.5s.
- css(moduleId, cssText): inject once per moduleId (style tag id
  "g-css-<moduleId>"); ignore repeat calls with the same id.

## ACCEPTANCE
1. Add the script tag (after core.js). Page still boots clean.
2. Console: t=GRC.uiExt.toast("hi") shows and fades; d=GRC.uiExt.drawer(
   {title:"T",body:"b"}) opens and closes.
3. Hello module unchanged and working (it only uses el()).
4. Under 60 KB.
