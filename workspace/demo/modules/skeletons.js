/* GRC modules/skeletons.js v1.2.0 2026-08-23 */
/* Skeleton pages for capabilities not yet built, so all ten capabilities
   are recognized in the tool with their place in the flow. Capability 3
   graduated to modules/inherent.js in R5 and Capability 4 to
   modules/controls.js in R6; their old routes redirect. Each
   remaining page states purpose, inputs, outputs, and the planned
   screens, and invites feedback through the pill. */
(function () {
  "use strict";
  var CAPS = {
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
    id: "skeletons", version: "1.2.0", tab: "RCSA",
    caps: {
      "cap5": { primary: [5], uses: [3, 4], preview: true }
    },
    rail: [
      { label: "5. RCSA cycles", route: "cap5", order: 26 }
    ],
    routes: {
      "cap3": function (el, ctx) { ctx.go("inherent"); },
      "cap4": function (el, ctx) { ctx.go("controls"); },
      "cap5": skeleton("cap5")
    }
  });
})();
