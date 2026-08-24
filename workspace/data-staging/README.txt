DATA STAGING
============
Raw CSV exports from source systems land HERE first - never directly into
demo\data\. Flow (runbook Part 7):

  1. Export one CSV per entity from your source systems into this folder.
     Excel: File > Save As > "CSV UTF-8".
  2. templates\ contains one dummy CSV per entity showing the EXACT
     expected columns with a few example rows. Open yours next to the
     template to see what maps where (DataForge lets you remap headers,
     so your column names do not need to match - the template shows the
     FIELDS that need to come from somewhere).
  3. Open demo\tools\dataforge.html, pick the entity, load your CSV,
     map, validate, mask, export - it downloads a ready data\<entity>.js
     file with the export date stamped in.
  4. Back up the old file (copy to backup\<date>-<name>), move the new
     .js into demo\data\, refresh the app, check Preflight.

Convert in this order so cross-references validate against fresh data:
  orgnodes, services, raus, riskevents, mcrs, metaquestions
then, ONLY if you are importing history (otherwise export them EMPTY from
DataForge's empty-files panel and let the tool fill them live):
  controls, controllinks, expectedcontrols, register, ratings,
  affirmations, challenges, requests
Not converted here: rubric.js (keep shipped until your real standards
land) and release.js (hand-edited at release time, runbook Part 6).

Keep raw exports here as your source-of-truth archive; they never ship in
a release. Real data never leaves the firewall.
