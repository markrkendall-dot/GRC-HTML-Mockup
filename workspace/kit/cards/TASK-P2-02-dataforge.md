# TASK P2-02 - build tools/dataforge.html  (target v1.0.0)
PRODUCES: tools/dataforge.html   SIZE CEILING: 85 KB
ATTACH THIS SESSION: CONTRACT.md, SCHEMA.md, this card.   PROMPT: BUILD

CONTRACT EXCEPTIONS FOR THIS FILE ONLY: it is a standalone page, not a
module - the Module API and CSS menu do not apply; it has its own inline CSS
(reuse the token color values visually). It MAY use new Function() to parse
previously exported data files. Everything else in the contract applies.

## SPEC
A single-page workbench that turns CSV exports into data/*.js files, fully
offline. Left rail: the 8 entities from SCHEMA.md with a loaded/not-loaded
status dot and row count. Main area walks one entity through 5 steps:
1. LOAD - file input (.csv/.txt) via FileReader, plus a paste textarea.
   CSV parser must handle quoted fields, embedded commas, CRLF. Preview the
   header row and first 5 data rows in a table.
2. MAP - for every schema field of the entity, a dropdown of CSV headers,
   auto-matched by name (case/space/punctuation-insensitive). Required
   fields flagged red until mapped or set to "generate" (ids) / "constant"
   (free-typed value applied to all rows). Multi-value fields (controlIds,
   requirementIds) map to one column plus a delimiter choice (, ; |).
   Foreign-key fields offer two modes: "column contains IDs" or "column
   contains names -> look up by name in the already-loaded target entity".
   Value-mapping mini-table for status-like fields: distinct raw values on
   the left, schema vocabulary dropdowns on the right.
3. VALIDATE - run and show a report: required fields missing (count + first
   20 row numbers), id format/uniqueness, dates parsed to ISO (accept
   common formats), numbers in range, FK targets that do not exist in the
   loaded sets. Buttons: "drop failing rows" or "keep anyway".
4. MASK - per text field choose keep / clear / replace-with-role
   (round-robin from the SCHEMA.md role bank).
5. EXPORT - download data/<entity>.js containing exactly:
   window.GRC_DATA.<entity> = {version:"<today YYYY-MM-DD>", rows:[...]};
   with rows serialized by JSON.stringify (no indentation). Use a Blob and
   a temporary <a download> link.
Also: an "Import existing data/*.js" file input that loads previously
exported files back into memory (execute in a sandbox: build a fake window
object via new Function, read its GRC_DATA) so FK validation works across
sessions. A top status bar summarizes all loaded entities. Everything stays
in memory; refreshing loses work - say so in the header.

## ACCEPTANCE
1. Type this 3-line CSV into the paste box for risks and walk all 5 steps:
   id,title,category,orgUnitId,status,inherentL,inherentI,residualL,residualI,controlIds
   RSK-9001,Test risk one,Technology,ORG-0001,open,4,4,2,3,
   RSK-9002,Test risk two,Financial,ORG-9999,open,3,5,2,2,
2. Validation flags ORG-9999 as a dangling FK when orgUnits is not loaded
   or lacks it.
3. The exported file, dropped into demo/data/ with a script tag added,
   shows in Preflight with the right count.
4. File under 85 KB. If the spec cannot fit, Copilot must say so and
   propose moving steps 3-5 into a second file - accept that split.
