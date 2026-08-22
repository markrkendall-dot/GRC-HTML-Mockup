# TASK M-RISKS - build modules/risks.js  (target v1.0.0)
PRODUCES: modules/risks.js   SIZE CEILING: 65 KB
ATTACH: CONTRACT.md, SCHEMA.md, this card.   PROMPT: BUILD
If Copilot says it cannot fit the ceiling: accept a split into risks.js
(registers the module; list + matrix) and risks-detail.js (assigns
window.GRC.riskDetail = function; risks.js calls it for the detail route).
Only risks.js calls GRC.register. Add script tags for both.

## SPEC
GRC.register id "risks", title per SCHEMA labels ("Risks"), order 30.
ROUTE "risks" - two tabs (ctx.ui.tabs):
- Tab "Register": toolbar with searchBox (id/title substring), selects for
  status, category, band, and a "Clear" g-btn. Honors state "riskCell"
  ("L-I" from the dashboard heatmap): when set, filter to that cell and
  show a dismissible g-pill "Cell L x I". Table cols: ID, Title, Org Unit
  (name), Category, Inherent (score), Residual (score inside a band-kind
  badge), Status (badge via fmt.badgeKind), Owner, Review date. Sortable:
  ID, Residual, Status, Review date. onRow -> "risks/<id>".
- Tab "Matrix": full-width heatmap of the CURRENT filtered set; cell click
  filters the Register tab and switches to it. Beneath: band legend with
  counts.
ROUTE "risks/:id" - header g-card: id, title, status badge, band badge,
category pill, org unit, owner, treatment, review date; description
paragraph. A two-column score panel: Inherent LxI=score vs Residual
LxI=score with an arrow between. Related panels via ctx.data.links:
Controls (table: id, name, last test result badge; onRow -> "controls/<id>"
if that module is registered, else toast), Issues (id, title, severity
badge, due date), Policies (two-hop; id, name). Buttons: "Back to register"
and a status <select> that changes the record's status in memory then
toast("Status updated - demo only, resets on Reset demo data").

## ACCEPTANCE
1. Register renders under the org filter; every toolbar filter works and
   composes; Clear restores.
2. Dashboard heatmap cell click now lands here pre-filtered with the pill.
3. Matrix counts equal the filtered register rows.
4. Detail shows correct related records (spot-check one risk against
   Preflight/links); status change survives navigation until Reset.
5. Under ceiling; script tag added; hello module can now be retired
   (remove its tag) once this passes.
