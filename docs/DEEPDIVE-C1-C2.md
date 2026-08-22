# DEEPDIVE-C1-C2.md - RAU Demographics & Attributes + Risk Identification
Status: DRAFT strawman for owner review. Supersedes the C1/C2 sections of
CAPABILITIES.md. Field lists here become SCHEMA v2; screen specs become the
TASK cards for rau.js and riskid.js. Marked >> Q items map to the focused
questionnaire.

Why these two first: the RAU is the unit everything else attaches to, and
the risk register is the first thing attached. Every later capability
(ratings, controls, RCSA, signals, testing, monitoring, policy) displays
itself THROUGH these two. If C1/C2 are convincing, the rest inherits it.

====================================================================
# C1 - RAU DEMOGRAPHICS & ATTRIBUTES  (modules/rau.js)
====================================================================
NOTE: Revision 1 (end of this file) captures the owner's confirmed model -
RAU = business x service, 3-layer hierarchy, ~850 RAUs, a common services
catalog, and the full AI-assisted new-RAU intake workflow. Where this
section conflicts with Revision 1, Revision 1 wins.

## 1.1 The mental model: demographics vs attributes
Two different kinds of facts live on a RAU, and the mockup should visibly
treat them differently:
- DEMOGRAPHICS - descriptive facts: who owns it, where it operates, how big
  it is, what it touches. Answer "what is this unit?"
- ATTRIBUTES - risk-relevant flags: characteristics that DRIVE things.
  Attributes power (a) signal-to-RAU matching in C6 ("reg change tagged
  payments -> every RAU with movesMoney"), (b) risk-applicability rules in
  C2 ("every RAU with handlesPII must assess the privacy-breach risks"),
  and (c) context for inherent ratings in C3.
Demographics describe; attributes OBLIGATE. That distinction is the design
thesis of this module, and the thing the mockup should sell.

## 1.2 Hierarchy (provisional)
Enterprise -> Business Line (L1, e.g. Consumer Banking) -> Sub-line (L2,
e.g. Home Lending) -> RAU (e.g. "Mortgage Origination - Underwriting").
Legal entities and regions are multi-value fields on the RAU, not levels.
>> Q1: real level count and names; whether legal entity is a dimension.

## 1.3 RAU fields (provisional full set)
IDENTITY   id RAU-####, name, description, status (proposed|active|retired),
           effectiveDate, retiredDate, successorRauId (for merges)
PLACEMENT  businessLineL1, businessLineL2, legalEntities[], regions[]
OWNERSHIP  execOwner (accountable executive), processOwner,
           riskOfficer1LOD (the BURM-type role), coveragePartner2LOD
SCALE      headcountFte, locationsCount, annualTxnVolume, annualRevenueMM
FOOTPRINT  keyProducts[], keyProcesses[], keySystems[], keyThirdParties[],
           customerSegments[]
ATTRIBUTES (the drivers - boolean unless noted)
           customerFacing, handlesPII, movesMoney, acceptsCardPayments,
           usesModels, thirdPartyDependent, crossBorder,
           regulatoryIntensity (low|medium|high),
           changeLevel (low|medium|high),
           manualProcessIntensity (low|medium|high)
RISK MEMORY (computed or loaded)
           priorLossCount12m, priorLossAmount12m, openIssuesCount,
           lastRcsaDate, lastRcsaResidualBand, nextRcsaDueDate
META       profileUpdatedDate, profileUpdatedBy, completenessPct (computed:
           % of expected fields populated)
>> Q2: which of these the bank actually records; what to strike/add.
>> Q3: do attribute-like flags exist today, and do they drive anything?

## 1.4 Screens
1. RAU DIRECTORY (route "raus") - the register. Toolbar: search, filters
   for L1/L2, region, status, residual band, change level, and ANY
   attribute (attribute filter is a picker: attribute + value). Columns:
   ID, Name, Business Line, Exec Owner, FTE, Residual (band chip), Last
   RCSA, Change (chip), open issues. Count strip on top. Toggle: flat
   table vs grouped-by-business-line.
2. RAU PROFILE (route "raus/:id") - the hero screen of the whole mockup.
   Header: name, id, status, residual band chip, next-RCSA-due chip.
   Body grid: Demographics card (ownership + placement + scale),
   Attributes panel (chips, on=filled/off=ghost, each chip tooltip says
   what it drives), Footprint card (products/processes/systems/third
   parties as pill lists), Risk Memory tiles (losses 12m, open issues,
   last/next RCSA). Below: related tabs - Risks | Controls | RCSA History
   | Signals | KRIs | Issues | Policies (each a filtered table via
   ctx.data.links; tabs for not-yet-built modules show a coming-soon
   empty state so C1 ships before the rest exist).
3. HIERARCHY BROWSER (route "raus/tree") - L1 -> L2 -> RAU tree, each node
   showing rollups: RAU count, worst residual, open issues. Click node ->
   filtered directory.
4. PROFILE QUALITY (route "raus/quality") - stale profiles (updated > 12
   months ago), completeness < 100%, RAUs missing a riskOfficer, retired
   RAUs with active risks. This is C9's feedstock and an easy wow ("the
   tool audits its own inventory").
5. EDIT (mock): on the profile, an Edit button flips demographics/
   attributes to inputs, Save updates in memory + toast; toggling an
   attribute toasts "Attribute changed - in the real system this would
   raise a Signal (see Signals tab)". Plants the C6 seed early.
>> Q4: who maintains the profile (role names) and on what refresh cadence?
>> Q5: volumes - how many RAUs total / per business line?
>> Q6: are reorgs (merge/split of RAUs) painful enough to mock the
   successor/retire flow?

## 1.5 Synthetic defaults (until answered)
5 business lines (Consumer, Commercial, Wealth, Payments, Enterprise
Functions) x 2-3 sub-lines x 3-6 RAUs = ~60 RAUs. Names read like process
units ("Wire Transfer Operations", "Deposit Account Opening", "Card
Disputes Processing", "Collateral Management").

====================================================================
# C2 - OPERATIONAL & COMPLIANCE RISK IDENTIFICATION  (modules/riskid.js)
====================================================================

## 2.1 The big design decision: library-first vs free-form
- Model A (free-form): each RAU writes its own risks. Familiar, and the
  reason real registers balloon into thousands of near-duplicates that
  cannot be aggregated.
- Model B (library-first): a curated ENTERPRISE RISK LIBRARY of standard
  risk statements, taxonomy-anchored. RAUs INSTANTIATE library risks
  (inheriting statement + classification, adding local context). New local
  risks are allowed but flagged for 2LOD review and possible promotion
  into the library.
RECOMMENDATION: the mockup demonstrates Model B with the local escape
hatch, because the mockup's job is to show how the real thing SHOULD work
- and aggregation ("show me Third Party risk across all RAUs") only works
under Model B. The register still FEELS free to a 1LOD user.
>> Q7: does a library exist today? Which model should the mockup advocate?

## 2.2 Applicability rules - where C1 pays off
Each library risk may carry an applicability rule: a list of RAU
attributes plus ANY/ALL semantics. Example: LIB-023 "Wire transfer
executed to wrong beneficiary" applies to RAUs where ALL of [movesMoney].
The kernel evaluates rules against RAU attributes and produces the
COVERAGE view: per RAU, applicable library risks not yet instantiated
("this RAU moves money but has not assessed the wire-error risk").
This single feature ties C1 to C2 and is the demo's first "aha".
Rule format kept deliberately trivial (attribute list + ANY/ALL) so
Copilot builds it reliably.

## 2.3 Taxonomy (provisional, editable seed data)
Two trees in one riskCategories entity, discriminated by `tree`:

OPERATIONAL (ORX-informed L1 set; L2 samples shown, 2-4 each):
  OP-1  Internal Fraud (unauthorized activity; internal theft & fraud)
  OP-2  External Fraud (payment fraud; application fraud; cyber-enabled fraud)
  OP-3  Conduct (sales practices; employee misconduct)
  OP-4  Legal (contract disputes; litigation)
  OP-5  People (capacity & key person; employment practices; safety)
  OP-6  Technology (availability/outage; change failure; capacity;
        obsolescence)
  OP-7  Information Security incl. Cyber (external attack; data breach;
        access management)
  OP-8  Data Management (data quality; records; data loss)
  OP-9  Transaction Processing & Execution (processing error;
        reconciliation; reporting error; product/process design flaw)
  OP-10 Third Party (vendor failure; concentration; oversight)
  OP-11 Business Continuity & Resilience (site loss; utility/infrastructure;
        pandemic)
  OP-12 Physical Security & Safety (physical attack; asset damage)
  OP-13 Model (design error; implementation; misuse)
  OP-14 Financial & Regulatory Reporting (financial reporting error;
        regulatory report error; tax)

COMPLIANCE (category -> regulation references; L2 samples):
  CM-1 Financial Crime Compliance (BSA/AML program; Sanctions-OFAC;
       Anti-bribery FCPA)
  CM-2 Consumer Protection (UDAAP; Fair Lending ECOA/FHA; TILA Reg Z;
       RESPA Reg X; HMDA Reg C; EFTA Reg E; TISA Reg DD; FCRA; SCRA/MLA;
       FDCPA; Flood/FDPA)
  CM-3 Privacy & Data Protection (GLBA Reg P; state privacy; cross-border)
  CM-4 Markets & Trading Compliance (Volcker; MNPI/insider; derivatives)
  CM-5 Prudential & Reporting Compliance (regulatory reporting; Reg W
       affiliate transactions; lending limits; CRA)
Compliance L2s carry regRefs into a small `regulations` reference entity
(id, shortName, citation, agency, summary) - ~25 seed rows - enabling
"show every risk under Reg E" filtering.
>> Q8: the bank's real L1s (and L2s if handy); how compliance risk is
   categorized - own taxonomy, obligations library, or regulation list?

## 2.4 Risk record fields (provisional)
id RSK-####, rauId, libraryId (null = local one-off), statement,
localContext (how it manifests in THIS RAU), type (operational|compliance),
catL1Id, catL2Id, regRefs[] (compliance), source (rcsa-cycle|signal|
loss-event|audit|exam|self-identified), sourceRef (e.g. SIG-0012),
identifiedDate, ownerRole, status (proposed|active|retired|merged),
successorRiskId, and the C3 fields (inherentL, inherentI, band, rationale,
impactDims) which this module displays read-only as chips.
Statement format default: single sentence "Risk that <event> due to
<cause>, resulting in <impact>" - guidance text on the intake form, not
enforced structure.
>> Q9: mandated statement format? who approves a new risk entering the
   register (role)?

## 2.5 Screens
1. RISK INVENTORY (route "risks") - global register. Toolbar: search,
   filters type/L1/L2/business line/RAU/source/status + "local-only"
   toggle (one-offs lacking library lineage). Columns: ID, Statement
   (truncated), RAU, Type chip, L1/L2, Inherent band chip (from C3),
   Source, Status. Views: flat | grouped by taxonomy | grouped by RAU.
2. RISK DETAIL (route "risks/:id") - statement + local context, taxonomy
   breadcrumb, library lineage ("instantiated from LIB-023, also assessed
   in 11 other RAUs" -> click-through list = instant aggregation story),
   source chain ("identified from Signal SIG-0012 on 2026-03-14"),
   regulation chips for compliance risks, inherent rating chip (deep-link
   to C3 worksheet when built), related controls/issues placeholders.
3. TAXONOMY BROWSER (route "risks/taxonomy") - two-tree view (tabs
   Operational | Compliance), each node: count of active risks, worst
   inherent band chip, click -> filtered inventory. The exec question
   "where are our concentrations" answered on one screen.
4. RISK LIBRARY (route "risks/library") - library entries: statement,
   classification, applicability rule (readable sentence: "applies where
   movesMoney"), instantiation count, status. Detail per entry: which
   RAUs assessed it, which applicable RAUs have NOT (the gap list).
5. COVERAGE (route "risks/coverage") - the C1xC2 engine output, grouped
   by RAU: applicable-but-missing library risks, local one-offs pending
   review. Button per gap: "Instantiate" -> prefilled intake.
6. INTAKE (route "risks/new") - mock form: pick RAU, pick library entry
   (filtered to applicable ones first) or "local risk", statement +
   context, classification (inherited or picked), source. Save = in
   memory + toast "Routed to 2LOD review - see My Work".
>> Q10: typical volumes - risks per RAU (5-15?), total register size,
   rough op-vs-compliance split.

## 2.6 Synthetic defaults (until answered)
Library of ~80 entries across both trees, ~10 with applicability rules.
600 risk instances across 60 RAUs (avg 10, range 4-18), ~65% operational /
35% compliance, ~8% local one-offs, sources weighted rcsa-cycle 60%,
signal 15%, loss-event 10%, audit/exam 10%, self-identified 5%.

====================================================================
# Build-order change
====================================================================
Foundation phases P1-P3 unchanged (canary, data pipeline, chrome). Then:
P4 = rau.js (2 sessions: directory+profile, then tree+quality+edit),
P5 = riskid.js (2-3 sessions: inventory+detail, taxonomy+library,
coverage+intake). Dashboard (home.js) initially ships with C1/C2 tiles
only and grows as later capabilities land. Everything else follows in
capability order. Session cards for P4/P5 get written from THIS document
once the questionnaire answers land.
(Revision 1 adds rau-intake.js to P4 - see below.)

====================================================================
# REVISION 1 (2026-08-22) - C1 confirmed by owner: the new-RAU workflow
====================================================================

## R1.1 Confirmed facts (replace provisional assumptions)
- A RAU is the INTERSECTION of a business (part of the company) and a
  service (a thing the bank does).
- RAUs align to a corporate hierarchy, generally 3 layers down, e.g.
  "CIB > Corp Real Estate"-level. (Exact layer names/count: open Q.)
- ~850 RAUs (not ~60): directory, synthetic volumes, and pagination all
  size to this.
- There is a COMMON SERVICES LIST (enterprise catalog). Selecting the
  services a RAU performs is a primary driver for building out RAU
  information. New entity `services`; raus gain serviceIds[].
- Capability 1 has (at least) two phases: DEMOGRAPHICS CREATION (the
  intake-to-approval workflow below) then RAU METADATA CREATION (owner to
  describe next).
- The real GRC embeds an AI agent (LLM) that works WITH a human team
  throughout intake. The mockup emulates this offline (R1.4).
- Prime directive of intake: never allow two RAUs to claim the same work.

## R1.2 The new-RAU pipeline (stages become raus.stage)
draft-intake -> uniqueness-review -> (returned-for-refinement ->
draft-intake) -> process-mapping -> standards-check -> pending-governance
-> metadata-creation -> active. Plus retired. Directory of "RAUs" filters
stage=active by default; a PIPELINE view shows everything in flight.

Stage detail:
1. INTAKE (submitter + LLM): pick LOB and sub-LOB; pick services from the
   catalog; proposed name + description; a bulleted list of the process's
   high-level steps. The LLM asks clarifying questions inline when its
   analysis needs more (chat-style panel on the form).
2. UNIQUENESS REVIEW (LLM analyzes, human decides): LLM assesses whether
   the described processes are truly unique WITHIN THE LINE OF BUSINESS
   (goal: no two RAUs taking credit for the same process; other criteria
   possible). Output: findings, rationale, similar-RAU candidates,
   recommendation. The human reviewer reads the LLM logic and either
   returns to the submitter for refinement (with comments) or advances.
3. PROCESS MAPPING (submitter + LLM coach): each intake bullet expands
   into 2-10 detailed steps drawn in the tool. HANDOFFS are first-class:
   steps where this process RECEIVES something from another RAU or
   PROVIDES something to another RAU, with the counterparty RAU named.
   The LLM coaches conversationally ("what comes next?"), makes
   contextual suggestions, and flags gaps - no mapping expert needed.
4. STANDARDS CHECK (LLM): the map is validated against logic and
   process-mapping standards; all standards must pass.
5. GOVERNANCE APPROVAL (human): approves exit from demographics creation
   into metadata creation.

## R1.3 Data model additions/changes
- services: { id SVC-###, name, description, category }  (catalog size: open Q)
- raus adds: serviceIds[], stage (enum above), intakeBullets[] (strings),
  processMap: [{bullet, steps:[{id, text, type (task|decision|
  handoff-in|handoff-out), counterpartyRauId?, artifact?}]}],
  uniquenessReview: {similar:[{rauId, score, reasons[]}], rationale,
  recommendation, decision, decidedBy, comments},
  assistantLog: [{who (user|assistant), text}]  (canned transcript for demo)
- Handoffs are indexed by the kernel from processMap steps into a
  queryable relation: rau PROVIDES-TO rau / RECEIVES-FROM rau (+ artifact).
  They appear on profiles, in Explorer as a new edge type, and later feed
  C6 (a change in RAU-X signals its handoff counterparties).

## R1.4 Emulating the LLM offline (deterministic AI-in-a-costume)
No model runs in the demo; the "AI" is heuristics presented in an
assistant panel - which also makes it stage-proof (same output every run):
- Clarifying questions (intake): rules table keyed on gaps - description
  under N words, no volume mentioned, bullets < 3, service picked but not
  reflected in bullets -> ask a templated, context-filled question.
- Uniqueness analysis: real token-overlap scoring of the intake's name +
  description + bullets + services against existing RAUs in the same LOB
  (shared services weighted heavily). Output: top-5 similar RAUs with %
  scores and assembled rationale sentences ("shares services SVC-012,
  SVC-031; bullet 3 'collect monthly escrow' resembles step 'escrow
  collection' in RAU-0412"). Recommendation thresholds: >70% return,
  40-70% flag for reviewer judgment, <40% advance.
- Mapping coach: after each step edit, rules fire - no decision step yet
  ("what happens if step N fails?"), no handoffs declared ("does anything
  arrive from another RAU?"), bullet with <2 steps, step without a verb.
  Scripted deeper dialogue for the demo-story RAU.
- Standards check: a visible lint checklist - every bullet expanded to
  2-10 steps; handoffs identified or explicitly attested none; every
  decision step has 2+ outgoing paths; steps start with verbs; single
  start/end. Pass/fail per rule, all-green gates the stage.

## R1.5 Screens (rau-intake.js, new module; rau.js keeps directory/
profile/hierarchy/quality)
1. INTAKE WIZARD - form + assistant panel (chat-style, canned).
2. UNIQUENESS REVIEW - reviewer queue item: LLM findings, similarity
   candidates w/ open-profile links, rationale, recommendation; actions:
   Return with comments | Advance. (Surfaces in My Work.)
3. MAP BUILDER - bullets as lanes, steps as cards (form-based add/edit/
   reorder, NOT drag-drop - keeps the Copilot build reliable), handoff
   marking with counterparty RAU picker, live standards checklist,
   assistant coach panel.
4. GOVERNANCE - summary of everything + Approve -> stage=metadata-creation.
5. PIPELINE BOARD - all in-flight intakes by stage with aging.
Profile additions (rau.js): a Process tab (read-only rendered map,
handoff steps highlighted) and a Handoffs tab (provides-to / receives-from
tables with counterparty links).

## R1.6 Demo beat: "watch a RAU get born"
Intake for "Escrow Disbursement Processing" -> AI flags 82% overlap with
an existing servicing RAU -> reviewer returns with comments -> submitter
narrows scope -> map drawn with coach (one handoff to "Payment Operations")
-> standards go green -> governance approves. Then open the counterparty
RAU's profile: the new handoff already shows. Tour scenes 2-4 material.

## R1.7 Open questions for the owner (numbering continues the doc's Q1-10)
Q11 Hierarchy: names of the 3 layers and where the RAU attaches (is
    "CIB > Corp Real Estate" LOB > sub-LOB, with one more layer between
    or below?). Same tree for services alignment, or independent catalog?
Q12 Services: roughly how many in the common list, and are they grouped
    (families/categories)? Same service performable by many RAUs across
    businesses (implied by intersection definition - confirm)?
Q13 Uniqueness scope: uniqueness is judged within the LOB - so similar
    work in two DIFFERENT LOBs is legitimate? What are the "other
    criteria" the LLM reviews, if known?
Q14 Roles: who submits (anyone in the business?); who is the human
    uniqueness-review team (central RAU governance? 2LOD?); who is the
    final governance approver - same team or different? Names for the mock.
Q15 Handoffs: when a map names counterparty RAU-X, is RAU-X notified /
    must it CONFIRM the handoff (two-sided agreement)? Are handoffs typed
    (data, funds, documents, approvals)?
Q16 Standards: do written process-mapping standards exist that the lint
    should mirror? Any rules beyond 2-10 steps per bullet + handoff
    identification?
Q17 Outcomes: besides return-for-refinement, can intake be DECLINED
    outright ("this work belongs to existing RAU-0412 - raise a change
    to that RAU instead")? Does that conversion exist?
Q18 Pipeline volume: typical new-RAU requests in flight (sizes the board
    and synthetic data); typical time-in-stage if known.

====================================================================
# REVISION 2 (2026-08-22) - owner answers resolve Q11-Q18
====================================================================

## R2.1 Hierarchy (Q11 resolved)
Business structure: Enterprise > LOB > SubLOB (owner's shorthand:
"WF > LOB > SubLOB"). RAUs are created AT the SubLOB (L3) level. The
services catalog is a completely separate structure from the business
hierarchy; services align to the RAU, not to the org tree.
Data: orgNodes {id, level (enterprise|lob|sublob), parentId, name};
raus.subLobId replaces earlier businessLineL1/L2 fields (L1/L2 derived by
walking up). Synthetic data uses a NEUTRAL enterprise node name; the real
environment's own labels arrive with real data.

## R2.2 Services catalog (Q12 resolved)
The catalog has branching levels of detail (a tree). A RAU selects
MULTIPLE service nodes to describe what it does in a consistent,
comparable way. The same service (e.g. "Underwriting Services") appears
across many RAUs because different businesses perform it - that is the
point: services are the cross-business comparability spine, and a heavy
input to uniqueness scoring (same SubLOB + overlapping services = high
overlap signal).
Data: services {id SVC-####, parentId, name, description}; raus.serviceIds[]
may reference any level (deepest available preferred). Default depth for
synthetic catalog: 3 levels, ~120 nodes. (Owner to correct depth/size.)

## R2.3 RAU category check (Q13 resolved - NEW requirement)
Three major RAU categories: BUSINESS SERVICE RAU | SHARED SERVICES RAU |
ENTERPRISE RAU. This is a major branch of the applicability tree, so the
intake analysis gains a CATEGORY CHECK alongside uniqueness: the
assistant evaluates whether the described RAU "sounds like" the category
selected (or recommends one), with rationale, and the reviewer confirms.
Working definitions for the mockup (owner to correct):
- Business Service RAU: performs the business of an LOB/SubLOB.
- Shared Services RAU: performs services consumed by multiple businesses.
- Enterprise RAU: performs enterprise-level functions.
Heuristic emulation: keyword/service-based classifier (e.g. services
selected across many LOBs' RAUs + language like "on behalf of" ->
shared-services lean) with a confidence and a one-paragraph rationale.
Data: raus.category (business-service|shared-services|enterprise),
uniquenessReview gains categoryCheck {suggested, confidence, rationale,
confirmed}.

## R2.4 Roles (Q14 resolved)
Submitters of intake: the future RAU Owner, their delegate, or a Business
Control Management (BCM) team. Front-end governance: the central RCSA RAU
GOVERNANCE team (they run the uniqueness gate and the final approval in
this phase). Every active RAU ultimately carries five assigned roles:
  RAU Owner | RAU Owner Delegate | BCM Contact |
  ORBO (Operational Risk) | BACO (Compliance Risk)
Role assignment happens during Metadata creation (next section from
owner). Data: raus.roles {owner, delegate, bcmContact, orbo, baco} - all
masked-name or role-label strings in the demo. My Work queues key off
these role names; the demo role-switcher lists exactly these plus "RCSA
RAU Governance".

## R2.5 Handoffs (Q15 resolved)
Initial submission is TRUSTED; counterparty confirmation happens after
approval, not as an intake gate. Mockup behavior: on activation, each
declared handoff creates a "confirm handoff" item in the counterparty
RAU's My Work; handoffs carry confirmationStatus
(trusted-pending-confirmation|confirmed). No blocking anywhere. Handoffs
remain untyped for now.

## R2.6 Standards (Q16 resolved)
Formal mapping standards exist but are explicitly OUT OF SCOPE for the
mockup - the generic lint checklist from R1.4 stands as the stand-in, and
the runbook notes it as a placeholder the real build replaces.

## R2.7 Decline with redirect (Q17 resolved)
Uniqueness review gains a third outcome: DECLINE WITH REDIRECT - the
requester is pointed to the RAU Owner of the overlapping RAU to discuss:
either refine the submission to demonstrate difference, or recognize the
work is already claimed. Data: uniquenessReview.decision (advance|
return-for-refinement|decline-redirect), redirectRauId. The declined
intake stays in the pipeline history with its redirect target - the
paper trail of prevented double-counting is itself demo material.

## R2.8 The pipeline is CRUD, not just create (Q18 resolved)
~10 requests in flight at a time ACROSS TYPES: new RAU, plus mergers,
deletions (retire), and splits. Design response:
- Entity rename in spirit: the pipeline holds RAU CHANGE REQUESTS:
  {id RCR-###, type (new|merge|split|retire), stage, requester, dates,
  payload}. "New" uses the full wizard (R1.2); merge/split/retire use a
  short form: pick the RAU(s), rationale, effective date.
- Every non-new request gets an IMPACT PREVIEW computed live from links:
  "Merging RAU-0214 into RAU-0388 moves 14 risks, 9 controls, 3 handoffs,
  2 open issues; 2 duplicate risks flagged for consolidation." Same
  governance pattern: assistant assessment -> RCSA RAU Governance
  decision. Successor linkage (successorRauId) records where retired
  RAUs' work went.
- Synthetic pipeline: 10 in-flight requests spread across types/stages,
  plus a handful of completed ones for history.

## R2.9 Remaining light confirmations (non-blocking)
- Services tree: roughly how deep / how many nodes, and is selection
  allowed at any level or leaf-only? (Defaulting: 3 levels, ~120 nodes,
  any level.)
- Category definitions in R2.3: correct as working definitions?
Next from owner: the RAU METADATA CREATION step (the phase after
governance approval), then C2 risk identification revisit.

