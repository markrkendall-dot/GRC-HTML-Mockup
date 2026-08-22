GRC MOCKUP WORKSPACE
====================
This folder IS the working structure. Unpack it as C:\GRC (or your
Documents folder if C:\ is locked down) and keep the layout exactly:

  demo\            THE APP - the working copy. Open demo\index.html to run.
    kernel\        core.js, ui.js, charts.js        (built via Copilot)
    modules\       one .js per capability            (built via Copilot)
    data\          one .js per entity - YOUR DATA GOES HERE (via DataForge)
    tools\         dataforge.html                    (built via Copilot)
  kit\             the .md files you attach to Copilot sessions
    cards\         one TASK card per session + TASK-FB template
  data-staging\    raw CSV exports land here before conversion
    templates\     dummy CSVs showing the exact expected columns per entity
  releases\        frozen numbered copies users see (R1, R2, ...) - never edit
  mirror\          .md copies of files made just before an EDIT session
  backup\          dated copies of files about to be overwritten
  logs\            FEEDBACK.md (user feedback register)
                   CHANGELOG.md (what changed, per release)
                   LOG.txt (one line per build session)
  GRC-Mockup-Runbook.docx   the manual. Start at Part 0.

RULES THAT KEEP THIS SANE (details in the runbook):
1. Users only ever see releases\R<n>\. Never demo\.
2. Releases are never edited. Fixes go to demo\ and ship as the next R.
3. Feedback exists only if it is in logs\FEEDBACK.md with an FB-number.
4. Changes reach Copilot only through cards in kit\cards\.
5. Real data: raw CSVs into data-staging\, converted by
   demo\tools\dataforge.html, output .js files into demo\data\.
   Real data never leaves the firewall.
