# WORKSHEET v2 - your terms, fields, and relationships (WORKSHEET.md)

Fill this in with Notepad as decisions land. Every row has a working
default: leave "Your value" blank to accept it. W1/W2 differences get
folded into the cards by a deliberate schema/engine session (rare).
W3-W6 are used LIVE inside demo\tools\dataforge.html when you swap real
data; the tool's mapping step is W3 on screen, so this sheet is where
you work the mapping out BEFORE the conversion sitting, with the people
who know the exports.

## W1 - TERMINOLOGY (display labels only; field names never change)
| Ours (default label) | Your org's word (blank = keep default) |
|---|---|
| RAU / Risk Assessable Unit | |
| Risk event | |
| Risk instance | |
| MCR | |
| Control | |
| Affirmation | |
| Challenge | |
| ORBO / BACO | |

## W2 - SCORING KNOBS (the standardized math lives in ENGINE.md)
| Question | Default | Your value |
|---|---|---|
| Applicability: likely-candidate threshold | 70 of 100 | |
| Applicability: possible-candidate threshold | 40 of 100 | |
| Inherent grid | 5x5, band from the grid | |
| Residual knockdown (Strong/Adequate/Weak) | -2 / -1 / -0 bands | |
Changing any of these is an ENGINE session plus the generator mirror
(ENGINE.md), never a quiet edit.

## W3 - REAL-DATA COLUMN MAP (one block per entity you will import)
For each entity, note which column in YOUR export feeds each schema
field. Blank = your export lacks it; DataForge fills the documented
default (SCHEMA.md has full field lists; templates\ shows the columns).
The five core entities, their must-come-from-somewhere fields:

RAUS - your export: ______________________
| Schema field | Your CSV column | Notes |
|---|---|---|
| id | | RAU-nnnn |
| name | | |
| subLobId | | must match an orgnodes sublob id |
| category | | business-service / shared-services / enterprise |
| owner (+ delegate, bcmContact, orbo, baco) | | people - see W6 masking |
| serviceIds | | list; delimiter: ____ (default ;) |
| fte / locations / annualVolume / priorLosses12m | | numbers; volume drives suggested likelihood |
| changeLevel | | low / medium / high |
| tags / excl | | attribute + exclusion tokens; drive applicability |

ORGNODES / SERVICES - your export: ______________________
| id / level / parentId / name | | hierarchy: enterprise > lob > sublob; services levels 1-3 |

RISKEVENTS - your export: ______________________
| id / side / name / keywords / tags | | the 90-event library |
| errClass / sevClass / enfFlag / visClass | | rating drivers; blank = neutral 3/3/false/1 |

MCRS - your export: ______________________
| id / name / parentEventId / regFamily / citation | | from RRCM |
| head | | your 80/20 flag; blank = inferred from obligations |

HISTORY (register, ratings, controls, controlLinks, expectedControls,
affirmations, challenges, requests) - importing at all? Y / N: ____
If N: use DataForge's Empty history files panel. If Y, copy this table
per entity from the template columns.

## W4 - RELATIONSHIPS PRESENT IN YOUR EXPORTS
| Link | In your exports? (Y/N) | Carried as ids or names? |
|---|---|---|
| RAU -> sublob (orgnodes) | | |
| RAU -> services | | |
| MCR -> parent risk event | | |
| instance (register) -> RAU + event | | |
| control -> owning RAU | | |
| control link -> control + RAU + event | | |
| challenge -> RAU (+ event / control) | | |
If a link is N: DataForge leaves it empty and the demo still works; the
related panels just show fewer connections. Ids that do not resolve show
up in the validation report as dangling references - a handful is fine.
Which links matter most for your demo: _______________________________

## W5 - VOLUMES (so you know what to expect on screen)
| Entity | Synthetic ships | Yours |
|---|---|---|
| raus | 850 | |
| riskEvents | 90 | |
| mcrs | 8,000 (2,000 head) | |
| register (instances) | ~4,800 | |
| ratings | ~2,600 | |
| controls / links | 5,146 / 6,366 | |

## W6 - MASKING (applied by DataForge before export)
| Field group | keep / mask (default) |
|---|---|
| RAU roles (owner, delegate, bcmContact, orbo, baco) | mask |
| control owner | mask |
| decided-by / rated-by / affirmed-by (register, ratings, affirmations) | mask |
| challenge byName / respondedBy; request requester | mask |
| descriptions and free text | keep (review by eye) |
Masking replaces each distinct name with a stable pseudonym (Person 001,
...) consistently across every entity exported in the sitting. Copy the
tool's mask map somewhere safe INSIDE the firewall. Free text is NOT
scanned: if descriptions carry names or account numbers, clean them at
the source.

## W7 - DEMO STORYLINE (records to feature once real data is in)
| Scene | Record id after data load |
|---|---|
| Featured RAU (profile walkthrough) | RAU-____ |
| Its highest instance (rate + mitigate) | REV-____ on RAU-____ |
| A control worth challenging | CTL-____ |
| The affirmation moment | RAU-____ |
The shipped demos find records by stage and shape at runtime, so they
keep working after a swap; this table is for YOUR narration.
