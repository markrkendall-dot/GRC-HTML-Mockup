GRC MOCKUP WORKSPACE
====================
This folder IS the working structure. Unpack it as C:\GRC (or your
Documents folder if C:\ is locked down) and keep the layout exactly:

(If the ZIP itself will not cross the firewall: the whole demo also
ships as ONE self-contained HTML file, meridian-grc-mockup.html at the
repo root, built by tools-dev/build-single-html.js - same method as
the risk-instance viewer. That file is for viewing and presenting
only; building and real data still happen in this folder structure.
See START-HERE.txt at the repo root.)

  demo\            THE APP - open demo\index.html in Edge. It ships
                   PRE-BUILT through release R9: capabilities 1-5 end to
                   end (RAU inventory and pipeline, risk identification,
                   inherent ratings, controls with derived key, the
                   living RCSA with affirmation, challenge and residual)
                   on synthetic data at true scale (850 RAUs, 90 events,
                   8,000 MCRs, 5,100 controls). Click Present in the
                   left rail: nine demos, including one per role.
    kernel\        core.js, engine.js, ui.js, charts.js (edit via Copilot)
    modules\       one .js per capability               (edit via Copilot)
    data\          one .js per entity - YOUR REAL DATA REPLACES THESE
                   (same filenames; see data-staging\README.txt)
    tools\         (dataforge.html arrives in a later phase)
  kit\             the .md files you attach to Copilot sessions (v2,
                   matches the as-built app; start at KIT-README.md)
    cards\         one TASK card per kind of job + the FB template
  data-staging\    raw CSV exports land here before conversion
    templates\     dummy CSVs showing the exact expected columns per entity
  releases\        frozen numbered copies users see (R1, R2, ...) - never edit
  mirror\          .md copies of files made just before an EDIT session
  backup\          dated copies of files about to be overwritten
  logs\            FEEDBACK.md (user feedback register)
                   CHANGELOG.md (what changed, per release)
                   LOG.txt (one line per build session)
  GRC-Mockup-Runbook.docx   the manual (v2). Start at Part 0.

RULES THAT KEEP THIS SANE (details in the runbook):
1. Users only ever see releases\R<n>\. Never demo\.
2. Releases are never edited. Fixes go to demo\ and ship as the next R.
3. Feedback exists only if it is in logs\FEEDBACK.md with an FB-number.
4. Changes reach Copilot only through cards in kit\cards\.
5. Real data: raw CSVs into data-staging\, converted by
   demo\tools\dataforge.html, output .js files into demo\data\.
   Real data never leaves the firewall.
