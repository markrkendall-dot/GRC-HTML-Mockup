# WORKSHEET.md - your terms, fields, and relationships

Fill this in with Notepad. Every row has a working default: leave "Your value"
blank to accept it. When any answer differs from the default, run optional
session P2-01 (attach this file) so Copilot folds your answers into SCHEMA.md.
Real-data column mappings (W3/W4) are used inside DataForge, not in SCHEMA.md.

## W1 - TERMINOLOGY (display labels only; field names never change)
| Ours (default label) | Your org's word (blank = keep default) |
|---|---|
| Risks | |
| Controls | |
| Policies | |
| Issues | |
| Assessments | |
| Frameworks | |
| Org Units | |

## W2 - SCORING
| Question | Default | Your value |
|---|---|---|
| Scale (LxI) | 5x5 | |
| Band: Low | 1-4 | |
| Band: Moderate | 5-9 | |
| Band: High | 10-15 | |
| Band: Critical | 16-25 | |

## W3 - REAL-DATA COLUMN MAP (one block per entity; add rows as needed)
For each entity you will import, list which column in YOUR export feeds each
schema field. Leave a field blank if your export lacks it (optional fields may
stay empty; required fields must come from somewhere, even a constant).

RISKS - your export file name: ______________________
| Schema field | Your CSV column header | Notes |
|---|---|---|
| id | | or "generate" to auto-number |
| title | | |
| category | | |
| orgUnitId | | id or name (see W4) |
| ownerRole | | will be masked per W6? |
| status | | your vocabulary -> map in DataForge |
| inherentL / inherentI | | |
| residualL / residualI | | |
| treatment | | |
| reviewDate | | |
| controlIds | | delimiter used: ____ |

(Repeat the same table for CONTROLS, POLICIES, ISSUES, ASSESSMENTS,
ORGUNITS, FRAMEWORKS/REQUIREMENTS as applicable.)

## W4 - RELATIONSHIPS PRESENT IN YOUR DATA
| Link | Exists in your exports? (Y/N) | Carried as IDs or names? |
|---|---|---|
| risk -> controls | | |
| control -> framework requirements | | |
| policy -> controls | | |
| issue -> risk | | |
| issue -> control | | |
| issue -> assessment | | |
| record -> org unit | | |
If a link is N: DataForge leaves it empty and the demo still works; the
related panels just show fewer connections. Note which ones matter most:
_______________________________________________

## W5 - VOLUMES
| Entity | Approx rows in your export |
|---|---|
| risks | |
| controls | |
| policies | |
| issues | |
| requirements | |
| orgUnits | |
| assessments | |

## W6 - MASKING (applied in DataForge before export)
| Field | keep / clear / replace-with-role | 
|---|---|
| owner names/emails | replace-with-role (default) |
| descriptions | keep (default) |
| other: ______ | |

## W7 - DEMO STORYLINE (used by the demo module; defaults provided there)
| Scene | Record to feature (id after data load) |
|---|---|
| Featured critical risk | RSK-____ |
| Its weak control | CTL-____ |
| A framework with a visible gap | FRW-__ |
| An overdue issue | ISS-____ |
