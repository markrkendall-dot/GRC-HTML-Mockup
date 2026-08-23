# TASK M-COMPLIANCE - build modules/compliance.js  (target v1.0.0)
PRODUCES: modules/compliance.js   SIZE CEILING: 60 KB
ATTACH: CONTRACT.md, SCHEMA.md, this card.   PROMPT: BUILD

## SPEC
GRC.register id "compliance", title "Compliance", order 50.
ROUTE "compliance": one g-card per framework (name, version): a donut of
covered / partial / uncovered requirement counts (colors ok/warn/bad,
center label coveragePct), a one-line summary sentence, and an "Open"
button -> "compliance/<frameworkId>". Coverage must use EXACTLY the
SCHEMA.md coverage rule via ctx.data (do not re-derive differently from
the dashboard).
ROUTE "compliance/:id" (frameworkId): header with framework name and
coverage KPI; toolbar - select for domain, select for coverage status,
searchBox on ref/title. Requirements table: Ref, Title, Domain, Mapped
controls (count), Status (badge covered=ok, partial=warn, uncovered=bad).
Clicking a row expands an inline panel (not a route) listing its mapped
controls: id, name, status, last test result badge; control click ->
"controls/<id>". Uncovered requirements' panel shows
ctx.ui.empty("No mapped controls").

## ACCEPTANCE
1. Donut totals equal that framework's requirement count.
2. coveragePct here matches the dashboard's donut for the same framework.
3. Domain and status filters compose with search.
4. Expanding rows works for covered, partial, and uncovered cases; control
   links navigate.
5. Under 60 KB; script tag added.
