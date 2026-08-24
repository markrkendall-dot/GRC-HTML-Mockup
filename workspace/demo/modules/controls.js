/* GRC modules/controls.js v1.1.0 2026-08-23 */
/* Capability 4: control identification. One central inventory (the GRC
   is the system of record), controls attached to risk instances, shared
   controls reused across RAUs, expected controls for defined situations,
   and KEY STATUS DERIVED from the live risk landscape instead of a
   self-declared checkbox. Creation is light: the system recommends the
   expected control, shareable matches, or drafts a directional skeleton;
   the duplicate check is advisory only. */
(function () {
  "use strict";
  var IF = { q: "", type: "", auto: "", key: "", scope: "" };
  var WAIVED = {}; /* session waivers: rauId|eventId|ruleId -> note */

  function keyBadge(ui, dk) {
    if (!dk.key) return ui.el("span", { class: "g-muted" }, "-");
    return ui.el("span", { class: "g-badge g-badge--brand", title: dk.rules.map(function (r) { return r.id + ": " + r.text; }).join("\n") }, "KEY (" + dk.rules.map(function (r) { return r.id; }).join(",") + ")");
  }
  function bandBadge(ui, b) {
    if (!b) return ui.el("span", { class: "g-muted", title: "Not yet rated in Capability 3" }, "unrated");
    return ui.badge(b.charAt(0).toUpperCase() + b.slice(1), b === "low" ? "ok" : b === "moderate" ? "info" : b === "high" ? "warn" : "bad");
  }
  function effBadge(ui, v) {
    return ui.badge(v.replace("-", " "), v === "effective" ? "ok" : v === "partially-effective" ? "warn" : "bad");
  }

  /* ==SECTION:landing== */
  function landingFor(active) {
    return function (el, ctx) {
      var ui = ctx.ui;
      el.appendChild(ui.el("div", { class: "g-page-head" },
        ui.el("div", {}, [
          ui.el("div", { class: "g-h1" }, "Controls"),
          ui.el("div", { class: "g-muted" }, "One central inventory; the GRC is the system of record. Controls attach to risk instances, shared controls are reused across RAUs, and key status is derived from the live risk landscape, not a checkbox.")])));
      el.appendChild(ui.tabs({
        active: active,
        items: [
          { id: "inv", label: "Inventory", render: function (bd) { drawInventory(bd, ctx); } },
          { id: "cov", label: "Coverage", render: function (bd) { drawCoverage(bd, ctx); } },
          { id: "key", label: "Derived vs declared", render: function (bd) { drawKeyCompare(bd, ctx); } }
        ]
      }));
    };
  }

  /* ==SECTION:inventory== */
  function drawInventory(bd, ctx) {
    var ui = ctx.ui, data = ctx.data, eng = ctx.engine.ctl;
    bd.innerHTML = "";
    var needKey = IF.key !== "";
    var rows = data.all("controls").filter(function (c) {
      if (IF.q && (c.id + " " + c.name).toLowerCase().indexOf(IF.q.toLowerCase()) < 0) return false;
      if (IF.type && c.type !== IF.type) return false;
      if (IF.auto && c.automation !== IF.auto) return false;
      if (IF.scope === "shared" && !c.shared) return false;
      if (IF.scope === "local" && c.shared) return false;
      return true;
    });
    if (needKey) {
      rows = rows.filter(function (c) {
        var k = eng.derivedKey(c).key;
        if (IF.key === "derived") return k;
        if (IF.key === "derived-not-declared") return k && !c.declaredKey;
        if (IF.key === "declared-not-derived") return !k && c.declaredKey;
        return true;
      });
    }
    bd.appendChild(ui.toolbar([
      ui.searchBox({ value: IF.q, placeholder: "Find a control...", oninput: function (v) { IF.q = v; drawInventory(bd, ctx); } }),
      ui.select({
        label: "Type", value: IF.type, onchange: function (v) { IF.type = v; drawInventory(bd, ctx); },
        options: [{ value: "", label: "All" }, { value: "preventive", label: "Preventive" }, { value: "detective", label: "Detective" }, { value: "corrective", label: "Corrective" }]
      }),
      ui.select({
        label: "Automation", value: IF.auto, onchange: function (v) { IF.auto = v; drawInventory(bd, ctx); },
        options: [{ value: "", label: "All" }, { value: "manual", label: "Manual" }, { value: "automated", label: "Automated" }, { value: "it-dependent", label: "IT-dependent" }]
      }),
      ui.select({
        label: "Key", value: IF.key, onchange: function (v) { IF.key = v; drawInventory(bd, ctx); },
        options: [{ value: "", label: "All" }, { value: "derived", label: "Derived key" }, { value: "derived-not-declared", label: "Derived, never declared" }, { value: "declared-not-derived", label: "Declared, derives non-key" }]
      }),
      ui.select({
        label: "Scope", value: IF.scope, onchange: function (v) { IF.scope = v; drawInventory(bd, ctx); },
        options: [{ value: "", label: "All" }, { value: "shared", label: "Shared" }, { value: "local", label: "RAU-local" }]
      }),
      ui.el("span", { class: "g-muted", style: "font-size:12px" }, ctx.fmt.num(rows.length) + " controls")]));
    bd.appendChild(ui.table({
      cols: [
        { key: "id", label: "Control", render: function (c) { return ui.el("span", { class: "g-mono" }, c.id); } },
        { key: "name", label: "Name", sort: true, render: function (c) { return ui.el("span", {}, [c.name, c.shared ? ui.el("span", { class: "g-badge g-badge--info", style: "margin-left:6px" }, "SHARED") : null]); } },
        { key: "own", label: "Owning RAU", render: function (c) { var r = data.byId("raus", c.owningRauId); return r ? ui.el("span", { class: "g-muted", style: "font-size:12px" }, r.id + " " + r.name) : "-"; } },
        { key: "type", label: "Type", sort: true },
        { key: "automation", label: "Automation", sort: true },
        { key: "links", label: "Instances", num: true, sort: true, sortVal: function (c) { return data.linksOfControl(c.id).length; }, render: function (c) { return String(data.linksOfControl(c.id).length); } },
        { key: "dk", label: "Derived key", render: function (c) { return keyBadge(ui, eng.derivedKey(c)); } },
        { key: "decl", label: "Declared", render: function (c) { return c.declaredKey ? ui.el("span", { class: "g-muted" }, "yes") : ui.el("span", { class: "g-muted" }, "-"); } }
      ], rows: rows, page: 15,
      onRow: function (c) { ctx.go("controls/" + c.id); }
    }));
  }

  /* ==SECTION:coverage== */
  function drawCoverage(bd, ctx) {
    var ui = ctx.ui, data = ctx.data, eng = ctx.engine.ctl;
    bd.innerHTML = "";
    var expMiss = [], noCtl = [], single = [];
    data.all("raus").forEach(function (r) {
      var cov = eng.coverage(r);
      cov.expectedMissing.forEach(function (x) {
        if (WAIVED[r.id + "|" + x.g.eventId + "|" + x.rule.id]) return;
        expMiss.push({ r: r, x: x });
      });
      cov.noControl.forEach(function (x) { noCtl.push({ r: r, x: x }); });
      cov.singlePoint.forEach(function (x) { single.push({ r: r, x: x }); });
    });
    bd.appendChild(ui.el("p", { class: "g-muted", style: "font-size:12.5px" },
      "Coverage is computed live from instances, ratings, links, and expected-control rules. Fixing a gap here updates every view immediately."));
    var c1 = ui.card({
      title: "Expected control missing (" + expMiss.length + "): the loudest gap",
      body: expMiss.length ? ui.table({
        cols: [
          { key: "rau", label: "RAU", render: function (y) { return ui.el("a", { href: "#/raus/" + y.r.id, onclick: function (e) { e.stopPropagation(); } }, y.r.id + " " + y.r.name); } },
          { key: "ev", label: "Risk instance", render: function (y) { var e = data.byId("riskEvents", y.x.g.eventId); return e ? e.name : y.x.g.eventId; } },
          { key: "exp", label: "Expected control", render: function (y) { return y.x.control ? ui.el("a", { href: "#/controls/" + y.x.control.id, onclick: function (e) { e.stopPropagation(); } }, y.x.control.name) : "-"; } },
          { key: "why", label: "Why expected", render: function (y) { return ui.el("span", { class: "g-muted", style: "font-size:12px" }, y.x.rule.note); } },
          { key: "fix", label: "", render: function (y) {
            return ui.el("button", { class: "g-btn sm g-btn--primary", onclick: function (e) {
              e.stopPropagation();
              data.addLink({ c: y.x.rule.controlId, r: y.r.id, e: y.x.g.eventId });
              GRC.traceAction(4, "Attaching an expected control");
              ui.toast("Expected control attached to " + y.r.id + ". Coverage recomputed.");
              drawCoverage(bd, ctx);
            } }, "Attach");
          } }
        ], rows: expMiss, page: 10,
        onRow: function (y) { ctx.go("attach/" + y.r.id + "/" + y.x.g.eventId); }
      }) : ui.empty("Every live expected-control situation is covered.")
    });
    c1.style.borderLeft = "4px solid var(--g-bad)";
    bd.appendChild(c1);
    bd.appendChild(ui.card({
      title: "High or Critical instances with no control (" + noCtl.length + ")",
      body: noCtl.length ? ui.table({
        cols: [
          { key: "rau", label: "RAU", render: function (y) { return ui.el("span", {}, [ui.el("span", { class: "g-mono g-muted" }, y.r.id + " "), y.r.name]); } },
          { key: "ev", label: "Risk instance", render: function (y) { var e = data.byId("riskEvents", y.x.g.eventId); return e ? e.name : y.x.g.eventId; } },
          { key: "band", label: "Inherent", render: function (y) { return bandBadge(ui, y.x.band); } },
          { key: "go", label: "", render: function () { return ui.el("button", { class: "g-btn sm" }, "Attach controls"); } }
        ], rows: noCtl, page: 10,
        onRow: function (y) { ctx.go("attach/" + y.r.id + "/" + y.x.g.eventId); }
      }) : ui.empty("No unmitigated High or Critical instances.")
    }));
    bd.appendChild(ui.card({
      title: "Single point of mitigation (" + single.length + "): one control carries the instance",
      body: single.length ? ui.table({
        cols: [
          { key: "rau", label: "RAU", render: function (y) { return ui.el("span", {}, [ui.el("span", { class: "g-mono g-muted" }, y.r.id + " "), y.r.name]); } },
          { key: "ev", label: "Risk instance", render: function (y) { var e = data.byId("riskEvents", y.x.g.eventId); return e ? e.name : y.x.g.eventId; } },
          { key: "band", label: "Inherent", render: function (y) { return bandBadge(ui, y.x.band); } },
          { key: "ctl", label: "The lone control", render: function (y) { return ui.el("a", { href: "#/controls/" + y.x.control.id, onclick: function (e) { e.stopPropagation(); } }, y.x.control.name); } }
        ], rows: single.slice(0, 300), page: 10,
        onRow: function (y) { ctx.go("attach/" + y.r.id + "/" + y.x.g.eventId); }
      }) : ui.empty("Nothing rides on a single control.")
    }));
  }

  /* ==SECTION:key-compare== */
  function drawKeyCompare(bd, ctx) {
    var ui = ctx.ui, data = ctx.data, eng = ctx.engine.ctl;
    bd.innerHTML = "";
    var overDeclared = [], underDeclared = [];
    data.all("controls").forEach(function (c) {
      var dk = eng.derivedKey(c);
      if (c.declaredKey && !dk.key) overDeclared.push({ c: c, dk: dk });
      if (!c.declaredKey && dk.key) underDeclared.push({ c: c, dk: dk });
    });
    bd.appendChild(ui.el("p", { style: "max-width:900px" }, [
      ui.el("b", {}, "Key status is a fact about the risk landscape, not an attribute someone once ticked. "),
      ui.el("span", {}, "Four transparent rules derive it: K1 sole mitigant on a High or Critical instance; K2 expected control for a live situation; K3 concentration across instances or RAUs; K4 mitigates a Critical instance. The rules recompute as ratings and links move; a checkbox goes stale the day after it is set.")]));
    function tbl(rows, showWhy) {
      return ui.table({
        cols: [
          { key: "id", label: "Control", render: function (y) { return ui.el("span", { class: "g-mono" }, y.c.id); } },
          { key: "name", label: "Name", render: function (y) { return ui.el("span", {}, [y.c.name, y.c.shared ? ui.el("span", { class: "g-badge g-badge--info", style: "margin-left:6px" }, "SHARED") : null]); } },
          { key: "own", label: "Owning RAU", render: function (y) { var r = data.byId("raus", y.c.owningRauId); return r ? ui.el("span", { class: "g-muted", style: "font-size:12px" }, r.id) : "-"; } },
          { key: "n", label: "Instances", num: true, render: function (y) { return String(data.linksOfControl(y.c.id).length); } },
          { key: "why", label: showWhy ? "Why it derives key" : "Why it does not", render: function (y) {
            return y.dk.rules.length ? ui.el("span", {}, y.dk.rules.map(function (r) { return ui.el("span", { class: "g-pill", style: "margin:1px 4px 1px 0;font-size:11px", title: r.text }, r.id); })) :
              ui.el("span", { class: "g-muted", style: "font-size:12px" }, "No rule holds: not sole on High/Critical, not expected, no concentration");
          } }
        ], rows: rows, page: 10,
        onRow: function (y) { ctx.go("controls/" + y.c.id); }
      });
    }
    bd.appendChild(ui.card({ title: "Declared key, derives non-key (" + overDeclared.length + ")", body: overDeclared.length ? tbl(overDeclared, false) : ui.empty("None.") }));
    bd.appendChild(ui.card({ title: "Derives key, never declared (" + underDeclared.length + ")", body: underDeclared.length ? tbl(underDeclared, true) : ui.empty("None.") }));
  }

  /* ==SECTION:detail== */
  function detail(el, ctx, params) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt, eng = ctx.engine.ctl;
    var c = data.byId("controls", params.id);
    if (!c) { el.appendChild(ui.empty("Unknown control " + params.id)); return; }
    var wrap = ui.el("div"); el.appendChild(wrap);
    function draw() {
      wrap.innerHTML = "";
      var dk = eng.derivedKey(c);
      var own = data.byId("raus", c.owningRauId);
      wrap.appendChild(ui.el("div", { class: "g-page-head" },
        ui.el("div", {}, [
          ui.el("div", { class: "g-muted", style: "font-size:12px;margin-bottom:2px" }, [ui.el("a", { href: "#/controls" }, "Controls"), " / " + c.id]),
          ui.el("div", { class: "g-row" }, [
            ui.el("span", { class: "g-h1" }, c.name),
            ui.el("span", { class: "g-mono g-muted" }, c.id),
            c.shared ? ui.badge("Shared", "info") : null,
            dk.key ? keyBadge(ui, dk) : null,
            ui.el("span", { class: "sp", style: "flex:1" }),
            ui.el("button", { class: "g-btn sm", title: "Second line: flag this control record as wrong, anytime", onclick: function () {
              GRC.challenge(ctx, { rauId: c.owningRauId, kind: "control", controlId: c.id, label: c.id + " " + c.name + " (owned by " + c.owningRauId + ", " + (dk.key ? "derives key" : "derives non-key") + ")" });
            } }, "Challenge")])])));
      var left = ui.el("div");
      function effSelect(field, note) {
        return ui.el("span", { class: "g-row", style: "gap:8px" }, [
          effBadge(ui, c[field]),
          ui.select({
            value: c[field], onchange: function (v) {
              data.setControlRating(c, field, v);
              GRC.traceAction(5, "Rating control " + (field === "design" ? "design" : "performance"));
              ui.toast("Control " + field + " set to " + v.replace("-", " ") + ". Effectiveness, environment strength, and residual recompute everywhere this control is linked.");
              draw();
            },
            options: [{ value: "effective", label: "effective" }, { value: "partially-effective", label: "partially effective" }, { value: "ineffective", label: "ineffective" }]
          }),
          note ? ui.el("span", { class: "g-muted", style: "font-size:12px" }, note) : null]);
      }
      left.appendChild(ui.card({
        title: "Attributes", body: ui.kv([
          ["Type", c.type], ["Automation", c.automation], ["Frequency", c.frequency],
          ["Control owner", c.owner],
          ["Owning RAU", own ? ui.el("a", { href: "#/raus/" + own.id }, own.id + " " + own.name) : c.owningRauId],
          ["Shared", c.shared ? "Yes: other RAUs may attach it" : "No: local to the owning RAU"],
          ["Status", c.status], ["Created", fmt.date(c.created)],
          ["Design rating", effSelect("design")],
          ["Performance rating", effSelect("perf", "owner judgment today; Capability 7 test results will feed this")],
          ["Effectiveness", ui.el("span", {}, [effBadge(ui, ctx.engine.rcsa.effectiveness(c)), ui.el("span", { class: "g-muted", style: "font-size:12px;margin-left:6px" }, "the weaker of design and performance; drives residual in Capability 5")])]])
      }));
      var lint = eng.lint(c);
      left.appendChild(ui.card({
        title: "Description and writing standard", body: ui.el("div", {}, [
          ui.el("p", { style: "margin:0 0 8px" }, c.desc || "-"),
          ui.el("div", {}, lint.map(function (k) {
            return ui.el("div", { class: "g-row", style: "padding:2px 0;font-size:12.5px" }, [
              ui.badge(k.ok ? "PASS" : "FIX", k.ok ? "ok" : "warn"), ui.el("span", {}, k.text)]);
          }))])
      }));
      var right = ui.el("div");
      right.appendChild(ui.card({
        title: "Key status: derived, not declared", body: ui.el("div", {}, [
          ui.el("div", { class: "g-row" }, [
            ui.el("span", {}, "Derived: "), dk.key ? ui.badge("KEY", "brand") : ui.badge("Non-key", ""),
            ui.el("span", { style: "margin-left:12px" }, "Declared: "), c.declaredKey ? ui.badge("KEY", "") : ui.badge("Non-key", "")]),
          dk.rules.length ? ui.el("ul", { style: "margin:8px 0 0;padding-left:20px;font-size:13px" }, dk.rules.map(function (r) { return ui.el("li", {}, r.id + ": " + r.text); })) :
            ui.el("p", { class: "g-muted", style: "font-size:12.5px;margin:8px 0 0" }, "No derivation rule holds right now. If a linked instance is later rated High or Critical, or an expected-control rule points here, this flips by itself."),
          (dk.key !== !!c.declaredKey) ? ui.el("p", { style: "margin:8px 0 0;font-size:12.5px;color:var(--g-warn)" }, "Derived and declared disagree. This is the case for deriving: the checkbox did not move when the landscape did.") : null])
      }));
      right.appendChild(ui.card({
        title: "Test history", body: ui.el("p", { class: "g-muted", style: "font-size:12.5px;margin:0" },
          "Design and operating test results arrive with Control Testing (Capability 7) and Audit Testing (Capability 8). This slot is reserved so the control record is already shaped for them.")
      }));
      wrap.appendChild(ui.el("div", { class: "g-split" }, [left, right]));
      var links = data.linksOfControl(c.id);
      var lb = ui.el("div");
      if (!links.length) lb.appendChild(ui.empty("Not linked to any risk instance."));
      else lb.appendChild(ui.table({
        cols: [
          { key: "rau", label: "RAU", render: function (ln) { var r = data.byId("raus", ln.r); return ui.el("a", { href: "#/raus/" + ln.r, onclick: function (e) { e.stopPropagation(); } }, r ? r.id + " " + r.name : ln.r); } },
          { key: "ev", label: "Risk instance", render: function (ln) { var e = data.byId("riskEvents", ln.e); return e ? ui.el("a", { href: "#/events/" + ln.e, onclick: function (x) { x.stopPropagation(); } }, e.name) : ln.e; } },
          { key: "band", label: "Inherent", render: function (ln) { return bandBadge(ui, eng.bandOf(ln.r, ln.e)); } },
          { key: "peers", label: "Controls on instance", num: true, render: function (ln) { return String(data.controlsOfInstance(ln.r, ln.e).length); } },
          { key: "un", label: "", render: function (ln) {
            return ui.el("button", { class: "g-btn sm", onclick: function (e) {
              e.stopPropagation();
              data.removeLink(ln);
              GRC.traceAction(4, "Unlinking a control");
              ui.toast("Unlinked from " + ln.r + ". Derived key and coverage recomputed.");
              draw();
            } }, "Unlink");
          } }
        ], rows: links, page: 10,
        onRow: function (ln) { ctx.go("attach/" + ln.r + "/" + ln.e); }
      }));
      wrap.appendChild(ui.card({ title: "Linked risk instances (" + links.length + ")", body: lb }));
    }
    draw();
  }

  /* ==SECTION:attach== */
  function attach(el, ctx, params) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt, eng = ctx.engine.ctl;
    var r = data.byId("raus", params.rauId);
    var ev = data.byId("riskEvents", params.eventId);
    if (!r || !ev) { el.appendChild(ui.empty("Unknown instance " + params.rauId + " / " + params.eventId)); return; }
    var g = data.regOfRau(r.id).filter(function (x) { return x.eventId === ev.id; })[0];
    var wrap = ui.el("div"); el.appendChild(wrap);
    var formOpen = false, formSeed = null;

    function draw() {
      wrap.innerHTML = "";
      var band = eng.bandOf(r.id, ev.id);
      var current = data.controlsOfInstance(r.id, ev.id);
      wrap.appendChild(ui.el("div", { class: "g-page-head" }, [
        ui.el("div", {}, [
          ui.el("div", { class: "g-muted", style: "font-size:12px;margin-bottom:2px" }, [
            ui.el("a", { href: "#/controls" }, "Controls"), " / attach"]),
          ui.el("div", { class: "g-row" }, [
            ui.el("span", { class: "g-h1" }, "Mitigation for one risk instance"),
            bandBadge(ui, band)]),
          ui.el("div", { class: "g-muted" }, [
            ui.el("a", { href: "#/raus/" + r.id }, r.id + " " + r.name),
            ui.el("span", {}, "  x  "),
            ui.el("a", { href: "#/events/" + ev.id }, ev.name),
            ui.el("span", {}, g ? "  (applicability " + g.score + ", confirmed by " + g.by + ")" : "  (no confirmed register row)")])]),
        ui.el("div", { class: "sp" }),
        ui.el("button", { class: "g-btn", onclick: function () { ctx.go("riskid/" + r.id); } }, "Back to workbench")]));

      var cur = ui.el("div");
      if (!current.length) cur.appendChild(ui.el("p", { class: "g-muted", style: "margin:0" }, "No controls attached yet. Start with the recommendations below."));
      current.forEach(function (c) {
        var ln = data.linksOfInstance(r.id, ev.id).filter(function (x) { return x.c === c.id; })[0];
        cur.appendChild(ui.el("div", { class: "g-row", style: "padding:5px 0;border-bottom:1px dashed var(--g-line-soft)" }, [
          ui.el("a", { href: "#/controls/" + c.id }, c.name),
          c.shared ? ui.el("span", { class: "g-badge g-badge--info" }, "SHARED") : null,
          keyBadge(ui, eng.derivedKey(c)),
          ui.el("span", { class: "g-muted", style: "font-size:12px" }, c.type + ", " + c.automation),
          ui.el("span", { class: "sp", style: "flex:1" }),
          ui.el("button", { class: "g-btn sm", onclick: function () {
            data.removeLink(ln);
            GRC.traceAction(4, "Unlinking a control");
            ui.toast(c.name + " unlinked.");
            draw();
          } }, "Unlink")]));
      });
      wrap.appendChild(ui.card({ title: "Attached controls (" + current.length + ")", body: cur }));

      var recs = ctx.engine.ctl.recs(r, ev.id);
      /* tier 1: expected */
      var t1 = ui.el("div");
      var liveRules = data.expectedFor(ev.id);
      if (!liveRules.length) t1.appendChild(ui.el("p", { class: "g-muted", style: "margin:0;font-size:12.5px" }, "No expected-control rule applies to this risk event."));
      liveRules.forEach(function (rule) {
        var c = data.byId("controls", rule.controlId);
        var attached = current.some(function (x) { return x.id === rule.controlId; });
        var waived = WAIVED[r.id + "|" + ev.id + "|" + rule.id];
        t1.appendChild(ui.el("div", { class: "g-row", style: "padding:6px 0;border-bottom:1px dashed var(--g-line-soft)" }, [
          ui.el("span", { style: "flex:1;min-width:280px" }, [
            ui.el("a", { href: "#/controls/" + c.id }, c.name),
            ui.el("span", { class: "g-muted", style: "display:block;font-size:12px" }, rule.note)]),
          attached ? ui.badge("Attached", "ok") :
            waived ? ui.el("span", { class: "g-badge g-badge--warn", title: waived }, "WAIVED (session)") :
              ui.el("span", { class: "g-row" }, [
                ui.el("button", { class: "g-btn sm g-btn--primary", onclick: function () {
                  data.addLink({ c: c.id, r: r.id, e: ev.id });
                  GRC.traceAction(4, "Attaching an expected control");
                  ui.toast("Expected control attached. Coverage and derived key recomputed.");
                  draw();
                } }, "Attach expected control"),
                ui.el("button", { class: "g-btn sm", onclick: function () {
                  var note = prompt("Waiving an expected control needs a documented reason:");
                  if (note) { WAIVED[r.id + "|" + ev.id + "|" + rule.id] = note; ui.toast("Waived for this session with a note."); draw(); }
                } }, "Waive")])]));
      });
      var c1 = ui.card({ title: "1. Expected for this situation", body: t1 });
      if (liveRules.length && liveRules.some(function (rule) { return !current.some(function (x) { return x.id === rule.controlId; }) && !WAIVED[r.id + "|" + ev.id + "|" + rule.id]; })) c1.style.borderLeft = "4px solid var(--g-bad)";
      wrap.appendChild(c1);

      /* tier 2: shareable matches */
      var t2 = ui.el("div");
      if (!recs.shared.length) t2.appendChild(ui.el("p", { class: "g-muted", style: "margin:0;font-size:12.5px" }, "No shareable controls are attached to this event on peer RAUs yet."));
      recs.shared.forEach(function (s) {
        var ownR = data.byId("raus", s.control.owningRauId);
        t2.appendChild(ui.el("div", { class: "g-row", style: "padding:6px 0;border-bottom:1px dashed var(--g-line-soft)" }, [
          ui.el("span", { style: "flex:1;min-width:280px" }, [
            ui.el("a", { href: "#/controls/" + s.control.id }, s.control.name),
            ui.el("span", { class: "g-muted", style: "display:block;font-size:12px" },
              "Owned by " + (ownR ? ownR.id : s.control.owningRauId) + "; already mitigates this event on " + s.instances + " instance" + (s.instances === 1 ? "" : "s") + " across " + s.raus + " RAU" + (s.raus === 1 ? "" : "s"))]),
          ui.el("span", { class: "g-muted", style: "font-size:12px" }, s.control.type + ", " + s.control.automation),
          ui.el("button", { class: "g-btn sm g-btn--primary", onclick: function () {
            data.addLink({ c: s.control.id, r: r.id, e: ev.id });
            GRC.traceAction(4, "Attaching a shared control");
            ui.toast("Shared control attached; no duplicate was created.");
            draw();
          } }, "Attach")]));
      });
      wrap.appendChild(ui.card({ title: "2. Shareable matches, ranked by attach rate", body: t2 }));

      /* tier 3: drafted skeleton */
      var sk = recs.skeleton;
      var t3 = ui.el("div", {}, [
        ui.el("div", { class: "g-row" }, [
          ui.el("b", {}, sk.name),
          ui.badge(sk.type, ""), ui.badge(sk.automation, ""), ui.badge(sk.frequency, "")]),
        ui.el("p", { style: "margin:6px 0;font-size:13px" }, sk.desc),
        ui.el("p", { class: "g-muted", style: "margin:0 0 8px;font-size:12px" }, sk.basis),
        ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { formSeed = sk; formOpen = true; draw(); } }, "Create from this draft"),
        ui.el("button", { class: "g-btn", style: "margin-left:8px", onclick: function () { formSeed = null; formOpen = true; draw(); } }, "Create blank")]);
      wrap.appendChild(ui.card({ title: "3. Drafted skeleton: a directional example, not a control", body: t3 }));

      if (formOpen) wrap.appendChild(createForm());
    }

    function createForm() {
      var m = {
        name: formSeed ? formSeed.name : "", desc: formSeed ? formSeed.desc : "",
        type: formSeed ? formSeed.type : "preventive", automation: formSeed ? formSeed.automation : "manual",
        frequency: formSeed ? formSeed.frequency : "per-event", shared: false
      };
      var dupWrap = ui.el("div");
      function drawDup() {
        dupWrap.innerHTML = "";
        var sims = ctx.engine.ctl.similar(m.name, r.id);
        if (!sims.length) return;
        dupWrap.appendChild(ui.el("div", { class: "g-label", style: "margin:8px 0 4px" }, "Similar controls already in the inventory (advisory only, nothing blocks you)"));
        sims.forEach(function (s) {
          dupWrap.appendChild(ui.el("div", { class: "g-row", style: "font-size:12.5px;padding:2px 0" }, [
            ui.el("a", { href: "#/controls/" + s.control.id }, s.control.name),
            s.control.shared ? ui.el("span", { class: "g-badge g-badge--info" }, "SHARED") : null,
            ui.el("span", { class: "g-muted" }, s.own ? "owned by this RAU" : "owned elsewhere")]));
        });
      }
      drawDup();
      function field(label, node) { return ui.el("div", { style: "margin-bottom:10px" }, [ui.el("div", { class: "g-label", style: "margin-bottom:4px" }, label), node]); }
      var body = ui.el("div", {}, [
        field("Control name", ui.el("input", { class: "g-input", style: "width:100%", value: m.name, oninput: function (e) { m.name = e.target.value; drawDup(); } })),
        field("Description (what, who, when, and what happens on exception)", ui.el("textarea", { class: "g-input", rows: "3", style: "width:100%", oninput: function (e) { m.desc = e.target.value; } }, m.desc)),
        ui.el("div", { class: "g-row" }, [
          ui.select({ label: "Type", value: m.type, onchange: function (v) { m.type = v; }, options: ["preventive", "detective", "corrective"] }),
          ui.select({ label: "Automation", value: m.automation, onchange: function (v) { m.automation = v; }, options: ["manual", "automated", "it-dependent"] }),
          ui.select({ label: "Frequency", value: m.frequency, onchange: function (v) { m.frequency = v; }, options: ["per-event", "daily", "weekly", "monthly", "quarterly", "annual"] }),
          ui.el("label", { class: "g-row", style: "gap:6px;font-size:13px" }, [
            ui.el("input", { type: "checkbox", onchange: function (e) { m.shared = e.target.checked; } }),
            "Offer as shared (other RAUs may attach it)"])]),
        dupWrap,
        ui.el("div", { class: "g-row", style: "margin-top:10px" }, [
          ui.el("button", { class: "g-btn g-btn--primary", onclick: function () {
            if (!m.name.trim() || m.desc.trim().length < 20) { ui.toast("Name the control and give it a real description first."); return; }
            var c = {
              id: "CTL-" + String(9000 + data.all("controls").filter(function (x) { return x.id.indexOf("CTL-9") === 0; }).length),
              name: m.name.trim(), desc: m.desc.trim(), owningRauId: r.id, shared: m.shared,
              type: m.type, automation: m.automation, frequency: m.frequency,
              owner: r.roles.owner, status: "active", created: fmt.today(),
              declaredKey: false, design: "effective", perf: "effective"
            };
            data.addControl(c);
            data.addLink({ c: c.id, r: r.id, e: ev.id });
            GRC.traceAction(4, "Creating a control from the drafted skeleton");
            ui.toast(c.id + " created, owned by this RAU, and attached. Key status will derive on its own.");
            formOpen = false; formSeed = null;
            draw();
          } }, "Create and attach"),
          ui.el("button", { class: "g-btn", onclick: function () { formOpen = false; draw(); } }, "Cancel")])]);
      return ui.card({ title: "New control, owned by " + r.id + " (light touch: no gate, advisory duplicate check)", body: body });
    }
    draw();
  }

  GRC.register({
    id: "controls", version: "1.1.0", tab: "RCSA",
    caps: {
      "controls": { primary: [4], uses: [2, 3] },
      "controls-coverage": { primary: [4], uses: [2, 3] },
      "controls-key": { primary: [4], uses: [2, 3] },
      "controls/:id": { primary: [4], uses: [2, 3], feeds: [5, 7, 8] },
      "attach/:rauId/:eventId": { primary: [4], uses: [2, 3], feeds: [5] }
    },
    rail: [{ label: "4. Controls", route: "controls", order: 24 }],
    routes: {
      "controls": landingFor("inv"),
      "controls-coverage": landingFor("cov"),
      "controls-key": landingFor("key"),
      "controls/:id": detail,
      "attach/:rauId/:eventId": attach
    }
  });
})();
