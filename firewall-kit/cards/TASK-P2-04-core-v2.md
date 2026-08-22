# TASK P2-04 - EDIT kernel/core.js: indexes, links, metrics, tour
PRODUCES: kernel/core.js (target v2.0.0)   SIZE CEILING: 60 KB
ATTACH: CONTRACT.md, SCHEMA.md, this card, CURRENT-core-js.md
PROMPT: EDIT

## CHANGES
1. ctx.data.links(record, entityKey): implement the full relationship map in
   SCHEMA.md, both directions, including the two-hop risk->policies and
   risk->requirements paths. Build reverse indexes once at boot (maps of
   id -> array of related ids per relation); links() reads indexes, never
   scans arrays.
2. Org hierarchy: list() now includes DESCENDANT org units of the selected
   unit (build a children index from parentId).
3. ctx.data.metrics(): return exactly the keys and formulas in SCHEMA.md,
   respecting the org filter (trend excluded). Compute on demand, cache per
   filter value, invalidate on state change or resetData.
4. ctx.data.search(q): case-insensitive substring across every entity's id
   plus title/name fields; return [{entity, record, label}] capped at 50.
5. Preflight v2: add a data-health section - per relationship, the count of
   dangling references with the first 10 offending ids; a "Reset demo data"
   g-btn calling GRC.resetData(); show data file versions.
6. GRC.tour(scenes): kernel-level guided overlay. scenes is an array of
   {route, state (object or null), title, text}. Render a fixed
   bottom-center card (kernel injects its own <style> once, id
   "g-tour-css") with scene title, text, "n of N", Prev / Next / Exit.
   Next/Prev: apply the scene's state keys via ctx.state.set, then
   ctx.go(route). Exit: remove overlay and set state "orgUnit" to "".
   The overlay must survive route changes (it lives outside #outlet - this
   is kernel code, allowed).
7. Extension hook: at boot, if window.GRC.uiExt exists merge its keys into
   ctx.ui, and if window.GRC.chartsExt exists merge it into ctx.charts.
   (Those files arrive in Phase 3; booting without them must stay clean.)
   Also: when a ui toast is available, the search box and failed modules
   use it instead of console.log.
8. Keep every v1 behavior working. Bump version to 2.0.0.

## ACCEPTANCE
1. Hello module still works; org filter on a division now includes its
   departments' records.
2. Preflight data-health shows zero dangling references on the synthetic
   dataset (or lists real ones honestly).
3. In the console:
   GRC.tour([{route:"hello",state:null,title:"T1",text:"one"},
   {route:"hello",state:{orgUnit:""},title:"T2",text:"two"}])
   shows the overlay, Next/Prev/Exit all work.
4. Under 60 KB.
