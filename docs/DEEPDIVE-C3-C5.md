# DEEPDIVE-C3-C5.md - Capabilities 3, 4, 5: specification and round plan

Status: Revision 1 (owner's questionnaire answers integrated 2026-08-23).
This revision is authoritative, same standing as DEEPDIVE-C1-C2.md.
Supersedes the C3/C4/C5 sections of docs/CAPABILITIES.md.

Anchors from the shipped C1/C2 build:
- A "risk instance" is a confirmed register row: RAU x risk event, with
  score, decider, date, rationale, attached MCR ids on the compliance
  side. C3 rates instances, C4 attaches controls to instances, C5 keeps
  the whole assessment alive and affirmed.
- WF > LOB > SubLOB; ~850 RAUs; 90 events (50 op / 40 compliance);
  ~8,000 MCRs with a ~2,000 head; five RAU roles from governance
  approval (Owner, Delegate, BCM, ORBO, BACO).

## 1. Decisions log (owner answers, condensed)

C3
1. Ratings attach to risk instances only: impact and likelihood per
   instance. MCRs carry no direct rating; risk events carry no rating.
   Compliance aggregates outside RCSA (CARA - Compliance Aggregated
   Risk Assessment) for its own purposes. Out of scope here.
2. Rubric: owner asked for an industry-leading model. Firm constraint:
   no customer / regulatory / reputational impact scores "based on
   subjective stuff". Design in section 2 (evidence-anchored rubric).
3. RAU Owner rates using all available information; display is our
   choice. Assistant may draw on any data in the platform.
4. Rationale required ONLY on overrides. Accepting the evidence-based
   suggestion needs no text.
5. RAU-level rollup: owner open to ideas, must be simple to explain and
   calculate. Proposal in section 2.4.
6. One central control inventory. Controls may be marked shared and used
   by RAUs other than the owning RAU. The GRC is the system of record
   for controls (no upstream feed).
7. Scale: ~6,000 controls bank-wide, 8-20 linked per RAU, 1-4 per risk
   instance.
8. Key flag exists but "it's stupid" as a self-declared checkbox. The
   demo must show key status DERIVED from facts, better than asking.
   Other attributes standard: preventive/detective/corrective,
   manual/automated/IT-dependent, frequency, owner.
9. Controls align to risk instances. "Expected controls": when a
   defined situation is true, the RAU is expected to select a specific
   control (some FCRM risks have expected controls). Control-to-MCR
   connection happens in offline CARA - off the table.
10. Creation is lighter touch (no governance gate), but the system
    recommends: (a) shareable inventory controls for direct mitigation
    where they fit, (b) the expected control for the risk/MCR type,
    (c) a drafted example control as a directional skeleton the
    business then documents. MCR metadata may carry recommended
    control types.
11. No staged cycle pipeline and no formal 2LOD tollgate. Annual review
    and affirmation required; everything else happens through triggers
    and adoption/adaptation to change. Second line uses the system to
    find the non-standard and unfamiliar; settled problems are not
    relitigated.
12. Control design and control performance ratings roll into an overall
    control effectiveness. Simple matrix of control environment
    strength x inherent level -> residual (High / Moderate / Low).
13. Risk (2LOD) can challenge ANY record at ANY time: "I think this
    thing in the system is wrong." Simulate with a mechanism like the
    demo feedback drawer, but in-universe.
14. Owner signs the annual affirmation. No one above, no 2LOD
    concurrence step.
15. Plan several rounds in writing; walk through them one at a time.

## 2. Capability 3 design - evidence-anchored inherent rating

### 2.1 The rubric (the answer to "no subjective scores")

Model: likelihood x impact on 5 levels each; inherent band from a 5x5
grid -> Low / Moderate / High / Critical. The differentiator is that
every level is anchored to something countable, and the assistant
computes a suggested level FROM PLATFORM DATA with provenance chips,
exactly like the metadata survey. Subjectivity is allowed only in the
override, where rationale is mandatory (decision 4). The override rate
itself becomes a program metric (C9 later).

LIKELIHOOD (frequency-anchored, 5 levels):
  L5 Expected      >= 12 times a year
  L4 Likely        1 - 12 times a year
  L3 Possible      once in 1 - 3 years
  L2 Unlikely      once in 3 - 10 years
  L1 Rare          less than once in 10 years
Suggested from: RAU annual volume x the event's industry error-rate
class (new generator field), the RAU's 12-month loss count, and the
count of peer RAUs (same event) reporting occurrences.

IMPACT = worst credible outcome, scored on four fact-anchored lenses;
the lens score is the level whose anchor the credible outcome reaches.
Overall impact = MAX across lenses (worst credible outcome doctrine).

  Financial (direct loss + remediation, absolute enterprise bands):
    I1 < $50k | I2 $50k-500k | I3 $500k-5M | I4 $5M-25M | I5 > $25M
  Customer (countable harm):
    I1 < 10 customers | I2 10-100 | I3 100-10k | I4 10k-100k
    | I5 > 100k customers or any systemic restitution program
  Regulatory (anchored to the obligation profile, not opinion):
    I1 no obligation nexus | I2 obligation nexus, informal criticism
    plausible | I3 MRA-class finding plausible | I4 civil money penalty
    / formal action plausible | I5 consent-order or license-threatening
    Suggested from data: count and head-status of attached MCRs, the
    parent event's enforcement flag (new generator field).
  Operational disruption (countable):
    I1 < 1 hour degradation | I2 < 1 day | I3 1-3 days or backlog week
    | I4 3-10 days | I5 > 10 days or market-facing outage
    Suggested from: handoff count (dependency blast radius from the
    process map) and service criticality class.

Reputational is NOT a scored dimension. It is a derived flag (customer
lens >= I4, or regulatory lens >= I4, or external-visibility class on
the event) shown as a chip. This is deliberate and stated on the rubric
page: reputational damage is an outcome of the others; scoring it
separately is where the subjectivity complaint comes from.

GRID (5x5 -> band): standard severity-dominant skew.
  Impact 5: M H C C C     (columns = likelihood 1..5)
  Impact 4: M H H C C
  Impact 3: L M H H C
  Impact 2: L M M H H
  Impact 1: L L M M H
Bands: L=Low, M=Moderate, H=High, C=Critical.

### 2.2 The worksheet flow

Per confirmed risk instance on a RAU:
- Assistant panel: suggested likelihood + per-lens impact, each with
  evidence chips ("1.2M items/yr from the profile", "3 head MCRs
  attached", "6 outbound handoffs"). One click accepts all.
- Override any level: picker with the anchor text visible; rationale
  becomes required; the record stores both suggested and final.
- Computed: impact = max lens, band from the grid, displayed with the
  chip trail so the number is defensible in a room.
- Peer consistency: same event across the LOB - if this rating sits
  2+ levels from the LOB median, an outlier chip appears (informative,
  not blocking; it feeds the C5 attention view).

### 2.3 Screens (module inherent.js)

- Landing: RAU list with rating progress (rated / confirmed instances),
  shared-filter pattern from the directory.
- Worksheet per RAU (the core screen, per 2.2).
- Inherent rubric page: anchors, grid, and the reputational stance,
  next to the applicability rubric.
- Distribution: band matrix by LOB / SubLOB, caret expansion in place.
- Completeness: unrated instances, stale ratings (>12mo), overrides
  (all carry rationale by construction; the list shows density).

### 2.4 RAU rollup (proposal, owner to react in R5 review)

Headline: RAU inherent band = the highest band among its instances,
labeled with its drivers ("High - driven by Payment execution errors,
Sanctions screening failure"). One max(), one sentence.
Detail: a count strip "1C 4H 12M 30L" wherever the headline shows
(profile chip, directory column, distribution view). No weighted math.

## 3. Capability 4 design - controls with derived key

### 3.1 Inventory model

Central inventory, GRC as system of record. Control: id CTL-nnnn, name,
description, owningRauId, shared (bool), type (preventive | detective |
corrective), automation (manual | automated | it-dependent), frequency,
ownerName, designRating, performanceRating, status, createdDate,
declaredKey (bool, kept ONLY to contrast with derived key).
Links: control <-> risk instance (rauId+eventId), many-to-many; a
shared control links to instances on RAUs other than its owner.

### 3.2 Expected controls

Rule records: { when: {eventId | mcrId | eventCategory}, controlId or
controlType, note }. Seeded heavily on FCRM-flavored events (sanctions
screening, AML monitoring) and on head MCRs whose metadata carries
recommended control types (new generator field, per decision 10).
Coverage treats a missing expected control as the loudest gap class.

### 3.3 Derived key (the demo moment, decision 8)

A control DERIVES key when any rule holds, each shown as a chip:
  K1 Sole mitigant: only control on an instance rated High/Critical.
  K2 Expected: it is the expected control for a live situation.
  K3 Concentration: linked to 5+ instances, or shared by 3+ RAUs.
  K4 Severity: linked to any Critical instance.
The inventory shows derived vs declared side by side with a
disagreement filter ("declared key, derives non-key" and the reverse).
The pitch on screen: key status is a fact about the risk landscape,
recomputed as the landscape moves; a checkbox goes stale the day after
it is ticked.

### 3.4 Recommendation assistant (decision 10)

When attaching mitigation to a risk instance, three tiers in one panel:
  1. EXPECTED - rule matches (must-address; dismissing needs a note).
  2. SHAREABLE MATCHES - inventory controls linked to this event on
     peer RAUs, ranked by attach rate and tag overlap, marked shared.
  3. DRAFT SKELETON - a generated directional example (name pattern,
     type, automation suggestion, description skeleton from the event
     or MCR profile) that pre-fills the create form for the business
     to finish. Clearly labeled a starting point, not a control.
Creation is light: save creates the control owned by this RAU; the
duplicate check runs advisory-only (similar controls listed, no gate).

### 3.5 Screens (module controls.js)

- Inventory: enterprise + per-RAU, caret expansion RAU -> instance ->
  controls; filters (derived key, type, automation, shared, owner).
- Control detail: attributes, design/performance ratings, derived-key
  chips, linked instances across RAUs, description lint, C7/C8
  test-history slot (labeled future).
- Attach flow from a risk instance (per 3.4), also reachable from the
  workbench dispositioned rows and the RAU profile.
- Coverage: expected-control-missing (loudest), High/Critical
  instances with no effective control, single-point-of-mitigation
  list, derived-vs-declared disagreements.

## 4. Capability 5 design - living RCSA, annual affirmation, challenge

### 4.1 The model (decision 11 reframe)

There is no staged cycle and no challenge tollgate. The RCSA is a
living record: C1-C4 changes flow in as they happen (triggers, later
fed by C6). What C5 adds:
- ANNUAL AFFIRMATION: once a year the RAU Owner reviews the whole
  assessment and signs. Affirmation states per RAU: Current /
  Change pending review / Due (window open, 60 days) / Overdue.
- CHANGE ADOPTION: material changes since last affirmation (new or
  reopened instances, rating moves, control changes, resolved
  challenges) queue on the RAU as "what changed"; the owner adopts
  them as they land or at latest during affirmation.
- CHALLENGE ANYTIME (decision 13): every substantive record carries a
  quiet "Challenge" affordance. It opens a right-side drawer, sibling
  of the demo feedback bar but in-universe and visually distinct:
  "What looks wrong" / "What should it be", auto-capturing record
  reference, challenger role, date. Challenges land in the owner's My
  Work; owner responds (agree -> change made, or explain); challenger
  resolves (upheld / withdrawn). Open challenges block affirmation of
  the affected line only.
- 2LOD ATTENTION VIEW: the system points ORBO/BACO at the non-standard
  and unfamiliar, ranked with reasons: peer-outlier ratings, score vs
  band mismatches, expected-control gaps, override-dense RAUs, aging
  unadopted changes, aging open challenges. Settled items do not
  resurface. This is the entire 2LOD workflow - investigate, then
  challenge or move on.

### 4.2 Effectiveness and residual (decision 12)

Per control: designRating and performanceRating (Effective / Partially
effective / Ineffective; performance is owner judgment now, C7 test
results wire in later - the seam is labeled on screen).
  Control effectiveness = the weaker of design and performance.
Per instance: control environment strength =
  Strong      an effective expected-or-derived-key control is linked
              and no expected control is missing
  Adequate    at least one effective control, but gaps (expected
              missing, or best control only partially effective)
  Weak        no effective control linked
Residual via knockdown rule (renders as the matrix, explains in one
line): Strong takes inherent down two bands, Adequate one, Weak none;
floor at Low; then map Critical/High -> High, Moderate -> Moderate,
Low -> Low for the three-band residual (High / Moderate / Low).

### 4.3 Screens (module rcsa.js)

- Affirmation dashboard: all RAUs x affirmation state, expandable by
  LOB/SubLOB; residual heatmap strip; overdue aging.
- RAU assessment workspace: line per instance (inherent band carried
  from C3, control environment computed from C4, residual out), delta
  markers on everything that changed since last affirmation, challenge
  affordance per line, open-challenge blocks visible.
- Affirm flow: owner reviews the "what changed" digest, resolves
  blockers, signs; the affirmation snapshot (date, signer, counts,
  residual profile) is stored; direction vs prior affirmation computed.
- Challenge log: per RAU and global; filterable by state and role.
- 2LOD attention view (per 4.1), the landing screen for ORBO/BACO.

## 5. Data and engine additions

New data files (script-tag .js, CSV templates in data-staging):
- controls.js (~6,000), controlLinks.js (instance links),
  expectedControls.js (rules), ratings.js (per instance: suggested +
  final levels, lens scores, band, overridden, rationale, ratedBy/Date),
  affirmations.js (per RAU: last affirmation snapshot, state, changes
  since), challenges.js (seeded open + resolved examples).
- Generator field additions: event errorRateClass, enforcementFlag,
  visibilityClass, severity profile; MCR recommendedControlTypes on the
  head set; deliberate stories - expected-control gaps (~6% of FCRM
  instances), declared-vs-derived key disagreements (~60 controls),
  outlier ratings (a handful per LOB), story RAU gets hand-written
  ratings, one open BACO challenge, one resolved ORBO challenge, an
  affirmation due in 30 days.

Engine (kernel/engine.js) additions:
- inherentSuggest(rau, instance) -> levels + evidence chips;
  inherentBand(likelihood, impact); peerOutlier(rau, eventId).
- controlRecs(instance) -> {expected, shared, skeleton};
  derivedKey(control) -> {key, rules[]}; coverage(rau).
- effectiveness(control); envStrength(instance); residual(band, env);
  attention(role) -> ranked non-standard items with reasons.
- Data API: controlsOfInstance, instancesOfControl, controlsOfRau,
  ratingOf, affirmationOf, challengesOf, plus add/remove mutators
  mirroring addRegister/removeRegister so demo actions stay
  reversible. Workbench Reopen marks dependent rating and lines
  orphaned instead of deleting them (integrity rule).

## 6. The round plan (decision 15 - walk one at a time)

Rounds ship the standard way: build -> node --check + Playwright pass
-> zip + screenshots -> FEEDBACK.md / CHANGELOG.md -> push. Each round
is a release number and a feedback window.

R5 - Capability 3 (inherent rating)
  Build: engine inherent section; ratings data + generator fields
  (event classes); modules/inherent.js (landing, worksheet, rubric
  page, distribution, completeness); RAU rollup chips on profile and
  directory; workbench confirmed rows link "rate this"; My Work owner
  queue gains ratings-to-document; skeleton cap3 retires (route
  redirects); home BUILT += 3; demo: owner role demo gains a rating
  scene, walkthrough gains one scene.
  Exit: rate an instance end to end (accept and override paths), see
  it in distribution and on the profile, zero console errors.
  Watch: worksheet is the fattest screen; keep inherent.js under 50KB.

R6 - Capability 4 (controls)
  Build: controls + links + expected rules data; MCR recommended
  control types; engine control section (recs, derived key, coverage);
  modules/controls.js (inventory, detail, attach flow, coverage);
  gallery assign-control vignette graduates to the real flow; profile
  Controls tab; skeleton cap4 retires; home BUILT += 4; demo: BCM and
  BACO role demos gain control scenes.
  Exit: attach an expected control, create from skeleton draft, watch
  derived key flip when a rating changes upstream, coverage gaps read
  true, zero console errors.
  Watch: controls.js size; recommendation panel must stay honest math
  (attach rates and rules, no fake AI).

R7 - Capability 5 (living RCSA + affirmation + challenge)
  Build: effectiveness/residual engine; affirmations + challenges
  data; modules/rcsa.js (dashboard, workspace, affirm flow, challenge
  log, 2LOD attention); challenge drawer wired onto instances,
  ratings, controls across modules; My Work 2LOD queues become real;
  residual chips on profile/directory; skeleton cap5 retires; home
  BUILT += 5; demo: new story demo "One risk, front to back"
  (workbench confirm -> rate -> controls -> residual -> challenge ->
  affirm), ORBO/BACO role demos rebuilt around attention + challenge.
  Exit: full money path in one sitting; challenge a record as BACO,
  answer it as Owner, affirm; residual math visibly recomputes when a
  control rating changes; zero console errors.
  Watch: rcsa.js is the fattest module; split challenge.js if the
  ceiling nears; Reopen integrity rule tested in the harness.

R8 - Integration and polish (flex round)
  Cross-link sweep (every entity reachable from every mention);
  monitoring teaser stats fed by C3-C5 (override rate, coverage,
  affirmation aging) as a C9 preview card; feedback sweep from R5-R7;
  kit v2 + runbook regeneration decision with the owner.

## 7. Out-of-scope boundaries (say them on screen where relevant)

- MCR-level and event-level ratings: none. Compliance aggregation is
  CARA, outside RCSA. A note on the rubric and worksheet pages.
- Control-to-MCR mapping: CARA territory, off the table (decision 9).
- C7 test results feeding performance ratings: labeled seam, lands
  with Capability 7.
- Trigger inflow automation: the adoption queue is real, its upstream
  feed is Capability 6; seeded change events simulate it until then.
