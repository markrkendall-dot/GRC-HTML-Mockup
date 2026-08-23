# GRC MOCKUP - BUILD CONTRACT v1.0 (CONTRACT.md)

You are generating exactly ONE complete file for an offline HTML mockup that
runs from a local folder (file://) in Microsoft Edge. Follow every rule below.
If a rule here conflicts with the attached TASK card, the TASK card wins.

## OUTPUT RULES
1. Output the ENTIRE file as ONE fenced code block. After the block, add at
   most 3 short bullet lines summarizing what you built. Nothing else.
2. The first line of every file is a version header:
   - JS/CSS files:  /* GRC <path> v<X.Y.Z> <YYYY-MM-DD> */
   - HTML files:    <!-- GRC <path> v<X.Y.Z> <YYYY-MM-DD> -->  immediately
     after <!DOCTYPE html>
3. Insert a marker comment roughly every 120-160 lines:
   /* ==SECTION:<short-name>== */
4. NO placeholders. Never write "...", "rest unchanged", "add more here",
   "similar to above", or TODO stubs. Every function must be complete.
5. If the file cannot fit in one response: stop cleanly at the END of a
   SECTION, write the single word CONTINUES after the code block, and wait.
   When told to continue, repeat the marker line first, then continue.
6. ASCII only in code: straight quotes ' and ", regular hyphens. Non-ASCII is
   allowed only inside user-visible display strings.
7. Vanilla JavaScript (ES2018 max) and vanilla CSS only. FORBIDDEN: any
   framework or library, CDN links, external URLs, web fonts, fetch(),
   XMLHttpRequest, ES modules (import/export), localStorage, cookies, eval().
8. Stay under the size ceiling stated in the TASK card. If the spec cannot fit
   under the ceiling, say so BEFORE generating and propose a split. Write
   compact, readable code; never minified.
9. Do not invent APIs, CSS classes, routes, entities, or data fields beyond
   those defined in this contract, in SCHEMA.md, and in the TASK card.

## RUNTIME MODEL
index.html loads scripts in this order, then calls GRC.boot():
  kernel/core.js, kernel/ui.js, kernel/charts.js,
  every data/*.js, every modules/*.js
window.GRC is the app kernel. window.GRC_DATA holds raw data. There is no
server, no build step, no network: everything is plain <script src> on file://.

## MODULE API - module files may use ONLY this
GRC.register({ id, title, order, version, routes })
  routes: { "risks": function(el, ctx){...},
            "risks/:id": function(el, ctx, params){...} }
  The kernel calls the route function with an emptied container element `el`.
  Modules must not touch the DOM outside `el` (position:fixed styling is fine).

ctx.data.<entity>.all        array of all records (entities are in SCHEMA.md)
ctx.data.<entity>.list()     records filtered by the global org-unit filter
ctx.data.<entity>.byId(id)   one record or null
ctx.data.links(record, "<entity>")  related records, both directions, per the
                             relationship map in SCHEMA.md (includes two-hop
                             risk->policies and risk->requirements)
ctx.data.metrics()           precomputed KPI object, keys defined in SCHEMA.md
ctx.data.search(q)           [{entity, record, label}] across all entities
ctx.go("route")              navigate, e.g. ctx.go("risks/RSK-0042")
ctx.state.get(k)/set(k,v)/watch(k,fn)   global keys: "orgUnit","role","search"
ctx.ui.el(tag, attrs, children)  DOM builder (class, onclick, any attribute)
ctx.ui.table({cols, rows, onRow, page, empty})   sortable, paged table
ctx.ui.card({title, body, actions})
ctx.ui.kpi({label, value, sub, kind})
ctx.ui.badge(text, kind)     kind: ok | warn | bad | info
ctx.ui.drawer({title, body}) right-side overlay with close button
ctx.ui.tabs({items:[{id, label, render}]})
ctx.ui.toolbar(children)     filter/action bar
ctx.ui.select({label, options, value, onchange})
ctx.ui.searchBox({value, oninput, placeholder})
ctx.ui.empty(msg)            empty-state block
ctx.ui.toast(msg)            transient notice, ~2.5s
ctx.ui.css(moduleId, cssText)  extra CSS; EVERY selector must start with
                             [data-mod="<moduleId>"]
ctx.charts.bar / line / donut / heatmap(cfg)   return SVG elements
ctx.fmt.date(iso) ctx.fmt.num(n) ctx.fmt.pct(n) ctx.fmt.score(L,I)
ctx.fmt.band(score) ctx.fmt.badgeKind(status) ctx.fmt.today()
GRC.tour(scenes)             guided-demo overlay; scene = {route, state, title, text}
GRC.resetData()              restore pristine data and re-render

## CSS CLASS MENU - the only classes module markup may use
g-page g-grid g-row g-col g-split g-card g-kpi g-table g-badge g-badge--ok
g-badge--warn g-badge--bad g-badge--info g-drawer g-tabs g-btn g-btn--primary
g-input g-select g-pill g-empty g-toolbar g-h1 g-h2 g-label g-muted g-mono

## DESIGN TOKENS (defined once in index.html; never redefine elsewhere)
--g-bg --g-card --g-ink --g-muted --g-line --g-accent --g-ok --g-warn --g-bad
Spacing steps 4/8/12/16/24px. Radius 8px. Font: system-ui stack. Mono:
Consolas stack. Light theme only.

## DATA
Entity schemas, vocabularies, relationships, severity bands, coverage rule,
and metric formulas are all in SCHEMA.md (attached). Records reference each
other by id fields and id arrays; the kernel builds reverse indexes at boot.
Raw GRC_DATA is never mutated: the kernel indexes clones, and GRC.resetData()
restores pristine state.
