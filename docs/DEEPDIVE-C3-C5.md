# DEEPDIVE-C3-C5.md - Capabilities 3, 4, 5: build plan and open questions

Status: Revision 0 (plan + questionnaire). The owner's answers become
Revision 1+ and are then authoritative, same as DEEPDIVE-C1-C2.md.
Supersedes the C3/C4/C5 "standard model" sections of docs/CAPABILITIES.md
where they conflict with the shipped C1/C2 build.

Anchor to the shipped model, not the old provisional one:
- A "risk instance" is a confirmed register row: RAU x risk event, with
  score, decider, date, rationale, and attached MCR ids on the compliance
  side. (The owner's own term, from the gallery ask.) C3 rates these, C4
  attaches controls to these, C5 assesses and challenges these.
- Hierarchy is WF > LOB > SubLOB; ~850 RAUs; 90 events (50 op, 40
  compliance); ~8,000 MCRs with a ~2,000 head.
- The five RAU roles exist from governance approval: Owner, Delegate,
  BCM Contact, ORBO, BACO.

## 1. Commitments already on screen (must be honored or consciously changed)

From the skeleton pages, the gallery vignette, module copy, and the R4
role demos, stakeholders have already been shown:

C3 - Inherent Risk Rating Documentation & Calculation
- Rates each confirmed risk on a RAU: likelihood, impact across standard
  dimensions, written rationale, on the program's OWN inherent rubric
  (explicitly not the applicability rubric).
- Screens promised: rating worksheet with anchored definitions; a
  documentation completeness view (missing rationale, stale ratings);
  rating distribution by RAU / SubLOB / LOB, expandable in place.

C4 - Control Identification
- Controls mapped to confirmed risks; attributes shown so far: type
  (Preventive/Detective), automation (Manual/Automated), owner, key flag.
- Screens promised: control inventory (per RAU + enterprise) with caret
  expansion risk -> controls; coverage gaps (confirmed risks with no key
  control); control detail with linked risks and a test-history slot for
  C7/C8.
- The gallery vignette "Assign a control to a risk instance" is the
  promised basic move and graduates into the real module.

C5 - RCSA Administration (incl. residual)
- Front line submits, ORBO and BACO challenge (promised repeatedly in the
  R4 role demos and on the workbench: "challenge happens in Capability
  5"), residual computed from inherent ratings and control effectiveness,
  sign-off recorded.
- Screens promised: cycle dashboard (every RAU x status, expandable);
  assessment workspace per RAU (line items per risk, control environment
  judgment, residual out, challenge log); prior-cycle comparison with
  direction of change.
- My Work's 2LOD read-only feed becomes real queues here.

## 2. Provisional data model additions (final shape depends on answers)

New entity files under demo/data/ (script-tag .js like the rest):

- controls.js: { id CTL-nnnn, name, description, scope (enterprise |
  lob | rau), rauIds[] or lobId for shared ones, ownerRole/ownerName,
  key (bool), type (preventive|detective|corrective), automation
  (manual|automated|it-dependent), frequency (per-event|daily|weekly|
  monthly|quarterly|annual), status, createdDate, sourceSystem? }
- controlLinks.js (or inline riskInstance ids on the control): links
  control -> risk instance (rauId+eventId), many-to-many; optional
  mcrIds[] per link on the compliance side.
- ratings.js: inherent rating per risk instance: { rauId, eventId,
  likelihood 1-5, impact {dim: 1-5 per dimension}, score, band,
  rationale, ratedBy, ratedDate, status (current|stale|missing),
  suggested {likelihood, impact, basisText} }
- cycles.js: { id CYC-nnnn, rauId, period, status (scoped|in-assessment|
  submitted|in-challenge|approved), lineItems [{eventId, inherentBand,
  controlEnv, residualBand, override?, rationale}], challenge
  [{eventId, by (ORBO|BACO), type, comment, response, resolved}],
  submittedBy/Date, challengedBy/Date, approvedBy/Date, direction }
- rubric additions: inherent rubric (anchors per likelihood level and
  per impact dimension) and the residual matrix, either in rubric.js or
  a second rubrics entity.

Kernel data API additions: controlsOfRau, controlsOfInstance,
instancesOfControl, ratingOf(rauId,eventId), cycleOf(rauId, period),
cyclesOfRau, plus add/remove mutators mirroring addRegister/
removeRegister so demos stay reversible.

## 3. Engine additions - the honest-math assistants (one per capability)

Same doctrine as C1/C2: no fake AI; deterministic computation over real
fields, presented as the standardization story.

- C3 suggested rating: computed from RAU demographics that already exist
  (annual volume, FTE, prior losses, change level, customer-facing) plus
  a per-event severity profile (new generator field). Produces a
  suggested likelihood/impact with a written basis ("volume in the top
  quartile of the LOB; two loss events in 12 months"), which the owner
  accepts or overrides with rationale. Peer-consistency check: same event
  rated far from the LOB median flags an outlier chip.
- C4 control intelligence: (a) suggestion - controls commonly linked to
  this event across the bank, ranked by attach rate; (b) duplicate check
  on new-control creation, reusing the C1 token-similarity pattern;
  (c) coverage math - key-control gaps per RAU and per event; (d)
  description lint against a control-writing standard (mirrors map lint).
- C5 challenge triage: ranks line items for ORBO/BACO attention by
  computable signals: peer outlier rating, applicability score vs
  inherent band mismatch, thin rationale (length/quality), rating stale
  vs profile change, control coverage weak. Residual = matrix lookup
  (inherent band x control environment) with judgmental override + logged
  rationale. Direction vs prior cycle computed, not stored.

## 4. Module build plan

modules/inherent.js (~40KB target)
- Rail "3. Inherent ratings" replaces the skeleton route (cap3 redirects).
- Landing: RAU list with rating progress (rated / confirmed instances),
  filters shared-style with the directory.
- Worksheet per RAU: line per confirmed risk instance; opening one shows
  the anchored likelihood picker, per-dimension impact, computed score +
  band, the assistant's suggested rating with basis, required rationale;
  accept-suggestion is one click, override demands text.
- Distribution view: band matrix by LOB/SubLOB with caret expansion.
- Completeness view: missing rationale, stale ratings (feeds C9 later).
- Inherent rubric page beside the applicability rubric.

modules/controls.js (~45KB)
- Rail "4. Controls" replaces the skeleton route.
- Inventory: enterprise + per-RAU views, caret expansion RAU -> risk
  instance -> controls; filters (key, type, automation, owner).
- Control detail: attributes, linked risk instances across RAUs (shared
  controls shown honestly), description-lint result, test-history slot
  labeled for C7/C8.
- Assign flow: from a risk instance, pick from suggestions or search the
  library; create-new runs the duplicate check first (assistant analyzes,
  human decides, same as RAU intake).
- Coverage: confirmed risks with no key control; single-control
  dependencies; enterprise controls with the widest blast radius.

modules/rcsa.js (~50KB)
- Rail "5. RCSA cycles" replaces the skeleton route.
- Cycle dashboard: all RAUs x current period, status pipeline, expandable
  by LOB/SubLOB in place.
- Assessment workspace per RAU-cycle: line items per confirmed risk
  instance (inherent carried from C3, control environment judgment
  informed by C4 coverage, residual out); submit gate requires every line
  complete.
- Challenge: ORBO sees operational lines, BACO sees compliance lines,
  triage-ranked; concur or challenge with comment; owner responds;
  resolution logged; the mywork 2LOD queues point here and become real.
- Sign-off panel and approved snapshot; prior-cycle comparison with
  direction arrows; residual heatmap.

Cross-cutting updates in the same round(s):
- kernel/core.js: BUILT set grows (3,4 then 5); caps closure/build-order
  already handle it; new data indexes and mutators; preflight counts.
- kernel/engine.js: sections above; rubric() split into applicability +
  inherent + residual accessors.
- skeletons.js: cap3/cap4/cap5 routes retire as each module lands (keep
  file for nothing? remove registrations and rail entries; page routes
  redirect to the real modules so old links survive).
- home.js: flow boxes 3/4/5 light up as BUILT; lens build-order readout
  updates automatically.
- mywork.js: ORBO/BACO queues become real challenge queues; owner queue
  gains "ratings to document" and "RCSA lines to complete".
- riskid.js: confirmed rows deep-link "rate this" (C3) and "controls"
  (C4) chips once built - the trace strip already declares feeds 3,5.
- gallery.js: assign-control vignette graduates (links into the real
  module; keeps the vote card); new vignettes optional for residual
  override and challenge resolution.
- demo.js: role demos gain the now-real scenes (ORBO/BACO challenge,
  owner rating + assessment); one new story demo "One risk, front to
  back": confirm on the workbench -> rate -> attach controls -> assess ->
  challenge -> residual (the money path for 1-5).
- rau-profile.js: profile tabs gain Ratings and Controls summaries.

## 5. Generator additions (tools-dev/generate-data.js, same seed style)

- Event severity profiles (drives C3 suggestions): typical impact
  magnitude class per event.
- Controls: bank-wide library sized per answers (default ~6,000 total;
  8-20 linked per RAU; 1-4 per risk instance; ~15% enterprise-shared,
  rest LOB/RAU-local); attach-rate realism so C4 suggestions rank
  sensibly; deliberate coverage gaps (~8% of confirmed instances lack a
  key control) so the gap screen has a story.
- Ratings: full coverage for complete-risk-ID RAUs minus a deliberate
  documentation debt (~10% missing rationale, ~5% stale); story RAU gets
  hand-crafted ratings with readable rationale.
- Cycles: one current period in flight at mixed stages across RAUs
  (dashboard looks alive), one prior approved period for every RAU (so
  direction arrows work), hand-crafted challenge thread on the story RAU
  (one ORBO challenge resolved, one BACO challenge open).
- CSV templates for each new entity in data-staging.

## 6. Sequencing proposal

Two rounds, because 5 consumes 3 and 4 and each round should be
browser-verified and feedback-able:
- R5: C3 + C4 (inherent.js, controls.js, engine + data + generator,
  skeleton retirement for 3/4, demo/mywork/home updates for 3/4).
- R6: C5 (rcsa.js, cycles data, challenge queues, "One risk, front to
  back" demo, skeleton retirement for 5, kit/runbook refresh decision).
Single-round alternative is possible but pushes ~10 files and ~150KB of
new module code in one review bite; feedback quality usually drops.

Risks / watchpoints:
- File ceilings: rcsa.js is the fattest; keep under ~55KB or split a
  challenge.js helper module.
- Register mutation: rating/cycle records must survive workbench Reopen
  (a reopened instance should mark its rating and cycle line orphaned,
  not crash) - add a data-integrity pass to the harness.
- Terminology: "risk instance", "control environment", band names -
  confirm before they get baked into 30 screens.

## 7. Questionnaire (answers become Revision 1)

Defaults ship if the answer is "standard is fine".

C3 - Inherent rating
1. Unit of rating: per risk instance (RAU x event), compliance rated at
   event level with MCRs inheriting? Or are MCRs rated individually?
   Default: per instance, event level, MCRs inherit.
2. The rubric: likelihood x impact on 5x5? Impact dimensions (default:
   financial, regulatory, customer, reputational, operational) combined
   by max or weighted? Band names (default Low / Moderate / High /
   Critical)? Anchored definitions per level?
3. Who rates and what may inform the suggestion: front line first pass
   with ORBO/BACO challenge deferred to C5 (mirroring C2)? Is it
   legitimate for the assistant to draw on volumes, FTE, prior losses,
   change level, and peer-RAU ratings for its suggested rating?
4. Documentation standard: is rationale required on every rating or only
   overrides/high bands? Any evidence attachments concept worth faking?
5. Rollup: does a RAU carry an overall inherent rating, and how derived
   (default: max band across its instances)?

C4 - Controls
6. Library shape: central control inventory with enterprise/shared
   controls mapped across RAUs, plus RAU-local controls? Is there a
   control system of record (a name like RRCM) or are controls authored
   in the GRC?
7. Scale: roughly how many controls bank-wide, per RAU, per risk
   instance? Default: ~6,000 / 8-20 / 1-4.
8. Attributes: which matter (key flag + criteria, preventive/detective/
   corrective, manual/automated/IT-dependent, frequency, owner)? Any
   bank-specific ones (SOX flag, control taxonomy, evidence links)?
9. Linking: controls attach at the risk-instance level? On the
   compliance side, do controls also map to specific MCRs/obligations?
   Default: instance level, optional MCR tags.
10. Creation governance: does a new control get the RAU treatment
    (assistant duplicate check, then a human gate - whose?) or lighter
    (owner creates, 2LOD reviews in cycle)?

C5 - RCSA administration
11. Cycle shape: frequency (annual per RAU? rolling by quarter?
    risk-based tiers?) and the real stage names of one cycle. Default:
    annual + triggered, scoped -> in-assessment -> submitted ->
    in-challenge -> approved.
12. Residual: matrix lookup of inherent band x control environment
    rating (Strong/Satisfactory/Weak), override allowed with rationale?
    At this maturity does control effectiveness come from owner judgment
    (C7 test results wired in later)?
13. Challenge mechanics: what exactly can ORBO/BACO do to a line item
    (concur / challenge with comment / direct a change / escalate)? Does
    the C5 challenge also cover C2 applicability decisions (rejections
    included) or only ratings? Who resolves a standoff?
14. Sign-off: who signs a completed RCSA (RAU Owner? Delegate allowed?)
    and is there a 2LOD concurrence or exec attestation above it?

Logistics
15. One round or two (R5 = 3+4, R6 = 5)? And which of the three
    capabilities carries the most stakeholder weight, so depth and demo
    time go there first?
