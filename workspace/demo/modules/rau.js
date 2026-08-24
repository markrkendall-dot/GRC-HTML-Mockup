/* GRC modules/rau.js v1.2.1 2026-08-23 */
/* Capability 1: RAU directory (hierarchy tree with carets, flat list as a
   toggle) and profile quality. Expanding levels never leaves the page.
   The tree and the flat list share one set of filters; while a filter is
   active the tree auto-expands the branches that contain matches (FB-014). */
(function () {
  "use strict";
  var F = { q: "", lob: "", cat: "", status: "", change: "" };
  var VIEW = "tree";
  var OPEN = {};   /* expanded nodes, kept for the session */
  var CLOSED = {}; /* manual collapses while a filter is auto-expanding */

  /* ==SECTION:directory== */
  function directory(el, ctx) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    el.appendChild(ui.el("div", { class: "g-page-head" }, [
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "Risk Assessable Units"),
        ui.el("div", { class: "g-muted" }, "A RAU is the intersection of a business and a service, created at the SubLOB level. Expand the hierarchy in place; nothing here navigates away until you open a record.")]),
      ui.el("div", { class: "sp" }),
      ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { ctx.go("pipeline/new"); } }, "+ Request new RAU")]));
    var body = ui.el("div");
    el.appendChild(body);
    draw(body, ctx);
  }

  function matches(ctx, r) {
    var data = ctx.data;
    if (F.q && (r.id + " " + r.name).toLowerCase().indexOf(F.q.toLowerCase()) < 0) return false;
    if (F.lob && data.orgPath(r.subLobId).lobId !== F.lob) return false;
    if (F.cat && r.category !== F.cat) return false;
    if (F.status && r.riskIdStatus !== F.status) return false;
    if (F.change && r.changeLevel !== F.change) return false;
    return true;
  }
  function filterActive() { return !!(F.q || F.lob || F.cat || F.status || F.change); }

  function draw(body, ctx) {
    var ui = ctx.ui, data = ctx.data;
    body.innerHTML = "";
    function setF(k, v) { F[k] = v; CLOSED = {}; draw(body, ctx); }
    var matched = data.all("raus").filter(function (r) { return matches(ctx, r); });
    var bar = ui.toolbar([
      ui.el("span", { class: "g-row", style: "gap:0" }, [
        ui.el("button", { class: "g-btn sm" + (VIEW === "tree" ? " g-btn--primary" : ""), style: "border-radius:4px 0 0 4px", onclick: function () { VIEW = "tree"; draw(body, ctx); } }, "Hierarchy"),
        ui.el("button", { class: "g-btn sm" + (VIEW === "flat" ? " g-btn--primary" : ""), style: "border-radius:0 4px 4px 0", onclick: function () { VIEW = "flat"; draw(body, ctx); } }, "Flat list")]),
      ui.searchBox({ value: F.q, placeholder: "Filter by id or name...", oninput: function (v) { setF("q", v); } }),
      ui.select({
        label: "LOB", value: F.lob, onchange: function (v) { setF("lob", v); },
        options: [{ value: "", label: "All lines of business" }].concat(data.lobs().map(function (l) { return { value: l.id, label: l.name }; }))
      }),
      ui.select({
        label: "Category", value: F.cat, onchange: function (v) { setF("cat", v); },
        options: [{ value: "", label: "All" }, { value: "business-service", label: "Business Service" },
        { value: "shared-services", label: "Shared Services" }, { value: "enterprise", label: "Enterprise" }]
      }),
      ui.select({
        label: "Risk ID", value: F.status, onchange: function (v) { setF("status", v); },
        options: [{ value: "", label: "All" }, { value: "complete", label: "Complete" },
        { value: "in-progress", label: "In progress" }, { value: "not-started", label: "Not started" }]
      }),
      ui.el("span", { class: "g-muted", style: "font-size:12px" }, ctx.fmt.num(matched.length) + " match")]);
    body.appendChild(bar);
    if (VIEW === "tree") drawTree(body, ctx); else drawFlat(body, ctx, matched);
  }

  /* ==SECTION:tree== */
  function drawTree(body, ctx) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    var active = filterActive();
    /* While filtering: branches with matches auto-expand and empty branches
       hide; a caret click still collapses (tracked in CLOSED until the
       filter changes). Without a filter the manual OPEN state applies. */
    function isOpen(id, hasMatches) {
      if (active) return hasMatches && !CLOSED[id];
      return !!OPEN[id];
    }
    function toggle(id) {
      if (active) CLOSED[id] = !CLOSED[id]; else OPEN[id] = !OPEN[id];
      draw(body, ctx);
    }
    var wrap = ui.el("div", { class: "g-tablewrap" });
    var t = ui.el("table", { class: "g-table" });
    t.appendChild(ui.el("tr", {}, [
      ui.el("th", {}, "Enterprise / LOB / SubLOB / RAU"),
      ui.el("th", {}, "Category"), ui.el("th", {}, "RAU Owner"),
      ui.el("th", {}, "Risk ID"), ui.el("th", { style: "text-align:right" }, "Confirmed risks")]));
    function caret(open) { return ui.el("span", { class: "caret" + (open ? " open" : "") }); }
    function confirmedOf(r) { return data.regOfRau(r.id).filter(function (g) { return g.status === "confirmed"; }).length; }
    var shown = 0;
    data.lobs().forEach(function (lob) {
      var subs = data.subLobs().filter(function (s) { return s.parentId === lob.id; });
      var subRows = [], lobRaus = 0, lobConf = 0;
      subs.forEach(function (s) {
        var rr = data.rausOfSub(s.id).filter(function (r) { return matches(ctx, r); });
        var sconf = 0; rr.forEach(function (r) { sconf += confirmedOf(r); });
        subRows.push({ s: s, rr: rr, conf: sconf });
        lobRaus += rr.length; lobConf += sconf;
      });
      if (active && !lobRaus) return;
      shown += lobRaus;
      var lopen = isOpen(lob.id, lobRaus > 0);
      var lr = ui.el("tr", { class: "tree-parent click" }, [
        ui.el("td", {}, [caret(lopen), lob.name + "  (" + lobRaus + (active ? " matching" : "") + " RAUs)"]),
        ui.el("td", {}, ""), ui.el("td", {}, ""), ui.el("td", {}, ""),
        ui.el("td", { class: "num" }, String(lobConf))]);
      lr.onclick = function () { toggle(lob.id); };
      t.appendChild(lr);
      if (!lopen) return;
      subRows.forEach(function (x) {
        if (active && !x.rr.length) return;
        var sopen = isOpen(x.s.id, x.rr.length > 0);
        var sr = ui.el("tr", { class: "tree-parent tree-ind1 click" }, [
          ui.el("td", {}, [caret(sopen), x.s.name + "  (" + x.rr.length + ")"]),
          ui.el("td", {}, ""), ui.el("td", {}, ""), ui.el("td", {}, ""),
          ui.el("td", { class: "num" }, String(x.conf))]);
        sr.onclick = function () { toggle(x.s.id); };
        t.appendChild(sr);
        if (!sopen) return;
        x.rr.forEach(function (r) {
          var rrow = ui.el("tr", { class: "tree-ind2 click" }, [
            ui.el("td", {}, [ui.el("span", { class: "g-mono g-muted" }, r.id + "  "), r.name]),
            ui.el("td", {}, fmt.cat(r.category)),
            ui.el("td", {}, r.roles.owner),
            ui.el("td", {}, ui.badge(r.riskIdStatus.replace("-", " "), fmt.riskIdKind(r.riskIdStatus))),
            ui.el("td", { class: "num" }, String(confirmedOf(r)))]);
          rrow.onclick = function () { ctx.go("raus/" + r.id); };
          t.appendChild(rrow);
        });
      });
    });
    if (active && !shown) {
      t.appendChild(ui.el("tr", {}, ui.el("td", { colspan: "5", class: "g-muted", style: "padding:14px" }, "No RAUs match the current filters.")));
    }
    wrap.appendChild(t);
    body.appendChild(wrap);
  }

  /* ==SECTION:flat== */
  function drawFlat(body, ctx, rs) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    body.appendChild(ui.table({
      cols: [
        { key: "id", label: "ID", sort: true, render: function (r) { return ui.el("span", { class: "g-mono" }, r.id); } },
        { key: "name", label: "Name", sort: true },
        { key: "lob", label: "LOB / SubLOB", render: function (r) { var p = data.orgPath(r.subLobId); return ui.el("span", {}, [p.lob, ui.el("div", { class: "g-muted", style: "font-size:12px" }, p.sub)]); } },
        { key: "category", label: "Category", render: function (r) { return fmt.cat(r.category); } },
        { key: "owner", label: "RAU Owner", render: function (r) { return r.roles.owner; } },
        { key: "riskIdStatus", label: "Risk ID", sort: true, render: function (r) { return ui.badge(r.riskIdStatus.replace("-", " "), fmt.riskIdKind(r.riskIdStatus)); } },
        { key: "inherent", label: "Inherent", sort: true, sortVal: function (r) { return ["low", "moderate", "high", "critical"].indexOf(ctx.engine.inherent.rollup(r).band); }, render: function (r) { var b = ctx.engine.inherent.rollup(r).band; return b ? ui.badge(b.charAt(0).toUpperCase() + b.slice(1), b === "low" ? "ok" : b === "moderate" ? "info" : b === "high" ? "warn" : "bad") : ui.el("span", { class: "g-muted" }, "-"); } },
        { key: "risks", label: "Confirmed risks", num: true, sort: true, sortVal: function (r) { return data.regOfRau(r.id).filter(function (g) { return g.status === "confirmed"; }).length; }, render: function (r) { return String(data.regOfRau(r.id).filter(function (g) { return g.status === "confirmed"; }).length); } },
        { key: "lastRcsaDate", label: "Last RCSA", sort: true, render: function (r) { return fmt.date(r.lastRcsaDate); } }
      ],
      rows: rs, page: 25,
      onRow: function (r) { ctx.go("raus/" + r.id); }
    }));
  }

  /* ==SECTION:quality== */
  function quality(el, ctx) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    var raus = data.all("raus");
    var stale = raus.filter(function (r) { return r.profileUpdated < "2025-08-23"; });
    var notStarted = raus.filter(function (r) { return r.riskIdStatus === "not-started"; });
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [ui.el("div", { class: "g-h1" }, "Profile quality"),
      ui.el("div", { class: "g-muted" }, "The inventory audits itself: stale profiles and gaps surface here. This view feeds Capability 9 Monitoring later.")])));
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
      listCard("Stale profiles, older than 12 months", stale, { label: "Profile updated", render: function (r) { return fmt.date(r.profileUpdated); } }),
      listCard("Risk identification not started", notStarted, { label: "Owner", render: function (r) { return r.roles.owner; } })]));
  }

  GRC.register({
    id: "rau", version: "1.2.1", tab: "RCSA",
    caps: { "*": { primary: [1] } },
    rail: [
      { label: "1. RAUs", route: "raus", order: 10 },
      { label: "Profile quality", route: "raus-quality", order: 50 }
    ],
    routes: { "raus": directory, "raus-tree": directory, "raus-quality": quality }
  });
})();
