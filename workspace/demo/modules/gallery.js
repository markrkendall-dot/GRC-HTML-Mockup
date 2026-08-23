/* GRC modules/gallery.js v1.1.0 2026-08-23 */
/* Feature gallery: curated, concrete examples of features to ship, grouped
   by theme and complexity. Each opens a live example. Keep / Discuss / Cut
   votes are stored with feedback and included in the export, so a room can
   agree on scope from one list. Two items are previews of later
   capabilities, built as small vignettes. */
(function () {
  "use strict";

  /* ==SECTION:vignette-data== */
  var CONTROL_CATALOG = [
    { id: "CTL-9001", name: "Dual authorization for disbursements above threshold", type: "Preventive", automation: "Manual" },
    { id: "CTL-9002", name: "Daily escrow sub-ledger reconciliation", type: "Detective", automation: "Automated" },
    { id: "CTL-9003", name: "Payee master data validation at setup", type: "Preventive", automation: "Automated" },
    { id: "CTL-9004", name: "Supervisor review of exception queue", type: "Detective", automation: "Manual" },
    { id: "CTL-9005", name: "System-enforced funding cutoff times", type: "Preventive", automation: "Automated" },
    { id: "CTL-9006", name: "Quarterly user access recertification", type: "Preventive", automation: "Manual" },
    { id: "CTL-9007", name: "Sanctions screening before funds release", type: "Preventive", automation: "Automated" },
    { id: "CTL-9008", name: "Monthly QA sampling of processed items", type: "Detective", automation: "Manual" }
  ];
  var assigned = null; /* session state for the control vignette */

  function findStory(data) {
    return data.all("raus").filter(function (r) { return r.name === "Escrow Administration"; })[0] || data.all("raus")[0];
  }
  function findReq(data, pred) { return data.all("requests").filter(pred)[0] || null; }

  /* ==SECTION:items== */
  function buildGroups(ctx) {
    var data = ctx.data;
    var story = findStory(data);
    var uq = findReq(data, function (q) { return q.stage === "uniqueness-review" && q.uniqueness; });
    var mapping = findReq(data, function (q) { return q.stage === "process-mapping"; });
    var meta = findReq(data, function (q) { return q.stage === "metadata-creation"; });
    var merge = findReq(data, function (q) { return q.type === "merge"; });
    function go(route, tip) {
      return function () { ctx.go(route); if (tip) setTimeout(function () { ctx.ui.toast(tip); }, 350); };
    }
    return [
      {
        theme: "Inventory and structure (Capability 1)", items: [
          { id: "gal-profile", tier: "Basic", title: "Look up a RAU and read its whole profile", what: "Demographics, the five assigned roles, services from the catalog, attributes, survey, process map, handoffs, and risks on one record.", show: go("raus/" + story.id, "Walk the tabs across the profile.") },
          { id: "gal-filter", tier: "Basic", title: "Cut the directory down to one line of business", what: "Filter the full inventory by LOB, category, change level, or risk identification status.", show: go("raus", "Use the toolbar filters. Every column header with an arrow sorts.") },
          { id: "gal-handoff", tier: "Standard", title: "Trace a handoff between two RAUs", what: "Every declared handoff names its counterparty and what moves; the counterparty confirms it afterward from My Work.", show: go("raus/" + story.id, "Open the Handoffs tab. Counterparties are links.") },
          merge ? { id: "gal-merge", tier: "Advanced", title: "Merge two RAUs with an impact preview", what: "Before governance approves a merge, the tool counts the risks and handoffs that would move.", show: go("pipeline/" + merge.id, "The impact panel is computed live from the links.") } : null
        ]
      },
      {
        theme: "Intake and governance (Capability 1)", items: [
          { id: "gal-intake", tier: "Basic", title: "Request a new RAU", what: "Business placement, services from the common catalog, and high-level steps. The assistant asks for what is missing before it will submit.", show: go("pipeline/new", "Try submitting with two bullets; the assistant pushes back.") },
          uq ? { id: "gal-unique", tier: "Standard", title: "Catch a duplicate RAU before it exists", what: "The assistant compares the request against every RAU in the line of business and recommends; the governance team decides, including decline with a redirect to the overlapping owner.", show: go("pipeline/" + uq.id, "Switch View as to RCSA RAU Governance to act on it.") } : null,
          mapping ? { id: "gal-map", tier: "Standard", title: "Draw a process map with coaching", what: "Bullets become phases; the coach prompts for decisions and handoffs; a standards checklist gates progression. No mapping expert needed.", show: go("pipeline/" + mapping.id + "/map", "Add a step and watch the coach and standards panel react.") } : null,
          meta ? { id: "gal-survey", tier: "Advanced", title: "The metadata survey fills itself, with receipts", what: "The assistant answers the standardized survey from the map and services, tags each answer with its source, and asks only what it cannot conclude. Completing it activates the RAU.", show: go("pipeline/" + meta.id + "/survey", "Answer the open questions, then activate the RAU.") } : null
        ]
      },
      {
        theme: "Risk identification (Capability 2)", items: [
          { id: "gal-confirm", tier: "Basic", title: "Confirm a likely risk in one click", what: "The engine puts high-scoring candidates in front of the owner team; confirming a compliance event attaches its suggested MCRs automatically.", show: go("riskid/" + story.id, "Likely items confirm in a click; middle items have Resolve.") },
          { id: "gal-assign-control", tier: "Basic", title: "Assign a new control to an existing risk instance", what: "Pick a control from the catalog and link it to a confirmed risk on a RAU. A preview of Capability 4 built on the same records.", show: go("gallery/assign-control") },
          { id: "gal-why", tier: "Standard", title: "See exactly why a score is what it is", what: "Every applicability number opens into its eight-category rubric breakdown. Same math for every RAU.", show: go("riskid/" + story.id, "Open Why this score on any candidate.") },
          { id: "gal-excl", tier: "Standard", title: "Exclusions scope out whole slices of the universe", what: "A confirmed does-not-do answer in the survey suppresses matching candidates, visibly and reversibly.", show: go("riskid/" + story.id, "The suppressed panel at the top shows what the survey ruled out.") },
          { id: "gal-resolve", tier: "Advanced", title: "One answer rescores the whole stack", what: "Resolve asks a targeted question; the answer updates the RAU's metadata, so every candidate on the workbench rescores consistently.", show: go("riskid/" + story.id, "Open Resolve on an item in the middle band.") },
          { id: "gal-regchange", tier: "Exotic", title: "A regulatory change re-opens applicability", what: "A revised MCR arrives from RRCM; the tool lists who has it attached and who matches its profile but never assessed it. A preview of Capability 6.", show: go("gallery/reg-change") }
        ]
      },
      {
        theme: "Working across the tool", items: [
          { id: "gal-search", tier: "Basic", title: "Search everything from one box", what: "One search across RAUs, risk events, MCRs, and pipeline requests.", show: function () { ctx.state.set("search", "escrow"); ctx.go("search"); } },
          { id: "gal-mywork", tier: "Basic", title: "Role-aware queues in My Work", what: "The same screen shows different queues for the RAU Owner, the governance team, and the second line.", show: function () { ctx.state.set("role", "RCSA RAU Governance"); var sel = document.getElementById("g-role"); if (sel) sel.value = "RCSA RAU Governance"; ctx.go("mywork"); setTimeout(function () { ctx.ui.toast("Now viewing as RCSA RAU Governance. Change View as in the banner to switch hats."); }, 350); } },
          { id: "gal-confirmhandoff", tier: "Standard", title: "Confirm an inbound handoff", what: "Handoffs are trusted at submission and confirmed by the counterparty afterward, from their queue.", show: function () { ctx.state.set("role", "RAU Owner"); var sel = document.getElementById("g-role"); if (sel) sel.value = "RAU Owner"; ctx.go("mywork"); } }
        ]
      }
    ];
  }

  /* ==SECTION:gallery== */
  function tierKind(t) { return t === "Standard" ? "info" : t === "Advanced" ? "warn" : t === "Exotic" ? "brand" : ""; }
  function gallery(el, ctx) {
    var ui = ctx.ui;
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "Feature gallery"),
        ui.el("div", { class: "g-muted" }, "Concrete examples of features we could ship, grouped by theme and complexity. Open each one, then mark it Keep, Discuss, or Cut. Votes ride along with the feedback export, so the decision meeting works from one list.")])));
    var groups = buildGroups(ctx);
    groups.forEach(function (g) {
      var grid = ui.el("div", { class: "g-grid", style: "grid-template-columns:repeat(auto-fill,minmax(310px,1fr))" });
      g.items.filter(Boolean).forEach(function (it) {
        var voteRow = ui.el("div", { class: "vote g-row" });
        function drawVotes() {
          voteRow.innerHTML = "";
          ["Keep", "Discuss", "Cut"].forEach(function (v) {
            voteRow.appendChild(ui.el("button", {
              class: GRC.getVote(it.id) === v ? "on" : "",
              onclick: function () { GRC.vote(it.id, v); drawVotes(); }
            }, v));
          });
          voteRow.appendChild(ui.el("span", { style: "flex:1" }));
          voteRow.appendChild(ui.el("button", { class: "g-btn sm g-btn--primary", onclick: it.show }, "Show me"));
        }
        drawVotes();
        grid.appendChild(ui.el("div", { class: "gal-item" }, [
          ui.el("div", { class: "g-row" }, [ui.badge(it.tier, tierKind(it.tier)),
          it.id === "gal-assign-control" ? ui.badge("Capability 4 preview", "brand") : null,
          it.id === "gal-regchange" ? ui.badge("Capability 6 preview", "brand") : null]),
          ui.el("div", { class: "t" }, it.title),
          ui.el("div", { class: "w" }, it.what),
          voteRow]));
      });
      el.appendChild(ui.card({ title: g.theme, body: grid }));
    });
  }

  /* ==SECTION:vignette-control== */
  function assignControl(el, ctx) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    var story = findStory(data);
    var reg = data.regOfRau(story.id).filter(function (g) { return g.status === "confirmed"; });
    var row = reg[0];
    if (!row) { el.appendChild(ui.empty("Confirm a risk on the workbench first, then return here.")); return; }
    var ev = data.byId("riskEvents", row.eventId);
    if (!assigned) assigned = [CONTROL_CATALOG[1]];
    el.appendChild(ui.el("div", { class: "g-page-head" }, [
      ui.el("div", {}, [
        ui.el("div", { class: "g-row" }, [ui.el("span", { class: "g-h1" }, "Assign a control to a risk instance"), ui.badge("Capability 4 preview", "brand")]),
        ui.el("div", { class: "g-muted" }, "The risk instance below is a confirmed applicability record from Capability 2. Capability 4 builds the control layer on the same records; this vignette shows the basic move.")]),
      ui.el("div", { class: "sp" }),
      ui.el("button", { class: "g-btn", onclick: function () { ctx.go("gallery"); } }, "Back to gallery")]));
    el.appendChild(ui.card({
      title: "The risk instance", body: ui.kv([
        ["Risk event", ui.el("a", { href: "#/events/" + ev.id }, ev.name)],
        ["RAU", ui.el("a", { href: "#/raus/" + story.id }, story.id + " " + story.name)],
        ["Applicability", row.score + " (confirmed by " + row.by + ", " + fmt.date(row.date) + ")"],
        ev.side === "compliance" && row.mcrIds ? ["MCRs attached", String(row.mcrIds.length)] : null])
    }));
    var body = ui.el("div");
    function draw() {
      body.innerHTML = "";
      body.appendChild(ui.table({
        cols: [
          { key: "id", label: "Control", render: function (c) { return ui.el("span", { class: "g-mono" }, c.id); } },
          { key: "name", label: "Name" },
          { key: "type", label: "Type" },
          { key: "automation", label: "Automation" },
          { key: "x", label: "", render: function (c) { return ui.el("button", { class: "g-btn sm", onclick: function () { assigned = assigned.filter(function (a) { return a.id !== c.id; }); draw(); } }, "Unlink"); } }
        ], rows: assigned, empty: "No controls linked yet."
      }));
      var remaining = CONTROL_CATALOG.filter(function (c) { return !assigned.some(function (a) { return a.id === c.id; }); });
      var sel = ui.select({ options: remaining.map(function (c) { return { value: c.id, label: c.id + "  " + c.name }; }) });
      body.appendChild(ui.el("div", { class: "g-row", style: "margin-top:10px" }, [
        sel,
        ui.el("button", { class: "g-btn g-btn--primary", onclick: function () {
          var c = CONTROL_CATALOG.filter(function (x) { return x.id === sel.value; })[0];
          if (!c) return;
          assigned.push(c);
          GRC.traceAction(4, "Assigning a control");
          ui.toast(c.id + " linked to this risk instance. In the full build this writes the risk-to-control mapping.");
          draw();
        } }, "Assign control")]));
    }
    draw();
    el.appendChild(ui.card({ title: "Controls linked to this risk instance", body: body }));
  }

  /* ==SECTION:vignette-regchange== */
  function regChange(el, ctx) {
    var ui = ctx.ui, data = ctx.data, eng = ctx.engine;
    var mcr = data.all("mcrs").filter(function (m) { return m.head && m.regFamily === "Reg E"; })[0];
    var ev = data.byId("riskEvents", mcr.parentEventId);
    var attached = [];
    data.all("register").forEach(function (g) {
      if (g.mcrIds && g.mcrIds.indexOf(mcr.id) >= 0) { var r = data.byId("raus", g.rauId); if (r) attached.push(r); }
    });
    var candidates = [];
    var raus = data.all("raus");
    for (var i = 0; i < raus.length && candidates.length < 8; i++) {
      var r = raus[i];
      if (attached.indexOf(r) >= 0) continue;
      var sc = eng.score(r, mcr);
      if (sc.pct >= eng.rubric().bands.likely) candidates.push({ r: r, pct: sc.pct });
    }
    el.appendChild(ui.el("div", { class: "g-page-head" }, [
      ui.el("div", {}, [
        ui.el("div", { class: "g-row" }, [ui.el("span", { class: "g-h1" }, "A regulatory change arrives"), ui.badge("Capability 6 preview", "brand")]),
        ui.el("div", { class: "g-muted" }, "Signals and Impact Assessment will turn events like this into worklists automatically. The lists below are computed live from the same metadata Capability 2 uses.")]),
      ui.el("div", { class: "sp" }),
      ui.el("button", { class: "g-btn", onclick: function () { ctx.go("gallery"); } }, "Back to gallery")]));
    el.appendChild(ui.card({
      title: "RRCM publication notice", body: ui.kv([
        ["Requirement", ui.el("a", { href: "#/mcrlib/" + mcr.id }, mcr.id + "  " + mcr.name)],
        ["Change", "Revised: the investigation window language is updated effective next quarter."],
        ["Parent risk event", ui.el("a", { href: "#/events/" + ev.id }, ev.name)],
        ["Published", ctx.fmt.date(ctx.fmt.today())]])
    }));
    function rauTable(rows, action) {
      return ui.table({
        cols: [
          { key: "id", label: "RAU", render: function (x) { var r = x.r || x; return ui.el("a", { href: "#/raus/" + r.id }, r.id + "  " + r.name); } },
          { key: "sub", label: "SubLOB", render: function (x) { var r = x.r || x; return data.orgPath(r.subLobId).sub; } },
          { key: "go", label: "", render: function (x) { var r = x.r || x; return ui.el("button", { class: "g-btn sm", onclick: function () { ctx.go("riskid/" + r.id); } }, action); } }
        ], rows: rows, page: 8, empty: "None."
      });
    }
    el.appendChild(ui.el("div", { class: "g-split" }, [
      ui.card({ title: "Currently attached to this MCR: review the change", body: rauTable(attached.slice(0, 8), "Open workbench") }),
      ui.card({ title: "Matches this requirement's profile but never assessed it", body: rauTable(candidates, "Re-check applicability") })]));
  }

  GRC.register({
    id: "gallery", version: "1.1.0", tab: "Home",
    caps: {
      "gallery": { primary: [1, 2] },
      "gallery/assign-control": { primary: [4], uses: [2], preview: true },
      "gallery/reg-change": { primary: [6], uses: [1, 2], preview: true }
    },
    rail: [{ label: "Feature gallery", route: "gallery", order: 20 }],
    routes: { "gallery": gallery, "gallery/assign-control": assignControl, "gallery/reg-change": regChange }
  });
})();
