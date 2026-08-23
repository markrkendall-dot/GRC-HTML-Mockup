/* GRC modules/riskid.js v1.2.0 2026-08-23 */
/* Capability 2: Operational & Compliance Risk Identification - the
   applicability workbench. The engine stack-ranks all 90 risk events (and
   the MCRs beneath compliance events) against the RAU's metadata; the
   front line confirms or rejects; ambiguous items get resolved out of the
   middle by targeted questions. */
(function () {
  "use strict";

  /* ==SECTION:landing== */
  var LF = { q: "", status: "" };
  function landing(el, ctx) {
    var ui = ctx.ui, data = ctx.data;
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "Risk identification"),
        ui.el("div", { class: "g-muted" }, "The front line takes the first pass. The engine stack-ranks the applicability of the risk event and MCR libraries to each RAU; the owner team picks. Same rubric, same math, for every RAU.")])));
    var body = ui.el("div"); el.appendChild(body);
    function draw() {
      body.innerHTML = "";
      var rows = data.all("raus").filter(function (r) {
        if (LF.q && (r.id + " " + r.name).toLowerCase().indexOf(LF.q.toLowerCase()) < 0) return false;
        if (LF.status && r.riskIdStatus !== LF.status) return false;
        return true;
      });
      body.appendChild(ui.toolbar([
        ui.searchBox({ value: LF.q, placeholder: "Find a RAU...", oninput: function (v) { LF.q = v; draw(); } }),
        ui.select({
          label: "Status", value: LF.status, onchange: function (v) { LF.status = v; draw(); },
          options: [{ value: "", label: "All" }, { value: "not-started", label: "Not started" }, { value: "in-progress", label: "In progress" }, { value: "complete", label: "Complete" }]
        })]));
      body.appendChild(ui.table({
        cols: [
          { key: "id", label: "RAU", render: function (r) { return ui.el("span", { class: "g-mono" }, r.id); } },
          { key: "name", label: "Name", sort: true },
          { key: "sub", label: "SubLOB", render: function (r) { return data.orgPath(r.subLobId).sub; } },
          { key: "riskIdStatus", label: "Risk ID", sort: true, render: function (r) { return ui.badge(r.riskIdStatus.replace("-", " "), ctx.fmt.riskIdKind(r.riskIdStatus)); } },
          { key: "n", label: "Confirmed", num: true, render: function (r) { return String(data.regOfRau(r.id).filter(function (g) { return g.status === "confirmed"; }).length); } },
          { key: "go", label: "", render: function (r) { return ui.el("button", { class: "g-btn sm" }, "Open workbench"); } }
        ], rows: rows, page: 15,
        onRow: function (r) { ctx.go("riskid/" + r.id); }
      }));
    }
    draw();
  }

  /* ==SECTION:workbench== */
  function workbench(el, ctx, params) {
    var ui = ctx.ui, data = ctx.data, eng = ctx.engine, fmt = ctx.fmt;
    var r = data.byId("raus", params.rauId);
    if (!r) { el.appendChild(ui.empty("Unknown RAU " + params.rauId)); return; }
    var wrap = ui.el("div"); el.appendChild(wrap);
    var showAllMiddle = false;

    function dispositionOf(evId) {
      var rows = data.regOfRau(r.id);
      for (var i = 0; i < rows.length; i++) { if (rows[i].eventId === evId) return rows[i]; }
      return null;
    }
    function draw() {
      wrap.innerHTML = "";
      var cand = eng.candidates(r);
      var open = [], done = [];
      cand.scored.forEach(function (s) {
        var d = dispositionOf(s.ev.id);
        if (d) { done.push({ s: s, d: d }); } else { open.push(s); }
      });
      var z = eng.zones(open);
      var totalCand = cand.scored.length;
      var prog = 100 * done.length / Math.max(1, totalCand);
      /* A completed RAU stores confirmations and notable rejections only;
         everything else was dismissed at completion. Show it that way. */
      var implicitDismissed = 0;
      if (r.riskIdStatus === "complete" && open.length) {
        implicitDismissed = open.length;
        z = { likely: [], middle: [], unlikely: [] };
        prog = 100;
      }

      wrap.appendChild(ui.el("div", { class: "g-page-head" }, [
        ui.el("div", {}, [
          ui.el("div", { class: "g-muted", style: "font-size:12px;margin-bottom:2px" }, [
            ui.el("a", { href: "#/riskid" }, "Risk identification"), " / " + r.id]),
          ui.el("div", { class: "g-row" }, [
            ui.el("span", { class: "g-h1" }, "Applicability workbench"),
            ui.el("a", { href: "#/raus/" + r.id, class: "g-mono" }, r.id), ui.el("span", {}, r.name)]),
          ui.el("div", { class: "g-muted" }, done.length + " of " + totalCand + " candidates dispositioned; " +
            cand.suppressed.length + " suppressed by exclusions. Rubric v" + (eng.rubric().version || "1.0") + ". Same math for every RAU; the Applicability Rubric page documents it.")]),
        ui.el("div", { class: "sp" }),
        ui.el("div", { style: "min-width:220px" }, [ui.progress(prog), ui.el("div", { class: "g-muted", style: "font-size:12px;margin-top:3px;text-align:right" }, Math.round(prog) + "% dispositioned")])]));

      if (implicitDismissed) {
        wrap.appendChild(ui.el("div", { class: "g-card", style: "border-left:4px solid var(--g-line)" },
          ui.el("div", {}, [ui.badge("Risk ID complete", "ok"),
          ui.el("span", { style: "margin-left:8px" }, implicitDismissed + " remaining candidates were dismissed below the applicability floor at completion. The register keeps confirmations and notable rejections; reopen any event from its library page if circumstances change.")])));
      }
      /* suppressed by exclusions */
      if (cand.suppressed.length) {
        var supBody = ui.el("div");
        cand.suppressed.forEach(function (x) {
          supBody.appendChild(ui.el("div", { class: "g-row", style: "padding:3px 0" }, [
            ui.pill("does NOT: " + x.topic, true),
            ui.el("a", { href: "#/events/" + x.ev.id }, x.ev.name),
            ui.el("span", { class: "g-muted", style: "font-size:12px" }, "hidden by the metadata survey's exclusion evidence")]));
        });
        var supCard = ui.card({
          title: "Suppressed by exclusions (" + cand.suppressed.length + "): the survey at work",
          body: supBody
        });
        supCard.style.borderLeft = "4px solid var(--g-line)";
        wrap.appendChild(supCard);
      }

      function zoneBlock(title, cls, items, note, renderActions) {
        var box = ui.el("div", { class: "g-zone " + cls });
        box.appendChild(ui.el("div", { class: "g-row", style: "margin-bottom:6px" }, [
          ui.el("span", { class: "g-h2", style: "margin:0" }, title + " (" + items.length + ")"),
          ui.el("span", { class: "g-muted", style: "font-size:12.5px" }, note)]));
        if (!items.length) { box.appendChild(ui.el("div", { class: "g-muted", style: "font-size:13px;padding:4px 0 8px" }, "Nothing here right now.")); return box; }
        items.forEach(function (s) { box.appendChild(candRow(s, renderActions)); });
        return box;
      }

      function candRow(s, renderActions) {
        var ev = s.ev;
        var open = false;
        var row = ui.el("div", { class: "g-card", style: "padding:10px 14px;margin-bottom:8px" });
        var detail = ui.el("div", { style: "display:none;margin-top:10px;border-top:1px solid var(--g-line-soft);padding-top:10px" });
        var head = ui.el("div", { class: "g-row" }, [
          ui.el("span", { class: "g-score", title: "Applicability likelihood " + s.pct + "%" }, [String(s.pct), ui.el("i", {}, ui.el("b", { style: "width:" + s.pct + "%" }))]),
          ui.badge(fmt.band(s.band), fmt.bandKind(s.band)),
          ev.side === "compliance" ? ui.badge("Compliance", "info") : ui.badge("Operational", ""),
          ui.el("a", { href: "#/events/" + ev.id, onclick: function (e) { e.stopPropagation(); } }, ev.name),
          ui.el("span", { class: "sp", style: "flex:1" }),
          ui.el("button", { class: "g-btn sm", onclick: function (e) { e.stopPropagation(); open = !open; detail.style.display = open ? "block" : "none"; } }, "Why this score"),
          renderActions(s)]);
        row.appendChild(head);
        detail.appendChild(ui.el("div", { class: "g-label", style: "margin-bottom:4px" }, "Rubric breakdown (8 categories, 1-5, weighted)"));
        detail.appendChild(ctx.charts.scoreBars({ categories: eng.rubric().categories, cats: s.cats }));
        detail.appendChild(ui.el("div", { class: "g-muted", style: "font-size:12px;margin-top:4px" }, "Keywords: " + (ev.keywords || []).join(", ")));
        if (ev.side === "compliance") {
          var mc = eng.mcrCandidates(r, ev.id);
          detail.appendChild(ui.el("div", { class: "g-label", style: "margin:10px 0 4px" }, "MCRs under this event (" + mc.total + " total; top-ranked shown, " + mc.tailCount + " long-tail)"));
          mc.head.slice(0, 6).forEach(function (h) {
            detail.appendChild(ui.el("div", { class: "g-row", style: "padding:2px 0;font-size:12.5px" }, [
              ui.el("span", { class: "g-score" }, [String(h.pct), ui.el("i", {}, ui.el("b", { style: "width:" + h.pct + "%" }))]),
              ui.el("a", { href: "#/mcrlib/" + h.mcr.id }, h.mcr.name)]));
          });
        }
        row.appendChild(detail);
        return row;
      }

      function act(s, status, extra) {
        var row = {
          rauId: r.id, eventId: s.ev.id, status: status, score: s.pct,
          by: ctx.state.get("role") + " (session)", date: fmt.today()
        };
        if (extra) Object.keys(extra).forEach(function (k) { row[k] = extra[k]; });
        if (status === "confirmed" && s.ev.side === "compliance") {
          var mc = eng.mcrCandidates(r, s.ev.id);
          row.mcrIds = mc.head.filter(function (h) { return h.pct >= eng.rubric().bands.likely; }).slice(0, 8).map(function (h) { return h.mcr.id; });
        }
        data.addRegister(row);
        GRC.traceAction(2, status === "confirmed" ? "Confirming a risk" : "Rejecting a candidate");
        if (r.riskIdStatus === "not-started") r.riskIdStatus = "in-progress";
        ui.toast(s.ev.name + " " + status + (row.mcrIds ? " with " + row.mcrIds.length + " suggested MCRs attached" : "") + ".");
        draw();
      }

      wrap.appendChild(zoneBlock("Likely applicable", "likely", z.likely,
        "score >= " + eng.rubric().bands.likely + ": confirm, or reject with rationale",
        function (s) {
          return ui.el("span", { class: "g-row" }, [
            ui.el("button", { class: "g-btn sm g-btn--primary", onclick: function (e) { e.stopPropagation(); act(s, "confirmed"); } }, "Confirm"),
            ui.el("button", { class: "g-btn sm", onclick: function (e) {
              e.stopPropagation();
              var why = prompt("Rejecting a LIKELY candidate needs a rationale (kept on the record):");
              if (why) act(s, "rejected", { rationale: why });
            } }, "Reject")]);
        }));

      var middleShown = showAllMiddle ? z.middle : z.middle.slice(0, 10);
      wrap.appendChild(zoneBlock("Ambiguous middle", "middle", middleShown,
        "score " + eng.rubric().bands.possible + "-" + (eng.rubric().bands.likely - 1) + ": resolve with targeted questions to push it out of the middle" + (z.middle.length > 10 && !showAllMiddle ? " (top 10 of " + z.middle.length + " shown)" : ""),
        function (s) {
          return ui.el("span", { class: "g-row" }, [
            ui.el("button", { class: "g-btn sm g-btn--primary", onclick: function (e) { e.stopPropagation(); resolveDrawer(s); } }, "Resolve"),
            ui.el("button", { class: "g-btn sm", onclick: function (e) { e.stopPropagation(); act(s, "confirmed", { rationale: "Owner judgment: confirmed from the middle band." }); } }, "Confirm anyway")]);
        }));

      if (z.middle.length > 10) {
        wrap.appendChild(ui.el("div", { style: "margin:-8px 0 14px 16px" },
          ui.el("button", { class: "g-btn sm", onclick: function () { showAllMiddle = !showAllMiddle; draw(); } },
            showAllMiddle ? "Show top 10 only" : "Show all " + z.middle.length + " in the middle")));
      }
      wrap.appendChild(zoneBlock("Unlikely", "unlikely", z.unlikely.slice(0, 12),
        "score < " + eng.rubric().bands.possible + ": bulk dismiss with sampling review (" + z.unlikely.length + " total, first 12 shown)",
        function (s) {
          return ui.el("button", { class: "g-btn sm", onclick: function (e) { e.stopPropagation(); act(s, "rejected", { rationale: "Below applicability floor." }); } }, "Dismiss");
        }));
      if (z.unlikely.length) {
        wrap.appendChild(ui.el("div", { style: "margin:-6px 0 14px" },
          ui.el("button", { class: "g-btn", onclick: function () {
            z.unlikely.forEach(function (s) { data.addRegister({ rauId: r.id, eventId: s.ev.id, status: "rejected", score: s.pct, by: ctx.state.get("role") + " (session)", date: fmt.today(), rationale: "Bulk dismissal below floor." }); });
            if (!z.likely.length && !z.middle.length) r.riskIdStatus = "complete";
            ui.toast(z.unlikely.length + " unlikely candidates dismissed.");
            draw();
          } }, "Dismiss all " + z.unlikely.length + " unlikely candidates")));
      }

      /* dispositioned */
      if (done.length) {
        var db = ui.el("div");
        done.sort(function (a, b) { return b.s.pct - a.s.pct; });
        db.appendChild(ui.table({
          cols: [
            { key: "n", label: "Event", render: function (x) { return ui.el("a", { href: "#/events/" + x.s.ev.id }, x.s.ev.name); } },
            { key: "t", label: "Type", render: function (x) { return x.s.ev.side === "compliance" ? ui.badge("Compliance", "info") : ui.badge("Operational", ""); } },
            { key: "score", label: "Score", num: true, render: function (x) { return String(x.d.score); } },
            { key: "st", label: "Decision", render: function (x) { return ui.badge(x.d.status, x.d.status === "confirmed" ? "ok" : ""); } },
            { key: "mcr", label: "MCRs", num: true, render: function (x) { return x.d.mcrIds ? String(x.d.mcrIds.length) : "-"; } },
            { key: "why", label: "Rationale", render: function (x) { return x.d.rationale ? ui.el("span", { class: "g-muted", style: "font-size:12px" }, x.d.rationale) : "-"; } }
          ], rows: done, page: 12
        }));
        wrap.appendChild(ui.card({ title: "Dispositioned (" + done.length + ")", body: db }));
      }
      if (!z.likely.length && !z.middle.length && !z.unlikely.length && done.length) {
        if (r.riskIdStatus !== "complete") {
          r.riskIdStatus = "complete";
        }
        wrap.appendChild(ui.el("div", { class: "g-card", style: "border-left:4px solid var(--g-ok)" },
          ui.el("div", {}, [ui.badge("Risk ID complete", "ok"), ui.el("span", { style: "margin-left:8px" }, "Every candidate dispositioned. ORBO/BACO challenge happens in RCSA administration (Capability 5).")])));
      }
    }

    /* ==SECTION:resolve== */
    function resolveDrawer(s) {
      var qs = ctx.engine.questionsFor(r, s.ev);
      var before = s.pct;
      var body = ui.el("div");
      body.appendChild(ui.el("p", {}, "These questions target the rubric categories where \"" + s.ev.name + "\" sits in the uncertain middle. Answers update this RAU's metadata, so every candidate on the workbench rescores consistently, not just this one."));
      if (!qs.length) {
        body.appendChild(ui.empty("No unanswered questions apply. Use owner judgment: confirm or reject with rationale."));
      }
      var dr;
      qs.forEach(function (q) {
        var line = ui.el("div", { class: "g-card", style: "padding:10px 14px" }, [
          ui.el("div", { style: "margin-bottom:8px" }, q.text),
          ui.el("div", { class: "g-row" }, [
            ui.el("button", { class: "g-btn sm g-btn--primary", onclick: function () { answer(q, true, line); } }, "Yes"),
            ui.el("button", { class: "g-btn sm", onclick: function () { answer(q, false, line); } }, "No")])]);
        body.appendChild(line);
      });
      var outcome = ui.el("div");
      body.appendChild(outcome);
      function answer(q, yes, line) {
        ctx.engine.answer(r, q, yes);
        GRC.traceAction(2, "Resolving applicability");
        line.style.opacity = "0.55";
        line.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
        var after = ctx.engine.score(r, s.ev);
        outcome.innerHTML = "";
        outcome.appendChild(ui.el("div", { class: "g-card", style: "border-left:4px solid var(--g-accent)" }, [
          ui.el("div", { class: "g-row" }, [
            ui.el("span", {}, "Score moved: "),
            ui.el("b", {}, before + " -> " + after.pct),
            ui.badge(ctx.fmt.band(after.band), ctx.fmt.bandKind(after.band)),
            ui.el("span", { class: "g-muted", style: "font-size:12px" }, "recorded as survey answer with provenance \"you answered\"")]),
          after.band !== "possible" ? ui.el("div", { style: "margin-top:8px" },
            ui.el("button", { class: "g-btn sm g-btn--primary", onclick: function () { dr.close(); draw(); } }, "Out of the middle. Return to workbench")) : null]));
      }
      dr = ui.drawer({ title: "Resolve: " + s.ev.name + " (currently " + before + ")", body: body, onclose: function () { draw(); } });
    }
    draw();
  }

  GRC.register({
    id: "riskid", version: "1.2.0", tab: "RCSA",
    caps: {
      "riskid": { primary: [2], uses: [1] },
      "riskid/:rauId": { primary: [2], uses: [1], feeds: [3, 5] }
    },
    rail: [{ label: "2. Risk identification", route: "riskid", order: 20 }],
    routes: { "riskid": landing, "riskid/:rauId": workbench }
  });
})();
