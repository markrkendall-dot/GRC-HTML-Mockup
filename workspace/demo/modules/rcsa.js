/* GRC modules/rcsa.js v1.0.0 2026-08-23 */
/* Capability 5: RCSA administration as a LIVING record. No staged cycle
   and no challenge tollgate: changes from capabilities 1-4 queue on the
   RAU for adoption, the owner signs one annual affirmation, the second
   line challenges any record at any time, and an attention view points
   ORBO and BACO at the non-standard so settled problems stay settled.
   Residual = inherent band knocked down by control environment strength
   (Strong two bands, Adequate one, Weak none) into High/Moderate/Low. */
(function () {
  "use strict";
  var DOPEN = {};        /* dashboard tree expansion */
  var REVIEWED = {};     /* session: attention items marked reviewed */
  var CF = { state: "" };/* challenge log filter */

  /* ==SECTION:badges== */
  function resBadge(ui, r) {
    if (!r) return ui.el("span", { class: "g-badge", title: "Inherent rating missing: residual cannot compute" }, "RATE FIRST");
    return ui.badge(r.charAt(0).toUpperCase() + r.slice(1), r === "low" ? "ok" : r === "moderate" ? "info" : "bad");
  }
  function envBadge(ui, env) {
    return ui.el("span", { class: "g-badge g-badge--" + (env.strength === "strong" ? "ok" : env.strength === "adequate" ? "warn" : "bad"), title: env.why.join("; ") }, env.strength);
  }
  function bandBadge(ui, b) {
    if (!b) return ui.el("span", { class: "g-muted" }, "unrated");
    return ui.badge(b.charAt(0).toUpperCase() + b.slice(1), b === "low" ? "ok" : b === "moderate" ? "info" : b === "high" ? "warn" : "bad");
  }
  function stateBadge(ui, st) {
    var map = {
      "current": ["Current", "ok"], "pending-changes": ["Changes pending", "info"],
      "due": ["Due", "warn"], "overdue": ["Overdue", "bad"], "never": ["Never affirmed", "bad"]
    };
    var m = map[st.state] || [st.state, ""];
    return ui.el("span", { class: "g-badge g-badge--" + m[1], title: st.days !== null ? st.days + " days since the last affirmation" : "No affirmation on record" }, m[0]);
  }
  function resStrip(ui, prof) {
    function seg(n, kind, l, t) { return n ? ui.el("span", { class: "g-badge g-badge--" + kind, style: "margin-right:4px", title: t }, n + l) : null; }
    return ui.el("span", {}, [
      seg(prof.high, "bad", "H", "High residual"), seg(prof.moderate, "info", "M", "Moderate residual"),
      seg(prof.low, "ok", "L", "Low residual"), seg(prof.unrated, "", "U", "Unrated: residual cannot compute")]);
  }
  function direction(ui, prof, aff) {
    if (!aff || !aff.snapshot) return null;
    var d = prof.high - aff.snapshot.high;
    if (d === 0) return ui.el("span", { class: "g-muted", style: "font-size:12px", title: "High-residual count unchanged since the last affirmation" }, "flat");
    var up = d > 0;
    return ui.el("span", { class: "g-badge g-badge--" + (up ? "bad" : "ok"), title: "High-residual instances vs the last affirmation snapshot" }, (up ? "+" : "") + d + " High");
  }

  /* ==SECTION:challenge-anywhere== */
  /* The in-universe sibling of the demo feedback drawer: "I think this
     thing in the system is wrong." Auto-captures the record reference
     and the challenger's current role; lands in the owner's queue. */
  GRC.challenge = function (ctx, target) {
    var ui = ctx.ui, data = ctx.data;
    var what = "", should = "";
    var body = ui.el("div");
    body.appendChild(ui.el("div", { class: "g-card", style: "border-left:4px solid var(--g-warn);padding:10px 14px" }, [
      ui.el("div", { class: "g-label" }, "Record under challenge"),
      ui.el("div", { style: "font-size:13px;margin-top:4px" }, target.label),
      ui.el("div", { class: "g-muted", style: "font-size:12px;margin-top:2px" }, "Filed as " + ctx.state.get("role") + "; routed to the RAU Owner's queue. Anytime, no tollgate.")]));
    function field(label, ph, on) {
      var ta = ui.el("textarea", { class: "g-input", rows: "3", style: "width:100%", placeholder: ph, oninput: function (e) { on(e.target.value); sync(); } });
      body.appendChild(ui.el("div", { style: "margin:10px 0" }, [ui.el("div", { class: "g-label", style: "margin-bottom:4px" }, label), ta]));
      return ta;
    }
    field("What looks wrong", "I think this thing in the system is wrong because...", function (v) { what = v; });
    field("What it should be", "The record should say / the rating should move to...", function (v) { should = v; });
    var send = ui.el("button", { class: "g-btn g-btn--primary", disabled: true, onclick: function () {
      var ch = {
        id: "CH-9" + String(100 + data.all("challenges").length).slice(-2) + String(data.all("challenges").length),
        rauId: target.rauId, kind: target.kind, eventId: target.eventId || null, controlId: target.controlId || null,
        what: what.trim(), should: should.trim(),
        by: ctx.state.get("role"), byName: "(session)", date: ctx.fmt.today(), state: "open"
      };
      data.addChallenge(ch);
      GRC.traceAction(5, "Filing a challenge");
      ui.toast(ch.id + " filed. It blocks affirmation of the affected line until resolved.");
      dr.close();
      GRC.go("rcsa/" + target.rauId);
    } }, "File the challenge");
    function sync() { send.disabled = !(what.trim() && should.trim()); }
    body.appendChild(send);
    var dr = ui.drawer({ title: "Challenge this record (second line)", body: body });
  };

  /* ==SECTION:landing== */
  function landingFor(fixed) {
    return function (el, ctx) {
      var ui = ctx.ui;
      var role = ctx.state.get("role") || "";
      var is2 = role.indexOf("ORBO") === 0 || role.indexOf("BACO") === 0;
      var active = fixed || (is2 ? "att" : "dash");
      el.appendChild(ui.el("div", { class: "g-page-head" },
        ui.el("div", {}, [
          ui.el("div", { class: "g-h1" }, "RCSA administration"),
          ui.el("div", { class: "g-muted" }, "A living assessment, not a staged cycle. Changes from capabilities 1 through 4 queue on each RAU for adoption; the owner signs one annual affirmation; the second line challenges anything, anytime. Residual = inherent knocked down by control environment strength.")])));
      el.appendChild(ui.tabs({
        active: active,
        items: [
          { id: "dash", label: "Affirmation dashboard", render: function (bd) { drawDash(bd, ctx); } },
          { id: "att", label: "2LOD attention", render: function (bd) { drawAttention(bd, ctx); } },
          { id: "chal", label: "Challenge log", render: function (bd) { drawChallenges(bd, ctx); } }
        ]
      }));
    };
  }

  /* ==SECTION:dashboard== */
  function drawDash(bd, ctx) {
    var ui = ctx.ui, data = ctx.data, R = ctx.engine.rcsa;
    bd.innerHTML = "";
    var memo = {};
    var wrap = ui.el("div", { class: "g-tablewrap" });
    var t = ui.el("table", { class: "g-table" });
    t.appendChild(ui.el("tr", {}, [
      ui.el("th", {}, "LOB / SubLOB / RAU"), ui.el("th", {}, "Affirmation"),
      ui.el("th", {}, "Residual profile"), ui.el("th", {}, "Direction"),
      ui.el("th", {}, "Last affirmed"), ui.el("th", { style: "text-align:right" }, "Pending / open")]));
    function rauRow(r) {
      var st = R.affState(r);
      var prof = R.profile(r, memo);
      var tr = ui.el("tr", { class: "tree-ind2 click" }, [
        ui.el("td", {}, [ui.el("span", { class: "g-mono g-muted" }, r.id + "  "), r.name]),
        ui.el("td", {}, stateBadge(ui, st)),
        ui.el("td", {}, resStrip(ui, prof)),
        ui.el("td", {}, direction(ui, prof, st.aff) || ui.el("span", { class: "g-muted" }, "-")),
        ui.el("td", {}, st.aff && st.aff.date ? ctx.fmt.date(st.aff.date) : "-"),
        ui.el("td", { class: "num" }, (st.pending || 0) + " / " + (st.openChal || 0))]);
      tr.onclick = function () { ctx.go("rcsa/" + r.id); };
      return tr;
    }
    data.lobs().forEach(function (lob) {
      var subs = data.subLobs().filter(function (s) { return s.parentId === lob.id; });
      var lobRaus = [];
      subs.forEach(function (s) { lobRaus = lobRaus.concat(data.rausOfSub(s.id).filter(function (r) { return data.regOfRau(r.id).some(function (g) { return g.status === "confirmed"; }); })); });
      if (!lobRaus.length) return;
      var counts = { current: 0, "pending-changes": 0, due: 0, overdue: 0, never: 0 };
      lobRaus.forEach(function (r) { counts[R.affState(r).state]++; });
      var open = !!DOPEN[lob.id];
      var lr = ui.el("tr", { class: "tree-parent click" }, [
        ui.el("td", {}, [ui.el("span", { class: "caret" + (open ? " open" : "") }), lob.name + "  (" + lobRaus.length + " RAUs)"]),
        ui.el("td", { colspan: "4" }, [
          counts.overdue ? ui.el("span", { class: "g-badge g-badge--bad", style: "margin-right:4px" }, counts.overdue + " overdue") : null,
          counts.due ? ui.el("span", { class: "g-badge g-badge--warn", style: "margin-right:4px" }, counts.due + " due") : null,
          counts["pending-changes"] ? ui.el("span", { class: "g-badge g-badge--info", style: "margin-right:4px" }, counts["pending-changes"] + " changes") : null,
          ui.el("span", { class: "g-badge g-badge--ok" }, counts.current + " current")]),
        ui.el("td", {}, "")]);
      lr.onclick = function () { DOPEN[lob.id] = !open; drawDash(bd, ctx); };
      t.appendChild(lr);
      if (!open) return;
      subs.forEach(function (s) {
        var rr = data.rausOfSub(s.id).filter(function (r) { return data.regOfRau(r.id).some(function (g) { return g.status === "confirmed"; }); });
        if (!rr.length) return;
        var sopen = !!DOPEN[s.id];
        var sr = ui.el("tr", { class: "tree-parent tree-ind1 click" }, [
          ui.el("td", { colspan: "5" }, [ui.el("span", { class: "caret" + (sopen ? " open" : "") }), s.name + "  (" + rr.length + ")"]),
          ui.el("td", {}, "")]);
        sr.onclick = function () { DOPEN[s.id] = !sopen; drawDash(bd, ctx); };
        t.appendChild(sr);
        if (!sopen) return;
        rr.forEach(function (r) { t.appendChild(rauRow(r)); });
      });
    });
    bd.appendChild(ui.el("p", { class: "g-muted", style: "font-size:12.5px" },
      "Expand in place. States: Current, Changes pending adoption, Due (the 60-day window before the anniversary), Overdue. Direction compares live High-residual count against the last affirmation snapshot."));
    wrap.appendChild(t);
    bd.appendChild(wrap);
  }

  /* ==SECTION:attention== */
  function drawAttention(bd, ctx) {
    var ui = ctx.ui, R = ctx.engine.rcsa;
    bd.innerHTML = "";
    var role = ctx.state.get("role") || "";
    var side = role.indexOf("ORBO") === 0 ? "operational" : role.indexOf("BACO") === 0 ? "compliance" : null;
    var items = R.attention(side).filter(function (x) {
      var key = x.kind + "|" + x.rau.id + "|" + (x.eventId || "") + "|" + (x.chId || "");
      return !REVIEWED[key];
    });
    bd.appendChild(ui.el("p", { style: "max-width:920px" }, [
      ui.el("b", {}, "The system points the second line at the non-standard and unfamiliar. "),
      ui.el("span", {}, "Peer outliers, applicability-versus-band mismatches, expected-control gaps, judgment-dense RAUs, aging unadopted changes, and open challenges, ranked. Settled items do not resurface." + (side ? " Viewing the " + side + " slice as " + role + "." : " Switch View as to ORBO or BACO for their slice."))]));
    var KIND = {
      outlier: ["Peer outlier", "bad"], mismatch: ["Score vs band", "warn"], "exp-gap": ["Expected gap", "bad"],
      overrides: ["Override dense", "warn"], changes: ["Unadopted changes", "info"], overdue: ["Overdue", "bad"], challenge: ["Challenge", "warn"]
    };
    if (!items.length) { bd.appendChild(ui.empty("Nothing non-standard right now. That is the point.")); return; }
    bd.appendChild(ui.table({
      cols: [
        { key: "k", label: "Signal", render: function (x) { var k = KIND[x.kind] || [x.kind, ""]; return ui.badge(k[0], k[1]); } },
        { key: "rau", label: "RAU", render: function (x) { return ui.el("span", {}, [ui.el("span", { class: "g-mono g-muted" }, x.rau.id + " "), x.rau.name]); } },
        { key: "ev", label: "Where", render: function (x) { if (!x.eventId) return ui.el("span", { class: "g-muted" }, "RAU level"); var e = ctx.data.byId("riskEvents", x.eventId); return e ? e.name : x.eventId; } },
        { key: "why", label: "Why it is here", render: function (x) { return ui.el("span", { style: "font-size:12.5px" }, x.reason); } },
        { key: "act", label: "", render: function (x) {
          return ui.el("span", { class: "g-row", style: "gap:6px" }, [
            ui.el("button", { class: "g-btn sm g-btn--primary", onclick: function (e) { e.stopPropagation(); ctx.go("rcsa/" + x.rau.id); } }, "Investigate"),
            ui.el("button", { class: "g-btn sm", title: "Reviewed and found acceptable; hidden for this session", onclick: function (e) {
              e.stopPropagation();
              REVIEWED[x.kind + "|" + x.rau.id + "|" + (x.eventId || "") + "|" + (x.chId || "")] = true;
              GRC.traceAction(5, "Marking an attention item reviewed");
              drawAttention(bd, ctx);
            } }, "Reviewed")]);
        } }
      ], rows: items.slice(0, 60), page: 12
    }));
  }

  /* ==SECTION:challenge-log== */
  function drawChallenges(bd, ctx) {
    var ui = ctx.ui, data = ctx.data;
    bd.innerHTML = "";
    var rows = data.all("challenges").filter(function (c) { return !CF.state || c.state === CF.state; });
    rows = rows.slice().sort(function (a, b) { return (a.state === "open" ? 0 : a.state === "responded" ? 1 : 2) - (b.state === "open" ? 0 : b.state === "responded" ? 1 : 2); });
    bd.appendChild(ui.toolbar([
      ui.select({
        label: "State", value: CF.state, onchange: function (v) { CF.state = v; drawChallenges(bd, ctx); },
        options: [{ value: "", label: "All" }, { value: "open", label: "Open" }, { value: "responded", label: "Responded" }, { value: "upheld", label: "Upheld" }, { value: "withdrawn", label: "Withdrawn" }]
      }),
      ui.el("span", { class: "g-muted", style: "font-size:12px" }, rows.length + " challenges")]));
    bd.appendChild(ui.table({
      cols: [
        { key: "id", label: "ID", render: function (c) { return ui.el("span", { class: "g-mono" }, c.id); } },
        { key: "rau", label: "RAU", render: function (c) { var r = data.byId("raus", c.rauId); return r ? ui.el("span", {}, [ui.el("span", { class: "g-mono g-muted" }, r.id + " "), r.name]) : c.rauId; } },
        { key: "kind", label: "Target", render: function (c) { return ui.badge(c.kind, ""); } },
        { key: "what", label: "The challenge", render: function (c) { return ui.el("span", { style: "font-size:12.5px" }, c.what); } },
        { key: "by", label: "By", render: function (c) { return ui.el("span", { class: "g-muted", style: "font-size:12px" }, c.by); } },
        { key: "date", label: "Filed", sort: true, render: function (c) { return ctx.fmt.date(c.date); } },
        { key: "state", label: "State", render: function (c) { return chStateBadge(ui, c.state); } }
      ], rows: rows, page: 12,
      onRow: function (c) { ctx.go("rcsa/" + c.rauId); }
    }));
  }
  function chStateBadge(ui, s) {
    return ui.badge(s, s === "open" ? "bad" : s === "responded" ? "warn" : s === "upheld" ? "info" : "ok");
  }

  /* ==SECTION:workspace== */
  function workspace(el, ctx, params) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt, R = ctx.engine.rcsa;
    var r = data.byId("raus", params.rauId);
    if (!r) { el.appendChild(ui.empty("Unknown RAU " + params.rauId)); return; }
    var wrap = ui.el("div"); el.appendChild(wrap);

    function draw() {
      wrap.innerHTML = "";
      var memo = {};
      var st = R.affState(r);
      var prof = R.profile(r, memo);
      var chs = data.challengesOf(r.id);
      var openCh = chs.filter(function (c) { return c.state === "open" || c.state === "responded"; });
      var pending = (st.aff && st.aff.pending) || [];

      wrap.appendChild(ui.el("div", { class: "g-page-head" }, [
        ui.el("div", {}, [
          ui.el("div", { class: "g-muted", style: "font-size:12px;margin-bottom:2px" }, [
            ui.el("a", { href: "#/rcsa" }, "RCSA administration"), " / " + r.id]),
          ui.el("div", { class: "g-row" }, [
            ui.el("span", { class: "g-h1" }, "Assessment workspace"),
            ui.el("a", { href: "#/raus/" + r.id, class: "g-mono" }, r.id), ui.el("span", {}, r.name),
            stateBadge(ui, st), resStrip(ui, prof), direction(ui, prof, st.aff)]),
          ui.el("div", { class: "g-muted" }, st.aff && st.aff.date ?
            "Last affirmed " + fmt.date(st.aff.date) + " by " + st.aff.by + " (" + st.days + " days ago). The record lives; the signature is annual." :
            "Never affirmed. Build the record below, then sign.")])]));

      /* what changed since the last affirmation */
      var pc = ui.el("div");
      if (!pending.length) pc.appendChild(ui.el("p", { class: "g-muted", style: "margin:0;font-size:12.5px" }, "Nothing pending. Changes from capabilities 1 through 4 will queue here as they happen."));
      pending.slice().forEach(function (p) {
        pc.appendChild(ui.el("div", { class: "g-row", style: "padding:5px 0;border-bottom:1px dashed var(--g-line-soft)" }, [
          ui.badge(p.kind, "info"),
          ui.el("span", { style: "flex:1;min-width:260px;font-size:13px" }, p.text),
          ui.el("span", { class: "g-muted", style: "font-size:12px" }, fmt.date(p.date)),
          ui.el("button", { class: "g-btn sm", onclick: function () {
            data.adoptChange(r.id, p);
            GRC.traceAction(5, "Adopting a change");
            ui.toast("Change adopted into the living record.");
            draw();
          } }, "Adopt")]));
      });
      if (pending.length > 1) {
        pc.appendChild(ui.el("div", { style: "margin-top:8px" },
          ui.el("button", { class: "g-btn sm", onclick: function () {
            pending.slice().forEach(function (p) { data.adoptChange(r.id, p); });
            GRC.traceAction(5, "Adopting all changes");
            ui.toast("All pending changes adopted.");
            draw();
          } }, "Adopt all " + pending.length)));
      }
      var pcard = ui.card({ title: "What changed since the last affirmation (" + pending.length + ")", body: pc });
      if (pending.length) pcard.style.borderLeft = "4px solid var(--g-info)";
      wrap.appendChild(pcard);

      /* the lines */
      var lines = prof.lines.slice().sort(function (a, b) {
        var ord = { high: 0, moderate: 1, low: 2 };
        var av = a.res ? ord[a.res.residual] : -1, bv = b.res ? ord[b.res.residual] : -1;
        return av - bv;
      });
      var changedEv = {};
      pending.forEach(function (p) { if (p.eventId) changedEv[p.eventId] = true; });
      var chalByEv = {};
      openCh.forEach(function (c) { if (c.eventId) (chalByEv[c.eventId] = chalByEv[c.eventId] || []).push(c); });
      var lt = ui.el("div");
      lt.appendChild(ui.table({
        cols: [
          { key: "ev", label: "Risk instance", render: function (ln) {
            var e = data.byId("riskEvents", ln.g.eventId);
            return ui.el("span", {}, [
              e ? e.name : ln.g.eventId,
              changedEv[ln.g.eventId] ? ui.el("span", { class: "g-badge g-badge--info", style: "margin-left:6px", title: "Touched by an unadopted change" }, "CHANGED") : null,
              chalByEv[ln.g.eventId] ? ui.el("span", { class: "g-badge g-badge--bad", style: "margin-left:6px", title: chalByEv[ln.g.eventId].map(function (c) { return c.id + " " + c.state; }).join(", ") }, "CHALLENGED") : null]);
          } },
          { key: "app", label: "Applicability", num: true, render: function (ln) { return String(ln.g.score); } },
          { key: "inh", label: "Inherent", render: function (ln) {
            var b = bandBadge(ui, ln.band);
            var a2 = ui.el("a", { href: "#", onclick: function (e) { e.preventDefault(); e.stopPropagation(); ctx.state.set("inhFocus", ln.g.eventId); ctx.go("inherent/" + r.id); } }, [b]);
            return a2;
          } },
          { key: "env", label: "Control environment", render: function (ln) {
            var e2 = envBadge(ui, ln.env);
            var a2 = ui.el("a", { href: "#", onclick: function (e) { e.preventDefault(); e.stopPropagation(); ctx.go("attach/" + r.id + "/" + ln.g.eventId); } }, [e2]);
            return a2;
          } },
          { key: "res", label: "Residual", render: function (ln) { return resBadge(ui, ln.res ? ln.res.residual : null); } },
          { key: "why", label: "Math", render: function (ln) {
            if (!ln.res) return ui.el("span", { class: "g-muted", style: "font-size:12px" }, "needs a rating");
            return ui.el("span", { class: "g-muted", style: "font-size:12px", title: ln.env.why.join("; ") }, ln.band + " knocked down " + ln.res.knock);
          } },
          { key: "ch", label: "", render: function (ln) {
            var e = data.byId("riskEvents", ln.g.eventId);
            return ui.el("button", { class: "g-btn sm", title: "Second line: flag this line as wrong, anytime", onclick: function (ev2) {
              ev2.stopPropagation();
              GRC.challenge(ctx, { rauId: r.id, kind: "line", eventId: ln.g.eventId, label: r.id + " " + r.name + ": " + (e ? e.name : ln.g.eventId) + " (inherent " + (ln.band || "unrated") + ", environment " + ln.env.strength + ", residual " + (ln.res ? ln.res.residual : "n/a") + ")" });
            } }, "Challenge");
          } }
        ], rows: lines, page: 15
      }));
      wrap.appendChild(ui.card({ title: "Assessment lines (" + lines.length + "): inherent x control environment = residual", body: lt }));

      /* affirmation gate */
      var unrated = prof.unrated;
      var ok1 = unrated === 0, ok2 = pending.length === 0, ok3 = openCh.length === 0;
      var gate = ui.el("div");
      function gateRow(ok, text, action) {
        return ui.el("div", { class: "g-row", style: "padding:3px 0" }, [
          ui.badge(ok ? "CLEAR" : "BLOCKS", ok ? "ok" : "bad"),
          ui.el("span", { style: "flex:1" }, text), action || null]);
      }
      gate.appendChild(gateRow(ok1, ok1 ? "Every confirmed instance is rated" : unrated + " instance" + (unrated === 1 ? "" : "s") + " unrated: residual cannot compute",
        ok1 ? null : ui.el("button", { class: "g-btn sm", onclick: function () { ctx.go("inherent/" + r.id); } }, "Open worksheet")));
      gate.appendChild(gateRow(ok2, ok2 ? "No unadopted changes" : pending.length + " change" + (pending.length === 1 ? "" : "s") + " await adoption (card above)"));
      gate.appendChild(gateRow(ok3, ok3 ? "No open challenges" : openCh.length + " challenge" + (openCh.length === 1 ? "" : "s") + " open or awaiting resolution (log below)"));
      var canAffirm = ok1 && ok2 && ok3;
      var affirmBtn = ui.el("button", { class: "g-btn g-btn--primary", title: canAffirm ? "Sign the annual affirmation as the RAU Owner" : "Clear the blockers above first", onclick: function () {
        if (!canAffirm) return;
        data.affirm(r.id, ctx.state.get("role") + " (session)", { high: prof.high, moderate: prof.moderate, low: prof.low, lines: prof.lines.length });
        GRC.traceAction(5, "Signing the annual affirmation");
        ui.toast(r.id + " affirmed. The snapshot is stored; the record keeps living.");
        draw();
      } }, "Affirm this RCSA");
      affirmBtn.disabled = !canAffirm;
      gate.appendChild(ui.el("div", { class: "g-row", style: "margin-top:10px" }, [
        affirmBtn,
        ui.el("span", { class: "g-muted", style: "font-size:12.5px" }, "The owner signs; there is no second-line tollgate. Challenge is continuous, not a stage.")]));
      wrap.appendChild(ui.card({ title: "Annual affirmation", body: gate }));

      /* challenge log for this RAU */
      var cl = ui.el("div");
      if (!chs.length) cl.appendChild(ui.el("p", { class: "g-muted", style: "margin:0;font-size:12.5px" }, "No challenges on this RAU. The second line files them from any record, anytime."));
      chs.slice().sort(function (a, b) { return a.state === "open" ? -1 : 1; }).forEach(function (c) {
        var e = c.eventId ? data.byId("riskEvents", c.eventId) : null;
        var box = ui.el("div", { class: "g-card", style: "padding:10px 14px;margin-bottom:8px" + (c.state === "open" ? ";border-left:4px solid var(--g-bad)" : "") });
        box.appendChild(ui.el("div", { class: "g-row" }, [
          ui.el("span", { class: "g-mono g-muted" }, c.id), chStateBadge(ui, c.state), ui.badge(c.kind, ""),
          e ? ui.el("span", { style: "font-size:13px" }, e.name) : null,
          ui.el("span", { class: "sp", style: "flex:1" }),
          ui.el("span", { class: "g-muted", style: "font-size:12px" }, c.by + ", " + fmt.date(c.date))]));
        box.appendChild(ui.el("p", { style: "margin:6px 0 2px;font-size:13px" }, [ui.el("b", {}, "Wrong: "), c.what]));
        box.appendChild(ui.el("p", { style: "margin:2px 0;font-size:13px" }, [ui.el("b", {}, "Should be: "), c.should]));
        if (c.response) box.appendChild(ui.el("p", { style: "margin:6px 0 2px;font-size:13px;color:var(--g-muted)" }, [ui.el("b", {}, "Owner response: "), c.response + " (" + (c.respondedBy || "") + ", " + fmt.date(c.respondedDate) + ")"]));
        if (c.state === "open") {
          box.appendChild(ui.el("div", { class: "g-row", style: "margin-top:8px" }, [
            ui.el("button", { class: "g-btn sm g-btn--primary", onclick: function () { respond(c, true); } }, "Agree, change made"),
            ui.el("button", { class: "g-btn sm", onclick: function () { respond(c, false); } }, "Explain, it stands")]));
        } else if (c.state === "responded") {
          box.appendChild(ui.el("div", { class: "g-row", style: "margin-top:8px" }, [
            ui.el("span", { class: "g-muted", style: "font-size:12.5px" }, "Challenger resolves:"),
            ui.el("button", { class: "g-btn sm g-btn--primary", onclick: function () { c.state = "upheld"; c.resolvedDate = fmt.today(); GRC.traceAction(5, "Resolving a challenge"); ui.toast(c.id + " upheld and closed."); draw(); } }, "Uphold"),
            ui.el("button", { class: "g-btn sm", onclick: function () { c.state = "withdrawn"; c.resolvedDate = fmt.today(); GRC.traceAction(5, "Resolving a challenge"); ui.toast(c.id + " withdrawn."); draw(); } }, "Withdraw")]));
        }
        cl.appendChild(box);
      });
      function respond(c, agree) {
        var txt = prompt(agree ? "Describe the change made (recorded as the owner response):" : "Explain why the record stands (recorded as the owner response):");
        if (!txt) return;
        c.response = txt;
        c.respondedBy = ctx.state.get("role") + " (session)";
        c.respondedDate = fmt.today();
        c.state = "responded";
        GRC.traceAction(5, agree ? "Answering a challenge: change made" : "Answering a challenge: record stands");
        ui.toast(c.id + " answered. The challenger resolves it: uphold or withdraw.");
        draw();
      }
      wrap.appendChild(ui.card({ title: "Challenges on this RAU (" + chs.length + ")", body: cl }));
    }
    draw();
  }

  GRC.register({
    id: "rcsa", version: "1.0.0", tab: "RCSA",
    caps: {
      "rcsa": { primary: [5], uses: [3, 4] },
      "rcsa-attention": { primary: [5], uses: [2, 3, 4] },
      "rcsa-challenges": { primary: [5] },
      "rcsa/:rauId": { primary: [5], uses: [1, 2, 3, 4] }
    },
    rail: [{ label: "5. RCSA administration", route: "rcsa", order: 26 }],
    routes: {
      "rcsa": landingFor(null),
      "rcsa-attention": landingFor("att"),
      "rcsa-challenges": landingFor("chal"),
      "rcsa/:rauId": workspace
    }
  });
})();
