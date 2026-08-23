/* GRC kernel/engine.js v1.0.0 2026-08-23 */
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

  GRC.engine = {
    rubric: rubric, score: score, suppressedBy: suppressedBy,
    candidates: candidates, zones: zones, mcrCandidates: mcrCandidates,
    questionsFor: questionsFor, answer: answer
  };
})();
