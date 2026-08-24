DEMO DATA FOLDER
================
The app reads its data from the .js files in THIS folder - one file per
entity (raus.js, mcrs.js, controls.js, ...). Never hand-edit them and
never route them through Copilot chat. They come from exactly two places:

  SYNTHETIC (what ships): generated outside the firewall by
  tools-dev\generate-data.js at true scale, so every screen demos with
  realistic volumes and relationships.

  REAL (yours): produced by demo\tools\dataforge.html from CSV exports
  staged in data-staging\. Replacing a file here with a DataForge export
  of the same name is the entire data integration step - same filenames,
  same shapes, swap one entity at a time (data-staging\README.txt has
  the order; kit\cards\TASK-REAL-DATA.md has the full procedure).

Special file: release.js holds the release number shown in the banner -
it is bumped by hand at release time (runbook Part 6), the one file
here not produced by either pipeline.

After any swap: open the app, Preflight (zero errors, the entity shows
the new version date), then walk one record end to end.
