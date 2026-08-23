/* GRC modules/intake.js v1.0.1 2026-08-23 */
/* Capability 1 front end: the RAU change-request pipeline (new / merge /
   split / retire), the intake wizard with assistant, the uniqueness +
   category review gate, and governance approval. */
(function () {
  "use strict";
  var GOV = "RCSA RAU Governance";

  function isGov(ctx) { return ctx.state.get("role") === GOV; }
  function govHint(ctx, ui) {
    return ui.el("p", { class: "g-muted", style: "font-size:12.5px" },
      "Decisions here belong to the RCSA RAU Governance team. Switch the banner \"View as\" to \"" + GOV + "\" to act.");
  }

  /* ==SECTION:board== */
  function board(el, ctx) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    var reqs = data.all("requests");
    el.appendChild(ui.el("div", { class: "g-page-head" }, [
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "RAU pipeline"),
        ui.el("div", { class: "g-muted" }, "Every change to the RAU inventory - new, merge, split, retire - moves through the same governed pipeline. One workflow, no side doors.")]),
      ui.el("div", { class: "sp" }),
      ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { ctx.go("pipeline/new"); } }, "+ New request")]));
    el.appendChild(ui.table({
      cols: [
        { key: "id", label: "Request", render: function (q) { return ui.el("span", { class: "g-mono" }, q.id); } },
        { key: "type", label: "Type", render: function (q) { return ui.badge(q.type.toUpperCase(), q.type === "new" ? "info" : q.type === "retire" ? "bad" : "warn"); } },
        { key: "proposedName", label: "Name", sort: true },
        { key: "sub", label: "LOB / SubLOB", render: function (q) { var p = data.orgPath(q.subLobId); return p.lob + " > " + p.sub; } },
        { key: "stage", label: "Stage", sort: true, render: function (q) { return ui.badge(fmt.stage(q.stage), fmt.stageKind(q.stage)); } },
        { key: "requester", label: "Requester" },
        { key: "submitted", label: "Submitted", sort: true, render: function (q) { return fmt.date(q.submitted); } },
        { key: "note", label: "Latest", render: function (q) { return q.note ? ui.el("span", { class: "g-muted", style: "font-size:12px" }, q.note) : "-"; } }
      ],
      rows: reqs, page: 20,
      onRow: function (q) { ctx.go("pipeline/" + q.id); }
    }));
  }

  /* ==SECTION:similarity== */
  /* Live uniqueness scoring: token + service overlap against same-LOB RAUs.
     Real computation on real input - the demo's "AI analysis" is honest math. */
  function tokenize(s) {
    return String(s || "").toLowerCase().split(/[^a-z0-9]+/).filter(function (w) { return w.length > 3 && ["with", "from", "that", "this", "into", "processing", "operations", "services"].indexOf(w) < 0; });
  }
  function similarity(ctx, req) {
    var data = ctx.data;
    var lobId = data.orgPath(req.subLobId).lobId;
    var reqTok = tokenize(req.proposedName + " " + (req.bullets || []).join(" ") + " " + (req.description || ""));
    var out = [];
    data.all("raus").forEach(function (r) {
      if (data.orgPath(r.subLobId).lobId !== lobId) return;
      var shared = (r.serviceIds || []).filter(function (s) { return (req.serviceIds || []).indexOf(s) >= 0; });
      var rTok = tokenize(r.name + " " + r.description);
      var tokShared = reqTok.filter(function (t) { return rTok.indexOf(t) >= 0; });
      var svcScore = req.serviceIds && req.serviceIds.length ? (shared.length / Math.max(1, Math.min(req.serviceIds.length, (r.serviceIds || []).length))) : 0;
      var tokScore = reqTok.length ? tokShared.length / Math.max(3, reqTok.length) : 0;
      var pct = Math.round(58 * svcScore + 52 * Math.min(1, tokScore * 2.2));
      pct = Math.min(96, pct);
      if (pct >= 25) {
        var reasons = [];
        if (shared.length) reasons.push("Shares services: " + shared.map(function (s) { return data.svcName(s); }).join(", "));
        if (tokShared.length) reasons.push("Shared language: \"" + tokShared.slice(0, 4).join("\", \"") + "\"");
        reasons.push("Same Line of Business");
        out.push({ rauId: r.id, score: pct, reasons: reasons });
      }
    });
    out.sort(function (a, b) { return b.score - a.score; });
    return out.slice(0, 5);
  }
  function categoryCheck(ctx, req) {
    var data = ctx.data;
    var lobsUsing = {};
    data.all("raus").forEach(function (r) {
      var hit = (r.serviceIds || []).some(function (s) { return (req.serviceIds || []).indexOf(s) >= 0; });
      if (hit) lobsUsing[data.orgPath(r.subLobId).lobId] = true;
    });
    var spread = Object.keys(lobsUsing).length;
    var lobName = data.orgPath(req.subLobId).lob;
    var suggested = "business-service", why;
    if (lobName === "Enterprise Functions") { suggested = "enterprise"; why = "The SubLOB sits in Enterprise Functions, which houses enterprise-level activity."; }
    else if (lobName === "Technology & Shared Services" || spread >= 5) { suggested = "shared-services"; why = "The selected services are performed across " + spread + " lines of business, a shared-services pattern."; }
    else { why = "The selected services concentrate in " + lobName + "; the work reads as line-of-business processing."; }
    var conf = suggested === req.category ? 80 + Math.min(15, spread * 2) : 62 + Math.min(20, spread * 3);
    return { selected: req.category, suggested: suggested, confidence: conf, rationale: why };
  }

  /* ==SECTION:wizard== */
  function wizard(el, ctx) {
    var ui = ctx.ui, data = ctx.data;
    var model = { type: "new", lobId: "", subLobId: "", category: "business-service", proposedName: "", description: "", bulletsText: "", serviceIds: [] };
    var msgs = [{ who: "assistant", text: "I will help you describe this RAU. Pick the business placement and the services it performs from the common catalog, then list the high-level steps of the process - one per line. I will ask questions if I need more to analyze uniqueness." }];
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [ui.el("div", { class: "g-h1" }, "New RAU request: intake"),
      ui.el("div", { class: "g-muted" }, "Step 1 of the pipeline. On submit, the assistant analyzes uniqueness within the Line of Business and checks the category; the RCSA RAU Governance team reviews its findings.")])));
    var form = ui.el("div");
    var chatWrap = ui.el("div");
    el.appendChild(ui.el("div", { class: "g-split", style: "grid-template-columns:3fr 2fr" }, [form, chatWrap]));

    function svcPicker() {
      var box = ui.el("div", { style: "max-height:220px;overflow:auto;border:1px solid var(--g-line);border-radius:6px;padding:8px 10px;background:#fff" });
      data.all("services").filter(function (s) { return s.level === 3; }).forEach(function (s) {
        var cb = ui.el("input", { type: "checkbox", onchange: function () {
          var i = model.serviceIds.indexOf(s.id);
          if (cb.checked && i < 0) model.serviceIds.push(s.id);
          if (!cb.checked && i >= 0) model.serviceIds.splice(i, 1);
        } });
        box.appendChild(ui.el("label", { style: "display:flex;gap:8px;align-items:center;padding:2px 0;font-size:13px", title: data.svcPath(s.id) }, [cb, s.name, ui.el("span", { class: "g-muted", style: "font-size:11px" }, data.svcPath(s.id).split(" > ")[0])]));
      });
      return box;
    }
    function field(label, node) { return ui.el("div", { style: "margin-bottom:12px" }, [ui.el("div", { class: "g-label", style: "margin-bottom:4px" }, label), node]); }
    var lobSel = ui.select({ options: [{ value: "", label: "Select..." }].concat(data.lobs().map(function (l) { return { value: l.id, label: l.name }; })), onchange: function (v) { model.lobId = v; model.subLobId = ""; drawSub(); } });
    var subWrap = ui.el("span");
    function drawSub() {
      subWrap.innerHTML = "";
      subWrap.appendChild(ui.select({
        options: [{ value: "", label: "Select..." }].concat(data.subLobs().filter(function (s) { return s.parentId === model.lobId; }).map(function (s) { return { value: s.id, label: s.name }; })),
        onchange: function (v) { model.subLobId = v; }
      }));
    }
    drawSub();
    form.appendChild(ui.card({
      title: "Intake form", body: ui.el("div", {}, [
        field("Line of Business", lobSel), field("SubLOB (the RAU is created at this level)", subWrap),
        field("RAU category", ui.select({
          value: model.category, onchange: function (v) { model.category = v; },
          options: [{ value: "business-service", label: "Business Service RAU" }, { value: "shared-services", label: "Shared Services RAU" }, { value: "enterprise", label: "Enterprise RAU" }]
        })),
        field("Proposed RAU name", ui.el("input", { class: "g-input", style: "width:100%", oninput: function (e) { model.proposedName = e.target.value; } })),
        field("Description", ui.el("textarea", { class: "g-input", rows: "3", style: "width:100%", oninput: function (e) { model.description = e.target.value; } })),
        field("High-level process steps (one bullet per line, 3+)", ui.el("textarea", { class: "g-input", rows: "5", style: "width:100%", placeholder: "Receive and validate requests\nApprove and release funding\nReconcile and report", oninput: function (e) { model.bulletsText = e.target.value; } })),
        field("Services performed (select all that apply)", svcPicker()),
        ui.el("div", { class: "g-row" }, [
          ui.el("button", { class: "g-btn g-btn--primary", onclick: submit }, "Submit for uniqueness analysis"),
          ui.el("button", { class: "g-btn", onclick: function () { ctx.go("pipeline"); } }, "Cancel")])])
    }));
    function drawChat() {
      chatWrap.innerHTML = "";
      chatWrap.appendChild(ui.card({ title: "Assistant", body: ui.chat({ messages: msgs }) }));
    }
    drawChat();
    function submit() {
      var bullets = model.bulletsText.split("\n").map(function (b) { return b.trim(); }).filter(Boolean);
      if (!model.subLobId || !model.proposedName) { msgs.push({ who: "assistant", text: "I still need the business placement (LOB and SubLOB) and a proposed name before I can analyze this." }); drawChat(); return; }
      if (bullets.length < 3) { msgs.push({ who: "assistant", text: "Give me at least three high-level steps - what happens first, what is the core processing, and how does it end? Absence of steps is exactly what creates duplicate RAUs." }); drawChat(); return; }
      if (!model.serviceIds.length) { msgs.push({ who: "assistant", text: "Select at least one service from the catalog. Services are how I compare this request against the existing " + data.all("raus").length + " RAUs consistently." }); drawChat(); return; }
      var req = {
        id: "RCR-" + String(9000 + data.all("requests").length), type: "new", stage: "uniqueness-review",
        proposedName: model.proposedName, subLobId: model.subLobId, category: model.category,
        requester: "You (this session)", submitted: ctx.fmt.today(),
        serviceIds: model.serviceIds.slice(), description: model.description, bullets: bullets,
        assistant: msgs.slice(1), uniqueness: null
      };
      var sims = similarity(ctx, req);
      var cat = categoryCheck(ctx, req);
      var top = sims.length ? sims[0].score : 0;
      req.uniqueness = {
        similar: sims, category: cat,
        recommendation: top >= 70 ? "return-for-refinement" : top >= 40 ? "reviewer-judgment" : "advance",
        rationaleText: top >= 70 ?
          "The described work overlaps " + top + "% with an existing RAU in the same Line of Business. Recommend the requester establish differentiation or absorb this scope." :
          top >= 40 ? "Moderate overlap (" + top + "%) with existing work. Reviewer judgment recommended - the similar RAUs are listed with reasons." :
            "No significant overlap found within the Line of Business (top match " + top + "%). The described process appears unique."
      };
      data.all("requests").unshift(req);
      ui.toast("Submitted. The analysis is attached for RCSA RAU Governance review.");
      ctx.go("pipeline/" + req.id);
    }
  }

  /* ==SECTION:detail== */
  function detail(el, ctx, params) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    var q = data.byId("requests", params.id);
    if (!q) { el.appendChild(ui.empty("Unknown request " + params.id)); return; }
    el.appendChild(ui.el("div", { class: "g-page-head" }, [
      ui.el("div", {}, [
        ui.el("div", { class: "g-row" }, [
          ui.el("span", { class: "g-h1" }, q.proposedName),
          ui.el("span", { class: "g-mono g-muted" }, q.id),
          ui.badge(q.type.toUpperCase(), q.type === "new" ? "info" : "warn"),
          ui.badge(fmt.stage(q.stage), fmt.stageKind(q.stage))]),
        ui.el("div", { class: "g-muted" }, data.orgPath(q.subLobId).lob + " > " + data.orgPath(q.subLobId).sub + ", requested by " + q.requester + " on " + fmt.date(q.submitted))]),
      ui.el("div", { class: "sp" }),
      q.stage === "process-mapping" || q.stage === "standards-check" ? ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { ctx.go("pipeline/" + q.id + "/map"); } }, "Open map builder") : null,
      q.stage === "metadata-creation" ? ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { ctx.go("pipeline/" + q.id + "/survey"); } }, "Open metadata survey") : null]));

    var left = ui.el("div");
    left.appendChild(ui.card({
      title: "Request", body: ui.el("div", {}, [
        ui.kv([["Category", fmt.cat(q.category)], ["Description", q.description || "-"],
        ["Services", q.serviceIds && q.serviceIds.length ? ui.el("span", {}, q.serviceIds.map(function (s) { return ui.pill(data.svcName(s)); })) : "-"],
        q.note ? ["Latest note", q.note] : null]),
        q.bullets && q.bullets.length ? ui.el("div", { style: "margin-top:10px" }, [
          ui.el("div", { class: "g-label" }, "High-level steps from intake"),
          ui.el("ol", { style: "margin:6px 0 0;padding-left:20px" }, q.bullets.map(function (b) { return ui.el("li", {}, b); }))]) : null])
    }));
    if (q.impact) {
      left.appendChild(ui.card({
        title: "Impact preview (computed from live links)", body: ui.el("div", {}, [
          ui.el("p", {}, q.impact.note),
          ui.kv([["Confirmed risks affected", String(q.impact.risks)], ["Handoffs affected", String(q.impact.handoffs)],
          ["Target RAU(s)", ui.el("span", {}, (q.targetRauIds || []).map(function (id) { var r = data.byId("raus", id); return ui.el("a", { href: "#/raus/" + id, style: "margin-right:10px" }, r ? r.id + " " + r.name : id); }))]])])
      }));
    }
    if (q.assistant && q.assistant.length) {
      left.appendChild(ui.card({ title: "Assistant transcript (intake)", body: ui.chat({ messages: q.assistant }) }));
    }
    var right = ui.el("div");
    if (q.uniqueness) { right.appendChild(uniquenessCard(ctx, q)); }
    else if (q.stage === "pending-governance") { right.appendChild(governanceCard(ctx, q)); }
    else { right.appendChild(ui.card({ title: "Where this sits", body: stageExplain(ui, q) })); }
    if (q.uniqueness && q.stage === "pending-governance") right.appendChild(governanceCard(ctx, q));
    el.appendChild(ui.el("div", { class: "g-split" }, [left, right]));
  }
  function stageExplain(ui, q) {
    var map = {
      "draft-intake": "The requester is still assembling the intake with the assistant.",
      "process-mapping": "The requester is expanding each intake bullet into 2-10 detailed steps in the map builder, identifying handoffs to and from other RAUs.",
      "standards-check": "The assistant is validating the map against process-mapping standards. All checks must pass before governance.",
      "returned-for-refinement": "Returned to the requester with comments. It re-enters uniqueness review when resubmitted.",
      "metadata-creation": "The RAU is finalized (roles assigned). The assistant is completing the standardized metadata survey from the process map, asking the owner team what it cannot conclude.",
      "declined": "Declined with a redirect to the overlapping RAU's owner."
    };
    return ui.el("p", { class: "g-muted" }, map[q.stage] || "In the pipeline.");
  }

  /* ==SECTION:uniqueness== */
  function uniquenessCard(ctx, q) {
    var ui = ctx.ui, data = ctx.data;
    var u = q.uniqueness;
    var body = ui.el("div");
    body.appendChild(ui.el("div", { class: "g-label" }, "Assistant recommendation"));
    body.appendChild(ui.el("p", { style: "margin:4px 0 10px" }, [
      ui.badge(u.recommendation === "advance" ? "Advance" : u.recommendation === "return-for-refinement" ? "Return for refinement" : "Reviewer judgment", u.recommendation === "advance" ? "ok" : u.recommendation === "return-for-refinement" ? "bad" : "warn"),
      ui.el("span", { style: "display:block;margin-top:6px" }, u.rationaleText)]));
    body.appendChild(ui.el("div", { class: "g-label" }, "Similar RAUs in this Line of Business"));
    if (!u.similar.length) body.appendChild(ui.el("p", { class: "g-muted" }, "None above the 25% floor."));
    u.similar.forEach(function (s) {
      var r = data.byId("raus", s.rauId);
      body.appendChild(ui.el("div", { style: "border:1px solid var(--g-line);border-radius:6px;padding:8px 10px;margin:6px 0;background:#fff" }, [
        ui.el("div", { class: "g-row" }, [
          ui.el("span", { class: "g-score" }, [String(s.score) + "%", ui.el("i", {}, ui.el("b", { style: "width:" + s.score + "%" }))]),
          ui.el("a", { href: "#/raus/" + s.rauId }, r ? r.id + " - " + r.name : s.rauId)]),
        ui.el("ul", { style: "margin:4px 0 0;padding-left:18px;font-size:12.5px;color:var(--g-muted)" },
          s.reasons.map(function (x) { return ui.el("li", {}, x); }))]));
    });
    var c = u.category;
    body.appendChild(ui.el("div", { class: "g-label", style: "margin-top:12px" }, "Category check"));
    body.appendChild(ui.el("p", { style: "margin:4px 0 10px" }, [
      ui.el("span", {}, "Selected: "), ui.badge(ctx.fmt.cat(c.selected), "info"), ui.el("span", {}, "  Assistant suggests: "),
      ui.badge(ctx.fmt.cat(c.suggested), c.suggested === c.selected ? "ok" : "warn"),
      ui.el("span", { class: "g-muted" }, " (" + c.confidence + "% confidence)"),
      ui.el("span", { style: "display:block;margin-top:4px;font-size:13px" }, c.rationale)]));
    if (q.stage === "uniqueness-review") {
      if (isGov(ctx)) {
        var redirTarget = u.similar.length ? u.similar[0].rauId : null;
        body.appendChild(ui.el("div", { class: "g-row", style: "margin-top:10px" }, [
          ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { q.stage = "process-mapping"; q.note = "Advanced by governance on " + ctx.fmt.today(); ui.toast(q.id + " advanced to process mapping."); ctx.go("pipeline/" + q.id); } }, "Advance to mapping"),
          ui.el("button", { class: "g-btn", onclick: function () { q.stage = "returned-for-refinement"; q.note = "Returned " + ctx.fmt.today() + ": establish differentiation from the similar RAU(s)."; ui.toast(q.id + " returned to the requester."); ctx.go("pipeline/" + q.id); } }, "Return with comments"),
          redirTarget ? ui.el("button", { class: "g-btn", onclick: function () {
            var r = ctx.data.byId("raus", redirTarget);
            q.stage = "declined"; q.note = "Declined " + ctx.fmt.today() + " - redirected to " + (r ? r.roles.owner : "the owner") + " of " + redirTarget + " to discuss overlap.";
            ui.toast(q.id + " declined with redirect to " + redirTarget + "."); ctx.go("pipeline/" + q.id);
          } }, "Decline + redirect to overlap owner") : null]));
      } else {
        body.appendChild(govHint(ctx, ui));
      }
    }
    return ui.card({ title: "Uniqueness review: assistant analysis, human decision", body: body });
  }

  /* ==SECTION:governance== */
  function governanceCard(ctx, q) {
    var ui = ctx.ui;
    var body = ui.el("div");
    body.appendChild(ui.el("p", {}, "All standards passed. Approving finalizes " + (q.type === "new" ? "the RAU with its completed process map and assigns the five roles (Owner, Delegate, BCM Contact, ORBO, BACO); the request then moves to metadata creation." : "this " + q.type + " request and applies the impact shown.")));
    if (isGov(ctx)) {
      body.appendChild(ui.el("div", { class: "g-row" }, [
        ui.el("button", { class: "g-btn g-btn--primary", onclick: function () {
          if (q.type === "new") { q.stage = "metadata-creation"; q.note = "Approved " + ctx.fmt.today() + "; roles assigned; metadata survey opened."; }
          else { q.stage = "approved"; q.note = "Approved and applied " + ctx.fmt.today() + " (demo: inventory change simulated)."; }
          ui.toast(q.id + " approved by RCSA RAU Governance.");
          ctx.go("pipeline/" + q.id);
        } }, "Approve"),
        ui.el("button", { class: "g-btn", onclick: function () { q.stage = "returned-for-refinement"; q.note = "Sent back by governance " + ctx.fmt.today(); ctx.go("pipeline/" + q.id); } }, "Send back")]));
    } else body.appendChild(govHint(ctx, ui));
    return ui.card({ title: "Governance approval", body: body });
  }

  GRC.register({
    id: "intake", version: "1.0.1", tab: "RCSA",
    rail: [{ label: "RAU pipeline", route: "pipeline", order: 30 }],
    routes: { "pipeline": board, "pipeline/new": wizard, "pipeline/:id": detail }
  });
})();
