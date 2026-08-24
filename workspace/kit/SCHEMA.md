# GRC MOCKUP - DATA SCHEMA v2.0 (SCHEMA.md)

Fifteen entities plus release, loaded as data/*.js files that each assign
window.GRC_DATA.<entity> = { version: "<YYYY-MM-DD>", rows: [...] }.
The kernel clones and indexes everything at boot. Real data replaces these
files one for one (same filenames, same shapes); data-staging/templates/
holds a CSV per entity showing the exact columns.

## ENTITIES

orgNodes    id, level (lob | sublob), parentId, name
            WF > LOB > SubLOB; RAUs attach at SubLOB.

services    id, parentId, level (1|2|3), name
            The enterprise services catalog tree; RAUs pick level-3 leaves.

raus        id (RAU-nnnn), name, subLobId, category (business-service |
            shared-services | enterprise), stage, description, serviceIds[],
            roles {owner, delegate, bcmContact, orbo, baco},
            fte, locations, annualVolume, priorLosses12m,
            changeLevel (low|medium|high), meta {tags[], excl[]},
            riskIdStatus (not-started | in-progress | complete),
            lastRcsaDate, profileUpdated, mapSummary {phases,steps,handoffs},
            map {phases:[{name, steps:[{n,text,type,cp,art}]}]} | null,
            metaAnswers [{q, v, src, late}] | null,
            handoffs [{dir (in|out), cp, art, conf}]

riskEvents  id (REV-nnn), side (operational | compliance), name,
            description, qualification, keywords[], tags[], excludedBy[],
            errClass 1-5, sevClass 1-5, enfFlag bool, visClass 1-3
            (the last four drive Capability 3 suggestions; see ENGINE.md)

mcrs        id (MCR-nnnn), name, parentEventId, regFamily, citation,
            regulator, head bool, publishedDate, tags[], summary,
            obligations[], prohibitions[], recCtl[]
            Tail rows (head=false) carry only id, name, parentEventId,
            regFamily, citation, tags. Published from RRCM, read-only.

register    RISK INSTANCES. rauId, eventId, status (confirmed | rejected),
            score, by, date, rationale?, mcrIds[]?
            One row per disposition; a confirmed row is "a risk instance".

requests    id (RCR-nnnn), type (new|merge|split|retire), stage
            (draft-intake | uniqueness-review | process-mapping |
            standards-check | pending-governance | metadata-creation |
            returned-for-refinement | declined | approved), proposedName,
            subLobId, category, requester, submitted, serviceIds[],
            description, bullets[], assistant[], note?,
            uniqueness {similar[], category{}, recommendation,
            rationaleText} | null, targetRauIds[]?, impact{}?

metaQuestions  id (Qnn), section, text, excl? | tag?
            The standardized survey; excl questions confirm does-NOT-do.

rubric      single record under .def: version, bands {likely, possible},
            categories [{key, label, weight}], questions [{id, cat, tag,
            text}]  (applicability rubric; inherent rubric lives in code,
            see ENGINE.md)

ratings     INHERENT RATINGS, one per rated risk instance.
            rauId, eventId, s [L,fin,cust,reg,ops] suggested levels,
            f [same] final levels, ov 0|1, note? (required when ov),
            by, date.  Band is NEVER stored; compute from f via the grid.

controls    id (CTL-nnnn; session-created use CTL-9xxx), name, desc,
            owningRauId, shared bool, type (preventive|detective|
            corrective), automation (manual|automated|it-dependent),
            frequency, owner, status, created, declaredKey bool
            (legacy contrast only), design, perf (effective |
            partially-effective | ineffective)

controlLinks   c (controlId), r (rauId), e (eventId)
            Many-to-many control-to-instance mapping.

expectedControls  id (EXP-nn), eventId, controlId, note
            When the event is live on a RAU, that control is expected.

affirmations   rauId, date (last affirmation), by,
            snapshot {high, moderate, low, lines}, prior?,
            pending [{date, kind, text, eventId?}]  unadopted changes
            (the living record; mutators append to pending automatically)

challenges  id (CH-nnn; session CH-9xx), rauId, kind (rating|env|control|
            instance|line), eventId?, controlId?, what, should, by (role
            string), byName, date, state (open | responded | upheld |
            withdrawn), response?, respondedBy?, respondedDate?,
            resolvedDate?

release     {number "Rn", date, label} - shown in the banner; bump it
            every release.

## DATA API (ctx.data)
Read:  all(entity)  byId(entity, id)  ver(entity)  release()
       lobs() subLobs() orgNode(id) orgPath(subLobId) rausOfSub(subLobId)
       svcName(id) svcPath(id)
       regOfRau(rauId) regOfEvent(evId) mcrsOfEvent(evId) rubric()
       ratingsOfRau(rauId) ratingsOfEvent(evId) ratingOf(rauId, evId)
       controlsOfInstance(rauId, evId) linksOfControl(ctlId)
       linksOfEvent(evId) linksOfInstance(rauId, evId)
       controlsOwnedBy(rauId) expectedFor(evId)
       affirmationOf(rauId) challengesOf(rauId)
       metrics() search(q)
Write (ALWAYS use these; they keep indexes AND queue living-record
changes onto the RAU's affirmation pending list):
       addRegister(row) removeRegister(row)
       setRating(row)                       upsert by rauId+eventId
       addControl(c) addLink({c,r,e}) removeLink(ln)
       setControlRating(ctl, "design"|"perf", value)
       addChallenge(ch) adoptChange(rauId, pendingRow)
       affirm(rauId, by, snapshot)

## INVARIANTS
- Ratings, cycles, and coverage JOIN confirmed register rows at read time;
  reopening an instance makes its dependents dormant, never deleted.
- Everything derived (bands, derived key, effectiveness, environment,
  residual, affirmation state, attention) is computed by the engine on
  demand. Store facts, compute judgments.
- The applicability scoring, the inherent level math, and the residual
  chain are MIRRORED in tools-dev/generate-data.js so shipped data
  reconciles with live recomputation. If you change the math in
  kernel/engine.js you MUST change the mirror the same way (ENGINE.md
  lists the mirrored functions).
- Data files are regenerated by tools-dev/generate-data.js (same seed =
  same data). Real data enters ONLY through demo/tools/dataforge.html
  (TASK-REAL-DATA). Never hand-edit data/*.js; release.js is the one
  hand-bumped exception.
