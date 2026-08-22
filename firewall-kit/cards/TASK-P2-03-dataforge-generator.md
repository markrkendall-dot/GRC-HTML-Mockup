# TASK P2-03 - EDIT tools/dataforge.html: add the synthetic generator
PRODUCES: tools/dataforge.html (target v1.1.0)   SIZE CEILING: 90 KB
ATTACH: CONTRACT.md, SCHEMA.md, this card, CURRENT-dataforge-html.md
PROMPT: EDIT

## CHANGES
Add a "Generate" tab next to the per-entity workflow:
- Volume inputs prefilled from the SCHEMA.md synthetic defaults (one input
  per entity, plus months of trend). A "seed" text input: same seed = same
  dataset (implement a small seeded PRNG; do not use Math.random so runs are
  reproducible).
- "Generate all" builds every entity IN DEPENDENCY ORDER (orgUnits ->
  frameworks/requirements -> controls -> risks -> policies -> assessments ->
  issues -> trend) with all foreign keys valid and the relationship rules
  and weighted distributions described in SCHEMA.md. Names must read like a
  real company: build them from word banks (departments, systems, processes,
  threats; e.g. risk title = threat phrase + " in " + system/process).
  Descriptions: 1-2 plausible sentences from templates.
- Trend: 24 monthly rows telling a story - gradual improvement with one
  visible regression mid-series; the last month roughly matches the
  generated current-state numbers.
- "Download all" saves the 8 data/*.js files (same export format as v1.0).
- "Backfill trend from loaded data": when real entities are loaded but no
  trend exists, synthesize 24 months that end at the real current numbers.

## ACCEPTANCE
1. Generate with seed "demo1": preview counts match the volume inputs.
2. Download all 8 files, put them in demo/data/, add script tags, REMOVE
   data/sample.js and its tag. Refresh: Preflight shows all entities with
   correct counts and zero dangling references.
3. Generate twice with the same seed: identical first row both times.
4. File under 90 KB. If it will not fit, Copilot must propose splitting the
   generator into tools/dataforge-gen.js loaded by a script tag - accept.
