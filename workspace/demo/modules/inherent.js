/* GRC modules/inherent.js v1.0.0 2026-08-23 */
/* Capability 3: evidence-anchored inherent risk rating. Each confirmed
   risk instance gets likelihood x impact on anchored 5-level scales; the
   assistant suggests every level from platform data with provenance
   chips; humans accept in one click or override with mandatory
   rationale. Ratings are of risk instances only: MCRs and risk events
   carry no rating (compliance aggregation happens in CARA, outside
   RCSA). */
(function () {
  "use strict";
  var OPEN = {};   /* expanded worksheet rows, per session */
  var ED = {};     /* per-instance edit state: {edit, f} */
  var DOPEN = {};  /* distribution tree expansion */
  var LF = { q: "", lob: "", state: "" };

  function inh(ctx) { return ctx.engine.inherent; }
  function bandKind(b) { return b === "low" ? "ok" : b === "moderate" ? "info" : b === "high" ? "warn" : b === "critical" ? "bad" : ""; }
  function bandLabel(b) { return b ? b.charAt(0).toUpperCase() + b.slice(1) : "Not rated"; }
  function bandBadge(ui, b) { return ui.badge(bandLabel(b), bandKind(b)); }
  function isStale(t, fmt) {
    var d = new Date(fmt.today()); d.setDate(d.getDate() - 365);
    return t.date < d.toISOString().slice(0, 10);
  }
  function confirmedOf(data, rauId) {
    return data.regOfRau(rauId).filter(function (g) { return g.status === "confirmed"; });
  }

  /* ==SECTION:landing== */
  function landing(el, ctx) {
    var ui = ctx.ui;
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "Inherent risk ratings"),
        ui.el("div", { class: "g-muted" }, "Every confirmed risk instance carries a likelihood and impact rating on anchored scales. The assistant suggests each level from platform evidence; accepting takes one click, overriding requires rationale. The Inherent rubric page documents the anchors.")])));
    el.appendChild(ui.tabs({
      items: [
        { id: "raus", label: "Rate by RAU", render: function (bd) { drawRauList(bd, ctx); } },
        { id: "dist", label: "Distribution", render: function (bd) { drawDist(bd, ctx); } },
        { id: "gaps", label: "Completeness", render: function (bd) { drawGaps(bd, ctx); } }
      ]
    }));
  }

  function drawRauList(bd, ctx) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    bd.innerHTML = "";
    var rows = [];
    data.all("raus").forEach(function (r) {
      var conf = confirmedOf(data, r.id);
      if (!conf.length) return;
      var roll = inh(ctx).rollup(r);
      if (LF.q && (r.id + " " + r.name).toLowerCase().indexOf(LF.q.toLowerCase()) < 0) return;
      if (LF.lob && data.orgPath(r.subLobId).lobId !== LF.lob) return;
      if (LF.state === "todo" && roll.rated >= roll.confirmed) return;
      if (LF.state === "done" && roll.rated < roll.confirmed) return;
      rows.push({ r: r, roll: roll });
    });
    bd.appendChild(ui.toolbar([
      ui.searchBox({ value: LF.q, placeholder: "Find a RAU...", oninput: function (v) { LF.q = v; drawRauList(bd, ctx); } }),
      ui.select({
        label: "LOB", value: LF.lob, onchange: function (v) { LF.lob = v; drawRauList(bd, ctx); },
        options: [{ value: "", label: "All lines of business" }].concat(data.lobs().map(function (l) { return { value: l.id, label: l.name }; }))
      }),
      ui.select({
        label: "State", value: LF.state, onchange: function (v) { LF.state = v; drawRauList(bd, ctx); },
        options: [{ value: "", label: "All" }, { value: "todo", label: "Ratings open" }, { value: "done", label: "Fully rated" }]
      }),
      ui.el("span", { class: "g-muted", style: "font-size:12px" }, fmt.num(rows.length) + " RAUs with confirmed risks")]));
    bd.appendChild(ui.table({
      cols: [
        { key: "id", label: "RAU", render: function (x) { return ui.el("span", { class: "g-mono" }, x.r.id); } },
        { key: "name", label: "Name", sort: true, sortVal: function (x) { return x.r.name; }, render: function (x) { return x.r.name; } },
        { key: "sub", label: "SubLOB", render: function (x) { return data.orgPath(x.r.subLobId).sub; } },
        { key: "prog", label: "Rated", sort: true, sortVal: function (x) { return x.roll.rated / Math.max(1, x.roll.confirmed); }, render: function (x) { return ui.el("div", { style: "min-width:130px" }, [ui.progress(100 * x.roll.rated / Math.max(1, x.roll.confirmed)), ui.el("div", { class: "g-muted", style: "font-size:11.5px;margin-top:2px" }, x.roll.rated + " of " + x.roll.confirmed)]); } },
        { key: "band", label: "Inherent", sort: true, sortVal: function (x) { return ["low", "moderate", "high", "critical"].indexOf(x.roll.band); }, render: function (x) { return x.roll.band ? bandBadge(ui, x.roll.band) : ui.el("span", { class: "g-muted" }, "-"); } },
        { key: "strip", label: "Band profile", render: function (x) { return countStrip(ui, x.roll.counts); } }
      ], rows: rows, page: 15,
      onRow: function (x) { ctx.go("inherent/" + x.r.id); }
    }));
  }

  function countStrip(ui, c) {
    function seg(n, kind, letter) {
      if (!n) return null;
      return ui.el("span", { class: "g-badge g-badge--" + kind, style: "margin-right:4px", title: letter[1] }, n + letter[0]);
    }
    if (!c.critical && !c.high && !c.moderate && !c.low) return ui.el("span", { class: "g-muted" }, "-");
    return ui.el("span", {}, [
      seg(c.critical, "bad", ["C", "Critical"]), seg(c.high, "warn", ["H", "High"]),
      seg(c.moderate, "info", ["M", "Moderate"]), seg(c.low, "ok", ["L", "Low"])]);
  }

  /* ==SECTION:distribution== */
  function drawDist(bd, ctx) {
    var ui = ctx.ui, data = ctx.data;
    bd.innerHTML = "";
    var wrap = ui.el("div", { class: "g-tablewrap" });
    var t = ui.el("table", { class: "g-table" });
    t.appendChild(ui.el("tr", {}, [
      ui.el("th", {}, "LOB / SubLOB"), ui.el("th", { style: "text-align:right" }, "Critical"),
      ui.el("th", { style: "text-align:right" }, "High"), ui.el("th", { style: "text-align:right" }, "Moderate"),
      ui.el("th", { style: "text-align:right" }, "Low"), ui.el("th", { style: "text-align:right" }, "Rated coverage")]));
    function rollSet(raus) {
      var c = { critical: 0, high: 0, moderate: 0, low: 0 }, rated = 0, conf = 0;
      raus.forEach(function (r) {
        var roll = inh(ctx).rollup(r);
        ["critical", "high", "moderate", "low"].forEach(function (b) { c[b] += roll.counts[b]; });
        rated += roll.rated; conf += roll.confirmed;
      });
      return { c: c, rated: rated, conf: conf };
    }
    function rowFor(label, agg, cls, onclick, open) {
      var tr = ui.el("tr", { class: cls }, [
        ui.el("td", {}, [onclick ? ui.el("span", { class: "caret" + (open ? " open" : "") }) : null, label]),
        ui.el("td", { class: "num" }, String(agg.c.critical)), ui.el("td", { class: "num" }, String(agg.c.high)),
        ui.el("td", { class: "num" }, String(agg.c.moderate)), ui.el("td", { class: "num" }, String(agg.c.low)),
        ui.el("td", { class: "num" }, agg.conf ? Math.round(100 * agg.rated / agg.conf) + "%" : "-")]);
      if (onclick) tr.onclick = onclick;
      return tr;
    }
    data.lobs().forEach(function (lob) {
      var subs = data.subLobs().filter(function (s) { return s.parentId === lob.id; });
      var lobRaus = [];
      subs.forEach(function (s) { lobRaus = lobRaus.concat(data.rausOfSub(s.id)); });
      var open = !!DOPEN[lob.id];
      t.appendChild(rowFor(lob.name, rollSet(lobRaus), "tree-parent click", function () { DOPEN[lob.id] = !open; drawDist(bd, ctx); }, open));
      if (!open) return;
      subs.forEach(function (s) {
        t.appendChild(rowFor(s.name, rollSet(data.rausOfSub(s.id)), "tree-ind1", null));
      });
    });
    wrap.appendChild(t);
    bd.appendChild(ui.el("p", { class: "g-muted", style: "font-size:12.5px" }, "Counts are rated risk instances by final band. Expand a line of business in place; coverage is rated instances over confirmed instances."));
    bd.appendChild(wrap);
  }

  /* ==SECTION:completeness== */
  function drawGaps(bd, ctx) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    bd.innerHTML = "";
    var unrated = [], stale = [], byRauOv = {};
    data.all("raus").forEach(function (r) {
      confirmedOf(data, r.id).forEach(function (g) {
        var t = data.ratingOf(r.id, g.eventId);
        if (!t) { unrated.push({ r: r, g: g }); return; }
        if (isStale(t, fmt)) stale.push({ r: r, t: t });
        if (t.ov) { (byRauOv[r.id] = byRauOv[r.id] || { r: r, n: 0, total: 0 }).n++; }
        (byRauOv[r.id] = byRauOv[r.id] || { r: r, n: 0, total: 0 }).total++;
      });
    });
    var ovRows = Object.keys(byRauOv).map(function (k) { return byRauOv[k]; })
      .filter(function (x) { return x.n > 0; })
      .sort(function (a, b) { return b.n / b.total - a.n / a.total; }).slice(0, 40);
    bd.appendChild(ui.card({
      title: "Unrated confirmed instances (" + fmt.num(unrated.length) + ")",
      body: unrated.length ? ui.table({
        cols: [
          { key: "rau", label: "RAU", render: function (x) { return ui.el("span", {}, [ui.el("span", { class: "g-mono g-muted" }, x.r.id + " "), x.r.name]); } },
          { key: "ev", label: "Risk instance", render: function (x) { var e = data.byId("riskEvents", x.g.eventId); return e ? e.name : x.g.eventId; } },
          { key: "score", label: "Applicability", num: true, render: function (x) { return String(x.g.score); } },
          { key: "go", label: "", render: function () { return ui.el("button", { class: "g-btn sm g-btn--primary" }, "Rate"); } }
        ], rows: unrated.slice(0, 300), page: 10,
        onRow: function (x) { ctx.state.set("inhFocus", x.g.eventId); ctx.go("inherent/" + x.r.id); }
      }) : ui.empty("Every confirmed instance is rated.")
    }));
    bd.appendChild(ui.card({
      title: "Stale ratings, older than 12 months (" + fmt.num(stale.length) + ")",
      body: stale.length ? ui.table({
        cols: [
          { key: "rau", label: "RAU", render: function (x) { return ui.el("span", {}, [ui.el("span", { class: "g-mono g-muted" }, x.r.id + " "), x.r.name]); } },
          { key: "ev", label: "Risk instance", render: function (x) { var e = data.byId("riskEvents", x.t.eventId); return e ? e.name : x.t.eventId; } },
          { key: "date", label: "Rated", render: function (x) { return fmt.date(x.t.date); } },
          { key: "by", label: "By", render: function (x) { return x.t.by; } }
        ], rows: stale, page: 10,
        onRow: function (x) { ctx.state.set("inhFocus", x.t.eventId); ctx.go("inherent/" + x.r.id); }
      }) : ui.empty("Nothing stale.")
    }));
    bd.appendChild(ui.card({
      title: "Override density by RAU (top " + ovRows.length + ")",
      body: ui.el("div", {}, [
        ui.el("p", { class: "g-muted", style: "font-size:12.5px" }, "Overrides are legitimate and documented; a dense cluster is where second-line attention goes first (Capability 5)."),
        ovRows.length ? ui.table({
          cols: [
            { key: "rau", label: "RAU", render: function (x) { return ui.el("span", {}, [ui.el("span", { class: "g-mono g-muted" }, x.r.id + " "), x.r.name]); } },
            { key: "n", label: "Overrides", num: true, sort: true, sortVal: function (x) { return x.n; }, render: function (x) { return String(x.n); } },
            { key: "tot", label: "Rated", num: true, render: function (x) { return String(x.total); } },
            { key: "pct", label: "Rate", num: true, render: function (x) { return Math.round(100 * x.n / x.total) + "%"; } }
          ], rows: ovRows, page: 10,
          onRow: function (x) { ctx.go("inherent/" + x.r.id); }
        }) : ui.empty("No overrides recorded.")])
    }));
  }

  /* ==SECTION:worksheet== */
  function worksheet(el, ctx, params) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt, eng = inh(ctx);
    var r = data.byId("raus", params.rauId);
    if (!r) { el.appendChild(ui.empty("Unknown RAU " + params.rauId)); return; }
    var focus = ctx.state.get("inhFocus");
    if (focus) { OPEN[r.id + "|" + focus] = true; ctx.state.set("inhFocus", null); }
    var wrap = ui.el("div"); el.appendChild(wrap);

    function draw() {
      wrap.innerHTML = "";
      var conf = confirmedOf(data, r.id);
      var roll = eng.rollup(r);
      wrap.appendChild(ui.el("div", { class: "g-page-head" }, [
        ui.el("div", {}, [
          ui.el("div", { class: "g-muted", style: "font-size:12px;margin-bottom:2px" }, [
            ui.el("a", { href: "#/inherent" }, "Inherent ratings"), " / " + r.id]),
          ui.el("div", { class: "g-row" }, [
            ui.el("span", { class: "g-h1" }, "Rating worksheet"),
            ui.el("a", { href: "#/raus/" + r.id, class: "g-mono" }, r.id), ui.el("span", {}, r.name),
            roll.band ? bandBadge(ui, roll.band) : null, countStrip(ui, roll.counts)]),
          ui.el("div", { class: "g-muted" }, [
            ui.el("span", {}, roll.rated + " of " + roll.confirmed + " confirmed instances rated. Suggested levels are computed from platform evidence; overriding any level requires rationale. Anchors: "),
            ui.el("a", { href: "#/inherent-rubric" }, "Inherent rubric"),
            ui.el("span", {}, ", same anchors and math for every RAU.")])]),
        ui.el("div", { class: "sp" }),
        ui.el("div", { style: "min-width:220px" }, [ui.progress(100 * roll.rated / Math.max(1, roll.confirmed)), ui.el("div", { class: "g-muted", style: "font-size:12px;margin-top:3px;text-align:right" }, Math.round(100 * roll.rated / Math.max(1, roll.confirmed)) + "% rated")])]));
      if (!conf.length) { wrap.appendChild(ui.empty("No confirmed risk instances yet. Complete risk identification (Capability 2) first.")); return; }
      conf.sort(function (a, b) { return b.score - a.score; });
      conf.forEach(function (g) { wrap.appendChild(instRow(g)); });
    }

    function instRow(g) {
      var ev = data.byId("riskEvents", g.eventId);
      var t = data.ratingOf(r.id, g.eventId);
      var key = r.id + "|" + g.eventId;
      var sug = eng.suggest(r, ev, g);
      var open = !!OPEN[key];
      var row = ui.el("div", { class: "g-card", style: "padding:10px 14px;margin-bottom:8px" });
      var chips = [];
      if (t) {
        var bb = eng.band(eng.fromArray(t.f));
        chips.push(bandBadge(ui, bb.band));
        if (t.ov) chips.push(ui.badge("Override", "warn"));
        if (isStale(t, fmt)) chips.push(ui.badge("Stale", "warn"));
        var out = eng.peerOutlier(r, g.eventId, eng.fromArray(t.f));
        if (out) chips.push(ui.el("span", { class: "g-badge g-badge--bad", title: "Final band " + bandLabel(out.mine) + " vs LOB median " + bandLabel(out.median) + " across " + out.peers + " peers" }, "Peer outlier"));
      } else {
        chips.push(ui.badge("Not rated", ""));
      }
      var head = ui.el("div", { class: "g-row click" }, [
        ui.el("span", { class: "caret" + (open ? " open" : "") }),
        ev.side === "compliance" ? ui.badge("Compliance", "info") : ui.badge("Operational", ""),
        ui.el("a", { href: "#/events/" + ev.id, onclick: function (e) { e.stopPropagation(); } }, ev.name),
        ui.el("span", { class: "g-muted", style: "font-size:12px" }, "applicability " + g.score),
        ui.el("span", { class: "sp", style: "flex:1" }),
        ui.el("span", { class: "g-row" }, chips)]);
      head.onclick = function () { OPEN[key] = !open; draw(); };
      row.appendChild(head);
      if (open) row.appendChild(panel(g, ev, t, sug, key));
      return row;
    }

    function panel(g, ev, t, sug, key) {
      var box = ui.el("div", { style: "margin-top:10px;border-top:1px solid var(--g-line-soft);padding-top:10px" });
      var ed = ED[key];
      var editing = !t || (ed && ed.edit);
      var f = ed && ed.f ? ed.f : (t ? t.f.slice() : [sug.levels.l, sug.levels.fin, sug.levels.cust, sug.levels.reg, sug.levels.ops]);
      ED[key] = { edit: editing, f: f, note: ed && ed.note };
      var D = inh(ctx).def;
      var dims = [
        { i: 0, label: "Likelihood", anchors: D.likelihood.map(function (x) { return x.n + ": " + x.a; }), chips: sug.chips.l, sug: sug.levels.l },
        { i: 1, label: "Financial", anchors: D.lenses[0].a, chips: sug.chips.fin, sug: sug.levels.fin },
        { i: 2, label: "Customer", anchors: D.lenses[1].a, chips: sug.chips.cust, sug: sug.levels.cust },
        { i: 3, label: "Regulatory", anchors: D.lenses[2].a, chips: sug.chips.reg, sug: sug.levels.reg },
        { i: 4, label: "Operational disruption", anchors: D.lenses[3].a, chips: sug.chips.ops, sug: sug.levels.ops }
      ];
      var foot = ui.el("div");
      var noteBox = ui.el("div");
      function changed() {
        for (var i = 0; i < 5; i++) { if (f[i] !== [sug.levels.l, sug.levels.fin, sug.levels.cust, sug.levels.reg, sug.levels.ops][i]) return true; }
        return false;
      }
      function drawFoot() {
        foot.innerHTML = "";
        var lv = inh(ctx).fromArray(f);
        var bb = inh(ctx).band(lv);
        var rep = lv.cust >= 4 || lv.reg >= 4 || (ev.visClass || 1) >= 3;
        foot.appendChild(ui.el("div", { class: "g-row", style: "margin-top:8px" }, [
          ui.el("span", {}, "Impact = worst lens: "), ui.el("b", {}, bb.driver.label + " " + bb.impact),
          ui.el("span", {}, " x Likelihood " + lv.l + " = "), bandBadge(ui, bb.band),
          rep ? ui.el("span", { class: "g-badge", title: "Derived from customer reach, regulatory severity, and event visibility; reputational is not a scored dimension" }, "Reputational exposure flag") : null]));
        noteBox.innerHTML = "";
        if (editing) {
          var need = changed();
          var ta = ui.el("textarea", { class: "g-input", rows: "2", style: "width:100%;margin-top:8px", placeholder: "Override rationale (required when any level departs from the evidence-based suggestion)" });
          ta.value = (ed && ed.note) || (t && t.note) || "";
          ta.oninput = function () { ED[key].note = ta.value; saveBtn.disabled = need && !ta.value.trim(); };
          var saveBtn = ui.el("button", { class: "g-btn g-btn--primary", style: "margin-top:8px", onclick: function () { save(need ? ta.value.trim() : ""); } },
            need ? "Save override" : "Accept evidence-based rating");
          if (need) {
            noteBox.appendChild(ta);
            saveBtn.disabled = !ta.value.trim();
          }
          noteBox.appendChild(ui.el("div", { class: "g-row" }, [saveBtn,
            t ? ui.el("button", { class: "g-btn", style: "margin-top:8px", onclick: function () { delete ED[key]; draw(); } }, "Cancel") : null]));
        } else {
          noteBox.appendChild(ui.el("div", { class: "g-row", style: "margin-top:8px" }, [
            t.ov ? ui.el("span", { class: "g-muted", style: "font-size:12.5px" }, "Override rationale: " + (t.note || "-")) : ui.el("span", { class: "g-muted", style: "font-size:12.5px" }, "Accepted the evidence-based suggestion."),
            ui.el("span", { class: "sp", style: "flex:1" }),
            ui.el("span", { class: "g-muted", style: "font-size:12px" }, "Rated by " + t.by + " on " + fmt.date(t.date)),
            ui.el("button", { class: "g-btn sm", onclick: function () { ED[key] = { edit: true, f: t.f.slice() }; draw(); } }, "Re-rate")]));
        }
      }
      function save(note) {
        var s = [sug.levels.l, sug.levels.fin, sug.levels.cust, sug.levels.reg, sug.levels.ops];
        var ov = changed() ? 1 : 0;
        var row = { rauId: r.id, eventId: g.eventId, s: s, f: f.slice(), ov: ov, by: ctx.state.get("role") + " (session)", date: fmt.today() };
        if (ov && note) row.note = note;
        data.setRating(row);
        delete ED[key];
        GRC.traceAction(3, ov ? "Overriding a rating with rationale" : "Accepting an evidence-based rating");
        ui.toast(ev.name + " rated " + bandLabel(inh(ctx).band(inh(ctx).fromArray(row.f)).band) + (ov ? " with a documented override." : " from the evidence."));
        draw();
      }
      dims.forEach(function (d) {
        var picker = ui.el("span", { class: "g-row", style: "gap:2px" });
        for (var lvl = 1; lvl <= 5; lvl++) {
          (function (lvl) {
            var on = f[d.i] === lvl;
            var b = ui.el("button", {
              class: "g-btn sm" + (on ? " g-btn--primary" : ""),
              title: d.anchors[lvl - 1] + (lvl === d.sug ? " (suggested)" : ""),
              onclick: editing ? function () { f[d.i] = lvl; ED[key].f = f; drawFoot(); drawRows(); } : null
            }, String(lvl));
            if (!editing) b.disabled = true;
            if (lvl === d.sug) b.style.textDecoration = "underline";
            picker.appendChild(b);
          })(lvl);
        }
        var line = ui.el("div", { class: "g-row", style: "padding:5px 0;border-bottom:1px dashed var(--g-line-soft);align-items:flex-start" }, [
          ui.el("span", { style: "width:170px;flex:none;font-weight:600;font-size:13px" }, d.label),
          picker,
          ui.el("span", { style: "flex:1;min-width:220px" }, [
            ui.el("span", { class: "g-muted", style: "display:block;font-size:12px" }, "Level " + f[d.i] + ": " + d.anchors[f[d.i] - 1]),
            ui.el("span", {}, d.chips.map(function (c) { return ui.el("span", { class: "g-pill", style: "margin:2px 4px 0 0;font-size:11px", title: "Evidence with provenance" }, c); }))])]);
        line.dataset.dim = String(d.i);
        box.appendChild(line);
      });
      function drawRows() {
        box.querySelectorAll("[data-dim]").forEach(function (line) {
          var i = Number(line.dataset.dim);
          var d = dims[i];
          line.querySelectorAll("button").forEach(function (b, bi) {
            b.className = "g-btn sm" + (f[i] === bi + 1 ? " g-btn--primary" : "");
          });
          var lbl = line.querySelector(".g-muted");
          if (lbl) lbl.textContent = "Level " + f[i] + ": " + d.anchors[f[i] - 1];
        });
      }
      box.appendChild(foot);
      box.appendChild(noteBox);
      drawFoot();
      return box;
    }
    draw();
  }

  /* ==SECTION:rubric== */
  function rubricPage(el, ctx) {
    var ui = ctx.ui;
    var D = inh(ctx).def;
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "Inherent rating rubric"),
        ui.el("div", { class: "g-muted" }, "Likelihood times impact, five anchored levels each, identical for every RAU. This rubric is its own standard, separate from the applicability rubric in Capability 2. Every anchor is countable; subjectivity lives only in documented overrides.")])));
    var left = ui.el("div");
    var lt = ui.el("table", { class: "g-table" });
    lt.appendChild(ui.el("tr", {}, [ui.el("th", {}, "Level"), ui.el("th", {}, "Name"), ui.el("th", {}, "Frequency anchor")]));
    D.likelihood.forEach(function (x, i) {
      lt.appendChild(ui.el("tr", {}, [ui.el("td", { class: "g-mono" }, String(i + 1)), ui.el("td", {}, x.n), ui.el("td", {}, x.a)]));
    });
    left.appendChild(ui.card({ title: "Likelihood: how often, anchored to frequency", body: ui.el("div", { class: "g-tablewrap" }, lt) }));
    var it = ui.el("table", { class: "g-table" });
    it.appendChild(ui.el("tr", {}, [ui.el("th", {}, "Level")].concat(D.lenses.map(function (x) { return ui.el("th", {}, x.label); }))));
    for (var lvl = 1; lvl <= 5; lvl++) {
      it.appendChild(ui.el("tr", {}, [ui.el("td", { class: "g-mono" }, String(lvl))].concat(D.lenses.map(function (x) { return ui.el("td", { style: "font-size:12.5px" }, x.a[lvl - 1]); }))));
    }
    left.appendChild(ui.card({
      title: "Impact: worst credible outcome on four fact-anchored lenses", body: ui.el("div", {}, [
        ui.el("div", { class: "g-tablewrap" }, it),
        ui.el("p", { class: "g-muted", style: "font-size:12.5px;margin:8px 0 0" }, "The impact level is the highest lens reached. Reputational damage is deliberately NOT a scored lens: it is derived as a flag from customer reach, regulatory severity, and event visibility. Scoring it directly is where subjective ratings come from.")])
    }));
    var right = ui.el("div");
    var gt = ui.el("table", { class: "g-table" });
    gt.appendChild(ui.el("tr", {}, [ui.el("th", {}, "Impact \\ Likelihood")].concat([1, 2, 3, 4, 5].map(function (l) { return ui.el("th", { style: "text-align:center" }, String(l)); }))));
    for (var imp = 5; imp >= 1; imp--) {
      var cells = [ui.el("td", { class: "g-mono" }, String(imp))];
      for (var l2 = 1; l2 <= 5; l2++) {
        var b = D.grid[imp - 1][l2 - 1];
        cells.push(ui.el("td", { style: "text-align:center" }, ui.badge(bandLabel(b).slice(0, 1), bandKind(b))));
      }
      gt.appendChild(ui.el("tr", {}, cells));
    }
    right.appendChild(ui.card({
      title: "The band grid", body: ui.el("div", {}, [
        ui.el("div", { class: "g-tablewrap" }, gt),
        ui.el("div", { class: "g-row", style: "margin-top:8px" }, [bandBadge(ui, "low"), bandBadge(ui, "moderate"), bandBadge(ui, "high"), bandBadge(ui, "critical")])])
    }));
    right.appendChild(ui.card({
      title: "Where suggested levels come from", body: ui.el("ul", { style: "margin:0;padding-left:20px;font-size:13px" }, [
        ui.el("li", {}, "Likelihood: annual volume and loss history from the RAU profile, the event's error propensity class, and the change level."),
        ui.el("li", {}, "Financial: the event's typical severity class, amplified by high-volume money movement in the RAU's metadata."),
        ui.el("li", {}, "Customer: the consumer-facing survey answer and volume scale, plus attached MCR breadth on compliance instances."),
        ui.el("li", {}, "Regulatory: the count of MCRs attached to the instance and enforcement history in the obligation family."),
        ui.el("li", {}, "Operational disruption: handoff dependencies from the process map and volume-driven backlog exposure."),
        ui.el("li", {}, "Every chip on the worksheet names its source. Overrides are welcome; they just come with rationale.")])
    }));
    right.appendChild(ui.card({
      title: "Boundaries", body: ui.el("p", { class: "g-muted", style: "font-size:12.5px;margin:0" },
        "Ratings attach to risk instances only. MCRs and risk events carry no direct rating; compliance-side aggregation happens in the Compliance Aggregated Risk Assessment (CARA), outside RCSA. The RAU headline band is simply the highest instance band, shown with its drivers and a count strip.")
    }));
    el.appendChild(ui.el("div", { class: "g-split" }, [left, right]));
  }

  GRC.register({
    id: "inherent", version: "1.0.0", tab: "RCSA",
    caps: {
      "inherent": { primary: [3], uses: [2] },
      "inherent/:rauId": { primary: [3], uses: [1, 2], feeds: [5] },
      "inherent-rubric": { primary: [3] }
    },
    rail: [
      { label: "3. Inherent ratings", route: "inherent", order: 22 },
      { label: "Inherent rubric", route: "inherent-rubric", order: 82 }
    ],
    routes: { "inherent": landing, "inherent/:rauId": worksheet, "inherent-rubric": rubricPage }
  });
})();
