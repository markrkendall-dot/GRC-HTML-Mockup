# CAPABILITIES.md - the 10-capability architecture (v2, PROVISIONAL)

Status: DRAFT pending the owner's answers to the per-capability questionnaire.
C1 and C2 are the build focus: see docs/DEEPDIVE-C1-C2.md, which supersedes
their sections below and changes the build order (RAU and Risk ID become the
first modules after the foundation phases).
This document is the staging ground for the v2 rewrite of SCHEMA.md, the
CONTRACT nav API, and the task cards. Where the owner supplies bank-specific
detail, it replaces the "standard model" noted per capability; where they
don't, the standard model ships as-is.

Context: GRC = Governance, Risk and Compliance tooling for a large bank.
RAU = Risk Assessable Unit, the process unit of measure in RCSA
(Risk and Control Self-Assessment). The mockup emulates the bank's familiar
chrome: red banner on top, gray panel on the left, white main area, tabs
across the top for broad functions, context-aware rail options per tab plus
persistent rail links.

## 1. The capability flow (this diagram is also the Home screen)

```
                 +--------------------------- 10 POLICY GOVERNANCE ---------------------------+
                 |            (governs every step below; every box shows its governing docs)  |
                 +-----------------------------------------------------------------------------+

  6 SIGNALS & IMPACT ==> feeds new/changed things into steps 1 and 2
        |                       |
        v                       v
  [1 RAU DEMOGRAPHICS] -> [2 RISK ID (op+compliance)] -> [3 INHERENT RATING] -> [4 CONTROL ID] -> [5 RCSA ADMIN
                                                                                     |    |            incl. RESIDUAL]
                                                                                     |    +--> [8 AUDIT TESTING]
                                                                                     +-------> [7 CONTROL TESTING]

  9 MONITORING spans steps 1-6 (program health + KRIs), and consumes 7/8 results as inputs.
```

The demo's money path: a SIGNAL arrives -> impacts a RAU (matched via its
demographics) -> spawns/updates a RISK -> INHERENT rating documented ->
CONTROLS identified -> tested by 2nd line (7) and audited by 3rd line (8) ->
RCSA cycle produces RESIDUAL -> MONITORING shows the KRI move -> POLICY
governs every step touched. One story, ten boxes, all clickable.

## 2. Chrome: tabs, rail, theme

TABS (top, in the red banner area): Home | RCSA | Signals | Testing |
Monitoring | Policy

RAIL (left, gray, two zones):
- CONTEXT zone (changes with the tab):
  - Home:       Program Map, Executive Summary
  - RCSA:       1. RAUs, 2. Risk Identification, 3. Inherent Ratings,
                4. Controls, 5. RCSA Cycles  (numbered - it IS the process)
  - Signals:    Inbox, Impact Assessments, Dispositioned
  - Testing:    Control Testing, Audit Testing, Issues
  - Monitoring: KRI Dashboard, Breaches, Program Health
  - Policy:     Library, Governance Map, Review Calendar, Exceptions
- PERSISTENT zone (always visible, bottom of rail): My Work, Search /
  Explorer, Present (guided demo), About / Preflight

THEME v2 tokens (provisional hexes until the owner confirms):
banner red #B01E24 (white text), rail gray #E8E8E8 (ink text, active item
white card w/ red left bar), main white #FFFFFF, ink #1F2430, line #D9DDE3,
ok #1E7D3C, warn #B96A00, bad #B3261E, info #14557B. Tabs sit in/under the
banner; active tab white-on-red inversion. Release number (see
docs/VERSIONING.md) always visible at the banner's right edge.

CONTRACT nav API change (v2): GRC.register gains `tab` and `rail`
(`rail: [{label, route, order}]`); kernel renders tabs from registered
modules' tabs, rail from the active tab's modules, persistent links from a
kernel constant. Everything else in the contract survives.

## 3. Module files (v2 build inventory, ceilings as before)

| Capability | File | Tab / rail |
|---|---|---|
| Home + program map | modules/home.js | Home |
| 1 RAU Demographics | modules/rau.js | RCSA / RAUs |
| 2 Risk ID | modules/riskid.js | RCSA / Risk Identification |
| 3 Inherent Rating | modules/inherent.js | RCSA / Inherent Ratings |
| 4 Control ID | modules/controls.js | RCSA / Controls |
| 5 RCSA Admin + residual | modules/rcsa.js | RCSA / RCSA Cycles |
| 6 Signals | modules/signals.js | Signals |
| 7 Control Testing | modules/ctesting.js | Testing / Control Testing |
| 8 Audit Testing | modules/audit.js | Testing / Audit Testing |
| (shared) Issues | modules/issues.js | Testing / Issues |
| 9 Monitoring | modules/monitoring.js | Monitoring |
| 10 Policy Governance | modules/policy.js | Policy |
| My Work (approvals) | modules/mywork.js | persistent |
| Explorer + search | modules/explorer.js | persistent |
| Present (tour) | modules/demo.js | persistent |

Kernel/shell/tools files unchanged in role; shell (index.html) gets the v2
chrome. Roughly 15 module sessions + 4 foundation sessions on the same
session recipe.

## 4. Provisional entity model v2 (13 entities)

IDs: RAU- RSK- CTL- CYC- SIG- CT- AT- ISS- KRI- POL- CAT- plus kriReadings
(keyed KRI+month) and release (single record). Dates ISO, percents 0-100.

- raus: id, name, description, businessLineL1, businessLineL2, execOwner,
  riskOfficer, region, legalEntities[], headcount, keyProducts[],
  keyProcesses[], keySystems[], customerFacing, annualVolume,
  priorLosses12m, changeLevel (low|medium|high), status (active|retired),
  lastRcsaDate, residualRollup (band)
- riskCategories: id, level (1|2), parentId, name, type (operational|compliance)
- risks: id, rauId, statement, type (operational|compliance), catL1Id,
  catL2Id, regRefs[], source (rcsa|signal|loss-event|audit|regulator),
  identifiedDate, ownerRole, status (active|retired),
  inherentL 1-5, inherentI 1-5, inherentBand, inherentRationale,
  impactDims {financial, regulatory, reputational, customer, operational}
- controls: id, name, description, rauId, riskIds[], key (true|false),
  type (preventive|detective|corrective), automation (manual|automated|
  it-dependent), frequency, ownerRole, status (active|draft|retired),
  policyIds[]
- rcsaCycles: id, rauId, period (e.g. 2026-Q2), status (scoped|
  in-assessment|submitted|in-challenge|approved), submittedBy, submittedDate,
  approvedBy, approvedDate, controlEnvRating (strong|satisfactory|weak),
  residualBand, direction (up|down|flat vs prior), lineItems[]
  {riskId, inherentBand, controlEnv, residualBand, rationale}
- signals: id, title, type (new-product|regulatory-change|org-change|
  system-change|loss-event|external-event|exam-finding), receivedDate,
  source, ownerRole, dueDate, status (new|assessing|dispositioned),
  impactedRauIds[], impactedRiskIds[], disposition (no-action|update-rau|
  new-risk|reassess-rau), notes
- controlTests: id, controlId, testType (design|operating), period, tester,
  status (planned|in-progress|complete), result (effective|
  partially-effective|ineffective), sampleSize, exceptions, testDate, issueId
- auditTests: id, engagement, controlId, rauId, period, result
  (satisfactory|needs-improvement|unsatisfactory), findingsCount,
  reportDate, issueIds[]
- issues: id, title, severity (critical|high|medium|low), source
  (control-test|audit|rcsa|signal|self-identified), rauId, controlId,
  riskId, ownerRole, openedDate, dueDate, closedDate, status (open|
  in-progress|overdue|closed), remediationSummary
- kris: id, name, scope (rauId or riskId or "program"), unit, direction
  (higher-is-worse|lower-is-worse), thresholdAmber, thresholdRed, frequency
- kriReadings: kriId, month (YYYY-MM), value
- policies: id, title, level (policy|standard|procedure), ownerOrg,
  approverCommittee, effectiveDate, nextReviewDate, status (active|
  under-review|draft|retired), governsCapabilities[] (1..10), controlIds[],
  exceptions[] {id, grantedTo, expires, rationale}
- release: number (R1...), date, label  (single-record file; see VERSIONING)

Relationship spine (kernel reverse-indexes all): signal->raus/risks;
rau->risks->controls->(controlTests, auditTests); rcsaCycle->rau + lineItems
->risks; issue->rau/control/risk/source record; kri->scope; policy->
capabilities + controls. Monitoring computes across 1-6 pipelines.

## 5. Per-capability build plans

Each block: what I'd build, the standard large-bank model I'll default to,
and what the owner may know that would change it (mirrors the questionnaire).

### C1 - RAU Demographics & Attributes  (modules/rau.js)
Screens: RAU directory (filterable by business line, residual band, change
level; columns show the demographics that matter); RAU profile - a
demographics card, an attributes panel, and "everything about this RAU"
tabs (risks, controls, cycles, signals, KRIs, issues, governing policies);
hierarchy browser by business line.
Standard model: RAU sits under a two-level business-line hierarchy;
demographics = ownership (exec owner, 1LOD risk officer), footprint
(region, legal entities, headcount), profile (products, processes, systems,
customer-facing, volumes), risk memory (12m losses, last RCSA, residual
rollup, change level).
Owner may know: real hierarchy levels/names; which demographics drive
scoping and signal-matching; typical RAU count; the attribute list.

### C2 - Operational & Compliance Risk ID  (modules/riskid.js)
Screens: risk inventory (global + per-RAU views, filters by type/taxonomy/
source); risk detail (statement, taxonomy, linked everything); taxonomy
browser (L1 -> L2 -> risks); "new risk" intake form (also reachable from a
signal's disposition).
Standard model: one register holding both types, discriminated by `type`.
Operational taxonomy: Basel-style L1 (Internal Fraud, External Fraud,
Employment Practices, Clients Products & Business Practices, Damage to
Physical Assets, Business Disruption & System Failures, Execution Delivery
& Process Mgmt). Compliance risks carry regulation refs (BSA/AML, UDAAP,
Fair Lending, Privacy, Sanctions...). Risk statement in cause-event-impact
form.
Owner may know: the bank's actual L1/L2 taxonomy; whether compliance risk
maps to an obligations library; required statement format.

### C3 - Inherent Risk Rating  (modules/inherent.js)
Screens: rating worksheet per risk (likelihood pick with anchored
definitions; impact scored per dimension with the calc rule applied;
auto-computed score + band; REQUIRED rationale text); ratings overview
(matrix + distribution per RAU/business line); documentation completeness
view (risks missing rationale).
Standard model: 5x5, likelihood anchored by frequency, impact = max of five
dimensions (financial $, regulatory, reputational, customer, operational),
band Low/Moderate/High/Critical.
Owner may know: scale (4x4? H/M/L?), band names, dimension list and $
thresholds, max-vs-weighted rule, whether rating is per risk or rolled to
RAU.

### C4 - Control Identification  (modules/controls.js)
Screens: control inventory (per RAU and global; key-control filter);
control detail (description, attributes, linked risks, test history from
C7/C8, governing procedures); coverage view - risks with NO key control
(the gap list that makes audiences lean in).
Standard model: many-to-many risk<->control within a RAU; attributes: key
flag, preventive/detective/corrective, manual/automated/IT-dependent,
frequency, owner.
Owner may know: attribute list, key-control criteria, whether enterprise/
shared controls exist across RAUs, naming conventions.

### C5 - RCSA Administration incl. residual  (modules/rcsa.js)
Screens: cycle dashboard (all RAUs x period, status pipeline); assessment
workspace per RAU-cycle (line items per risk: inherent carried in, control
environment judgment, residual out; sign-off panel; challenge log);
residual heatmap; prior-cycle comparison (direction arrows).
Standard model: periodic cycles (annual, plus triggered refreshes from C6);
workflow scoped -> in-assessment (1LOD) -> submitted -> in-challenge (2LOD
review) -> approved; residual = matrix lookup of inherent band x control
environment (strong/satisfactory/weak), judgmental override allowed with
rationale.
Owner may know: cycle frequency, exact workflow states + who plays each
role, the residual formula/matrix, whether challenge is formal.

### C6 - Signals & Impact Assessment  (modules/signals.js)
Screens: signal inbox (aging, type filters, SLA countdown); impact
assessment worksheet - pick impacted RAUs (suggested by matching signal
tags against RAU demographics from C1), name affected risks or draft a new
one (routes into C2), choose disposition; dispositioned log ("what changed
because of what").
Standard model: types = new product/service, regulatory change, org change,
system change, internal loss event, external event, exam finding; each
signal dispositions to no-action | update RAU | new risk | trigger off-cycle
reassessment; 30-day SLA.
Owner may know: the real intake types and sources, SLAs, who dispositions,
whether a signal formally forces an off-cycle RCSA.

### C7 - Control Testing  (modules/ctesting.js)
Screens: test plan/coverage (every key control vs its scheduled tests -
untested key controls flagged); test workspace (type, sample, result,
exceptions -> spawn issue); results dashboard (pass rate by RAU/business
line, trend).
Standard model: 2nd line (or 1LOD QA) tests key controls on a risk-based
frequency; design effectiveness + operating effectiveness as separate test
types; sample sizes by control frequency (e.g. daily=25, monthly=5); result
effective / partially effective / ineffective; failures raise issues.
Owner may know: who tests, DE/OE split, sample-size table, result scale,
the coverage rule (all key controls annually?).

### C8 - Audit Testing  (modules/audit.js)
Screens: audit plan (engagements, periods, scoped RAUs/controls);
engagement detail (controls tested, results, findings -> issues); reliance
view - 2nd-line result vs audit result side by side per control
(divergences highlighted; a compelling demo moment).
Standard model: 3rd line tests independently against the same control
inventory (feeds from C4); engagement-level rating satisfactory /
needs-improvement / unsatisfactory; findings become issues with severity.
Owner may know: whether audit's universe maps 1:1 to RAUs, rating scale,
finding severity names, whether audit references 2nd-line results.

### C9 - Monitoring  (modules/monitoring.js)
Screens: KRI dashboard (tiles green/amber/red, sparkline trends, breach
list with aging); Program Health - the "across 1-6" view: RCSA completion,
overdue assessments, signals aging past SLA, risks lacking rationale,
risks without key controls, untested key controls, issue aging, rating
migrations this quarter; drill from any tile to the owning module.
Standard model: KRIs at RAU and program level with amber/red thresholds
and direction; program metrics computed live from the other entities (not
stored), so they always reconcile with what modules show.
Owner may know: 5-10 real KRI names + thresholds; the metrics their
committees actually see.

### C10 - Policy Governance  (modules/policy.js)
Screens: library (level/owner/status/review-date filters); governance map -
the 10 capability boxes each listing its governing documents (mirrors the
Home map); review calendar (upcoming/overdue reviews); exceptions log with
expiry.
Standard model: hierarchy policy -> standard -> procedure; each capability
has at least one named governing standard (e.g. "RCSA Standard" governs
1-5, "Risk Rating Methodology" governs 3, "Control Testing Standard"
governs 7); exceptions/waivers carry expiry + rationale.
Owner may know: the bank's document hierarchy names, committee names,
actual governing docs per capability, waiver process.

### Cross-cutting modules
home.js - the flow map (section 1) as a clickable diagram + 6 headline
KPIs. mywork.js - persistent approvals inbox by role (RCSA sign-offs,
signal dispositions, issue closures, policy reviews). explorer.js - search
+ radial relationship graph, now spanning all 13 entities. demo.js - the
tour, rebuilt around the money path in section 1.

## 6. What changes vs the v1 plan
- SCHEMA.md v2: the 13 entities above replace the 8 generic ones.
- CONTRACT v2: nav API gains tab/rail; theme tokens gain banner/rail
  colors; everything else unchanged.
- Cards: TASK-P1-01/P3-03 (shell chrome v2), TASK-P3-04 becomes home.js,
  module cards replaced by the 15 files in section 3. DataForge cards
  update for 13 entities. Session count ~24.
- Runbook: Parts 5 (sequence) and appendices regenerate; new Parts 9
  (versioning) and 10 (feedback loop) from docs/VERSIONING.md.
- The runbook rewrite happens once, after the questionnaire answers land.
