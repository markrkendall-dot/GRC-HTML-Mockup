# TASK P3-03 - EDIT demo/index.html: theme polish and real script list
PRODUCES: index.html (target v2.0.0)   SIZE CEILING: 60 KB
ATTACH: CONTRACT.md, SCHEMA.md, this card, CURRENT-index-html.md
PROMPT: EDIT

## CHANGES
1. Product identity: rename the sidebar mark to "Meridian GRC" (DECISION D1
   - if you chose another name, write it here before the session: ______).
   Add a small inline-SVG logo mark: a rounded square containing a 3x3 grid
   of squares with 3 accent-filled cells rising diagonally.
2. Visual pass, tokens unchanged: consistent card shadows and 1px borders,
   hover states for rows/buttons/nav, focus-visible rings, muted scrollbar
   styling, refined table density (10px vertical padding), sidebar active
   item with accent left bar, top bar with subtle bottom border. Badges as
   small caps pills. A .g-kpi grid layout that wraps to 2 columns on narrow
   windows. Basic @media print: hide sidebar/top bar, white background.
3. Update the script list to the current real state, in order: kernel/core.js,
   kernel/ui.js, kernel/charts.js, the 8 data files (orgunits, frameworks,
   controls, risks, policies, assessments, issues, trend), modules/dashboard.js,
   modules/hello.js, keeping the comment that each future module adds one
   line before the boot script. (data/sample.js is gone.)
4. Do not change ids or structure the kernel depends on: #g-nav #g-title
   #g-orgunit #g-search #g-preflight-btn #outlet #preflight.

## ACCEPTANCE
1. Boots clean; nav, filter, preflight all still work.
2. Looks like one product: consistent spacing, borders, hover and focus
   states everywhere; badges and KPIs visually coherent.
3. Ctrl+P preview: content prints white without chrome.
4. Under 60 KB.
