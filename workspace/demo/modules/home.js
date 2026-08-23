/* GRC modules/home.js v1.1.0 2026-08-23 */
/* Home: the capability flow (clickable) and curated entry points. */
(function () {
  "use strict";
  function home(el, ctx) {
    var ui = ctx.ui, data = ctx.data;
    el.appendChild(ui.el("div", { class: "g-page-head" }, [
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "RCSA program"),
        ui.el("div", { class: "g-muted" }, "A working proposal for the future GRC. This release (" + data.release().number + ") builds capabilities 1 and 2 end to end. The remaining capabilities are placed below so the whole shape is visible.")]),
      ui.el("div", { class: "sp" }),
      ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { ctx.go("present"); } }, "Start guided demo")]));

    /* ==SECTION:map== */
    function box(n, title, sub, route, live) {
      return ui.el("div", {
        class: "capbox" + (live ? " live" : ""),
        onclick: function () { ctx.go(route); },
        title: live ? "Built in this release. Click to open." : "Arrives in a later phase."
      }, [
        ui.el("div", { class: "cn" }, "CAPABILITY " + n + (live ? "" : " (LATER PHASE)")),
        ui.el("div", { class: "ct" }, title),
        ui.el("div", { class: "cs " + (live ? "" : "g-muted") }, sub)]);
    }
    var arrow = function () { return ui.el("span", { class: "flowarrow" }); };
    var mapCard = ui.el("div", { class: "g-card" });
    mapCard.appendChild(ui.el("div", { class: "g-h2" }, "The capability flow"));
    mapCard.appendChild(ui.el("div", { style: "display:grid;grid-template-columns:1fr 20px 1fr 20px 1fr 20px 1fr 20px 1fr;gap:6px;align-items:stretch;margin-bottom:10px" }, [
      box(1, "RAU Demographics & Attributes", "Intake, process mapping, metadata", "raus", true), arrow(),
      box(2, "Risk Identification", "Applicability of risk events and MCRs", "riskid", true), arrow(),
      box(3, "Inherent Risk Rating", "Skeleton in place; requirements wanted", "cap3", false), arrow(),
      box(4, "Control Identification", "Skeleton plus a working preview", "cap4", false), arrow(),
      box(5, "RCSA Administration", "Skeleton in place; requirements wanted", "cap5", false)]));
    mapCard.appendChild(ui.el("div", { style: "display:grid;grid-template-columns:1fr 1fr 2fr;gap:6px;margin-bottom:10px" }, [
      box(7, "Control Testing", "Feeds from Control Identification", "soon/Testing-0", false),
      box(8, "Audit Testing", "Feeds from Control Identification", "soon/Testing-1", false),
      box(9, "Monitoring", "Watches capabilities 1 through 6", "soon/Monitoring-0", false)]));
    mapCard.appendChild(ui.el("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:6px" }, [
      box(6, "Signals & Impact Assessment", "New activity and change feed back into capabilities 1 and 2", "soon/Signals-0", false),
      box(10, "Policy Governance", "Governs every capability above", "soon/Policy-0", false)]));
    el.appendChild(mapCard);

    /* ==SECTION:gallery-teaser== */
    var story = data.all("raus").filter(function (r) { return r.name === "Escrow Administration"; })[0];
    el.appendChild(ui.el("div", { class: "g-split" }, [
      ui.card({
        title: "Feature gallery",
        actions: [ui.el("button", { class: "g-btn sm", onclick: function () { ctx.go("gallery"); } }, "Open the gallery")],
        body: ui.el("div", {}, [
          ui.el("p", {}, "Curated, concrete examples of features we could ship, from basic to exotic, grouped by theme and complexity. Each one opens a live example in the tool. Mark each Keep, Discuss, or Cut; the votes export with your feedback so the room can decide from the same list."),
          ui.el("p", { class: "g-muted", style: "font-size:12.5px;margin-bottom:0" }, "Samples: assign a control to a risk instance, catch a duplicate RAU at intake, watch one answer rescore a whole stack of candidates.")])
      }),
      ui.card({
        title: "About this mockup", body: ui.el("p", { class: "g-muted", style: "margin:0" },
          "A clickable design proposal running entirely from local files on synthetic data shaped like the real inventory. The release number in the banner identifies this exact build; the feedback pill at the bottom left captures what to change, tied to the page you are on. Actions are session only; Preflight has a reset." +
          (story ? " A good first stop: " + story.id + " " + story.name + " under RCSA." : ""))
      })]));
  }

  GRC.register({
    id: "home", version: "1.1.0", tab: "Home",
    rail: [{ label: "Program map", route: "home", order: 10 }],
    routes: { "home": home }
  });
})();
