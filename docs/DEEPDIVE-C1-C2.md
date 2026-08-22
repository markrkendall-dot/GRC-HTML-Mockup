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
