# TASK CARD - EDIT ONE MODULE (the everyday session)

Use this card, filled in, for any change to one existing file. One file,
one session, one new Copilot conversation.

## BEFORE THE SESSION (you, not Copilot)
1. Pick the file with MODULES.md. Note its version and ceiling
   (ceiling = its current size rounded up to the next 5 KB, plus 10 KB,
   max 55 KB for modules, 60 KB for kernel/core.js).
2. Copy the file to mirror\CURRENT-<name>.md (content unchanged, .md
   extension so Copilot accepts it).
3. Copy the file to backup\<yyyy-mm-dd>-<name>.js.
4. Fill THE CHANGE below. One change per card; a second change is a
   second session.

## ATTACH
CONTRACT.md, this card, mirror\CURRENT-<name>.md, and per KIT-README:
SCHEMA.md (data involved) and/or ENGINE.md (math involved).

## PROMPT
Use the EDIT prompt from PROMPTS.md, exactly.

## THE CHANGE (fill in; be concrete; name routes and functions)
File: modules/<name>.js   Current version: <x.y.z>   Ceiling: <nn> KB
Change:
  <what should be different, described as behavior the user sees>
Do not touch:
  <sections that must stay exactly as they are>
Version: bump the minor number (x.Y.z) for behavior changes, the patch
number for copy or cosmetic fixes.

## ACCEPTANCE (run after saving the output over the original)
1. The file starts with the bumped version header and is under the
   ceiling. Search it for any non-ASCII character: none allowed.
2. Open demo\index.html in Edge. Press the Preflight button: zero errors,
   and the version matrix shows the new number.
3. Walk the changed screen and one neighboring screen. If the change
   touched math, also open the relevant rubric page and confirm the
   numbers still reconcile.
4. If anything fails, use the FIX prompt in the SAME session with the
   exact failure text. Never hand-patch Copilot output.
5. Log one line in logs\LOG.txt: date, file, old -> new version, change.
