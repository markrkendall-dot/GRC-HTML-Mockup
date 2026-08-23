/* GRC modules/skeletons.js v1.0.0 2026-08-23 */
/* Skeleton pages for capabilities 3, 4, and 5 so all ten capabilities are
   recognized in the tool, with their place in the flow, even before they
   are built. Each page states purpose, inputs, outputs, and the planned
   screens, and invites feedback through the pill. */
(function () {
  "use strict";
  var CAPS = {
    cap3: {
      n: 3, title: "Inherent Risk Rating Documentation & Calculation",
      purpose: "Document and calculate the inherent risk of each confirmed risk on a RAU: likelihood, impact across the standard dimensions, and a written rationale, on the program's inherent rating rubric.",
      consumes: "The confirmed risk register from Capability 2, RAU metadata and volumes from Capability 1.",
      produces: "Inherent ratings and rationale per risk, feeding residual risk calculation in Capability 5 and prioritization in Capabilities 7 and 9.",
      screens: [
        "Rating worksheet per risk: likelihood pick with anchored definitions, impact scored per dimension, calculated score and band, required rationale",
        "Documentation completeness view: risks missing rationale or with stale ratings",
        "Rating distribution across a RAU, SubLOB, or LOB, expandable in place"],
      note: "The inherent rating rubric is its own standard, separate from the applicability rubric in Capability 2."
    },
    cap4: {
      n: 4, title: "Control Identification",
      purpose: "Identify and map controls to the confirmed risks on each RAU: what the control is, who owns it, whether it is key, and which risks it addresses.",
      consumes: "The confirmed risk register from Capability 2 and RAU process maps from Capability 1.",
      produces: "The risk-to-control mapping consumed by Control Testing (7), Audit Testing (8), and residual risk in RCSA Administration (5).",
      screens: [
        "Control inventory per RAU and enterprise-wide, with caret expansion from risk to its controls",
        "Coverage gaps: confirmed risks with no key control",
        "Control detail: linked risks, owner, type, automation, test history once Capability 7 lands"],
      note: "A working preview already exists: open the Feature gallery item \"Assign a new control to an existing risk instance\".",
      link: { label: "Open the control assignment preview", route: "gallery/assign-control" }
    },
    cap5: {
      n: 5, title: "RCSA Administration",
      purpose: "Run the assessment cycles: the front line submits, ORBO and BACO challenge, residual risk is calculated from inherent ratings and control effectiveness, and sign-off is recorded.",
      consumes: "Inherent ratings from Capability 3 and the control mapping from Capability 4.",
      produces: "Approved RCSA results with residual risk per RAU, feeding Monitoring (9) and the reporting chain.",
      screens: [
        "Cycle dashboard: every RAU and its assessment status, expandable by LOB and SubLOB in place",
        "Assessment workspace per RAU: line items per risk, control environment judgment, residual out, challenge log",
        "Prior-cycle comparison with direction of change"],
      note: "The ORBO and BACO challenge queues seen as placeholders in My Work land here."
    }
  };

  /* ==SECTION:render== */
  function skeleton(key) {
    return function (el, ctx) {
      var ui = ctx.ui;
      var c = CAPS[key];
      el.appendChild(ui.el("div", { class: "g-page-head" },
        ui.el("div", {}, [
          ui.el("div", { class: "g-row" }, [
            ui.el("span", { class: "g-h1" }, c.n + ". " + c.title),
            ui.badge("Planned", "warn")]),
          ui.el("div", { class: "g-muted" }, "Recognized in the flow, not yet built. This page holds its place and collects requirements.")])));
      var left = ui.el("div");
      left.appendChild(ui.card({
        title: "What it does", body: ui.el("div", {}, [
          ui.el("p", {}, c.purpose),
          ui.kv([["Consumes", c.consumes], ["Produces", c.produces]])])
      }));
      left.appendChild(ui.card({
        title: "Planned screens", body: ui.el("div", {}, [
          ui.el("ul", { style: "margin:0;padding-left:20px" }, c.screens.map(function (s) { return ui.el("li", { style: "padding:2px 0" }, s); })),
          ui.el("div", { class: "skel-strip" }, [ui.el("i"), ui.el("i"), ui.el("i")])])
      }));
      var right = ui.el("div");
      right.appendChild(ui.card({
        title: "Notes", body: ui.el("div", {}, [
          ui.el("p", {}, c.note),
          c.link ? ui.el("p", {}, ui.el("button", { class: "g-btn", onclick: function () { ctx.go(c.link.route); } }, c.link.label)) : null,
          ui.el("p", { class: "g-muted", style: "font-size:12.5px" }, "Know something this capability must include? Use the feedback pill at the bottom left; the item will reference this page.")])
      }));
      el.appendChild(ui.el("div", { class: "g-split" }, [left, right]));
    };
  }

  GRC.register({
    id: "skeletons", version: "1.0.0", tab: "RCSA",
    rail: [
      { label: "3. Inherent ratings", route: "cap3", order: 22 },
      { label: "4. Controls", route: "cap4", order: 24 },
      { label: "5. RCSA cycles", route: "cap5", order: 26 }
    ],
    routes: { "cap3": skeleton("cap3"), "cap4": skeleton("cap4"), "cap5": skeleton("cap5") }
  });
})();
