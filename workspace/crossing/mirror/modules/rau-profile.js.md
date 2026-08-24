/* GRC modules/rau-profile.js v1.5.0 2026-08-23 */
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
            st.art ? ui.el("span", { class: "g-muted" }, ", carries: " + st.art) : null]);
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

  /* ==SECTION:map-diagram== */
  /* Visio-style cross-functional flowchart: phases as horizontal lanes,
     tasks as rectangles, decisions as diamonds, handoffs as tabbed shapes
     linking their counterparty RAU. Pure SVG, scrolls in its own frame. */
  window.GRC.mapDiagram = function (ctx, map) {
    var NS = "http://www.w3.org/2000/svg";
    function sv(tag, attrs, parent) {
      var n = document.createElementNS(NS, tag);
      Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
      if (parent) parent.appendChild(n);
      return n;
    }
    function wrap(txt, width) {
      var words = String(txt).split(" "), lines = [], cur = "";
      var maxc = Math.floor(width / 5.6);
      words.forEach(function (w) {
        if ((cur + " " + w).trim().length > maxc) { if (cur) lines.push(cur); cur = w; }
        else cur = (cur + " " + w).trim();
      });
      if (cur) lines.push(cur);
      if (lines.length > 3) { lines = lines.slice(0, 3); lines[2] = lines[2].slice(0, maxc - 3) + "..."; }
      return lines;
    }
    var holder = document.createElement("div");
    holder.className = "flowwrap";
    if (!map || !map.phases || !map.phases.length) {
      holder.innerHTML = "<div class='g-empty'>No detailed process map on file for this record in the demo dataset.</div>";
      return holder;
    }
    var W = 152, H = 58, GX = 44, LANEH = 138, LABW = 148, PAD = 14;
    var maxSlots = 0;
    map.phases.forEach(function (p, i) {
      var slots = p.steps.length + (i === 0 ? 1 : 0) + (i === map.phases.length - 1 ? 1 : 0);
      if (slots > maxSlots) maxSlots = slots;
    });
    var width = LABW + PAD + maxSlots * (W + GX) + 30;
    var height = map.phases.length * LANEH + 20;
    var svg = sv("svg", { width: width, height: height, viewBox: "0 0 " + width + " " + height, role: "img" });
    var defs = sv("defs", {}, svg);
    var mk = sv("marker", { id: "arr", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" }, defs);
    sv("path", { d: "M0 0 L10 5 L0 10 z", fill: "#5f6773" }, mk);
    function arrowLine(pts, label) {
      var d = "M" + pts.map(function (p) { return p[0] + " " + p[1]; }).join(" L");
      sv("path", { d: d, fill: "none", stroke: "#5f6773", "stroke-width": "1.4", "marker-end": "url(#arr)" }, svg);
      if (label) {
        var t = sv("text", { x: pts[0][0] + 6, y: pts[0][1] - 5, "font-size": "9.5", fill: "#5f6773", "font-weight": "600" }, svg);
        t.textContent = label;
      }
    }
    function shapeText(cx, cy, lines, size, color, weight) {
      var t = sv("text", { x: cx, y: cy - (lines.length - 1) * 6, "text-anchor": "middle", "font-size": size || "10.5", fill: color || "#1f2430", "font-weight": weight || "400" }, svg);
      lines.forEach(function (ln, i) {
        var ts = sv("tspan", { x: cx, dy: i === 0 ? 0 : 12 }, t);
        ts.textContent = ln;
      });
      return t;
    }
    /* lanes */
    map.phases.forEach(function (p, li) {
      var y = li * LANEH + 10;
      sv("rect", { x: 4, y: y, width: width - 10, height: LANEH - 8, fill: li % 2 ? "#fbfcfd" : "#ffffff", stroke: "#e4e8ec" }, svg);
      sv("rect", { x: 4, y: y, width: LABW, height: LANEH - 8, fill: "#f2f4f6", stroke: "#e4e8ec" }, svg);
      shapeText(4 + LABW / 2, y + LANEH / 2 - 4, wrap("Phase " + (li + 1) + ": " + p.name, LABW - 16), "10.5", "#4c5560", "600");
    });
    /* shapes */
    var prev = null; /* {x,y} exit point of previous shape */
    map.phases.forEach(function (p, li) {
      var laneY = li * LANEH + 10 + (LANEH - 8) / 2;
      var slot = 0;
      var startX = LABW + PAD + 12;
      function slotX(s) { return startX + s * (W + GX); }
      if (li === 0) {
        var sx = slotX(slot++), sy = laneY;
        sv("rect", { x: sx, y: sy - 16, width: 84, height: 32, rx: 16, fill: "#eef0f3", stroke: "#8b93a0" }, svg);
        shapeText(sx + 42, sy + 4, ["Start"], "11", "#3d4451", "700");
        prev = { x: sx + 84, y: sy };
      }
      p.steps.forEach(function (st) {
        var x = slotX(slot++), cy = laneY;
        var g = sv("g", { style: "cursor:" + ((st.type === "handoff-in" || st.type === "handoff-out") && st.cp ? "pointer" : "default") }, svg);
        sv("title", {}, g).textContent = st.n + ". " + st.text + (st.cp ? " (" + (st.type === "handoff-in" ? "from " : "to ") + st.cp + (st.art ? ", " + st.art : "") + ")" : "");
        if (st.type === "decision") {
          var dcx = x + W / 2, dcy = cy;
          sv("polygon", { points: (dcx) + "," + (dcy - 34) + " " + (x + W + 6) + "," + dcy + " " + dcx + "," + (dcy + 34) + " " + (x - 6) + "," + dcy, fill: "#fbf0df", stroke: "#d97706", "stroke-width": "1.4" }, g);
          shapeText(dcx, dcy + 3, wrap(st.text, W - 34), "10", "#6b4a08", "600");
          sv("circle", { cx: dcx, cy: dcy + 52, r: 3, fill: "none", stroke: "#b9bfc7" }, g);
          arrowLine([[dcx, dcy + 34], [dcx, dcy + 47]], "No");
          shapeText(dcx + 58, dcy + 55, ["exception path"], "8.5", "#8b93a0");
          if (prev) arrowLine([[prev.x, prev.y], [x - 8, cy]]);
          prev = { x: x + W + 6, y: cy, yesFrom: true };
        } else if (st.type === "handoff-in" || st.type === "handoff-out") {
          var out = st.type === "handoff-out";
          sv("rect", { x: x, y: cy - H / 2, width: W, height: H, rx: 5, fill: "#e8eff7", stroke: "#2e6ea6", "stroke-width": "1.4" }, g);
          var tabX = out ? x + W : x - 12;
          sv("polygon", { points: tabX + "," + (cy - 10) + " " + (tabX + 12) + "," + cy + " " + tabX + "," + (cy + 10), fill: "#2e6ea6" }, g);
          shapeText(x + W / 2, cy - 2, wrap(st.text, W - 18), "10", "#1c4569");
          var cpr = st.cp ? ctx.data.byId("raus", st.cp) : null;
          shapeText(x + W / 2, cy + H / 2 + 12, [(out ? "to " : "from ") + (st.cp || "another RAU")], "9", "#2e6ea6", "700");
          if (st.cp) g.addEventListener("click", function () { ctx.go("raus/" + st.cp); });
          if (cpr) sv("title", {}, g).textContent += " " + cpr.name;
          if (prev) arrowLine([[prev.x, prev.y], [x - (out ? 8 : 20), cy]], prev.yesFrom ? "Yes" : null);
          prev = { x: x + W + (out ? 14 : 2), y: cy };
        } else {
          sv("rect", { x: x, y: cy - H / 2, width: W, height: H, rx: 6, fill: "#ffffff", stroke: "#8b93a0", "stroke-width": "1.3" }, g);
          shapeText(x + W / 2, cy + 2, wrap(st.text, W - 16));
          sv("text", { x: x + 7, y: cy - H / 2 + 12, "font-size": "8.5", fill: "#9aa2ae", "font-weight": "700" }, g).textContent = String(st.n);
          if (prev) arrowLine([[prev.x, prev.y], [x - 8, cy]], prev.yesFrom ? "Yes" : null);
          prev = { x: x + W, y: cy };
        }
      });
      /* connector down to next lane */
      if (li < map.phases.length - 1 && prev) {
        var nextY = (li + 1) * LANEH + 10 + (LANEH - 8) / 2;
        arrowLine([[prev.x, prev.y], [prev.x + 18, prev.y], [prev.x + 18, prev.y + (LANEH / 2) - 10], [LABW + PAD + 2, prev.y + (LANEH / 2) - 10], [LABW + PAD + 2, nextY], [LABW + PAD + 10, nextY]]);
        prev = { x: LABW + PAD + 10, y: nextY };
      }
      if (li === map.phases.length - 1) {
        var ex = slotX(slot), ey = laneY;
        sv("rect", { x: ex, y: ey - 16, width: 84, height: 32, rx: 16, fill: "#e8f4ec", stroke: "#15803d" }, svg);
        shapeText(ex + 42, ey + 4, ["End"], "11", "#15803d", "700");
        if (prev) arrowLine([[prev.x, prev.y], [ex - 8, ey]]);
      }
    });
    holder.appendChild(svg);
    return holder;
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
        ui.el("div", { class: "g-muted", style: "font-size:12px;margin-bottom:2px" }, [
          ui.el("a", { href: "#/raus" }, "RAUs"), " / " + r.id]),
        ui.el("div", { class: "g-row" }, [
          ui.el("span", { class: "g-h1" }, r.name),
          ui.el("span", { class: "g-mono g-muted" }, r.id),
          ui.badge(fmt.cat(r.category), "info"),
          ui.badge(r.stage === "active" ? "Active" : fmt.stage(r.stage), fmt.stageKind(r.stage))]),
        ui.el("div", { class: "g-muted" }, "Enterprise > " + p.lob + " > " + p.sub)]),
      ui.el("div", { class: "sp" }),
      ui.el("button", { class: "g-btn", onclick: function () { ctx.go("riskid/" + r.id); } }, "Open applicability workbench")]));

    el.appendChild(ui.tabs({
      items: [
        { id: "ov", label: "Overview", render: function (bd) { renderOverview(bd, ctx, r); } },
        { id: "meta", label: "Metadata survey", render: function (bd) { renderSurvey(bd, ctx, r); } },
        { id: "map", label: "Process map", render: function (bd) {
          bd.appendChild(window.GRC.mapDiagram(ctx, r.map));
          if (r.map) {
            var open = false;
            var listWrap = ui.el("div", { style: "display:none;margin-top:12px" });
            listWrap.appendChild(window.GRC.renderMap(ctx, r.map));
            bd.appendChild(ui.el("div", { style: "margin-top:10px" },
              ui.el("button", { class: "g-btn sm", onclick: function (e) { open = !open; listWrap.style.display = open ? "block" : "none"; e.target.textContent = open ? "Hide step list" : "Show step list"; } }, "Show step list")));
            bd.appendChild(listWrap);
          }
        } },
        { id: "hand", label: "Handoffs (" + (r.handoffs || []).length + ")", render: function (bd) { renderHandoffs(bd, ctx, r); } },
        { id: "risks", label: "Risks (" + confirmed.length + ")", render: function (bd) { renderRisks(bd, ctx, r); } },
        { id: "ctls", label: "Controls", render: function (bd) { renderControls(bd, ctx, r); } }
      ]
    }));
  }

  /* ==SECTION:controls-tab== */
  function renderControls(bd, ctx, r) {
    var ui = ctx.ui, data = ctx.data, eng = ctx.engine.ctl;
    var confirmed = data.regOfRau(r.id).filter(function (g) { return g.status === "confirmed"; });
    var owned = data.controlsOwnedBy(r.id);
    bd.appendChild(ui.el("p", { class: "g-muted", style: "font-size:12.5px" },
      owned.length + " controls are owned by this RAU (" + owned.filter(function (c) { return c.shared; }).length +
      " offered as shared). Each confirmed risk instance shows its mitigation below; Manage opens the recommendation flow."));
    if (!confirmed.length) { bd.appendChild(ui.empty("No confirmed risk instances yet.")); return; }
    bd.appendChild(ui.table({
      cols: [
        { key: "ev", label: "Risk instance", render: function (g) { var e = data.byId("riskEvents", g.eventId); return e ? e.name : g.eventId; } },
        { key: "band", label: "Inherent", render: function (g) {
          var t = data.ratingOf(r.id, g.eventId);
          if (!t) return ui.el("span", { class: "g-muted" }, "unrated");
          var b = ctx.engine.inherent.band(ctx.engine.inherent.fromArray(t.f)).band;
          return ui.badge(b.charAt(0).toUpperCase() + b.slice(1), b === "low" ? "ok" : b === "moderate" ? "info" : b === "high" ? "warn" : "bad");
        } },
        { key: "ctls", label: "Controls", render: function (g) {
          var cs = data.controlsOfInstance(r.id, g.eventId);
          if (!cs.length) return ui.badge("None", "bad");
          return ui.el("span", {}, cs.map(function (c) {
            var dk = eng.derivedKey(c);
            return ui.el("a", { href: "#/controls/" + c.id, class: "g-pill", style: "text-decoration:none" + (dk.key ? ";font-weight:700" : ""), title: c.type + ", " + c.automation + (dk.key ? "; derived KEY: " + dk.rules.map(function (x) { return x.id; }).join(",") : ""), onclick: function (e) { e.stopPropagation(); } }, c.name);
          }));
        } },
        { key: "go", label: "", render: function () { return ui.el("button", { class: "g-btn sm" }, "Manage"); } }
      ], rows: confirmed, page: 12,
      onRow: function (g) { ctx.go("attach/" + r.id + "/" + g.eventId); }
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
        ["FTE", fmt.num(r.fte)], ["Locations", String(r.locations)],
        ["Annual volume", fmt.num(r.annualVolume)],
        ["Prior losses, 12 months", r.priorLosses12m ? fmt.money(r.priorLosses12m) : "None"],
        ["Change level", r.changeLevel],
        ["Risk identification", r.riskIdStatus.replace("-", " ")],
        ["Last RCSA", fmt.date(r.lastRcsaDate)], ["Profile updated", fmt.date(r.profileUpdated)]])
    }));
    left.appendChild(ui.card({
      title: "Services performed (from the enterprise catalog)",
      body: ui.el("div", {}, (r.serviceIds || []).map(function (id) {
        return ui.el("span", { class: "g-pill", title: data.svcPath(id) }, data.svcName(id));
      }))
    }));
    var right = ui.el("div");
    var roll = ctx.engine.inherent.rollup(r);
    function bk(b) { return b === "low" ? "ok" : b === "moderate" ? "info" : b === "high" ? "warn" : "bad"; }
    function bl(b) { return b.charAt(0).toUpperCase() + b.slice(1); }
    right.appendChild(ui.card({
      title: "Inherent risk (Capability 3)",
      body: ui.el("div", {}, [
        roll.band ? ui.el("div", { class: "g-row" }, [
          ui.badge(bl(roll.band), bk(roll.band)),
          ui.el("span", { class: "g-muted", style: "font-size:12.5px" }, "highest instance band, driven by " + roll.drivers.join("; "))]) :
          ui.el("p", { class: "g-muted", style: "font-size:12.5px;margin:0" }, "No instances rated yet."),
        ui.el("div", { class: "g-row", style: "margin-top:6px" },
          ["critical", "high", "moderate", "low"].map(function (b) {
            return roll.counts[b] ? ui.el("span", { class: "g-badge g-badge--" + bk(b), title: bl(b) }, roll.counts[b] + bl(b).slice(0, 1)) : null;
          })),
        ui.el("p", { class: "g-muted", style: "font-size:12px;margin:8px 0 0" }, roll.rated + " of " + roll.confirmed + " confirmed instances rated on the evidence-anchored rubric."),
        ui.el("button", { class: "g-btn sm", style: "margin-top:6px", onclick: function () { ctx.go("inherent/" + r.id); } }, "Open rating worksheet")])
    }));
    var prof5 = ctx.engine.rcsa.profile(r);
    var st5 = ctx.engine.rcsa.affState(r);
    var stMap5 = { "current": ["Current", "ok"], "pending-changes": ["Changes pending", "info"], "due": ["Due", "warn"], "overdue": ["Overdue", "bad"], "never": ["Never affirmed", "bad"] };
    right.appendChild(ui.card({
      title: "Residual risk and affirmation (Capability 5)",
      body: ui.el("div", {}, [
        ui.el("div", { class: "g-row" }, [
          prof5.high ? ui.el("span", { class: "g-badge g-badge--bad" }, prof5.high + "H") : null,
          prof5.moderate ? ui.el("span", { class: "g-badge g-badge--info" }, prof5.moderate + "M") : null,
          prof5.low ? ui.el("span", { class: "g-badge g-badge--ok" }, prof5.low + "L") : null,
          prof5.unrated ? ui.el("span", { class: "g-badge", title: "Unrated instances: residual cannot compute" }, prof5.unrated + "U") : null,
          ui.el("span", { class: "g-badge g-badge--" + stMap5[st5.state][1] }, stMap5[st5.state][0])]),
        ui.el("p", { class: "g-muted", style: "font-size:12px;margin:8px 0 0" },
          (st5.aff && st5.aff.date ? "Last affirmed " + fmt.date(st5.aff.date) + " by " + st5.aff.by + ". " : "Never affirmed. ") +
          (st5.pending ? st5.pending + " unadopted change" + (st5.pending === 1 ? "" : "s") + ". " : "") +
          (st5.openChal ? st5.openChal + " open challenge" + (st5.openChal === 1 ? "" : "s") + "." : "")),
        ui.el("button", { class: "g-btn sm", style: "margin-top:6px", onclick: function () { ctx.go("rcsa/" + r.id); } }, "Open assessment workspace")])
    }));
    var tagWrap = ui.el("div");
    (r.meta.tags || []).forEach(function (t) { tagWrap.appendChild(ui.pill(t)); });
    var exWrap = ui.el("div");
    (r.meta.excl || []).forEach(function (t) { exWrap.appendChild(ui.pill("does NOT: " + t, true)); });
    right.appendChild(ui.card({
      title: "Attributes (drive applicability, signals, and scoping)",
      body: ui.el("div", {}, [
        ui.el("div", { class: "g-label", style: "margin-bottom:4px" }, "Inclusion evidence: what this RAU does"),
        tagWrap,
        ui.el("div", { class: "g-label", style: "margin:10px 0 4px" }, "Exclusion evidence: confirmed does-not-do"),
        exWrap,
        ui.el("p", { class: "g-muted", style: "font-size:12px;margin:10px 0 0" },
          "Inclusions come from the process map, services, and survey answers; exclusions come from the metadata survey. Together they drive the stack-ranked applicability of the 90 risk events and 8,000 MCRs to this RAU.")])
    }));
    if (!r.map && r.mapSummary) {
      right.appendChild(ui.card({
        title: "Process map summary", body: ui.kv([
          ["Phases", String(r.mapSummary.phases)], ["Steps", String(r.mapSummary.steps)],
          ["Handoffs identified", String(r.mapSummary.handoffs)],
          ["Detail", "Full step detail not included in the demo dataset for this RAU. See the featured RAUs or the pipeline for full maps."]])
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
      "questions it cannot conclude are asked directly. Most questions confirm what the RAU does NOT do; " +
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
    bd.appendChild(ui.el("p", { class: "g-muted" }, "Handoffs are declared on the process map and trusted at submission; the counterparty confirms afterward through My Work. They form the inter-RAU dependency network; a change in this RAU signals its counterparties (Capability 6)."));
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
    id: "rau-profile", version: "1.5.0", tab: "RCSA",
    caps: { "raus/:id": { primary: [1], uses: [2, 3, 4, 5] } },
    routes: { "raus/:id": profile }
  });
})();
