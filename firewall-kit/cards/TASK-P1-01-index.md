# TASK P1-01 - build demo/index.html  (target v1.0.0)
PRODUCES: index.html            SIZE CEILING: 45 KB
ATTACH THIS SESSION: CONTRACT.md, SCHEMA.md, this card.   PROMPT: BUILD

## SPEC
- One complete HTML page, title "GRC Mockup". All CSS inline in one <style>
  block. No application logic in this file: logic lives in kernel files.
- Define the design tokens from the contract as CSS variables on :root and
  implement EVERY class in the contract's CSS CLASS MENU. Look: clean,
  enterprise, light. Values: --g-bg #f5f6f8, --g-card #ffffff, --g-ink
  #1f2430, --g-muted #6a7280, --g-line #d9dde3, --g-accent #14557b, --g-ok
  #1e7d3c, --g-warn #b96a00, --g-bad #b3261e. Radius 8px, subtle shadows,
  system-ui font, dense but readable tables, visible keyboard focus.
- Layout: left sidebar 220px containing a product mark ("GRC Mockup" for now)
  and an empty <nav id="g-nav"> the kernel fills from registered modules.
  Main column: top bar with <span id="g-title"></span>, an org-unit
  <select id="g-orgunit"></select>, a search <input id="g-search"> and a
  "Preflight" <button id="g-preflight-btn">; below it the content container
  <main id="outlet"></main>.
- A hidden right-side panel <div id="preflight"> styled as a drawer; the
  kernel fills and toggles it. Include styles for a "module failed" g-card
  and for the g-empty state.
- End of body, script tags in exactly this order, each on its own line, with
  a comment above them saying new data/module files each get one line here:
    kernel/core.js
    data/sample.js
    modules/hello.js
  then: <script>window.addEventListener("load",function(){GRC.boot()});</script>

## ACCEPTANCE
1. Double-click index.html in Edge: sidebar, top bar, and empty content area
   render. Console shows only "Failed to load" errors for the three script
   files that do not exist yet - that is expected until P1-02/P1-03.
2. Line 2 of the file (after <!DOCTYPE html>) is the version header comment.
3. Every class named in the contract's CSS CLASS MENU appears in the <style>
   block.
4. File size under 45 KB.
