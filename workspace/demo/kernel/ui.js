/* GRC kernel/ui.js v1.1.0 2026-08-23 */
/* Component builders. Everything returns a DOM node. Merged into ctx.ui. */
(function () {
  "use strict";
  var GRC = window.GRC = window.GRC || {};

  /* ==SECTION:el== */
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined) return;
      if (k === "class") n.className = v;
      else if (k.slice(0, 2) === "on" && typeof v === "function") n.addEventListener(k.slice(2), v);
      else if (k === "html") n.innerHTML = v;
      else n.setAttribute(k, v);
    });
    function add(c) {
      if (c === null || c === undefined || c === false) return;
      if (Array.isArray(c)) { c.forEach(add); return; }
      n.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    }
    add(children);
    return n;
  }

  /* ==SECTION:basics== */
  function badge(text, kind) { return el("span", { class: "g-badge" + (kind ? " g-badge--" + kind : "") }, text); }
  function pill(text, x) { return el("span", { class: "g-pill" + (x ? " x" : "") }, text); }
  function kpi(cfg) {
    return el("div", { class: "g-kpi " + (cfg.kind || "") }, [
      el("div", { class: "v" }, String(cfg.value)),
      el("div", { class: "l" }, cfg.label),
      cfg.sub ? el("div", { class: "s" }, cfg.sub) : null]);
  }
  function card(cfg) {
    return el("div", { class: "g-card" }, [
      cfg.title ? el("div", { class: "g-row", style: "justify-content:space-between" },
        [el("div", { class: "g-h2" }, cfg.title), cfg.actions ? el("div", { class: "g-row" }, cfg.actions) : null]) : null,
      cfg.body]);
  }
  function empty(msg) { return el("div", { class: "g-empty" }, msg); }
  function toolbar(children) { return el("div", { class: "g-toolbar" }, children); }
  function select(cfg) {
    var s = el("select", { class: "g-select", onchange: function () { if (cfg.onchange) cfg.onchange(s.value); } });
    (cfg.options || []).forEach(function (o) {
      var opt = typeof o === "string" ? { value: o, label: o } : o;
      s.appendChild(el("option", { value: opt.value }, opt.label));
    });
    if (cfg.value !== undefined) s.value = cfg.value;
    if (!cfg.label) return s;
    return el("label", { class: "g-row", style: "gap:5px" }, [el("span", { class: "lbl", style: "font-size:12px;color:var(--g-muted)" }, cfg.label), s]);
  }
  function searchBox(cfg) {
    var t = null;
    var i = el("input", {
      class: "g-input", type: "search", placeholder: cfg.placeholder || "Filter...",
      value: cfg.value || "",
      oninput: function () { clearTimeout(t); t = setTimeout(function () { cfg.oninput(i.value); }, 180); }
    });
    return i;
  }
  function kv(pairs) {
    var d = el("dl", { class: "g-kv" });
    pairs.forEach(function (p) {
      if (!p) return;
      d.appendChild(el("dt", {}, p[0]));
      d.appendChild(el("dd", {}, p[1] === null || p[1] === undefined || p[1] === "" ? "-" : p[1]));
    });
    return d;
  }
  function progress(pct) {
    return el("div", { class: "g-prog", title: Math.round(pct) + "%" },
      el("i", { style: "width:" + Math.max(0, Math.min(100, pct)) + "%" }));
  }

  /* ==SECTION:table== */
  function table(cfg) {
    var page = 0, per = cfg.page || 25, sortKey = null, sortDir = 1;
    var wrap = el("div", { class: "g-tablewrap" });
    function rowsSorted() {
      var rows = cfg.rows.slice();
      if (sortKey) {
        rows.sort(function (a, b) {
          var col = cfg.cols.filter(function (c) { return c.key === sortKey; })[0];
          var av = col.sortVal ? col.sortVal(a) : a[sortKey], bv = col.sortVal ? col.sortVal(b) : b[sortKey];
          if (av === bv) return 0;
          if (av === null || av === undefined) return 1;
          if (bv === null || bv === undefined) return -1;
          return (av > bv ? 1 : -1) * sortDir;
        });
      }
      return rows;
    }
    function draw() {
      wrap.innerHTML = "";
      var rows = rowsSorted();
      var t = el("table", { class: "g-table" });
      var hr = el("tr");
      cfg.cols.forEach(function (c) {
        var th = el("th", { class: c.sort ? "sort" : "" },
          c.label + (sortKey === c.key ? (sortDir > 0 ? " (asc)" : " (desc)") : ""));
        if (c.sort) th.onclick = function () {
          if (sortKey === c.key) sortDir = -sortDir; else { sortKey = c.key; sortDir = 1; }
          page = 0; draw();
        };
        hr.appendChild(th);
      });
      t.appendChild(hr);
      var start = page * per, slice = rows.slice(start, start + per);
      if (!slice.length) {
        t.appendChild(el("tr", {}, el("td", { colspan: String(cfg.cols.length), class: "g-muted", style: "padding:18px;text-align:center" }, cfg.empty || "No records match.")));
      }
      slice.forEach(function (r) {
        var tr = el("tr", { class: cfg.onRow ? "click" : "" });
        if (cfg.onRow) tr.onclick = function () { cfg.onRow(r); };
        cfg.cols.forEach(function (c) {
          var v = c.render ? c.render(r) : r[c.key];
          tr.appendChild(el("td", { class: c.num ? "num" : "" }, v === undefined || v === null ? "-" : v));
        });
        t.appendChild(tr);
      });
      wrap.appendChild(t);
      if (rows.length > per) {
        var last = Math.ceil(rows.length / per) - 1;
        wrap.appendChild(el("div", { class: "g-pager" }, [
          el("span", {}, (start + 1) + "-" + Math.min(start + per, rows.length) + " of " + rows.length),
          el("button", { class: "g-btn sm", onclick: function () { if (page > 0) { page--; draw(); } }, disabled: page === 0 ? "1" : null }, "Prev"),
          el("button", { class: "g-btn sm", onclick: function () { if (page < last) { page++; draw(); } }, disabled: page >= last ? "1" : null }, "Next")]));
      }
      return wrap;
    }
    return draw();
  }

  /* ==SECTION:tabs-drawer-toast== */
  function tabs(cfg) {
    var wrap = el("div");
    var bar = el("div", { class: "g-tabs" });
    var bd = el("div");
    var active = cfg.active || cfg.items[0].id;
    function activate(id) {
      active = id;
      bar.innerHTML = "";
      cfg.items.forEach(function (it) {
        bar.appendChild(el("button", { class: it.id === active ? "on" : "", onclick: function () { activate(it.id); } },
          it.label));
      });
      bd.innerHTML = "";
      var it = cfg.items.filter(function (x) { return x.id === active; })[0];
      if (it) it.render(bd);
    }
    wrap.appendChild(bar); wrap.appendChild(bd);
    activate(active);
    return wrap;
  }
  function drawer(cfg) {
    var bg = el("div", { class: "g-drawer-bg" });
    var d = el("div", { class: "g-drawer" }, [
      el("div", { class: "hd" }, [el("div", { class: "g-h2", style: "margin:0" }, cfg.title),
      el("span", { style: "flex:1" }),
      el("button", { class: "g-btn sm", onclick: close }, "Close")]),
      el("div", { class: "bd" }, cfg.body)]);
    function close() { document.body.removeChild(bg); document.body.removeChild(d); if (cfg.onclose) cfg.onclose(); }
    bg.onclick = close;
    document.body.appendChild(bg); document.body.appendChild(d);
    return { close: close, el: d };
  }
  var toastCount = 0;
  function toast(msg) {
    var t = el("div", { class: "g-toast" }, msg);
    t.style.bottom = (18 + toastCount * 50) + "px";
    toastCount++;
    document.body.appendChild(t);
    setTimeout(function () {
      if (t.parentNode) t.parentNode.removeChild(t);
      toastCount = Math.max(0, toastCount - 1);
    }, 2800);
  }

  /* ==SECTION:chat== */
  function chat(cfg) {
    var box = el("div", { class: "g-chat" });
    (cfg.messages || []).forEach(function (m) {
      box.appendChild(el("div", { class: "m " + m.who }, [
        el("div", { class: "who" }, m.who === "assistant" ? "Assistant" : "You"),
        el("div", {}, m.text)]));
    });
    setTimeout(function () { box.scrollTop = box.scrollHeight; }, 0);
    return box;
  }

  GRC.uiExt = {
    el: el, badge: badge, pill: pill, kpi: kpi, card: card, empty: empty,
    toolbar: toolbar, select: select, searchBox: searchBox, kv: kv,
    progress: progress, table: table, tabs: tabs, drawer: drawer,
    toast: toast, chat: chat
  };
})();
