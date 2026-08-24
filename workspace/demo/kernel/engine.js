/* GRC kernel/engine.js v1.3.0 2026-08-23 */
/* The applicability engine: deterministic, rubric-standardized attribute
   comparison between a RAU's metadata and Risk Event / MCR profiles.
   Same math for all 850 RAUs. Mirrors tools-dev/generate-data.js exactly
   so shipped confirmations reconcile with live scores. */
(function () {
  "use strict";
  var GRC = window.GRC = window.GRC || {};

  function rubric() {
    var d = window.GRC_DATA && window.GRC_DATA.rubric;
    return (GRC.ctx && GRC.ctx.data ? GRC.ctx.data.rubric() : (d && d.def)) || { bands: { likely: 70, possible: 40 }, categories: [], questions: [] };
  }

  /* ==SECTION:score== */
  function score(rau, cand) {
    var R = rubric();
    var rauTags = (rau.meta && rau.meta.tags) || [];
    var candTags = cand.tags || [];
    var byNs = {};
    R.categories.forEach(function (c) { byNs[c.key] = { r: [], c: [] }; });
    function put(t, side) {
      var i = t.indexOf(":"); if (i < 0) return;
      var ns = t.slice(0, i);
      if (byNs[ns]) byNs[ns][side].push(t);
    }
    rauTags.forEach(function (t) { put(t, "r"); });
    candTags.forEach(function (t) { put(t, "c"); });
    var total = 0, wsum = 0, cats = {};
    R.categories.forEach(function (c) {
      var b = byNs[c.key];
      var shared = b.c.filter(function (t) { return b.r.indexOf(t) >= 0; }).length;
      var s;
      if (b.c.length === 0) s = 3;            /* candidate silent on theme */
      else if (shared === 0) s = 1;
      else if (shared === 1) s = b.c.length === 1 ? 4 : 3;
      else if (shared === 2) s = 4;
      else s = 5;
      cats[c.key] = s;
      total += s * c.weight; wsum += 5 * c.weight;
    });
    var pct = Math.round(100 * total / wsum);
    var band = pct >= R.bands.likely ? "likely" : pct >= R.bands.possible ? "possible" : "unlikely";
    return { pct: pct, cats: cats, band: band };
  }

  /* ==SECTION:suppression== */
  function suppressedBy(rau, cand) {
    var ex = cand.excludedBy || [];
    var re = (rau.meta && rau.meta.excl) || [];
    for (var i = 0; i < ex.length; i++) { if (re.indexOf(ex[i]) >= 0) return ex[i]; }
    return null;
  }

  /* ==SECTION:candidates== */
  function candidates(rau) {
    var data = GRC.ctx.data;
    var out = { scored: [], suppressed: [] };
    data.all("riskEvents").forEach(function (ev) {
      var sup = suppressedBy(rau, ev);
      if (sup) { out.suppressed.push({ ev: ev, topic: sup }); return; }
      var sc = score(rau, ev);
      out.scored.push({ ev: ev, pct: sc.pct, cats: sc.cats, band: sc.band });
    });
    out.scored.sort(function (a, b) { return b.pct - a.pct; });
    return out;
  }
  function zones(scored) {
    var z = { likely: [], middle: [], unlikely: [] };
    scored.forEach(function (s) {
      if (s.band === "likely") z.likely.push(s);
      else if (s.band === "possible") z.middle.push(s);
      else z.unlikely.push(s);
    });
    return z;
  }
  function mcrCandidates(rau, eventId) {
    var data = GRC.ctx.data;
    var all = data.mcrsOfEvent(eventId);
    var head = [], tail = 0;
    all.forEach(function (m) {
      if (m.head) { var sc = score(rau, m); head.push({ mcr: m, pct: sc.pct, band: sc.band }); }
      else tail++;
    });
    head.sort(function (a, b) { return b.pct - a.pct; });
    return { head: head, tailCount: tail, total: all.length };
  }

  /* ==SECTION:disambiguation== */
  /* Questions that can push an ambiguous candidate out of the middle.
     Answering updates the RAU's session metadata, so every candidate
     rescoreds consistently - one answer moves the whole stack. */
  function questionsFor(rau, cand) {
    var R = rubric();
    rau._qa = rau._qa || {};
    var candNs = {};
    (cand.tags || []).forEach(function (t) { candNs[t.slice(0, t.indexOf(":"))] = true; });
    return R.questions.filter(function (q) {
      if (rau._qa[q.id] !== undefined) return false;
      if (!candNs[q.cat]) return false;
      if (((rau.meta && rau.meta.tags) || []).indexOf(q.tag) >= 0) return false;
      return true;
    }).slice(0, 3);
  }
  function answer(rau, q, yes) {
    rau._qa = rau._qa || {};
    rau._qa[q.id] = yes ? "yes" : "no";
    if (yes && rau.meta.tags.indexOf(q.tag) < 0) rau.meta.tags.push(q.tag);
    if (rau.metaAnswers) {
      rau.metaAnswers.push({ q: q.id, v: yes ? "yes" : "no", src: "user", late: true });
    }
  }

  /* ==SECTION:mcr-fit== */
  /* Goodness of fit: how well an MCR sits inside its parent risk event,
     and whether another event fits it better. A weak or beaten fit marks
     the MCR as a rewrite or realignment candidate, often a sign the
     requirement spans two risk event ideas. */
  var fitCache = {};
  function mcrFit(mcr) {
    if (fitCache[mcr.id]) return fitCache[mcr.id];
    var data = GRC.ctx.data;
    var parent = data.byId("riskEvents", mcr.parentEventId);
    var asRau = function (ev) { return { meta: { tags: ev.tags || [], excl: [] } }; };
    var parentPct = parent ? score(asRau(parent), mcr).pct : 0;
    var bestAlt = null, bestPct = -1;
    data.all("riskEvents").forEach(function (ev) {
      if (ev.side !== "compliance" || ev.id === mcr.parentEventId) return;
      var p = score(asRau(ev), mcr).pct;
      if (p > bestPct) { bestPct = p; bestAlt = ev; }
    });
    var verdict = "good";
    if (bestPct >= parentPct + 8) verdict = "realign";
    else if (parentPct < 55) verdict = "weak";
    var out = { parentPct: parentPct, bestAlt: bestAlt, bestAltPct: bestPct, verdict: verdict };
    fitCache[mcr.id] = out;
    return out;
  }

  /* ==SECTION:inherent== */
  /* Capability 3: evidence-anchored inherent rating. Likelihood x impact,
     5 levels each; impact = the worst credible outcome across four
     fact-anchored lenses. Level math mirrors tools-dev/generate-data.js
     exactly so shipped ratings reconcile with live suggestions. Chips are
     built at runtime only. Reputational is a derived flag, not a lens. */
  var INH = {
    likelihood: [
      { n: "Rare", a: "Less than once in 10 years" },
      { n: "Unlikely", a: "Once in 3 to 10 years" },
      { n: "Possible", a: "Once in 1 to 3 years" },
      { n: "Likely", a: "1 to 12 times a year" },
      { n: "Expected", a: "12 or more times a year" }],
    lenses: [
      { key: "fin", label: "Financial", a: ["Under $50k", "$50k to $500k", "$500k to $5M", "$5M to $25M", "Over $25M"] },
      { key: "cust", label: "Customer", a: ["Under 10 customers", "10 to 100 customers", "100 to 10,000 customers", "10,000 to 100,000 customers", "Over 100,000 or systemic restitution"] },
      { key: "reg", label: "Regulatory", a: ["No obligation nexus", "Obligation nexus; informal criticism plausible", "MRA-class finding plausible", "Civil money penalty or formal action plausible", "Consent order or license-threatening"] },
      { key: "ops", label: "Operational disruption", a: ["Under 1 hour of degradation", "Under 1 day", "1 to 3 days, or a week of backlog", "3 to 10 days", "Over 10 days, or market-facing outage"] }],
    grid: [ /* [impact-1][likelihood-1] -> band */
      ["low", "low", "moderate", "moderate", "high"],
      ["low", "moderate", "moderate", "high", "high"],
      ["low", "moderate", "high", "high", "critical"],
      ["moderate", "high", "high", "critical", "critical"],
      ["moderate", "high", "critical", "critical", "critical"]],
    bands: ["low", "moderate", "high", "critical"]
  };
  function clamp5(x) { return x < 1 ? 1 : x > 5 ? 5 : x; }
  function hasTag(rau, prefix) {
    var tags = (rau.meta && rau.meta.tags) || [];
    for (var i = 0; i < tags.length; i++) { if (tags[i].indexOf(prefix) === 0) return tags[i]; }
    return null;
  }
  /* MIRRORED in generate-data.js: keep byte-for-byte logic identical. */
  function inherentLevels(rau, ev, mcrN) {
    var vol = rau.annualVolume || 0;
    var err = ev.errClass || 3, sev = ev.sevClass || 3;
    var l = 1 + (vol >= 6000000 ? 3 : vol >= 2500000 ? 2 : vol >= 500000 ? 1 : 0);
    if (err >= 4) l += 1;
    if ((rau.priorLosses12m || 0) > 0) l += 1;
    if (rau.changeLevel === "high") l += 1;
    if (err <= 1) l -= 1;
    var mm = hasTag(rau, "mm:");
    var moves = mm && mm !== "mm:no-money-movement";
    var fin = sev + (moves && vol >= 2500000 ? 1 : 0);
    var cust = 1;
    if (hasTag(rau, "cust:consumer")) {
      cust = vol >= 2500000 ? 4 : vol >= 500000 ? 3 : 2;
      if (ev.side === "compliance" && mcrN >= 5) cust += 1;
    }
    var reg;
    if (ev.side === "compliance") reg = 2 + (mcrN >= 3 ? 1 : 0) + (ev.enfFlag ? 1 : 0);
    else reg = 1 + (ev.enfFlag ? 1 : 0);
    var ho = (rau.handoffs || []).length;
    var ops = 1 + (ho >= 6 ? 2 : ho >= 3 ? 1 : 0) + (vol >= 2500000 ? 1 : 0) + (err >= 5 ? 1 : 0);
    return { l: clamp5(l), fin: clamp5(fin), cust: clamp5(cust), reg: clamp5(reg), ops: clamp5(ops) };
  }
  function inherentBand(levels) {
    var impact = Math.max(levels.fin, levels.cust, levels.reg, levels.ops);
    var driver = null;
    INH.lenses.forEach(function (x) { if (!driver && levels[x.key] === impact) driver = x; });
    return { impact: impact, driver: driver, band: INH.grid[impact - 1][levels.l - 1] };
  }
  function levelsFromArray(a) { return { l: a[0], fin: a[1], cust: a[2], reg: a[3], ops: a[4] }; }
  function inherentSuggest(rau, ev, regRow) {
    var mcrN = regRow && regRow.mcrIds ? regRow.mcrIds.length : 0;
    var lv = inherentLevels(rau, ev, mcrN);
    var vol = rau.annualVolume || 0;
    var chips = { l: [], fin: [], cust: [], reg: [], ops: [] };
    function num(x) { return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
    chips.l.push("Annual volume " + num(vol) + " items (RAU profile)");
    chips.l.push("Error propensity class " + (ev.errClass || 3) + " of 5 (event profile)");
    if ((rau.priorLosses12m || 0) > 0) chips.l.push("Prior 12-month losses $" + num(rau.priorLosses12m) + " (RAU profile)");
    if (rau.changeLevel === "high") chips.l.push("Change level high (RAU profile)");
    chips.fin.push("Typical severity class " + (ev.sevClass || 3) + " of 5 (event profile)");
    var mm = hasTag(rau, "mm:");
    if (mm && mm !== "mm:no-money-movement") chips.fin.push("Money movement: " + mm.slice(3) + (vol >= 2500000 ? " at high volume" : "") + " (metadata)");
    if (hasTag(rau, "cust:consumer")) {
      chips.cust.push("Consumer-facing (metadata survey)");
      chips.cust.push("Volume scales a credible event to the " + INH.lenses[1].a[lv.cust - 1].toLowerCase() + " range");
      if (ev.side === "compliance" && mcrN >= 5) chips.cust.push(mcrN + " MCRs attached: restitution-program potential (register)");
    } else chips.cust.push("No direct consumer contact (metadata survey)");
    if (ev.side === "compliance") {
      chips.reg.push(mcrN + " MCR" + (mcrN === 1 ? "" : "s") + " attached to this instance (register)");
      if (ev.enfFlag) chips.reg.push("Enforcement history in this obligation family (event profile)");
    } else {
      chips.reg.push(ev.enfFlag ? "Regulatory overlay on this event type (event profile)" : "Limited obligation nexus (event profile)");
    }
    var ho = (rau.handoffs || []).length;
    chips.ops.push(ho + " handoff dependencies (process map)");
    if (vol >= 2500000) chips.ops.push("High volume amplifies backlog risk (RAU profile)");
    var bb = inherentBand(lv);
    var rep = lv.cust >= 4 || lv.reg >= 4 || (ev.visClass || 1) >= 3;
    return { levels: lv, impact: bb.impact, driver: bb.driver, band: bb.band, rep: rep, chips: chips };
  }
  /* RAU rollup: highest final band wins, named drivers, count strip. */
  function inherentOf(rau) {
    var data = GRC.ctx.data;
    var counts = { critical: 0, high: 0, moderate: 0, low: 0 };
    var confirmed = 0, rated = 0, best = -1, drivers = [];
    data.regOfRau(rau.id).forEach(function (g) {
      if (g.status !== "confirmed") return;
      confirmed++;
      var t = data.ratingOf(rau.id, g.eventId);
      if (!t) return;
      rated++;
      var bb = inherentBand(levelsFromArray(t.f));
      counts[bb.band]++;
      var bi = INH.bands.indexOf(bb.band);
      if (bi > best) { best = bi; drivers = []; }
      if (bi === best) {
        var ev = data.byId("riskEvents", g.eventId);
        if (drivers.length < 3) drivers.push(ev ? ev.name : g.eventId);
      }
    });
    return { band: best >= 0 ? INH.bands[best] : null, counts: counts, drivers: drivers, rated: rated, confirmed: confirmed };
  }
  /* Peer consistency: final band vs the LOB median for the same event. */
  function peerOutlier(rau, eventId, finalLevels) {
    var data = GRC.ctx.data;
    var lobId = data.orgPath(rau.subLobId).lobId;
    var idx = [];
    data.ratingsOfEvent(eventId).forEach(function (t) {
      if (t.rauId === rau.id) return;
      var r = data.byId("raus", t.rauId);
      if (!r || data.orgPath(r.subLobId).lobId !== lobId) return;
      idx.push(INH.bands.indexOf(inherentBand(levelsFromArray(t.f)).band));
    });
    if (idx.length < 3) return null;
    idx.sort(function (a, b) { return a - b; });
    var med = idx[Math.floor(idx.length / 2)];
    var mine = INH.bands.indexOf(inherentBand(finalLevels).band);
    if (Math.abs(mine - med) < 2) return null;
    return { peers: idx.length, median: INH.bands[med], mine: INH.bands[mine] };
  }

  /* ==SECTION:controls== */
  /* Capability 4: controls attach to risk instances. Key status is
     DERIVED from the live risk landscape, never self-declared; the
     declared checkbox survives only to show the disagreements. */
  function ctlBandOf(rauId, eventId) {
    var data = GRC.ctx.data;
    var t = data.ratingOf(rauId, eventId);
    if (!t) return null;
    return inherentBand(levelsFromArray(t.f)).band;
  }
  function derivedKey(control) {
    var data = GRC.ctx.data;
    var links = data.linksOfControl(control.id);
    var rules = [];
    var rauSet = {};
    var soleOnHigh = false, onCritical = false;
    links.forEach(function (ln) {
      rauSet[ln.r] = true;
      var band = ctlBandOf(ln.r, ln.e);
      if (band === "critical") onCritical = true;
      if (band === "high" || band === "critical") {
        if (data.controlsOfInstance(ln.r, ln.e).length === 1) soleOnHigh = true;
      }
    });
    if (soleOnHigh) rules.push({ id: "K1", text: "Sole mitigant on a High or Critical instance" });
    var expected = data.all("expectedControls").some(function (x) { return x.controlId === control.id; });
    if (expected) rules.push({ id: "K2", text: "Expected control for a live situation" });
    if (links.length >= 5 || Object.keys(rauSet).length >= 3) rules.push({ id: "K3", text: "Concentration: " + links.length + " instances across " + Object.keys(rauSet).length + " RAU" + (Object.keys(rauSet).length === 1 ? "" : "s") });
    if (onCritical) rules.push({ id: "K4", text: "Mitigates a Critical instance" });
    return { key: rules.length > 0, rules: rules };
  }
  /* Three-tier recommendation for attaching mitigation to an instance. */
  function controlRecs(rau, eventId) {
    var data = GRC.ctx.data;
    var ev = data.byId("riskEvents", eventId);
    var linked = {};
    data.controlsOfInstance(rau.id, eventId).forEach(function (c) { linked[c.id] = true; });
    var expected = [];
    data.expectedFor(eventId).forEach(function (rule) {
      var c = data.byId("controls", rule.controlId);
      if (c && !linked[c.id]) expected.push({ rule: rule, control: c });
    });
    /* shareable: controls linked to this event on peer RAUs, by attach rate */
    var byCtl = {};
    (data.linksOfEvent(eventId) || []).forEach(function (ln) {
      if (ln.r === rau.id) return;
      (byCtl[ln.c] = byCtl[ln.c] || { n: 0, raus: {} }).n++;
      byCtl[ln.c].raus[ln.r] = true;
    });
    var shared = Object.keys(byCtl).map(function (cid) {
      var c = data.byId("controls", cid);
      return c && c.shared && !linked[cid] ? { control: c, instances: byCtl[cid].n, raus: Object.keys(byCtl[cid].raus).length } : null;
    }).filter(Boolean).sort(function (a, b) { return b.instances - a.instances; }).slice(0, 6);
    /* skeleton: a directional draft from the event (and MCR guidance) */
    var kw = (ev.keywords || [])[0] || ev.name.split(" ")[0].toLowerCase();
    var recTypes = [];
    if (ev.side === "compliance") {
      data.mcrsOfEvent(eventId).slice(0, 40).forEach(function (m) {
        (m.recCtl || []).forEach(function (t) { if (recTypes.indexOf(t) < 0) recTypes.push(t); });
      });
    }
    var detective = recTypes.join(" ").indexOf("reconciliation") >= 0 || recTypes.join(" ").indexOf("review") >= 0;
    var skeleton = {
      name: (detective ? "Supervisor review of " : "Pre-execution validation of ") + kw + " activity",
      type: detective ? "detective" : "preventive",
      automation: "manual",
      frequency: detective ? "daily" : "per-event",
      desc: "Directional example only. " + (detective ? "A supervisor reviews " : "The system or preparer validates ") + kw +
        " items against the procedure before " + (detective ? "end of day" : "release") +
        ", with exceptions logged and escalated." +
        (recTypes.length ? " MCR guidance for this event suggests: " + recTypes.join(", ") + "." : ""),
      basis: "Drafted from the risk event profile" + (recTypes.length ? " and MCR control-type guidance" : "") + ". The business documents the real control."
    };
    return { expected: expected, shared: shared, skeleton: skeleton };
  }
  /* Advisory duplicate check for new controls (token overlap, top 3). */
  function similarControls(name, ownRauId) {
    var data = GRC.ctx.data;
    var tok = String(name || "").toLowerCase().split(/[^a-z0-9]+/).filter(function (w) { return w.length > 3; });
    if (tok.length < 2) return [];
    var out = [];
    data.all("controls").forEach(function (c) {
      var ct = c.name.toLowerCase();
      var hit = tok.filter(function (t) { return ct.indexOf(t) >= 0; }).length;
      if (hit >= 2) out.push({ control: c, hits: hit, own: c.owningRauId === ownRauId });
    });
    out.sort(function (a, b) { return b.hits - a.hits; });
    return out.slice(0, 3);
  }
  function descLint(control) {
    var checks = [];
    var name = control.name || "", d = control.desc || "";
    checks.push({ id: "C1", text: "Name states an action or check", ok: /^(dual|daily|monthly|quarterly|system|automated|supervisor|pre-|sanctions|access|reconcil|review|screen|valid|approv|verif|monitor|recert)/i.test(name) });
    checks.push({ id: "C2", text: "Description is specific (40+ characters)", ok: d.length >= 40 });
    checks.push({ id: "C3", text: "Frequency is set", ok: !!control.frequency });
    checks.push({ id: "C4", text: "Owner is named", ok: !!control.owner });
    return checks;
  }
  /* Coverage math for one RAU (enterprise views iterate RAUs). */
  function coverage(rau) {
    var data = GRC.ctx.data;
    var out = { expectedMissing: [], noControl: [], singlePoint: [] };
    data.regOfRau(rau.id).forEach(function (g) {
      if (g.status !== "confirmed") return;
      var ctls = data.controlsOfInstance(rau.id, g.eventId);
      var band = ctlBandOf(rau.id, g.eventId);
      data.expectedFor(g.eventId).forEach(function (rule) {
        if (!ctls.some(function (c) { return c.id === rule.controlId; })) {
          out.expectedMissing.push({ g: g, rule: rule, control: data.byId("controls", rule.controlId) });
        }
      });
      if (!ctls.length && (band === "high" || band === "critical")) out.noControl.push({ g: g, band: band });
      if (ctls.length === 1) out.singlePoint.push({ g: g, band: band, control: ctls[0] });
    });
    return out;
  }

  GRC.engine = {
    rubric: rubric, score: score, suppressedBy: suppressedBy,
    candidates: candidates, zones: zones, mcrCandidates: mcrCandidates,
    questionsFor: questionsFor, answer: answer, mcrFit: mcrFit,
    inherent: {
      def: INH, levels: inherentLevels, band: inherentBand,
      fromArray: levelsFromArray, suggest: inherentSuggest,
      rollup: inherentOf, peerOutlier: peerOutlier
    },
    ctl: {
      derivedKey: derivedKey, recs: controlRecs, similar: similarControls,
      lint: descLint, coverage: coverage, bandOf: ctlBandOf
    }
  };
})();
