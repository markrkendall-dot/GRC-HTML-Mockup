# TASK FB - feedback changes to <module file>  (fill in, then save a copy
# as TASK-FB-R<next release>-<module>.md; the copy is permanent record)
PRODUCES: <path, e.g. modules/rcsa.js> (current v<X.Y.Z>, bump per contract)
SIZE CEILING: same as the module's original card.
ATTACH: CONTRACT.md, SCHEMA.md, this card, CURRENT-<name>.md (mirror copy).
PROMPT: EDIT

## FEEDBACK ITEMS ADDRESSED (ids from logs\FEEDBACK.md)
FB-___, FB-___

## CHANGES (numbered; one behavior per line; write what the USER should
## see differently, then any mechanics Copilot needs)
1. <e.g. On the residual heatmap, each cell shows a small up/down/flat
   arrow comparing this cycle to the prior cycle for that RAU. (FB-001)>
2. <...>

## DO NOT CHANGE
Everything not listed above. Existing routes, ids, and behaviors stay.

## ACCEPTANCE (add one check per change, plus these two standing checks)
1. <check for change 1, phrased as something you can see>
2. <...>
S1. All of the module's ORIGINAL acceptance checks still pass.
S2. Version bumped, Preflight green, file under its ceiling.
