# TASK M-WORKFLOW - build modules/workflow.js  (target v1.0.0)
PRODUCES: modules/workflow.js   SIZE CEILING: 55 KB
ATTACH: CONTRACT.md, SCHEMA.md, this card.   PROMPT: BUILD

## SPEC
This module makes the mockup BEHAVE like a GRC: an approvals inbox where a
chosen role acts on records and the state visibly changes everywhere.
GRC.register id "workflow", title "Approvals", order 80.
ROUTE "approvals": toolbar with a Role select writing state "role"
(options: Risk Manager, Control Owner, Compliance Lead, Department Head;
default Risk Manager) and a "Reset demo data" g-btn calling
GRC.resetData() after a confirm(). A muted banner: "Actions are in-memory
only - Reset restores the original data."
Below, the queues for the CURRENT role only (each a g-card with a count
pill and a table; empty state when clear):
- Risk Manager: risks with status pending-acceptance -> buttons Accept
  (status accepted) / Reject (status under-treatment).
- Control Owner: active controls with lastTestResult not-tested, or
  lastTestDate older than 12 months -> button "Mark tested effective"
  (result effective, date today).
- Compliance Lead: policies with status under-review -> Approve (active,
  next review +1 year) / Send back (draft).
- Department Head: open/in-progress issues past dueDate -> button "Extend
  30 days" (dueDate +30) / "Close" (closed, closedDate today).
Every action: apply in memory, toast naming the record id, re-render so
the queue shrinks. Rows link to the record's detail route when that module
is registered.

## ACCEPTANCE
1. Switching role swaps the queues; counts match the underlying data.
2. Each action removes its row, and the change is visible in the source
   module (e.g. accepted risk shows accepted in the register).
3. Reset restores the original queues after confirm.
4. Dashboard KPIs move after actions (e.g. overdue issues drop).
5. Under 55 KB; script tag added.
