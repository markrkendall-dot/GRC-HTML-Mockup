/* GRC modules/demo.js v1.0.1 2026-08-23 */
/* Present: the guided walkthrough of capabilities 1 and 2. */
(function () {
  "use strict";
  function scenes(ctx) {
    var data = ctx.data;
    var story = data.all("raus").filter(function (r) { return r.name === "Escrow Administration"; })[0] || data.all("raus")[0];
    var uq = data.all("requests").filter(function (q) { return q.stage === "uniqueness-review" && q.uniqueness; })[0];
    var mapping = data.all("requests").filter(function (q) { return q.stage === "process-mapping"; })[0];
    var meta = data.all("requests").filter(function (q) { return q.stage === "metadata-creation"; })[0];
    var s = [
      { route: "home", title: "One platform, ten capabilities", text: "This is a clickable design proposal for the future GRC. The map shows all ten capabilities and how they feed each other; this release builds capabilities 1 and 2 end to end. Everything you are about to see runs on data shaped like the real inventory." },
      { route: "raus", title: "Capability 1: the RAU inventory", text: "A RAU is the intersection of a business and a service, created at the SubLOB level. Filter the inventory by line of business, category, or risk identification status. Every column here is a real attribute the platform maintains." },
      { route: "raus/" + story.id, title: "One RAU's whole story", text: "Demographics describe the unit; attributes OBLIGATE it: they drive applicability, signal matching, and scoping. Check the Metadata survey tab: every answer shows where it came from: a map step, from services, or asked directly. The Process map tab shows the handoffs that wire this RAU to its counterparties." },
      { route: "pipeline", title: "The inventory changes through one pipeline", text: "New RAU, merge, split, retire: every change request moves through the same governed stages. About ten are in flight at any time. Merges and retirements show a live impact preview: how many risks and handoffs move." }
    ];
    if (uq) s.push({
      route: "pipeline/" + uq.id, state: { role: "RCSA RAU Governance" },
      title: "The uniqueness gate: AI analyzes, humans decide",
      text: "The assistant compared this request against every RAU in the same line of business: 82% overlap with an existing unit, reasons listed, category checked. The RCSA RAU Governance team (your current View-as role) can advance it, return it, or decline with a redirect to the overlapping RAU's owner. No two RAUs get to claim the same work."
    });
    if (mapping) s.push({
      route: "pipeline/" + mapping.id + "/map",
      title: "Process mapping with a coach",
      text: "Each intake bullet becomes a phase; the requester expands it 2-10 steps with the assistant coaching on what comes next, where the handoffs are, and what happens on failure. The standards checklist gates progression: no expert needed, and no map leaves here below standard. Try adding a step."
    });
    if (meta) s.push({
      route: "pipeline/" + meta.id + "/survey",
      title: "Metadata: the assistant fills the survey",
      text: "After governance approval the assistant completes the standardized survey from the process map and services, asking only what it cannot conclude. Notice most questions confirm what the RAU does NOT do; absence never shows on a map, and exclusions are what scope out whole slices of the regulatory universe. Answer the open questions and activate the RAU."
    });
    s.push(
      {
        route: "riskid/" + story.id, title: "Capability 2: the applicability workbench",
        text: "The engine scores the full risk event inventory, and the MCRs beneath the compliance events, against this RAU's metadata using one standardized rubric. Likely candidates confirm in a click; the exclusions panel shows what the survey suppressed; the ambiguous middle is where the intelligence earns its keep."
      },
      {
        route: "riskid/" + story.id, title: "Resolve: out of the middle",
        text: "Open Resolve on a middle-band item. The system asks one or two targeted questions; your answer updates the RAU's metadata, so EVERY candidate rescores consistently. Watch the score jump out of the middle. Expand 'Why this score' to see the 8-category rubric breakdown behind any number."
      },
      {
        route: "rubric", title: "Standardized math you can point at",
        text: "Eight thematic categories, 1-5 anchors, fixed weights, published bands, identical for every RAU. Applicability stops being hundreds of opinions and becomes one defensible calculation plus documented human judgment."
      },
      {
        route: "mcrlib", title: "The MCR library, published from RRCM",
        text: "Major Compliance Requirements arrive read-only from RRCM, each aligned upstream to a parent compliance risk event. A head set carries most RCSA frequency, and the library reflects that shape. Search anything."
      },
      {
        route: "home", title: "And this is two capabilities of ten",
        text: "Signals will feed changes into steps 1 and 2. Ratings, controls, RCSA cycles, testing, monitoring, and policy governance stack on the same foundation you just walked. The release number in the banner identifies this build; quote it in your feedback."
      });
    return s;
  }

  function present(el, ctx) {
    var ui = ctx.ui;
    var s = scenes(ctx);
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "Present: guided walkthrough"),
        ui.el("div", { class: "g-muted" }, s.length + " scenes through capabilities 1 and 2. The overlay drives navigation; you keep full control of the screen and can click anything mid-scene.")])));
    el.appendChild(ui.card({
      title: "Scenes", body: ui.el("div", {}, [
        ui.el("ol", { style: "margin:0 0 12px;padding-left:20px" }, s.map(function (x) { return ui.el("li", { style: "padding:2px 0" }, x.title); })),
        ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { GRC.tour(s); } }, "Start presentation")])
    }));
    el.appendChild(ui.card({
      title: "Presenting tips", body: ui.el("ul", { style: "margin:0;padding-left:20px;color:var(--g-muted)" }, [
        ui.el("li", {}, "F11 for full screen; the tour card sits at the bottom and never blocks the rail."),
        ui.el("li", {}, "Off-script questions: Exit, click wherever the question leads, restart anytime."),
        ui.el("li", {}, "After playing with actions, Preflight > Reset demo data restores the shipped state.")])
    }));
  }

  GRC.register({
    id: "demo", version: "1.0.1", tab: "Home",
    routes: { "present": present }
  });
})();
