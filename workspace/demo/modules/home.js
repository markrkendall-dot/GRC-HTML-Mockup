/* GRC modules/home.js v1.0.0 2026-08-23 */
/* Home: the 10-capability program map (clickable) and headline numbers. */
(function () {
  "use strict";
  function home(el, ctx) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    var m = data.metrics();
    el.appendChild(ui.el("div", { class: "g-page-head" }, [
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "RCSA program"),
        ui.el("div", { class: "g-muted" }, "Ten capabilities, one platform. This release (" + data.release().number + ") implements capabilities 1 and 2 end to end; the rest are placed and waiting.")]),
      ui.el("div", { class: "sp" }),
      ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { ctx.go("present"); } }, "Start guided demo")]));

    el.appendChild(ui.el("div", { class: "g-kpis" }, [
      ui.kpi({ label: "Active RAUs", value: fmt.num(m.activeRaus), kind: "info" }),
      ui.kpi({ label: "Pipeline requests", value: m.pipeline }),
      ui.kpi({ label: "Risk ID complete", value: m.riskIdComplete + " / " + fmt.num(m.activeRaus), kind: m.riskIdNotStarted ? "warn" : "ok" }),
      ui.kpi({ label: "Confirmed risks", value: fmt.num(m.confirmedRisks), kind: "info" }),
      ui.kpi({ label: "MCR library", value: fmt.num(m.mcrTotal), sub: fmt.num(m.mcrHead) + " head (~80% of frequency)" }),
      ui.kpi({ label: "Handoffs awaiting confirmation", value: fmt.num(m.pendingHandoffs), kind: m.pendingHandoffs ? "warn" : "ok" })]));

    /* ==SECTION:map== */
    function box(n, title, sub, route, live) {
      return ui.el("div", {
        class: "capbox" + (live ? " live" : ""),
        onclick: function () { ctx.go(route); },
        title: live ? "Built in this release - click to open" : "Arrives in a later phase"
      }, [
        ui.el("div", { class: "cn" }, "CAPABILITY " + n + (live ? "" : " - LATER PHASE")),
        ui.el("div", { class: "ct" }, title),
        ui.el("div", { class: "cs " + (live ? "" : "g-muted") }, sub)]);
    }
    var arrow = function (txt) {
      return ui.el("div", { style: "display:flex;align-items:center;justify-content:center;color:var(--g-muted);font-size:16px", title: txt }, "→");
    };
    var mapCard = ui.el("div", { class: "g-card" });
    mapCard.appendChild(ui.el("div", { class: "g-h2" }, "The capability flow"));
    mapCard.appendChild(box(10, "Policy Governance", "Governs every step below", "soon/Policy-0", false));
    mapCard.lastChild.style.marginBottom = "10px";
    mapCard.appendChild(ui.el("div", { style: "display:grid;grid-template-columns:1fr;gap:10px;margin-bottom:10px" },
      ui.el("div", { style: "display:grid;grid-template-columns:1fr 30px 2fr;gap:8px;align-items:stretch" }, [
        box(6, "Signals & Impact Assessment", "New things and changes feed steps 1 and 2", "soon/Signals-0", false),
        arrow("feeds into 1 and 2"),
        ui.el("div", { class: "g-muted", style: "align-self:center;font-size:12.5px" },
          "A signal (new product, reg change, org change, loss event) matches RAUs through their demographics and re-opens steps 1-2. The handoff network and RRCM publications feed it.")])));
    mapCard.appendChild(ui.el("div", { style: "display:grid;grid-template-columns:1fr 24px 1fr 24px 1fr 24px 1fr 24px 1fr;gap:6px;align-items:stretch;margin-bottom:10px" }, [
      box(1, "RAU Demographics & Attributes", fmt.num(m.activeRaus) + " RAUs - intake, mapping, metadata", "raus", true), arrow(""),
      box(2, "Risk Identification", "Applicability engine: " + m.events + " events, " + fmt.num(m.mcrTotal) + " MCRs", "riskid", true), arrow(""),
      box(3, "Inherent Risk Rating", "Documentation and calculation", "soon/Monitoring-0", false), arrow(""),
      box(4, "Control Identification", "Controls mapped to risks", "soon/Testing-0", false), arrow(""),
      box(5, "RCSA Administration", "Cycles, challenge, residual risk", "soon/Monitoring-0", false)]));
    mapCard.appendChild(ui.el("div", { style: "display:grid;grid-template-columns:1fr 1fr 2fr;gap:6px" }, [
      box(7, "Control Testing", "Feeds from Control ID", "soon/Testing-0", false),
      box(8, "Audit Testing", "Feeds from Control ID", "soon/Testing-1", false),
      box(9, "Monitoring", "Spans capabilities 1-6", "soon/Monitoring-0", false)]));
    el.appendChild(mapCard);

    /* ==SECTION:starters== */
    var story = data.all("raus").filter(function (r) { return r.name === "Escrow Administration"; })[0];
    var uq = data.all("requests").filter(function (q) { return q.stage === "uniqueness-review" && q.uniqueness; })[0];
    el.appendChild(ui.el("div", { class: "g-split" }, [
      ui.card({
        title: "Start somewhere interesting", body: ui.el("div", {}, [
          story ? ui.el("p", {}, [ui.el("a", { href: "#/raus/" + story.id }, story.id + " " + story.name), ui.el("span", { class: "g-muted" }, " - a featured RAU with a full process map, survey provenance, and handoffs.")]) : null,
          uq ? ui.el("p", {}, [ui.el("a", { href: "#/pipeline/" + uq.id }, uq.id + " " + uq.proposedName), ui.el("span", { class: "g-muted" }, " - a new-RAU request sitting at the uniqueness gate with the assistant's 82% overlap finding.")]) : null,
          story ? ui.el("p", {}, [ui.el("a", { href: "#/riskid/" + story.id }, "Applicability workbench for " + story.id), ui.el("span", { class: "g-muted" }, " - stack-ranked candidates, the ambiguous middle, and Resolve.")]) : null,
          ui.el("p", {}, [ui.el("a", { href: "#/rubric" }, "The applicability rubric"), ui.el("span", { class: "g-muted" }, " - the standardized math, on one screen.")])])
      }),
      ui.card({
        title: "About this mockup", body: ui.el("p", { class: "g-muted", style: "margin:0" },
          "A clickable design proposal for the future GRC, running entirely from local files with synthetic data shaped like the real thing (850 RAUs, 90 risk events, 8,000 MCRs). " +
          "The release number in the banner (" + data.release().number + ") identifies this exact build - quote it in feedback. Actions are in-memory; Preflight > Reset restores.")
      })]));
  }

  GRC.register({
    id: "home", version: "1.0.0", tab: "Home",
    rail: [{ label: "Program map", route: "home", order: 10 }],
    routes: { "home": home }
  });
})();
