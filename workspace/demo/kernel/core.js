/* GRC kernel/core.js v1.2.0 2026-08-23 */
/* Kernel: module registry (tab/rail), hash router, data indexing, state,
   formatting, preflight, guided tour, reset. No dependencies, file:// safe. */
(function () {
  "use strict";
  var GRC = window.GRC = window.GRC || {};
  var MODS = [];            /* registered modules */
  var ROUTES = [];          /* {pattern, parts, fn, mod} */
  var STATE = { role: "RAU Owner", search: "" };
  var WATCH = {};
  var ERRORS = [];
  var D = null;             /* indexed data (session clone) */
  var current = { route: null, mod: null };

  var TABS = ["Home", "RCSA", "Signals", "Testing", "Monitoring", "Policy"];
  var SOON = {
    Signals: { n: 6, items: ["Signal Inbox", "Impact Assessments", "Dispositioned Log"] },
    Testing: { n: 7, items: ["Control Testing", "Audit Testing", "Issues"] },
    Monitoring: { n: 9, items: ["KRI Dashboard", "Program Health"] },
    Policy: { n: 10, items: ["Policy Library", "Governance Map"] }
  };
  var ROLES = ["RAU Owner", "RAU Owner Delegate", "BCM Contact", "ORBO (Operational Risk)", "BACO (Compliance Risk)", "RCSA RAU Governance"];

  /* ==SECTION:capability-model== */
  /* The ten capabilities, their short names, and what each one NEEDS to
     function. needs drives the home-page lens (select capabilities, see
     the transitive support set) and the trace bar under the tabs. */
  var CAPS = {
    1: { name: "RAU Demographics & Attributes", needs: [] },
    2: { name: "Risk Identification", needs: [1] },
    3: { name: "Inherent Risk Rating", needs: [2] },
    4: { name: "Control Identification", needs: [2] },
    5: { name: "RCSA Administration", needs: [3, 4] },
    6: { name: "Signals & Impact Assessment", needs: [1, 2] },
    7: { name: "Control Testing", needs: [4] },
    8: { name: "Audit Testing", needs: [4] },
    9: { name: "Monitoring", needs: [1, 2, 3, 4, 5, 6] },
    10: { name: "Policy Governance", needs: [] }
  };
  var BUILT = { 1: true, 2: true };
  GRC.caps = {
    all: CAPS,
    name: function (n) { return CAPS[n] ? CAPS[n].name : "Capability " + n; },
    built: function (n) { return !!BUILT[n]; },
    closure: function (sel) {
      /* selected set plus everything transitively needed */
      var seen = {};
      function add(n) {
        if (seen[n]) return;
        seen[n] = true;
        (CAPS[n].needs || []).forEach(add);
      }
      sel.forEach(add);
      return Object.keys(seen).map(Number).sort(function (a, b) { return a - b; });
    },
    order: function (set) {
      /* topological build order: needs before dependents */
      var out = [], placed = {};
      var pool = set.slice();
      var guard = 0;
      while (pool.length && guard++ < 50) {
        for (var i = 0; i < pool.length; i++) {
          var n = pool[i];
          var ready = (CAPS[n].needs || []).every(function (d) { return placed[d] || set.indexOf(d) < 0; });
          if (ready) { out.push(n); placed[n] = true; pool.splice(i, 1); break; }
        }
      }
      return out.concat(pool);
    }
  };

  /* ==SECTION:trace== */
  /* Capability trace: every route declares which capabilities it belongs
     to; a strip under the tabs shows it, and actions pulse their chip.
     This keeps a walkthrough honest about what ships with what. */
  function traceFor(routePattern, mod) {
    if (mod && mod.caps && mod.caps[routePattern]) return mod.caps[routePattern];
    if (mod && mod.caps && mod.caps["*"]) return mod.caps["*"];
    return null;
  }
  function capChip(n, kind) {
    var b = GRC.caps.built(n);
    var cls = "tr-chip " + kind + (b ? "" : " future");
    var el = document.createElement("button");
    el.className = cls;
    el.textContent = "C" + n;
    el.title = GRC.caps.name(n) + (b ? " (built)" : " (later phase)") + ". Click to focus it on the program map.";
    el.setAttribute("data-cap", String(n));
    el.onclick = function () {
      STATE.capLens = [n];
      GRC.go("home");
    };
    return el;
  }
  function renderTrace(tr) {
    var bar = document.getElementById("g-trace");
    if (!tr) { bar.hidden = true; bar.innerHTML = ""; return; }
    bar.hidden = false;
    bar.innerHTML = "";
    var lbl = document.createElement("span");
    lbl.className = "tr-lbl";
    lbl.textContent = "You are looking at";
    bar.appendChild(lbl);
    (tr.primary || []).forEach(function (n) { bar.appendChild(capChip(n, "primary")); });
    var pn = (tr.primary || []).map(function (n) { return GRC.caps.name(n); }).join(", ");
    var name = document.createElement("span");
    name.className = "tr-name";
    name.textContent = pn + (tr.preview ? " (preview)" : "");
    bar.appendChild(name);
    if (tr.uses && tr.uses.length) {
      var u = document.createElement("span"); u.className = "tr-lbl"; u.textContent = "built on"; bar.appendChild(u);
      tr.uses.forEach(function (n) { bar.appendChild(capChip(n, "uses")); });
    }
    if (tr.feeds && tr.feeds.length) {
      var f = document.createElement("span"); f.className = "tr-lbl"; f.textContent = "will feed"; bar.appendChild(f);
      tr.feeds.forEach(function (n) { bar.appendChild(capChip(n, "feeds")); });
    }
  }
  GRC.traceAction = function (n, label) {
    var bar = document.getElementById("g-trace");
    if (!bar || bar.hidden) return;
    var chip = bar.querySelector('[data-cap="' + n + '"]');
    if (chip) {
      chip.classList.remove("pulse");
      void chip.offsetWidth;
      chip.classList.add("pulse");
    }
    var tag = bar.querySelector(".tr-act");
    if (!tag) { tag = document.createElement("span"); tag.className = "tr-act"; bar.appendChild(tag); }
    tag.textContent = (label || "That action") + " belongs to Capability " + n;
    tag.classList.remove("show");
    void tag.offsetWidth;
    tag.classList.add("show");
  };

  /* ==SECTION:register== */
  GRC.register = function (def) {
    if (!def || !def.id || !def.routes) { console.warn("GRC.register: bad module", def); return; }
    MODS.push(def);
    Object.keys(def.routes).forEach(function (p) {
      ROUTES.push({ pattern: p, parts: p.split("/"), fn: def.routes[p], mod: def });
    });
  };

  /* ==SECTION:errors== */
  function trap(msg) {
    ERRORS.push(String(msg).slice(0, 300));
    var b = document.getElementById("g-preflight-btn");
    if (b) { b.classList.add("err"); b.textContent = "Preflight (" + ERRORS.length + ")"; }
  }
  window.onerror = function (m, src, line) { trap(m + " @ " + (src || "").split("/").pop() + ":" + line); };

  /* ==SECTION:clone-index== */
  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function indexData() {
    var raw = window.GRC_DATA || {};
    D = { entities: {}, byId: {}, ver: {} };
    ["orgNodes", "services", "raus", "riskEvents", "mcrs", "register", "requests", "metaQuestions", "rubric"].forEach(function (k) {
      var src = raw[k] || { version: "-", rows: [] };
      D.entities[k] = clone(src.rows || []);
      D.ver[k] = src.version || "-";
      if (k === "rubric") { D.rubricDef = clone((src.def) || {}); }
      var map = {};
      D.entities[k].forEach(function (r) { if (r.id) map[r.id] = r; });
      D.byId[k] = map;
    });
    D.release = raw.release || { number: "R?", date: "-", label: "" };
    /* org helpers */
    D.subLobs = D.entities.orgNodes.filter(function (o) { return o.level === "sublob"; });
    D.lobs = D.entities.orgNodes.filter(function (o) { return o.level === "lob"; });
    /* group indexes */
    D.rausBySub = {};
    D.entities.raus.forEach(function (r) { (D.rausBySub[r.subLobId] = D.rausBySub[r.subLobId] || []).push(r); });
    D.regByRau = {}; D.regByEvent = {};
    D.entities.register.forEach(function (g) {
      (D.regByRau[g.rauId] = D.regByRau[g.rauId] || []).push(g);
      (D.regByEvent[g.eventId] = D.regByEvent[g.eventId] || []).push(g);
    });
    D.mcrsByEvent = {};
    D.entities.mcrs.forEach(function (m) { (D.mcrsByEvent[m.parentEventId] = D.mcrsByEvent[m.parentEventId] || []).push(m); });
  }

  /* ==SECTION:data-api== */
  function orgNode(id) { return D.byId.orgNodes[id] || null; }
  function orgPath(subLobId) {
    var s = orgNode(subLobId); if (!s) return { lob: "?", sub: "?" };
    var l = orgNode(s.parentId);
    return { lob: l ? l.name : "?", sub: s.name, lobId: l ? l.id : null };
  }
  var data = {
    all: function (k) { return D.entities[k] || []; },
    byId: function (k, id) { return (D.byId[k] || {})[id] || null; },
    ver: function (k) { return D.ver[k]; },
    release: function () { return D.release; },
    subLobs: function () { return D.subLobs; },
    lobs: function () { return D.lobs; },
    orgNode: orgNode, orgPath: orgPath,
    rausOfSub: function (id) { return D.rausBySub[id] || []; },
    svcName: function (id) { var s = D.byId.services[id]; return s ? s.name : id; },
    svcPath: function (id) {
      var out = [], s = D.byId.services[id];
      while (s) { out.unshift(s.name); s = s.parentId ? D.byId.services[s.parentId] : null; }
      return out.join(" > ");
    },
    regOfRau: function (rauId) { return D.regByRau[rauId] || []; },
    regOfEvent: function (evId) { return D.regByEvent[evId] || []; },
    mcrsOfEvent: function (evId) { return D.mcrsByEvent[evId] || []; },
    rubric: function () { return D.rubricDef; },
    addRegister: function (row) {
      D.entities.register.push(row);
      (D.regByRau[row.rauId] = D.regByRau[row.rauId] || []).push(row);
      (D.regByEvent[row.eventId] = D.regByEvent[row.eventId] || []).push(row);
    },
    metrics: function () {
      var raus = D.entities.raus, reg = D.entities.register;
      var comp = 0, prog = 0, none = 0;
      raus.forEach(function (r) {
        if (r.riskIdStatus === "complete") comp++;
        else if (r.riskIdStatus === "in-progress") prog++; else none++;
      });
      var confirmed = reg.filter(function (g) { return g.status === "confirmed"; }).length;
      var pendingHand = 0;
      raus.forEach(function (r) { (r.handoffs || []).forEach(function (h) { if (!h.conf && h.dir === "in") pendingHand++; }); });
      return {
        activeRaus: raus.filter(function (r) { return r.stage === "active"; }).length,
        pipeline: D.entities.requests.filter(function (q) { return ["approved", "closed"].indexOf(q.stage) < 0; }).length,
        riskIdComplete: comp, riskIdInProgress: prog, riskIdNotStarted: none,
        confirmedRisks: confirmed,
        mcrTotal: D.entities.mcrs.length,
        mcrHead: D.entities.mcrs.filter(function (m) { return m.head; }).length,
        events: D.entities.riskEvents.length,
        pendingHandoffs: pendingHand
      };
    },
    search: function (q) {
      q = (q || "").toLowerCase().trim();
      if (!q) return [];
      var out = [];
      function scan(kind, rows, label) {
        for (var i = 0; i < rows.length && out.length < 60; i++) {
          var r = rows[i];
          var hay = (r.id + " " + (r.name || r.proposedName || "")).toLowerCase();
          if (hay.indexOf(q) >= 0) out.push({ kind: kind, label: label(r), r: r });
        }
      }
      scan("rau", D.entities.raus, function (r) { return r.id + " - " + r.name; });
      scan("event", D.entities.riskEvents, function (r) { return r.id + " - " + r.name; });
      scan("mcr", D.entities.mcrs, function (r) { return r.id + " - " + r.name; });
      scan("request", D.entities.requests, function (r) { return r.id + " - " + r.proposedName; });
      return out;
    }
  };

  /* ==SECTION:state== */
  var state = {
    get: function (k) { return STATE[k]; },
    set: function (k, v) {
      STATE[k] = v;
      (WATCH[k] || []).forEach(function (f) { try { f(v); } catch (e) { trap(e.message); } });
    },
    watch: function (k, f) { (WATCH[k] = WATCH[k] || []).push(f); }
  };

  /* ==SECTION:fmt== */
  var fmt = {
    num: function (n) { return (n === null || n === undefined) ? "-" : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); },
    money: function (n) { return n ? "$" + fmt.num(n) : "-"; },
    pct: function (n) { return n === null || n === undefined ? "-" : Math.round(n) + "%"; },
    date: function (iso) {
      if (!iso) return "-";
      var m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var p = iso.split("-"); return p.length === 3 ? (Number(p[2]) + " " + m[Number(p[1]) - 1] + " " + p[0]) : iso;
    },
    today: function () { return "2026-08-23"; },
    cat: function (c) {
      return { "business-service": "Business Service", "shared-services": "Shared Services", "enterprise": "Enterprise" }[c] || c;
    },
    stage: function (s) {
      return { "draft-intake": "Draft intake", "uniqueness-review": "Uniqueness review", "returned-for-refinement": "Returned for refinement", "process-mapping": "Process mapping", "standards-check": "Standards check", "pending-governance": "Pending governance", "metadata-creation": "Metadata creation", "active": "Active", "retired": "Retired", "approved": "Approved", "declined": "Declined" }[s] || s;
    },
    stageKind: function (s) {
      if (s === "active" || s === "approved") return "ok";
      if (s === "returned-for-refinement" || s === "declined") return "bad";
      if (s === "pending-governance" || s === "standards-check") return "warn";
      return "info";
    },
    riskIdKind: function (s) { return s === "complete" ? "ok" : s === "in-progress" ? "warn" : ""; },
    bandKind: function (b) { return b === "likely" ? "ok" : b === "possible" ? "warn" : ""; },
    band: function (b) { return b === "likely" ? "Likely" : b === "possible" ? "Possible" : "Unlikely"; }
  };

  /* ==SECTION:router== */
  function parseHash() {
    var h = location.hash.replace(/^#\/?/, "");
    return h ? h.split("/") : [];
  }
  function matchRoute(segs) {
    var best = null;
    for (var i = 0; i < ROUTES.length; i++) {
      var r = ROUTES[i];
      if (r.parts.length !== segs.length) continue;
      var params = {}, ok = true, statics = 0;
      for (var j = 0; j < segs.length; j++) {
        if (r.parts[j].charAt(0) === ":") { params[r.parts[j].slice(1)] = decodeURIComponent(segs[j]); }
        else if (r.parts[j] === segs[j]) { statics++; }
        else { ok = false; break; }
      }
      if (ok && (!best || statics > best.statics)) best = { r: r, params: params, statics: statics };
    }
    return best;
  }
  GRC.go = function (route) {
    if ("#/" + route === location.hash) { render(); } else { location.hash = "#/" + route; }
  };
  function render() {
    var outlet = document.getElementById("outlet");
    var segs = parseHash();
    if (!segs.length) { segs = ["home"]; }
    var m = matchRoute(segs);
    outlet.innerHTML = "";
    if (segs[0] === "soon") {
      renderSoon(outlet, segs[1]);
      current = { route: "soon/" + segs[1], mod: { tab: segs[1] } };
      var soonCfg = SOON[segs[1].split("-")[0]];
      renderTrace(soonCfg ? { primary: [soonCfg.n] } : null);
      paint(); return;
    }
    if (segs[0] === "search") {
      renderSearch(outlet);
      current = { route: "search", mod: { tab: current.mod ? current.mod.tab : "Home" } };
      renderTrace({ primary: [1, 2] });
      paint(); return;
    }
    if (!m) { GRC.go("home"); return; }
    current = { route: segs.join("/"), mod: m.r.mod };
    outlet.setAttribute("data-mod", m.r.mod.id);
    renderTrace(traceFor(m.r.pattern, m.r.mod));
    try {
      m.r.fn(outlet, GRC.ctx, m.params);
    } catch (e) {
      trap("module " + m.r.mod.id + ": " + e.message);
      var d = document.createElement("div");
      d.className = "g-card";
      d.innerHTML = "<div class='g-h2'>Module failed: " + m.r.mod.id + "</div><div class='g-muted g-mono'>" + e.message + "</div>";
      outlet.appendChild(d);
    }
    paint();
  }

  /* ==SECTION:chrome== */
  function paint() {
    var tab = current.mod && current.mod.tab ? current.mod.tab : "Home";
    var tabsEl = document.getElementById("g-tabs");
    tabsEl.innerHTML = "";
    TABS.forEach(function (t) {
      var b = document.createElement("button");
      b.textContent = t;
      if (t === tab) b.className = "on";
      b.onclick = function () { gotoTab(t); };
      tabsEl.appendChild(b);
    });
    document.getElementById("g-rail-title").textContent = tab;
    var ctxEl = document.getElementById("g-rail-context");
    ctxEl.innerHTML = "";
    railItems(tab).forEach(function (it) {
      var b = document.createElement("button");
      b.className = "itm" + (isOn(it.route) ? " on" : "");
      b.textContent = it.label;
      b.onclick = function () { GRC.go(it.route); };
      ctxEl.appendChild(b);
    });
    var per = document.getElementById("g-rail-persist");
    per.innerHTML = "<h4>Always available</h4>";
    [{ label: "My Work", route: "mywork" }, { label: "Present (guided demo)", route: "present" }].forEach(function (it) {
      var b = document.createElement("button");
      b.className = "itm" + (isOn(it.route) ? " on" : "");
      b.textContent = it.label;
      b.onclick = function () { GRC.go(it.route); };
      per.appendChild(b);
    });
    var ab = document.createElement("button");
    ab.className = "itm"; ab.textContent = "About / Preflight";
    ab.onclick = togglePreflight;
    per.appendChild(ab);
  }
  function isOn(route) {
    var cur = current.route || "";
    var base = route.split("/")[0];
    return cur === route || cur.split("/")[0] === base;
  }
  function railItems(tab) {
    if (SOON[tab]) {
      return SOON[tab].items.map(function (n, i) { return { label: n, route: "soon/" + tab + "-" + i }; });
    }
    var items = [];
    MODS.forEach(function (m) {
      if (m.tab === tab && m.rail) { m.rail.forEach(function (r) { items.push(r); }); }
    });
    items.sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    return items;
  }
  function gotoTab(t) {
    if (SOON[t]) { GRC.go("soon/" + t + "-0"); return; }
    var items = railItems(t);
    GRC.go(items.length ? items[0].route : "home");
  }
  function renderSoon(outlet, key) {
    var tab = key.split("-")[0];
    var cfg = SOON[tab] || { n: "?", items: [] };
    var idx = Number(key.split("-")[1] || 0);
    var d = document.createElement("div");
    d.innerHTML = "<div class='g-page-head'><div><div class='g-h1'>" + (cfg.items[idx] || tab) + "</div>" +
      "<div class='g-muted'>Capability " + cfg.n + ": arrives in a later build phase.</div></div></div>" +
      "<div class='g-empty'>This function is part of the full 10-capability plan. The current release (" +
      (D ? D.release.number : "R?") + ") implements Capability 1 (RAU Demographics &amp; Attributes) and " +
      "Capability 2 (Operational &amp; Compliance Risk Identification). Use the RCSA tab to explore them, " +
      "or Present for the guided walkthrough.</div>";
    outlet.appendChild(d);
  }

  /* ==SECTION:search== */
  function renderSearch(outlet) {
    var q = STATE.search || "";
    var res = data.search(q);
    var ui = GRC.ctx.ui;
    outlet.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [ui.el("div", { class: "g-h1" }, "Search"),
      ui.el("div", { class: "g-muted" }, res.length + " results for \"" + q + "\"")])));
    if (!res.length) { outlet.appendChild(ui.empty("Type in the banner search box and press Enter. Searches RAUs, risk events, MCRs, and pipeline requests by id and name.")); return; }
    var groups = {};
    res.forEach(function (r) { (groups[r.kind] = groups[r.kind] || []).push(r); });
    var labels = { rau: "RAUs", event: "Risk events", mcr: "MCRs", request: "Pipeline requests" };
    Object.keys(groups).forEach(function (k) {
      var card = ui.el("div", { class: "g-card" }, ui.el("div", { class: "g-h2" }, labels[k] || k));
      groups[k].forEach(function (hit) {
        var route = k === "rau" ? "raus/" + hit.r.id : k === "event" ? "events/" + hit.r.id :
          k === "mcr" ? "mcrlib/" + hit.r.id : "pipeline/" + hit.r.id;
        card.appendChild(ui.el("div", { style: "padding:4px 0" },
          ui.el("a", { href: "#/" + route }, hit.label)));
      });
      outlet.appendChild(card);
    });
  }

  /* ==SECTION:preflight== */
  var pfOpen = false;
  function togglePreflight() {
    var pf = document.getElementById("preflight");
    pfOpen = !pfOpen;
    if (!pfOpen) { pf.hidden = true; pf.innerHTML = ""; return; }
    pf.hidden = false;
    pf.className = "";
    var m = data.metrics();
    var rows = "";
    ["orgNodes", "services", "raus", "riskEvents", "mcrs", "register", "requests", "metaQuestions", "rubric"].forEach(function (k) {
      rows += "<tr><td>" + k + "</td><td class='num'>" + fmt.num(D.entities[k].length) + "</td><td class='g-mono'>" + D.ver[k] + "</td></tr>";
    });
    var mods = "";
    MODS.forEach(function (md) { mods += "<tr><td>" + md.id + "</td><td>" + (md.version || "-") + "</td><td class='num'>" + Object.keys(md.routes).length + "</td></tr>"; });
    var errs = ERRORS.length ? "<div class='pf-err'>" + ERRORS.join("\n") + "</div>" : "<span class='g-badge g-badge--ok'>No trapped errors</span>";
    var eng = "engine not loaded";
    try {
      var t = GRC.engine.score({ meta: { tags: ["proc:payment-execution", "mm:wire-out"], excl: [] } }, { tags: ["proc:payment-execution", "mm:wire-out"], excludedBy: [] });
      eng = "self-test score " + t.pct + " (" + t.band + ") - OK";
    } catch (e) { eng = "ENGINE ERROR: " + e.message; }
    pf.innerHTML = "<div class='g-drawer-bg'></div><div class='g-drawer'><div class='hd'>" +
      "<div class='g-h2' style='margin:0'>Preflight " + D.release.number + " (" + D.release.date + ")</div>" +
      "<span class='sp' style='flex:1'></span><button class='g-btn sm' id='pf-reset'>Reset demo data</button>" +
      "<button class='g-btn sm' id='pf-close'>Close</button></div><div class='bd'>" +
      "<div class='g-label'>Release</div><p>" + D.release.number + " - " + D.release.label + "</p>" +
      "<div class='g-label'>Errors</div><p>" + errs + "</p>" +
      "<div class='g-label'>Engine</div><p class='g-mono'>" + eng + "</p>" +
      "<div class='g-label'>Data</div><div class='g-tablewrap'><table class='g-table'><tr><th>Entity</th><th>Rows</th><th>Version</th></tr>" + rows + "</table></div>" +
      "<div class='g-label'>Modules</div><div class='g-tablewrap'><table class='g-table'><tr><th>Module</th><th>Version</th><th>Routes</th></tr>" + mods + "</table></div>" +
      "<div class='g-label'>Session</div><p class='g-muted'>Actions in this session are in-memory only. Reset restores shipped data. " +
      "Risk-ID status: " + m.riskIdComplete + " complete / " + m.riskIdInProgress + " in progress / " + m.riskIdNotStarted + " not started.</p>" +
      "</div></div>";
    pf.querySelector("#pf-close").onclick = togglePreflight;
    pf.querySelector(".g-drawer-bg").onclick = togglePreflight;
    pf.querySelector("#pf-reset").onclick = function () {
      if (confirm("Reset all in-session changes back to shipped data?")) { GRC.resetData(); togglePreflight(); }
    };
  }

  /* ==SECTION:feedback== */
  /* On-page feedback capture. Every item records the page and the source
     file so the change can be made later without archaeology. Stored in
     localStorage when available so it survives refresh; exportable as
     plain text ready to hand to the maintainer. */
  var FB = { items: [], votes: {} };
  function fbKey() { return "grc-feedback-" + (D ? D.release.number : "R"); }
  function fbLoad() {
    try { var raw = localStorage.getItem(fbKey()); if (raw) { FB = JSON.parse(raw); FB.items = FB.items || []; FB.votes = FB.votes || {}; } } catch (e) { }
  }
  function fbSave() { try { localStorage.setItem(fbKey(), JSON.stringify(FB)); } catch (e) { } }
  function fbFile() {
    if (!current.route) return "kernel/core.js";
    if (current.route === "search" || current.route.indexOf("soon/") === 0) return "kernel/core.js";
    return current.mod && current.mod.id ? "modules/" + current.mod.id + ".js" : "kernel/core.js";
  }
  function fbStamp() {
    var d = new Date();
    return d.toISOString().slice(0, 16).replace("T", " ");
  }
  GRC.vote = function (itemId, v) { if (FB.votes[itemId] === v) { delete FB.votes[itemId]; } else { FB.votes[itemId] = v; } fbSave(); };
  GRC.getVote = function (itemId) { return FB.votes[itemId]; };
  function fbExport() {
    var out = ["GRC MOCKUP FEEDBACK EXPORT", "Release: " + D.release.number + " (" + D.release.date + ")",
      "Each item names the page (hash route) and the source file to change.", ""];
    FB.items.forEach(function (it) {
      out.push(it.id + " | " + it.release + " | page: " + it.route + " | file: " + it.file + " | role: " + it.role + " | " + it.when);
      out.push("  Type: " + it.type);
      out.push("  Now: " + it.now);
      out.push("  Should: " + it.should);
      out.push("");
    });
    var vk = Object.keys(FB.votes);
    if (vk.length) {
      out.push("FEATURE GALLERY VOTES");
      vk.forEach(function (k) { out.push("  " + k + ": " + FB.votes[k]); });
    }
    return out.join("\n");
  }
  function openFeedback() {
    var ui = GRC.ctx.ui;
    var route = "#/" + (current.route || "home");
    var file = fbFile();
    var body = ui.el("div");
    body.appendChild(ui.el("div", { class: "fb-ctx" }, [
      ui.el("div", {}, ["Captured with this item: page ", ui.el("span", { class: "g-mono" }, route),
        ", file ", ui.el("span", { class: "g-mono" }, file), ", release " + D.release.number + ", viewing as " + STATE.role + "."])]));
    var typeSel = ui.select({ options: ["Change request", "Defect", "Idea", "Question"] });
    var nowTa = ui.el("textarea", { class: "g-input", rows: "3", style: "width:100%", placeholder: "What you see now. Example: the middle list shows every candidate at once." });
    var shouldTa = ui.el("textarea", { class: "g-input", rows: "3", style: "width:100%", placeholder: "What it should be. Example: show the top ten with a link to the rest." });
    function field(l, n) { return ui.el("div", { style: "margin-bottom:10px" }, [ui.el("div", { class: "g-label", style: "margin-bottom:4px" }, l), n]); }
    body.appendChild(field("Type", typeSel));
    body.appendChild(field("I don't like this...", nowTa));
    body.appendChild(field("...change it to that", shouldTa));
    var listWrap = ui.el("div");
    function drawList() {
      listWrap.innerHTML = "";
      if (!FB.items.length) return;
      listWrap.appendChild(ui.el("div", { class: "g-label", style: "margin:14px 0 4px" }, "Captured this release (" + FB.items.length + ")"));
      FB.items.slice().reverse().forEach(function (it) {
        listWrap.appendChild(ui.el("div", { class: "fb-item" }, [
          ui.el("div", { class: "g-row" }, [
            ui.el("b", {}, it.id), ui.el("span", { class: "g-mono g-muted" }, it.route),
            ui.el("span", { style: "flex:1" }),
            ui.el("button", { class: "g-btn sm", onclick: function () { FB.items = FB.items.filter(function (x) { return x.id !== it.id; }); fbSave(); drawList(); } }, "Remove")]),
          ui.el("div", {}, [ui.el("b", {}, "Now: "), it.now]),
          ui.el("div", {}, [ui.el("b", {}, "Should: "), it.should])]));
      });
      listWrap.appendChild(ui.el("div", { class: "g-row", style: "margin-top:10px" }, [
        ui.el("button", { class: "g-btn", onclick: function () {
          var t = fbExport();
          try { navigator.clipboard.writeText(t); ui.toast("Feedback copied to the clipboard."); }
          catch (e) { window.prompt("Copy the export text:", t); }
        } }, "Copy all as text"),
        ui.el("button", { class: "g-btn", onclick: function () {
          var blob = new Blob([fbExport()], { type: "text/plain" });
          var a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "feedback-" + D.release.number + ".txt";
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
        } }, "Download feedback file")]));
    }
    body.appendChild(ui.el("div", { class: "g-row", style: "margin-top:4px" },
      ui.el("button", { class: "g-btn g-btn--primary", onclick: function () {
        if (!nowTa.value.trim() && !shouldTa.value.trim()) { ui.toast("Describe the change first."); return; }
        FB.items.push({
          id: "FB-" + String(FB.items.length + 1).replace(/^(\d)$/, "00$1").replace(/^(\d\d)$/, "0$1"),
          release: D.release.number, route: route, file: file, role: STATE.role,
          when: fbStamp(), type: typeSel.value || "Change request",
          now: nowTa.value.trim() || "(not stated)", should: shouldTa.value.trim() || "(not stated)"
        });
        fbSave(); nowTa.value = ""; shouldTa.value = "";
        ui.toast("Captured. It references this page so it can be fixed later.");
        drawList();
      } }, "Capture feedback")));
    body.appendChild(listWrap);
    drawList();
    ui.drawer({ title: "Feedback on this demo", body: body });
  }

  /* ==SECTION:tour== */
  GRC.tour = function (scenes) {
    var i = 0;
    var wrap = document.createElement("div");
    wrap.id = "g-tour";
    wrap.innerHTML = "<style>#g-tour{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);" +
      "z-index:90;width:min(620px,94vw);background:#20262f;color:#fff;border-radius:10px;" +
      "box-shadow:0 12px 40px rgba(0,0,0,.5);padding:14px 18px}#g-tour .t{font-weight:700;margin-bottom:4px}" +
      "#g-tour .x{font-size:13px;line-height:1.5;color:#d6dae1}#g-tour .b{display:flex;gap:8px;margin-top:10px;align-items:center}" +
      "#g-tour button{background:#3a4250;border:none;color:#fff;border-radius:5px;padding:6px 14px;cursor:pointer}" +
      "#g-tour button.p{background:#b01e24;font-weight:600}#g-tour .n{color:#9aa2ae;font-size:12px;margin-left:auto}</style>" +
      "<div class='t'></div><div class='x'></div><div class='b'>" +
      "<button id='tprev'>Back</button><button id='tnext' class='p'>Next</button>" +
      "<span class='n'></span><button id='texit'>Exit</button></div>";
    document.body.appendChild(wrap);
    function show() {
      var s = scenes[i];
      if (s.state) { Object.keys(s.state).forEach(function (k) { state.set(k, s.state[k]); }); }
      GRC.go(s.route);
      wrap.querySelector(".t").textContent = (i + 1) + ". " + s.title;
      wrap.querySelector(".x").textContent = s.text;
      wrap.querySelector(".n").textContent = (i + 1) + " of " + scenes.length;
      wrap.querySelector("#tprev").disabled = i === 0;
      wrap.querySelector("#tnext").textContent = i === scenes.length - 1 ? "Finish" : "Next";
    }
    wrap.querySelector("#tprev").onclick = function () { if (i > 0) { i--; show(); } };
    wrap.querySelector("#tnext").onclick = function () {
      if (i < scenes.length - 1) { i++; show(); } else { document.body.removeChild(wrap); }
    };
    wrap.querySelector("#texit").onclick = function () { document.body.removeChild(wrap); };
    show();
  };

  /* ==SECTION:boot== */
  GRC.resetData = function () { indexData(); render(); if (GRC.ctx && GRC.ctx.ui) GRC.ctx.ui.toast("Demo data reset to shipped state."); };
  GRC.boot = function () {
    indexData();
    /* merge extensions */
    var ui = GRC.uiExt || {}; var charts = GRC.chartsExt || {};
    GRC.ctx = { data: data, state: state, fmt: fmt, go: GRC.go, ui: ui, charts: charts, engine: GRC.engine, role: function () { return STATE.role; } };
    /* banner wiring */
    document.getElementById("g-release").textContent = D.release.number;
    var roleSel = document.getElementById("g-role");
    ROLES.forEach(function (r) {
      var o = document.createElement("option"); o.value = r; o.textContent = r; roleSel.appendChild(o);
    });
    roleSel.onchange = function () { state.set("role", roleSel.value); render(); };
    var sr = document.getElementById("g-search");
    sr.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { state.set("search", sr.value); GRC.go("search"); }
    });
    document.getElementById("g-preflight-btn").onclick = togglePreflight;
    fbLoad();
    var pill = document.createElement("button");
    pill.id = "g-fb-pill";
    pill.textContent = "Provide Feedback for this Demo";
    pill.onclick = openFeedback;
    document.body.appendChild(pill);
    window.addEventListener("hashchange", render);
    render();
  };
})();
