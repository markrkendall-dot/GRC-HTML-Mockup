# TASK M-ISSUES - build modules/issues.js  (target v1.0.0)
PRODUCES: modules/issues.js   SIZE CEILING: 55 KB
ATTACH: CONTRACT.md, SCHEMA.md, this card.   PROMPT: BUILD

## SPEC
GRC.register id "issues", title "Issues", order 70.
ROUTE "issues": an aging strip on top - four g-kpi tiles: Open, Overdue
(bad), Due in 14 days (warn), Closed in last 90 days (ok). Toolbar:
searchBox, selects for severity, status, source. Table cols: ID, Title,
Severity (badge: critical=bad, high=warn, medium=info, low=ok), Status
(badge), Source, Org Unit, Owner, Opened, Due (red text when overdue),
Age (days, computed open issues only). Sortable: ID, Severity (by rank),
Due, Age. onRow -> "issues/<id>".
ROUTE "issues/:id": header card with all fields, severity and status
badges, remediationSummary paragraph. Related via links: the linked Risk
(one-line card -> risks/<id>), Control (-> controls/<id>), Assessment
(-> assessments/<id> if that module exists, else plain text). Each panel
shows ctx.ui.empty("Not linked") when null. Action: "Advance status" g-btn
cycling open -> in-progress -> closed (sets closedDate=fmt.today() when
closing) in memory + toast.

## ACCEPTANCE
1. Aging tiles reconcile with the table under each filter.
2. Overdue rows show red due dates and status badge "overdue" where the
   data says so.
3. Detail panels navigate to risk and control and back.
4. Advancing to closed removes it from Open KPIs immediately.
5. Under 55 KB; script tag added.
