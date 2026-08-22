# KIT-README.md - what this folder is

This folder is the "firewall kit" for building the GRC HTML mockup with M365
Copilot chat. You attach these .md files to Copilot sessions; Copilot outputs
code files; you save them into the demo folder. The full procedure lives in
the runbook document (GRC-Mockup-Runbook.docx). If you have the runbook, start
there - Part 0 explains everything.

Files:
- CONTRACT.md   binding rules Copilot must follow - attach to EVERY session
- SCHEMA.md     data model, relationships, metrics - attach to EVERY session
- PROMPTS.md    the four prompts you type (BUILD / EDIT / CONTINUE / FIX)
- WORKSHEET.md  where you record YOUR terms, fields, mappings, decisions
- cards/        one TASK card per build session - attach the session's card

Never edit CONTRACT.md casually: every module already built assumes it.
SCHEMA.md changes only through the P2-01 procedure in the runbook.
