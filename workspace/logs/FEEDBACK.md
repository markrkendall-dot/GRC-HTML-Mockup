# FEEDBACK REGISTER
One block per item. Append at the end. Never delete; never renumber.
States move one way: NEW -> ACCEPTED or DECLINED(reason) -> BUILT -> RELEASED.
BUILT requires the session line (file + versions). RELEASED requires the R number.
Header line: FB-id | release they saw | date | who (name, area) | module or "general"

---- EXAMPLE (delete this block after reading) ----
FB-001 | R1 | 2026-10-06 | J. Rivera (Ops Risk) | rcsa
  Ask: show direction vs prior cycle on the residual heatmap
  Status: ACCEPTED 2026-10-07
  Built: 2026-10-11 rcsa.js 1.1.0 -> 1.2.0 (card TASK-FB-R2-rcsa.md)
  Released: R2

FB-002 | R1 | 2026-10-06 | K. Osei (Compliance) | riskid
  Ask: rename "Category" column to "Risk Theme"
  Status: DECLINED 2026-10-07 - taxonomy labels come from SCHEMA.md; will
  revisit if more reviewers raise it
---- END EXAMPLE ----

(new items start here)

FB-001 | R1 | 2026-08-23 | Owner | general
  Ask: Remove the summary count tiles; they read as AI-generated
  Status: ACCEPTED 2026-08-23
  Built: 2026-08-23 home.js 1.1.0, rau.js 1.0.1, rau-profile.js 1.1.0, intake.js 1.0.1, riskid.js 1.0.1
  Released: R2

FB-002 | R1 | 2026-08-23 | Owner | general
  Ask: Sweep other obvious AI tells (em dashes, unicode glyphs, dash-heavy copy)
  Status: ACCEPTED 2026-08-23
  Built: 2026-08-23 copy pass across all modules; sort arrows and ellipsis glyphs replaced with ASCII
  Released: R2

FB-003 | R1 | 2026-08-23 | Owner | kernel/core.js
  Ask: Move the Always available section above the dynamic section in the left rail
  Status: ACCEPTED 2026-08-23
  Built: 2026-08-23 index.html 1.1.0 (markup and styles)
  Released: R2

FB-004 | R1 | 2026-08-23 | Owner | kernel/core.js
  Ask: Feedback capture on every page: pill bottom left, right-side panel, now/should form, records the page for later fixing
  Status: ACCEPTED 2026-08-23
  Built: 2026-08-23 core.js 1.1.0 feedback system with localStorage persistence, copy and download export naming page and file
  Released: R2

FB-005 | R1 | 2026-08-23 | Owner | modules/home.js
  Ask: Capability flow should start with capabilities 1 and 2; move Policy Governance and Signals to the bottom
  Status: ACCEPTED 2026-08-23
  Built: 2026-08-23 home.js 1.1.0
  Released: R2

FB-006 | R1 | 2026-08-23 | Owner | modules/gallery.js
  Ask: Build on "start somewhere interesting": a curated feature gallery with concrete examples from basic to exotic, grouped by theme and complexity, to agree features in a room
  Status: ACCEPTED 2026-08-23
  Built: 2026-08-23 gallery.js 1.0.0 with Keep/Discuss/Cut voting and two future-capability vignettes
  Released: R2

FB-007 | R1 | 2026-08-23 | Owner | modules/rau.js
  Ask: Prefer caret-expandable data tables for hierarchy, up and down without leaving the page; dislike drill-downs that navigate away
  Status: ACCEPTED 2026-08-23
  Built: 2026-08-23 rau.js 1.1.0 hierarchy tree default in the directory; libraries.js 1.1.0 inline MCR expansion on event detail
  Released: R2

FB-008 | R1 | 2026-08-23 | Owner | modules/libraries.js
  Ask: Goodness-of-fit metric showing how well an MCR sits in its risk event, to surface rewrite candidates spanning two event ideas
  Status: ACCEPTED 2026-08-23
  Built: 2026-08-23 engine.js 1.1.0 mcrFit; fit columns, rewrite-candidate filter, and fit panel in libraries.js
  Released: R2

FB-009 | R1 | 2026-08-23 | Owner | modules/skeletons.js
  Ask: Skeleton pages for capabilities 3, 4, and 5 so all ten capabilities are recognized in the tool
  Status: ACCEPTED 2026-08-23
  Built: 2026-08-23 skeletons.js 1.0.0; home flow links to them
  Released: R2

FB-010 | R2 | 2026-08-23 | Owner | modules/rau-profile.js
  Ask: Draw the process map as a Visio-style artifact in the capability 1 section
  Status: ACCEPTED 2026-08-23
  Built: 2026-08-23 mapDiagram flowchart renderer; profile Process tab and live builder preview
  Released: R3

FB-011 | R2 | 2026-08-23 | Owner | modules/home.js
  Ask: Home capability boxes act as a what-am-I-looking-at lens: select capabilities, supporting set stays lit, rest grays out, to isolate and order development
  Status: ACCEPTED 2026-08-23
  Built: 2026-08-23 home.js 1.2.0 lens with dependency closure and build-order readout
  Released: R3

FB-012 | R2 | 2026-08-23 | Owner | kernel/core.js
  Ask: Capability trace: show which capabilities each screen and action relates to, so expectations about what ships are clear
  Status: ACCEPTED 2026-08-23
  Built: 2026-08-23 core.js 1.2.0 trace strip plus action pulses wired through all modules
  Released: R3

FB-013 | R2 | 2026-08-23 | Walkthrough | general
  Ask: UX pass: cap the ambiguous middle at ten with show-all; services picker search and grouping; breadcrumbs on detail pages; stacked toasts; diagram label collisions
  Status: ACCEPTED 2026-08-23
  Built: 2026-08-23 across riskid, intake, libraries, rau-profile, ui
  Released: R3

FB-014 | R3 | 2026-08-23 | Walkthrough | modules/rau.js
  Ask: Hierarchy tree ignores the flat-list filters; a search that auto-expands matching branches would help
  Status: ACCEPTED 2026-08-23
  Built: 2026-08-23 rau.js 1.1.1 -> 1.2.0 (one filter bar for both views; tree auto-expands matching branches, hides empty ones, carets still collapse)
  Released: R4

FB-015 | R3 | 2026-08-23 | Walkthrough | modules/intake.js
  Ask: The wizard has no draft save; navigating away loses the form
  Status: ACCEPTED 2026-08-23
  Built: 2026-08-23 intake.js 1.1.0 -> 1.2.0 (autosave to local storage on every input, restore note with discard, cleared on submit)
  Released: R4

FB-016 | R3 | 2026-08-23 | Walkthrough | modules/riskid.js
  Ask: No undo for a mistaken confirm or dismiss on the workbench; consider a re-open action on dispositioned rows
  Status: ACCEPTED 2026-08-23
  Built: 2026-08-23 riskid.js 1.2.0 -> 1.3.0 with core.js 1.2.0 -> 1.3.0 removeRegister (Reopen per dispositioned row; returns the event to its scored zone, flips a complete RAU back to in progress)
  Released: R4

FB-017 | R3 | 2026-08-23 | Owner | modules/demo.js
  Ask: One demo per role type in the View-as picker, each following the workflow that role runs
  Status: ACCEPTED 2026-08-23
  Built: 2026-08-23 demo.js 1.1.0 -> 2.0.0 (Present becomes a picker; six role demos, scene one switches the banner role via the tour)
  Released: R4

FB-018 | R3 | 2026-08-23 | Owner | modules/demo.js
  Ask: A start-a-new-RAU demo proving the order of operations end to end
  Status: ACCEPTED 2026-08-23
  Built: 2026-08-23 demo.js 2.0.0 "Birth of a RAU": intake, uniqueness, mapping, standards, governance with the five roles, metadata, active, risk identification
  Released: R4

FB-019 | R4 | 2026-08-23 | Owner | modules/inherent.js
  Ask: Build capability 3 per DEEPDIVE-C3-C5.md Revision 1: evidence-anchored inherent ratings of risk instances, suggestion with provenance, override-only rationale, max-band RAU rollup with count strip
  Status: ACCEPTED 2026-08-23 (round R5 of the agreed plan)
  Built: 2026-08-23 inherent.js 1.0.0, engine.js 1.2.0, core.js 1.4.0, ratings data entity, integrations in rau/rau-profile/riskid/mywork/demo
  Released: R5

FB-020 | R5 | 2026-08-23 | Owner | modules/controls.js
  Ask: Build capability 4 per DEEPDIVE-C3-C5.md Revision 1: central control inventory with GRC as system of record, controls attached to risk instances, shared controls, expected controls with FCRM seeds, derived key vs the declared checkbox, three-tier recommendation flow with advisory duplicate check
  Status: ACCEPTED 2026-08-23 (round R6 of the agreed plan)
  Built: 2026-08-23 controls.js 1.0.0, engine.js 1.3.0, core.js 1.5.0, controls/controlLinks/expectedControls data entities, MCR recommended control types, integrations in riskid/rau-profile/gallery/skeletons/home/demo
  Released: R6
