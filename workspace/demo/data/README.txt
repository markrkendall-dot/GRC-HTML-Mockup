DEMO DATA FOLDER
================
The app reads its data from the .js files in THIS folder - one file per
entity (raus.js, risks.js, controls.js, ...). Each is produced by
demo\tools\dataforge.html (from your CSVs in data-staging\, or from its
synthetic generator) - never written by hand and never via Copilot chat.

In the final packaged workspace this folder ships with DUMMY versions of
every data file (a handful of rows each) so the app boots immediately and
you can see exactly which file feeds which screen. Replacing a dummy file
with a real one of the same name is the entire data integration step.

Special file: release.js holds the release number shown in the banner -
it is bumped by hand at release time (runbook Part 9.3), the one file
here not produced by DataForge.
