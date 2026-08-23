/* GRC modules/rau-profile.js v1.0.0 2026-08-23 */
/* Capability 1: the RAU profile - demographics, attributes, metadata survey
   with provenance, process map, handoffs, and the risk summary. */
(function () {
  "use strict";

  /* ==SECTION:map-render== */
  /* Shared read-only process map renderer (also used by mapbuilder). */
  window.GRC.renderMap = function (ctx, map, opts) {
    var ui = ctx.ui, data = ctx.data;
    opts = opts || {};
    var wrap = ui.el("div");
    if (!map || !map.phases) { wrap.appendChild(ui.empty("No detailed process map on file for this record in the demo dataset. A summary is shown on the Overview tab.")); return wrap; }
    map.phases.forEach(function (ph, pi) {
      var box = ui.el("div", { class: "map-phase" });
      box.appendChild(ui.el("div", { class: "ph" }, "Phase " + (pi + 1) + " - " + ph.name));
      ph.steps.forEach(function (st) {
        var cls = st.type === "decision" ? "decision" : st.type === "handoff-in" ? "h-in" : st.type === "handoff-out" ? "h-out" : "";
        var extra = null;
        if (st.type === "handoff-in" || st.type === "handoff-out") {
          var cp = data.byId("raus", st.cp);
          extra = ui.el("div", { style: "font-size:12px;margin-top:2px" }, [
            ui.badge(st.type === "handoff-in" ? "Receives from" : "Provides to", "info"), " ",
            ui.el("a", { href: "#/raus/" + st.cp }, cp ? cp.id + " " + cp.name : st.cp),
            st.art ? ui.el("span", { class: "g-muted" }, "  -  " + st.art) : null]);
        } else if (st.type === "decision") {
          extra = ui.el("div", { style: "font-size:11.5px;margin-top:1px" }, ui.badge("Decision", "warn"));
        }
        box.appendChild(ui.el("div", { class: "map-step " + cls }, [
          ui.el("div", { class: "n" }, String(st.n)),
          ui.el("div", {}, [ui.el("div", {}, st.text), extra])]));
      });
      wrap.appendChild(box);
    });
    return wrap;
  };

  /* ==SECTION:profile== */
  function profile(el, ctx, params) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    var r = data.byId("raus", params.id);
    if (!r) { el.appendChild(ui.empty("Unknown RAU: " + params.id)); return; }
    var p = data.orgPath(r.subLobId);
    var confirmed = data.regOfRau(r.id).filter(function (g) { return g.status === "confirmed"; });

    el.appendChild(ui.el("div", { class: "g-page-head" }, [
      ui.el("div", {}, [
        ui.el("div", { class: "g-row" }, [
          ui.el("span", { class: "g-h1" }, r.name),
          ui.el("span", { class: "g-mono g-muted" }, r.id),
          ui.badge(fmt.cat(r.category), "info"),
          ui.badge(r.stage === "active" ? "Active" : fmt.stage(r.stage), fmt.stageKind(r.stage))]),
        ui.el("div", { class: "g-muted" }, "Enterprise > " + p.lob + " > " + p.sub)]),
      ui.el("div", { class: "sp" }),
      ui.el("button", { class: "g-btn", onclick: function () { ctx.go("riskid/" + r.id); } }, "Open applicability workbench")]));

    el.appendChild(ui.el("div", { class: "g-kpis" }, [
      ui.kpi({ label: "Confirmed risks", value: confirmed.length, kind: "info", sub: r.riskIdStatus === "complete" ? "Risk ID complete" : "Risk ID " + r.riskIdStatus.replace("-", " ") }),
      ui.kpi({ label: "FTE", value: fmt.num(r.fte) }),
      ui.kpi({ label: "Annual volume", value: fmt.num(r.annualVolume) }),
      ui.kpi({ label: "Prior losses (12 mo)", value: r.priorLosses12m ? fmt.money(r.priorLosses12m) : "None", kind: r.priorLosses12m ? "warn" : "ok" }),
      ui.kpi({ label: "Handoffs", value: (r.handoffs || []).length, sub: "in + out" })]));

    el.appendChild(ui.tabs({
      items: [
        { id: "ov", label: "Overview", render: function (bd) { renderOverview(bd, ctx, r); } },
        { id: "meta", label: "Metadata survey", render: function (bd) { renderSurvey(bd, ctx, r); } },
        { id: "map", label: "Process map", render: function (bd) { bd.appendChild(window.GRC.renderMap(ctx, r.map)); } },
        { id: "hand", label: "Handoffs (" + (r.handoffs || []).length + ")", render: function (bd) { renderHandoffs(bd, ctx, r); } },
        { id: "risks", label: "Risks (" + confirmed.length + ")", render: function (bd) { renderRisks(bd, ctx, r); } }
      ]
    }));
  }

  /* ==SECTION:overview== */
  function renderOverview(bd, ctx, r) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    var left = ui.el("div");
    left.appendChild(ui.card({
      title: "Demographics", body: ui.kv([
        ["Description", r.description],
        ["RAU Owner", r.roles.owner], ["Owner Delegate", r.roles.delegate],
        ["BCM Contact", r.roles.bcmContact],
        ["ORBO (Operational Risk)", r.roles.orbo], ["BACO (Compliance Risk)", r.roles.baco],
        ["Locations", String(r.locations)], ["Change level", r.changeLevel],
        ["Last RCSA", fmt.date(r.lastRcsaDate)], ["Profile updated", fmt.date(r.profileUpdated)]])
    }));
    left.appendChild(ui.card({
      title: "Services performed (from the enterprise catalog)",
      body: ui.el("div", {}, (r.serviceIds || []).map(function (id) {
        return ui.el("span", { class: "g-pill", title: data.svcPath(id) }, data.svcName(id));
      }))
    }));
    var right = ui.el("div");
    var tagWrap = ui.el("div");
    (r.meta.tags || []).forEach(function (t) { tagWrap.appendChild(ui.pill(t)); });
    var exWrap = ui.el("div");
    (r.meta.excl || []).forEach(function (t) { exWrap.appendChild(ui.pill("does NOT: " + t, true)); });
    right.appendChild(ui.card({
      title: "Attributes (drive applicability, signals, and scoping)",
      body: ui.el("div", {}, [
        ui.el("div", { class: "g-label", style: "margin-bottom:4px" }, "Inclusion evidence - what this RAU does"),
        tagWrap,
        ui.el("div", { class: "g-label", style: "margin:10px 0 4px" }, "Exclusion evidence - confirmed does-not-do"),
        exWrap,
        ui.el("p", { class: "g-muted", style: "font-size:12px;margin:10px 0 0" },
          "Inclusions come from the process map, services, and survey answers; exclusions come from the metadata survey. Together they drive the stack-ranked applicability of the 90 risk events and 8,000 MCRs to this RAU.")])
    }));
    if (!r.map && r.mapSummary) {
      right.appendChild(ui.card({
        title: "Process map summary", body: ui.kv([
          ["Phases", String(r.mapSummary.phases)], ["Steps", String(r.mapSummary.steps)],
          ["Handoffs identified", String(r.mapSummary.handoffs)],
          ["Detail", "Full step detail not included in the demo dataset for this RAU - see the featured RAUs or the pipeline for full maps."]])
      }));
    }
    bd.appendChild(ui.el("div", { class: "g-split" }, [left, right]));
  }

  /* ==SECTION:survey== */
  function renderSurvey(bd, ctx, r) {
    var ui = ctx.ui, data = ctx.data;
    var qs = data.all("metaQuestions");
    var answers = r.metaAnswers;
    if (!answers) {
      /* derive display answers from tags/exclusions for non-featured RAUs */
      answers = qs.map(function (q) {
        var yes = q.tag ? (r.meta.tags || []).indexOf(q.tag) >= 0 : (r.meta.excl || []).indexOf(q.excl) >= 0;
        return { q: q.id, v: yes ? "yes" : "no", src: "derived" };
      });
    }
    var byId = {}; answers.forEach(function (a) { byId[a.q] = a; });
    var derived = 0, user = 0;
    answers.forEach(function (a) { if (a.src === "user") user++; else derived++; });
    bd.appendChild(ui.el("p", { class: "g-muted" },
      "The standardized survey is filled by the assistant from the process map, services, and intake details; " +
      "questions it cannot conclude are asked directly. Most questions confirm what the RAU does NOT do - " +
      "absence never shows on a process map. Provenance: " + derived + " derived, " + user + " answered by the owner team."));
    var bySection = {};
    qs.forEach(function (q) { (bySection[q.section] = bySection[q.section] || []).push(q); });
    Object.keys(bySection).forEach(function (sec) {
      var card = ui.card({ title: sec, body: ui.el("div") });
      var body = card.lastChild;
      bySection[sec].forEach(function (q) {
        var a = byId[q.id];
        var srcLabel = !a ? "" : a.src === "user" ? "answered by owner team" : a.src === "services" ? "derived from services" : a.src === "derived" ? "derived from attributes" : a.src.indexOf("map:") === 0 ? "derived from map step " + a.src.slice(4) : a.src;
        body.appendChild(ui.el("div", { class: "g-row", style: "padding:5px 0;border-bottom:1px solid var(--g-line-soft)" }, [
          ui.el("span", { class: "g-mono g-muted", style: "width:34px;flex:none" }, q.id),
          ui.el("span", { style: "flex:1;min-width:240px" }, q.text),
          a ? ui.el("span", { class: a.v === "yes" ? "ans-yes" : "ans-no" }, a.v.toUpperCase()) : ui.badge("Open", "warn"),
          a ? ui.el("span", { class: "provsrc" }, srcLabel) : null]));
      });
      bd.appendChild(card);
    });
  }

  /* ==SECTION:handoffs== */
  function renderHandoffs(bd, ctx, r) {
    var ui = ctx.ui, data = ctx.data;
    var outs = (r.handoffs || []).filter(function (h) { return h.dir === "out"; });
    var ins = (r.handoffs || []).filter(function (h) { return h.dir === "in"; });
    function tbl(rows, dirLabel) {
      if (!rows.length) return ui.empty("None recorded.");
      return ui.table({
        cols: [
          { key: "cp", label: dirLabel, render: function (h) { var cp = data.byId("raus", h.cp); return ui.el("a", { href: "#/raus/" + h.cp }, cp ? cp.id + " - " + cp.name : h.cp); } },
          { key: "art", label: "What moves" },
          { key: "conf", label: "Status", render: function (h) { return h.conf ? ui.badge("Confirmed", "ok") : ui.badge("Pending counterparty confirmation", "warn"); } }
        ], rows: rows, page: 12
      });
    }
    bd.appendChild(ui.el("p", { class: "g-muted" }, "Handoffs are declared on the process map and trusted at submission; the counterparty confirms afterward through My Work. They form the inter-RAU dependency network - a change in this RAU signals its counterparties (Capability 6)."));
    bd.appendChild(ui.el("div", { class: "g-split" }, [
      ui.card({ title: "Provides to (" + outs.length + ")", body: tbl(outs, "Counterparty RAU") }),
      ui.card({ title: "Receives from (" + ins.length + ")", body: tbl(ins, "Counterparty RAU") })]));
  }

  /* ==SECTION:risks== */
  function renderRisks(bd, ctx, r) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    var reg = data.regOfRau(r.id);
    var confirmed = reg.filter(function (g) { return g.status === "confirmed"; });
    var rejected = reg.filter(function (g) { return g.status === "rejected"; });
    bd.appendChild(ui.el("div", { class: "g-row", style: "margin-bottom:10px" }, [
      ui.badge(confirmed.length + " confirmed", "ok"), ui.badge(rejected.length + " rejected", ""),
      ui.el("span", { class: "sp", style: "flex:1" }),
      ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { ctx.go("riskid/" + r.id); } }, "Open applicability workbench")]));
    if (!confirmed.length) { bd.appendChild(ui.empty("No confirmed risks yet. The owner team takes the first pass in the applicability workbench.")); return; }
    bd.appendChild(ui.table({
      cols: [
        { key: "eventId", label: "Risk event", render: function (g) { var ev = data.byId("riskEvents", g.eventId); return ui.el("a", { href: "#/events/" + g.eventId }, ev ? ev.name : g.eventId); } },
        { key: "side", label: "Type", render: function (g) { var ev = data.byId("riskEvents", g.eventId); return ev && ev.side === "compliance" ? ui.badge("Compliance", "info") : ui.badge("Operational", ""); } },
        { key: "score", label: "Applicability", num: true, sort: true, render: function (g) { return g.score + ""; } },
        { key: "mcr", label: "MCRs attached", num: true, render: function (g) { return g.mcrIds ? String(g.mcrIds.length) : "-"; } },
        { key: "by", label: "Confirmed by" },
        { key: "date", label: "Date", sort: true, render: function (g) { return fmt.date(g.date); } }
      ], rows: confirmed, page: 15
    }));
  }

  GRC.register({
    id: "rau-profile", version: "1.0.0", tab: "RCSA",
    routes: { "raus/:id": profile }
  });
})();
