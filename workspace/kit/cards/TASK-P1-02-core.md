# TASK P1-02 - build demo/kernel/core.js  (target v1.0.0)
PRODUCES: kernel/core.js        SIZE CEILING: 45 KB
ATTACH THIS SESSION: CONTRACT.md, SCHEMA.md, this card.   PROMPT: BUILD

## SPEC
Create window.GRC implementing, minimally but completely:
- GRC.register(def): store a module; validate id/title/routes exist;
  duplicate id -> console.warn and replace.
- GRC.boot(): index data; build the sidebar nav from registered modules
  sorted by "order" (each item shows title; current one highlighted); wire
  the hash router; render the initial route (lowest-order module's first
  route); fill #g-orgunit from orgUnits data (children indented with spaces,
  "All org units" first, value ""); wire #g-preflight-btn to toggle the
  preflight panel; wire #g-search so pressing Enter sets state "search" and
  navigates to route "explorer" if such a module exists, else shows a toastless
  console.log (the ui toast arrives in Phase 3).
- Router: location.hash "#/risks/RSK-0001" matches route key "risks/:id" with
  params {id:"RSK-0001"}; unknown hash falls back to the initial route; on
  hashchange, re-render into #outlet.
- Render pipeline: empty #outlet, set #g-title to the module title, set
  outlet attribute data-mod to the module id, call the route function
  fn(outlet, ctx, params) wrapped in try/catch. On throw: render a g-card
  saying "Module failed: <id>" plus the error message, and record the error
  for preflight.
- ctx for this phase: { data, go, state, ui: { el }, fmt }. (ui and charts
  grow in Phase 3; el() lives here permanently.)
- ctx.ui.el(tag, attrs, children): attrs is a plain object (class, id, any
  attribute, on* functions become listeners); children is a string, a Node,
  or an array of either; returns the element.
- ctx.data v1: for every entity key present in window.GRC_DATA build
  { all, list, byId }. all = cloned rows (deep enough that edits never touch
  GRC_DATA). list() = all filtered by state "orgUnit" when the record has an
  orgUnitId (descendant logic arrives in P2-04; for now exact match, "" = no
  filter). byId(id) = map lookup or null. GRC.resetData() re-clones from
  GRC_DATA, re-indexes, re-renders current route.
- ctx.state: get/set/watch; set(k,v) runs watchers then re-renders the
  current route. Keys used now: "orgUnit" (default ""), "search", "role".
- ctx.fmt: date("2026-03-12") -> "12 Mar 2026"; num(n) with thousands
  separators; pct(n) -> "87%"; score(L,I) -> L*I; band(score) and
  badgeKind(status) exactly per SCHEMA.md; today() -> current date as
  "YYYY-MM-DD" (the ONLY place "today" is computed).
- Preflight: fill #preflight with kernel version; a modules table (id,
  version, route count); a data table (entity, version, row count); an
  errors list (from render catches and window.onerror). Refresh contents
  every time the panel opens.

## ACCEPTANCE (run after P1-03 exists)
1. Page loads with no console errors.
2. Preflight lists kernel 1.0.0, module "hello", data entities with counts.
3. Changing the org-unit select visibly re-renders the hello module.
4. A bad hash like #/nothing falls back to the hello route.
5. File under 45 KB.
