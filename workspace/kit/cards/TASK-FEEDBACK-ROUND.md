# TASK CARD - RUN A FEEDBACK ROUND (release to release)

The operating rhythm proven over releases R2 through R9. A round turns a
pile of feedback into one numbered release. The runbook Part 6 tells the
same story with screenshots; this card is the checklist.

## 1. COLLECT
Every reviewer uses the red feedback pill (bottom left) on the page where
the problem lives; the item records the page and source file. Gallery
votes ride along. At the end of the review, each reviewer presses Copy
(or Download) in the feedback drawer and sends you the text.

## 2. REGISTER
Append every item to logs\FEEDBACK.md as FB-<next number>, using the
format at the top of that file. States move one way:
NEW -> ACCEPTED or DECLINED(reason) -> BUILT -> RELEASED. Never renumber,
never delete. Group items that touch the same module.

## 3. DECIDE
Mark each item ACCEPTED or DECLINED with a dated reason. If an item needs
a design decision reviewers did not settle, write the smallest honest
version and note the open question in the FB item.

## 4. BUILD (one EDIT session per touched module)
For each module with accepted items: fill a TASK-FB-TEMPLATE.md card
listing ONLY that module's items, then run a TASK-EDIT-MODULE session.
Order: kernel files first if any, then modules, index.html last if its
CSS or script tags changed. Data changes go through TASK-REAL-DATA or a
generator note, never by hand-editing data\*.js.

## 5. RELEASE GATE (all must pass before anyone sees it)
1. Preflight: zero errors, version matrix matches what you built.
2. Walk every changed screen plus the Full walkthrough demo end to end.
3. data\release.js bumped to the next R number with a short label
   (this is the number in the banner; reviewers quote it).
4. logs\CHANGELOG.md gets a new block AT THE TOP: feedback closed,
   module changes with old -> new versions, data changed or unchanged.
5. logs\FEEDBACK.md items flip to BUILT (with file+version) and
   RELEASED <Rn>.
6. Copy demo\ to releases\R<n>\. Users only ever open releases\R<n>\.

## 7. ANNOUNCE
Tell reviewers the release number and the two or three headline changes,
and where their FB item landed (built, or declined with the reason).
