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
