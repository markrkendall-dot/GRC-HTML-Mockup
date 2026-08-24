# TASK CARD - SWAP REAL DATA INTO data\

The app reads only data\*.js. Real data replaces the synthetic files one
for one: same filenames, same shapes (SCHEMA.md), same wrapper:

  window.GRC_DATA = window.GRC_DATA || {};
  window.GRC_DATA.<entity> = {"version":"<YYYY-MM-DD>","rows":[ ... ]};

## THE PATH (no Copilot needed)
1. Export each source system to CSV into data-staging\.
   data-staging\templates\ holds one CSV per entity with the exact
   expected columns and example rows (semicolon-separated lists inside a
   cell for array fields such as serviceIds and keywords).
2. Open demo\tools\dataforge.html in Edge (offline, like the app).
   Run its Self-test button once per sitting: all green = the tool is
   intact. Then per entity: pick the entity, load the CSV, map your
   columns to the schema fields (WORKSHEET.md W3 records the same
   mapping on paper), Validate, fix what it flags, optionally Mask
   people names, Download. The export date is stamped automatically.
3. Back up the old file (backup\<date>-<name>), save the download over
   demo\data\<entity>.js, refresh the app, check Preflight.
4. Convert in the order data-staging\README.txt lists; each finished
   conversion becomes the cross-check reference for the next. Resuming
   later? Use "Import a converted data\*.js" to reload finished files.

## WHICH ENTITIES, WHOSE SYSTEM
raus, orgNodes, services      the RAU inventory and catalogs
riskEvents                    the 90-event library (errClass, sevClass,
                              enfFlag, visClass per ENGINE.md; if
                              unknown, leave blank - the tool defaults
                              to neutral 3/3/false/1)
mcrs                          RRCM publication (head flag = your 80/20
                              set; tail rows are auto-written lean)
register, ratings, controls, controlLinks, expectedControls,
affirmations, challenges,     only if you are importing history;
requests                      otherwise use DataForge's "Empty history
                              files" panel and let the tool fill them live
metaQuestions, rubric         usually keep the shipped versions until the
                              real standards land (rubric changes are a
                              SCHEMA session, not a data session)
release                       hand-edit: bump the number, date, label

## SIZE AND SANITY
- mcrs is the big one (about 2 MB synthetic). DataForge warns over 3 MB
  per file; if you hit that, split the CSV, convert in halves, and
  concatenate the rows arrays yourself.
- Masking: the mask map (name -> Person NNN) lives in the tool's Mask
  map panel. Copy it somewhere safe INSIDE the firewall; it never ships.
- After each swap: Preflight (zero errors, entity version shows the new
  date), then spot-check one record end to end (a RAU profile, its
  workbench, its worksheet).
- Derived numbers recompute automatically; nothing else needs editing.
  But if the applicability or inherent math must change to fit your
  fields, that is an ENGINE.md session PLUS the generator mirror, not a
  data session.

## FALLBACK - CONVERT VIA COPILOT (only if the tool is unavailable)
One entity per session. Attach: CONTRACT.md, SCHEMA.md, this card, and
the CSV renamed to .md (mirror\CURRENT-<entity>-csv.md). Prompt:
"Convert the attached CSV to the data file described by SCHEMA.md for
the entity <entity>. Output the complete data/<entity>.js as one fenced
code block: the two-line window.GRC_DATA wrapper with version set to
today and rows as a JSON array. Split semicolon lists into JSON arrays.
ASCII only. No commentary." Verify the wrapper and row count by eye;
Copilot gets no masking and no validation, so prefer the tool.
