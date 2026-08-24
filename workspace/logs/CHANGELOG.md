# CHANGELOG
Newest release at the TOP. Write the block BEFORE copying demo\ to
releases\ (it is step 5 of the release gate, runbook Part 9.4).

---- TEMPLATE (copy, fill, keep at top) ----
== R<n> - <YYYY-MM-DD> - <short label> ==
Feedback closed: FB-___, FB-___   Declined this round: FB-___ (reason in register)
Module changes:
  <file> <old> -> <new>: <one line what changed> (FB-___)
Data: <entity>.js <export date> (changed/unchanged)
Kit: SCHEMA.md v___, CONTRACT.md v___ (changed/unchanged)
Version matrix: (paste the Preflight versions table here)
---- END TEMPLATE ----

== R10 - 2026-08-24 - DataForge: the real-data pipeline ==
Feedback closed: none - plan-driven build (the PLAN.md P2 "DataForge
converter" deliverable, deferred until the capability build stabilized).
Module changes:
  tools/dataforge.html NEW 1.0.0: standalone CSV-to-data\*.js converter
    at demo\tools\, offline on file:// like the app. Five steps: pick
    entity, load CSV (file pick, paste, or drop), map columns to schema
    fields (auto-mapped when headers match the templates; W3 live),
    validate (required fields, duplicate keys, vocabulary, ranges,
    id patterns, cross-entity dangling references checked against the
    live working set, entity-specific rules such as override-needs-note
    and hierarchy levels; non-ASCII normalized, M/D/YYYY dates fixed),
    mask people names (stable Person NNN pseudonyms shared across
    entities; mask map copyable, never shipped), export with the
    version date stamped. Also: empty-history file generation (single
    or all eight), re-import of converted .js for resumed sittings,
    MCR tail rows auto-written lean, 3 MB size warning, built-in
    self-test (parser, folding, validation, masking, wrapper).
  No kernel or module changes; index.html untouched (the tool is
  standalone).
Data: regenerated same seed, rows and version stamps unchanged
  (2026-08-23); release.js R10 2026-08-24. data-staging\templates\
  regenerated with full schema columns: raus.csv adds locations,
  priorLosses12m, lastRcsaDate; riskevents.csv adds errClass, sevClass,
  enfFlag, visClass; mcrs.csv adds head, summary, recCtl and a lean tail
  example; challenges.csv adds controlId and the responded/resolved
  fields; affirmations.csv now flattens snapshot/prior into columns
  (was emitting [object Object] - template bug fixed); NEW requests.csv
  and metaquestions.csv. Generator 1.0.0 -> 1.1.0 (template writer only;
  data output byte-identical).
Kit: SCHEMA.md v2.0 (invariant now names DataForge as the only real-data
  door), MODULES.md 1.0 -> 1.1 (TOOLS section), WORKSHEET.md rewritten
  v1 -> v2 (was stale pre-build content), TASK-REAL-DATA v2
  (DataForge-first, Copilot fallback), KIT-README/KIT-STATUS touched.
  CONTRACT.md, ENGINE.md, PROMPTS.md unchanged.
Verification: 44-check headless browser suite (outside): shipped demo
  boots R10 with zero console errors across nine routes; every template
  CSV converts with zero errors; 850-RAU and 8,000-MCR full-scale
  round-trips reproduce shipped rows byte-identically (masking off);
  the app boots clean on DataForge-made files; tool self-test green.
Version matrix: unchanged from R9 except release R10 and the new tool
  (see Preflight in the app).

== R9 - 2026-08-24 - Kit v2 and runbook v2 ==
Feedback closed: FB-024 (the R8 release note's kit regeneration decision)
No app code changes; release.js R9 only.
Kit (workspace\kit\): regenerated from the as-built system.
  CONTRACT.md 2.0: as-built module API (tab/rail/caps, ctx.engine,
    kernel services cart/challenge/tour), localStorage-behind-try/catch
    amendment, hard behavioral rules learned over R1-R8
  SCHEMA.md 2.0: 15 entities as generated, the full data API, invariants
    (read-time joins, compute-not-store, the generator mirror rule)
  ENGINE.md 1.0 NEW: the four engine sections as spec, mirror warnings
  MODULES.md 1.0 NEW: file-by-file inventory, versions, sizes, rail map
  PROMPTS.md 1.1: card-selection addendum; KIT-README/KIT-STATUS v2
  cards\: TASK-EDIT-MODULE, TASK-FEEDBACK-ROUND, TASK-REAL-DATA,
    TASK-NEW-MODULE (all new); FB template kept; the 20 v1 build-phase
    cards (TASK-P*, TASK-M-*) retired to git history
  Root firewall-kit\ replaced by a superseded pointer.
Runbook: GRC-Mockup-Runbook.docx v2 (13 parts + appendices, XSD-valid)
  rewritten for the as-built system and the proven R2-R9 operating
  rhythm; now ships INSIDE the workspace at the root, where
  README-FIRST.txt always said it was. README-FIRST refreshed to R9.
Data: regenerated same seed; entities unchanged.
Version matrix: see Preflight in the app.

== R8 - 2026-08-24 - Integration round: My list, program health, links ==
Feedback closed: FB-022 (work list), FB-023 (C9 preview + cross-links)
Module changes:
  kernel/core.js 1.6.0 -> 1.7.0: "My list", a shopping cart for work.
    GRC.cart with add/toggle/remove, a persistent pill at the bottom
    right, a drawer showing collected items with LOOKS DONE detection
    (rate/mitigate/expected/challenge/affirm items check the live record),
    copy and clear, and a Work-through mode that steps the list item by
    item with Open / Done / Skip. Persists per release in localStorage,
    like the feedback drawer. GRC.cart.btn renders the + My list toggle.
  modules/inherent.js -> 1.2.0: + My list on unrated and stale
    completeness rows and on unrated worksheet instances
  modules/controls.js -> 1.2.0: + My list on all three coverage tables
  modules/rcsa.js -> 1.1.0: + My list on attention rows, non-current
    dashboard RAUs, and open challenges; event names in the assessment
    lines and the attention view are now links (cross-link sweep)
  modules/home.js -> 1.4.0: Program health card (Capability 9 preview):
    inherent rating coverage, override rate, expected-control gaps,
    affirmations overdue and due, open challenges; every number computed
    live on visit and linked to the screen it reads from
  modules/demo.js -> 2.4.0: walkthrough gains a My list scene
  modules/gallery.js -> 1.3.0: gallery item "Collect work like a
    shopping cart" with Keep/Discuss/Cut voting
  index.html -> 1.6.0: pill, in-list button state, and work-through bar
    styles
Data: regenerated same seed; release.js R8; entities unchanged.
Kit: v2 regeneration proposed to the owner now that capabilities 1-5
  are stable (see the R8 release note).
Version matrix: see Preflight in the app.

== R7 - 2026-08-23 - Capability 5: the living RCSA ==
Feedback closed: FB-021 (round R7 of the plan in docs/DEEPDIVE-C3-C5.md)
Module changes:
  modules/rcsa.js NEW 1.0.0: affirmation dashboard (LOB tree, states
    Current / Changes pending / Due / Overdue, residual strips,
    direction vs the last signature); assessment workspace (lines read
    inherent x control environment = residual via the knockdown rule,
    CHANGED and CHALLENGED chips, links into the worksheet and attach
    flow); what-changed adoption queue with Adopt / Adopt all; the
    affirmation gate (all rated, changes adopted, challenges resolved)
    and owner signature with stored snapshot; challenge log per RAU and
    global with respond (agree-and-change or stands) and resolve
    (uphold / withdraw); 2LOD attention view ranking peer outliers,
    score-band mismatches, expected gaps, override density, aging
    changes, and open challenges, with session Reviewed dismissal;
    GRC.challenge drawer, the in-universe sibling of the feedback bar
  kernel/engine.js 1.3.0 -> 1.4.0: rcsa section (effectiveness = weaker
    of design and performance; environment Strong/Adequate/Weak;
    residual knockdown to High/Moderate/Low; per-RAU residual profile;
    affirmation state; bank-wide attention ranking)
  kernel/core.js 1.5.0 -> 1.6.0: affirmations and challenges indexed;
    LIVING-RECORD HOOKS: addRegister/removeRegister/setRating/addLink/
    removeLink now queue human-readable unadopted changes on the RAU;
    setControlRating logs to every linked RAU; addChallenge, adoptChange,
    affirm APIs; BUILT set gains capability 5 (all five RCSA-spine
    capabilities are now built)
  modules/controls.js -> 1.1.0: design and performance ratings are
    editable on the control detail (effectiveness, environment strength,
    and residual recompute everywhere on change); Challenge button
  modules/riskid.js -> 1.4.1, modules/inherent.js -> 1.1.0: Challenge
    buttons on dispositions and ratings
  modules/rau.js -> 1.3.0: directory gains a Residual column
  modules/rau-profile.js -> 1.5.0: Residual and affirmation card
  modules/mywork.js -> 1.2.0: owner gains challenges-to-answer and
    affirmations-due queues; ORBO and BACO get REAL desks: the attention
    slice for their side plus their challenges in flight
  modules/skeletons.js -> 1.3.0: all skeletons retired; cap3/cap4/cap5
    routes survive as redirects
  modules/home.js -> 1.3.0: box 5 opens the real module; copy says
    capabilities 1 through 5
  modules/demo.js -> 2.3.0: NEW story demo "One risk, front to back"
    (confirm, rate, mitigate, residual, challenge, answer, affirm, then
    the bank board); ORBO and BACO role demos rebuilt around attention
    and challenge; walkthrough gains two capability 5 scenes; owner demo
    ends on the real workspace
  index.html -> 1.5.0: affirmations/challenges data tags, rcsa.js tag
Data: NEW affirmations (375 RAUs: last-affirmed dates mixed across
  states, snapshots shifted on a slice so direction arrows show, ~44
  RAUs with unadopted changes; story RAU crafted with two pending
  changes); NEW challenges (28: story RAU carries one open BACO
  challenge on the Reg X override and one upheld ORBO challenge);
  residual math mirrored in the generator; release.js R7; CSV templates.
Kit: unchanged (v2 regeneration is the R8 conversation).
Version matrix: see Preflight in the app.

== R6 - 2026-08-23 - Capability 4: controls with derived key ==
Feedback closed: FB-020 (round R6 of the plan in docs/DEEPDIVE-C3-C5.md)
Module changes:
  modules/controls.js NEW 1.0.0: control inventory (filters incl. the
    derived-vs-declared disagreement cuts), Coverage tab (expected
    control missing as the loudest gap with an in-place Attach fix,
    High/Critical instances with no control, single point of
    mitigation), Derived vs declared tab (the case against the
    checkbox), control detail (attributes, design/performance ratings
    labeled as owner judgment until Capability 7, description lint,
    derived-key rules, linked instances with unlink, C7/C8 test-history
    slot), and the attach flow: three-tier recommendations (expected
    with waive-with-note, shareable matches by attach rate, drafted
    skeleton guided by MCR control types) plus a light create form with
    an advisory duplicate check
  kernel/engine.js 1.2.0 -> 1.3.0: control section (derived key rules
    K1 sole mitigant / K2 expected / K3 concentration / K4 critical,
    recommendations, coverage math, description lint, similarity)
  kernel/core.js 1.4.0 -> 1.5.0: controls, controlLinks, and
    expectedControls indexed with controlsOfInstance / linksOfControl /
    linksOfEvent / controlsOwnedBy / expectedFor / addControl / addLink
    / removeLink; BUILT set gains capability 4
  modules/riskid.js -> 1.4.0: dispositioned confirmed rows gain a
    Controls column (count, or an Attach shortcut into the flow)
  modules/rau-profile.js -> 1.4.0: Controls tab per confirmed instance
    with derived-key emphasis and Manage into the attach flow
  modules/gallery.js -> 1.2.0: assign-control vignette graduated; the
    page hands visitors to the real flow, votes still count
  modules/skeletons.js -> 1.2.0: capability 4 skeleton retired, cap4
    route redirects to the real module
  modules/home.js -> 1.2.2: box 4 opens the real module; copy says
    capabilities 1 through 4
  modules/demo.js -> 2.2.0: walkthrough gains three capability 4 scenes
    (attach tiers, derived vs declared, coverage); BCM demo gains the
    coverage sweep; BACO demo gains derived key
  index.html -> 1.4.0: three data script tags and modules/controls.js
Data: NEW controls (5,146: shared per event plus RAU-local, design and
  performance ratings, declared-key with deliberate disagreements),
  controlLinks (6,366 instance links), expectedControls (12 FCRM-seeded
  rules with ~60 deliberate misses incl. the story RAU's sanctions
  instance); head MCRs gain recommended control types; story RAU
  crafted: dual-auth/reconciliation/payee controls, one single-point
  instance, the live-demo instance left with zero controls; release.js
  R6; CSV templates for all three entities.
Kit: unchanged (v2 regenerates after the C3-C5 rounds stabilize).
Version matrix: see Preflight in the app.

== R5 - 2026-08-23 - Capability 3: evidence-anchored inherent ratings ==
Feedback closed: FB-019 (round R5 of the plan in docs/DEEPDIVE-C3-C5.md)
Module changes:
  modules/inherent.js NEW 1.0.0: rating landing (Rate by RAU /
    Distribution / Completeness tabs, all in place), per-RAU worksheet
    with caret-expandable instances, assistant-suggested levels with
    evidence chips naming their sources, one-click accept, per-level
    override with mandatory rationale, live band computation, peer
    outlier and stale chips; Inherent rubric page (frequency-anchored
    likelihood, four fact-anchored impact lenses, band grid, the
    reputational-flag stance, CARA boundary note)
  kernel/engine.js 1.1.0 -> 1.2.0: inherent section (level math mirrored
    by the generator, suggestion with chips, band grid, max-band RAU
    rollup with drivers and count strip, LOB peer-outlier check)
  kernel/core.js 1.3.0 -> 1.4.0: ratings entity indexed with
    ratingsOfRau/ratingOf/ratingsOfEvent/setRating (upsert); BUILT set
    gains capability 3; ratings join confirmed register rows at read
    time so a workbench Reopen simply stops counting the rating
  modules/skeletons.js 1.0.1 -> 1.1.0: capability 3 skeleton retired,
    cap3 route redirects to the real module
  modules/rau.js -> 1.2.1: flat list gains an Inherent column
  modules/rau-profile.js -> 1.3.0: Inherent risk card on the overview
    (band, drivers, count strip, worksheet link)
  modules/riskid.js -> 1.3.1: dispositioned confirmed rows show the
    inherent band or a Rate shortcut that focuses the worksheet
  modules/mywork.js -> 1.1.0: owner queue gains inherent ratings to
    document
  modules/demo.js -> 2.1.0: walkthrough gains two capability 3 scenes;
    owner role demo gains a rating scene; copy updated to three built
    capabilities
  modules/home.js -> 1.2.1: box 3 opens the real module
  index.html -> 1.3.0: ratings.js and inherent.js script tags
Data: events gain errClass/sevClass/enfFlag/visClass; NEW ratings entity
  (2,595 rows: suggested and final levels, overrides with rationale,
  deliberate outliers and stale set; story RAU hand-rated with one
  instance left open); release.js R5; ratings.csv template added.
Kit: unchanged (v2 regenerates after the C3-C5 rounds stabilize).
Version matrix: see Preflight in the app.

== R4 - 2026-08-23 - Demo round ==
Feedback closed: FB-014 through FB-018 (see FEEDBACK.md)
Module changes:
  modules/demo.js 1.1.0 -> 2.0.0: Present is now a demo picker. Two story
    demos (the full walkthrough; "Birth of a RAU", the order of operations
    one gate per scene: intake, uniqueness, mapping, standards, governance
    with the five roles, metadata, active, risk identification) plus one
    demo per role in the View-as picker (Owner, Delegate, BCM, ORBO, BACO,
    RCSA RAU Governance), each following that role's real workflow; scene
    lists expand in place; starting a role demo switches the banner role
    (FB-017, FB-018)
  kernel/core.js 1.2.0 -> 1.3.0: tour scenes that set a role now sync the
    banner View-as picker; data API gains removeRegister for reopening
    dispositions (FB-016, FB-017)
  modules/rau.js 1.1.1 -> 1.2.0: one filter bar (search, LOB, category,
    risk ID) serves both directory views; the hierarchy tree honors it,
    auto-expands branches containing matches, hides empty branches, and
    carets still collapse while filtering (FB-014)
  modules/intake.js 1.1.0 -> 1.2.0: the wizard autosaves a draft to local
    storage on every input; returning restores it with a discard option;
    submit clears it (FB-015)
  modules/riskid.js 1.2.0 -> 1.3.0: Reopen on every dispositioned row
    returns the event to its scored zone and flips a complete RAU back to
    in progress; trace pulse and updated completion copy (FB-016)
Data: regenerated same seed; release.js R4; entities unchanged.
Kit: unchanged (v2 regenerates after feedback rounds stabilize).
Version matrix: see Preflight in the app.

== R3 - 2026-08-23 - Walkthrough round ==
Feedback closed: FB-010 through FB-013 (see FEEDBACK.md); walkthrough
observations FB-014 through FB-016 logged as open.
Module changes:
  kernel/core.js 1.1.0 -> 1.2.0: capability model (names, needs, closure,
    build order); trace strip under the tabs naming every screen's
    capabilities (primary / built on / will feed, dashed when later-phase);
    GRC.traceAction pulses on key actions (FB-012)
  modules/home.js 1.1.0 -> 1.2.0: capability boxes are now a scope lens -
    click to select, support set stays lit, rest grays out, REQUIRED marks
    on pulled-in dependencies, scope readout with suggested build order
    (FB-011)
  modules/rau-profile.js 1.1.0 -> 1.2.0: Visio-style cross-functional
    process diagram (lanes, terminators, decision diamonds with Yes/No and
    exception stubs, tabbed handoff shapes linking counterparties); step
    list collapsed beneath; breadcrumb (FB-010)
  modules/mapbuilder.js 1.0.1 -> 1.1.0: live diagram redraws as steps are
    added; trace pulses on mapping and survey actions
  modules/riskid.js 1.0.1 -> 1.2.0: ambiguous middle capped at top 10 with
    a show-all toggle; breadcrumb; trace pulses on confirm/reject/resolve
    (FB-013)
  modules/intake.js 1.0.1 -> 1.1.0: services picker gains catalog search,
    family grouping, and a selected count (FB-013)
  modules/libraries.js -> 1.2.0: breadcrumbs on event and MCR detail
  modules/gallery.js -> 1.1.0, skeletons.js -> 1.0.1, mywork.js -> 1.0.2,
    demo.js -> 1.1.0: capability declarations, action pulses, a tour scene
    for the lens and trace
  kernel/ui.js -> 1.1.0: toasts stack instead of overlapping (FB-013)
Data: release.js R3; entities unchanged.

== R2 - 2026-08-23 - Feedback round 1 ==
Feedback closed: FB-001 through FB-009 (see FEEDBACK.md)
Also in this release:
  modules/rau.js 1.1.0: directory defaults to a caret-expandable hierarchy
    (Enterprise > LOB > SubLOB > RAU) with a flat-list toggle; separate
    Hierarchy page folded in (FB-007)
  kernel/engine.js 1.1.0: mcrFit goodness-of-fit metric (parent fit, best
    alternative event, verdict) (FB-008)
  modules/libraries.js 1.1.0: event detail expands MCRs in place with fit
    and rewrite-candidate assessment; MCR library gains a Fit column and a
    rewrite-candidates filter; MCR detail gains a fit panel (FB-007, FB-008)
  modules/skeletons.js NEW 1.0.0: capability 3, 4, 5 skeleton pages in the
    RCSA rail; home flow links to them (FB-009)
Module changes:
  index.html 1.0.0 -> 1.1.0: Always-available rail section moved above the
    contextual section; feedback pill and panel styles; gallery styles (FB-003, FB-004)
  kernel/core.js 1.0.0 -> 1.1.0: feedback capture system (pill on every
    page, right-side panel, now/should form, page and file reference on
    each item, localStorage persistence, copy and download export,
    gallery vote store) (FB-004)
  kernel/ui.js 1.0.0 -> 1.0.1, kernel/charts.js 1.0.0 -> 1.0.1: unicode
    glyphs replaced with ASCII (FB-002)
  modules/home.js 1.0.0 -> 1.1.0: flow starts with capabilities 1 and 2,
    Signals and Policy Governance at the bottom; count tiles removed;
    gallery teaser replaces start-somewhere-interesting (FB-001, FB-005, FB-006)
  modules/gallery.js NEW 1.0.0: curated feature gallery, grouped by theme
    and complexity, Keep/Discuss/Cut votes included in the feedback
    export; vignettes for assign-control (Capability 4 preview) and
    regulatory change (Capability 6 preview) (FB-006)
  modules/rau.js, rau-profile.js, intake.js, riskid.js, libraries.js,
    mywork.js, mapbuilder.js, demo.js: count tile rows removed, key facts
    folded into Demographics, copy pass (FB-001, FB-002)
Data: regenerated same seed; release.js R2.
Kit: unchanged.
Version matrix: see Preflight in the app.

== R1 - 2026-08-23 - Capabilities 1-2 reference build ==
Feedback closed: none (first release)
Module changes (all new, v1.0.0): index.html (bank chrome: red banner, top
tabs, gray contextual rail, release chip, role switcher, preflight);
kernel/core.js (registry, router, data indexing, tour, preflight);
kernel/engine.js (applicability engine: 8-category 1-5 weighted rubric,
bands, exclusion suppression, disambiguation rescoring);
kernel/ui.js, kernel/charts.js; modules: home (capability flow map), rau
(directory/hierarchy/quality), rau-profile (demographics vs attributes,
survey provenance, process map, handoffs, risks), intake (CRUD pipeline,
wizard with live uniqueness + category analysis, governance), mapbuilder
(coached map editor + standards lint + metadata survey completion), riskid
(three-zone workbench with Resolve), libraries (90 risk events, 8,000-MCR
library with RRCM provenance, rubric panel), mywork (role queues), demo
(12-scene guided tour).
Data: synthetic R1 set, 2026-08-23 vintage - 850 RAUs, 85 services, 90
risk events, 8,000 MCRs (2,000 head), 4,812 register rows, 10 pipeline
requests. All data generated; replace per data-staging\README to load real.
Kit: v1.0 carried with KIT-STATUS.md caveats; v2 regenerates after
feedback round 1.
Version matrix: see Preflight in the app (live).

== R0 - (superseded) ==
Workspace initialized.
