# TASK CARD - SWAP REAL DATA INTO data\

The app reads only data\*.js. Real data replaces the synthetic files one
for one: same filenames, same shapes (SCHEMA.md), same wrapper:

  window.GRC_DATA = window.GRC_DATA || {};
  window.GRC_DATA.<entity> = {"version":"<YYYY-MM-DD>","rows":[ ... ]};

## THE PATH
1. Export each source system to CSV and drop the files in data-staging\.
   data-staging\templates\ holds one CSV per entity with the exact
   expected columns (semicolon-separated lists inside a cell for array
   fields such as serviceIds and keywords).
2. Convert one entity per Copilot session. Attach: CONTRACT.md,
   SCHEMA.md, this card, and the CSV renamed to .md
   (mirror\CURRENT-<entity>-csv.md). Prompt:
   "Convert the attached CSV to the data file described by SCHEMA.md for
   the entity <entity>. Output the complete data/<entity>.js as one
   fenced code block: the two-line window.GRC_DATA wrapper with
   version set to today and rows as a JSON array. Split semicolon lists
   into JSON arrays. ASCII only. No commentary."
3. Save over data\<entity>.js. Order matters only in your head, not the
   app: every data file is independent.

## WHICH ENTITIES, WHOSE SYSTEM
raus, orgNodes, services      the RAU inventory and catalogs
riskEvents                    the 90-event library (add errClass,
                              sevClass, enfFlag, visClass per ENGINE.md;
                              if unknown, 3/3/false/1 are neutral)
mcrs                          RRCM publication (head flag = your 80/20
                              set; recCtl optional)
register, ratings, controls, controlLinks, expectedControls,
affirmations, challenges      only if you are importing history;
                              otherwise ship them EMPTY:
                              rows: []  and let the tool fill them live
metaQuestions, rubric         usually keep the shipped versions until the
                              real standards land (WORKSHEET.md)
release                       hand-edit: bump the number, date, label

## SIZE AND SANITY
- mcrs is the big one (about 2 MB synthetic). Keep tail rows lean like
  the shipped file. Anything over ~3 MB per file: split the conversion
  into head and tail sessions and concatenate rows yourself.
- After each swap: open the app, Preflight (zero errors, entity version
  shows the new date), then spot-check one record end to end (a RAU
  profile, its workbench, its worksheet).
- Derived numbers recompute automatically; nothing else needs editing.
  But if the applicability or inherent math must change to fit your
  fields, that is an ENGINE.md session PLUS the generator mirror, not a
  data session.
