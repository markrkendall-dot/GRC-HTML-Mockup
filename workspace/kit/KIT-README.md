# FIREWALL KIT v2 - README (KIT-README.md)

This folder is everything you attach to Microsoft 365 Copilot sessions to
maintain and extend the GRC mockup INSIDE the firewall, where this kit and
the workspace ZIP are all you have. The app in demo\ ships PRE-BUILT
through release R9 (capabilities 1-5, nine demos, feedback and work-list
machinery). You never rebuild it; you EDIT it, one file per session.

## THE CARDS
CONTRACT.md   binding rules for every session: output format, style,
              the module API, kernel services. Attach to EVERY session.
SCHEMA.md     the 15 data entities, the data API, the invariants.
              Attach whenever data is read, written, or reshaped.
ENGINE.md     the standardized math and the generator mirror rule.
              Attach whenever scoring, ratings, key, residual, or
              attention logic is involved.
MODULES.md    what each file owns, versions, sizes, rail orders.
              Read it yourself to pick the right file; attach when the
              change spans modules.
PROMPTS.md    the only prompts you ever type. Copy them exactly.
WORKSHEET.md  your org-specific decisions (names, thresholds). Fill in
              as decisions land; attach when a change depends on them.
cards\        one TASK card per kind of job:
  TASK-EDIT-MODULE.md      change one file (the everyday session)
  TASK-FEEDBACK-ROUND.md   run a whole feedback round, release to release
  TASK-REAL-DATA.md        swap real data into data\ (via the DataForge
                           tool, demo\tools\dataforge.html; Copilot only
                           as fallback)
  TASK-NEW-MODULE.md       add a new capability module
  TASK-FB-TEMPLATE.md      the per-feedback-item card you fill out

## COPILOT SESSION RULES (poka-yoke; these prevent every known failure)
1. ONE file per session. New conversation every session.
2. Attach at most 20 files. A normal EDIT session needs only 4:
   CONTRACT.md + SCHEMA.md (or ENGINE.md) + the TASK card + the
   CURRENT-<name>.md mirror of the file being changed.
3. Copilot cannot take .js or .html attachments: before the session, copy
   the file to mirror\CURRENT-<name>.md (same content, .md extension).
4. Keep every generated file under its ceiling (TASK card states it;
   default 55 KB). Copilot degrades near 100 KB.
5. ASCII only. If the output contains an em dash or curly quote, use the
   FIX prompt; do not hand-patch.
6. Save Copilot's output over the original file (restore the original
   extension), bump nothing yourself: the session output already carries
   the bumped version header. Then run the smoke check in the TASK card.
7. Back up before overwriting: copy the old file to backup\<date>-<name>.

## WHAT CHANGED IN v2 (if you remember v1)
The contract now matches the as-built kernel (tab/rail/caps in register,
engine in ctx, cart/challenge/tour services, localStorage allowed behind
try/catch). SCHEMA covers 15 entities instead of 8 generic ones.
ENGINE.md and MODULES.md are new. The old build-phase cards (TASK-P*,
TASK-M-*) are retired: the app they described was superseded by the real
build. The runbook (GRC-Mockup-Runbook.docx, workspace root) is the
operating manual; this kit is its Copilot-facing half.
