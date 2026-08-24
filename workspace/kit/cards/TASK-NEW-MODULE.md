# TASK CARD - ADD A NEW MODULE (a new capability page)

For capabilities 6 through 10, or any new screen family. Two sessions:
one for the module, one small EDIT for index.html.

## SESSION 1 - the module file
Attach: CONTRACT.md, SCHEMA.md, MODULES.md, this card (filled), and
ENGINE.md if the screen computes anything.
Fill in below, then use the BUILD prompt from PROMPTS.md.

File: modules/<name>.js   Version: 1.0.0   Ceiling: <nn> KB (max 55)
Tab: <Home | RCSA | Signals | Testing | Monitoring | Policy>
  (a new tab name must also be removed from the SOON list in
  kernel/core.js: that is a separate kernel EDIT session)
Rail entries: <label> / <route> / <order>  (pick free orders; see the
  rail order map in MODULES.md)
Routes and what each screen shows:
  <route>: <one paragraph per screen: layout, data read, actions>
caps declarations per route: {primary:[n], uses:[..], feeds:[..]}
Actions that mutate data: name the SCHEMA.md mutator for each; every
  user-visible action calls GRC.traceAction(<cap>, "<label>").
Work-cart sources: which rows get GRC.cart.btn and with what item kind.
Challenge sources: which records get a GRC.challenge button.

## SESSION 2 - index.html
EDIT session on index.html (mirror it first): add
<script src="modules/<name>.js"></script> before modules/demo.js, add any
new CSS classes the TASK defined, bump the index.html version header.

## ACCEPTANCE
1. Preflight zero errors; the new rail entries appear; the trace strip
   names the right capabilities on each new route.
2. Every table sorts and pages; every entity mention links; carets expand
   in place; no summary count tiles.
3. Add one scene to modules/demo.js (a later EDIT session) so the
   walkthrough knows the screen exists, and a gallery item if the
   capability is vote-worthy.
4. New data entities needed? That is a SCHEMA.md + kernel/core.js change
   (entity list + indexes + API) plus a data file and an index.html tag:
   plan it as its own set of sessions before this one.
