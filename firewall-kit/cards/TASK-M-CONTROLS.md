# TASK M-CONTROLS - build modules/controls.js  (target v1.0.0)
PRODUCES: modules/controls.js   SIZE CEILING: 60 KB
ATTACH: CONTRACT.md, SCHEMA.md, this card.   PROMPT: BUILD

## SPEC
GRC.register id "controls", title "Controls", order 40.
ROUTE "controls": toolbar - searchBox, selects for type, automation, status,
last-test-result; KPI strip above the table: Active controls, Effective %,
Not tested (count, warn kind), Ineffective (count, bad kind). Table cols:
ID, Name, Type, Automation, Frequency, Last test (date), Result (badge:
effective=ok, partially-effective=warn, ineffective=bad, not-tested=info),
Linked risks (count), Requirements (count). Sortable: ID, Last test,
Result. onRow -> "controls/<id>".
ROUTE "controls/:id": header card (id, name, status badge, type/automation/
frequency pills, owner, org unit, description). Related panels via links:
Requirements grouped by framework (ref, title, domain), Risks (id, title,
residual badge; onRow -> risks/<id>), Policies (id, name), Issues (id,
title, severity). Action: "Record test result" select (the four results) -
sets lastTestResult and lastTestDate=fmt.today() in memory, toast, and the
change must be visible on the compliance module's coverage after refresh of
that view.

## ACCEPTANCE
1. KPI strip reconciles with metrics().controlEffectivePct.
2. Filters compose; result badges colored per spec.
3. Detail: requirement grouping shows framework names; cross-links to
   risks work both directions (risk detail already lists this control).
4. Recording a test result changes the badge everywhere it appears.
5. Under 60 KB; script tag added.
