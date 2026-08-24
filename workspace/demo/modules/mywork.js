/* GRC modules/mywork.js v1.1.0 2026-08-23 */
/* My Work: role-aware queues. Switch "View as" in the banner to change hats. */
(function () {
  "use strict";
  function mywork(el, ctx) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    var role = ctx.state.get("role");
    el.appendChild(ui.el("div", { class: "g-page-head" }, [
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "My Work"),
        ui.el("div", { class: "g-muted" }, "Queues for the role selected in the banner: " + role + ". Showing a sample set for this role.")]),
      ui.el("div", { class: "sp" }),
      ui.el("button", { class: "g-btn", onclick: function () { if (confirm("Reset all in-session changes?")) GRC.resetData(); } }, "Reset demo data")]));

    /* ==SECTION:governance== */
    if (role === "RCSA RAU Governance") {
      var uq = data.all("requests").filter(function (q) { return q.stage === "uniqueness-review"; });
      var gv = data.all("requests").filter(function (q) { return q.stage === "pending-governance"; });
      el.appendChild(ui.card({
        title: "Uniqueness reviews awaiting decision (" + uq.length + ")",
        body: uq.length ? ui.table({
          cols: [
            { key: "id", label: "Request", render: function (q) { return ui.el("span", { class: "g-mono" }, q.id); } },
            { key: "proposedName", label: "Name" },
            { key: "rec", label: "Assistant recommends", render: function (q) { var r = q.uniqueness && q.uniqueness.recommendation; return r ? ui.badge(r === "advance" ? "Advance" : r === "return-for-refinement" ? "Return" : "Judgment", r === "advance" ? "ok" : r === "return-for-refinement" ? "bad" : "warn") : "-"; } },
            { key: "submitted", label: "Waiting since", render: function (q) { return fmt.date(q.submitted); } }
          ], rows: uq, onRow: function (q) { ctx.go("pipeline/" + q.id); }
        }) : ui.empty("Queue clear.")
      }));
      el.appendChild(ui.card({
        title: "Governance approvals (" + gv.length + ")",
        body: gv.length ? ui.table({
          cols: [
            { key: "id", label: "Request", render: function (q) { return ui.el("span", { class: "g-mono" }, q.id); } },
            { key: "type", label: "Type", render: function (q) { return ui.badge(q.type.toUpperCase(), q.type === "new" ? "info" : "warn"); } },
            { key: "proposedName", label: "Name" },
            { key: "note", label: "Status", render: function (q) { return ui.el("span", { class: "g-muted", style: "font-size:12px" }, q.note || "-"); } }
          ], rows: gv, onRow: function (q) { ctx.go("pipeline/" + q.id); }
        }) : ui.empty("Queue clear.")
      }));
      return;
    }

    /* ==SECTION:owner== */
    if (role === "RAU Owner" || role === "RAU Owner Delegate" || role === "BCM Contact") {
      /* representative slice: first RAUs with open risk-id work */
      var todo = data.all("raus").filter(function (r) { return r.riskIdStatus !== "complete"; }).slice(0, 8);
      el.appendChild(ui.card({
        title: "Risk identification to complete",
        body: todo.length ? ui.table({
          cols: [
            { key: "id", label: "RAU", render: function (r) { return ui.el("span", { class: "g-mono" }, r.id); } },
            { key: "name", label: "Name" },
            { key: "riskIdStatus", label: "Status", render: function (r) { return ui.badge(r.riskIdStatus.replace("-", " "), fmt.riskIdKind(r.riskIdStatus)); } },
            { key: "go", label: "", render: function () { return ui.el("button", { class: "g-btn sm" }, "Open workbench"); } }
          ], rows: todo, onRow: function (r) { ctx.go("riskid/" + r.id); }
        }) : ui.empty("All caught up.")
      }));
      /* inherent ratings to document (Capability 3) */
      var rateTodo = [];
      for (var ri2 = 0; ri2 < data.all("raus").length && rateTodo.length < 8; ri2++) {
        var rr2 = data.all("raus")[ri2];
        var roll2 = ctx.engine.inherent.rollup(rr2);
        if (roll2.confirmed && roll2.rated < roll2.confirmed) rateTodo.push({ r: rr2, roll: roll2 });
      }
      el.appendChild(ui.card({
        title: "Inherent ratings to document",
        body: rateTodo.length ? ui.table({
          cols: [
            { key: "id", label: "RAU", render: function (x) { return ui.el("span", { class: "g-mono" }, x.r.id); } },
            { key: "name", label: "Name", render: function (x) { return x.r.name; } },
            { key: "gap", label: "Unrated instances", num: true, render: function (x) { return String(x.roll.confirmed - x.roll.rated); } },
            { key: "go", label: "", render: function () { return ui.el("button", { class: "g-btn sm" }, "Open worksheet"); } }
          ], rows: rateTodo, onRow: function (x) { ctx.go("inherent/" + x.r.id); }
        }) : ui.empty("Every confirmed instance on your RAUs is rated.")
      }));
      /* handoff confirmations */
      var pend = [];
      data.all("raus").forEach(function (r) {
        (r.handoffs || []).forEach(function (h) {
          if (h.dir === "in" && !h.conf && pend.length < 8) pend.push({ r: r, h: h });
        });
      });
      var hb = ui.el("div");
      if (!pend.length) hb.appendChild(ui.empty("No handoffs awaiting confirmation."));
      pend.forEach(function (x) {
        var cp = data.byId("raus", x.h.cp);
        hb.appendChild(ui.el("div", { class: "g-row", style: "padding:6px 0;border-bottom:1px solid var(--g-line-soft)" }, [
          ui.el("span", { style: "flex:1;min-width:260px" }, [
            ui.el("a", { href: "#/raus/" + x.h.cp }, cp ? cp.id + " " + cp.name : x.h.cp),
            ui.el("span", { class: "g-muted" }, " declared it provides "), ui.el("b", {}, x.h.art),
            ui.el("span", { class: "g-muted" }, " to "), ui.el("a", { href: "#/raus/" + x.r.id }, x.r.id)]),
          ui.el("button", { class: "g-btn sm g-btn--primary", onclick: function (e) {
            x.h.conf = true;
            GRC.traceAction(1, "Confirming a handoff");
            ui.toast("Handoff confirmed. The dependency network updates for both RAUs.");
            e.target.disabled = true; e.target.textContent = "Confirmed";
          } }, "Confirm handoff")]));
      });
      el.appendChild(ui.card({ title: "Inbound handoffs to confirm (trusted at submission, confirmed after)", body: hb }));
      return;
    }

    /* ==SECTION:2lod== */
    var recent = data.all("register").filter(function (g) { return g.status === "confirmed"; }).slice(-10).reverse();
    el.appendChild(ui.card({
      title: role.indexOf("ORBO") === 0 ? "Recently confirmed operational risks (challenge arrives with Capability 5)" : "Recently confirmed risks (challenge arrives with Capability 5)",
      body: ui.el("div", {}, [
        ui.el("p", { class: "g-muted" }, "The front line takes the first pass at risk identification; the 2LOD challenge workflow lands in RCSA Administration (Capability 5). Until then this is a read-only feed."),
        ui.table({
          cols: [
            { key: "rauId", label: "RAU", render: function (g) { var r = data.byId("raus", g.rauId); return ui.el("a", { href: "#/raus/" + g.rauId }, r ? r.id + " " + r.name : g.rauId); } },
            { key: "eventId", label: "Risk event", render: function (g) { var e = data.byId("riskEvents", g.eventId); return e ? e.name : g.eventId; } },
            { key: "score", label: "Score", num: true },
            { key: "by", label: "By" }
          ], rows: recent, page: 10
        })])
    }));
  }

  GRC.register({
    id: "mywork", version: "1.1.0", tab: "RCSA",
    caps: { "mywork": { primary: [1, 2, 3] } },
    routes: { "mywork": mywork }
  });
})();
