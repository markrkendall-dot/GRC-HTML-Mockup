/* GRC modules/rau.js v1.0.0 2026-08-23 */
/* Capability 1: RAU directory, hierarchy browser, profile quality. */
(function () {
  "use strict";
  var F = { q: "", lob: "", cat: "", status: "", change: "" };

  /* ==SECTION:directory== */
  function directory(el, ctx) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    el.appendChild(ui.el("div", { class: "g-page-head" }, [
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "Risk Assessable Units"),
        ui.el("div", { class: "g-muted" }, "A RAU is the intersection of a business and a service. " +
          data.all("raus").length + " units aligned Enterprise > LOB > SubLOB.")]),
      ui.el("div", { class: "sp" }),
      ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { ctx.go("pipeline/new"); } }, "+ Request new RAU")]));

    var body = ui.el("div");
    el.appendChild(body);

    function rows() {
      return data.all("raus").filter(function (r) {
        if (F.q && (r.id + " " + r.name).toLowerCase().indexOf(F.q.toLowerCase()) < 0) return false;
        if (F.lob && data.orgPath(r.subLobId).lobId !== F.lob) return false;
        if (F.cat && r.category !== F.cat) return false;
        if (F.status && r.riskIdStatus !== F.status) return false;
        if (F.change && r.changeLevel !== F.change) return false;
        return true;
      });
    }
    function draw() {
      body.innerHTML = "";
      var rs = rows();
      body.appendChild(ui.toolbar([
        ui.searchBox({ value: F.q, placeholder: "Filter by id or name...", oninput: function (v) { F.q = v; draw(); } }),
        ui.select({
          label: "LOB", value: F.lob, onchange: function (v) { F.lob = v; draw(); },
          options: [{ value: "", label: "All lines of business" }].concat(data.lobs().map(function (l) { return { value: l.id, label: l.name }; }))
        }),
        ui.select({
          label: "Category", value: F.cat, onchange: function (v) { F.cat = v; draw(); },
          options: [{ value: "", label: "All" }, { value: "business-service", label: "Business Service" },
          { value: "shared-services", label: "Shared Services" }, { value: "enterprise", label: "Enterprise" }]
        }),
        ui.select({
          label: "Risk ID", value: F.status, onchange: function (v) { F.status = v; draw(); },
          options: [{ value: "", label: "All" }, { value: "complete", label: "Complete" },
          { value: "in-progress", label: "In progress" }, { value: "not-started", label: "Not started" }]
        }),
        ui.select({
          label: "Change", value: F.change, onchange: function (v) { F.change = v; draw(); },
          options: [{ value: "", label: "All" }, "low", "medium", "high"]
        }),
        ui.el("span", { class: "g-muted", style: "font-size:12px" }, ctx.fmt.num(rs.length) + " of " + data.all("raus").length)]));
      body.appendChild(ui.table({
        cols: [
          { key: "id", label: "ID", sort: true, render: function (r) { return ui.el("span", { class: "g-mono" }, r.id); } },
          { key: "name", label: "Name", sort: true },
          { key: "lob", label: "LOB / SubLOB", render: function (r) { var p = data.orgPath(r.subLobId); return ui.el("span", {}, [p.lob, ui.el("div", { class: "g-muted", style: "font-size:12px" }, p.sub)]); } },
          { key: "category", label: "Category", render: function (r) { return ctx.fmt.cat(r.category); } },
          { key: "owner", label: "RAU Owner", render: function (r) { return r.roles.owner; } },
          { key: "fte", label: "FTE", num: true, sort: true },
          {
            key: "riskIdStatus", label: "Risk ID", sort: true, render: function (r) {
              return ui.badge(r.riskIdStatus === "complete" ? "Complete" : r.riskIdStatus === "in-progress" ? "In progress" : "Not started", fmt.riskIdKind(r.riskIdStatus));
            }
          },
          { key: "risks", label: "Confirmed risks", num: true, sortVal: function (r) { return data.regOfRau(r.id).filter(function (g) { return g.status === "confirmed"; }).length; }, sort: true, render: function (r) { return String(data.regOfRau(r.id).filter(function (g) { return g.status === "confirmed"; }).length); } },
          { key: "changeLevel", label: "Change", sort: true, render: function (r) { return ui.badge(r.changeLevel, r.changeLevel === "high" ? "warn" : ""); } },
          { key: "lastRcsaDate", label: "Last RCSA", sort: true, render: function (r) { return fmt.date(r.lastRcsaDate); } }
        ],
        rows: rs, page: 25,
        onRow: function (r) { ctx.go("raus/" + r.id); }
      }));
    }
    draw();
  }

  /* ==SECTION:tree== */
  function tree(el, ctx) {
    var ui = ctx.ui, data = ctx.data;
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [ui.el("div", { class: "g-h1" }, "Business hierarchy"),
      ui.el("div", { class: "g-muted" }, "Enterprise > Line of Business > SubLOB. RAUs are created at the SubLOB level.")])));
    data.lobs().forEach(function (lob) {
      var subs = data.subLobs().filter(function (s) { return s.parentId === lob.id; });
      var lobRaus = 0, complete = 0;
      subs.forEach(function (s) {
        var rr = data.rausOfSub(s.id);
        lobRaus += rr.length;
        complete += rr.filter(function (r) { return r.riskIdStatus === "complete"; }).length;
      });
      var bd = ui.el("div", { class: "g-grid", style: "grid-template-columns:repeat(auto-fill,minmax(260px,1fr))" });
      subs.forEach(function (s) {
        var rr = data.rausOfSub(s.id);
        var conf = 0;
        rr.forEach(function (r) { conf += data.regOfRau(r.id).filter(function (g) { return g.status === "confirmed"; }).length; });
        bd.appendChild(ui.el("div", { class: "capbox", onclick: function () { F.q = ""; F.lob = lob.id; ctx.go("raus"); } }, [
          ui.el("div", { class: "ct" }, s.name),
          ui.el("div", { class: "cs g-muted" }, rr.length + " RAUs - " + conf + " confirmed risks")]));
      });
      el.appendChild(ui.card({
        title: lob.name + "  (" + lobRaus + " RAUs, " + complete + " risk-ID complete)",
        body: bd
      }));
    });
  }

  /* ==SECTION:quality== */
  function quality(el, ctx) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    var raus = data.all("raus");
    var stale = raus.filter(function (r) { return r.profileUpdated < "2025-08-23"; });
    var noRcsa = raus.filter(function (r) { return !r.lastRcsaDate; });
    var notStarted = raus.filter(function (r) { return r.riskIdStatus === "not-started"; });
    var pendingHand = [];
    raus.forEach(function (r) {
      var p = (r.handoffs || []).filter(function (h) { return h.dir === "in" && !h.conf; }).length;
      if (p) pendingHand.push({ r: r, n: p });
    });
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [ui.el("div", { class: "g-h1" }, "Profile quality"),
      ui.el("div", { class: "g-muted" }, "The inventory audits itself: stale profiles, gaps, and unconfirmed handoffs surface here (feeds Capability 9 Monitoring).")])));
    el.appendChild(ui.el("div", { class: "g-kpis" }, [
      ui.kpi({ label: "Stale profiles (>12 mo)", value: stale.length, kind: stale.length ? "warn" : "ok" }),
      ui.kpi({ label: "Never assessed", value: noRcsa.length, kind: noRcsa.length ? "warn" : "ok" }),
      ui.kpi({ label: "Risk ID not started", value: notStarted.length, kind: notStarted.length ? "bad" : "ok" }),
      ui.kpi({ label: "RAUs w/ unconfirmed inbound handoffs", value: pendingHand.length, kind: pendingHand.length ? "warn" : "ok" })]));
    function listCard(title, rows, extra) {
      return ui.card({
        title: title, body: rows.length ? ui.table({
          cols: [
            { key: "id", label: "ID", render: function (r) { return ui.el("span", { class: "g-mono" }, r.id); } },
            { key: "name", label: "Name" },
            { key: "sub", label: "SubLOB", render: function (r) { return data.orgPath(r.subLobId).sub; } },
            { key: "x", label: extra.label, render: extra.render }
          ], rows: rows.slice(0, 200), page: 10,
          onRow: function (r) { ctx.go("raus/" + r.id); }
        }) : ui.empty("Nothing flagged.")
      });
    }
    el.appendChild(ui.el("div", { class: "g-split" }, [
      listCard("Stale profiles", stale, { label: "Profile updated", render: function (r) { return fmt.date(r.profileUpdated); } }),
      listCard("Risk identification not started", notStarted, { label: "Owner", render: function (r) { return r.roles.owner; } })]));
  }

  GRC.register({
    id: "rau", version: "1.0.0", tab: "RCSA",
    rail: [
      { label: "1. RAUs", route: "raus", order: 10 },
      { label: "Hierarchy", route: "raus-tree", order: 40 },
      { label: "Profile quality", route: "raus-quality", order: 50 }
    ],
    routes: { "raus": directory, "raus-tree": tree, "raus-quality": quality }
  });
})();
