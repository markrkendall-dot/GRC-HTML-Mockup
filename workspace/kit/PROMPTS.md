# PROMPTS.md - the only things you ever type into Copilot

Replace the <angle-bracket> parts. Type everything else exactly as written.
Every session starts a NEW Copilot conversation.

## BUILD - create a new file
Read every attached file. CONTRACT.md contains binding rules. SCHEMA.md
defines the data. Follow the attached TASK card exactly and produce the single
file it requests. Output the entire file as one fenced code block per the
contract.

## EDIT - change an existing file
Read every attached file. CONTRACT.md contains binding rules. The attached
file CURRENT-<name>.md is the existing file as it stands today. Apply ONLY the
changes described in the attached TASK card and output the ENTIRE updated file
as one fenced code block. Do not rewrite or drop unrelated sections. Keep the
version header and bump the version number.

## CONTINUE - the output was cut off
Continue the file exactly from the marker /* ==SECTION:<name>== */. Repeat
that marker line first, then continue to the end of the file in the same code
block format. Do not repeat anything that came before the marker.

## FIX - an acceptance check failed
The file you produced fails this check: <paste the failed check, and describe
what you see instead>. Output the entire corrected file as one fenced code
block. Change only what is needed to pass the check.
