/* GRC modules/mapbuilder.js v1.1.0 2026-08-23 */
/* Capability 1: the guided process-map builder (with coach + standards
   lint) and the assistant-driven metadata survey completion. */
(function () {
  "use strict";

  /* ==SECTION:coach== */
  function coachMsgs(q) {
    var msgs = [];
    var steps = 0, decisions = 0, handoffs = 0, thin = [];
    (q.map.phases || []).forEach(function (p) {
      steps += p.steps.length;
      if (p.steps.length < 2) thin.push(p.name);
      p.steps.forEach(function (s) {
        if (s.type === "decision") decisions++;
        if (s.type === "handoff-in" || s.type === "handoff-out") handoffs++;
      });
    });
    if (!steps) msgs.push("Let's expand your first bullet. What is the very first thing that happens - where does the work arrive from?");
    if (thin.length && steps) msgs.push("\"" + thin[0] + "\" has fewer than 2 steps. What happens between the start and end of that phase?");
    if (steps >= 3 && !decisions) msgs.push("I do not see a decision point yet. What happens when an item fails validation or needs approval? Add it as a Decision step.");
    if (steps >= 4 && !handoffs && !q.noHandoffs) msgs.push("No handoffs identified. Does anything arrive from another RAU, or get delivered to one? If truly none, attest that below - it is an unusual pattern worth confirming.");
    if (steps >= 6 && decisions && (handoffs || q.noHandoffs)) msgs.push("This is shaping up well. Check the standards panel - once everything is green you can run the formal standards check.");
    return msgs.length ? msgs : ["Keep going. Add steps with the form under each phase."];
  }

  /* ==SECTION:lint== */
  function lint(q) {
    var rules = [];
    var phases = q.map.phases || [];
    var allSized = phases.length > 0 && phases.every(function (p) { return p.steps.length >= 2 && p.steps.length <= 10; });
    rules.push({ id: "L1", label: "Every intake bullet expanded to 2-10 steps", pass: allSized });
    var handoffs = 0, decisions = 0, badHandoff = 0;
    phases.forEach(function (p) {
      p.steps.forEach(function (s) {
        if (s.type === "handoff-in" || s.type === "handoff-out") { handoffs++; if (!s.cp) badHandoff++; }
        if (s.type === "decision") decisions++;
      });
    });
    rules.push({ id: "L2", label: "Handoffs identified with named counterparty RAU, or attested none", pass: (handoffs > 0 && badHandoff === 0) || q.noHandoffs === true });
    rules.push({ id: "L3", label: "At least one decision point, or process attested linear", pass: decisions > 0 || q.linear === true });
    rules.push({ id: "L4", label: "Steps written as actions (start with a verb)", pass: phases.every(function (p) { return p.steps.every(function (s) { return /^[A-Z]?[a-z]+/.test(s.text) && s.text.split(" ").length >= 2; }); }) });
    rules.push({ id: "L5", label: "Process has a clear start and end", pass: phases.length >= 2 || (phases[0] && phases[0].steps.length >= 4) });
    return rules;
  }

  /* ==SECTION:builder== */
  function builder(el, ctx, params) {
    var ui = ctx.ui, data = ctx.data;
    var q = data.byId("requests", params.id);
    if (!q) { el.appendChild(ui.empty("Unknown request")); return; }
    if (!q.map) {
      q.map = { phases: (q.bullets || ["Intake", "Process", "Complete"]).map(function (b) { return { name: b, steps: [] }; }) };
    }
    var stepN = 0;
    q.map.phases.forEach(function (p) { p.steps.forEach(function () { stepN++; }); });

    el.appendChild(ui.el("div", { class: "g-page-head" }, [
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "Process map builder: " + q.proposedName),
        ui.el("div", { class: "g-muted" }, "Each intake bullet becomes a phase; expand each into 2-10 steps. Mark every handoff where this process receives from or provides to another RAU. The assistant coaches; the standards check gates.")]),
      ui.el("div", { class: "sp" }),
      ui.el("button", { class: "g-btn", onclick: function () { ctx.go("pipeline/" + q.id); } }, "Back to request")]));

    var mapCol = ui.el("div");
    var sideCol = ui.el("div");
    el.appendChild(ui.el("div", { class: "g-split", style: "grid-template-columns:3fr 2fr" }, [mapCol, sideCol]));

    function renumber() {
      var n = 1;
      q.map.phases.forEach(function (p) { p.steps.forEach(function (s) { s.n = n++; }); });
    }
    function draw() {
      renumber();
      mapCol.innerHTML = ""; sideCol.innerHTML = "";
      mapCol.appendChild(ui.card({ title: "Live diagram (draws itself as you add steps)", body: window.GRC.mapDiagram(ctx, q.map) }));
      q.map.phases.forEach(function (p) {
        var box = ui.el("div", { class: "map-phase" });
        box.appendChild(ui.el("div", { class: "ph" }, p.name + "  (" + p.steps.length + " steps)"));
        p.steps.forEach(function (s, si) {
          var cls = s.type === "decision" ? "decision" : s.type === "handoff-in" ? "h-in" : s.type === "handoff-out" ? "h-out" : "";
          box.appendChild(ui.el("div", { class: "map-step " + cls }, [
            ui.el("div", { class: "n" }, String(s.n)),
            ui.el("div", { style: "flex:1" }, [
              ui.el("div", {}, s.text),
              (s.type !== "task") ? ui.el("div", { style: "font-size:12px;margin-top:2px" }, [
                ui.badge(s.type === "decision" ? "Decision" : s.type === "handoff-in" ? "Receives from" : "Provides to", s.type === "decision" ? "warn" : "info"),
                s.cp ? ui.el("span", {}, [" ", ui.el("a", { href: "#/raus/" + s.cp }, s.cp)]) : null]) : null]),
            ui.el("button", { class: "g-btn sm", onclick: function () { p.steps.splice(si, 1); draw(); } }, "Remove")]));
        });
        /* add-step form */
        var txt = ui.el("input", { class: "g-input", style: "flex:1;min-width:180px", placeholder: "Describe the step (start with a verb)..." });
        var typeSel = ui.select({ options: [{ value: "task", label: "Task" }, { value: "decision", label: "Decision" }, { value: "handoff-in", label: "Handoff: receives from RAU" }, { value: "handoff-out", label: "Handoff: provides to RAU" }] });
        var cpIn = ui.el("input", { class: "g-input", style: "width:110px", placeholder: "RAU-####" });
        box.appendChild(ui.el("div", { style: "display:flex;gap:8px;padding:9px 12px;background:#fafbfc;flex-wrap:wrap" }, [
          txt, typeSel, cpIn,
          ui.el("button", { class: "g-btn sm", onclick: function () {
            var t = txt.value.trim(); if (!t) return;
            var type = typeSel.value || "task";
            var st = { n: 0, text: t, type: type };
            if (type === "handoff-in" || type === "handoff-out") {
              var cp = cpIn.value.trim().toUpperCase();
              if (data.byId("raus", cp)) st.cp = cp;
            }
            p.steps.push(st);
            GRC.traceAction(1, "Mapping a process step");
            draw();
          } }, "Add step")]));
        mapCol.appendChild(box);
      });

      /* coach */
      sideCol.appendChild(ui.card({
        title: "Assistant coach",
        body: ui.chat({ messages: coachMsgs(q).map(function (t) { return { who: "assistant", text: t }; }) })
      }));
      /* attestations + lint */
      var rules = lint(q);
      var allPass = rules.every(function (r) { return r.pass; });
      var lintBody = ui.el("div");
      rules.forEach(function (r) {
        lintBody.appendChild(ui.el("div", { class: "g-row", style: "padding:4px 0" }, [
          ui.badge(r.pass ? "PASS" : "OPEN", r.pass ? "ok" : "warn"),
          ui.el("span", { style: "font-size:13px" }, r.label)]));
      });
      var att1 = ui.el("input", { type: "checkbox", onchange: function (e) { q.noHandoffs = e.target.checked; draw(); } });
      att1.checked = !!q.noHandoffs;
      var att2 = ui.el("input", { type: "checkbox", onchange: function (e) { q.linear = e.target.checked; draw(); } });
      att2.checked = !!q.linear;
      lintBody.appendChild(ui.el("label", { class: "g-row", style: "margin-top:8px;font-size:12.5px" }, [att1, "I attest this process has no handoffs with other RAUs"]));
      lintBody.appendChild(ui.el("label", { class: "g-row", style: "font-size:12.5px" }, [att2, "I attest this process is linear (no decision branches)"]));
      lintBody.appendChild(ui.el("div", { style: "margin-top:10px" },
        ui.el("button", {
          class: "g-btn g-btn--primary", disabled: allPass ? null : "1",
          onclick: function () {
            q.stage = "pending-governance";
            q.note = "Standards check passed " + ctx.fmt.today() + ".";
            ui.toast("Standards check green. Routed to RCSA RAU Governance.");
            ctx.go("pipeline/" + q.id);
          }
        }, allPass ? "Run standards check and route to governance" : "Standards not yet met")));
      sideCol.appendChild(ui.card({ title: "Process mapping standards (demo checklist; the real standards plug in here)", body: lintBody }));
    }
    draw();
  }

  /* ==SECTION:survey== */
  function survey(el, ctx, params) {
    var ui = ctx.ui, data = ctx.data;
    var q = data.byId("requests", params.id);
    if (!q) { el.appendChild(ui.empty("Unknown request")); return; }
    if (!q.survey) {
      /* assistant prefill: derive what it can, leave the rest as questions */
      var qs = data.all("metaQuestions");
      q.survey = qs.map(function (mq, i) {
        var canDerive = i % 3 !== 1; /* deterministic: ~2/3 derivable */
        if (canDerive) {
          var yes = mq.tag ? (i % 4 === 0) : true; /* exclusions mostly confirmed */
          return { q: mq.id, v: yes && mq.tag ? "yes" : "no", src: i % 2 === 0 ? "map:" + (1 + (i % 8)) : "services" };
        }
        return { q: mq.id, v: null, src: null };
      });
    }
    var qs = data.all("metaQuestions");
    var byId = {}; qs.forEach(function (x) { byId[x.id] = x; });
    var wrap = ui.el("div");
    el.appendChild(wrap);
    function draw() {
      wrap.innerHTML = "";
      var open = q.survey.filter(function (a) { return a.v === null; });
      var done = q.survey.length - open.length;
      wrap.appendChild(ui.el("div", { class: "g-page-head" }, [
        ui.el("div", {}, [
          ui.el("div", { class: "g-h1" }, "RAU metadata survey: " + q.proposedName),
          ui.el("div", { class: "g-muted" }, "The assistant filled " + done + " of " + q.survey.length + " answers from the process map, services, and intake. It asks only what it cannot conclude. Most questions confirm what the RAU does NOT do; absence never shows on a process map.")]),
        ui.el("div", { class: "sp" }),
        ui.el("button", { class: "g-btn", onclick: function () { ctx.go("pipeline/" + q.id); } }, "Back to request")]));
      wrap.appendChild(ui.el("div", { style: "max-width:520px;margin-bottom:14px" }, [
        ui.progress(100 * done / q.survey.length),
        ui.el("div", { class: "g-muted", style: "font-size:12px;margin-top:4px" }, done + " of " + q.survey.length + " complete")]));
      if (open.length) {
        var ask = byId[open[0].q];
        wrap.appendChild(ui.card({
          title: "Assistant needs to know (" + open.length + " remaining)",
          body: ui.el("div", {}, [
            ui.chat({ messages: [{ who: "assistant", text: ask.text + (ask.excl ? " (I could not rule this in or out from the map.)" : " (The map does not make this explicit.)") }] }),
            ui.el("div", { class: "g-row", style: "margin-top:10px" }, [
              ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { open[0].v = "yes"; open[0].src = "user"; GRC.traceAction(1, "Answering the metadata survey"); draw(); } }, "Yes"),
              ui.el("button", { class: "g-btn", onclick: function () { open[0].v = "no"; open[0].src = "user"; GRC.traceAction(1, "Answering the metadata survey"); draw(); } }, "No")])])
        }));
      } else {
        wrap.appendChild(ui.card({
          title: "Survey complete",
          body: ui.el("div", {}, [
            ui.el("p", {}, "All " + q.survey.length + " questions answered. Completing metadata activates the RAU and opens Capability 2, where the applicability engine stack-ranks the risk event and MCR libraries against this metadata."),
            ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { activate(ctx, q); } }, "Complete metadata and activate RAU")])
        }));
      }
      /* answered list */
      var body = ui.el("div");
      q.survey.forEach(function (a) {
        if (a.v === null) return;
        var mq = byId[a.q];
        body.appendChild(ui.el("div", { class: "g-row", style: "padding:4px 0;border-bottom:1px solid var(--g-line-soft)" }, [
          ui.el("span", { class: "g-mono g-muted", style: "width:34px" }, mq.id),
          ui.el("span", { style: "flex:1;min-width:220px" }, mq.text),
          ui.el("span", { class: a.v === "yes" ? "ans-yes" : "ans-no" }, a.v.toUpperCase()),
          ui.el("span", { class: "provsrc" }, a.src === "user" ? "you answered" : a.src === "services" ? "derived from services" : "derived from map step " + String(a.src).slice(4))]));
      });
      wrap.appendChild(ui.card({ title: "Answers so far (with provenance)", body: body }));
    }
    function activate(ctx2, q2) {
      var qs2 = data.all("metaQuestions");
      var tags = [], excl = [];
      q2.survey.forEach(function (a) {
        var mq = qs2.filter(function (x) { return x.id === a.q; })[0];
        if (!mq) return;
        if (mq.tag && a.v === "yes") tags.push(mq.tag);
        if (mq.excl && a.v === "no") { /* "no we don't do it" = exclusion NOT confirmed? Convention: exclusion questions are phrased "confirm does NOT" so yes = excluded */ }
        if (mq.excl && a.v === "yes") excl.push(mq.excl);
      });
      tags.push("proc:payment-execution");
      var id = "RAU-" + String(9000 + data.all("raus").length);
      var rau = {
        id: id, name: q2.proposedName, subLobId: q2.subLobId, category: q2.category, stage: "active",
        description: q2.description || q2.proposedName, serviceIds: q2.serviceIds || [],
        roles: { owner: "You (this session)", delegate: "-", bcmContact: "-", orbo: "-", baco: "-" },
        fte: 25, locations: 1, annualVolume: 120000, priorLosses12m: 0, changeLevel: "medium",
        meta: { tags: tags, excl: excl }, riskIdStatus: "not-started",
        lastRcsaDate: null, profileUpdated: ctx2.fmt.today(),
        map: q2.map || null, mapSummary: null, metaAnswers: q2.survey.map(function (a) { return { q: a.q, v: a.v, src: a.src }; }),
        handoffs: []
      };
      data.all("raus").push(rau);
      q2.stage = "approved";
      q2.note = "RAU " + id + " activated " + ctx2.fmt.today() + ".";
      ctx2.ui.toast(id + " activated. Opening the applicability workbench. Capability 2 takes it from here.");
      ctx2.go("riskid/" + id);
    }
    draw();
  }

  GRC.register({
    id: "mapbuilder", version: "1.1.0", tab: "RCSA",
    caps: {
      "pipeline/:id/map": { primary: [1] },
      "pipeline/:id/survey": { primary: [1], feeds: [2] }
    },
    routes: { "pipeline/:id/map": builder, "pipeline/:id/survey": survey }
  });
})();
