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
