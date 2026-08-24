/* GRC modules/home.js v1.3.0 2026-08-23 */
/* Home: the capability flow doubles as a lens. Click boxes to select a
   development scope; everything not supporting that scope grays out, and
   the readout shows what else is required and a suggested build order. */
(function () {
  "use strict";
  function home(el, ctx) {
    var ui = ctx.ui, data = ctx.data;
    var sel = (ctx.state.get("capLens") || []).slice();
    function setSel(s) { ctx.state.set("capLens", s); }

    el.appendChild(ui.el("div", { class: "g-page-head" }, [
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "RCSA program"),
        ui.el("div", { class: "g-muted" }, "A working proposal for the future GRC. This release builds capabilities 1 through 5 end to end. Click capability boxes below to isolate a scope; everything outside its support set grays out.")]),
      ui.el("div", { class: "sp" }),
      ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { ctx.go("present"); } }, "Start guided demo")]));

    /* ==SECTION:lens-math== */
    var closure = sel.length ? GRC.caps.closure(sel) : null;
    function boxState(n) {
      if (!closure) return "";
      if (sel.indexOf(n) >= 0) return "sel";
      if (closure.indexOf(n) >= 0) return "req";
      return "dim";
    }
    function toggle(n) {
      var i = sel.indexOf(n);
      if (i >= 0) sel.splice(i, 1); else sel.push(n);
      setSel(sel);
      var container = el;
      container.innerHTML = "";
      home(container, ctx);
    }

    /* ==SECTION:map== */
    function box(n, sub, openRoute) {
      var st = boxState(n);
      var live = GRC.caps.built(n);
      var kids = [
        ui.el("div", { class: "cn" }, "CAPABILITY " + n + (live ? "" : " (LATER PHASE)")),
        ui.el("div", { class: "ct" }, GRC.caps.name(n)),
        ui.el("div", { class: "cs " + (live ? "" : "g-muted") }, sub)];
      if (st === "sel") kids.push(ui.el("span", { class: "selmark" }, "SELECTED"));
      if (st === "req") kids.push(ui.el("span", { class: "reqmark" }, "REQUIRED"));
      if (openRoute) {
        kids.push(ui.el("a", {
          href: "#/" + openRoute, style: "font-size:11.5px;margin-top:4px;display:inline-block",
          onclick: function (e) { e.stopPropagation(); }
        }, live ? "Open" : "Open skeleton"));
      }
      return ui.el("div", {
        class: "capbox " + (live ? "live " : "") + st,
        onclick: function () { toggle(n); },
        title: "Click to add or remove Capability " + n + " from the scope lens."
      }, kids);
    }
    var arrow = function () { return ui.el("span", { class: "flowarrow" }); };
    var mapCard = ui.el("div", { class: "g-card" });
    mapCard.appendChild(ui.el("div", { class: "g-row", style: "justify-content:space-between" }, [
      ui.el("div", { class: "g-h2", style: "margin:0" }, "The capability flow"),
      sel.length ? ui.el("button", { class: "g-btn sm", onclick: function () { setSel([]); el.innerHTML = ""; home(el, ctx); } }, "Clear selection") : ui.el("span", { class: "g-muted", style: "font-size:12px" }, "Click boxes to build a scope")]));
    mapCard.appendChild(ui.el("div", { style: "display:grid;grid-template-columns:1fr 20px 1fr 20px 1fr 20px 1fr 20px 1fr;gap:6px;align-items:stretch;margin:10px 0" }, [
      box(1, "Intake, process mapping, metadata", "raus"), arrow(),
      box(2, "Applicability of risk events and MCRs", "riskid"), arrow(),
      box(3, "Evidence-anchored ratings", "inherent"), arrow(),
      box(4, "Derived key, expected controls", "controls"), arrow(),
      box(5, "Affirmation, challenge, residual", "rcsa")]));
    mapCard.appendChild(ui.el("div", { style: "display:grid;grid-template-columns:1fr 1fr 2fr;gap:6px;margin-bottom:10px" }, [
      box(7, "Feeds from Control Identification", "soon/Testing-0"),
      box(8, "Feeds from Control Identification", "soon/Testing-1"),
      box(9, "Watches capabilities 1 through 6", "soon/Monitoring-0")]));
    mapCard.appendChild(ui.el("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:6px" }, [
      box(6, "New activity and change feed capabilities 1 and 2", "soon/Signals-0"),
      box(10, "Governs every capability above", "soon/Policy-0")]));
    el.appendChild(mapCard);

    /* ==SECTION:lens-readout== */
    if (closure) {
      var required = closure.filter(function (n) { return sel.indexOf(n) < 0; });
      var order = GRC.caps.order(closure);
      var already = order.filter(function (n) { return GRC.caps.built(n); });
      var toBuild = order.filter(function (n) { return !GRC.caps.built(n); });
      el.appendChild(ui.card({
        title: "Scope readout",
        body: ui.el("div", {}, [
          ui.kv([
            ["Selected", sel.slice().sort(function (a, b) { return a - b; }).map(function (n) { return "C" + n + " " + GRC.caps.name(n); }).join(";  ")],
            ["Also required", required.length ? required.map(function (n) { return "C" + n + " " + GRC.caps.name(n); }).join(";  ") : "Nothing else. The selection stands on its own."],
            ["Suggested build order", order.map(function (n) { return "C" + n; }).join("  then  ")],
            ["Already built", already.length ? already.map(function (n) { return "C" + n; }).join(", ") : "None yet"],
            ["Still to build", toBuild.length ? toBuild.map(function (n) { return "C" + n; }).join(", ") : "Nothing; this scope is covered by the current release"]]),
          ui.el("p", { class: "g-muted", style: "font-size:12.5px;margin:10px 0 0" },
            "The strip under the tabs traces this as you move: every screen names its capability, and key actions call out which capability they belong to. What is grayed here will not work until its box is built.")])
      }));
    }

    /* ==SECTION:teasers== */
    el.appendChild(ui.el("div", { class: "g-split" }, [
      ui.card({
        title: "Feature gallery",
        actions: [ui.el("button", { class: "g-btn sm", onclick: function () { ctx.go("gallery"); } }, "Open the gallery")],
        body: ui.el("p", { style: "margin:0" }, "Curated, concrete examples of features we could ship, grouped by theme and complexity, each opening a live example. Mark each Keep, Discuss, or Cut; votes export with feedback so the room decides from one list.")
      }),
      ui.card({
        title: "About this mockup", body: ui.el("p", { class: "g-muted", style: "margin:0" },
          "A clickable design proposal running from local files on synthetic data shaped like the real inventory. The release number in the banner identifies this build; the feedback pill at the bottom left captures changes tied to the page you are on. Actions are session only; Preflight has a reset.")
      })]));
  }

  GRC.register({
    id: "home", version: "1.3.0", tab: "Home",
    rail: [{ label: "Program map", route: "home", order: 10 }],
    caps: { "home": null },
    routes: { "home": home }
  });
})();
