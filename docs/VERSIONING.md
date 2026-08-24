# VERSIONING.md - version control and the feedback loop
This text becomes Parts 9 and 10 of the runbook at the next regeneration.
It is written for the same reader: a human coordinator with no memory of
yesterday, who must not be able to get it wrong.

# Part 9 - Versioning

## 9.1 The one rule that prevents chaos
There are two worlds. The WORKING COPY (C:\GRC\demo\) is your workshop: it
may be broken, mid-edit, half-tested. A RELEASE (C:\GRC\releases\R3\) is a
frozen, numbered copy that users see. **Users only ever see releases.
Releases are never edited. All work happens in the working copy; all
viewing happens in releases.** Every problem this system prevents comes
from someone showing the workshop or editing the showroom.

## 9.2 The four version layers (who bumps what)
| Layer | Looks like | Where visible | Who bumps it |
|---|---|---|---|
| Release number | R1, R2, R3 | Red banner (top right), release notes, FEEDBACK entries | You, at release time, in demo\data\release.js |
| File versions | core.js v2.1.0 | Line 1 of each file; Preflight panel | Copilot on every EDIT (the EDIT prompt demands it); you verify new > old before saving |
| Data versions | risks.js 2026-10-02 | Preflight data table | DataForge stamps the export date automatically |
| Kit versions | SCHEMA.md v2.0 | Top line of kit files | Only via session P2-01 or a deliberate contract change; noted in CHANGELOG |

File-version rules of thumb: PATCH (x.y.Z) = fix, no new behavior. MINOR
(x.Y.0) = new capability in that file. MAJOR (X.0.0) = the file changed in
a way other files must react to (rare; contract/schema level). Copilot
proposes; if it forgot to bump, tell it via FIX. You never invent version
numbers yourself.

## 9.3 The release number is the public identity
demo\data\release.js contains exactly:
  window.GRC_DATA.release = { number:"R3", date:"2026-10-02", label:"adds signal inbox SLA view" };
The shell shows "R3" in the banner. Consequence: every screenshot, every
piece of feedback, every hallway comment is automatically tagged to a
release, because the number is on screen. When a user reports something,
your first question ("which version?") is already answered.

## 9.4 The release procedure (the gate)
Run this checklist top to bottom; if any line fails, stop - you do not
have a release yet.
1. Preflight green: zero errors, all entities loaded, dangling-reference
   report reviewed.
2. Click-through: every tab, one detail record per module, the full tour.
3. Close the loop in logs\FEEDBACK.md: every item built this round moves
   to state BUILT with its session line.
4. Bump demo\data\release.js to the next number, today's date, a 5-10 word
   label.
5. Write the release block at the TOP of logs\CHANGELOG.md (template in
   that file): what changed per module, feedback ids closed, data/kit
   versions, and paste the Preflight version table.
6. COPY the entire demo\ folder to releases\R<n>\ (copy, never move).
7. Write releases\R<n>\RELEASE-NOTES.txt from the template - this is the
   user-facing half of the changelog.
8. Mark released feedback items RELEASED in FEEDBACK.md. Zip R<n> if
   distributing; otherwise point users at the folder.
9. Outside the firewall only: regenerate the single-file crossing copy
   (`node tools-dev/build-single-html.js` -> meridian-grc-mockup.html at
   the repo root) so the one-file edition always matches the shipped
   release. It inlines demo\ as-is; if step 6 already ran, demo\ and
   R<n> are identical and either source is fine.
After step 6, R<n> is read-only forever. A bug found in R3 is fixed in the
working copy and shipped as R4 - never patched in place.

## 9.5 Rollback and archaeology
Rollback = copy releases\R<previous>\ over demo\ (back up demo\ first).
Because every release folder is complete and self-contained, any past
state can be rerun by double-clicking its index.html. LOG.txt (every
session) + CHANGELOG.md (every release) + version headers (every file)
mean any question of "when did X change" has a paper trail.

## 9.6 Real data is versioned the same way
A data refresh (new exports through DataForge) changes what users see, so
it goes through the same gate: swap files in demo\data\, verify, then
release. Data files carry their export date; the CHANGELOG release block
records which data vintages shipped in which release.

# Part 10 - The feedback loop

## 10.1 The loop
  SHOW R<n> to users -> COLLECT into FEEDBACK.md -> TRIAGE (accept/decline)
  -> BUILD (one EDIT session per touched module, via a TASK-FB card)
  -> RELEASE R<n+1> (Part 9 gate) -> NOTIFY users with release notes
  -> repeat.
Feedback is BATCHED: collect for a review round (a week, or a demo
session's worth), then build once. Never make a one-off change between
releases because someone asked in the hallway - it goes in the register
like everything else.

## 10.2 The register: logs\FEEDBACK.md
One block per item, appended at the end, never deleted:

  FB-014 | R2 | 2026-10-06 | J. Rivera (Ops Risk) | rcsa
    Ask: show direction vs prior cycle on the residual heatmap
    Status: ACCEPTED 2026-10-07
    Built: 2026-10-11 rcsa.js 1.1.0 -> 1.2.0 (TASK-FB round 3)
    Released: R3

Header line fields: id | release they saw | date | who (name, area) |
module (or "general"). States move ONE WAY:
  NEW -> ACCEPTED or DECLINED(reason) -> BUILT -> RELEASED
An item cannot be BUILT without a session line naming file and versions.
It cannot be RELEASED without a release number. DECLINED items keep their
reason forever - "we already said no to that, here's why" is a feature.

## 10.3 Triage rules (15 minutes, before any building)
- Walk every NEW item; decide ACCEPTED / DECLINED / leave NEW (deferred).
- Decline with a reason you would say to the person's face.
- Group ACCEPTED items by module. Each module with items gets ONE build
  session this round, covering all its items at once.
- Anything that changes SCHEMA.md or the CONTRACT is not normal feedback:
  it is a schema change (session P2-01 procedure, MAJOR bump, called out
  in the changelog) - rare and deliberate.

## 10.4 Building from feedback: the TASK-FB card
Never freestyle a change into Copilot chat. Copy
kit\cards\TASK-FB-TEMPLATE.md, fill it in (module, current version, the
FB ids, the changes as numbered lines, added acceptance checks), and run
a standard EDIT session with it. The filled card is saved next to the
template as TASK-FB-R<n>-<module>.md - the permanent record of exactly
what was asked of Copilot and why. Cards are append-only history, like
the register.

## 10.5 Closing the loop with users
RELEASE-NOTES.txt (template in releases\) has three sections: "What's new"
(plain language, grouped by module), "Your feedback in this release"
(each FB id with the reporter's name - people engage when they see they
were heard), "Known items still open" (accepted-not-yet-built, so nobody
re-reports them). Send the notes with the new release; ask reviewers to
reply with the release number they're commenting on (it's in the banner).

## 10.6 Poka-yoke summary - why this is hard to get wrong
1. Two worlds: workshop vs showroom; users never see the workshop.
2. The release number is on screen, so feedback self-tags.
3. One funnel: if it isn't in FEEDBACK.md, it doesn't exist.
4. One-way states with required evidence at each transition.
5. Changes enter only through cards; cards are kept forever.
6. The release gate is a checklist with a file artifact per step.
7. Releases are immutable; rollback is a folder copy.
8. Batching: one build round per review round; no drive-by edits.
9. Schema/contract changes are a separate, deliberate ceremony.
10. Every log is a plain text file in logs\ - readable in Notepad,
    survivable, diffable.

## 10.7 Cadence guidance
A healthy rhythm at demo stage: show -> collect for 3-7 days -> triage
15 min -> build 1-3 sessions -> release -> notify. Expect R2 within a week
of first showing R1. If a round has no accepted items, say so in a short
note and skip the release - do not ship empty releases.
