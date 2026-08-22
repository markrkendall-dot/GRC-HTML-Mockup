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
