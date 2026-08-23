# KIT STATUS - read before using these cards

The demo\ folder ships PRE-BUILT (reference build R1, capabilities 1 and 2).
You do NOT rebuild it from these cards. The kit's job inside the firewall
is now EDITS and FEEDBACK:

- CONTRACT.md and PROMPTS.md still govern every Copilot session (the EDIT
  and FIX prompts are what you will mostly use). One caveat: the reference
  build's module API is richer than CONTRACT.md v1.0 describes (register
  gains tab/rail; ctx gains engine). When editing a file, the attached
  CURRENT-*.md mirror is the truth; the contract governs style and output
  rules.
- cards\TASK-FB-TEMPLATE.md is the workhorse: every user-feedback change
  becomes a filled FB card and one EDIT session per touched module.
- The build cards (TASK-P*, TASK-M-*) describe the ORIGINAL generic plan
  and are superseded by the built files. Kept for reference; a v2 card set
  regenerates from the reference build after the first feedback round.
- SCHEMA v2 lives in the data files themselves and in the repo's
  docs/DEEPDIVE-C1-C2.md. WORKSHEET.md still collects your org-specific
  decisions.
