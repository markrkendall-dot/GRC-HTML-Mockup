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
