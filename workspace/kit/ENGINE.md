# GRC MOCKUP - ENGINE REFERENCE v1.0 (ENGINE.md)

kernel/engine.js is the standardized math. It is deterministic: real
computation over real fields, presented in the app as the assistant.
Attach this card to any Copilot session that touches scoring, ratings,
key status, residual, or attention. THREE of these calculations are
mirrored in tools-dev/generate-data.js; the mirror must move in lockstep.

## 1. APPLICABILITY (Capability 2)   [MIRRORED: scoreCand]
score(rau, cand) compares namespaced tags (proc: prod: cust: data: mm:
jur: ch: vol:) between the RAU's meta.tags and the candidate's tags per
rubric category: candidate silent on a theme = 3; zero shared = 1; one
shared = 4 (or 3 if the candidate has more tags in the theme); two = 4;
three+ = 5. Weighted sum over rubric.categories scales to 0-100.
Bands: likely >= 70, possible >= 40, else unlikely.
suppressedBy(rau, ev): any excludedBy topic present in rau.meta.excl
hides the event (the survey's does-NOT-do answers at work).
candidates(rau) / zones(scored) / mcrCandidates(rau, eventId).
questionsFor(rau, cand) + answer(rau, q, yes): disambiguation; a yes adds
the tag to rau.meta.tags so EVERY candidate rescores.
mcrFit(mcr): parent-event fit vs best alternative event; verdict good |
realign (alt beats parent by 8+) | weak (parent < 55). Cached per mcr.

## 2. INHERENT RATING (Capability 3)   [MIRRORED: inhLevels]
engine.inherent.*
def: likelihood anchors (Rare .. Expected), four impact lenses
  (fin, cust, reg, ops) with 5 anchors each, the 5x5 band grid, and
  bands ["low","moderate","high","critical"]. Reputational is a derived
  FLAG (cust>=4 or reg>=4 or visClass>=3), never a scored lens.
levels(rau, ev, mcrN) -> {l, fin, cust, reg, ops}, each clamped 1-5:
  l    = 1 + volume points (>=6M:3, >=2.5M:2, >=500k:1) + (errClass>=4)
         + (priorLosses12m>0) + (changeLevel high) - (errClass<=1)
  fin  = sevClass + 1 if money-movement tag and volume >= 2.5M
  cust = 1 unless cust:consumer tag, then by volume (>=2.5M:4, >=500k:3,
         else 2), +1 if compliance side and mcrN >= 5
  reg  = compliance: 2 + (mcrN>=3) + enfFlag; operational: 1 + enfFlag
  ops  = 1 + handoff points (>=6:2, >=3:1) + (volume>=2.5M) + (errClass>=5)
band(levels): impact = max lens; band = grid[impact-1][likelihood-1].
suggest(rau, ev, regRow): levels plus evidence chips (runtime only) and
the reputational flag.
rollup(rau): highest FINAL band across rated confirmed instances, with
driver event names and a count strip {critical, high, moderate, low}.
peerOutlier(rau, eventId, finalLevels): final band 2+ steps from the LOB
median for the same event (needs 3+ peers).
Rating rows store s (suggested) and f (final); ov=1 requires note.

## 3. CONTROLS (Capability 4)
engine.ctl.*
derivedKey(control) - key is COMPUTED from four rules, never declared:
  K1 sole mitigant on an instance whose final band is high/critical
  K2 target of an expectedControls rule
  K3 concentration: 5+ linked instances OR links across 3+ RAUs
  K4 linked to any critical instance
recs(rau, eventId) -> three tiers:
  expected: unlinked rule targets for the event
  shared:   shared controls linked to this event on peer RAUs, ranked by
            instance count (attach rate)
  skeleton: a drafted directional control from the event keywords and the
            head MCRs' recCtl types; prefills the create form
similar(name, rauId): advisory duplicate check (token overlap, top 3).
lint(control): C1 name states an action; C2 desc >= 40 chars; C3 has
frequency; C4 has owner.
coverage(rau): expectedMissing (the loudest gap), noControl (high or
critical instances with zero controls), singlePoint (exactly one).
bandOf(rauId, eventId): final inherent band or null.

## 4. LIVING RCSA (Capability 5)   [MIRRORED: the whole residual chain]
engine.rcsa.*
effectiveness(control) = the WEAKER of design and perf
  (effective > partially-effective > ineffective).
envStrength(rauId, eventId, memo?):
  weak     no control, or nothing better than ineffective
  strong   an EFFECTIVE control that is expected or derives key, AND no
           expected control missing
  adequate everything else
  (pass a shared memo object when computing many instances; it caches
  derivedKey per control)
residual(inherentBand, strength): knockdown rule. strong = down 2 bands,
adequate = down 1, weak = down 0, floor low; then critical/high map to
residual High, moderate to Moderate, low to Low. Three-band output.
line(rau, regRow, memo) / profile(rau, memo): per-instance and per-RAU
{high, moderate, low, unrated, lines[]}. Unrated instances cannot compute
residual and block affirmation.
affState(rau): never | overdue (>365d) | due (>305d) | pending-changes
(unadopted entries) | current. Uses affirmationOf + challengesOf.
attention(side): the 2LOD ranking. Items (kind, weight): outlier 90,
exp-gap 80, challenge 75, overdue 70, overrides 65 (>30% override rate,
min 5 rated), mismatch 55-60 (applicability vs band), changes 40+.
side "operational" or "compliance" filters event-level items.

## THE MIRROR RULE
tools-dev/generate-data.js contains inline copies of: scoreCand
(applicability), inhLevels (inherent levels), and the residual chain
(band grid, effectiveness, isKey, envOf, residual) used to build shipped
register rows, ratings, and affirmation snapshots. Any change to the
corresponding engine function without the same change in the generator
makes shipped data disagree with live recomputation. Change both, then
regenerate (cd tools-dev && node generate-data.js) and re-verify.
