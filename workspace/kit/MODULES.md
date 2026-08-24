# GRC MOCKUP - MODULE INVENTORY v1.1 (MODULES.md), as of release R10

Every file carries its version in its first line; the in-app Preflight
panel shows the live matrix. Sizes are the working ceiling check: keep a
module under 55 KB or split it. When you EDIT a file with Copilot, attach
its CURRENT-*.md mirror (see PROMPTS.md); this card tells you what each
file owns so you pick the right one.

## KERNEL (do not edit casually; everything depends on these)
core.js    v1.7.0  48KB  registry, hash router, data clone+indexes and the
                   whole data API, state, fmt, capability model + trace
                   strip, feedback drawer, MY LIST work cart, guided tour,
                   preflight, boot. The living-record change hooks live in
                   the data mutators here.
engine.js  v1.4.0  28KB  all standardized math (see ENGINE.md). Mirrored
                   in part by tools-dev/generate-data.js.
ui.js      v1.1.0  12KB  el/table/card/select/searchBox/kv/progress/badge/
                   pill/tabs/drawer/toast/chat/toolbar/empty.
charts.js  v1.0.1   8KB  hbar, donut, scoreBars.
index.html v1.6.0        chrome (banner, tabs, trace strip, rail), ALL
                   CSS, script tags. Adding a data entity or module means
                   adding its script tag here and bumping this file.

## MODULES BY CAPABILITY
Capability 1 - RAU Demographics & Attributes
  rau.js         v1.3.0  12KB  directory (hierarchy tree + flat list, one
                         shared filter bar, auto-expanding search),
                         profile quality. Rail: 1. RAUs; Profile quality.
  rau-profile.js v1.5.0  28KB  the RAU profile (demographics, attributes,
                         survey with provenance, process map tabs,
                         handoffs, risks, controls tab, inherent and
                         residual cards). Also exports GRC.renderMap and
                         GRC.mapDiagram (the Visio-style SVG).
  intake.js      v1.2.0  28KB  RAU change pipeline (new/merge/split/
                         retire), intake wizard with draft autosave and
                         live uniqueness + category analysis, governance
                         decisions. Rail: RAU pipeline.
  mapbuilder.js  v1.1.0  16KB  coached process-map editor with live
                         diagram, standards lint, metadata survey
                         completion and RAU activation.
Capability 2 - Risk Identification
  riskid.js      v1.4.1  20KB  applicability workbench (zones, resolve,
                         reopen, rate and controls shortcuts, challenge).
                         Rail: 2. Risk identification.
  libraries.js   v1.2.0  20KB  risk events, event detail with inline MCR
                         fit, MCR library with rewrite-candidates filter,
                         applicability rubric page. Rail: Risk events;
                         MCR library; Applicability rubric.
Capability 3 - Inherent Risk Rating
  inherent.js    v1.2.0  28KB  rating landing (rate-by-RAU, distribution,
                         completeness), the worksheet (suggested levels
                         with evidence chips, accept/override), inherent
                         rubric page. Rail: 3. Inherent ratings; Inherent
                         rubric.
Capability 4 - Control Identification
  controls.js    v1.2.0  36KB  inventory, coverage, derived-vs-declared,
                         control detail (editable design/perf ratings,
                         lint, links), three-tier attach flow with create
                         form. Rail: 4. Controls.
Capability 5 - RCSA Administration
  rcsa.js        v1.1.0  32KB  affirmation dashboard, assessment
                         workspace (lines, adoption queue, affirmation
                         gate, per-RAU challenge log), global challenge
                         log, 2LOD attention view. Exports GRC.challenge.
                         Rail: 5. RCSA administration.
Cross-cutting
  home.js        v1.4.0  12KB  capability flow map with the scope lens,
                         Program health (C9 preview), teasers.
  mywork.js      v1.2.0  12KB  role-aware queues (owner, delegate, BCM,
                         governance, ORBO/BACO desks).
  gallery.js     v1.3.0  16KB  feature gallery with votes; reg-change
                         vignette (C6 preview).
  demo.js        v2.4.0  36KB  the Present picker: full walkthrough,
                         Birth of a RAU, One risk front to back, six role
                         demos. Scenes find records at runtime.
  skeletons.js   v1.3.0   4KB  redirects only (cap3/cap4/cap5 to the real
                         modules). All skeletons have graduated.

## TOOLS (standalone pages; not loaded by index.html)
  dataforge.html v1.0.0  64KB  demo\tools\ - the real-data pipeline:
                         CSV to data\*.js entirely in the browser (load,
                         map, validate, mask, export), empty-history
                         generation, .js re-import for resumed sittings,
                         built-in self-test. Ceiling 90 KB (not the
                         55 KB module default). Reads ..\data\*.js as
                         its cross-check reference at open. EDIT it like
                         any file (mirror to CURRENT-dataforge-html.md);
                         attach SCHEMA.md - its entity specs must track
                         SCHEMA exactly.

## RAIL ORDER MAP (RCSA tab)
10 RAUs / 20 Risk identification / 22 Inherent ratings / 24 Controls /
26 RCSA administration / 30 RAU pipeline / 50 Profile quality /
60 Risk events / 70 MCR library / 80 Applicability rubric /
82 Inherent rubric. New entries pick an unused order number.

## DEMO SCENE MAP (demo.js finds records at runtime by stage/name)
Story demos: Full walkthrough (21 scenes), Birth of a RAU (8),
One risk front to back (8). Role demos: one per View-as role, scene 1
sets the role. If you change a route name, search demo.js for it.
