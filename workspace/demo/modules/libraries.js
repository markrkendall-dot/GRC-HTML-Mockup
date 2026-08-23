/* GRC modules/libraries.js v1.0.0 2026-08-23 */
/* Capability 2 reference corpora: the 90 Risk Events, the MCR library
   (published from RRCM, read-only), and the applicability rubric panel. */
(function () {
  "use strict";
  var EF = { q: "", side: "" };
  var MF = { q: "", fam: "", head: "" };

  /* ==SECTION:events== */
  function events(el, ctx) {
    var ui = ctx.ui, data = ctx.data;
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "Risk events"),
        ui.el("div", { class: "g-muted" }, data.all("riskEvents").length + " standing events - " +
          data.all("riskEvents").filter(function (e) { return e.side === "operational"; }).length + " operational, " +
          data.all("riskEvents").filter(function (e) { return e.side === "compliance"; }).length + " compliance. Each carries a name, description, qualification, and matching keywords. Compliance events parent the MCR library.")])));
    var body = ui.el("div"); el.appendChild(body);
    function draw() {
      body.innerHTML = "";
      var rows = data.all("riskEvents").filter(function (e) {
        if (EF.q && (e.id + " " + e.name + " " + (e.keywords || []).join(" ")).toLowerCase().indexOf(EF.q.toLowerCase()) < 0) return false;
        if (EF.side && e.side !== EF.side) return false;
        return true;
      });
      body.appendChild(ui.toolbar([
        ui.searchBox({ value: EF.q, placeholder: "Search names and keywords...", oninput: function (v) { EF.q = v; draw(); } }),
        ui.select({ label: "Side", value: EF.side, onchange: function (v) { EF.side = v; draw(); }, options: [{ value: "", label: "Both" }, { value: "operational", label: "Operational" }, { value: "compliance", label: "Compliance" }] }),
        ui.el("span", { class: "g-muted", style: "font-size:12px" }, rows.length + " events")]));
      body.appendChild(ui.table({
        cols: [
          { key: "id", label: "ID", render: function (e) { return ui.el("span", { class: "g-mono" }, e.id); } },
          { key: "side", label: "Side", sort: true, render: function (e) { return e.side === "compliance" ? ui.badge("Compliance", "info") : ui.badge("Operational", ""); } },
          { key: "name", label: "Event", sort: true },
          { key: "kw", label: "Keywords", render: function (e) { return ui.el("span", { class: "g-muted", style: "font-size:12px" }, (e.keywords || []).join(", ")); } },
          { key: "mcr", label: "MCRs", num: true, render: function (e) { return e.side === "compliance" ? String(data.mcrsOfEvent(e.id).length) : "-"; } },
          { key: "conf", label: "RAUs confirmed", num: true, render: function (e) { return String(data.regOfEvent(e.id).filter(function (g) { return g.status === "confirmed"; }).length); } }
        ], rows: rows, page: 25,
        onRow: function (e) { ctx.go("events/" + e.id); }
      }));
    }
    draw();
  }

  function eventDetail(el, ctx, params) {
    var ui = ctx.ui, data = ctx.data;
    var e = data.byId("riskEvents", params.id);
    if (!e) { el.appendChild(ui.empty("Unknown event")); return; }
    var confirmed = data.regOfEvent(e.id).filter(function (g) { return g.status === "confirmed"; });
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-row" }, [ui.el("span", { class: "g-h1" }, e.name), ui.el("span", { class: "g-mono g-muted" }, e.id),
        e.side === "compliance" ? ui.badge("Compliance", "info") : ui.badge("Operational", "")]),
        ui.el("div", { class: "g-muted" }, "Confirmed applicable in " + confirmed.length + " RAUs")])));
    var left = ui.el("div");
    left.appendChild(ui.card({
      title: "Profile", body: ui.kv([
        ["Description", e.description], ["Qualification", e.qualification],
        ["Keywords", (e.keywords || []).join(", ")],
        ["Matching tags", ui.el("span", {}, (e.tags || []).map(function (t) { return ui.pill(t); }))],
        e.excludedBy && e.excludedBy.length ? ["Suppressed by exclusion", e.excludedBy.join(", ")] : null])
    }));
    if (e.side === "compliance") {
      var ms = data.mcrsOfEvent(e.id);
      var heads = ms.filter(function (m) { return m.head; });
      left.appendChild(ui.card({
        title: "MCRs under this event (" + ms.length + " - " + heads.length + " high-frequency head, " + (ms.length - heads.length) + " long tail)",
        body: ui.table({
          cols: [
            { key: "id", label: "MCR", render: function (m) { return ui.el("span", { class: "g-mono" }, m.id); } },
            { key: "name", label: "Requirement", render: function (m) { return ui.el("a", { href: "#/mcrlib/" + m.id }, m.name); } },
            { key: "head", label: "", render: function (m) { return m.head ? ui.badge("Head", "info") : ui.el("span", { class: "g-muted", style: "font-size:11px" }, "tail"); } }
          ], rows: heads.slice(0, 60).concat(ms.filter(function (m) { return !m.head; }).slice(0, 5)), page: 10
        })
      }));
    }
    var right = ui.el("div");
    right.appendChild(ui.card({
      title: "Where it is confirmed (reverse view)",
      body: confirmed.length ? ui.table({
        cols: [
          { key: "rauId", label: "RAU", render: function (g) { var r = data.byId("raus", g.rauId); return ui.el("a", { href: "#/raus/" + g.rauId }, r ? r.id + " - " + r.name : g.rauId); } },
          { key: "score", label: "Score", num: true, sort: true },
          { key: "date", label: "Confirmed", render: function (g) { return ctx.fmt.date(g.date); } }
        ], rows: confirmed, page: 12
      }) : ui.empty("Not yet confirmed anywhere.")
    }));
    el.appendChild(ui.el("div", { class: "g-split" }, [left, right]));
  }

  /* ==SECTION:mcrlib== */
  function mcrlib(el, ctx) {
    var ui = ctx.ui, data = ctx.data;
    var all = data.all("mcrs");
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "MCR library"),
        ui.el("div", { class: "g-muted" }, ctx.fmt.num(all.length) + " Major Compliance Requirements, published from RRCM (read-only here). " +
          ctx.fmt.num(all.filter(function (m) { return m.head; }).length) + " head MCRs carry ~80% of RCSA frequency. Each arrives aligned to a parent compliance risk event.")])));
    var fams = {};
    all.forEach(function (m) { fams[m.regFamily] = 1; });
    var body = ui.el("div"); el.appendChild(body);
    function draw() {
      body.innerHTML = "";
      var rows = all.filter(function (m) {
        if (MF.q && (m.id + " " + m.name).toLowerCase().indexOf(MF.q.toLowerCase()) < 0) return false;
        if (MF.fam && m.regFamily !== MF.fam) return false;
        if (MF.head === "head" && !m.head) return false;
        if (MF.head === "tail" && m.head) return false;
        return true;
      });
      body.appendChild(ui.toolbar([
        ui.searchBox({ value: MF.q, placeholder: "Search 8,000 MCRs...", oninput: function (v) { MF.q = v; draw(); } }),
        ui.select({ label: "Family", value: MF.fam, onchange: function (v) { MF.fam = v; draw(); }, options: [{ value: "", label: "All families" }].concat(Object.keys(fams).sort().map(function (f) { return { value: f, label: f }; })) }),
        ui.select({ label: "Frequency", value: MF.head, onchange: function (v) { MF.head = v; draw(); }, options: [{ value: "", label: "All" }, { value: "head", label: "Head (top ~2,000)" }, { value: "tail", label: "Long tail" }] }),
        ui.el("span", { class: "g-muted", style: "font-size:12px" }, ctx.fmt.num(rows.length) + " match")]));
      body.appendChild(ui.table({
        cols: [
          { key: "id", label: "MCR", render: function (m) { return ui.el("span", { class: "g-mono" }, m.id); } },
          { key: "name", label: "Requirement", sort: true },
          { key: "fam", label: "Family", render: function (m) { return m.regFamily; } },
          { key: "parent", label: "Parent risk event", render: function (m) { var e = data.byId("riskEvents", m.parentEventId); return e ? ui.el("a", { href: "#/events/" + e.id, onclick: function (ev) { ev.stopPropagation(); } }, e.name) : "-"; } },
          { key: "head", label: "Freq", render: function (m) { return m.head ? ui.badge("Head", "info") : ui.el("span", { class: "g-muted", style: "font-size:11px" }, "tail"); } }
        ], rows: rows, page: 25,
        onRow: function (m) { ctx.go("mcrlib/" + m.id); }
      }));
    }
    draw();
  }

  function mcrDetail(el, ctx, params) {
    var ui = ctx.ui, data = ctx.data;
    var m = data.byId("mcrs", params.id);
    if (!m) { el.appendChild(ui.empty("Unknown MCR")); return; }
    var parent = data.byId("riskEvents", m.parentEventId);
    var attachedIn = [];
    data.all("register").forEach(function (g) {
      if (g.mcrIds && g.mcrIds.indexOf(m.id) >= 0) attachedIn.push(g);
    });
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-row" }, [ui.el("span", { class: "g-h1", style: "font-size:17px" }, m.name), ui.el("span", { class: "g-mono g-muted" }, m.id)]),
        ui.el("div", { class: "g-muted" }, "Source: RRCM - published " + (m.publishedDate ? ctx.fmt.date(m.publishedDate) : "-") + " - read-only in the GRC")])));
    var left = ui.el("div");
    left.appendChild(ui.card({
      title: "Profile", body: ui.kv([
        ["Regulatory family", m.regFamily], ["Citation", m.citation], ["Regulator", m.regulator || "-"],
        ["Parent risk event", parent ? ui.el("a", { href: "#/events/" + parent.id }, parent.name) : m.parentEventId],
        ["Frequency class", m.head ? "Head (high RCSA frequency)" : "Long tail"],
        ["Summary", m.summary || "-"],
        ["Matching tags", ui.el("span", {}, (m.tags || []).map(function (t) { return ui.pill(t); }))]])
    }));
    if (m.obligations && m.obligations.length) {
      left.appendChild(ui.card({
        title: "Obligations", body: ui.el("ul", { style: "margin:0;padding-left:20px" }, m.obligations.map(function (o) { return ui.el("li", {}, o); }))
      }));
    }
    if (m.prohibitions && m.prohibitions.length) {
      left.appendChild(ui.card({
        title: "Prohibitions", body: ui.el("ul", { style: "margin:0;padding-left:20px" }, m.prohibitions.map(function (o) { return ui.el("li", {}, o); }))
      }));
    }
    var right = ui.el("div");
    right.appendChild(ui.card({
      title: "Attached in RAU registers (" + attachedIn.length + ")",
      body: attachedIn.length ? ui.table({
        cols: [
          { key: "rauId", label: "RAU", render: function (g) { var r = data.byId("raus", g.rauId); return ui.el("a", { href: "#/raus/" + g.rauId }, r ? r.id + " - " + r.name : g.rauId); } },
          { key: "date", label: "Since", render: function (g) { return ctx.fmt.date(g.date); } }
        ], rows: attachedIn, page: 12
      }) : ui.empty("Not attached to any RAU register yet.")
    }));
    el.appendChild(ui.el("div", { class: "g-split" }, [left, right]));
  }

  /* ==SECTION:rubric== */
  function rubricPanel(el, ctx) {
    var ui = ctx.ui, eng = ctx.engine, data = ctx.data;
    var R = eng.rubric();
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "Applicability rubric"),
        ui.el("div", { class: "g-muted" }, "The standardized math: 8 thematic categories, each scored 1-5 from attribute overlap, weighted, normalized to 0-100. Identical for all " + data.all("raus").length + " RAUs. (Distinct from the inherent risk rubric - that belongs to Capability 3.)")])));
    var left = ui.el("div");
    left.appendChild(ui.card({
      title: "Categories and weights", body: ui.table({
        cols: [
          { key: "label", label: "Category" },
          { key: "key", label: "Attribute namespace", render: function (c) { return ui.el("span", { class: "g-mono" }, c.key + ":*"); } },
          { key: "weight", label: "Weight", num: true }
        ], rows: R.categories, page: 10
      })
    }));
    left.appendChild(ui.card({
      title: "Scoring anchors", body: ui.kv([
        ["5", "Three or more shared attributes in the category"],
        ["4", "Two shared, or the candidate's single attribute matches"],
        ["3", "Partial overlap, or the candidate is silent on the theme"],
        ["1", "The candidate specifies attributes and none match"],
        ["Bands", "Likely >= " + R.bands.likely + " - Possible " + R.bands.possible + "-" + (R.bands.likely - 1) + " - Unlikely < " + R.bands.possible],
        ["Exclusions", "A confirmed does-NOT-do answer suppresses matching candidates entirely (shown, reversible)"]])
    }));
    var right = ui.el("div");
    right.appendChild(ui.card({
      title: "Disambiguation question bank",
      body: ui.el("div", {}, (R.questions || []).map(function (q) {
        return ui.el("div", { class: "g-row", style: "padding:4px 0;border-bottom:1px solid var(--g-line-soft)" }, [
          ui.el("span", { class: "g-mono g-muted", style: "width:36px" }, q.id),
          ui.el("span", { style: "flex:1;min-width:200px" }, q.text),
          ui.pill(q.tag)]);
      }))
    }));
    /* worked example */
    var r = data.all("raus").filter(function (x) { return x.riskIdStatus === "complete"; })[0];
    if (r) {
      var evs = eng.candidates(r).scored;
      if (evs.length) {
        var s = evs[0];
        right.appendChild(ui.card({
          title: "Worked example: " + r.id + " vs \"" + s.ev.name + "\" = " + s.pct,
          body: ctx.charts.scoreBars({ categories: R.categories, cats: s.cats })
        }));
      }
    }
    el.appendChild(ui.el("div", { class: "g-split" }, [left, right]));
  }

  GRC.register({
    id: "libraries", version: "1.0.0", tab: "RCSA",
    rail: [
      { label: "Risk events", route: "events", order: 60 },
      { label: "MCR library", route: "mcrlib", order: 70 },
      { label: "Applicability rubric", route: "rubric", order: 80 }
    ],
    routes: { "events": events, "events/:id": eventDetail, "mcrlib": mcrlib, "mcrlib/:id": mcrDetail, "rubric": rubricPanel }
  });
})();
