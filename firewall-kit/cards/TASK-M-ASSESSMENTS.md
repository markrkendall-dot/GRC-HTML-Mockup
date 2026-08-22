# TASK M-ASSESSMENTS - build modules/assessments.js  (target v1.0.0)
PRODUCES: modules/assessments.js   SIZE CEILING: 50 KB
ATTACH: CONTRACT.md, SCHEMA.md, this card.   PROMPT: BUILD

## SPEC
GRC.register id "assessments", title "Assessments", order 75.
ROUTE "assessments": KPI strip - In progress, Planned, Complete this year,
Open findings from assessments (issues with assessmentId, not closed).
Toolbar: searchBox, selects for type and status. Table cols: ID, Name,
Type, Org Unit, Framework (name or "-"), Window ("MMM YYYY - MMM YYYY"),
Status (badge planned=info, in-progress=warn, complete=ok), Progress (an
inline bar with pct), Findings (count of linked issues). onRow ->
"assessments/<id>".
ROUTE "assessments/:id": header card with fields; a progress KPI; when
frameworkId set, a one-line scope note with the framework name and its
requirement count. Findings panel: linked issues table (id, title,
severity badge, status, due) -> "issues/<id>". Action for status
in-progress: "Advance progress +25%" g-btn (caps at 100, at 100 sets
status complete) in memory + toast.

## ACCEPTANCE
1. KPI strip reconciles with the filtered table.
2. Progress bars and window formatting render correctly.
3. Findings navigate to issues and back.
4. Advancing to 100% flips status to complete everywhere.
5. Under 50 KB; script tag added.
