RELEASES
========
Each subfolder R1, R2, R3... is a complete frozen copy of demo\ made at
release time, plus a RELEASE-NOTES.txt. Rules:
- Created only by the release gate checklist (runbook Part 9.4).
- NEVER edited after creation. A bug in R3 is fixed in demo\ and ships as R4.
- Any release runs standalone: double-click its index.html.
- Rollback = copy the previous R folder over demo\ (back demo\ up first).
- The release number inside data\release.js must match the folder name.
