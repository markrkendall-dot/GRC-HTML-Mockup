# TASK M-POLICIES - build modules/policies.js  (target v1.0.0)
PRODUCES: modules/policies.js   SIZE CEILING: 55 KB
ATTACH: CONTRACT.md, SCHEMA.md, this card.   PROMPT: BUILD

## SPEC
GRC.register id "policies", title "Policies", order 60.
ROUTE "policies": KPI strip - Active policies, Due for review in 90 days
(warn), Overdue review (bad), Avg attestation %. Toolbar: searchBox,
selects for category and status. Table cols: ID, Name, Category, Status
(badge: active=ok, under-review=warn, draft=info, retired=info), Effective
(date), Next review (date; red text when before today), Attestation (an
inline horizontal bar 0-100 with the pct printed). Sortable: ID, Next
review, Attestation. onRow -> "policies/<id>".
ROUTE "policies/:id": header card with fields and badges; attestation KPI;
Related: Controls (id, name, result badge -> controls/<id>), and through
controls the covered Requirements grouped by framework (ref + title,
read-only). Action: "Start review" g-btn - sets status under-review in
memory + toast; when already under-review the button reads "Approve" and
sets active with nextReviewDate pushed one year from today.

## ACCEPTANCE
1. KPI strip reconciles (overdue review count matches red dates visible).
2. Attestation bars render 0, mid, and 100 sanely.
3. Detail actions cycle active -> under-review -> active with new date.
4. Cross-links to controls navigate.
5. Under 55 KB; script tag added.
