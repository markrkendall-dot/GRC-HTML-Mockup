DATA STAGING
============
Raw CSV exports from source systems land HERE first - never directly into
demo\data\. Flow (runbook Part 6):

  1. Export one CSV per entity from your source systems into this folder.
     Excel: File > Save As > "CSV UTF-8".
  2. templates\ contains one dummy CSV per entity showing the EXACT
     expected columns with a few example rows. Open yours next to the
     template to see what maps where (DataForge lets you remap headers,
     so your column names do not need to match - the template shows the
     FIELDS that need to come from somewhere).
  3. Open demo\tools\dataforge.html, load your CSV, map, validate, mask,
     export - it downloads a ready data\<entity>.js file.
  4. Move that .js into demo\data\ (back up the old one first), refresh,
     check Preflight.

Import order (so cross-references validate): raus, riskCategories,
policies, risks, controls, rcsaCycles, signals, controlTests, auditTests,
issues, kris, kriReadings.
Keep raw exports here as your source-of-truth archive; they never ship in
a release.
