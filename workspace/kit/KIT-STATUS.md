# KIT STATUS - v2, current as of release R10

This kit matches the app as built through R10: capabilities 1 through 5
end to end, nine demos, the feedback drawer, the My list work cart, the
living-RCSA machinery, and DataForge (demo\tools\dataforge.html), the
in-browser real-data pipeline. Generated from the reference build after
the R5-R8 rounds stabilized, replacing kit v1 (which described the
original generic plan and was marked stale from R1).

Card versions: CONTRACT v2.0, SCHEMA v2.0, ENGINE v1.0, MODULES v1.1,
PROMPTS v1.1, WORKSHEET v2, KIT-README v2. Task cards: EDIT-MODULE,
FEEDBACK-ROUND, REAL-DATA (v2, DataForge-first), NEW-MODULE,
FB-TEMPLATE.

R10 kit notes: WORKSHEET.md rewritten to the v2 entities (the v1 sheet
predated the reference build); TASK-REAL-DATA now routes conversions
through DataForge with Copilot as fallback; data-staging templates
regenerated with full schema columns plus new requests.csv and
metaquestions.csv.

Trust order when things disagree:
1. The built files in demo\ (the truth).
2. MODULES.md and the in-app Preflight version matrix.
3. CONTRACT / SCHEMA / ENGINE cards.
4. The runbook's appendix summaries.
If you find a disagreement, fix the card in the same round and note it in
logs\CHANGELOG.md under the release you shipped.

Retired: the v1 build-phase cards (TASK-P1-*, TASK-P2-*, TASK-P3-*,
TASK-M-*) are deleted from this kit. They described a pre-build plan that
the reference build superseded; keeping them invited pasting the wrong
spec into Copilot. The repository history still has them if ever needed.
