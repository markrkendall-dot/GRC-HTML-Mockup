/* GRC kernel/charts.js v1.0.0 2026-08-23 */
/* Minimal SVG charts. Colors: magnitude uses the single sequential accent;
   status colors appear only with a text label alongside (never color-alone).
   Thin marks, rounded ends, 2px gaps, muted axis text, <title> tooltips. */
(function () {
  "use strict";
  var GRC = window.GRC = window.GRC || {};
  var NS = "http://www.w3.org/2000/svg";
  function sv(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(n);
    return n;
  }
  function tokens() {
    var cs = getComputedStyle(document.documentElement);
    return {
      accent: cs.getPropertyValue("--g-accent").trim() || "#2e6ea6",
      ok: cs.getPropertyValue("--g-ok").trim() || "#15803d",
      warn: cs.getPropertyValue("--g-warn").trim() || "#d97706",
      bad: cs.getPropertyValue("--g-bad").trim() || "#991b1b",
      muted: cs.getPropertyValue("--g-muted").trim() || "#6a7280",
      line: cs.getPropertyValue("--g-line").trim() || "#d9dde3"
    };
  }

  /* ==SECTION:hbar== */
  /* Horizontal bars for top-N lists. items:[{label,value,kind?,title?,onclick?}] */
  function hbar(cfg) {
    var T = tokens();
    var items = cfg.items || [];
    var rowH = 26, labelW = cfg.labelW || 210, W = 560, pad = 6;
    var H = items.length * rowH + pad * 2;
    var max = Math.max.apply(null, items.map(function (i) { return i.value; }).concat([1]));
    var svg = sv("svg", { viewBox: "0 0 " + W + " " + H, width: "100%", height: H, role: "img" });
    items.forEach(function (it, i) {
      var y = pad + i * rowH;
      var g = sv("g", { style: it.onclick ? "cursor:pointer" : "" }, svg);
      if (it.onclick) g.addEventListener("click", it.onclick);
      sv("title", {}, g).textContent = it.title || (it.label + ": " + it.value);
      var t = sv("text", { x: labelW - 8, y: y + rowH / 2 + 4, "text-anchor": "end", "font-size": "11.5", fill: T.muted }, g);
      t.textContent = it.label.length > 34 ? it.label.slice(0, 33) + "…" : it.label;
      var bw = Math.max(3, (W - labelW - 56) * (it.value / max));
      var color = it.kind ? T[it.kind] : T.accent;
      sv("rect", { x: labelW, y: y + 6, width: bw, height: rowH - 12, rx: 4, fill: color }, g);
      var v = sv("text", { x: labelW + bw + 7, y: y + rowH / 2 + 4, "font-size": "11.5", "font-weight": "600", fill: "#1f2430" }, g);
      v.textContent = cfg.fmt ? cfg.fmt(it.value) : it.value;
    });
    return svg;
  }

  /* ==SECTION:donut== */
  /* items:[{label,value,kind}] - status-semantic slices, 2px gaps, legend
     with labels+values so identity is never color-alone. */
  function donut(cfg) {
    var T = tokens();
    var items = (cfg.items || []).filter(function (i) { return i.value > 0; });
    var total = items.reduce(function (a, b) { return a + b.value; }, 0) || 1;
    var R = 52, r = 34, C = 62;
    var wrap = document.createElement("div");
    wrap.style.cssText = "display:flex;gap:16px;align-items:center;flex-wrap:wrap";
    var svg = sv("svg", { viewBox: "0 0 124 124", width: 124, height: 124, role: "img" });
    var a0 = -Math.PI / 2;
    items.forEach(function (it) {
      var frac = it.value / total;
      var a1 = a0 + frac * Math.PI * 2;
      var gap = 0.028; /* ~2px gap */
      var s = a0 + gap / 2, e = Math.max(s + 0.01, a1 - gap / 2);
      var large = (e - s) > Math.PI ? 1 : 0;
      var d = "M" + (C + R * Math.cos(s)) + " " + (C + R * Math.sin(s)) +
        " A" + R + " " + R + " 0 " + large + " 1 " + (C + R * Math.cos(e)) + " " + (C + R * Math.sin(e)) +
        " L" + (C + r * Math.cos(e)) + " " + (C + r * Math.sin(e)) +
        " A" + r + " " + r + " 0 " + large + " 0 " + (C + r * Math.cos(s)) + " " + (C + r * Math.sin(s)) + " Z";
      var p = sv("path", { d: d, fill: it.kind ? T[it.kind] : T.accent }, svg);
      sv("title", {}, p).textContent = it.label + ": " + it.value + " (" + Math.round(100 * frac) + "%)";
      a0 = a1;
    });
    var ct = sv("text", { x: C, y: C - 2, "text-anchor": "middle", "font-size": "17", "font-weight": "700", fill: "#1f2430" }, svg);
    ct.textContent = cfg.centerLabel !== undefined ? cfg.centerLabel : total;
    var cs = sv("text", { x: C, y: C + 14, "text-anchor": "middle", "font-size": "9.5", fill: T.muted }, svg);
    cs.textContent = cfg.centerSub || "";
    wrap.appendChild(svg);
    var leg = document.createElement("div");
    items.forEach(function (it) {
      var row = document.createElement("div");
      row.style.cssText = "display:flex;gap:7px;align-items:center;font-size:12.5px;padding:1px 0";
      row.innerHTML = "<span style='width:10px;height:10px;border-radius:3px;background:" +
        (it.kind ? tokens()[it.kind] : tokens().accent) + ";display:inline-block'></span>" +
        "<span>" + it.label + "</span><b style='font-variant-numeric:tabular-nums'>" + it.value + "</b>";
      leg.appendChild(row);
    });
    wrap.appendChild(leg);
    return wrap;
  }

  /* ==SECTION:scorebars== */
  /* The rubric breakdown: one row per category, 1-5 scale, weight shown.
     cats:{key:score}, categories from rubric. */
  function scoreBars(cfg) {
    var T = tokens();
    var cats = cfg.categories, scores = cfg.cats;
    var rowH = 19, labelW = 190, W = 430, H = cats.length * rowH + 6;
    var svg = sv("svg", { viewBox: "0 0 " + W + " " + H, width: "100%", height: H, role: "img" });
    /* faint 1-5 grid */
    for (var g = 1; g <= 5; g++) {
      sv("line", { x1: labelW + (W - labelW - 60) * g / 5, y1: 2, x2: labelW + (W - labelW - 60) * g / 5, y2: H - 2, stroke: T.line, "stroke-width": g === 5 ? 1 : 0.6 }, svg);
    }
    cats.forEach(function (c, i) {
      var y = 3 + i * rowH;
      var s = scores[c.key] || 0;
      var grp = sv("g", {}, svg);
      sv("title", {}, grp).textContent = c.label + ": " + s + " of 5 (weight " + c.weight + ")";
      var t = sv("text", { x: labelW - 8, y: y + 12, "text-anchor": "end", "font-size": "10.5", fill: T.muted }, grp);
      t.textContent = c.label + " (w" + c.weight + ")";
      var bw = Math.max(3, (W - labelW - 60) * s / 5);
      sv("rect", { x: labelW, y: y + 3, width: bw, height: rowH - 9, rx: 3.5, fill: T.accent, opacity: 0.35 + 0.13 * s }, grp);
      var v = sv("text", { x: labelW + bw + 6, y: y + 12, "font-size": "10.5", "font-weight": "700", fill: "#1f2430" }, grp);
      v.textContent = s;
    });
    return svg;
  }

  GRC.chartsExt = { hbar: hbar, donut: donut, scoreBars: scoreBars };
})();
