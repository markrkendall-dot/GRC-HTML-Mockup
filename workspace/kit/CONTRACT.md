# GRC MOCKUP - BUILD CONTRACT v2.0 (CONTRACT.md)

You are generating exactly ONE complete file for an offline HTML mockup that
runs from a local folder (file://) in Microsoft Edge. Follow every rule below.
If a rule here conflicts with the attached TASK card, the TASK card wins.
This v2 contract describes the system AS BUILT through release R9
(capabilities 1 through 5 plus the demo, feedback, and work-list machinery).

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
6. ASCII only, everywhere, including display strings. No em dashes, no
   curly quotes, no arrows, no ellipsis characters. This is a hard rule;
   the owner screens for it.
7. Vanilla JavaScript (ES2018 max) and vanilla CSS only. FORBIDDEN: any
   framework or library, CDN links, external URLs, web fonts, fetch(),
   XMLHttpRequest, ES modules (import/export), cookies, eval().
   localStorage IS allowed, but only wrapped in try/catch and only with
   keys that start with "grc-" (existing keys: grc-feedback-<release>,
   grc-worklist-<release>, grc-draft-intake).
8. Stay under the size ceiling stated in the TASK card (default 55 KB for a
   module). If the spec cannot fit under the ceiling, say so BEFORE
   generating and propose a split. Write compact, readable code; never
   minified.
9. Do not invent APIs, CSS classes, routes, entities, or data fields beyond
   those defined in this contract, in SCHEMA.md, in ENGINE.md, and in the
   TASK card.
10. Copy tone: plain declarative sentences, no marketing voice, no summary
    count tiles at the top of pages, no decorative KPI rows. Derived rates
    and gaps are fine where a screen is about them.

## RUNTIME MODEL
index.html loads scripts in this order, then calls GRC.boot():
  kernel/core.js, kernel/engine.js, kernel/ui.js, kernel/charts.js,
  data/release.js, data/orgnodes.js, data/services.js, data/raus.js,
  data/riskevents.js, data/mcrs.js, data/register.js, data/requests.js,
  data/metaquestions.js, data/rubric.js, data/ratings.js, data/controls.js,
  data/controllinks.js, data/expectedcontrols.js, data/affirmations.js,
  data/challenges.js,
  modules/home.js, modules/gallery.js, modules/rau.js,
  modules/rau-profile.js, modules/intake.js, modules/mapbuilder.js,
  modules/riskid.js, modules/inherent.js, modules/controls.js,
  modules/rcsa.js, modules/skeletons.js, modules/libraries.js,
  modules/mywork.js, modules/demo.js
window.GRC is the kernel. window.GRC_DATA holds raw data as
{ <entity>: { version, rows } } plus release. There is no server, no build
step, no network: plain <script src> on file://. The kernel deep-clones the
data at boot; all session mutations hit the clone, and Preflight offers a
reset.

## MODULE API - module files may use ONLY this
GRC.register({
  id, version, tab,            tab: Home | RCSA (others render SOON pages)
  rail: [{label, route, order}],           optional left-rail entries
  caps: { "<routePattern>": {primary:[n], uses:[n], feeds:[n], preview} },
                                "*" as a pattern covers all module routes;
                                null value = no trace strip on that route
  routes: { "raus": fn(el, ctx), "raus/:id": fn(el, ctx, params) }
})
Route functions receive an emptied container el. Modules must not touch the
DOM outside el (position:fixed overlays via kernel services only).

## ctx - what a route function gets
ctx.data      the data API (full function list in SCHEMA.md)
ctx.state     .get(k) / .set(k, v); global keys: role, search, capLens,
              inhFocus (worksheet focus), plus module-private keys
ctx.fmt       today() date(iso) num(n) money(n) cat(c) stage(s) stageKind(s)
              riskIdKind(s) band(b) bandKind(b)
ctx.go(route) navigate by hash, e.g. ctx.go("raus/RAU-0041")
ctx.ui        el(tag, attrs, children)   DOM builder; attrs: class, html,
                on<event> handlers, any attribute. NOTE: boolean attributes
                like disabled must be set as PROPERTIES on the returned
                element (btn.disabled = true), never passed as attrs.
              table({cols, rows, onRow, page, empty})  sortable, paged;
                col: {key, label, num, sort, sortVal(fn), render(fn)}
              card({title, body, actions})  toolbar(children)
              select({label, value, options, onchange})
              searchBox({value, placeholder, oninput})  debounced
              kv(pairs)  progress(pct)  badge(text, kind)  pill(text, x)
              tabs({active, items:[{id, label, render(bd)}]})
              drawer({title, body, onclose})  toast(msg)  empty(msg)
              chat({messages})
              badge kinds: ok | warn | bad | info | brand | (default gray)
ctx.charts    hbar(cfg) donut(cfg) scoreBars({categories, cats})
ctx.engine    the calculation engine; full surface in ENGINE.md
ctx.role()    the current View-as role string

## KERNEL SERVICES - global, callable from any module
GRC.caps          .name(n) .built(n) .closure(sel) .order(set)
GRC.traceAction(n, label)   pulse capability n's chip in the trace strip
GRC.cart          the "My list" work cart:
                  .add(item) .toggle(item) .has(key) .remove(key) .all()
                  .count() .clear() .open() .work()
                  .btn(item) returns a "+ My list" toggle button
                  item: {key, kind, label, sub, route, rauId, eventId, chId}
                  kinds with looks-done detection: rate, mitigate, expected,
                  challenge, affirm; kind "review" is never auto-done
GRC.challenge(ctx, {rauId, kind, eventId, controlId, label})
                  opens the second-line challenge drawer; filing creates a
                  challenges row routed to the owner queue
GRC.tour(scenes)  guided overlay; scene: {route, title, text, state}
                  (state {role: X} also syncs the banner picker)
GRC.renderMap(ctx, map)      step-list renderer for process maps
GRC.mapDiagram(ctx, map)     Visio-style SVG flowchart renderer
GRC.vote(id, v) / GRC.getVote(id)   gallery Keep/Discuss/Cut votes
GRC.resetData()   reindex the shipped data, dropping session changes

## HARD BEHAVIORAL RULES (learned; do not regress)
- Mutations go through the data API mutators (SCHEMA.md), never by pushing
  into arrays directly: the mutators maintain indexes AND queue the
  living-record change entries that Capability 5 depends on.
- Ratings join CONFIRMED register rows at read time. Never delete a rating
  when an instance reopens; the join makes it dormant.
- Derived key, control effectiveness, environment strength, residual, and
  affirmation state are COMPUTED, never stored. If a screen needs them,
  call the engine.
- Rationale is required on rating overrides and on likely-candidate
  rejections; accepting an evidence-based suggestion needs no text.
- Hierarchies expand in place with carets; do not add drill-down pages
  that navigate away for "more detail".
- Every entity mention should be a link to its record where a route exists.
