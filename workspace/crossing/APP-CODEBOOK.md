<!-- GRC APP-CODEBOOK v1 -->
# GRC reference app - code book

This one Markdown file carries the entire reference app CODE (no data).
Each file below sits between BEGIN/END sentinels and is length-delimited
(bytes=N): a reader takes exactly N bytes after the BEGIN line, so the
content round-trips byte-for-byte no matter what it contains.

TO REBUILD INSIDE: use crossing/rebuild.html (see RECONSTITUTE.md), or
copy each block's content into Notepad and Save As the path shown.
OPEN THIS FILE IN NOTEPAD, not a rendered Markdown viewer, so bytes are
preserved exactly.

Files appear in index.html load order.

<!-- ==GRC-FILE-BEGIN path=index.html bytes=20224 sha256=4385dff3f261a276ecc5571937ab714c8a6565fa45664db77abd349653a642e2== -->
<!DOCTYPE html>
<!-- GRC index.html v1.6.0 2026-08-23 -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Meridian GRC</title>
<style>
/* ==SECTION:tokens== */
:root{
  --g-banner:#b01e24; --g-banner-dk:#8f171c; --g-rail:#e8e8e8; --g-rail-dk:#dcdcdc;
  --g-bg:#ffffff; --g-page:#f7f7f7; --g-card:#ffffff; --g-ink:#1f2430; --g-muted:#6a7280;
  --g-line:#d9dde3; --g-line-soft:#e9ecef; --g-accent:#2e6ea6;
  --g-ok:#15803d; --g-warn:#d97706; --g-bad:#991b1b; --g-info:#2e6ea6;
  --g-ok-bg:#e8f4ec; --g-warn-bg:#fbf0df; --g-bad-bg:#f7e8e8; --g-info-bg:#e8eff7;
  --g-r:6px; --g-shadow:0 1px 2px rgba(31,36,48,.06),0 4px 14px -8px rgba(31,36,48,.18);
}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;background:var(--g-page);color:var(--g-ink);
  font:14px/1.5 "Segoe UI",system-ui,-apple-system,Arial,sans-serif}
button,input,select{font:inherit;color:inherit}
a{color:var(--g-accent)}
/* ==SECTION:banner== */
#g-banner{background:var(--g-banner);color:#fff;display:flex;align-items:center;
  gap:16px;padding:0 16px;height:46px}
.g-brand{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:600;
  letter-spacing:.2px;white-space:nowrap}
.g-brand svg{display:block}
#g-banner .sp{flex:1}
#g-search{width:280px;max-width:32vw;border:1px solid rgba(255,255,255,.45);
  background:rgba(255,255,255,.14);color:#fff;border-radius:4px;padding:5px 10px;outline:none}
#g-search::placeholder{color:rgba(255,255,255,.75)}
#g-search:focus{background:#fff;color:var(--g-ink)}
#g-release{font-size:12px;font-weight:600;background:rgba(255,255,255,.18);
  border:1px solid rgba(255,255,255,.4);border-radius:999px;padding:3px 10px;white-space:nowrap}
.g-roleWrap{display:flex;align-items:center;gap:6px;font-size:12px;color:rgba(255,255,255,.85)}
#g-role{background:var(--g-banner-dk);color:#fff;border:1px solid rgba(255,255,255,.35);
  border-radius:4px;padding:4px 6px;font-size:12px;max-width:200px}
#g-preflight-btn{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.5);
  border-radius:4px;padding:4px 10px;cursor:pointer;font-size:12px}
#g-preflight-btn:hover{background:rgba(255,255,255,.15)}
#g-preflight-btn.err{background:#fff;color:var(--g-bad);font-weight:700}
/* ==SECTION:tabs== */
#g-tabs{background:var(--g-banner);display:flex;gap:2px;padding:0 12px;height:38px;align-items:flex-end}
#g-tabs button{border:none;background:transparent;color:rgba(255,255,255,.92);padding:9px 18px 10px;
  cursor:pointer;font-size:13.5px;font-weight:600;border-radius:6px 6px 0 0;letter-spacing:.2px}
#g-tabs button:hover{background:rgba(255,255,255,.14)}
#g-tabs button.on{background:var(--g-page);color:var(--g-ink)}
/* ==SECTION:trace== */
#g-trace{display:flex;align-items:center;gap:7px;flex-wrap:wrap;
  background:#fdf9f0;border-bottom:1px solid #ecdfc3;padding:5px 18px;font-size:12px}
#g-trace .tr-lbl{color:#8a7a55;font-size:11px;letter-spacing:.4px;text-transform:uppercase;font-weight:700}
#g-trace .tr-name{font-weight:650;color:var(--g-ink)}
.tr-chip{border:1.5px solid var(--g-banner);background:var(--g-banner);color:#fff;
  border-radius:5px;padding:1px 7px;font-size:11px;font-weight:700;cursor:pointer}
.tr-chip.uses{background:#fff;color:var(--g-ink);border-color:#8b93a0}
.tr-chip.feeds{background:#fff;color:var(--g-muted);border-color:#c3c9d1;border-style:dashed}
.tr-chip.future{border-style:dashed}
.tr-chip.primary.future{background:#fff;color:var(--g-banner)}
.tr-chip:hover{filter:brightness(.92)}
.tr-chip.pulse{animation:trpulse .9s ease}
@keyframes trpulse{0%{box-shadow:0 0 0 0 rgba(176,30,36,.55)}100%{box-shadow:0 0 0 12px rgba(176,30,36,0)}}
.tr-act{margin-left:auto;color:#8a5a10;font-weight:600;opacity:0;font-size:12px}
.tr-act.show{opacity:1;transition:opacity .2s}
/* ==SECTION:lens== */
.capbox.dim{opacity:.32;filter:grayscale(.9)}
.capbox.sel{border-color:var(--g-banner);border-width:2px;box-shadow:var(--g-shadow)}
.capbox.req{border-color:var(--g-warn);border-style:dashed;border-width:2px}
.capbox .selmark{position:absolute;top:6px;right:8px;font-size:11px;font-weight:800;color:var(--g-banner)}
.capbox .reqmark{position:absolute;top:6px;right:8px;font-size:10px;font-weight:800;color:var(--g-warn);letter-spacing:.4px}
/* ==SECTION:flowmap== */
.flowwrap{overflow-x:auto;border:1px solid var(--g-line);border-radius:8px;background:#fff;padding:6px}
.flowwrap svg text{font-family:"Segoe UI",system-ui,sans-serif}
/* ==SECTION:layout== */
#g-layout{display:flex;min-height:calc(100vh - 84px)}
#g-rail{width:236px;flex:none;background:var(--g-rail);border-right:1px solid #cfcfcf;
  display:flex;flex-direction:column;padding:14px 0 10px}
#g-rail h4{margin:2px 14px 6px;font-size:11px;letter-spacing:.9px;text-transform:uppercase;
  color:#5a6068;font-weight:700}
#g-rail .itm{display:block;width:100%;text-align:left;border:none;background:transparent;
  padding:8px 14px 8px 17px;cursor:pointer;color:#2a2f38;font-size:13.5px;border-left:3px solid transparent}
#g-rail .itm:hover{background:var(--g-rail-dk)}
#g-rail .itm.on{background:#fff;border-left-color:var(--g-banner);font-weight:600}
#g-rail .sep{flex:1}
#g-rail .persist{border-bottom:1px solid #c9c9c9;padding-bottom:8px;margin-bottom:10px}
#outlet{flex:1;min-width:0;padding:18px 22px 60px;max-width:1500px}
/* ==SECTION:components== */
.g-h1{font-size:20px;font-weight:650;margin:0 0 4px}
.g-h2{font-size:15px;font-weight:650;margin:0 0 8px}
.g-muted{color:var(--g-muted)}
.g-mono{font-family:Consolas,Menlo,monospace;font-size:12.5px}
.g-page-head{display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:14px}
.g-page-head .sp{flex:1}
.g-card{background:var(--g-card);border:1px solid var(--g-line);border-radius:var(--g-r);
  box-shadow:var(--g-shadow);padding:14px 16px;margin-bottom:14px}
.g-card>.g-h2:first-child{margin-top:0}
.g-grid{display:grid;gap:14px}
.g-split{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start}
@media(max-width:1100px){.g-split{grid-template-columns:1fr}}
.g-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.g-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:14px}
.g-kpi{background:var(--g-card);border:1px solid var(--g-line);border-radius:var(--g-r);
  box-shadow:var(--g-shadow);padding:10px 14px}
.g-kpi .v{font-size:23px;font-weight:650;font-variant-numeric:tabular-nums;line-height:1.15}
.g-kpi .l{font-size:11.5px;letter-spacing:.4px;text-transform:uppercase;color:var(--g-muted);font-weight:600}
.g-kpi .s{font-size:12px;color:var(--g-muted)}
.g-kpi.ok .v{color:var(--g-ok)} .g-kpi.warn .v{color:var(--g-warn)}
.g-kpi.bad .v{color:var(--g-bad)} .g-kpi.info .v{color:var(--g-info)}
.g-badge{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.3px;
  padding:2px 8px;border-radius:999px;text-transform:uppercase;white-space:nowrap;
  background:#eef0f3;color:#3d4451;border:1px solid transparent}
.g-badge--ok{background:var(--g-ok-bg);color:var(--g-ok)}
.g-badge--warn{background:var(--g-warn-bg);color:#92580a}
.g-badge--bad{background:var(--g-bad-bg);color:var(--g-bad)}
.g-badge--info{background:var(--g-info-bg);color:#215582}
.g-pill{display:inline-block;font-size:12px;background:#f0f2f5;border:1px solid var(--g-line);
  border-radius:999px;padding:2px 10px;margin:2px 4px 2px 0;white-space:nowrap}
.g-pill.x{background:var(--g-bad-bg);border-color:#e5c9c9;color:var(--g-bad);text-decoration:line-through}
.g-btn{background:#fff;border:1px solid #b9bfc7;border-radius:4px;padding:6px 14px;cursor:pointer;font-size:13px}
.g-btn:hover{background:#f2f4f6}
.g-btn--primary{background:var(--g-banner);border-color:var(--g-banner);color:#fff;font-weight:600}
.g-btn--primary:hover{background:var(--g-banner-dk)}
.g-btn:disabled{opacity:.45;cursor:default}
.g-btn.sm{padding:3px 10px;font-size:12px}
.g-input,.g-select{border:1px solid #b9bfc7;border-radius:4px;padding:6px 9px;background:#fff;font-size:13px}
.g-input:focus,.g-select:focus{outline:2px solid #9db8d2;outline-offset:0}
.g-toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px}
.g-toolbar .lbl{font-size:12px;color:var(--g-muted)}
.g-empty{padding:26px;text-align:center;color:var(--g-muted);background:#fafbfc;
  border:1px dashed var(--g-line);border-radius:var(--g-r)}
.g-label{font-size:11px;letter-spacing:.5px;text-transform:uppercase;color:var(--g-muted);font-weight:700}
/* ==SECTION:tables== */
.g-tablewrap{overflow-x:auto;background:var(--g-card);border:1px solid var(--g-line);
  border-radius:var(--g-r);box-shadow:var(--g-shadow);margin-bottom:14px}
table.g-table{border-collapse:collapse;width:100%;font-size:13px}
.g-table th{position:sticky;top:0;background:#f2f4f6;text-align:left;font-size:11px;
  letter-spacing:.5px;text-transform:uppercase;color:#4c5560;padding:8px 12px;
  border-bottom:1px solid var(--g-line);white-space:nowrap;cursor:default}
.g-table th.sort{cursor:pointer}
.g-table th.sort:hover{color:var(--g-ink)}
.g-table td{padding:7px 12px;border-bottom:1px solid var(--g-line-soft);vertical-align:top}
.g-table tr:last-child td{border-bottom:none}
.g-table tr.click{cursor:pointer}
.g-table tr.click:hover td{background:#f4f7fa}
.g-table td.num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.g-pager{display:flex;gap:8px;align-items:center;justify-content:flex-end;padding:8px 12px;
  font-size:12px;color:var(--g-muted)}
/* ==SECTION:kv-tabs-drawer== */
.g-kv{display:grid;grid-template-columns:170px 1fr;gap:4px 14px;font-size:13px}
.g-kv dt{color:var(--g-muted)} .g-kv dd{margin:0;min-width:0}
.g-tabs{display:flex;gap:2px;border-bottom:2px solid var(--g-line);margin:6px 0 14px;flex-wrap:wrap}
.g-tabs button{border:none;background:transparent;padding:7px 14px;cursor:pointer;font-size:13px;
  font-weight:600;color:var(--g-muted);border-bottom:2px solid transparent;margin-bottom:-2px}
.g-tabs button:hover{color:var(--g-ink)}
.g-tabs button.on{color:var(--g-banner);border-bottom-color:var(--g-banner)}
.g-drawer-bg{position:fixed;inset:0;background:rgba(20,24,32,.42);z-index:60}
.g-drawer{position:fixed;top:0;right:0;bottom:0;width:min(680px,92vw);background:#fff;
  z-index:61;box-shadow:-8px 0 30px rgba(0,0,0,.25);display:flex;flex-direction:column}
.g-drawer .hd{display:flex;align-items:center;gap:10px;padding:12px 18px;
  border-bottom:1px solid var(--g-line);background:#f7f8fa}
.g-drawer .bd{padding:16px 18px;overflow:auto;flex:1}
.g-toast{position:fixed;right:18px;bottom:18px;z-index:80;background:#20262f;color:#fff;
  padding:10px 16px;border-radius:6px;font-size:13px;box-shadow:0 6px 24px rgba(0,0,0,.35);
  max-width:420px}
/* ==SECTION:special== */
.g-chat{background:#f6f8fa;border:1px solid var(--g-line);border-radius:var(--g-r);padding:10px;max-height:330px;overflow:auto}
.g-chat .m{max-width:88%;margin:6px 0;padding:7px 11px;border-radius:10px;font-size:13px;line-height:1.45}
.g-chat .m.assistant{background:#fff;border:1px solid var(--g-line)}
.g-chat .m.user{background:var(--g-info-bg);margin-left:auto}
.g-chat .who{font-size:10.5px;letter-spacing:.5px;text-transform:uppercase;color:var(--g-muted);margin-bottom:2px}
.g-prog{height:8px;border-radius:99px;background:#e7eaee;overflow:hidden}
.g-prog i{display:block;height:100%;background:var(--g-accent)}
.g-zone{border-left:4px solid var(--g-line);padding-left:12px;margin:16px 0}
.g-zone.likely{border-color:var(--g-ok)} .g-zone.middle{border-color:var(--g-warn)}
.g-zone.unlikely{border-color:#aab1ba}
.g-score{display:inline-flex;align-items:center;gap:6px;font-variant-numeric:tabular-nums;font-weight:650}
.g-score i{display:inline-block;width:44px;height:7px;border-radius:99px;background:#e7eaee;overflow:hidden}
.g-score i b{display:block;height:100%;background:var(--g-accent)}
.map-phase{border:1px solid var(--g-line);border-radius:var(--g-r);margin-bottom:10px;background:#fff}
.map-phase .ph{padding:7px 12px;background:#f2f4f6;font-weight:650;font-size:12.5px;border-bottom:1px solid var(--g-line);
  text-transform:uppercase;letter-spacing:.4px;color:#4c5560}
.map-step{display:flex;gap:10px;padding:7px 12px;border-bottom:1px solid var(--g-line-soft);align-items:flex-start}
.map-step:last-child{border-bottom:none}
.map-step .n{flex:none;width:22px;height:22px;border-radius:50%;background:#eef0f3;font-size:11.5px;
  font-weight:700;display:flex;align-items:center;justify-content:center;color:#4c5560}
.map-step.decision .n{background:var(--g-warn-bg);color:#92580a}
.map-step.h-in .n,.map-step.h-out .n{background:var(--g-info-bg);color:#215582}
.provsrc{font-size:11px;color:var(--g-muted);background:#f0f2f5;border-radius:4px;padding:1px 6px;margin-left:6px;white-space:nowrap}
.ans-yes{color:var(--g-ok);font-weight:700} .ans-no{color:var(--g-ink);font-weight:700}
#preflight .g-kv{grid-template-columns:220px 1fr}
.pf-err{color:var(--g-bad);font-family:Consolas,monospace;font-size:12px;white-space:pre-wrap}
.capbox{border:1.5px solid var(--g-line);border-radius:8px;padding:10px 12px;background:#fff;cursor:pointer;position:relative}
.capbox:hover{border-color:var(--g-accent)}
.capbox.live{border-color:var(--g-banner);box-shadow:var(--g-shadow)}
.capbox .cn{font-size:11px;font-weight:700;color:var(--g-muted);padding-right:66px}
.capbox .ct{font-weight:650;font-size:13px;line-height:1.3}
.capbox .cs{font-size:11px;margin-top:4px}
.g-badge--brand{background:#f6e4e5;color:var(--g-banner)}
/* ==SECTION:feedback== */
#g-fb-pill{position:fixed;left:14px;bottom:14px;z-index:55;background:#fff;
  border:1.5px solid var(--g-banner);color:var(--g-banner);border-radius:999px;
  padding:8px 16px;font-size:12.5px;font-weight:700;cursor:pointer;box-shadow:var(--g-shadow)}
#g-fb-pill:hover{background:var(--g-banner);color:#fff}
/* ==SECTION:worklist== */
#g-cart-pill{position:fixed;right:14px;bottom:14px;z-index:55;background:#fff;
  border:1.5px solid var(--g-accent);color:var(--g-accent);border-radius:999px;
  padding:8px 16px;font-size:12.5px;font-weight:700;cursor:pointer;box-shadow:var(--g-shadow)}
#g-cart-pill:hover{background:var(--g-accent);color:#fff}
#g-cart-pill .n{background:var(--g-accent);color:#fff;border-radius:999px;padding:0 7px;margin-left:6px}
#g-cart-pill:hover .n{background:#fff;color:var(--g-accent)}
.g-btn.cart-in{background:var(--g-info-bg);border-color:var(--g-accent);color:var(--g-accent);font-weight:600}
#g-cartbar{position:fixed;left:50%;bottom:64px;transform:translateX(-50%);z-index:70;
  background:#1f2430;color:#fff;border-radius:10px;padding:10px 16px;
  box-shadow:0 8px 28px rgba(0,0,0,.4);display:flex;gap:9px;align-items:center;
  max-width:min(860px,92vw);font-size:13px}
#g-cartbar .t{font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#g-cartbar .donechip{background:var(--g-ok);color:#fff;border-radius:999px;padding:1px 9px;
  font-size:10.5px;font-weight:800;letter-spacing:.4px;white-space:nowrap}
#g-cartbar button{border:1px solid rgba(255,255,255,.45);background:transparent;color:#fff;
  border-radius:5px;padding:4px 11px;cursor:pointer;font-size:12.5px;white-space:nowrap}
#g-cartbar button:hover{background:rgba(255,255,255,.15)}
#g-cartbar button.p{background:var(--g-accent);border-color:var(--g-accent);font-weight:600}
.fb-ctx{background:#f2f4f6;border:1px solid var(--g-line);border-radius:6px;
  padding:8px 12px;font-size:12.5px;margin-bottom:12px}
.fb-ctx .g-mono{font-size:12px}
.fb-item{border:1px solid var(--g-line);border-radius:6px;padding:8px 12px;margin:8px 0;background:#fff;font-size:12.5px}
.flowarrow{align-self:center;justify-self:center;width:0;height:0;
  border-top:6px solid transparent;border-bottom:6px solid transparent;border-left:8px solid #b9bfc7}
.caret{display:inline-block;width:0;height:0;border-top:5px solid transparent;
  border-bottom:5px solid transparent;border-left:7px solid #6a7280;margin-right:8px;
  cursor:pointer;transition:transform .12s;vertical-align:middle}
.caret.open{transform:rotate(90deg)}
.tree-ind1 td:first-child{padding-left:34px}
.tree-ind2 td:first-child{padding-left:58px}
tr.tree-parent{background:#f7f8fa}
tr.tree-parent td{font-weight:600}
.skel-strip{display:flex;gap:10px;margin-top:10px}
.skel-strip i{display:block;height:64px;flex:1;background:#f0f2f5;border:1px dashed var(--g-line);border-radius:6px}
.gal-item{border:1px solid var(--g-line);border-radius:8px;background:#fff;padding:12px 14px;display:flex;flex-direction:column;gap:6px}
.gal-item .t{font-weight:650}
.gal-item .w{font-size:12.5px;color:var(--g-muted);flex:1}
.vote button{border:1px solid #b9bfc7;background:#fff;border-radius:4px;padding:2px 9px;font-size:11.5px;cursor:pointer}
.vote button.on{background:var(--g-ink);color:#fff;border-color:var(--g-ink)}
:focus-visible{outline:2px solid var(--g-accent);outline-offset:1px}
@media print{#g-banner,#g-tabs,#g-rail,#g-fb-pill,#g-cart-pill,#g-cartbar{display:none}#outlet{padding:0}}
</style>
</head>
<body>
<header id="g-banner">
  <div class="g-brand">
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><rect x="1" y="1" width="20" height="20" rx="4" fill="#fff"/><rect x="4.5" y="4.5" width="4" height="4" rx="1" fill="#b01e24"/><rect x="9.5" y="4.5" width="4" height="4" rx="1" fill="#e3a6a8"/><rect x="14.5" y="4.5" width="4" height="4" rx="1" fill="#e3a6a8"/><rect x="4.5" y="9.5" width="4" height="4" rx="1" fill="#e3a6a8"/><rect x="9.5" y="9.5" width="4" height="4" rx="1" fill="#b01e24"/><rect x="14.5" y="9.5" width="4" height="4" rx="1" fill="#e3a6a8"/><rect x="4.5" y="14.5" width="4" height="4" rx="1" fill="#e3a6a8"/><rect x="9.5" y="14.5" width="4" height="4" rx="1" fill="#e3a6a8"/><rect x="14.5" y="14.5" width="4" height="4" rx="1" fill="#b01e24"/></svg>
    Meridian GRC
  </div>
  <span class="sp"></span>
  <input id="g-search" type="search" placeholder="Search RAUs, risk events, MCRs... (Enter)">
  <span id="g-release" title="Release shown to reviewers">R?</span>
  <span class="g-roleWrap">View as <select id="g-role"></select></span>
  <button id="g-preflight-btn" title="Diagnostics">Preflight</button>
</header>
<nav id="g-tabs" aria-label="Functions"></nav>
<div id="g-trace" hidden></div>
<div id="g-layout">
  <aside id="g-rail" aria-label="Section navigation">
    <div class="persist" id="g-rail-persist"><h4>Always available</h4></div>
    <h4 id="g-rail-title"></h4>
    <div id="g-rail-context"></div>
    <div class="sep"></div>
  </aside>
  <main id="outlet"></main>
</div>
<div id="preflight" hidden></div>
<!-- Kernel first, then data (one line per data file), then modules (one line
     per module). To swap in real data: replace files in data/ keeping the
     same filenames - no changes needed here. -->
<script src="kernel/core.js"></script>
<script src="kernel/engine.js"></script>
<script src="kernel/ui.js"></script>
<script src="kernel/charts.js"></script>
<script src="data/release.js"></script>
<script src="data/orgnodes.js"></script>
<script src="data/services.js"></script>
<script src="data/raus.js"></script>
<script src="data/riskevents.js"></script>
<script src="data/mcrs.js"></script>
<script src="data/register.js"></script>
<script src="data/requests.js"></script>
<script src="data/metaquestions.js"></script>
<script src="data/rubric.js"></script>
<script src="data/ratings.js"></script>
<script src="data/controls.js"></script>
<script src="data/controllinks.js"></script>
<script src="data/expectedcontrols.js"></script>
<script src="data/affirmations.js"></script>
<script src="data/challenges.js"></script>
<script src="modules/home.js"></script>
<script src="modules/gallery.js"></script>
<script src="modules/rau.js"></script>
<script src="modules/rau-profile.js"></script>
<script src="modules/intake.js"></script>
<script src="modules/mapbuilder.js"></script>
<script src="modules/riskid.js"></script>
<script src="modules/inherent.js"></script>
<script src="modules/controls.js"></script>
<script src="modules/rcsa.js"></script>
<script src="modules/skeletons.js"></script>
<script src="modules/libraries.js"></script>
<script src="modules/mywork.js"></script>
<script src="modules/demo.js"></script>
<script>window.addEventListener("load", function(){ GRC.boot(); });</script>
</body>
</html>

<!-- ==GRC-FILE-END== -->

<!-- ==GRC-FILE-BEGIN path=kernel/core.js bytes=46709 sha256=8d0e8bf454d3544ef3133d786a4005aeee2308f3ec4027e7286b33eccb3bf7c2== -->
/* GRC kernel/core.js v1.7.0 2026-08-23 */
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
  var BUILT = { 1: true, 2: true, 3: true, 4: true, 5: true };
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
    ["orgNodes", "services", "raus", "riskEvents", "mcrs", "register", "requests", "metaQuestions", "rubric", "ratings", "controls", "controlLinks", "expectedControls", "affirmations", "challenges"].forEach(function (k) {
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
    D.ratByRau = {}; D.ratByEvent = {}; D.ratKey = {};
    D.entities.ratings.forEach(function (t) {
      (D.ratByRau[t.rauId] = D.ratByRau[t.rauId] || []).push(t);
      (D.ratByEvent[t.eventId] = D.ratByEvent[t.eventId] || []).push(t);
      D.ratKey[t.rauId + "|" + t.eventId] = t;
    });
    D.linksByCtl = {}; D.linksByInst = {}; D.linksByEvent = {}; D.ctlsOwned = {};
    D.entities.controlLinks.forEach(function (ln) {
      (D.linksByCtl[ln.c] = D.linksByCtl[ln.c] || []).push(ln);
      (D.linksByInst[ln.r + "|" + ln.e] = D.linksByInst[ln.r + "|" + ln.e] || []).push(ln);
      (D.linksByEvent[ln.e] = D.linksByEvent[ln.e] || []).push(ln);
    });
    D.entities.controls.forEach(function (c) {
      (D.ctlsOwned[c.owningRauId] = D.ctlsOwned[c.owningRauId] || []).push(c);
    });
    D.expByEvent = {};
    D.entities.expectedControls.forEach(function (x) {
      if (x.eventId) (D.expByEvent[x.eventId] = D.expByEvent[x.eventId] || []).push(x);
    });
    D.affByRau = {};
    D.entities.affirmations.forEach(function (a) { a.pending = a.pending || []; D.affByRau[a.rauId] = a; });
    D.chalByRau = {};
    D.entities.challenges.forEach(function (c) { (D.chalByRau[c.rauId] = D.chalByRau[c.rauId] || []).push(c); });
  }
  /* The living record: session mutations queue as unadopted changes on
     the RAU, feeding affirmation state and the 2LOD attention view. */
  function pushChange(rauId, kind, text, eventId) {
    if (!D) return;
    var a = D.affByRau[rauId];
    if (!a) {
      a = { rauId: rauId, date: null, by: null, snapshot: null, pending: [] };
      D.entities.affirmations.push(a);
      D.affByRau[rauId] = a;
    }
    a.pending.push({ date: (GRC.ctx && GRC.ctx.fmt) ? GRC.ctx.fmt.today() : "", kind: kind, text: text, eventId: eventId || null });
  }
  function evName(evId) { var e = D.byId.riskEvents[evId]; return e ? e.name : evId; }

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
      if (row.status === "confirmed") pushChange(row.rauId, "instance", "Instance confirmed: " + evName(row.eventId), row.eventId);
    },
    removeRegister: function (row) {
      function drop(arr) { var i = arr.indexOf(row); if (i >= 0) arr.splice(i, 1); }
      drop(D.entities.register);
      drop(D.regByRau[row.rauId] || []);
      drop(D.regByEvent[row.eventId] || []);
      pushChange(row.rauId, "instance", "Disposition reopened: " + evName(row.eventId), row.eventId);
    },
    /* Ratings join to CONFIRMED register rows at read time, so a reopened
       instance simply stops counting; if re-confirmed, its rating returns. */
    controlsOfInstance: function (rauId, evId) {
      return (D.linksByInst[rauId + "|" + evId] || []).map(function (ln) { return D.byId.controls[ln.c]; }).filter(Boolean);
    },
    linksOfControl: function (ctlId) { return D.linksByCtl[ctlId] || []; },
    linksOfEvent: function (evId) { return D.linksByEvent[evId] || []; },
    linksOfInstance: function (rauId, evId) { return D.linksByInst[rauId + "|" + evId] || []; },
    controlsOwnedBy: function (rauId) { return D.ctlsOwned[rauId] || []; },
    expectedFor: function (evId) { return D.expByEvent[evId] || []; },
    addControl: function (c) {
      D.entities.controls.push(c);
      D.byId.controls[c.id] = c;
      (D.ctlsOwned[c.owningRauId] = D.ctlsOwned[c.owningRauId] || []).push(c);
    },
    addLink: function (ln) {
      D.entities.controlLinks.push(ln);
      (D.linksByCtl[ln.c] = D.linksByCtl[ln.c] || []).push(ln);
      (D.linksByInst[ln.r + "|" + ln.e] = D.linksByInst[ln.r + "|" + ln.e] || []).push(ln);
      (D.linksByEvent[ln.e] = D.linksByEvent[ln.e] || []).push(ln);
      var c = D.byId.controls[ln.c];
      pushChange(ln.r, "control", "Control attached on " + evName(ln.e) + ": " + (c ? c.name : ln.c), ln.e);
    },
    removeLink: function (ln) {
      function drop(arr) { var i = arr.indexOf(ln); if (i >= 0) arr.splice(i, 1); }
      drop(D.entities.controlLinks);
      drop(D.linksByCtl[ln.c] || []);
      drop(D.linksByInst[ln.r + "|" + ln.e] || []);
      drop(D.linksByEvent[ln.e] || []);
      var c = D.byId.controls[ln.c];
      pushChange(ln.r, "control", "Control unlinked on " + evName(ln.e) + ": " + (c ? c.name : ln.c), ln.e);
    },
    setControlRating: function (ctl, field, value) {
      ctl[field] = value;
      var touched = {};
      (D.linksByCtl[ctl.id] || []).forEach(function (ln) {
        if (touched[ln.r]) return;
        touched[ln.r] = true;
        pushChange(ln.r, "control", "Control " + (field === "design" ? "design" : "performance") + " rating set to " + value + ": " + ctl.name, ln.e);
      });
    },
    affirmationOf: function (rauId) { return D.affByRau[rauId] || null; },
    challengesOf: function (rauId) { return D.chalByRau[rauId] || []; },
    addChallenge: function (ch) {
      D.entities.challenges.push(ch);
      (D.chalByRau[ch.rauId] = D.chalByRau[ch.rauId] || []).push(ch);
    },
    adoptChange: function (rauId, row) {
      var a = D.affByRau[rauId];
      if (!a) return;
      var i = a.pending.indexOf(row);
      if (i >= 0) a.pending.splice(i, 1);
    },
    affirm: function (rauId, by, snapshot) {
      var a = D.affByRau[rauId];
      if (!a) {
        a = { rauId: rauId, pending: [] };
        D.entities.affirmations.push(a);
        D.affByRau[rauId] = a;
      }
      a.prior = a.snapshot || null;
      a.snapshot = snapshot;
      a.date = (GRC.ctx && GRC.ctx.fmt) ? GRC.ctx.fmt.today() : "";
      a.by = by;
      a.pending = [];
      return a;
    },
    ratingsOfRau: function (rauId) { return D.ratByRau[rauId] || []; },
    ratingsOfEvent: function (evId) { return D.ratByEvent[evId] || []; },
    ratingOf: function (rauId, evId) { return D.ratKey[rauId + "|" + evId] || null; },
    setRating: function (row) {
      var key = row.rauId + "|" + row.eventId;
      var old = D.ratKey[key];
      function drop(arr) { var i = arr.indexOf(old); if (i >= 0) arr.splice(i, 1); }
      if (old) { drop(D.entities.ratings); drop(D.ratByRau[old.rauId] || []); drop(D.ratByEvent[old.eventId] || []); }
      D.entities.ratings.push(row);
      (D.ratByRau[row.rauId] = D.ratByRau[row.rauId] || []).push(row);
      (D.ratByEvent[row.eventId] = D.ratByEvent[row.eventId] || []).push(row);
      D.ratKey[key] = row;
      pushChange(row.rauId, "rating", (row.ov ? "Inherent rating overridden on " : "Inherent rating saved for ") + evName(row.eventId), row.eventId);
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
    ["orgNodes", "services", "raus", "riskEvents", "mcrs", "register", "requests", "metaQuestions", "rubric", "ratings", "controls", "controlLinks", "expectedControls", "affirmations", "challenges"].forEach(function (k) {
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
      if (s.state) {
        Object.keys(s.state).forEach(function (k) { state.set(k, s.state[k]); });
        if (s.state.role) {
          var sel = document.getElementById("g-role");
          if (sel) sel.value = s.state.role;
        }
      }
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

  /* ==SECTION:worklist== */
  /* "My list": a shopping cart for work. Browse anywhere, add items with
     one click, then work through the list step by step. Items know how
     to check whether they look finished. Persists per release, like the
     feedback drawer; intended for people who do not live in this tool. */
  var CART = [];
  var CART_KEY = "grc-worklist";
  function cartLoad() {
    CART_KEY = "grc-worklist-" + (D && D.release ? D.release.number : "R");
    try { CART = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch (e) { CART = []; }
    if (!Array.isArray(CART)) CART = [];
  }
  function cartSave() { try { localStorage.setItem(CART_KEY, JSON.stringify(CART)); } catch (e) { } }
  function cartPaint() {
    var p = document.getElementById("g-cart-pill");
    if (!p) return;
    p.innerHTML = "My list <span class='n'>" + CART.length + "</span>";
  }
  function cartLooksDone(it) {
    try {
      if (it.kind === "rate") return !!data.ratingOf(it.rauId, it.eventId);
      if (it.kind === "mitigate") return data.controlsOfInstance(it.rauId, it.eventId).length > 0;
      if (it.kind === "expected") {
        var rules = data.expectedFor(it.eventId);
        if (!rules.length) return true;
        var cs = data.controlsOfInstance(it.rauId, it.eventId);
        return rules.every(function (rule) { return cs.some(function (c) { return c.id === rule.controlId; }); });
      }
      if (it.kind === "challenge") {
        var ch = null;
        D.entities.challenges.forEach(function (c) { if (c.id === it.chId) ch = c; });
        return !ch || ch.state === "upheld" || ch.state === "withdrawn";
      }
      if (it.kind === "affirm") {
        var r = data.byId("raus", it.rauId);
        return r ? GRC.engine.rcsa.affState(r).state === "current" : true;
      }
    } catch (e) { }
    return false;
  }
  var KIND_LABEL = {
    rate: ["Rate", "warn"], mitigate: ["Add controls", "bad"], expected: ["Expected control", "bad"],
    challenge: ["Challenge", "warn"], affirm: ["Affirm", "info"], review: ["Review", ""]
  };
  GRC.cart = {
    all: function () { return CART; },
    count: function () { return CART.length; },
    has: function (key) { return CART.some(function (x) { return x.key === key; }); },
    add: function (it) {
      if (GRC.cart.has(it.key)) return;
      it.added = fmt.today();
      CART.push(it);
      cartSave(); cartPaint();
      if (GRC.ctx && GRC.ctx.ui) GRC.ctx.ui.toast("Added to My list (" + CART.length + "). Work it whenever you like.");
    },
    remove: function (key) {
      CART = CART.filter(function (x) { return x.key !== key; });
      cartSave(); cartPaint();
    },
    toggle: function (it) { if (GRC.cart.has(it.key)) GRC.cart.remove(it.key); else GRC.cart.add(it); },
    clear: function () { CART = []; cartSave(); cartPaint(); },
    btn: function (it) {
      var b = document.createElement("button");
      function paint() {
        var has = GRC.cart.has(it.key);
        b.className = "g-btn sm" + (has ? " cart-in" : "");
        b.textContent = has ? "In list" : "+ My list";
        b.title = has ? "In your work list; click to remove" : "Add to your work list: collect now, work it later";
      }
      b.onclick = function (e) { e.stopPropagation(); GRC.cart.toggle(it); paint(); };
      paint();
      return b;
    },
    open: cartOpen,
    work: cartWork
  };
  function cartOpen() {
    var ui = GRC.ctx.ui;
    var body = ui.el("div");
    body.appendChild(ui.el("p", { class: "g-muted", style: "font-size:12.5px;margin:0 0 10px" },
      "Collect work as you browse, like a shopping cart: nothing happens until you work the list. Items check themselves off-color when they look finished; you confirm."));
    if (!CART.length) body.appendChild(ui.empty("Empty. Look for the + My list button on gaps, unrated instances, challenges, and affirmations."));
    CART.slice().forEach(function (it) {
      var kl = KIND_LABEL[it.kind] || [it.kind, ""];
      var done = cartLooksDone(it);
      body.appendChild(ui.el("div", { class: "fb-item" }, [
        ui.el("div", { class: "g-row" }, [
          ui.badge(kl[0], kl[1]),
          done ? ui.el("span", { class: "g-badge g-badge--ok", title: "The record says this is handled; remove it when you agree" }, "LOOKS DONE") : null,
          ui.el("span", { style: "flex:1;min-width:220px" }, it.label),
          ui.el("button", {
            class: "g-btn sm g-btn--primary", onclick: function () { dr.close(); GRC.go(it.route); }
          }, "Open"),
          ui.el("button", { class: "g-btn sm", title: "Remove from the list", onclick: function () { GRC.cart.remove(it.key); dr.close(); cartOpen(); } }, "x")]),
        it.sub ? ui.el("div", { class: "g-muted", style: "font-size:12px;margin-top:3px" }, it.sub) : null]));
    });
    var foot = ui.el("div", { class: "g-row", style: "margin-top:12px" });
    var workBtn = ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { dr.close(); cartWork(); } }, "Work through my list (" + CART.length + ")");
    workBtn.disabled = !CART.length;
    foot.appendChild(workBtn);
    foot.appendChild(ui.el("button", {
      class: "g-btn", onclick: function () {
        var lines = CART.map(function (it, i) { return (i + 1) + ". [" + it.kind + "] " + it.label + (it.sub ? " (" + it.sub + ")" : "") + " -> #/" + it.route; });
        var txt = "My list, " + (D.release ? D.release.number : "") + ", " + fmt.today() + "\n" + lines.join("\n");
        try { navigator.clipboard.writeText(txt); GRC.ctx.ui.toast("List copied."); } catch (e) { prompt("Copy your list:", txt); }
      }
    }, "Copy list"));
    foot.appendChild(ui.el("button", { class: "g-btn", onclick: function () { if (confirm("Clear the whole list?")) { GRC.cart.clear(); dr.close(); } } }, "Clear"));
    body.appendChild(foot);
    var dr = ui.drawer({ title: "My list: collected work (" + CART.length + ")", body: body });
  }
  /* checkout: step through the list one item at a time */
  function cartWork() {
    var old = document.getElementById("g-cartbar");
    if (old) old.parentNode.removeChild(old);
    if (!CART.length) { if (GRC.ctx && GRC.ctx.ui) GRC.ctx.ui.toast("Your list is empty."); return; }
    var i = 0;
    var bar = document.createElement("div");
    bar.id = "g-cartbar";
    document.body.appendChild(bar);
    function close() { if (bar.parentNode) bar.parentNode.removeChild(bar); }
    function show(navigate) {
      if (!CART.length) {
        if (GRC.ctx && GRC.ctx.ui) GRC.ctx.ui.toast("List complete. Nice work.");
        close(); return;
      }
      if (i >= CART.length) i = 0;
      var it = CART[i];
      var done = cartLooksDone(it);
      bar.innerHTML = "";
      var lbl = document.createElement("span");
      lbl.className = "t";
      lbl.textContent = (i + 1) + " of " + CART.length + ": " + it.label;
      bar.appendChild(lbl);
      if (done) {
        var dchip = document.createElement("span");
        dchip.className = "donechip";
        dchip.textContent = "LOOKS DONE";
        bar.appendChild(dchip);
      }
      function mk(label, cls, fn) {
        var b = document.createElement("button");
        b.textContent = label; if (cls) b.className = cls; b.onclick = fn;
        bar.appendChild(b);
        return b;
      }
      mk("Open", "p", function () { GRC.go(it.route); });
      mk("Done, next", "", function () { GRC.cart.remove(it.key); show(true); });
      mk("Skip", "", function () { i++; show(true); });
      mk("Exit", "", close);
      if (navigate) GRC.go(it.route);
    }
    show(true);
  }

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
    cartLoad();
    var cpill = document.createElement("button");
    cpill.id = "g-cart-pill";
    cpill.title = "Your work list: collect items as you browse, then work through them.";
    cpill.onclick = cartOpen;
    document.body.appendChild(cpill);
    cartPaint();
    window.addEventListener("hashchange", render);
    render();
  };
})();

<!-- ==GRC-FILE-END== -->

<!-- ==GRC-FILE-BEGIN path=kernel/engine.js bytes=27627 sha256=cd339d529e7c6ed04d239ad819ea7b332cd5d3cf79b0ec4e9052147367a2eab7== -->
/* GRC kernel/engine.js v1.4.0 2026-08-23 */
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

  /* ==SECTION:rcsa== */
  /* Capability 5: the living RCSA. Control effectiveness is the weaker of
     design and performance; the instance's control environment strength
     knocks the inherent band down to a three-band residual (Strong takes
     it down two, Adequate one, Weak none). Affirmation state and the
     2LOD attention ranking are computed live; nothing is staged. */
  var EFF_RANK = { "effective": 2, "partially-effective": 1, "ineffective": 0 };
  function effectiveness(control) {
    var d = EFF_RANK[control.design] === undefined ? 2 : EFF_RANK[control.design];
    var p = EFF_RANK[control.perf] === undefined ? 2 : EFF_RANK[control.perf];
    var w = Math.min(d, p);
    return w === 2 ? "effective" : w === 1 ? "partially-effective" : "ineffective";
  }
  function envStrength(rauId, eventId, memo) {
    var data = GRC.ctx.data;
    var ctls = data.controlsOfInstance(rauId, eventId);
    var expRules = data.expectedFor(eventId);
    var expMissing = expRules.some(function (rule) {
      return !ctls.some(function (c) { return c.id === rule.controlId; });
    });
    var why = [];
    if (!ctls.length) return { strength: "weak", why: ["No control linked"] };
    var bestRank = -1, anchor = false;
    ctls.forEach(function (c) {
      var e = effectiveness(c);
      var r = EFF_RANK[e];
      if (r > bestRank) bestRank = r;
      if (r === 2) {
        var isExp = expRules.some(function (rule) { return rule.controlId === c.id; });
        var isKey;
        if (memo) {
          if (memo[c.id] === undefined) memo[c.id] = derivedKey(c).key;
          isKey = memo[c.id];
        } else isKey = derivedKey(c).key;
        if (isExp || isKey) anchor = true;
      }
    });
    if (bestRank <= 0) return { strength: "weak", why: ["No control better than ineffective"] };
    if (anchor && !expMissing) {
      return { strength: "strong", why: ["Effective key or expected control in place", "No expected control missing"] };
    }
    if (expMissing) why.push("Expected control missing");
    if (!anchor) why.push(bestRank === 2 ? "Effective controls, none key or expected" : "Best control only partially effective");
    return { strength: "adequate", why: why };
  }
  function residualOf(inhBand, strength) {
    var idx = INH.bands.indexOf(inhBand);
    if (idx < 0) return null;
    var knock = strength === "strong" ? 2 : strength === "adequate" ? 1 : 0;
    var kb = INH.bands[Math.max(0, idx - knock)];
    var res = (kb === "critical" || kb === "high") ? "high" : kb === "moderate" ? "moderate" : "low";
    return { residual: res, knocked: kb, knock: knock };
  }
  function lineOf(rau, g, memo) {
    var data = GRC.ctx.data;
    var t = data.ratingOf(rau.id, g.eventId);
    var band = t ? inherentBand(levelsFromArray(t.f)).band : null;
    var env = envStrength(rau.id, g.eventId, memo);
    var res = band ? residualOf(band, env.strength) : null;
    return { g: g, rating: t, band: band, env: env, res: res };
  }
  function residualProfile(rau, memo) {
    var data = GRC.ctx.data;
    var out = { high: 0, moderate: 0, low: 0, unrated: 0, lines: [] };
    data.regOfRau(rau.id).forEach(function (g) {
      if (g.status !== "confirmed") return;
      var ln = lineOf(rau, g, memo);
      out.lines.push(ln);
      if (!ln.res) out.unrated++;
      else out[ln.res.residual]++;
    });
    return out;
  }
  function affState(rau) {
    var data = GRC.ctx.data;
    var aff = data.affirmationOf(rau.id);
    var today = GRC.ctx.fmt.today();
    var pending = aff && aff.pending ? aff.pending.length : 0;
    var openChal = data.challengesOf(rau.id).filter(function (c) { return c.state === "open" || c.state === "responded"; }).length;
    if (!aff || !aff.date) return { state: "never", days: null, aff: aff, pending: pending, openChal: openChal };
    var days = Math.round((new Date(today) - new Date(aff.date)) / 86400000);
    var state = days > 365 ? "overdue" : days > 305 ? "due" : pending ? "pending-changes" : "current";
    return { state: state, days: days, aff: aff, pending: pending, openChal: openChal };
  }
  /* 2LOD attention: the non-standard and unfamiliar, ranked with reasons.
     side: "operational" (ORBO), "compliance" (BACO), or null for both. */
  function attention(side) {
    var data = GRC.ctx.data;
    var items = [];
    var overByRau = {};
    data.all("raus").forEach(function (rau) {
      var rated = 0, over = 0;
      data.regOfRau(rau.id).forEach(function (g) {
        if (g.status !== "confirmed") return;
        var ev = data.byId("riskEvents", g.eventId);
        if (side && ev && ev.side !== side) return;
        var t = data.ratingOf(rau.id, g.eventId);
        if (!t) return;
        rated++;
        if (t.ov) over++;
        var band = inherentBand(levelsFromArray(t.f)).band;
        var out = peerOutlier(rau, g.eventId, levelsFromArray(t.f));
        if (out) items.push({ kind: "outlier", w: 90, rau: rau, eventId: g.eventId, reason: "Final band " + out.mine + " vs LOB median " + out.median + " across " + out.peers + " peers" });
        if (g.score >= 70 && band === "low") items.push({ kind: "mismatch", w: 60, rau: rau, eventId: g.eventId, reason: "Applicability " + g.score + " but rated Low: strong fit, weak rating" });
        if (g.score < 45 && (band === "critical" || band === "high")) items.push({ kind: "mismatch", w: 55, rau: rau, eventId: g.eventId, reason: "Applicability only " + g.score + " but rated " + band + ": check the confirmation itself" });
      });
      if (rated >= 5 && over / rated > 0.3) overByRau[rau.id] = { rau: rau, over: over, rated: rated };
      var st = affState(rau);
      if (st.pending) {
        var oldest = null;
        (st.aff.pending || []).forEach(function (p) { if (!oldest || p.date < oldest) oldest = p.date; });
        items.push({ kind: "changes", w: 40 + Math.min(30, st.pending * 5), rau: rau, reason: st.pending + " unadopted change" + (st.pending === 1 ? "" : "s") + " since the last affirmation" + (oldest ? ", oldest " + oldest : "") });
      }
      if (st.state === "overdue") items.push({ kind: "overdue", w: 70, rau: rau, reason: "Affirmation overdue: " + st.days + " days since " + st.aff.date });
    });
    Object.keys(overByRau).forEach(function (k) {
      var x = overByRau[k];
      items.push({ kind: "overrides", w: 65, rau: x.rau, reason: x.over + " of " + x.rated + " ratings overridden (" + Math.round(100 * x.over / x.rated) + "%): judgment-dense RAU" });
    });
    data.all("raus").forEach(function (rau) {
      coverage(rau).expectedMissing.forEach(function (x) {
        var ev = data.byId("riskEvents", x.g.eventId);
        if (side && ev && ev.side !== side) return;
        items.push({ kind: "exp-gap", w: 80, rau: rau, eventId: x.g.eventId, reason: "Expected control missing: " + (x.control ? x.control.name : x.rule.controlId) });
      });
    });
    data.all("challenges").forEach(function (ch) {
      if (ch.state !== "open" && ch.state !== "responded") return;
      var rau = data.byId("raus", ch.rauId);
      if (!rau) return;
      items.push({ kind: "challenge", w: 75, rau: rau, eventId: ch.eventId || null, chId: ch.id, reason: (ch.state === "open" ? "Open" : "Awaiting resolution:") + " challenge " + ch.id + " by " + ch.by + ": " + ch.what.slice(0, 80) });
    });
    items.sort(function (a, b) { return b.w - a.w; });
    return items;
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
    },
    rcsa: {
      effectiveness: effectiveness, envStrength: envStrength,
      residual: residualOf, line: lineOf, profile: residualProfile,
      affState: affState, attention: attention
    }
  };
})();

<!-- ==GRC-FILE-END== -->

<!-- ==GRC-FILE-BEGIN path=kernel/ui.js bytes=8259 sha256=7fbd15e0282100bed6f3f1daf4b517c5ee3f279b888bdeb8187a6e3e54c22e1e== -->
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

<!-- ==GRC-FILE-END== -->

<!-- ==GRC-FILE-BEGIN path=kernel/charts.js bytes=6512 sha256=0d99e2069f6bf30d5a2e3e207acf7dc1fe4102a32b318d74c28e109d4cc19712== -->
/* GRC kernel/charts.js v1.0.1 2026-08-23 */
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
      t.textContent = it.label.length > 34 ? it.label.slice(0, 33) + "..." : it.label;
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

<!-- ==GRC-FILE-END== -->

<!-- ==GRC-FILE-BEGIN path=modules/home.js bytes=10137 sha256=6e6c01a3d034bba8ef816a70878a1827cf78aad0af9465db039ba92f8c33e572== -->
/* GRC modules/home.js v1.4.0 2026-08-23 */
/* Home: the capability flow doubles as a lens. Click boxes to select a
   development scope; everything not supporting that scope grays out, and
   the readout shows what else is required and a suggested build order. */
(function () {
  "use strict";
  function home(el, ctx) {
    var ui = ctx.ui, data = ctx.data;
    var sel = (ctx.state.get("capLens") || []).slice();
    function setSel(s) { ctx.state.set("capLens", s); }

    el.appendChild(ui.el("div", { class: "g-page-head" }, [
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "RCSA program"),
        ui.el("div", { class: "g-muted" }, "A working proposal for the future GRC. This release builds capabilities 1 through 5 end to end. Click capability boxes below to isolate a scope; everything outside its support set grays out.")]),
      ui.el("div", { class: "sp" }),
      ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { ctx.go("present"); } }, "Start guided demo")]));

    /* ==SECTION:lens-math== */
    var closure = sel.length ? GRC.caps.closure(sel) : null;
    function boxState(n) {
      if (!closure) return "";
      if (sel.indexOf(n) >= 0) return "sel";
      if (closure.indexOf(n) >= 0) return "req";
      return "dim";
    }
    function toggle(n) {
      var i = sel.indexOf(n);
      if (i >= 0) sel.splice(i, 1); else sel.push(n);
      setSel(sel);
      var container = el;
      container.innerHTML = "";
      home(container, ctx);
    }

    /* ==SECTION:map== */
    function box(n, sub, openRoute) {
      var st = boxState(n);
      var live = GRC.caps.built(n);
      var kids = [
        ui.el("div", { class: "cn" }, "CAPABILITY " + n + (live ? "" : " (LATER PHASE)")),
        ui.el("div", { class: "ct" }, GRC.caps.name(n)),
        ui.el("div", { class: "cs " + (live ? "" : "g-muted") }, sub)];
      if (st === "sel") kids.push(ui.el("span", { class: "selmark" }, "SELECTED"));
      if (st === "req") kids.push(ui.el("span", { class: "reqmark" }, "REQUIRED"));
      if (openRoute) {
        kids.push(ui.el("a", {
          href: "#/" + openRoute, style: "font-size:11.5px;margin-top:4px;display:inline-block",
          onclick: function (e) { e.stopPropagation(); }
        }, live ? "Open" : "Open skeleton"));
      }
      return ui.el("div", {
        class: "capbox " + (live ? "live " : "") + st,
        onclick: function () { toggle(n); },
        title: "Click to add or remove Capability " + n + " from the scope lens."
      }, kids);
    }
    var arrow = function () { return ui.el("span", { class: "flowarrow" }); };
    var mapCard = ui.el("div", { class: "g-card" });
    mapCard.appendChild(ui.el("div", { class: "g-row", style: "justify-content:space-between" }, [
      ui.el("div", { class: "g-h2", style: "margin:0" }, "The capability flow"),
      sel.length ? ui.el("button", { class: "g-btn sm", onclick: function () { setSel([]); el.innerHTML = ""; home(el, ctx); } }, "Clear selection") : ui.el("span", { class: "g-muted", style: "font-size:12px" }, "Click boxes to build a scope")]));
    mapCard.appendChild(ui.el("div", { style: "display:grid;grid-template-columns:1fr 20px 1fr 20px 1fr 20px 1fr 20px 1fr;gap:6px;align-items:stretch;margin:10px 0" }, [
      box(1, "Intake, process mapping, metadata", "raus"), arrow(),
      box(2, "Applicability of risk events and MCRs", "riskid"), arrow(),
      box(3, "Evidence-anchored ratings", "inherent"), arrow(),
      box(4, "Derived key, expected controls", "controls"), arrow(),
      box(5, "Affirmation, challenge, residual", "rcsa")]));
    mapCard.appendChild(ui.el("div", { style: "display:grid;grid-template-columns:1fr 1fr 2fr;gap:6px;margin-bottom:10px" }, [
      box(7, "Feeds from Control Identification", "soon/Testing-0"),
      box(8, "Feeds from Control Identification", "soon/Testing-1"),
      box(9, "Watches capabilities 1 through 6", "soon/Monitoring-0")]));
    mapCard.appendChild(ui.el("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:6px" }, [
      box(6, "New activity and change feed capabilities 1 and 2", "soon/Signals-0"),
      box(10, "Governs every capability above", "soon/Policy-0")]));
    el.appendChild(mapCard);

    /* ==SECTION:program-health== */
    /* Capability 9 preview: monitoring metrics computed LIVE from the
       record, never stored, so they always reconcile with the screens
       they link to. Rates and gaps, not decoration. */
    (function healthCard() {
      var R = ctx.engine.rcsa;
      var confirmed = 0, rated = 0;
      data.all("register").forEach(function (g) {
        if (g.status !== "confirmed") return;
        confirmed++;
        if (data.ratingOf(g.rauId, g.eventId)) rated++;
      });
      var ovr = 0, totR = data.all("ratings").length;
      data.all("ratings").forEach(function (t) { if (t.ov) ovr++; });
      var gaps = 0;
      data.all("expectedControls").forEach(function (rule) {
        data.regOfEvent(rule.eventId).forEach(function (g) {
          if (g.status !== "confirmed") return;
          if (!data.controlsOfInstance(g.rauId, g.eventId).some(function (c) { return c.id === rule.controlId; })) gaps++;
        });
      });
      var over = 0, due = 0, pendChg = 0;
      data.all("raus").forEach(function (r) {
        var st = R.affState(r);
        if (st.state === "overdue") over++;
        else if (st.state === "due") due++;
        else if (st.state === "pending-changes") pendChg++;
      });
      var openCh = data.all("challenges").filter(function (c) { return c.state === "open" || c.state === "responded"; }).length;
      function row(label, value, kind, route, hint) {
        return ui.el("div", { class: "g-row", style: "padding:4px 0;border-bottom:1px dashed var(--g-line-soft)" }, [
          ui.el("span", { style: "width:250px;flex:none;font-size:13px" }, label),
          ui.el("span", { class: "g-badge g-badge--" + kind, title: hint || "" }, value),
          ui.el("span", { class: "sp", style: "flex:1" }),
          ui.el("a", { href: "#/" + route, style: "font-size:12px" }, "open the screen it reads from")]);
      }
      var covPct = confirmed ? Math.round(100 * rated / confirmed) : 0;
      var ovPct = totR ? Math.round(100 * ovr / totR) : 0;
      el.appendChild(ui.card({
        title: "Program health (Capability 9 preview)",
        body: ui.el("div", {}, [
          ui.el("div", { class: "g-row", style: "margin-bottom:6px" }, [
            ui.badge("C9 preview", "brand"),
            ui.el("span", { class: "g-muted", style: "font-size:12.5px" }, "Computed live from the record on every visit, exactly how Monitoring will read it. Nothing here is a stored number.")]),
          row("Inherent rating coverage", covPct + "% of confirmed instances", covPct >= 85 ? "ok" : "warn", "inherent", rated + " of " + confirmed + " rated"),
          row("Override rate", ovPct + "% of ratings", ovPct <= 15 ? "ok" : "warn", "inherent", ovr + " documented overrides"),
          row("Expected-control gaps", String(gaps), gaps ? "bad" : "ok", "controls-coverage", "Expected controls missing where their situation is live"),
          row("Affirmations overdue / due", over + " / " + due, over ? "bad" : due ? "warn" : "ok", "rcsa", pendChg + " more RAUs carry unadopted changes"),
          row("Challenges open or unresolved", String(openCh), openCh ? "warn" : "ok", "rcsa-challenges", "Filed by the second line, answered by owners")])
      }));
    })();

    /* ==SECTION:lens-readout== */
    if (closure) {
      var required = closure.filter(function (n) { return sel.indexOf(n) < 0; });
      var order = GRC.caps.order(closure);
      var already = order.filter(function (n) { return GRC.caps.built(n); });
      var toBuild = order.filter(function (n) { return !GRC.caps.built(n); });
      el.appendChild(ui.card({
        title: "Scope readout",
        body: ui.el("div", {}, [
          ui.kv([
            ["Selected", sel.slice().sort(function (a, b) { return a - b; }).map(function (n) { return "C" + n + " " + GRC.caps.name(n); }).join(";  ")],
            ["Also required", required.length ? required.map(function (n) { return "C" + n + " " + GRC.caps.name(n); }).join(";  ") : "Nothing else. The selection stands on its own."],
            ["Suggested build order", order.map(function (n) { return "C" + n; }).join("  then  ")],
            ["Already built", already.length ? already.map(function (n) { return "C" + n; }).join(", ") : "None yet"],
            ["Still to build", toBuild.length ? toBuild.map(function (n) { return "C" + n; }).join(", ") : "Nothing; this scope is covered by the current release"]]),
          ui.el("p", { class: "g-muted", style: "font-size:12.5px;margin:10px 0 0" },
            "The strip under the tabs traces this as you move: every screen names its capability, and key actions call out which capability they belong to. What is grayed here will not work until its box is built.")])
      }));
    }

    /* ==SECTION:teasers== */
    el.appendChild(ui.el("div", { class: "g-split" }, [
      ui.card({
        title: "Feature gallery",
        actions: [ui.el("button", { class: "g-btn sm", onclick: function () { ctx.go("gallery"); } }, "Open the gallery")],
        body: ui.el("p", { style: "margin:0" }, "Curated, concrete examples of features we could ship, grouped by theme and complexity, each opening a live example. Mark each Keep, Discuss, or Cut; votes export with feedback so the room decides from one list.")
      }),
      ui.card({
        title: "About this mockup", body: ui.el("p", { class: "g-muted", style: "margin:0" },
          "A clickable design proposal running from local files on synthetic data shaped like the real inventory. The release number in the banner identifies this build; the feedback pill at the bottom left captures changes tied to the page you are on. Actions are session only; Preflight has a reset.")
      })]));
  }

  GRC.register({
    id: "home", version: "1.4.0", tab: "Home",
    rail: [{ label: "Program map", route: "home", order: 10 }],
    caps: { "home": null },
    routes: { "home": home }
  });
})();

<!-- ==GRC-FILE-END== -->

<!-- ==GRC-FILE-BEGIN path=modules/gallery.js bytes=15092 sha256=493a915db8d25df941e87e50b222f26e7fb603f1fe3367f0a1a8e34dd9d4594a== -->
/* GRC modules/gallery.js v1.3.0 2026-08-23 */
/* Feature gallery: curated, concrete examples of features to ship, grouped
   by theme and complexity. Each opens a live example. Keep / Discuss / Cut
   votes are stored with feedback and included in the export, so a room can
   agree on scope from one list. Two items are previews of later
   capabilities, built as small vignettes. */
(function () {
  "use strict";

  /* ==SECTION:vignette-data== */

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
          { id: "gal-assign-control", tier: "Basic", title: "Assign a new control to an existing risk instance", what: "Link a control to a confirmed risk on a RAU. Graduated from preview to the real Capability 4 flow: expected controls, shareable matches, drafted skeletons.", show: go("gallery/assign-control") },
          { id: "gal-why", tier: "Standard", title: "See exactly why a score is what it is", what: "Every applicability number opens into its eight-category rubric breakdown. Same math for every RAU.", show: go("riskid/" + story.id, "Open Why this score on any candidate.") },
          { id: "gal-excl", tier: "Standard", title: "Exclusions scope out whole slices of the universe", what: "A confirmed does-not-do answer in the survey suppresses matching candidates, visibly and reversibly.", show: go("riskid/" + story.id, "The suppressed panel at the top shows what the survey ruled out.") },
          { id: "gal-resolve", tier: "Advanced", title: "One answer rescores the whole stack", what: "Resolve asks a targeted question; the answer updates the RAU's metadata, so every candidate on the workbench rescores consistently.", show: go("riskid/" + story.id, "Open Resolve on an item in the middle band.") },
          { id: "gal-regchange", tier: "Exotic", title: "A regulatory change re-opens applicability", what: "A revised MCR arrives from RRCM; the tool lists who has it attached and who matches its profile but never assessed it. A preview of Capability 6.", show: go("gallery/reg-change") }
        ]
      },
      {
        theme: "Working across the tool", items: [
          { id: "gal-search", tier: "Basic", title: "Search everything from one box", what: "One search across RAUs, risk events, MCRs, and pipeline requests.", show: function () { ctx.state.set("search", "escrow"); ctx.go("search"); } },
          { id: "gal-worklist", tier: "Basic", title: "Collect work like a shopping cart", what: "A + My list button sits on gaps, unrated instances, challenges, and affirmations. Collect as you browse, then Work through the list item by item; it notices when something looks finished.", show: function () { ctx.go("rcsa-attention"); setTimeout(function () { ctx.ui.toast("Add a few rows with + My list, then open My list at the bottom right."); }, 400); } },
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
          it.id === "gal-assign-control" ? ui.badge("Graduated: built in R6", "ok") : null,
          it.id === "gal-regchange" ? ui.badge("Capability 6 preview", "brand") : null]),
          ui.el("div", { class: "t" }, it.title),
          ui.el("div", { class: "w" }, it.what),
          voteRow]));
      });
      el.appendChild(ui.card({ title: g.theme, body: grid }));
    });
  }

  /* ==SECTION:vignette-control== */
  /* This vignette was the Capability 4 preview through R5. The capability
     is now built, so the page hands visitors to the real flow instead of
     a mock; the gallery card and its votes stay for the feature list. */
  function assignControl(el, ctx) {
    var ui = ctx.ui, data = ctx.data;
    var story = findStory(data);
    var reg = data.regOfRau(story.id).filter(function (g) { return g.status === "confirmed"; });
    var row = reg[0];
    el.appendChild(ui.el("div", { class: "g-page-head" }, [
      ui.el("div", {}, [
        ui.el("div", { class: "g-row" }, [ui.el("span", { class: "g-h1" }, "Assign a control to a risk instance"), ui.badge("Graduated: built in R6", "ok")]),
        ui.el("div", { class: "g-muted" }, "This gallery item started as a Capability 4 preview. The real thing now exists: a central inventory, expected controls, shareable matches, drafted skeletons, and key status derived from the risk landscape.")]),
      ui.el("div", { class: "sp" }),
      ui.el("button", { class: "g-btn", onclick: function () { ctx.go("gallery"); } }, "Back to gallery")]));
    el.appendChild(ui.card({
      title: "Where the preview went", body: ui.el("div", {}, [
        ui.el("p", {}, "The basic move this vignette mocked, linking a control to a confirmed risk instance, is now the three-tier recommendation flow: the expected control first, shareable matches ranked by attach rate, then a drafted skeleton the business documents. The Keep / Discuss / Cut vote on the gallery card still counts toward the feature list."),
        ui.el("div", { class: "g-row" }, [
          row ? ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { ctx.go("attach/" + story.id + "/" + row.eventId); } }, "Open the real attach flow on the story RAU") : null,
          ui.el("button", { class: "g-btn", onclick: function () { ctx.go("controls"); } }, "Open the control inventory"),
          ui.el("button", { class: "g-btn", onclick: function () { ctx.go("controls-key"); } }, "See derived vs declared key")])])
    }));
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
    id: "gallery", version: "1.3.0", tab: "Home",
    caps: {
      "gallery": { primary: [1, 2] },
      "gallery/assign-control": { primary: [4], uses: [2], preview: true },
      "gallery/reg-change": { primary: [6], uses: [1, 2], preview: true }
    },
    rail: [{ label: "Feature gallery", route: "gallery", order: 20 }],
    routes: { "gallery": gallery, "gallery/assign-control": assignControl, "gallery/reg-change": regChange }
  });
})();

<!-- ==GRC-FILE-END== -->

<!-- ==GRC-FILE-BEGIN path=modules/rau.js bytes=11777 sha256=525fdc67b4e5a6082017f96969b46842add4dca6c85eab5a2898cb4cb4c1909c== -->
/* GRC modules/rau.js v1.3.0 2026-08-23 */
/* Capability 1: RAU directory (hierarchy tree with carets, flat list as a
   toggle) and profile quality. Expanding levels never leaves the page.
   The tree and the flat list share one set of filters; while a filter is
   active the tree auto-expands the branches that contain matches (FB-014). */
(function () {
  "use strict";
  var F = { q: "", lob: "", cat: "", status: "", change: "" };
  var VIEW = "tree";
  var OPEN = {};   /* expanded nodes, kept for the session */
  var CLOSED = {}; /* manual collapses while a filter is auto-expanding */

  /* ==SECTION:directory== */
  function directory(el, ctx) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    el.appendChild(ui.el("div", { class: "g-page-head" }, [
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "Risk Assessable Units"),
        ui.el("div", { class: "g-muted" }, "A RAU is the intersection of a business and a service, created at the SubLOB level. Expand the hierarchy in place; nothing here navigates away until you open a record.")]),
      ui.el("div", { class: "sp" }),
      ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { ctx.go("pipeline/new"); } }, "+ Request new RAU")]));
    var body = ui.el("div");
    el.appendChild(body);
    draw(body, ctx);
  }

  function matches(ctx, r) {
    var data = ctx.data;
    if (F.q && (r.id + " " + r.name).toLowerCase().indexOf(F.q.toLowerCase()) < 0) return false;
    if (F.lob && data.orgPath(r.subLobId).lobId !== F.lob) return false;
    if (F.cat && r.category !== F.cat) return false;
    if (F.status && r.riskIdStatus !== F.status) return false;
    if (F.change && r.changeLevel !== F.change) return false;
    return true;
  }
  function filterActive() { return !!(F.q || F.lob || F.cat || F.status || F.change); }

  function draw(body, ctx) {
    var ui = ctx.ui, data = ctx.data;
    body.innerHTML = "";
    function setF(k, v) { F[k] = v; CLOSED = {}; draw(body, ctx); }
    var matched = data.all("raus").filter(function (r) { return matches(ctx, r); });
    var bar = ui.toolbar([
      ui.el("span", { class: "g-row", style: "gap:0" }, [
        ui.el("button", { class: "g-btn sm" + (VIEW === "tree" ? " g-btn--primary" : ""), style: "border-radius:4px 0 0 4px", onclick: function () { VIEW = "tree"; draw(body, ctx); } }, "Hierarchy"),
        ui.el("button", { class: "g-btn sm" + (VIEW === "flat" ? " g-btn--primary" : ""), style: "border-radius:0 4px 4px 0", onclick: function () { VIEW = "flat"; draw(body, ctx); } }, "Flat list")]),
      ui.searchBox({ value: F.q, placeholder: "Filter by id or name...", oninput: function (v) { setF("q", v); } }),
      ui.select({
        label: "LOB", value: F.lob, onchange: function (v) { setF("lob", v); },
        options: [{ value: "", label: "All lines of business" }].concat(data.lobs().map(function (l) { return { value: l.id, label: l.name }; }))
      }),
      ui.select({
        label: "Category", value: F.cat, onchange: function (v) { setF("cat", v); },
        options: [{ value: "", label: "All" }, { value: "business-service", label: "Business Service" },
        { value: "shared-services", label: "Shared Services" }, { value: "enterprise", label: "Enterprise" }]
      }),
      ui.select({
        label: "Risk ID", value: F.status, onchange: function (v) { setF("status", v); },
        options: [{ value: "", label: "All" }, { value: "complete", label: "Complete" },
        { value: "in-progress", label: "In progress" }, { value: "not-started", label: "Not started" }]
      }),
      ui.el("span", { class: "g-muted", style: "font-size:12px" }, ctx.fmt.num(matched.length) + " match")]);
    body.appendChild(bar);
    if (VIEW === "tree") drawTree(body, ctx); else drawFlat(body, ctx, matched);
  }

  /* ==SECTION:tree== */
  function drawTree(body, ctx) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    var active = filterActive();
    /* While filtering: branches with matches auto-expand and empty branches
       hide; a caret click still collapses (tracked in CLOSED until the
       filter changes). Without a filter the manual OPEN state applies. */
    function isOpen(id, hasMatches) {
      if (active) return hasMatches && !CLOSED[id];
      return !!OPEN[id];
    }
    function toggle(id) {
      if (active) CLOSED[id] = !CLOSED[id]; else OPEN[id] = !OPEN[id];
      draw(body, ctx);
    }
    var wrap = ui.el("div", { class: "g-tablewrap" });
    var t = ui.el("table", { class: "g-table" });
    t.appendChild(ui.el("tr", {}, [
      ui.el("th", {}, "Enterprise / LOB / SubLOB / RAU"),
      ui.el("th", {}, "Category"), ui.el("th", {}, "RAU Owner"),
      ui.el("th", {}, "Risk ID"), ui.el("th", { style: "text-align:right" }, "Confirmed risks")]));
    function caret(open) { return ui.el("span", { class: "caret" + (open ? " open" : "") }); }
    function confirmedOf(r) { return data.regOfRau(r.id).filter(function (g) { return g.status === "confirmed"; }).length; }
    var shown = 0;
    data.lobs().forEach(function (lob) {
      var subs = data.subLobs().filter(function (s) { return s.parentId === lob.id; });
      var subRows = [], lobRaus = 0, lobConf = 0;
      subs.forEach(function (s) {
        var rr = data.rausOfSub(s.id).filter(function (r) { return matches(ctx, r); });
        var sconf = 0; rr.forEach(function (r) { sconf += confirmedOf(r); });
        subRows.push({ s: s, rr: rr, conf: sconf });
        lobRaus += rr.length; lobConf += sconf;
      });
      if (active && !lobRaus) return;
      shown += lobRaus;
      var lopen = isOpen(lob.id, lobRaus > 0);
      var lr = ui.el("tr", { class: "tree-parent click" }, [
        ui.el("td", {}, [caret(lopen), lob.name + "  (" + lobRaus + (active ? " matching" : "") + " RAUs)"]),
        ui.el("td", {}, ""), ui.el("td", {}, ""), ui.el("td", {}, ""),
        ui.el("td", { class: "num" }, String(lobConf))]);
      lr.onclick = function () { toggle(lob.id); };
      t.appendChild(lr);
      if (!lopen) return;
      subRows.forEach(function (x) {
        if (active && !x.rr.length) return;
        var sopen = isOpen(x.s.id, x.rr.length > 0);
        var sr = ui.el("tr", { class: "tree-parent tree-ind1 click" }, [
          ui.el("td", {}, [caret(sopen), x.s.name + "  (" + x.rr.length + ")"]),
          ui.el("td", {}, ""), ui.el("td", {}, ""), ui.el("td", {}, ""),
          ui.el("td", { class: "num" }, String(x.conf))]);
        sr.onclick = function () { toggle(x.s.id); };
        t.appendChild(sr);
        if (!sopen) return;
        x.rr.forEach(function (r) {
          var rrow = ui.el("tr", { class: "tree-ind2 click" }, [
            ui.el("td", {}, [ui.el("span", { class: "g-mono g-muted" }, r.id + "  "), r.name]),
            ui.el("td", {}, fmt.cat(r.category)),
            ui.el("td", {}, r.roles.owner),
            ui.el("td", {}, ui.badge(r.riskIdStatus.replace("-", " "), fmt.riskIdKind(r.riskIdStatus))),
            ui.el("td", { class: "num" }, String(confirmedOf(r)))]);
          rrow.onclick = function () { ctx.go("raus/" + r.id); };
          t.appendChild(rrow);
        });
      });
    });
    if (active && !shown) {
      t.appendChild(ui.el("tr", {}, ui.el("td", { colspan: "5", class: "g-muted", style: "padding:14px" }, "No RAUs match the current filters.")));
    }
    wrap.appendChild(t);
    body.appendChild(wrap);
  }

  /* ==SECTION:flat== */
  function drawFlat(body, ctx, rs) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    body.appendChild(ui.table({
      cols: [
        { key: "id", label: "ID", sort: true, render: function (r) { return ui.el("span", { class: "g-mono" }, r.id); } },
        { key: "name", label: "Name", sort: true },
        { key: "lob", label: "LOB / SubLOB", render: function (r) { var p = data.orgPath(r.subLobId); return ui.el("span", {}, [p.lob, ui.el("div", { class: "g-muted", style: "font-size:12px" }, p.sub)]); } },
        { key: "category", label: "Category", render: function (r) { return fmt.cat(r.category); } },
        { key: "owner", label: "RAU Owner", render: function (r) { return r.roles.owner; } },
        { key: "riskIdStatus", label: "Risk ID", sort: true, render: function (r) { return ui.badge(r.riskIdStatus.replace("-", " "), fmt.riskIdKind(r.riskIdStatus)); } },
        { key: "inherent", label: "Inherent", sort: true, sortVal: function (r) { return ["low", "moderate", "high", "critical"].indexOf(ctx.engine.inherent.rollup(r).band); }, render: function (r) { var b = ctx.engine.inherent.rollup(r).band; return b ? ui.badge(b.charAt(0).toUpperCase() + b.slice(1), b === "low" ? "ok" : b === "moderate" ? "info" : b === "high" ? "warn" : "bad") : ui.el("span", { class: "g-muted" }, "-"); } },
        { key: "residual", label: "Residual", sort: true, sortVal: function (r) { var p = ctx.engine.rcsa.profile(r); return p.high * 100 + p.moderate; }, render: function (r) { var p = ctx.engine.rcsa.profile(r); if (!p.high && !p.moderate && !p.low) return ui.el("span", { class: "g-muted" }, "-"); var b = p.high ? ["High", "bad"] : p.moderate ? ["Moderate", "info"] : ["Low", "ok"]; return ui.el("span", { class: "g-badge g-badge--" + b[1], title: p.high + " high, " + p.moderate + " moderate, " + p.low + " low residual instances" }, b[0]); } },
        { key: "risks", label: "Confirmed risks", num: true, sort: true, sortVal: function (r) { return data.regOfRau(r.id).filter(function (g) { return g.status === "confirmed"; }).length; }, render: function (r) { return String(data.regOfRau(r.id).filter(function (g) { return g.status === "confirmed"; }).length); } },
        { key: "lastRcsaDate", label: "Last RCSA", sort: true, render: function (r) { return fmt.date(r.lastRcsaDate); } }
      ],
      rows: rs, page: 25,
      onRow: function (r) { ctx.go("raus/" + r.id); }
    }));
  }

  /* ==SECTION:quality== */
  function quality(el, ctx) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    var raus = data.all("raus");
    var stale = raus.filter(function (r) { return r.profileUpdated < "2025-08-23"; });
    var notStarted = raus.filter(function (r) { return r.riskIdStatus === "not-started"; });
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [ui.el("div", { class: "g-h1" }, "Profile quality"),
      ui.el("div", { class: "g-muted" }, "The inventory audits itself: stale profiles and gaps surface here. This view feeds Capability 9 Monitoring later.")])));
    function listCard(title, rows, extra) {
      return ui.card({
        title: title, body: rows.length ? ui.table({
          cols: [
            { key: "id", label: "ID", render: function (r) { return ui.el("span", { class: "g-mono" }, r.id); } },
            { key: "name", label: "Name" },
            { key: "sub", label: "SubLOB", render: function (r) { return data.orgPath(r.subLobId).sub; } },
            { key: "x", label: extra.label, render: extra.render }
          ], rows: rows.slice(0, 200), page: 10,
          onRow: function (r) { ctx.go("raus/" + r.id); }
        }) : ui.empty("Nothing flagged.")
      });
    }
    el.appendChild(ui.el("div", { class: "g-split" }, [
      listCard("Stale profiles, older than 12 months", stale, { label: "Profile updated", render: function (r) { return fmt.date(r.profileUpdated); } }),
      listCard("Risk identification not started", notStarted, { label: "Owner", render: function (r) { return r.roles.owner; } })]));
  }

  GRC.register({
    id: "rau", version: "1.3.0", tab: "RCSA",
    caps: { "*": { primary: [1] } },
    rail: [
      { label: "1. RAUs", route: "raus", order: 10 },
      { label: "Profile quality", route: "raus-quality", order: 50 }
    ],
    routes: { "raus": directory, "raus-tree": directory, "raus-quality": quality }
  });
})();

<!-- ==GRC-FILE-END== -->

<!-- ==GRC-FILE-BEGIN path=modules/rau-profile.js bytes=25327 sha256=c20b3b625fe48428a670e4614743e2b5b17d91e2ee9a6ccac93b8c33e66af3ea== -->
/* GRC modules/rau-profile.js v1.5.0 2026-08-23 */
/* Capability 1: the RAU profile - demographics, attributes, metadata survey
   with provenance, process map, handoffs, and the risk summary. */
(function () {
  "use strict";

  /* ==SECTION:map-render== */
  /* Shared read-only process map renderer (also used by mapbuilder). */
  window.GRC.renderMap = function (ctx, map, opts) {
    var ui = ctx.ui, data = ctx.data;
    opts = opts || {};
    var wrap = ui.el("div");
    if (!map || !map.phases) { wrap.appendChild(ui.empty("No detailed process map on file for this record in the demo dataset. A summary is shown on the Overview tab.")); return wrap; }
    map.phases.forEach(function (ph, pi) {
      var box = ui.el("div", { class: "map-phase" });
      box.appendChild(ui.el("div", { class: "ph" }, "Phase " + (pi + 1) + " - " + ph.name));
      ph.steps.forEach(function (st) {
        var cls = st.type === "decision" ? "decision" : st.type === "handoff-in" ? "h-in" : st.type === "handoff-out" ? "h-out" : "";
        var extra = null;
        if (st.type === "handoff-in" || st.type === "handoff-out") {
          var cp = data.byId("raus", st.cp);
          extra = ui.el("div", { style: "font-size:12px;margin-top:2px" }, [
            ui.badge(st.type === "handoff-in" ? "Receives from" : "Provides to", "info"), " ",
            ui.el("a", { href: "#/raus/" + st.cp }, cp ? cp.id + " " + cp.name : st.cp),
            st.art ? ui.el("span", { class: "g-muted" }, ", carries: " + st.art) : null]);
        } else if (st.type === "decision") {
          extra = ui.el("div", { style: "font-size:11.5px;margin-top:1px" }, ui.badge("Decision", "warn"));
        }
        box.appendChild(ui.el("div", { class: "map-step " + cls }, [
          ui.el("div", { class: "n" }, String(st.n)),
          ui.el("div", {}, [ui.el("div", {}, st.text), extra])]));
      });
      wrap.appendChild(box);
    });
    return wrap;
  };

  /* ==SECTION:map-diagram== */
  /* Visio-style cross-functional flowchart: phases as horizontal lanes,
     tasks as rectangles, decisions as diamonds, handoffs as tabbed shapes
     linking their counterparty RAU. Pure SVG, scrolls in its own frame. */
  window.GRC.mapDiagram = function (ctx, map) {
    var NS = "http://www.w3.org/2000/svg";
    function sv(tag, attrs, parent) {
      var n = document.createElementNS(NS, tag);
      Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
      if (parent) parent.appendChild(n);
      return n;
    }
    function wrap(txt, width) {
      var words = String(txt).split(" "), lines = [], cur = "";
      var maxc = Math.floor(width / 5.6);
      words.forEach(function (w) {
        if ((cur + " " + w).trim().length > maxc) { if (cur) lines.push(cur); cur = w; }
        else cur = (cur + " " + w).trim();
      });
      if (cur) lines.push(cur);
      if (lines.length > 3) { lines = lines.slice(0, 3); lines[2] = lines[2].slice(0, maxc - 3) + "..."; }
      return lines;
    }
    var holder = document.createElement("div");
    holder.className = "flowwrap";
    if (!map || !map.phases || !map.phases.length) {
      holder.innerHTML = "<div class='g-empty'>No detailed process map on file for this record in the demo dataset.</div>";
      return holder;
    }
    var W = 152, H = 58, GX = 44, LANEH = 138, LABW = 148, PAD = 14;
    var maxSlots = 0;
    map.phases.forEach(function (p, i) {
      var slots = p.steps.length + (i === 0 ? 1 : 0) + (i === map.phases.length - 1 ? 1 : 0);
      if (slots > maxSlots) maxSlots = slots;
    });
    var width = LABW + PAD + maxSlots * (W + GX) + 30;
    var height = map.phases.length * LANEH + 20;
    var svg = sv("svg", { width: width, height: height, viewBox: "0 0 " + width + " " + height, role: "img" });
    var defs = sv("defs", {}, svg);
    var mk = sv("marker", { id: "arr", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" }, defs);
    sv("path", { d: "M0 0 L10 5 L0 10 z", fill: "#5f6773" }, mk);
    function arrowLine(pts, label) {
      var d = "M" + pts.map(function (p) { return p[0] + " " + p[1]; }).join(" L");
      sv("path", { d: d, fill: "none", stroke: "#5f6773", "stroke-width": "1.4", "marker-end": "url(#arr)" }, svg);
      if (label) {
        var t = sv("text", { x: pts[0][0] + 6, y: pts[0][1] - 5, "font-size": "9.5", fill: "#5f6773", "font-weight": "600" }, svg);
        t.textContent = label;
      }
    }
    function shapeText(cx, cy, lines, size, color, weight) {
      var t = sv("text", { x: cx, y: cy - (lines.length - 1) * 6, "text-anchor": "middle", "font-size": size || "10.5", fill: color || "#1f2430", "font-weight": weight || "400" }, svg);
      lines.forEach(function (ln, i) {
        var ts = sv("tspan", { x: cx, dy: i === 0 ? 0 : 12 }, t);
        ts.textContent = ln;
      });
      return t;
    }
    /* lanes */
    map.phases.forEach(function (p, li) {
      var y = li * LANEH + 10;
      sv("rect", { x: 4, y: y, width: width - 10, height: LANEH - 8, fill: li % 2 ? "#fbfcfd" : "#ffffff", stroke: "#e4e8ec" }, svg);
      sv("rect", { x: 4, y: y, width: LABW, height: LANEH - 8, fill: "#f2f4f6", stroke: "#e4e8ec" }, svg);
      shapeText(4 + LABW / 2, y + LANEH / 2 - 4, wrap("Phase " + (li + 1) + ": " + p.name, LABW - 16), "10.5", "#4c5560", "600");
    });
    /* shapes */
    var prev = null; /* {x,y} exit point of previous shape */
    map.phases.forEach(function (p, li) {
      var laneY = li * LANEH + 10 + (LANEH - 8) / 2;
      var slot = 0;
      var startX = LABW + PAD + 12;
      function slotX(s) { return startX + s * (W + GX); }
      if (li === 0) {
        var sx = slotX(slot++), sy = laneY;
        sv("rect", { x: sx, y: sy - 16, width: 84, height: 32, rx: 16, fill: "#eef0f3", stroke: "#8b93a0" }, svg);
        shapeText(sx + 42, sy + 4, ["Start"], "11", "#3d4451", "700");
        prev = { x: sx + 84, y: sy };
      }
      p.steps.forEach(function (st) {
        var x = slotX(slot++), cy = laneY;
        var g = sv("g", { style: "cursor:" + ((st.type === "handoff-in" || st.type === "handoff-out") && st.cp ? "pointer" : "default") }, svg);
        sv("title", {}, g).textContent = st.n + ". " + st.text + (st.cp ? " (" + (st.type === "handoff-in" ? "from " : "to ") + st.cp + (st.art ? ", " + st.art : "") + ")" : "");
        if (st.type === "decision") {
          var dcx = x + W / 2, dcy = cy;
          sv("polygon", { points: (dcx) + "," + (dcy - 34) + " " + (x + W + 6) + "," + dcy + " " + dcx + "," + (dcy + 34) + " " + (x - 6) + "," + dcy, fill: "#fbf0df", stroke: "#d97706", "stroke-width": "1.4" }, g);
          shapeText(dcx, dcy + 3, wrap(st.text, W - 34), "10", "#6b4a08", "600");
          sv("circle", { cx: dcx, cy: dcy + 52, r: 3, fill: "none", stroke: "#b9bfc7" }, g);
          arrowLine([[dcx, dcy + 34], [dcx, dcy + 47]], "No");
          shapeText(dcx + 58, dcy + 55, ["exception path"], "8.5", "#8b93a0");
          if (prev) arrowLine([[prev.x, prev.y], [x - 8, cy]]);
          prev = { x: x + W + 6, y: cy, yesFrom: true };
        } else if (st.type === "handoff-in" || st.type === "handoff-out") {
          var out = st.type === "handoff-out";
          sv("rect", { x: x, y: cy - H / 2, width: W, height: H, rx: 5, fill: "#e8eff7", stroke: "#2e6ea6", "stroke-width": "1.4" }, g);
          var tabX = out ? x + W : x - 12;
          sv("polygon", { points: tabX + "," + (cy - 10) + " " + (tabX + 12) + "," + cy + " " + tabX + "," + (cy + 10), fill: "#2e6ea6" }, g);
          shapeText(x + W / 2, cy - 2, wrap(st.text, W - 18), "10", "#1c4569");
          var cpr = st.cp ? ctx.data.byId("raus", st.cp) : null;
          shapeText(x + W / 2, cy + H / 2 + 12, [(out ? "to " : "from ") + (st.cp || "another RAU")], "9", "#2e6ea6", "700");
          if (st.cp) g.addEventListener("click", function () { ctx.go("raus/" + st.cp); });
          if (cpr) sv("title", {}, g).textContent += " " + cpr.name;
          if (prev) arrowLine([[prev.x, prev.y], [x - (out ? 8 : 20), cy]], prev.yesFrom ? "Yes" : null);
          prev = { x: x + W + (out ? 14 : 2), y: cy };
        } else {
          sv("rect", { x: x, y: cy - H / 2, width: W, height: H, rx: 6, fill: "#ffffff", stroke: "#8b93a0", "stroke-width": "1.3" }, g);
          shapeText(x + W / 2, cy + 2, wrap(st.text, W - 16));
          sv("text", { x: x + 7, y: cy - H / 2 + 12, "font-size": "8.5", fill: "#9aa2ae", "font-weight": "700" }, g).textContent = String(st.n);
          if (prev) arrowLine([[prev.x, prev.y], [x - 8, cy]], prev.yesFrom ? "Yes" : null);
          prev = { x: x + W, y: cy };
        }
      });
      /* connector down to next lane */
      if (li < map.phases.length - 1 && prev) {
        var nextY = (li + 1) * LANEH + 10 + (LANEH - 8) / 2;
        arrowLine([[prev.x, prev.y], [prev.x + 18, prev.y], [prev.x + 18, prev.y + (LANEH / 2) - 10], [LABW + PAD + 2, prev.y + (LANEH / 2) - 10], [LABW + PAD + 2, nextY], [LABW + PAD + 10, nextY]]);
        prev = { x: LABW + PAD + 10, y: nextY };
      }
      if (li === map.phases.length - 1) {
        var ex = slotX(slot), ey = laneY;
        sv("rect", { x: ex, y: ey - 16, width: 84, height: 32, rx: 16, fill: "#e8f4ec", stroke: "#15803d" }, svg);
        shapeText(ex + 42, ey + 4, ["End"], "11", "#15803d", "700");
        if (prev) arrowLine([[prev.x, prev.y], [ex - 8, ey]]);
      }
    });
    holder.appendChild(svg);
    return holder;
  };

  /* ==SECTION:profile== */
  function profile(el, ctx, params) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    var r = data.byId("raus", params.id);
    if (!r) { el.appendChild(ui.empty("Unknown RAU: " + params.id)); return; }
    var p = data.orgPath(r.subLobId);
    var confirmed = data.regOfRau(r.id).filter(function (g) { return g.status === "confirmed"; });

    el.appendChild(ui.el("div", { class: "g-page-head" }, [
      ui.el("div", {}, [
        ui.el("div", { class: "g-muted", style: "font-size:12px;margin-bottom:2px" }, [
          ui.el("a", { href: "#/raus" }, "RAUs"), " / " + r.id]),
        ui.el("div", { class: "g-row" }, [
          ui.el("span", { class: "g-h1" }, r.name),
          ui.el("span", { class: "g-mono g-muted" }, r.id),
          ui.badge(fmt.cat(r.category), "info"),
          ui.badge(r.stage === "active" ? "Active" : fmt.stage(r.stage), fmt.stageKind(r.stage))]),
        ui.el("div", { class: "g-muted" }, "Enterprise > " + p.lob + " > " + p.sub)]),
      ui.el("div", { class: "sp" }),
      ui.el("button", { class: "g-btn", onclick: function () { ctx.go("riskid/" + r.id); } }, "Open applicability workbench")]));

    el.appendChild(ui.tabs({
      items: [
        { id: "ov", label: "Overview", render: function (bd) { renderOverview(bd, ctx, r); } },
        { id: "meta", label: "Metadata survey", render: function (bd) { renderSurvey(bd, ctx, r); } },
        { id: "map", label: "Process map", render: function (bd) {
          bd.appendChild(window.GRC.mapDiagram(ctx, r.map));
          if (r.map) {
            var open = false;
            var listWrap = ui.el("div", { style: "display:none;margin-top:12px" });
            listWrap.appendChild(window.GRC.renderMap(ctx, r.map));
            bd.appendChild(ui.el("div", { style: "margin-top:10px" },
              ui.el("button", { class: "g-btn sm", onclick: function (e) { open = !open; listWrap.style.display = open ? "block" : "none"; e.target.textContent = open ? "Hide step list" : "Show step list"; } }, "Show step list")));
            bd.appendChild(listWrap);
          }
        } },
        { id: "hand", label: "Handoffs (" + (r.handoffs || []).length + ")", render: function (bd) { renderHandoffs(bd, ctx, r); } },
        { id: "risks", label: "Risks (" + confirmed.length + ")", render: function (bd) { renderRisks(bd, ctx, r); } },
        { id: "ctls", label: "Controls", render: function (bd) { renderControls(bd, ctx, r); } }
      ]
    }));
  }

  /* ==SECTION:controls-tab== */
  function renderControls(bd, ctx, r) {
    var ui = ctx.ui, data = ctx.data, eng = ctx.engine.ctl;
    var confirmed = data.regOfRau(r.id).filter(function (g) { return g.status === "confirmed"; });
    var owned = data.controlsOwnedBy(r.id);
    bd.appendChild(ui.el("p", { class: "g-muted", style: "font-size:12.5px" },
      owned.length + " controls are owned by this RAU (" + owned.filter(function (c) { return c.shared; }).length +
      " offered as shared). Each confirmed risk instance shows its mitigation below; Manage opens the recommendation flow."));
    if (!confirmed.length) { bd.appendChild(ui.empty("No confirmed risk instances yet.")); return; }
    bd.appendChild(ui.table({
      cols: [
        { key: "ev", label: "Risk instance", render: function (g) { var e = data.byId("riskEvents", g.eventId); return e ? e.name : g.eventId; } },
        { key: "band", label: "Inherent", render: function (g) {
          var t = data.ratingOf(r.id, g.eventId);
          if (!t) return ui.el("span", { class: "g-muted" }, "unrated");
          var b = ctx.engine.inherent.band(ctx.engine.inherent.fromArray(t.f)).band;
          return ui.badge(b.charAt(0).toUpperCase() + b.slice(1), b === "low" ? "ok" : b === "moderate" ? "info" : b === "high" ? "warn" : "bad");
        } },
        { key: "ctls", label: "Controls", render: function (g) {
          var cs = data.controlsOfInstance(r.id, g.eventId);
          if (!cs.length) return ui.badge("None", "bad");
          return ui.el("span", {}, cs.map(function (c) {
            var dk = eng.derivedKey(c);
            return ui.el("a", { href: "#/controls/" + c.id, class: "g-pill", style: "text-decoration:none" + (dk.key ? ";font-weight:700" : ""), title: c.type + ", " + c.automation + (dk.key ? "; derived KEY: " + dk.rules.map(function (x) { return x.id; }).join(",") : ""), onclick: function (e) { e.stopPropagation(); } }, c.name);
          }));
        } },
        { key: "go", label: "", render: function () { return ui.el("button", { class: "g-btn sm" }, "Manage"); } }
      ], rows: confirmed, page: 12,
      onRow: function (g) { ctx.go("attach/" + r.id + "/" + g.eventId); }
    }));
  }

  /* ==SECTION:overview== */
  function renderOverview(bd, ctx, r) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    var left = ui.el("div");
    left.appendChild(ui.card({
      title: "Demographics", body: ui.kv([
        ["Description", r.description],
        ["RAU Owner", r.roles.owner], ["Owner Delegate", r.roles.delegate],
        ["BCM Contact", r.roles.bcmContact],
        ["ORBO (Operational Risk)", r.roles.orbo], ["BACO (Compliance Risk)", r.roles.baco],
        ["FTE", fmt.num(r.fte)], ["Locations", String(r.locations)],
        ["Annual volume", fmt.num(r.annualVolume)],
        ["Prior losses, 12 months", r.priorLosses12m ? fmt.money(r.priorLosses12m) : "None"],
        ["Change level", r.changeLevel],
        ["Risk identification", r.riskIdStatus.replace("-", " ")],
        ["Last RCSA", fmt.date(r.lastRcsaDate)], ["Profile updated", fmt.date(r.profileUpdated)]])
    }));
    left.appendChild(ui.card({
      title: "Services performed (from the enterprise catalog)",
      body: ui.el("div", {}, (r.serviceIds || []).map(function (id) {
        return ui.el("span", { class: "g-pill", title: data.svcPath(id) }, data.svcName(id));
      }))
    }));
    var right = ui.el("div");
    var roll = ctx.engine.inherent.rollup(r);
    function bk(b) { return b === "low" ? "ok" : b === "moderate" ? "info" : b === "high" ? "warn" : "bad"; }
    function bl(b) { return b.charAt(0).toUpperCase() + b.slice(1); }
    right.appendChild(ui.card({
      title: "Inherent risk (Capability 3)",
      body: ui.el("div", {}, [
        roll.band ? ui.el("div", { class: "g-row" }, [
          ui.badge(bl(roll.band), bk(roll.band)),
          ui.el("span", { class: "g-muted", style: "font-size:12.5px" }, "highest instance band, driven by " + roll.drivers.join("; "))]) :
          ui.el("p", { class: "g-muted", style: "font-size:12.5px;margin:0" }, "No instances rated yet."),
        ui.el("div", { class: "g-row", style: "margin-top:6px" },
          ["critical", "high", "moderate", "low"].map(function (b) {
            return roll.counts[b] ? ui.el("span", { class: "g-badge g-badge--" + bk(b), title: bl(b) }, roll.counts[b] + bl(b).slice(0, 1)) : null;
          })),
        ui.el("p", { class: "g-muted", style: "font-size:12px;margin:8px 0 0" }, roll.rated + " of " + roll.confirmed + " confirmed instances rated on the evidence-anchored rubric."),
        ui.el("button", { class: "g-btn sm", style: "margin-top:6px", onclick: function () { ctx.go("inherent/" + r.id); } }, "Open rating worksheet")])
    }));
    var prof5 = ctx.engine.rcsa.profile(r);
    var st5 = ctx.engine.rcsa.affState(r);
    var stMap5 = { "current": ["Current", "ok"], "pending-changes": ["Changes pending", "info"], "due": ["Due", "warn"], "overdue": ["Overdue", "bad"], "never": ["Never affirmed", "bad"] };
    right.appendChild(ui.card({
      title: "Residual risk and affirmation (Capability 5)",
      body: ui.el("div", {}, [
        ui.el("div", { class: "g-row" }, [
          prof5.high ? ui.el("span", { class: "g-badge g-badge--bad" }, prof5.high + "H") : null,
          prof5.moderate ? ui.el("span", { class: "g-badge g-badge--info" }, prof5.moderate + "M") : null,
          prof5.low ? ui.el("span", { class: "g-badge g-badge--ok" }, prof5.low + "L") : null,
          prof5.unrated ? ui.el("span", { class: "g-badge", title: "Unrated instances: residual cannot compute" }, prof5.unrated + "U") : null,
          ui.el("span", { class: "g-badge g-badge--" + stMap5[st5.state][1] }, stMap5[st5.state][0])]),
        ui.el("p", { class: "g-muted", style: "font-size:12px;margin:8px 0 0" },
          (st5.aff && st5.aff.date ? "Last affirmed " + fmt.date(st5.aff.date) + " by " + st5.aff.by + ". " : "Never affirmed. ") +
          (st5.pending ? st5.pending + " unadopted change" + (st5.pending === 1 ? "" : "s") + ". " : "") +
          (st5.openChal ? st5.openChal + " open challenge" + (st5.openChal === 1 ? "" : "s") + "." : "")),
        ui.el("button", { class: "g-btn sm", style: "margin-top:6px", onclick: function () { ctx.go("rcsa/" + r.id); } }, "Open assessment workspace")])
    }));
    var tagWrap = ui.el("div");
    (r.meta.tags || []).forEach(function (t) { tagWrap.appendChild(ui.pill(t)); });
    var exWrap = ui.el("div");
    (r.meta.excl || []).forEach(function (t) { exWrap.appendChild(ui.pill("does NOT: " + t, true)); });
    right.appendChild(ui.card({
      title: "Attributes (drive applicability, signals, and scoping)",
      body: ui.el("div", {}, [
        ui.el("div", { class: "g-label", style: "margin-bottom:4px" }, "Inclusion evidence: what this RAU does"),
        tagWrap,
        ui.el("div", { class: "g-label", style: "margin:10px 0 4px" }, "Exclusion evidence: confirmed does-not-do"),
        exWrap,
        ui.el("p", { class: "g-muted", style: "font-size:12px;margin:10px 0 0" },
          "Inclusions come from the process map, services, and survey answers; exclusions come from the metadata survey. Together they drive the stack-ranked applicability of the 90 risk events and 8,000 MCRs to this RAU.")])
    }));
    if (!r.map && r.mapSummary) {
      right.appendChild(ui.card({
        title: "Process map summary", body: ui.kv([
          ["Phases", String(r.mapSummary.phases)], ["Steps", String(r.mapSummary.steps)],
          ["Handoffs identified", String(r.mapSummary.handoffs)],
          ["Detail", "Full step detail not included in the demo dataset for this RAU. See the featured RAUs or the pipeline for full maps."]])
      }));
    }
    bd.appendChild(ui.el("div", { class: "g-split" }, [left, right]));
  }

  /* ==SECTION:survey== */
  function renderSurvey(bd, ctx, r) {
    var ui = ctx.ui, data = ctx.data;
    var qs = data.all("metaQuestions");
    var answers = r.metaAnswers;
    if (!answers) {
      /* derive display answers from tags/exclusions for non-featured RAUs */
      answers = qs.map(function (q) {
        var yes = q.tag ? (r.meta.tags || []).indexOf(q.tag) >= 0 : (r.meta.excl || []).indexOf(q.excl) >= 0;
        return { q: q.id, v: yes ? "yes" : "no", src: "derived" };
      });
    }
    var byId = {}; answers.forEach(function (a) { byId[a.q] = a; });
    var derived = 0, user = 0;
    answers.forEach(function (a) { if (a.src === "user") user++; else derived++; });
    bd.appendChild(ui.el("p", { class: "g-muted" },
      "The standardized survey is filled by the assistant from the process map, services, and intake details; " +
      "questions it cannot conclude are asked directly. Most questions confirm what the RAU does NOT do; " +
      "absence never shows on a process map. Provenance: " + derived + " derived, " + user + " answered by the owner team."));
    var bySection = {};
    qs.forEach(function (q) { (bySection[q.section] = bySection[q.section] || []).push(q); });
    Object.keys(bySection).forEach(function (sec) {
      var card = ui.card({ title: sec, body: ui.el("div") });
      var body = card.lastChild;
      bySection[sec].forEach(function (q) {
        var a = byId[q.id];
        var srcLabel = !a ? "" : a.src === "user" ? "answered by owner team" : a.src === "services" ? "derived from services" : a.src === "derived" ? "derived from attributes" : a.src.indexOf("map:") === 0 ? "derived from map step " + a.src.slice(4) : a.src;
        body.appendChild(ui.el("div", { class: "g-row", style: "padding:5px 0;border-bottom:1px solid var(--g-line-soft)" }, [
          ui.el("span", { class: "g-mono g-muted", style: "width:34px;flex:none" }, q.id),
          ui.el("span", { style: "flex:1;min-width:240px" }, q.text),
          a ? ui.el("span", { class: a.v === "yes" ? "ans-yes" : "ans-no" }, a.v.toUpperCase()) : ui.badge("Open", "warn"),
          a ? ui.el("span", { class: "provsrc" }, srcLabel) : null]));
      });
      bd.appendChild(card);
    });
  }

  /* ==SECTION:handoffs== */
  function renderHandoffs(bd, ctx, r) {
    var ui = ctx.ui, data = ctx.data;
    var outs = (r.handoffs || []).filter(function (h) { return h.dir === "out"; });
    var ins = (r.handoffs || []).filter(function (h) { return h.dir === "in"; });
    function tbl(rows, dirLabel) {
      if (!rows.length) return ui.empty("None recorded.");
      return ui.table({
        cols: [
          { key: "cp", label: dirLabel, render: function (h) { var cp = data.byId("raus", h.cp); return ui.el("a", { href: "#/raus/" + h.cp }, cp ? cp.id + " - " + cp.name : h.cp); } },
          { key: "art", label: "What moves" },
          { key: "conf", label: "Status", render: function (h) { return h.conf ? ui.badge("Confirmed", "ok") : ui.badge("Pending counterparty confirmation", "warn"); } }
        ], rows: rows, page: 12
      });
    }
    bd.appendChild(ui.el("p", { class: "g-muted" }, "Handoffs are declared on the process map and trusted at submission; the counterparty confirms afterward through My Work. They form the inter-RAU dependency network; a change in this RAU signals its counterparties (Capability 6)."));
    bd.appendChild(ui.el("div", { class: "g-split" }, [
      ui.card({ title: "Provides to (" + outs.length + ")", body: tbl(outs, "Counterparty RAU") }),
      ui.card({ title: "Receives from (" + ins.length + ")", body: tbl(ins, "Counterparty RAU") })]));
  }

  /* ==SECTION:risks== */
  function renderRisks(bd, ctx, r) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    var reg = data.regOfRau(r.id);
    var confirmed = reg.filter(function (g) { return g.status === "confirmed"; });
    var rejected = reg.filter(function (g) { return g.status === "rejected"; });
    bd.appendChild(ui.el("div", { class: "g-row", style: "margin-bottom:10px" }, [
      ui.badge(confirmed.length + " confirmed", "ok"), ui.badge(rejected.length + " rejected", ""),
      ui.el("span", { class: "sp", style: "flex:1" }),
      ui.el("button", { class: "g-btn g-btn--primary", onclick: function () { ctx.go("riskid/" + r.id); } }, "Open applicability workbench")]));
    if (!confirmed.length) { bd.appendChild(ui.empty("No confirmed risks yet. The owner team takes the first pass in the applicability workbench.")); return; }
    bd.appendChild(ui.table({
      cols: [
        { key: "eventId", label: "Risk event", render: function (g) { var ev = data.byId("riskEvents", g.eventId); return ui.el("a", { href: "#/events/" + g.eventId }, ev ? ev.name : g.eventId); } },
        { key: "side", label: "Type", render: function (g) { var ev = data.byId("riskEvents", g.eventId); return ev && ev.side === "compliance" ? ui.badge("Compliance", "info") : ui.badge("Operational", ""); } },
        { key: "score", label: "Applicability", num: true, sort: true, render: function (g) { return g.score + ""; } },
        { key: "mcr", label: "MCRs attached", num: true, render: function (g) { return g.mcrIds ? String(g.mcrIds.length) : "-"; } },
        { key: "by", label: "Confirmed by" },
        { key: "date", label: "Date", sort: true, render: function (g) { return fmt.date(g.date); } }
      ], rows: confirmed, page: 15
    }));
  }

  GRC.register({
    id: "rau-profile", version: "1.5.0", tab: "RCSA",
    caps: { "raus/:id": { primary: [1], uses: [2, 3, 4, 5] } },
    routes: { "raus/:id": profile }
  });
})();

<!-- ==GRC-FILE-END== -->

<!-- ==GRC-FILE-BEGIN path=modules/intake.js bytes=24615 sha256=7654c1811940e4e4032d8685fb9dc9c2b117b26f1e8712f358b5950a9178fde3== -->
/* GRC modules/intake.js v1.2.0 2026-08-23 */
/* Capability 1 front end: the RAU change-request pipeline (new / merge /
   split / retire), the intake wizard with assistant, the uniqueness +
   category review gate, and governance approval. The wizard autosaves a
   draft locally so navigating away never loses the form (FB-015). */
(function () {
  "use strict";
  var GOV = "RCSA RAU Governance";
  var DRAFTKEY = "grc-draft-intake";

  /* ==SECTION:draft== */
  function loadDraft() {
    try {
      var d = JSON.parse(localStorage.getItem(DRAFTKEY) || "null");
      if (d && typeof d === "object" && Array.isArray(d.serviceIds)) return d;
    } catch (e) { /* storage unavailable or corrupt: start clean */ }
    return null;
  }
  function saveDraft(model) {
    try { localStorage.setItem(DRAFTKEY, JSON.stringify(model)); } catch (e) { }
  }
  function clearDraft() {
    try { localStorage.removeItem(DRAFTKEY); } catch (e) { }
  }

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
    var draft = loadDraft(), restored = false;
    if (draft) {
      Object.keys(model).forEach(function (k) { if (draft[k] !== undefined) model[k] = draft[k]; });
      restored = !!(model.proposedName || model.description || model.bulletsText || model.serviceIds.length || model.subLobId);
    }
    function save() { saveDraft(model); }
    var msgs = [{ who: "assistant", text: "I will help you describe this RAU. Pick the business placement and the services it performs from the common catalog, then list the high-level steps of the process - one per line. I will ask questions if I need more to analyze uniqueness." }];
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [ui.el("div", { class: "g-h1" }, "New RAU request: intake"),
      ui.el("div", { class: "g-muted" }, "Step 1 of the pipeline. Drafts save on this machine as you type, so you can leave and come back. On submit, the assistant analyzes uniqueness within the Line of Business and checks the category; the RCSA RAU Governance team reviews its findings.")])));
    if (restored) {
      el.appendChild(ui.el("div", { class: "g-card", style: "border-left:4px solid var(--g-accent);padding:10px 14px" },
        ui.el("div", { class: "g-row" }, [
          ui.badge("Draft restored", "info"),
          ui.el("span", { style: "flex:1" }, "An unsubmitted intake was saved earlier on this machine and has been restored. Nothing is analyzed until you submit."),
          ui.el("button", { class: "g-btn sm", onclick: function () {
            clearDraft();
            el.innerHTML = "";
            wizard(el, ctx);
            ui.toast("Draft discarded.");
          } }, "Discard draft")])));
    }
    var form = ui.el("div");
    var chatWrap = ui.el("div");
    el.appendChild(ui.el("div", { class: "g-split", style: "grid-template-columns:3fr 2fr" }, [form, chatWrap]));

    function svcPicker() {
      var outer = ui.el("div");
      var count = ui.el("span", { class: "g-pill" }, model.serviceIds.length + " selected");
      var filter = "";
      var box = ui.el("div", { style: "max-height:240px;overflow:auto;border:1px solid var(--g-line);border-radius:6px;padding:6px 10px;background:#fff" });
      function drawList() {
        box.innerHTML = "";
        var byFam = {};
        data.all("services").filter(function (s) { return s.level === 3; }).forEach(function (s) {
          if (filter && s.name.toLowerCase().indexOf(filter) < 0 && data.svcPath(s.id).toLowerCase().indexOf(filter) < 0) return;
          var fam = data.svcPath(s.id).split(" > ")[0];
          (byFam[fam] = byFam[fam] || []).push(s);
        });
        var fams = Object.keys(byFam).sort();
        if (!fams.length) { box.appendChild(ui.el("div", { class: "g-muted", style: "padding:8px;font-size:12.5px" }, "No services match that filter.")); return; }
        fams.forEach(function (fam) {
          box.appendChild(ui.el("div", { class: "g-label", style: "margin:6px 0 2px" }, fam));
          byFam[fam].forEach(function (s) {
            var cb = ui.el("input", { type: "checkbox", onchange: function () {
              var i = model.serviceIds.indexOf(s.id);
              if (cb.checked && i < 0) model.serviceIds.push(s.id);
              if (!cb.checked && i >= 0) model.serviceIds.splice(i, 1);
              count.textContent = model.serviceIds.length + " selected";
              save();
            } });
            if (model.serviceIds.indexOf(s.id) >= 0) cb.checked = true;
            box.appendChild(ui.el("label", { style: "display:flex;gap:8px;align-items:center;padding:2px 0 2px 8px;font-size:13px", title: data.svcPath(s.id) }, [cb, s.name]));
          });
        });
      }
      drawList();
      outer.appendChild(ui.el("div", { class: "g-row", style: "margin-bottom:6px" }, [
        ui.searchBox({ placeholder: "Filter the catalog...", oninput: function (v) { filter = v.toLowerCase(); drawList(); } }),
        count]));
      outer.appendChild(box);
      return outer;
    }
    function field(label, node) { return ui.el("div", { style: "margin-bottom:12px" }, [ui.el("div", { class: "g-label", style: "margin-bottom:4px" }, label), node]); }
    var lobSel = ui.select({ value: model.lobId, options: [{ value: "", label: "Select..." }].concat(data.lobs().map(function (l) { return { value: l.id, label: l.name }; })), onchange: function (v) { model.lobId = v; model.subLobId = ""; save(); drawSub(); } });
    var subWrap = ui.el("span");
    function drawSub() {
      subWrap.innerHTML = "";
      subWrap.appendChild(ui.select({
        value: model.subLobId,
        options: [{ value: "", label: "Select..." }].concat(data.subLobs().filter(function (s) { return s.parentId === model.lobId; }).map(function (s) { return { value: s.id, label: s.name }; })),
        onchange: function (v) { model.subLobId = v; save(); }
      }));
    }
    drawSub();
    form.appendChild(ui.card({
      title: "Intake form", body: ui.el("div", {}, [
        field("Line of Business", lobSel), field("SubLOB (the RAU is created at this level)", subWrap),
        field("RAU category", ui.select({
          value: model.category, onchange: function (v) { model.category = v; save(); },
          options: [{ value: "business-service", label: "Business Service RAU" }, { value: "shared-services", label: "Shared Services RAU" }, { value: "enterprise", label: "Enterprise RAU" }]
        })),
        field("Proposed RAU name", ui.el("input", { class: "g-input", style: "width:100%", value: model.proposedName, oninput: function (e) { model.proposedName = e.target.value; save(); } })),
        field("Description", ui.el("textarea", { class: "g-input", rows: "3", style: "width:100%", oninput: function (e) { model.description = e.target.value; save(); } }, model.description)),
        field("High-level process steps (one bullet per line, 3+)", ui.el("textarea", { class: "g-input", rows: "5", style: "width:100%", placeholder: "Receive and validate requests\nApprove and release funding\nReconcile and report", oninput: function (e) { model.bulletsText = e.target.value; save(); } }, model.bulletsText)),
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
      clearDraft();
      GRC.traceAction(1, "Submitting a RAU request");
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
    id: "intake", version: "1.2.0", tab: "RCSA",
    caps: { "*": { primary: [1] } },
    rail: [{ label: "RAU pipeline", route: "pipeline", order: 30 }],
    routes: { "pipeline": board, "pipeline/new": wizard, "pipeline/:id": detail }
  });
})();

<!-- ==GRC-FILE-END== -->

<!-- ==GRC-FILE-BEGIN path=modules/mapbuilder.js bytes=15076 sha256=3fe930eead960728cc2f65caa99dc6bec4651b6ffc818ed35e50b8ea08680286== -->
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

<!-- ==GRC-FILE-END== -->

<!-- ==GRC-FILE-BEGIN path=modules/riskid.js bytes=19995 sha256=1125290384bd98da3808231d941b29c19e25812e391041d710af30f9302aaab1== -->
/* GRC modules/riskid.js v1.4.1 2026-08-23 */
/* Capability 2: Operational & Compliance Risk Identification - the
   applicability workbench. The engine stack-ranks all 90 risk events (and
   the MCRs beneath compliance events) against the RAU's metadata; the
   front line confirms or rejects; ambiguous items get resolved out of the
   middle by targeted questions. Any disposition can be reopened (FB-016). */
(function () {
  "use strict";

  /* ==SECTION:landing== */
  var LF = { q: "", status: "" };
  function landing(el, ctx) {
    var ui = ctx.ui, data = ctx.data;
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "Risk identification"),
        ui.el("div", { class: "g-muted" }, "The front line takes the first pass. The engine stack-ranks the applicability of the risk event and MCR libraries to each RAU; the owner team picks. Same rubric, same math, for every RAU.")])));
    var body = ui.el("div"); el.appendChild(body);
    function draw() {
      body.innerHTML = "";
      var rows = data.all("raus").filter(function (r) {
        if (LF.q && (r.id + " " + r.name).toLowerCase().indexOf(LF.q.toLowerCase()) < 0) return false;
        if (LF.status && r.riskIdStatus !== LF.status) return false;
        return true;
      });
      body.appendChild(ui.toolbar([
        ui.searchBox({ value: LF.q, placeholder: "Find a RAU...", oninput: function (v) { LF.q = v; draw(); } }),
        ui.select({
          label: "Status", value: LF.status, onchange: function (v) { LF.status = v; draw(); },
          options: [{ value: "", label: "All" }, { value: "not-started", label: "Not started" }, { value: "in-progress", label: "In progress" }, { value: "complete", label: "Complete" }]
        })]));
      body.appendChild(ui.table({
        cols: [
          { key: "id", label: "RAU", render: function (r) { return ui.el("span", { class: "g-mono" }, r.id); } },
          { key: "name", label: "Name", sort: true },
          { key: "sub", label: "SubLOB", render: function (r) { return data.orgPath(r.subLobId).sub; } },
          { key: "riskIdStatus", label: "Risk ID", sort: true, render: function (r) { return ui.badge(r.riskIdStatus.replace("-", " "), ctx.fmt.riskIdKind(r.riskIdStatus)); } },
          { key: "n", label: "Confirmed", num: true, render: function (r) { return String(data.regOfRau(r.id).filter(function (g) { return g.status === "confirmed"; }).length); } },
          { key: "go", label: "", render: function (r) { return ui.el("button", { class: "g-btn sm" }, "Open workbench"); } }
        ], rows: rows, page: 15,
        onRow: function (r) { ctx.go("riskid/" + r.id); }
      }));
    }
    draw();
  }

  /* ==SECTION:workbench== */
  function workbench(el, ctx, params) {
    var ui = ctx.ui, data = ctx.data, eng = ctx.engine, fmt = ctx.fmt;
    var r = data.byId("raus", params.rauId);
    if (!r) { el.appendChild(ui.empty("Unknown RAU " + params.rauId)); return; }
    var wrap = ui.el("div"); el.appendChild(wrap);
    var showAllMiddle = false;

    function dispositionOf(evId) {
      var rows = data.regOfRau(r.id);
      for (var i = 0; i < rows.length; i++) { if (rows[i].eventId === evId) return rows[i]; }
      return null;
    }
    function draw() {
      wrap.innerHTML = "";
      var cand = eng.candidates(r);
      var open = [], done = [];
      cand.scored.forEach(function (s) {
        var d = dispositionOf(s.ev.id);
        if (d) { done.push({ s: s, d: d }); } else { open.push(s); }
      });
      var z = eng.zones(open);
      var totalCand = cand.scored.length;
      var prog = 100 * done.length / Math.max(1, totalCand);
      /* A completed RAU stores confirmations and notable rejections only;
         everything else was dismissed at completion. Show it that way. */
      var implicitDismissed = 0;
      if (r.riskIdStatus === "complete" && open.length) {
        implicitDismissed = open.length;
        z = { likely: [], middle: [], unlikely: [] };
        prog = 100;
      }

      wrap.appendChild(ui.el("div", { class: "g-page-head" }, [
        ui.el("div", {}, [
          ui.el("div", { class: "g-muted", style: "font-size:12px;margin-bottom:2px" }, [
            ui.el("a", { href: "#/riskid" }, "Risk identification"), " / " + r.id]),
          ui.el("div", { class: "g-row" }, [
            ui.el("span", { class: "g-h1" }, "Applicability workbench"),
            ui.el("a", { href: "#/raus/" + r.id, class: "g-mono" }, r.id), ui.el("span", {}, r.name)]),
          ui.el("div", { class: "g-muted" }, done.length + " of " + totalCand + " candidates dispositioned; " +
            cand.suppressed.length + " suppressed by exclusions. Rubric v" + (eng.rubric().version || "1.0") + ". Same math for every RAU; the Applicability Rubric page documents it.")]),
        ui.el("div", { class: "sp" }),
        ui.el("div", { style: "min-width:220px" }, [ui.progress(prog), ui.el("div", { class: "g-muted", style: "font-size:12px;margin-top:3px;text-align:right" }, Math.round(prog) + "% dispositioned")])]));

      if (implicitDismissed) {
        wrap.appendChild(ui.el("div", { class: "g-card", style: "border-left:4px solid var(--g-line)" },
          ui.el("div", {}, [ui.badge("Risk ID complete", "ok"),
          ui.el("span", { style: "margin-left:8px" }, implicitDismissed + " remaining candidates were dismissed below the applicability floor at completion. The register keeps confirmations and notable rejections; Reopen on a dispositioned row takes a decision back if circumstances change.")])));
      }
      /* suppressed by exclusions */
      if (cand.suppressed.length) {
        var supBody = ui.el("div");
        cand.suppressed.forEach(function (x) {
          supBody.appendChild(ui.el("div", { class: "g-row", style: "padding:3px 0" }, [
            ui.pill("does NOT: " + x.topic, true),
            ui.el("a", { href: "#/events/" + x.ev.id }, x.ev.name),
            ui.el("span", { class: "g-muted", style: "font-size:12px" }, "hidden by the metadata survey's exclusion evidence")]));
        });
        var supCard = ui.card({
          title: "Suppressed by exclusions (" + cand.suppressed.length + "): the survey at work",
          body: supBody
        });
        supCard.style.borderLeft = "4px solid var(--g-line)";
        wrap.appendChild(supCard);
      }

      function zoneBlock(title, cls, items, note, renderActions) {
        var box = ui.el("div", { class: "g-zone " + cls });
        box.appendChild(ui.el("div", { class: "g-row", style: "margin-bottom:6px" }, [
          ui.el("span", { class: "g-h2", style: "margin:0" }, title + " (" + items.length + ")"),
          ui.el("span", { class: "g-muted", style: "font-size:12.5px" }, note)]));
        if (!items.length) { box.appendChild(ui.el("div", { class: "g-muted", style: "font-size:13px;padding:4px 0 8px" }, "Nothing here right now.")); return box; }
        items.forEach(function (s) { box.appendChild(candRow(s, renderActions)); });
        return box;
      }

      function candRow(s, renderActions) {
        var ev = s.ev;
        var open = false;
        var row = ui.el("div", { class: "g-card", style: "padding:10px 14px;margin-bottom:8px" });
        var detail = ui.el("div", { style: "display:none;margin-top:10px;border-top:1px solid var(--g-line-soft);padding-top:10px" });
        var head = ui.el("div", { class: "g-row" }, [
          ui.el("span", { class: "g-score", title: "Applicability likelihood " + s.pct + "%" }, [String(s.pct), ui.el("i", {}, ui.el("b", { style: "width:" + s.pct + "%" }))]),
          ui.badge(fmt.band(s.band), fmt.bandKind(s.band)),
          ev.side === "compliance" ? ui.badge("Compliance", "info") : ui.badge("Operational", ""),
          ui.el("a", { href: "#/events/" + ev.id, onclick: function (e) { e.stopPropagation(); } }, ev.name),
          ui.el("span", { class: "sp", style: "flex:1" }),
          ui.el("button", { class: "g-btn sm", onclick: function (e) { e.stopPropagation(); open = !open; detail.style.display = open ? "block" : "none"; } }, "Why this score"),
          renderActions(s)]);
        row.appendChild(head);
        detail.appendChild(ui.el("div", { class: "g-label", style: "margin-bottom:4px" }, "Rubric breakdown (8 categories, 1-5, weighted)"));
        detail.appendChild(ctx.charts.scoreBars({ categories: eng.rubric().categories, cats: s.cats }));
        detail.appendChild(ui.el("div", { class: "g-muted", style: "font-size:12px;margin-top:4px" }, "Keywords: " + (ev.keywords || []).join(", ")));
        if (ev.side === "compliance") {
          var mc = eng.mcrCandidates(r, ev.id);
          detail.appendChild(ui.el("div", { class: "g-label", style: "margin:10px 0 4px" }, "MCRs under this event (" + mc.total + " total; top-ranked shown, " + mc.tailCount + " long-tail)"));
          mc.head.slice(0, 6).forEach(function (h) {
            detail.appendChild(ui.el("div", { class: "g-row", style: "padding:2px 0;font-size:12.5px" }, [
              ui.el("span", { class: "g-score" }, [String(h.pct), ui.el("i", {}, ui.el("b", { style: "width:" + h.pct + "%" }))]),
              ui.el("a", { href: "#/mcrlib/" + h.mcr.id }, h.mcr.name)]));
          });
        }
        row.appendChild(detail);
        return row;
      }

      function act(s, status, extra) {
        var row = {
          rauId: r.id, eventId: s.ev.id, status: status, score: s.pct,
          by: ctx.state.get("role") + " (session)", date: fmt.today()
        };
        if (extra) Object.keys(extra).forEach(function (k) { row[k] = extra[k]; });
        if (status === "confirmed" && s.ev.side === "compliance") {
          var mc = eng.mcrCandidates(r, s.ev.id);
          row.mcrIds = mc.head.filter(function (h) { return h.pct >= eng.rubric().bands.likely; }).slice(0, 8).map(function (h) { return h.mcr.id; });
        }
        data.addRegister(row);
        GRC.traceAction(2, status === "confirmed" ? "Confirming a risk" : "Rejecting a candidate");
        if (r.riskIdStatus === "not-started") r.riskIdStatus = "in-progress";
        ui.toast(s.ev.name + " " + status + (row.mcrIds ? " with " + row.mcrIds.length + " suggested MCRs attached" : "") + ".");
        draw();
      }

      wrap.appendChild(zoneBlock("Likely applicable", "likely", z.likely,
        "score >= " + eng.rubric().bands.likely + ": confirm, or reject with rationale",
        function (s) {
          return ui.el("span", { class: "g-row" }, [
            ui.el("button", { class: "g-btn sm g-btn--primary", onclick: function (e) { e.stopPropagation(); act(s, "confirmed"); } }, "Confirm"),
            ui.el("button", { class: "g-btn sm", onclick: function (e) {
              e.stopPropagation();
              var why = prompt("Rejecting a LIKELY candidate needs a rationale (kept on the record):");
              if (why) act(s, "rejected", { rationale: why });
            } }, "Reject")]);
        }));

      var middleShown = showAllMiddle ? z.middle : z.middle.slice(0, 10);
      wrap.appendChild(zoneBlock("Ambiguous middle", "middle", middleShown,
        "score " + eng.rubric().bands.possible + "-" + (eng.rubric().bands.likely - 1) + ": resolve with targeted questions to push it out of the middle" + (z.middle.length > 10 && !showAllMiddle ? " (top 10 of " + z.middle.length + " shown)" : ""),
        function (s) {
          return ui.el("span", { class: "g-row" }, [
            ui.el("button", { class: "g-btn sm g-btn--primary", onclick: function (e) { e.stopPropagation(); resolveDrawer(s); } }, "Resolve"),
            ui.el("button", { class: "g-btn sm", onclick: function (e) { e.stopPropagation(); act(s, "confirmed", { rationale: "Owner judgment: confirmed from the middle band." }); } }, "Confirm anyway")]);
        }));

      if (z.middle.length > 10) {
        wrap.appendChild(ui.el("div", { style: "margin:-8px 0 14px 16px" },
          ui.el("button", { class: "g-btn sm", onclick: function () { showAllMiddle = !showAllMiddle; draw(); } },
            showAllMiddle ? "Show top 10 only" : "Show all " + z.middle.length + " in the middle")));
      }
      wrap.appendChild(zoneBlock("Unlikely", "unlikely", z.unlikely.slice(0, 12),
        "score < " + eng.rubric().bands.possible + ": bulk dismiss with sampling review (" + z.unlikely.length + " total, first 12 shown)",
        function (s) {
          return ui.el("button", { class: "g-btn sm", onclick: function (e) { e.stopPropagation(); act(s, "rejected", { rationale: "Below applicability floor." }); } }, "Dismiss");
        }));
      if (z.unlikely.length) {
        wrap.appendChild(ui.el("div", { style: "margin:-6px 0 14px" },
          ui.el("button", { class: "g-btn", onclick: function () {
            z.unlikely.forEach(function (s) { data.addRegister({ rauId: r.id, eventId: s.ev.id, status: "rejected", score: s.pct, by: ctx.state.get("role") + " (session)", date: fmt.today(), rationale: "Bulk dismissal below floor." }); });
            if (!z.likely.length && !z.middle.length) r.riskIdStatus = "complete";
            ui.toast(z.unlikely.length + " unlikely candidates dismissed.");
            draw();
          } }, "Dismiss all " + z.unlikely.length + " unlikely candidates")));
      }

      /* dispositioned */
      function reopen(x) {
        data.removeRegister(x.d);
        if (r.riskIdStatus === "complete") r.riskIdStatus = "in-progress";
        GRC.traceAction(2, "Reopening a disposition");
        ui.toast(x.s.ev.name + " reopened; it returns to its scored zone and risk ID is back in progress.");
        draw();
      }
      if (done.length) {
        var db = ui.el("div");
        done.sort(function (a, b) { return b.s.pct - a.s.pct; });
        db.appendChild(ui.table({
          cols: [
            { key: "n", label: "Event", render: function (x) { return ui.el("a", { href: "#/events/" + x.s.ev.id }, x.s.ev.name); } },
            { key: "t", label: "Type", render: function (x) { return x.s.ev.side === "compliance" ? ui.badge("Compliance", "info") : ui.badge("Operational", ""); } },
            { key: "score", label: "Score", num: true, render: function (x) { return String(x.d.score); } },
            { key: "st", label: "Decision", render: function (x) { return ui.badge(x.d.status, x.d.status === "confirmed" ? "ok" : ""); } },
            { key: "mcr", label: "MCRs", num: true, render: function (x) { return x.d.mcrIds ? String(x.d.mcrIds.length) : "-"; } },
            { key: "why", label: "Rationale", render: function (x) { return x.d.rationale ? ui.el("span", { class: "g-muted", style: "font-size:12px" }, x.d.rationale) : "-"; } },
            { key: "rate", label: "Inherent", render: function (x) {
              if (x.d.status !== "confirmed") return ui.el("span", { class: "g-muted" }, "-");
              var t = data.ratingOf(r.id, x.s.ev.id);
              if (t) {
                var b = ctx.engine.inherent.band(ctx.engine.inherent.fromArray(t.f)).band;
                return ui.badge(b.charAt(0).toUpperCase() + b.slice(1), b === "low" ? "ok" : b === "moderate" ? "info" : b === "high" ? "warn" : "bad");
              }
              return ui.el("button", { class: "g-btn sm", onclick: function (e) { e.stopPropagation(); ctx.state.set("inhFocus", x.s.ev.id); ctx.go("inherent/" + r.id); } }, "Rate");
            } },
            { key: "ctl", label: "Controls", render: function (x) {
              if (x.d.status !== "confirmed") return ui.el("span", { class: "g-muted" }, "-");
              var n = data.controlsOfInstance(r.id, x.s.ev.id).length;
              return ui.el("button", { class: "g-btn sm" + (n ? "" : " g-btn--primary"), title: n ? "Manage the attached controls" : "No controls attached yet: open the recommendation flow", onclick: function (e) { e.stopPropagation(); ctx.go("attach/" + r.id + "/" + x.s.ev.id); } }, n ? String(n) : "Attach");
            } },
            { key: "re", label: "", render: function (x) {
              return ui.el("span", { class: "g-row", style: "gap:6px" }, [
                ui.el("button", { class: "g-btn sm", onclick: function (e) { e.stopPropagation(); reopen(x); } }, "Reopen"),
                ui.el("button", { class: "g-btn sm", title: "Second line: flag this disposition as wrong, anytime", onclick: function (e) {
                  e.stopPropagation();
                  GRC.challenge(ctx, { rauId: r.id, kind: "instance", eventId: x.s.ev.id, label: r.id + " " + r.name + ": " + x.s.ev.name + " " + x.d.status + " at applicability " + x.d.score });
                } }, "Challenge")]);
            } }
          ], rows: done, page: 12
        }));
        wrap.appendChild(ui.card({ title: "Dispositioned (" + done.length + "): mistakes are reversible", body: db }));
      }
      if (!z.likely.length && !z.middle.length && !z.unlikely.length && done.length) {
        if (r.riskIdStatus !== "complete") {
          r.riskIdStatus = "complete";
        }
        wrap.appendChild(ui.el("div", { class: "g-card", style: "border-left:4px solid var(--g-ok)" },
          ui.el("div", {}, [ui.badge("Risk ID complete", "ok"), ui.el("span", { style: "margin-left:8px" }, "Every candidate dispositioned. ORBO/BACO challenge happens in RCSA administration (Capability 5).")])));
      }
    }

    /* ==SECTION:resolve== */
    function resolveDrawer(s) {
      var qs = ctx.engine.questionsFor(r, s.ev);
      var before = s.pct;
      var body = ui.el("div");
      body.appendChild(ui.el("p", {}, "These questions target the rubric categories where \"" + s.ev.name + "\" sits in the uncertain middle. Answers update this RAU's metadata, so every candidate on the workbench rescores consistently, not just this one."));
      if (!qs.length) {
        body.appendChild(ui.empty("No unanswered questions apply. Use owner judgment: confirm or reject with rationale."));
      }
      var dr;
      qs.forEach(function (q) {
        var line = ui.el("div", { class: "g-card", style: "padding:10px 14px" }, [
          ui.el("div", { style: "margin-bottom:8px" }, q.text),
          ui.el("div", { class: "g-row" }, [
            ui.el("button", { class: "g-btn sm g-btn--primary", onclick: function () { answer(q, true, line); } }, "Yes"),
            ui.el("button", { class: "g-btn sm", onclick: function () { answer(q, false, line); } }, "No")])]);
        body.appendChild(line);
      });
      var outcome = ui.el("div");
      body.appendChild(outcome);
      function answer(q, yes, line) {
        ctx.engine.answer(r, q, yes);
        GRC.traceAction(2, "Resolving applicability");
        line.style.opacity = "0.55";
        line.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
        var after = ctx.engine.score(r, s.ev);
        outcome.innerHTML = "";
        outcome.appendChild(ui.el("div", { class: "g-card", style: "border-left:4px solid var(--g-accent)" }, [
          ui.el("div", { class: "g-row" }, [
            ui.el("span", {}, "Score moved: "),
            ui.el("b", {}, before + " -> " + after.pct),
            ui.badge(ctx.fmt.band(after.band), ctx.fmt.bandKind(after.band)),
            ui.el("span", { class: "g-muted", style: "font-size:12px" }, "recorded as survey answer with provenance \"you answered\"")]),
          after.band !== "possible" ? ui.el("div", { style: "margin-top:8px" },
            ui.el("button", { class: "g-btn sm g-btn--primary", onclick: function () { dr.close(); draw(); } }, "Out of the middle. Return to workbench")) : null]));
      }
      dr = ui.drawer({ title: "Resolve: " + s.ev.name + " (currently " + before + ")", body: body, onclose: function () { draw(); } });
    }
    draw();
  }

  GRC.register({
    id: "riskid", version: "1.4.1", tab: "RCSA",
    caps: {
      "riskid": { primary: [2], uses: [1] },
      "riskid/:rauId": { primary: [2], uses: [1], feeds: [3, 4, 5] }
    },
    rail: [{ label: "2. Risk identification", route: "riskid", order: 20 }],
    routes: { "riskid": landing, "riskid/:rauId": workbench }
  });
})();

<!-- ==GRC-FILE-END== -->

<!-- ==GRC-FILE-BEGIN path=modules/inherent.js bytes=28423 sha256=8db07c2d4d19cba2fb09102492c20a6d3a4f9f1c714470fde16a8a49e3464a96== -->
/* GRC modules/inherent.js v1.2.0 2026-08-23 */
/* Capability 3: evidence-anchored inherent risk rating. Each confirmed
   risk instance gets likelihood x impact on anchored 5-level scales; the
   assistant suggests every level from platform data with provenance
   chips; humans accept in one click or override with mandatory
   rationale. Ratings are of risk instances only: MCRs and risk events
   carry no rating (compliance aggregation happens in CARA, outside
   RCSA). */
(function () {
  "use strict";
  var OPEN = {};   /* expanded worksheet rows, per session */
  var ED = {};     /* per-instance edit state: {edit, f} */
  var DOPEN = {};  /* distribution tree expansion */
  var LF = { q: "", lob: "", state: "" };

  function inh(ctx) { return ctx.engine.inherent; }
  function bandKind(b) { return b === "low" ? "ok" : b === "moderate" ? "info" : b === "high" ? "warn" : b === "critical" ? "bad" : ""; }
  function bandLabel(b) { return b ? b.charAt(0).toUpperCase() + b.slice(1) : "Not rated"; }
  function bandBadge(ui, b) { return ui.badge(bandLabel(b), bandKind(b)); }
  function isStale(t, fmt) {
    var d = new Date(fmt.today()); d.setDate(d.getDate() - 365);
    return t.date < d.toISOString().slice(0, 10);
  }
  function confirmedOf(data, rauId) {
    return data.regOfRau(rauId).filter(function (g) { return g.status === "confirmed"; });
  }

  /* ==SECTION:landing== */
  function landing(el, ctx) {
    var ui = ctx.ui;
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "Inherent risk ratings"),
        ui.el("div", { class: "g-muted" }, "Every confirmed risk instance carries a likelihood and impact rating on anchored scales. The assistant suggests each level from platform evidence; accepting takes one click, overriding requires rationale. The Inherent rubric page documents the anchors.")])));
    el.appendChild(ui.tabs({
      items: [
        { id: "raus", label: "Rate by RAU", render: function (bd) { drawRauList(bd, ctx); } },
        { id: "dist", label: "Distribution", render: function (bd) { drawDist(bd, ctx); } },
        { id: "gaps", label: "Completeness", render: function (bd) { drawGaps(bd, ctx); } }
      ]
    }));
  }

  function drawRauList(bd, ctx) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    bd.innerHTML = "";
    var rows = [];
    data.all("raus").forEach(function (r) {
      var conf = confirmedOf(data, r.id);
      if (!conf.length) return;
      var roll = inh(ctx).rollup(r);
      if (LF.q && (r.id + " " + r.name).toLowerCase().indexOf(LF.q.toLowerCase()) < 0) return;
      if (LF.lob && data.orgPath(r.subLobId).lobId !== LF.lob) return;
      if (LF.state === "todo" && roll.rated >= roll.confirmed) return;
      if (LF.state === "done" && roll.rated < roll.confirmed) return;
      rows.push({ r: r, roll: roll });
    });
    bd.appendChild(ui.toolbar([
      ui.searchBox({ value: LF.q, placeholder: "Find a RAU...", oninput: function (v) { LF.q = v; drawRauList(bd, ctx); } }),
      ui.select({
        label: "LOB", value: LF.lob, onchange: function (v) { LF.lob = v; drawRauList(bd, ctx); },
        options: [{ value: "", label: "All lines of business" }].concat(data.lobs().map(function (l) { return { value: l.id, label: l.name }; }))
      }),
      ui.select({
        label: "State", value: LF.state, onchange: function (v) { LF.state = v; drawRauList(bd, ctx); },
        options: [{ value: "", label: "All" }, { value: "todo", label: "Ratings open" }, { value: "done", label: "Fully rated" }]
      }),
      ui.el("span", { class: "g-muted", style: "font-size:12px" }, fmt.num(rows.length) + " RAUs with confirmed risks")]));
    bd.appendChild(ui.table({
      cols: [
        { key: "id", label: "RAU", render: function (x) { return ui.el("span", { class: "g-mono" }, x.r.id); } },
        { key: "name", label: "Name", sort: true, sortVal: function (x) { return x.r.name; }, render: function (x) { return x.r.name; } },
        { key: "sub", label: "SubLOB", render: function (x) { return data.orgPath(x.r.subLobId).sub; } },
        { key: "prog", label: "Rated", sort: true, sortVal: function (x) { return x.roll.rated / Math.max(1, x.roll.confirmed); }, render: function (x) { return ui.el("div", { style: "min-width:130px" }, [ui.progress(100 * x.roll.rated / Math.max(1, x.roll.confirmed)), ui.el("div", { class: "g-muted", style: "font-size:11.5px;margin-top:2px" }, x.roll.rated + " of " + x.roll.confirmed)]); } },
        { key: "band", label: "Inherent", sort: true, sortVal: function (x) { return ["low", "moderate", "high", "critical"].indexOf(x.roll.band); }, render: function (x) { return x.roll.band ? bandBadge(ui, x.roll.band) : ui.el("span", { class: "g-muted" }, "-"); } },
        { key: "strip", label: "Band profile", render: function (x) { return countStrip(ui, x.roll.counts); } }
      ], rows: rows, page: 15,
      onRow: function (x) { ctx.go("inherent/" + x.r.id); }
    }));
  }

  function countStrip(ui, c) {
    function seg(n, kind, letter) {
      if (!n) return null;
      return ui.el("span", { class: "g-badge g-badge--" + kind, style: "margin-right:4px", title: letter[1] }, n + letter[0]);
    }
    if (!c.critical && !c.high && !c.moderate && !c.low) return ui.el("span", { class: "g-muted" }, "-");
    return ui.el("span", {}, [
      seg(c.critical, "bad", ["C", "Critical"]), seg(c.high, "warn", ["H", "High"]),
      seg(c.moderate, "info", ["M", "Moderate"]), seg(c.low, "ok", ["L", "Low"])]);
  }

  /* ==SECTION:distribution== */
  function drawDist(bd, ctx) {
    var ui = ctx.ui, data = ctx.data;
    bd.innerHTML = "";
    var wrap = ui.el("div", { class: "g-tablewrap" });
    var t = ui.el("table", { class: "g-table" });
    t.appendChild(ui.el("tr", {}, [
      ui.el("th", {}, "LOB / SubLOB"), ui.el("th", { style: "text-align:right" }, "Critical"),
      ui.el("th", { style: "text-align:right" }, "High"), ui.el("th", { style: "text-align:right" }, "Moderate"),
      ui.el("th", { style: "text-align:right" }, "Low"), ui.el("th", { style: "text-align:right" }, "Rated coverage")]));
    function rollSet(raus) {
      var c = { critical: 0, high: 0, moderate: 0, low: 0 }, rated = 0, conf = 0;
      raus.forEach(function (r) {
        var roll = inh(ctx).rollup(r);
        ["critical", "high", "moderate", "low"].forEach(function (b) { c[b] += roll.counts[b]; });
        rated += roll.rated; conf += roll.confirmed;
      });
      return { c: c, rated: rated, conf: conf };
    }
    function rowFor(label, agg, cls, onclick, open) {
      var tr = ui.el("tr", { class: cls }, [
        ui.el("td", {}, [onclick ? ui.el("span", { class: "caret" + (open ? " open" : "") }) : null, label]),
        ui.el("td", { class: "num" }, String(agg.c.critical)), ui.el("td", { class: "num" }, String(agg.c.high)),
        ui.el("td", { class: "num" }, String(agg.c.moderate)), ui.el("td", { class: "num" }, String(agg.c.low)),
        ui.el("td", { class: "num" }, agg.conf ? Math.round(100 * agg.rated / agg.conf) + "%" : "-")]);
      if (onclick) tr.onclick = onclick;
      return tr;
    }
    data.lobs().forEach(function (lob) {
      var subs = data.subLobs().filter(function (s) { return s.parentId === lob.id; });
      var lobRaus = [];
      subs.forEach(function (s) { lobRaus = lobRaus.concat(data.rausOfSub(s.id)); });
      var open = !!DOPEN[lob.id];
      t.appendChild(rowFor(lob.name, rollSet(lobRaus), "tree-parent click", function () { DOPEN[lob.id] = !open; drawDist(bd, ctx); }, open));
      if (!open) return;
      subs.forEach(function (s) {
        t.appendChild(rowFor(s.name, rollSet(data.rausOfSub(s.id)), "tree-ind1", null));
      });
    });
    wrap.appendChild(t);
    bd.appendChild(ui.el("p", { class: "g-muted", style: "font-size:12.5px" }, "Counts are rated risk instances by final band. Expand a line of business in place; coverage is rated instances over confirmed instances."));
    bd.appendChild(wrap);
  }

  /* ==SECTION:completeness== */
  function drawGaps(bd, ctx) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    bd.innerHTML = "";
    var unrated = [], stale = [], byRauOv = {};
    data.all("raus").forEach(function (r) {
      confirmedOf(data, r.id).forEach(function (g) {
        var t = data.ratingOf(r.id, g.eventId);
        if (!t) { unrated.push({ r: r, g: g }); return; }
        if (isStale(t, fmt)) stale.push({ r: r, t: t });
        if (t.ov) { (byRauOv[r.id] = byRauOv[r.id] || { r: r, n: 0, total: 0 }).n++; }
        (byRauOv[r.id] = byRauOv[r.id] || { r: r, n: 0, total: 0 }).total++;
      });
    });
    var ovRows = Object.keys(byRauOv).map(function (k) { return byRauOv[k]; })
      .filter(function (x) { return x.n > 0; })
      .sort(function (a, b) { return b.n / b.total - a.n / a.total; }).slice(0, 40);
    bd.appendChild(ui.card({
      title: "Unrated confirmed instances (" + fmt.num(unrated.length) + ")",
      body: unrated.length ? ui.table({
        cols: [
          { key: "rau", label: "RAU", render: function (x) { return ui.el("span", {}, [ui.el("span", { class: "g-mono g-muted" }, x.r.id + " "), x.r.name]); } },
          { key: "ev", label: "Risk instance", render: function (x) { var e = data.byId("riskEvents", x.g.eventId); return e ? e.name : x.g.eventId; } },
          { key: "score", label: "Applicability", num: true, render: function (x) { return String(x.g.score); } },
          { key: "cart", label: "", render: function (x) {
            var e = data.byId("riskEvents", x.g.eventId);
            return GRC.cart.btn({ key: "rate|" + x.r.id + "|" + x.g.eventId, kind: "rate", rauId: x.r.id, eventId: x.g.eventId, label: "Rate " + (e ? e.name : x.g.eventId) + " on " + x.r.id, sub: x.r.name, route: "inherent/" + x.r.id });
          } },
          { key: "go", label: "", render: function () { return ui.el("button", { class: "g-btn sm g-btn--primary" }, "Rate"); } }
        ], rows: unrated.slice(0, 300), page: 10,
        onRow: function (x) { ctx.state.set("inhFocus", x.g.eventId); ctx.go("inherent/" + x.r.id); }
      }) : ui.empty("Every confirmed instance is rated.")
    }));
    bd.appendChild(ui.card({
      title: "Stale ratings, older than 12 months (" + fmt.num(stale.length) + ")",
      body: stale.length ? ui.table({
        cols: [
          { key: "rau", label: "RAU", render: function (x) { return ui.el("span", {}, [ui.el("span", { class: "g-mono g-muted" }, x.r.id + " "), x.r.name]); } },
          { key: "ev", label: "Risk instance", render: function (x) { var e = data.byId("riskEvents", x.t.eventId); return e ? e.name : x.t.eventId; } },
          { key: "date", label: "Rated", render: function (x) { return fmt.date(x.t.date); } },
          { key: "by", label: "By", render: function (x) { return x.t.by; } },
          { key: "cart", label: "", render: function (x) {
            var e = data.byId("riskEvents", x.t.eventId);
            return GRC.cart.btn({ key: "restale|" + x.r.id + "|" + x.t.eventId, kind: "review", rauId: x.r.id, eventId: x.t.eventId, label: "Refresh the stale rating on " + (e ? e.name : x.t.eventId), sub: x.r.id + " " + x.r.name, route: "inherent/" + x.r.id });
          } }
        ], rows: stale, page: 10,
        onRow: function (x) { ctx.state.set("inhFocus", x.t.eventId); ctx.go("inherent/" + x.r.id); }
      }) : ui.empty("Nothing stale.")
    }));
    bd.appendChild(ui.card({
      title: "Override density by RAU (top " + ovRows.length + ")",
      body: ui.el("div", {}, [
        ui.el("p", { class: "g-muted", style: "font-size:12.5px" }, "Overrides are legitimate and documented; a dense cluster is where second-line attention goes first (Capability 5)."),
        ovRows.length ? ui.table({
          cols: [
            { key: "rau", label: "RAU", render: function (x) { return ui.el("span", {}, [ui.el("span", { class: "g-mono g-muted" }, x.r.id + " "), x.r.name]); } },
            { key: "n", label: "Overrides", num: true, sort: true, sortVal: function (x) { return x.n; }, render: function (x) { return String(x.n); } },
            { key: "tot", label: "Rated", num: true, render: function (x) { return String(x.total); } },
            { key: "pct", label: "Rate", num: true, render: function (x) { return Math.round(100 * x.n / x.total) + "%"; } }
          ], rows: ovRows, page: 10,
          onRow: function (x) { ctx.go("inherent/" + x.r.id); }
        }) : ui.empty("No overrides recorded.")])
    }));
  }

  /* ==SECTION:worksheet== */
  function worksheet(el, ctx, params) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt, eng = inh(ctx);
    var r = data.byId("raus", params.rauId);
    if (!r) { el.appendChild(ui.empty("Unknown RAU " + params.rauId)); return; }
    var focus = ctx.state.get("inhFocus");
    if (focus) { OPEN[r.id + "|" + focus] = true; ctx.state.set("inhFocus", null); }
    var wrap = ui.el("div"); el.appendChild(wrap);

    function draw() {
      wrap.innerHTML = "";
      var conf = confirmedOf(data, r.id);
      var roll = eng.rollup(r);
      wrap.appendChild(ui.el("div", { class: "g-page-head" }, [
        ui.el("div", {}, [
          ui.el("div", { class: "g-muted", style: "font-size:12px;margin-bottom:2px" }, [
            ui.el("a", { href: "#/inherent" }, "Inherent ratings"), " / " + r.id]),
          ui.el("div", { class: "g-row" }, [
            ui.el("span", { class: "g-h1" }, "Rating worksheet"),
            ui.el("a", { href: "#/raus/" + r.id, class: "g-mono" }, r.id), ui.el("span", {}, r.name),
            roll.band ? bandBadge(ui, roll.band) : null, countStrip(ui, roll.counts)]),
          ui.el("div", { class: "g-muted" }, [
            ui.el("span", {}, roll.rated + " of " + roll.confirmed + " confirmed instances rated. Suggested levels are computed from platform evidence; overriding any level requires rationale. Anchors: "),
            ui.el("a", { href: "#/inherent-rubric" }, "Inherent rubric"),
            ui.el("span", {}, ", same anchors and math for every RAU.")])]),
        ui.el("div", { class: "sp" }),
        ui.el("div", { style: "min-width:220px" }, [ui.progress(100 * roll.rated / Math.max(1, roll.confirmed)), ui.el("div", { class: "g-muted", style: "font-size:12px;margin-top:3px;text-align:right" }, Math.round(100 * roll.rated / Math.max(1, roll.confirmed)) + "% rated")])]));
      if (!conf.length) { wrap.appendChild(ui.empty("No confirmed risk instances yet. Complete risk identification (Capability 2) first.")); return; }
      conf.sort(function (a, b) { return b.score - a.score; });
      conf.forEach(function (g) { wrap.appendChild(instRow(g)); });
    }

    function instRow(g) {
      var ev = data.byId("riskEvents", g.eventId);
      var t = data.ratingOf(r.id, g.eventId);
      var key = r.id + "|" + g.eventId;
      var sug = eng.suggest(r, ev, g);
      var open = !!OPEN[key];
      var row = ui.el("div", { class: "g-card", style: "padding:10px 14px;margin-bottom:8px" });
      var chips = [];
      if (t) {
        var bb = eng.band(eng.fromArray(t.f));
        chips.push(bandBadge(ui, bb.band));
        if (t.ov) chips.push(ui.badge("Override", "warn"));
        if (isStale(t, fmt)) chips.push(ui.badge("Stale", "warn"));
        var out = eng.peerOutlier(r, g.eventId, eng.fromArray(t.f));
        if (out) chips.push(ui.el("span", { class: "g-badge g-badge--bad", title: "Final band " + bandLabel(out.mine) + " vs LOB median " + bandLabel(out.median) + " across " + out.peers + " peers" }, "Peer outlier"));
      } else {
        chips.push(ui.badge("Not rated", ""));
        chips.push(GRC.cart.btn({ key: "rate|" + r.id + "|" + g.eventId, kind: "rate", rauId: r.id, eventId: g.eventId, label: "Rate " + ev.name + " on " + r.id, sub: r.name, route: "inherent/" + r.id }));
      }
      var head = ui.el("div", { class: "g-row click" }, [
        ui.el("span", { class: "caret" + (open ? " open" : "") }),
        ev.side === "compliance" ? ui.badge("Compliance", "info") : ui.badge("Operational", ""),
        ui.el("a", { href: "#/events/" + ev.id, onclick: function (e) { e.stopPropagation(); } }, ev.name),
        ui.el("span", { class: "g-muted", style: "font-size:12px" }, "applicability " + g.score),
        ui.el("span", { class: "sp", style: "flex:1" }),
        ui.el("span", { class: "g-row" }, chips)]);
      head.onclick = function () { OPEN[key] = !open; draw(); };
      row.appendChild(head);
      if (open) row.appendChild(panel(g, ev, t, sug, key));
      return row;
    }

    function panel(g, ev, t, sug, key) {
      var box = ui.el("div", { style: "margin-top:10px;border-top:1px solid var(--g-line-soft);padding-top:10px" });
      var ed = ED[key];
      var editing = !t || (ed && ed.edit);
      var f = ed && ed.f ? ed.f : (t ? t.f.slice() : [sug.levels.l, sug.levels.fin, sug.levels.cust, sug.levels.reg, sug.levels.ops]);
      ED[key] = { edit: editing, f: f, note: ed && ed.note };
      var D = inh(ctx).def;
      var dims = [
        { i: 0, label: "Likelihood", anchors: D.likelihood.map(function (x) { return x.n + ": " + x.a; }), chips: sug.chips.l, sug: sug.levels.l },
        { i: 1, label: "Financial", anchors: D.lenses[0].a, chips: sug.chips.fin, sug: sug.levels.fin },
        { i: 2, label: "Customer", anchors: D.lenses[1].a, chips: sug.chips.cust, sug: sug.levels.cust },
        { i: 3, label: "Regulatory", anchors: D.lenses[2].a, chips: sug.chips.reg, sug: sug.levels.reg },
        { i: 4, label: "Operational disruption", anchors: D.lenses[3].a, chips: sug.chips.ops, sug: sug.levels.ops }
      ];
      var foot = ui.el("div");
      var noteBox = ui.el("div");
      function changed() {
        for (var i = 0; i < 5; i++) { if (f[i] !== [sug.levels.l, sug.levels.fin, sug.levels.cust, sug.levels.reg, sug.levels.ops][i]) return true; }
        return false;
      }
      function drawFoot() {
        foot.innerHTML = "";
        var lv = inh(ctx).fromArray(f);
        var bb = inh(ctx).band(lv);
        var rep = lv.cust >= 4 || lv.reg >= 4 || (ev.visClass || 1) >= 3;
        foot.appendChild(ui.el("div", { class: "g-row", style: "margin-top:8px" }, [
          ui.el("span", {}, "Impact = worst lens: "), ui.el("b", {}, bb.driver.label + " " + bb.impact),
          ui.el("span", {}, " x Likelihood " + lv.l + " = "), bandBadge(ui, bb.band),
          rep ? ui.el("span", { class: "g-badge", title: "Derived from customer reach, regulatory severity, and event visibility; reputational is not a scored dimension" }, "Reputational exposure flag") : null]));
        noteBox.innerHTML = "";
        if (editing) {
          var need = changed();
          var ta = ui.el("textarea", { class: "g-input", rows: "2", style: "width:100%;margin-top:8px", placeholder: "Override rationale (required when any level departs from the evidence-based suggestion)" });
          ta.value = (ed && ed.note) || (t && t.note) || "";
          ta.oninput = function () { ED[key].note = ta.value; saveBtn.disabled = need && !ta.value.trim(); };
          var saveBtn = ui.el("button", { class: "g-btn g-btn--primary", style: "margin-top:8px", onclick: function () { save(need ? ta.value.trim() : ""); } },
            need ? "Save override" : "Accept evidence-based rating");
          if (need) {
            noteBox.appendChild(ta);
            saveBtn.disabled = !ta.value.trim();
          }
          noteBox.appendChild(ui.el("div", { class: "g-row" }, [saveBtn,
            t ? ui.el("button", { class: "g-btn", style: "margin-top:8px", onclick: function () { delete ED[key]; draw(); } }, "Cancel") : null]));
        } else {
          noteBox.appendChild(ui.el("div", { class: "g-row", style: "margin-top:8px" }, [
            t.ov ? ui.el("span", { class: "g-muted", style: "font-size:12.5px" }, "Override rationale: " + (t.note || "-")) : ui.el("span", { class: "g-muted", style: "font-size:12.5px" }, "Accepted the evidence-based suggestion."),
            ui.el("span", { class: "sp", style: "flex:1" }),
            ui.el("span", { class: "g-muted", style: "font-size:12px" }, "Rated by " + t.by + " on " + fmt.date(t.date)),
            ui.el("button", { class: "g-btn sm", onclick: function () { ED[key] = { edit: true, f: t.f.slice() }; draw(); } }, "Re-rate"),
            ui.el("button", { class: "g-btn sm", title: "Second line: flag this rating as wrong, anytime", onclick: function () {
              var bb2 = inh(ctx).band(inh(ctx).fromArray(t.f));
              GRC.challenge(ctx, { rauId: r.id, kind: "rating", eventId: g.eventId, label: r.id + " " + r.name + ": " + ev.name + " rated " + bandLabel(bb2.band) + (t.ov ? " with an override" : "") });
            } }, "Challenge")]));
        }
      }
      function save(note) {
        var s = [sug.levels.l, sug.levels.fin, sug.levels.cust, sug.levels.reg, sug.levels.ops];
        var ov = changed() ? 1 : 0;
        var row = { rauId: r.id, eventId: g.eventId, s: s, f: f.slice(), ov: ov, by: ctx.state.get("role") + " (session)", date: fmt.today() };
        if (ov && note) row.note = note;
        data.setRating(row);
        delete ED[key];
        GRC.traceAction(3, ov ? "Overriding a rating with rationale" : "Accepting an evidence-based rating");
        ui.toast(ev.name + " rated " + bandLabel(inh(ctx).band(inh(ctx).fromArray(row.f)).band) + (ov ? " with a documented override." : " from the evidence."));
        draw();
      }
      dims.forEach(function (d) {
        var picker = ui.el("span", { class: "g-row", style: "gap:2px" });
        for (var lvl = 1; lvl <= 5; lvl++) {
          (function (lvl) {
            var on = f[d.i] === lvl;
            var b = ui.el("button", {
              class: "g-btn sm" + (on ? " g-btn--primary" : ""),
              title: d.anchors[lvl - 1] + (lvl === d.sug ? " (suggested)" : ""),
              onclick: editing ? function () { f[d.i] = lvl; ED[key].f = f; drawFoot(); drawRows(); } : null
            }, String(lvl));
            if (!editing) b.disabled = true;
            if (lvl === d.sug) b.style.textDecoration = "underline";
            picker.appendChild(b);
          })(lvl);
        }
        var line = ui.el("div", { class: "g-row", style: "padding:5px 0;border-bottom:1px dashed var(--g-line-soft);align-items:flex-start" }, [
          ui.el("span", { style: "width:170px;flex:none;font-weight:600;font-size:13px" }, d.label),
          picker,
          ui.el("span", { style: "flex:1;min-width:220px" }, [
            ui.el("span", { class: "g-muted", style: "display:block;font-size:12px" }, "Level " + f[d.i] + ": " + d.anchors[f[d.i] - 1]),
            ui.el("span", {}, d.chips.map(function (c) { return ui.el("span", { class: "g-pill", style: "margin:2px 4px 0 0;font-size:11px", title: "Evidence with provenance" }, c); }))])]);
        line.dataset.dim = String(d.i);
        box.appendChild(line);
      });
      function drawRows() {
        box.querySelectorAll("[data-dim]").forEach(function (line) {
          var i = Number(line.dataset.dim);
          var d = dims[i];
          line.querySelectorAll("button").forEach(function (b, bi) {
            b.className = "g-btn sm" + (f[i] === bi + 1 ? " g-btn--primary" : "");
          });
          var lbl = line.querySelector(".g-muted");
          if (lbl) lbl.textContent = "Level " + f[i] + ": " + d.anchors[f[i] - 1];
        });
      }
      box.appendChild(foot);
      box.appendChild(noteBox);
      drawFoot();
      return box;
    }
    draw();
  }

  /* ==SECTION:rubric== */
  function rubricPage(el, ctx) {
    var ui = ctx.ui;
    var D = inh(ctx).def;
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "Inherent rating rubric"),
        ui.el("div", { class: "g-muted" }, "Likelihood times impact, five anchored levels each, identical for every RAU. This rubric is its own standard, separate from the applicability rubric in Capability 2. Every anchor is countable; subjectivity lives only in documented overrides.")])));
    var left = ui.el("div");
    var lt = ui.el("table", { class: "g-table" });
    lt.appendChild(ui.el("tr", {}, [ui.el("th", {}, "Level"), ui.el("th", {}, "Name"), ui.el("th", {}, "Frequency anchor")]));
    D.likelihood.forEach(function (x, i) {
      lt.appendChild(ui.el("tr", {}, [ui.el("td", { class: "g-mono" }, String(i + 1)), ui.el("td", {}, x.n), ui.el("td", {}, x.a)]));
    });
    left.appendChild(ui.card({ title: "Likelihood: how often, anchored to frequency", body: ui.el("div", { class: "g-tablewrap" }, lt) }));
    var it = ui.el("table", { class: "g-table" });
    it.appendChild(ui.el("tr", {}, [ui.el("th", {}, "Level")].concat(D.lenses.map(function (x) { return ui.el("th", {}, x.label); }))));
    for (var lvl = 1; lvl <= 5; lvl++) {
      it.appendChild(ui.el("tr", {}, [ui.el("td", { class: "g-mono" }, String(lvl))].concat(D.lenses.map(function (x) { return ui.el("td", { style: "font-size:12.5px" }, x.a[lvl - 1]); }))));
    }
    left.appendChild(ui.card({
      title: "Impact: worst credible outcome on four fact-anchored lenses", body: ui.el("div", {}, [
        ui.el("div", { class: "g-tablewrap" }, it),
        ui.el("p", { class: "g-muted", style: "font-size:12.5px;margin:8px 0 0" }, "The impact level is the highest lens reached. Reputational damage is deliberately NOT a scored lens: it is derived as a flag from customer reach, regulatory severity, and event visibility. Scoring it directly is where subjective ratings come from.")])
    }));
    var right = ui.el("div");
    var gt = ui.el("table", { class: "g-table" });
    gt.appendChild(ui.el("tr", {}, [ui.el("th", {}, "Impact \\ Likelihood")].concat([1, 2, 3, 4, 5].map(function (l) { return ui.el("th", { style: "text-align:center" }, String(l)); }))));
    for (var imp = 5; imp >= 1; imp--) {
      var cells = [ui.el("td", { class: "g-mono" }, String(imp))];
      for (var l2 = 1; l2 <= 5; l2++) {
        var b = D.grid[imp - 1][l2 - 1];
        cells.push(ui.el("td", { style: "text-align:center" }, ui.badge(bandLabel(b).slice(0, 1), bandKind(b))));
      }
      gt.appendChild(ui.el("tr", {}, cells));
    }
    right.appendChild(ui.card({
      title: "The band grid", body: ui.el("div", {}, [
        ui.el("div", { class: "g-tablewrap" }, gt),
        ui.el("div", { class: "g-row", style: "margin-top:8px" }, [bandBadge(ui, "low"), bandBadge(ui, "moderate"), bandBadge(ui, "high"), bandBadge(ui, "critical")])])
    }));
    right.appendChild(ui.card({
      title: "Where suggested levels come from", body: ui.el("ul", { style: "margin:0;padding-left:20px;font-size:13px" }, [
        ui.el("li", {}, "Likelihood: annual volume and loss history from the RAU profile, the event's error propensity class, and the change level."),
        ui.el("li", {}, "Financial: the event's typical severity class, amplified by high-volume money movement in the RAU's metadata."),
        ui.el("li", {}, "Customer: the consumer-facing survey answer and volume scale, plus attached MCR breadth on compliance instances."),
        ui.el("li", {}, "Regulatory: the count of MCRs attached to the instance and enforcement history in the obligation family."),
        ui.el("li", {}, "Operational disruption: handoff dependencies from the process map and volume-driven backlog exposure."),
        ui.el("li", {}, "Every chip on the worksheet names its source. Overrides are welcome; they just come with rationale.")])
    }));
    right.appendChild(ui.card({
      title: "Boundaries", body: ui.el("p", { class: "g-muted", style: "font-size:12.5px;margin:0" },
        "Ratings attach to risk instances only. MCRs and risk events carry no direct rating; compliance-side aggregation happens in the Compliance Aggregated Risk Assessment (CARA), outside RCSA. The RAU headline band is simply the highest instance band, shown with its drivers and a count strip.")
    }));
    el.appendChild(ui.el("div", { class: "g-split" }, [left, right]));
  }

  GRC.register({
    id: "inherent", version: "1.2.0", tab: "RCSA",
    caps: {
      "inherent": { primary: [3], uses: [2] },
      "inherent/:rauId": { primary: [3], uses: [1, 2], feeds: [5] },
      "inherent-rubric": { primary: [3] }
    },
    rail: [
      { label: "3. Inherent ratings", route: "inherent", order: 22 },
      { label: "Inherent rubric", route: "inherent-rubric", order: 82 }
    ],
    routes: { "inherent": landing, "inherent/:rauId": worksheet, "inherent-rubric": rubricPage }
  });
})();

<!-- ==GRC-FILE-END== -->

<!-- ==GRC-FILE-BEGIN path=modules/controls.js bytes=33432 sha256=f3ad9af8ea757f73709a9ac24f4d5df4dc2889a12dcc6f1ea0b151bc5e811556== -->
/* GRC modules/controls.js v1.2.0 2026-08-23 */
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
          { key: "cart", label: "", render: function (y) {
            var e = data.byId("riskEvents", y.x.g.eventId);
            return GRC.cart.btn({ key: "exp|" + y.r.id + "|" + y.x.g.eventId, kind: "expected", rauId: y.r.id, eventId: y.x.g.eventId, label: "Attach the expected control on " + (e ? e.name : y.x.g.eventId), sub: y.r.id + " " + y.r.name, route: "attach/" + y.r.id + "/" + y.x.g.eventId });
          } },
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
          { key: "cart", label: "", render: function (y) {
            var e = data.byId("riskEvents", y.x.g.eventId);
            return GRC.cart.btn({ key: "mit|" + y.r.id + "|" + y.x.g.eventId, kind: "mitigate", rauId: y.r.id, eventId: y.x.g.eventId, label: "Add controls to " + (e ? e.name : y.x.g.eventId), sub: y.r.id + " " + y.r.name + ", inherent " + y.x.band, route: "attach/" + y.r.id + "/" + y.x.g.eventId });
          } },
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
          { key: "ctl", label: "The lone control", render: function (y) { return ui.el("a", { href: "#/controls/" + y.x.control.id, onclick: function (e) { e.stopPropagation(); } }, y.x.control.name); } },
          { key: "cart", label: "", render: function (y) {
            var e = data.byId("riskEvents", y.x.g.eventId);
            return GRC.cart.btn({ key: "sp|" + y.r.id + "|" + y.x.g.eventId, kind: "review", rauId: y.r.id, eventId: y.x.g.eventId, label: "Review the single point of mitigation on " + (e ? e.name : y.x.g.eventId), sub: y.r.id + " " + y.r.name, route: "attach/" + y.r.id + "/" + y.x.g.eventId });
          } }
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
    id: "controls", version: "1.2.0", tab: "RCSA",
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

<!-- ==GRC-FILE-END== -->

<!-- ==GRC-FILE-BEGIN path=modules/rcsa.js bytes=29019 sha256=6b076b827ef5fe85ddb843937e37c77d68bd926766fbfa09768773ed2ba675b4== -->
/* GRC modules/rcsa.js v1.1.0 2026-08-23 */
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
        ui.el("td", { class: "num" }, [
          document.createTextNode((st.pending || 0) + " / " + (st.openChal || 0) + " "),
          st.state !== "current" ? GRC.cart.btn({ key: "aff|" + r.id, kind: "affirm", rauId: r.id, label: "Bring " + r.id + " to affirmation", sub: r.name + " (" + st.state + ")", route: "rcsa/" + r.id }) : null].filter(Boolean))]);
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
        { key: "ev", label: "Where", render: function (x) { if (!x.eventId) return ui.el("span", { class: "g-muted" }, "RAU level"); var e = ctx.data.byId("riskEvents", x.eventId); return e ? ui.el("a", { href: "#/events/" + x.eventId, onclick: function (ev2) { ev2.stopPropagation(); } }, e.name) : x.eventId; } },
        { key: "why", label: "Why it is here", render: function (x) { return ui.el("span", { style: "font-size:12.5px" }, x.reason); } },
        { key: "act", label: "", render: function (x) {
          var kindMap = { challenge: "challenge", "exp-gap": "expected", changes: "affirm", overdue: "affirm" };
          var ck = kindMap[x.kind] || "review";
          var item = {
            key: "att|" + x.kind + "|" + x.rau.id + "|" + (x.eventId || "") + "|" + (x.chId || ""),
            kind: ck, rauId: x.rau.id, eventId: x.eventId || null, chId: x.chId || null,
            label: (ck === "affirm" ? "Bring " + x.rau.id + " to affirmation" : x.reason.slice(0, 70)),
            sub: x.rau.id + " " + x.rau.name,
            route: ck === "expected" && x.eventId ? "attach/" + x.rau.id + "/" + x.eventId : "rcsa/" + x.rau.id
          };
          return ui.el("span", { class: "g-row", style: "gap:6px" }, [
            GRC.cart.btn(item),
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
              e ? ui.el("a", { href: "#/events/" + ln.g.eventId, onclick: function (ev3) { ev3.stopPropagation(); } }, e.name) : ln.g.eventId,
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
          (c.state === "open" || c.state === "responded") ? GRC.cart.btn({ key: "chal|" + c.id, kind: "challenge", chId: c.id, rauId: r.id, label: (c.state === "open" ? "Answer" : "Resolve") + " challenge " + c.id + " on " + r.id, sub: c.what.slice(0, 70), route: "rcsa/" + r.id }) : null,
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
    id: "rcsa", version: "1.1.0", tab: "RCSA",
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

<!-- ==GRC-FILE-END== -->

<!-- ==GRC-FILE-BEGIN path=modules/skeletons.js bytes=561 sha256=970cbbf1ba17b7450a102e2bf1d61cefe4e9799bc44b77408bcf0e46fa62754b== -->
/* GRC modules/skeletons.js v1.3.0 2026-08-23 */
/* All five RCSA-tab capabilities are now built. This module survives only
   to keep the old skeleton routes alive as redirects, so links from
   earlier releases and demo scripts never break. */
(function () {
  "use strict";
  GRC.register({
    id: "skeletons", version: "1.3.0", tab: "RCSA",
    caps: {},
    routes: {
      "cap3": function (el, ctx) { ctx.go("inherent"); },
      "cap4": function (el, ctx) { ctx.go("controls"); },
      "cap5": function (el, ctx) { ctx.go("rcsa"); }
    }
  });
})();

<!-- ==GRC-FILE-END== -->

<!-- ==GRC-FILE-BEGIN path=modules/libraries.js bytes=18448 sha256=47d247d79ad13cdbc83ff4922067c4019c495a4a9406e68796dbc6e166560277== -->
/* GRC modules/libraries.js v1.2.0 2026-08-23 */
/* Capability 2 reference corpora: the 90 Risk Events, the MCR library
   (published from RRCM, read-only), and the applicability rubric panel. */
(function () {
  "use strict";
  var EF = { q: "", side: "" };
  var MF = { q: "", fam: "", head: "" };

  /* ==SECTION:events== */
  function events(el, ctx) {
    var ui = ctx.ui, data = ctx.data;
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "Risk events"),
        ui.el("div", { class: "g-muted" }, "The standing event inventory across operational and compliance risk. Each carries a name, description, qualification, and matching keywords. Compliance events parent the MCR library.")])));
    var body = ui.el("div"); el.appendChild(body);
    function draw() {
      body.innerHTML = "";
      var rows = data.all("riskEvents").filter(function (e) {
        if (EF.q && (e.id + " " + e.name + " " + (e.keywords || []).join(" ")).toLowerCase().indexOf(EF.q.toLowerCase()) < 0) return false;
        if (EF.side && e.side !== EF.side) return false;
        return true;
      });
      body.appendChild(ui.toolbar([
        ui.searchBox({ value: EF.q, placeholder: "Search names and keywords...", oninput: function (v) { EF.q = v; draw(); } }),
        ui.select({ label: "Side", value: EF.side, onchange: function (v) { EF.side = v; draw(); }, options: [{ value: "", label: "Both" }, { value: "operational", label: "Operational" }, { value: "compliance", label: "Compliance" }] }),
        ui.el("span", { class: "g-muted", style: "font-size:12px" }, rows.length + " events")]));
      body.appendChild(ui.table({
        cols: [
          { key: "id", label: "ID", render: function (e) { return ui.el("span", { class: "g-mono" }, e.id); } },
          { key: "side", label: "Side", sort: true, render: function (e) { return e.side === "compliance" ? ui.badge("Compliance", "info") : ui.badge("Operational", ""); } },
          { key: "name", label: "Event", sort: true },
          { key: "kw", label: "Keywords", render: function (e) { return ui.el("span", { class: "g-muted", style: "font-size:12px" }, (e.keywords || []).join(", ")); } },
          { key: "mcr", label: "MCRs", num: true, render: function (e) { return e.side === "compliance" ? String(data.mcrsOfEvent(e.id).length) : "-"; } },
          { key: "conf", label: "RAUs confirmed", num: true, render: function (e) { return String(data.regOfEvent(e.id).filter(function (g) { return g.status === "confirmed"; }).length); } }
        ], rows: rows, page: 25,
        onRow: function (e) { ctx.go("events/" + e.id); }
      }));
    }
    draw();
  }

  function eventDetail(el, ctx, params) {
    var ui = ctx.ui, data = ctx.data;
    var e = data.byId("riskEvents", params.id);
    if (!e) { el.appendChild(ui.empty("Unknown event")); return; }
    var confirmed = data.regOfEvent(e.id).filter(function (g) { return g.status === "confirmed"; });
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-muted", style: "font-size:12px;margin-bottom:2px" }, [ui.el("a", { href: "#/events" }, "Risk events"), " / " + e.id]),
        ui.el("div", { class: "g-row" }, [ui.el("span", { class: "g-h1" }, e.name), ui.el("span", { class: "g-mono g-muted" }, e.id),
        e.side === "compliance" ? ui.badge("Compliance", "info") : ui.badge("Operational", "")]),
        ui.el("div", { class: "g-muted" }, "Confirmed applicable in " + confirmed.length + " RAUs")])));
    var left = ui.el("div");
    left.appendChild(ui.card({
      title: "Profile", body: ui.kv([
        ["Description", e.description], ["Qualification", e.qualification],
        ["Keywords", (e.keywords || []).join(", ")],
        ["Matching tags", ui.el("span", {}, (e.tags || []).map(function (t) { return ui.pill(t); }))],
        e.excludedBy && e.excludedBy.length ? ["Suppressed by exclusion", e.excludedBy.join(", ")] : null])
    }));
    if (e.side === "compliance") {
      var ms = data.mcrsOfEvent(e.id);
      var heads = ms.filter(function (m) { return m.head; });
      var shown = heads.slice(0, 30);
      var exp = {};
      var holder = ui.el("div", { class: "g-tablewrap" });
      function fitBadge(fit) {
        if (fit.verdict === "realign") return ui.badge("Fits " + (fit.bestAlt ? fit.bestAlt.id : "another event") + " better", "warn");
        if (fit.verdict === "weak") return ui.badge("Weak fit", "warn");
        return ui.badge("Good fit", "ok");
      }
      function drawMcrs() {
        holder.innerHTML = "";
        var t = ui.el("table", { class: "g-table" });
        t.appendChild(ui.el("tr", {}, [
          ui.el("th", {}, "Requirement"),
          ui.el("th", { style: "text-align:right" }, "Fit to this event"),
          ui.el("th", {}, "Assessment")]));
        shown.forEach(function (m) {
          var fit = ctx.engine.mcrFit(m);
          var open = !!exp[m.id];
          var row = ui.el("tr", { class: "click" }, [
            ui.el("td", {}, [ui.el("span", { class: "caret" + (open ? " open" : "") }),
            ui.el("span", { class: "g-mono g-muted" }, m.id + "  "), m.name]),
            ui.el("td", { class: "num" }, String(fit.parentPct)),
            ui.el("td", {}, fitBadge(fit))]);
          row.onclick = function () { exp[m.id] = !exp[m.id]; drawMcrs(); };
          t.appendChild(row);
          if (open) {
            var det = ui.el("div", { style: "padding:4px 0 6px 24px" });
            if (m.obligations && m.obligations.length) {
              det.appendChild(ui.el("div", { class: "g-label" }, "Obligations"));
              det.appendChild(ui.el("ul", { style: "margin:2px 0 8px;padding-left:18px" }, m.obligations.map(function (o) { return ui.el("li", {}, o); })));
            }
            if (m.prohibitions && m.prohibitions.length) {
              det.appendChild(ui.el("div", { class: "g-label" }, "Prohibitions"));
              det.appendChild(ui.el("ul", { style: "margin:2px 0 8px;padding-left:18px" }, m.prohibitions.map(function (o) { return ui.el("li", {}, o); })));
            }
            if (fit.bestAlt) {
              det.appendChild(ui.el("div", { style: "font-size:12.5px" }, [
                ui.el("span", { class: "g-label" }, "Best alternative event  "),
                ui.el("a", { href: "#/events/" + fit.bestAlt.id }, fit.bestAlt.name),
                ui.el("span", { class: "g-muted" }, "  scores " + fit.bestAltPct + " vs " + fit.parentPct + " here" +
                  (fit.verdict === "realign" ? ". Likely rewrite or realignment candidate; the requirement may span two risk event ideas." : "."))]));
            }
            det.appendChild(ui.el("div", { style: "margin-top:6px" }, ui.el("a", { href: "#/mcrlib/" + m.id }, "Open full record")));
            t.appendChild(ui.el("tr", {}, ui.el("td", { colspan: "3", style: "background:#fafbfc" }, det)));
          }
        });
        holder.appendChild(t);
      }
      drawMcrs();
      left.appendChild(ui.card({
        title: "MCRs under this event (" + ms.length + " total; top of the head set shown, expandable in place)",
        body: ui.el("div", {}, [
          ui.el("p", { class: "g-muted", style: "font-size:12.5px" }, "Fit measures how well each requirement sits inside this risk event on the same attribute rubric. A requirement that fits another event better is a rewrite or realignment candidate."),
          holder])
      }));
    }
    var right = ui.el("div");
    right.appendChild(ui.card({
      title: "Where it is confirmed (reverse view)",
      body: confirmed.length ? ui.table({
        cols: [
          { key: "rauId", label: "RAU", render: function (g) { var r = data.byId("raus", g.rauId); return ui.el("a", { href: "#/raus/" + g.rauId }, r ? r.id + " - " + r.name : g.rauId); } },
          { key: "score", label: "Score", num: true, sort: true },
          { key: "date", label: "Confirmed", render: function (g) { return ctx.fmt.date(g.date); } }
        ], rows: confirmed, page: 12
      }) : ui.empty("Not yet confirmed anywhere.")
    }));
    el.appendChild(ui.el("div", { class: "g-split" }, [left, right]));
  }

  /* ==SECTION:mcrlib== */
  function mcrlib(el, ctx) {
    var ui = ctx.ui, data = ctx.data;
    var all = data.all("mcrs");
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "MCR library"),
        ui.el("div", { class: "g-muted" }, "Major Compliance Requirements published from RRCM, read-only here. A head set carries most RCSA frequency; each requirement arrives aligned to a parent compliance risk event.")])));
    var fams = {};
    all.forEach(function (m) { fams[m.regFamily] = 1; });
    var body = ui.el("div"); el.appendChild(body);
    function draw() {
      body.innerHTML = "";
      var rows = all.filter(function (m) {
        if (MF.q && (m.id + " " + m.name).toLowerCase().indexOf(MF.q.toLowerCase()) < 0) return false;
        if (MF.fam && m.regFamily !== MF.fam) return false;
        if (MF.head === "head" && !m.head) return false;
        if (MF.head === "tail" && m.head) return false;
        if (MF.head === "rewrite" && ctx.engine.mcrFit(m).verdict === "good") return false;
        return true;
      });
      body.appendChild(ui.toolbar([
        ui.searchBox({ value: MF.q, placeholder: "Search 8,000 MCRs...", oninput: function (v) { MF.q = v; draw(); } }),
        ui.select({ label: "Family", value: MF.fam, onchange: function (v) { MF.fam = v; draw(); }, options: [{ value: "", label: "All families" }].concat(Object.keys(fams).sort().map(function (f) { return { value: f, label: f }; })) }),
        ui.select({ label: "Focus", value: MF.head, onchange: function (v) { MF.head = v; draw(); }, options: [{ value: "", label: "All" }, { value: "head", label: "Head (high frequency)" }, { value: "tail", label: "Long tail" }, { value: "rewrite", label: "Rewrite candidates (weak or misaligned fit)" }] }),
        ui.el("span", { class: "g-muted", style: "font-size:12px" }, ctx.fmt.num(rows.length) + " match")]));
      body.appendChild(ui.table({
        cols: [
          { key: "id", label: "MCR", render: function (m) { return ui.el("span", { class: "g-mono" }, m.id); } },
          { key: "name", label: "Requirement", sort: true },
          { key: "fam", label: "Family", render: function (m) { return m.regFamily; } },
          { key: "parent", label: "Parent risk event", render: function (m) { var e = data.byId("riskEvents", m.parentEventId); return e ? ui.el("a", { href: "#/events/" + e.id, onclick: function (ev) { ev.stopPropagation(); } }, e.name) : "-"; } },
          { key: "fit", label: "Fit", num: true, sort: true, sortVal: function (m) { return ctx.engine.mcrFit(m).parentPct; }, render: function (m) { var f = ctx.engine.mcrFit(m); return ui.el("span", {}, [String(f.parentPct) + " ", f.verdict !== "good" ? ui.badge(f.verdict === "realign" ? "review" : "weak", "warn") : null]); } },
          { key: "head", label: "Freq", render: function (m) { return m.head ? ui.badge("Head", "info") : ui.el("span", { class: "g-muted", style: "font-size:11px" }, "tail"); } }
        ], rows: rows, page: 25,
        onRow: function (m) { ctx.go("mcrlib/" + m.id); }
      }));
    }
    draw();
  }

  function mcrDetail(el, ctx, params) {
    var ui = ctx.ui, data = ctx.data;
    var m = data.byId("mcrs", params.id);
    if (!m) { el.appendChild(ui.empty("Unknown MCR")); return; }
    var parent = data.byId("riskEvents", m.parentEventId);
    var attachedIn = [];
    data.all("register").forEach(function (g) {
      if (g.mcrIds && g.mcrIds.indexOf(m.id) >= 0) attachedIn.push(g);
    });
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-muted", style: "font-size:12px;margin-bottom:2px" }, [ui.el("a", { href: "#/mcrlib" }, "MCR library"), " / " + m.id]),
        ui.el("div", { class: "g-row" }, [ui.el("span", { class: "g-h1", style: "font-size:17px" }, m.name), ui.el("span", { class: "g-mono g-muted" }, m.id)]),
        ui.el("div", { class: "g-muted" }, "Source: RRCM, published " + (m.publishedDate ? ctx.fmt.date(m.publishedDate) : "-") + ", read-only in the GRC")])));
    var left = ui.el("div");
    left.appendChild(ui.card({
      title: "Profile", body: ui.kv([
        ["Regulatory family", m.regFamily], ["Citation", m.citation], ["Regulator", m.regulator || "-"],
        ["Parent risk event", parent ? ui.el("a", { href: "#/events/" + parent.id }, parent.name) : m.parentEventId],
        ["Frequency class", m.head ? "Head (high RCSA frequency)" : "Long tail"],
        ["Summary", m.summary || "-"],
        ["Matching tags", ui.el("span", {}, (m.tags || []).map(function (t) { return ui.pill(t); }))]])
    }));
    if (m.obligations && m.obligations.length) {
      left.appendChild(ui.card({
        title: "Obligations", body: ui.el("ul", { style: "margin:0;padding-left:20px" }, m.obligations.map(function (o) { return ui.el("li", {}, o); }))
      }));
    }
    if (m.prohibitions && m.prohibitions.length) {
      left.appendChild(ui.card({
        title: "Prohibitions", body: ui.el("ul", { style: "margin:0;padding-left:20px" }, m.prohibitions.map(function (o) { return ui.el("li", {}, o); }))
      }));
    }
    var right = ui.el("div");
    var fit = ctx.engine.mcrFit(m);
    right.appendChild(ui.card({
      title: "Goodness of fit to its risk event",
      body: ui.el("div", {}, [
        ui.el("div", { class: "g-row", style: "margin-bottom:6px" }, [
          ui.el("span", { class: "g-score" }, [String(fit.parentPct), ui.el("i", {}, ui.el("b", { style: "width:" + fit.parentPct + "%" }))]),
          ui.el("span", {}, "fit to "), parent ? ui.el("a", { href: "#/events/" + parent.id }, parent.name) : null]),
        fit.bestAlt ? ui.el("div", { class: "g-row", style: "margin-bottom:8px" }, [
          ui.el("span", { class: "g-score" }, [String(fit.bestAltPct), ui.el("i", {}, ui.el("b", { style: "width:" + fit.bestAltPct + "%" }))]),
          ui.el("span", {}, "best alternative: "), ui.el("a", { href: "#/events/" + fit.bestAlt.id }, fit.bestAlt.name)]) : null,
        ui.el("p", { style: "margin:0", class: fit.verdict === "good" ? "g-muted" : "" },
          fit.verdict === "good" ? "This requirement sits well within its parent risk event." :
          fit.verdict === "realign" ? "This requirement scores higher against a different risk event. Rewrite or realignment candidate; it may span two risk event ideas." :
          "Weak fit to its parent event. Candidate for a rewrite that sharpens which risk event idea it belongs to.")])
    }));
    right.appendChild(ui.card({
      title: "Attached in RAU registers (" + attachedIn.length + ")",
      body: attachedIn.length ? ui.table({
        cols: [
          { key: "rauId", label: "RAU", render: function (g) { var r = data.byId("raus", g.rauId); return ui.el("a", { href: "#/raus/" + g.rauId }, r ? r.id + " - " + r.name : g.rauId); } },
          { key: "date", label: "Since", render: function (g) { return ctx.fmt.date(g.date); } }
        ], rows: attachedIn, page: 12
      }) : ui.empty("Not attached to any RAU register yet.")
    }));
    el.appendChild(ui.el("div", { class: "g-split" }, [left, right]));
  }

  /* ==SECTION:rubric== */
  function rubricPanel(el, ctx) {
    var ui = ctx.ui, eng = ctx.engine, data = ctx.data;
    var R = eng.rubric();
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "Applicability rubric"),
        ui.el("div", { class: "g-muted" }, "The standardized math: eight thematic categories, each scored 1 to 5 from attribute overlap, weighted, normalized to 100. Identical for every RAU. Distinct from the inherent risk rubric, which belongs to Capability 3.")])));
    var left = ui.el("div");
    left.appendChild(ui.card({
      title: "Categories and weights", body: ui.table({
        cols: [
          { key: "label", label: "Category" },
          { key: "key", label: "Attribute namespace", render: function (c) { return ui.el("span", { class: "g-mono" }, c.key + ":*"); } },
          { key: "weight", label: "Weight", num: true }
        ], rows: R.categories, page: 10
      })
    }));
    left.appendChild(ui.card({
      title: "Scoring anchors", body: ui.kv([
        ["5", "Three or more shared attributes in the category"],
        ["4", "Two shared, or the candidate's single attribute matches"],
        ["3", "Partial overlap, or the candidate is silent on the theme"],
        ["1", "The candidate specifies attributes and none match"],
        ["Bands", "Likely at or above " + R.bands.likely + "; Possible " + R.bands.possible + " to " + (R.bands.likely - 1) + "; Unlikely below " + R.bands.possible],
        ["Exclusions", "A confirmed does-NOT-do answer suppresses matching candidates entirely (shown, reversible)"]])
    }));
    var right = ui.el("div");
    right.appendChild(ui.card({
      title: "Disambiguation question bank",
      body: ui.el("div", {}, (R.questions || []).map(function (q) {
        return ui.el("div", { class: "g-row", style: "padding:4px 0;border-bottom:1px solid var(--g-line-soft)" }, [
          ui.el("span", { class: "g-mono g-muted", style: "width:36px" }, q.id),
          ui.el("span", { style: "flex:1;min-width:200px" }, q.text),
          ui.pill(q.tag)]);
      }))
    }));
    /* worked example */
    var r = data.all("raus").filter(function (x) { return x.riskIdStatus === "complete"; })[0];
    if (r) {
      var evs = eng.candidates(r).scored;
      if (evs.length) {
        var s = evs[0];
        right.appendChild(ui.card({
          title: "Worked example: " + r.id + " vs \"" + s.ev.name + "\" = " + s.pct,
          body: ctx.charts.scoreBars({ categories: R.categories, cats: s.cats })
        }));
      }
    }
    el.appendChild(ui.el("div", { class: "g-split" }, [left, right]));
  }

  GRC.register({
    id: "libraries", version: "1.2.0", tab: "RCSA",
    caps: { "*": { primary: [2] } },
    rail: [
      { label: "Risk events", route: "events", order: 60 },
      { label: "MCR library", route: "mcrlib", order: 70 },
      { label: "Applicability rubric", route: "rubric", order: 80 }
    ],
    routes: { "events": events, "events/:id": eventDetail, "mcrlib": mcrlib, "mcrlib/:id": mcrDetail, "rubric": rubricPanel }
  });
})();

<!-- ==GRC-FILE-END== -->

<!-- ==GRC-FILE-BEGIN path=modules/mywork.js bytes=11628 sha256=ee1db30ba49fc3cd5cded440c80dd4347be7b2b5ec270aa70674c0ee4bce8eb4== -->
/* GRC modules/mywork.js v1.2.0 2026-08-23 */
/* My Work: role-aware queues. Switch "View as" in the banner to change hats. */
(function () {
  "use strict";
  function mywork(el, ctx) {
    var ui = ctx.ui, data = ctx.data, fmt = ctx.fmt;
    var role = ctx.state.get("role");
    el.appendChild(ui.el("div", { class: "g-page-head" }, [
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "My Work"),
        ui.el("div", { class: "g-muted" }, "Queues for the role selected in the banner: " + role + ". Showing a sample set for this role.")]),
      ui.el("div", { class: "sp" }),
      ui.el("button", { class: "g-btn", onclick: function () { if (confirm("Reset all in-session changes?")) GRC.resetData(); } }, "Reset demo data")]));

    /* ==SECTION:governance== */
    if (role === "RCSA RAU Governance") {
      var uq = data.all("requests").filter(function (q) { return q.stage === "uniqueness-review"; });
      var gv = data.all("requests").filter(function (q) { return q.stage === "pending-governance"; });
      el.appendChild(ui.card({
        title: "Uniqueness reviews awaiting decision (" + uq.length + ")",
        body: uq.length ? ui.table({
          cols: [
            { key: "id", label: "Request", render: function (q) { return ui.el("span", { class: "g-mono" }, q.id); } },
            { key: "proposedName", label: "Name" },
            { key: "rec", label: "Assistant recommends", render: function (q) { var r = q.uniqueness && q.uniqueness.recommendation; return r ? ui.badge(r === "advance" ? "Advance" : r === "return-for-refinement" ? "Return" : "Judgment", r === "advance" ? "ok" : r === "return-for-refinement" ? "bad" : "warn") : "-"; } },
            { key: "submitted", label: "Waiting since", render: function (q) { return fmt.date(q.submitted); } }
          ], rows: uq, onRow: function (q) { ctx.go("pipeline/" + q.id); }
        }) : ui.empty("Queue clear.")
      }));
      el.appendChild(ui.card({
        title: "Governance approvals (" + gv.length + ")",
        body: gv.length ? ui.table({
          cols: [
            { key: "id", label: "Request", render: function (q) { return ui.el("span", { class: "g-mono" }, q.id); } },
            { key: "type", label: "Type", render: function (q) { return ui.badge(q.type.toUpperCase(), q.type === "new" ? "info" : "warn"); } },
            { key: "proposedName", label: "Name" },
            { key: "note", label: "Status", render: function (q) { return ui.el("span", { class: "g-muted", style: "font-size:12px" }, q.note || "-"); } }
          ], rows: gv, onRow: function (q) { ctx.go("pipeline/" + q.id); }
        }) : ui.empty("Queue clear.")
      }));
      return;
    }

    /* ==SECTION:owner== */
    if (role === "RAU Owner" || role === "RAU Owner Delegate" || role === "BCM Contact") {
      /* representative slice: first RAUs with open risk-id work */
      var todo = data.all("raus").filter(function (r) { return r.riskIdStatus !== "complete"; }).slice(0, 8);
      el.appendChild(ui.card({
        title: "Risk identification to complete",
        body: todo.length ? ui.table({
          cols: [
            { key: "id", label: "RAU", render: function (r) { return ui.el("span", { class: "g-mono" }, r.id); } },
            { key: "name", label: "Name" },
            { key: "riskIdStatus", label: "Status", render: function (r) { return ui.badge(r.riskIdStatus.replace("-", " "), fmt.riskIdKind(r.riskIdStatus)); } },
            { key: "go", label: "", render: function () { return ui.el("button", { class: "g-btn sm" }, "Open workbench"); } }
          ], rows: todo, onRow: function (r) { ctx.go("riskid/" + r.id); }
        }) : ui.empty("All caught up.")
      }));
      /* inherent ratings to document (Capability 3) */
      var rateTodo = [];
      for (var ri2 = 0; ri2 < data.all("raus").length && rateTodo.length < 8; ri2++) {
        var rr2 = data.all("raus")[ri2];
        var roll2 = ctx.engine.inherent.rollup(rr2);
        if (roll2.confirmed && roll2.rated < roll2.confirmed) rateTodo.push({ r: rr2, roll: roll2 });
      }
      el.appendChild(ui.card({
        title: "Inherent ratings to document",
        body: rateTodo.length ? ui.table({
          cols: [
            { key: "id", label: "RAU", render: function (x) { return ui.el("span", { class: "g-mono" }, x.r.id); } },
            { key: "name", label: "Name", render: function (x) { return x.r.name; } },
            { key: "gap", label: "Unrated instances", num: true, render: function (x) { return String(x.roll.confirmed - x.roll.rated); } },
            { key: "go", label: "", render: function () { return ui.el("button", { class: "g-btn sm" }, "Open worksheet"); } }
          ], rows: rateTodo, onRow: function (x) { ctx.go("inherent/" + x.r.id); }
        }) : ui.empty("Every confirmed instance on your RAUs is rated.")
      }));
      /* handoff confirmations */
      var pend = [];
      data.all("raus").forEach(function (r) {
        (r.handoffs || []).forEach(function (h) {
          if (h.dir === "in" && !h.conf && pend.length < 8) pend.push({ r: r, h: h });
        });
      });
      var hb = ui.el("div");
      if (!pend.length) hb.appendChild(ui.empty("No handoffs awaiting confirmation."));
      pend.forEach(function (x) {
        var cp = data.byId("raus", x.h.cp);
        hb.appendChild(ui.el("div", { class: "g-row", style: "padding:6px 0;border-bottom:1px solid var(--g-line-soft)" }, [
          ui.el("span", { style: "flex:1;min-width:260px" }, [
            ui.el("a", { href: "#/raus/" + x.h.cp }, cp ? cp.id + " " + cp.name : x.h.cp),
            ui.el("span", { class: "g-muted" }, " declared it provides "), ui.el("b", {}, x.h.art),
            ui.el("span", { class: "g-muted" }, " to "), ui.el("a", { href: "#/raus/" + x.r.id }, x.r.id)]),
          ui.el("button", { class: "g-btn sm g-btn--primary", onclick: function (e) {
            x.h.conf = true;
            GRC.traceAction(1, "Confirming a handoff");
            ui.toast("Handoff confirmed. The dependency network updates for both RAUs.");
            e.target.disabled = true; e.target.textContent = "Confirmed";
          } }, "Confirm handoff")]));
      });
      el.appendChild(ui.card({ title: "Inbound handoffs to confirm (trusted at submission, confirmed after)", body: hb }));
      /* challenges awaiting the owner's answer */
      var openCh = data.all("challenges").filter(function (c) { return c.state === "open"; }).slice(0, 8);
      el.appendChild(ui.card({
        title: "Challenges awaiting your answer (" + openCh.length + " shown)",
        body: openCh.length ? ui.table({
          cols: [
            { key: "id", label: "ID", render: function (c) { return ui.el("span", { class: "g-mono" }, c.id); } },
            { key: "rau", label: "RAU", render: function (c) { var r2 = data.byId("raus", c.rauId); return r2 ? r2.id + " " + r2.name : c.rauId; } },
            { key: "what", label: "The challenge", render: function (c) { return ui.el("span", { style: "font-size:12.5px" }, c.what.slice(0, 90)); } },
            { key: "by", label: "By", render: function (c) { return ui.el("span", { class: "g-muted", style: "font-size:12px" }, c.by); } },
            { key: "go", label: "", render: function () { return ui.el("button", { class: "g-btn sm g-btn--primary" }, "Answer"); } }
          ], rows: openCh, onRow: function (c) { ctx.go("rcsa/" + c.rauId); }
        }) : ui.empty("No open challenges on your RAUs.")
      }));
      /* affirmations due or overdue */
      var affDue = [];
      for (var ai = 0; ai < data.all("raus").length && affDue.length < 8; ai++) {
        var ra = data.all("raus")[ai];
        var st2 = ctx.engine.rcsa.affState(ra);
        if (st2.state === "due" || st2.state === "overdue") affDue.push({ r: ra, st: st2 });
      }
      el.appendChild(ui.card({
        title: "Annual affirmations due",
        body: affDue.length ? ui.table({
          cols: [
            { key: "id", label: "RAU", render: function (x) { return ui.el("span", { class: "g-mono" }, x.r.id); } },
            { key: "name", label: "Name", render: function (x) { return x.r.name; } },
            { key: "st", label: "State", render: function (x) { return ui.badge(x.st.state, x.st.state === "overdue" ? "bad" : "warn"); } },
            { key: "d", label: "Days since affirmed", num: true, render: function (x) { return String(x.st.days); } },
            { key: "go", label: "", render: function () { return ui.el("button", { class: "g-btn sm" }, "Open workspace"); } }
          ], rows: affDue, onRow: function (x) { ctx.go("rcsa/" + x.r.id); }
        }) : ui.empty("Nothing due in your sample.")
      }));
      return;
    }

    /* ==SECTION:2lod== */
    /* ORBO and BACO: the promised challenge workflow is real now. */
    var side = role.indexOf("ORBO") === 0 ? "operational" : "compliance";
    var att = ctx.engine.rcsa.attention(side).slice(0, 10);
    el.appendChild(ui.card({
      title: "Attention: the non-standard on your side (" + att.length + " of the ranked list)",
      body: ui.el("div", {}, [
        ui.el("p", { class: "g-muted", style: "font-size:12.5px" }, "The system points you at peer outliers, mismatches, gaps, and aging items so settled problems stay settled. Challenge anything that does not hold up, from any record, anytime."),
        att.length ? ui.table({
          cols: [
            { key: "k", label: "Signal", render: function (x) { return ui.badge(x.kind, x.kind === "outlier" || x.kind === "exp-gap" ? "bad" : "warn"); } },
            { key: "rau", label: "RAU", render: function (x) { return ui.el("span", {}, [ui.el("span", { class: "g-mono g-muted" }, x.rau.id + " "), x.rau.name]); } },
            { key: "why", label: "Why", render: function (x) { return ui.el("span", { style: "font-size:12.5px" }, x.reason); } },
            { key: "go", label: "", render: function () { return ui.el("button", { class: "g-btn sm g-btn--primary" }, "Investigate"); } }
          ], rows: att, onRow: function (x) { ctx.go("rcsa/" + x.rau.id); }
        }) : ui.empty("Nothing non-standard on your side right now."),
        ui.el("div", { style: "margin-top:8px" }, ui.el("button", { class: "g-btn sm", onclick: function () { ctx.go("rcsa-attention"); } }, "Open the full attention view"))])
    }));
    var mine = data.all("challenges").filter(function (c) { return c.by === role && (c.state === "open" || c.state === "responded"); });
    el.appendChild(ui.card({
      title: "Your challenges in flight (" + mine.length + ")",
      body: mine.length ? ui.table({
        cols: [
          { key: "id", label: "ID", render: function (c) { return ui.el("span", { class: "g-mono" }, c.id); } },
          { key: "rau", label: "RAU", render: function (c) { var r2 = data.byId("raus", c.rauId); return r2 ? r2.id + " " + r2.name : c.rauId; } },
          { key: "what", label: "What you flagged", render: function (c) { return ui.el("span", { style: "font-size:12.5px" }, c.what.slice(0, 90)); } },
          { key: "state", label: "State", render: function (c) { return ui.badge(c.state, c.state === "open" ? "bad" : "warn"); } },
          { key: "go", label: "", render: function (c) { return ui.el("button", { class: "g-btn sm" }, c.state === "responded" ? "Resolve" : "Open"); } }
        ], rows: mine, page: 8, onRow: function (c) { ctx.go("rcsa/" + c.rauId); }
      }) : ui.empty("Nothing in flight. File one from any record's Challenge button.")
    }));
  }

  GRC.register({
    id: "mywork", version: "1.2.0", tab: "RCSA",
    caps: { "mywork": { primary: [1, 2, 3, 5] } },
    routes: { "mywork": mywork }
  });
})();

<!-- ==GRC-FILE-END== -->

<!-- ==GRC-FILE-BEGIN path=modules/demo.js bytes=35187 sha256=10322f35a8e40812dfa07928f5308e7ff901b7ae393fbe45a19e36cac71991fc== -->
/* GRC modules/demo.js v2.4.0 2026-08-23 */
/* Present: a demo picker. One full walkthrough, one order-of-operations
   story (the birth of a RAU), and one demo per role in the View-as picker,
   each following the workflow that role actually runs day to day. */
(function () {
  "use strict";

  /* ==SECTION:lookups== */
  /* All demos find their records at runtime so they survive data swaps. */
  function finders(ctx) {
    var data = ctx.data;
    function byStage(stage) {
      return data.all("requests").filter(function (q) { return q.stage === stage; })[0] || null;
    }
    var f = {};
    f.story = data.all("raus").filter(function (r) { return r.name === "Escrow Administration"; })[0] || data.all("raus")[0];
    f.uq = data.all("requests").filter(function (q) { return q.stage === "uniqueness-review" && q.uniqueness; })[0] || byStage("uniqueness-review");
    f.mapping = byStage("process-mapping");
    f.standards = byStage("standards-check");
    f.gov = byStage("pending-governance");
    f.meta = byStage("metadata-creation");
    f.returned = byStage("returned-for-refinement");
    f.reshape = data.all("requests").filter(function (q) { return q.type !== "new" && q.impact; })[0] || null;
    var bestOp = -1, bestCo = -1;
    f.opEvent = null; f.coEvent = null;
    data.all("riskEvents").forEach(function (e) {
      var n = data.regOfEvent(e.id).length;
      if (e.side === "operational" && n > bestOp) { bestOp = n; f.opEvent = e; }
      if (e.side === "compliance" && n > bestCo) { bestCo = n; f.coEvent = e; }
    });
    f.headMcr = f.coEvent ? (data.mcrsOfEvent(f.coEvent.id)[0] || null) : null;
    f.storyGap = null;
    var sConf = data.regOfRau(f.story.id).filter(function (g2) { return g2.status === "confirmed"; });
    sConf.forEach(function (g2) {
      if (!f.storyGap && !data.controlsOfInstance(f.story.id, g2.eventId).length) f.storyGap = g2;
    });
    if (!f.storyGap) f.storyGap = sConf[0] || null;
    return f;
  }

  /* ==SECTION:walkthrough== */
  function walkthroughScenes(ctx) {
    var g = finders(ctx);
    var s = [
      { route: "home", title: "One platform, ten capabilities", text: "This is a clickable design proposal for the future GRC. The map shows all ten capabilities and how they feed each other; this release builds capabilities 1 through 5 end to end. Everything you are about to see runs on data shaped like the real inventory." },
      { route: "home", title: "The lens and the trace", text: "Click capability boxes on this map to isolate a scope: pick 1 and 2 and everything not supporting them grays out; add 3 and the picture grows. As you move through the tool, the strip under the tabs names the capability behind every screen, and key actions call out which capability they belong to. What is grayed will not work until its box is built." },
      { route: "raus", title: "Capability 1: the RAU inventory", text: "A RAU is the intersection of a business and a service, created at the SubLOB level. Filter the inventory by line of business, category, or risk identification status. Every column here is a real attribute the platform maintains." },
      { route: "raus/" + g.story.id, title: "One RAU's whole story", text: "Demographics describe the unit; attributes OBLIGATE it: they drive applicability, signal matching, and scoping. Check the Metadata survey tab: every answer shows where it came from: a map step, from services, or asked directly. The Process map tab shows the handoffs that wire this RAU to its counterparties." },
      { route: "pipeline", title: "The inventory changes through one pipeline", text: "New RAU, merge, split, retire: every change request moves through the same governed stages. About ten are in flight at any time. Merges and retirements show a live impact preview: how many risks and handoffs move." }
    ];
    if (g.uq) s.push({
      route: "pipeline/" + g.uq.id, state: { role: "RCSA RAU Governance" },
      title: "The uniqueness gate: AI analyzes, humans decide",
      text: "The assistant compared this request against every RAU in the same line of business: 82% overlap with an existing unit, reasons listed, category checked. The RCSA RAU Governance team (your current View-as role) can advance it, return it, or decline with a redirect to the overlapping RAU's owner. No two RAUs get to claim the same work."
    });
    if (g.mapping) s.push({
      route: "pipeline/" + g.mapping.id + "/map",
      title: "Process mapping with a coach",
      text: "Each intake bullet becomes a phase; the requester expands it 2-10 steps with the assistant coaching on what comes next, where the handoffs are, and what happens on failure. The standards checklist gates progression: no expert needed, and no map leaves here below standard. Try adding a step."
    });
    if (g.meta) s.push({
      route: "pipeline/" + g.meta.id + "/survey",
      title: "Metadata: the assistant fills the survey",
      text: "After governance approval the assistant completes the standardized survey from the process map and services, asking only what it cannot conclude. Notice most questions confirm what the RAU does NOT do; absence never shows on a map, and exclusions are what scope out whole slices of the regulatory universe. Answer the open questions and activate the RAU."
    });
    s.push(
      {
        route: "riskid/" + g.story.id, title: "Capability 2: the applicability workbench",
        text: "The engine scores the full risk event inventory, and the MCRs beneath the compliance events, against this RAU's metadata using one standardized rubric. Likely candidates confirm in a click; the exclusions panel shows what the survey suppressed; the ambiguous middle is where the intelligence earns its keep."
      },
      {
        route: "riskid/" + g.story.id, title: "Resolve: out of the middle",
        text: "Open Resolve on a middle-band item. The system asks one or two targeted questions; your answer updates the RAU's metadata, so EVERY candidate rescores consistently. Watch the score jump out of the middle. Expand 'Why this score' to see the 8-category rubric breakdown behind any number."
      },
      {
        route: "rubric", title: "Standardized math you can point at",
        text: "Eight thematic categories, 1-5 anchors, fixed weights, published bands, identical for every RAU. Applicability stops being hundreds of opinions and becomes one defensible calculation plus documented human judgment."
      },
      {
        route: "inherent/" + g.story.id, title: "Capability 3: evidence-anchored inherent ratings",
        text: "Every confirmed instance gets likelihood times impact on anchored scales. The assistant suggests each level from platform evidence: volume, losses, attached MCRs, handoff dependencies, each chip naming its source. Accepting is one click; overriding any level demands written rationale. One instance here is still unrated: open it and rate it live."
      },
      {
        route: "inherent-rubric", title: "The inherent rubric: anchors, not opinions",
        text: "Likelihood is anchored to frequency; impact is the worst credible outcome on four fact-anchored lenses. Reputational is deliberately not a scored dimension: it derives from customer reach, regulatory severity, and visibility. Subjectivity survives only in documented overrides, and the override rate itself becomes a program signal."
      },
      {
        route: "attach/" + g.story.id + "/" + (g.storyGap ? g.storyGap.eventId : ""), title: "Capability 4: mitigation in three tiers",
        text: "This instance has no controls yet. The system recommends in tiers: the EXPECTED control for the situation first, then shareable controls already mitigating this event on peer RAUs ranked by attach rate, then a drafted skeleton the business can document. Attach one and watch coverage recompute."
      },
      {
        route: "controls-key", title: "Key status: derived, not declared",
        text: "Four transparent rules derive key status from the live landscape: sole mitigant on a High or Critical instance, expected for a situation, concentration, or mitigating a Critical instance. The two tables here are the argument: controls declared key that derive non-key, and controls carrying real weight that nobody ever ticked. A checkbox goes stale; a rule recomputes."
      },
      {
        route: "controls-coverage", title: "Coverage gaps, computed live",
        text: "The loudest gap is an expected control that is missing where its situation is live. Below it: High and Critical instances with no control at all, and instances riding on a single point of mitigation. Fixing a gap here updates every view immediately, because it is all one dataset."
      },
      {
        route: "rcsa/" + g.story.id, title: "Capability 5: the living RCSA",
        text: "No staged cycle, no tollgates. Each line reads inherent times control environment into a residual band via the knockdown rule. Changes queue for adoption, the second line challenges anything anytime (one is open on this RAU now), and the owner signs one annual affirmation when the record is clean."
      },
      {
        route: "rcsa", title: "The affirmation board and the attention view",
        text: "The whole bank: affirmation states, residual profiles, direction since the last signature. Behind the second tab, the 2LOD attention view ranks the non-standard, so ORBO and BACO investigate outliers and gaps instead of relitigating settled problems."
      },
      {
        route: "rcsa-attention", title: "My list: a cart for work",
        text: "See the + My list buttons on these rows? They are everywhere work surfaces: gaps, unrated instances, challenges, affirmations. Collect as you browse, exactly like a shopping cart, then open My list at the bottom right and Work through it: the tool walks you item by item and notices when something looks finished. Built for people who do not live in this tool."
      },
      {
        route: "mcrlib", title: "The MCR library, published from RRCM",
        text: "Major Compliance Requirements arrive read-only from RRCM, each aligned upstream to a parent compliance risk event. A head set carries most RCSA frequency, and the library reflects that shape. Search anything."
      },
      {
        route: "home", title: "And this is five capabilities of ten",
        text: "Signals will feed changes into steps 1 and 2. Testing, monitoring, and policy governance stack on the same foundation you just walked. The whole RCSA spine, intake to affirmation, is now clickable end to end. The release number in the banner identifies this build; quote it in your feedback."
      });
    return s;
  }

  /* ==SECTION:birth== */
  /* The order of operations for a new RAU, one gate per scene:
     intake -> uniqueness -> mapping -> standards -> governance (roles) ->
     metadata -> active -> risk identification. */
  function birthScenes(ctx) {
    var g = finders(ctx);
    var s = [];
    s.push({
      route: "pipeline/new", state: { role: "RAU Owner Delegate" },
      title: "Intake: the only front door",
      text: "Every RAU is born here, usually raised by the future owner, a delegate, or the BCM team (you are viewing as a delegate). The requester places it in the hierarchy (LOB, then the SubLOB where RAUs live), picks a category, selects services from the common catalog, and lists the high-level steps. Nothing enters the inventory any other way."
    });
    if (g.uq) s.push({
      route: "pipeline/" + g.uq.id, state: { role: "RCSA RAU Governance" },
      title: "Uniqueness review: the duplicate gate",
      text: "Before anything else, the assistant compares the intake against every RAU in the same line of business and checks the category. This one overlaps 82% with an existing unit. RCSA RAU Governance (your role now) holds the decision: advance, return for refinement, or decline and redirect the requester to the overlapping RAU's owner. Two RAUs never get to claim the same work."
    });
    if (g.mapping) s.push({
      route: "pipeline/" + g.mapping.id + "/map",
      title: "Process mapping: bullets become a map",
      text: "Past the gate, each intake bullet becomes a phase and the requester expands it into 2 to 10 real steps with the assistant coaching. Handoffs are first-class: each names the counterparty RAU and what moves between them, trusted at submission and confirmed by that counterparty later. The diagram at the top draws itself as the map grows."
    });
    s.push({
      route: g.standards ? "pipeline/" + g.standards.id + "/map" : (g.mapping ? "pipeline/" + g.mapping.id + "/map" : "pipeline"),
      title: "Standards check: no expert required",
      text: "The assistant lints the finished map against the process-mapping standards: enough depth per phase, a decision point, failure paths, handoff counterparties named. Every check must pass before the request can move to governance. The standard is enforced by the tool, not by whoever happened to review it."
    });
    if (g.gov) s.push({
      route: "pipeline/" + g.gov.id, state: { role: "RCSA RAU Governance" },
      title: "Governance approval: the RAU is finalized",
      text: "With standards passed, RCSA RAU Governance approves. Approval does three things at once: it finalizes the RAU with its completed process map, assigns the five roles (RAU Owner, Owner Delegate, BCM Contact, ORBO, BACO), and opens the metadata survey. Roles exist from day one; no orphan RAUs."
    });
    if (g.meta) s.push({
      route: "pipeline/" + g.meta.id + "/survey",
      title: "Metadata: the survey writes itself, mostly",
      text: "The assistant completes the standardized survey from the process map and selected services, and every answer carries provenance: which map step or service it came from. It asks the owner team only what it cannot conclude. Most questions confirm what the RAU does NOT do; absence never shows on a map, and exclusions scope out whole slices of the risk universe."
    });
    s.push({
      route: "raus/" + g.story.id,
      title: "Active: a profile, not a form",
      text: "This is what the pipeline produces: an active RAU with demographics that describe it, attributes that obligate it, the process map as an artifact, and handoffs wiring it to its counterparties. From here the profile is maintained, audited for staleness, and consumed by every capability downstream."
    });
    s.push({
      route: "riskid/" + g.story.id,
      title: "And straight into risk identification",
      text: "Activation hands capability 1 to capability 2. The engine stack-ranks all 90 risk events, and the MCRs beneath the compliance events, against the metadata that was just created. The owner team takes the first pass. That is the order of operations: intake, uniqueness, mapping, standards, governance, metadata, active, then the risks."
    });
    return s;
  }

  /* ==SECTION:money== */
  /* The whole spine on one instance: confirm, rate, mitigate, residual,
     challenge, answer, affirm. Capabilities 1 through 5 in one sitting. */
  function moneyScenes(ctx) {
    var g = finders(ctx);
    var gapEv = g.storyGap ? g.storyGap.eventId : "";
    return [
      { route: "riskid/" + g.story.id, state: { role: "RAU Owner" }, title: "A risk instance is born", text: "Everything downstream hangs off one record: a confirmed risk instance, RAU times event, created here on the workbench by the front line. This RAU's register is mid-flight; the dispositioned table below is the evidence trail every later capability builds on." },
      { route: "inherent/" + g.story.id, title: "Rate it from evidence", text: "One instance is still unrated. Open it: every level arrives suggested from platform data with provenance chips. Accept in one click, or override with rationale. Without this rating, residual cannot compute, and the affirmation gate will say so." },
      { route: "attach/" + g.story.id + "/" + gapEv, title: "Mitigate it in three tiers", text: "The same instance has no controls. Attach the expected control if one applies, take a shareable match ranked by attach rate, or draft a skeleton and document it. Derived key status and coverage recompute the moment you act." },
      { route: "rcsa/" + g.story.id, title: "Residual falls out of the math", text: "The assessment line reads inherent band times control environment strength: Strong knocks it down two bands, Adequate one, Weak none. Notice the pending changes card: everything you just did queued on the RAU for adoption. This is the living record." },
      { route: "rcsa/" + g.story.id, state: { role: "BACO (Compliance Risk)" }, title: "Challenge, anytime, no tollgate", text: "You are now compliance second line. A challenge is already open on the Reg X rating override, and every line has a Challenge button: I think this thing is wrong, here is what it should be. No cycle stage, no gate; the record is always challengeable." },
      { route: "rcsa/" + g.story.id, state: { role: "RAU Owner" }, title: "Answer as the owner", text: "Back in the owner's chair: respond to the open challenge (agree and change, or explain why it stands), then the challenger upholds or withdraws. Adopt the pending changes while you are here. The affirmation gate below shows exactly what still blocks the signature." },
      { route: "rcsa/" + g.story.id, title: "Sign the annual affirmation", text: "With every instance rated, changes adopted, and challenges resolved, the owner signs. The snapshot is stored, direction resets, and the record keeps living. No second-line tollgate; challenge was continuous the whole way." },
      { route: "rcsa", title: "The whole bank on one board", text: "Every RAU with confirmed risks, its affirmation state, residual profile, and direction since the last signature. Overdue and change-pending units surface themselves. That is one risk, front to back, and the machinery that keeps 850 RAUs honest." }
    ];
  }

  /* ==SECTION:roles== */
  function ownerScenes(ctx) {
    var g = finders(ctx);
    return [
      { route: "mywork", state: { role: "RAU Owner" }, title: "The owner's queue", text: "You own the unit, so you own its record. My Work shows what needs you: risk identification still open on your RAUs, and inbound handoffs other RAUs declared that you must confirm. The banner now views the tool as a RAU Owner." },
      { route: "raus/" + g.story.id, title: "Your RAU, your accountabilities", text: "The profile is the owner's contract with the platform. Demographics say what the unit is; attributes obligate it downstream; the roles panel names you and your delegate, BCM, ORBO, and BACO. Stale profiles surface in quality views, so keeping this current is part of the job." },
      { route: "riskid/" + g.story.id, title: "First pass belongs to the front line", text: "The owner team decides which risks apply; you cannot lean on ORBO or BACO for the first pass. The engine stack-ranks every candidate against your metadata: confirm the likely, dismiss the unlikely, and work the ambiguous middle." },
      { route: "riskid/" + g.story.id, title: "Resolve, do not guess", text: "For a middle-band candidate, open Resolve. The system asks one or two targeted questions; your answer updates the RAU's metadata, so every candidate rescores consistently. If you mis-click a decision, Reopen on the dispositioned table takes it back." },
      { route: "inherent/" + g.story.id, title: "Rate what you confirmed", text: "Confirmed instances move here for inherent rating. The assistant proposes every level with evidence chips naming their sources; you accept in one click or override with rationale. One instance on this RAU is still waiting for you." },
      { route: "mywork", title: "Confirm what your counterparties declared", text: "Handoffs are trusted at submission and confirmed after. When another RAU declares it hands something to yours, it lands here for your confirmation, and the dependency network updates for both sides. Your ratings queue, open challenges, and affirmations due sit here too." },
      { route: "rcsa/" + g.story.id, title: "Answer challenges, sign once a year", text: "The second line challenges your records anytime; you respond here, they resolve. Changes from every capability queue for your adoption, and when the record is clean you sign the annual affirmation. No tollgate, no re-typing: the evidence you built all year IS the assessment." }
    ];
  }

  function delegateScenes(ctx) {
    var g = finders(ctx);
    var s = [
      { route: "mywork", state: { role: "RAU Owner Delegate" }, title: "The delegate runs the day to day", text: "The delegate works the same queues as the owner: open risk identification and handoff confirmations. The owner stays accountable; you keep it moving. The banner now views the tool as the delegate." },
      { route: "pipeline/new", title: "Delegates raise the intakes", text: "New RAU requests are typically drafted by the future owner, a delegate, or BCM. The wizard saves a draft as you type, so a half-finished intake survives navigation. The assistant will not let it through without placement, three high-level steps, and services from the catalog." }
    ];
    if (g.meta) s.push({ route: "pipeline/" + g.meta.id + "/survey", title: "Answer what the assistant cannot conclude", text: "During metadata creation the assistant fills the survey from the map and services, then routes the remainder to the owner team. Answering the open questions, most of them confirming what the unit does NOT do, is delegate work with owner sign-off." });
    s.push(
      { route: "raus-quality", title: "Housekeeping is visible", text: "Stale profiles and risk identification that never started surface here automatically. The delegate sweeps this list so the owner never hears about it from monitoring later." },
      { route: "raus", title: "Keep your branch of the tree tidy", text: "The directory's hierarchy view now honors the same filters as the flat list: search a name and the matching branches expand by themselves. Useful when your owner's units are spread across a SubLOB." }
    );
    return s;
  }

  function bcmScenes(ctx) {
    var g = finders(ctx);
    var s = [
      { route: "mywork", state: { role: "BCM Contact" }, title: "BCM shepherds the business", text: "Business Control Management works the same operational queues as the owner team, but across many RAUs at once. The banner now views the tool as a BCM Contact." },
      { route: "pipeline", title: "The whole board, not one request", text: "BCM watches every change request its business has in flight: new units, mergers, splits, retirements, each at a named stage of the same governed pipeline. About ten at a time is normal." },
      { route: "pipeline/new", title: "Raising a request for the business", text: "BCM often files the intake on behalf of the future owner. Placement, category, services, high-level steps; the assistant analyzes uniqueness on submit and the draft autosaves while you gather details." }
    ];
    s.push({ route: "controls-coverage", title: "Sweep the control gaps for the business", text: "BCM watches coverage the way it watches the pipeline: expected controls missing where their situation is live, High and Critical instances with nothing attached, and single points of mitigation. Each row opens the attach flow; the quick Attach fixes an expected gap in place." });
    if (g.returned) s.push({ route: "pipeline/" + g.returned.id, title: "Rework the returns", text: "Governance returned this one with comments. BCM helps the requester establish differentiation from the overlapping unit, then resubmits; it re-enters uniqueness review, not the back of the line." });
    if (g.mapping) s.push({ route: "pipeline/" + g.mapping.id + "/map", title: "Coach the map to standard", text: "Requesters know their process; BCM knows the standards. The builder's checklist shows exactly what is missing before governance will look at it, so BCM coaches to the checklist instead of guessing." });
    if (g.reshape) s.push({ route: "pipeline/" + g.reshape.id, title: "Reshaping the inventory has a preview", text: "Mergers and retirements show a live impact preview computed from real links: how many confirmed risks and handoffs move if this is approved. BCM uses it to brief the business before governance rules." });
    return s;
  }

  function orboScenes(ctx) {
    var g = finders(ctx);
    var s = [
      { route: "mywork", state: { role: "ORBO (Operational Risk)" }, title: "The 2LOD desk is live now", text: "ORBO's queue is real: the attention list ranks the non-standard on the operational side, and your challenges in flight sit beneath it. The banner now views the tool as ORBO." },
      { route: "rcsa-attention", title: "Investigate the non-standard, skip the settled", text: "Peer outliers, applicability-versus-band mismatches, expected-control gaps, judgment-dense RAUs, aging changes, and open challenges, ranked with the reason each one is here. Mark an item reviewed and it stays gone. You never relitigate a settled problem." },
      { route: "rcsa/" + g.story.id, title: "Read a whole RAU in one table", text: "Every line: applicability, inherent band, control environment with its why, residual out of the knockdown. The CHANGED chips mark what moved since the owner last affirmed. This is what you investigate before deciding whether anything deserves a challenge." },
      { route: "rcsa/" + g.story.id, title: "File it from the record itself", text: "Every line, rating, and control carries a Challenge button: what looks wrong, what it should be, filed as you, routed to the owner. This RAU already carries an upheld ORBO challenge in its log; the mechanism you are looking at is how it got there." }
    ];
    if (g.opEvent) s.push({ route: "events/" + g.opEvent.id, title: "Reverse view: one event across the bank", text: "The busiest operational event in the register, with every confirming RAU and score. Concentration and out-of-family confirmations show up here before they show up in a loss event." });
    s.push({ route: "rubric", title: "Challenge against math, not vibes", text: "Both rubrics are published: applicability and inherent. When ORBO disagrees with a front-line call, the argument is about specific anchors and evidence, not about whose opinion is louder. That is what makes the challenge log defensible." });
    return s;
  }

  function bacoScenes(ctx) {
    var g = finders(ctx);
    var s = [
      { route: "mywork", state: { role: "BACO (Compliance Risk)" }, title: "The compliance 2LOD desk is live", text: "BACO's queue is real: the attention list ranks the non-standard on the compliance side, and your challenges in flight, including the open one on the story RAU, sit beneath it. The banner now views the tool as BACO." },
      { route: "rcsa-attention", title: "The compliance slice of attention", text: "Expected-control gaps on FCRM situations, outlier ratings on compliance instances, override-dense RAUs, aging changes, open challenges: ranked, with reasons, settled items gone. This IS the BACO workflow; there is no tollgate to wait for." },
      { route: "rcsa/" + g.story.id, title: "Your open challenge, in context", text: "BACO already challenged the Reg X rating override on this RAU: the line wears a CHALLENGED chip, the log at the bottom holds the argument, and the affirmation gate is blocked until it resolves. When the owner responds, you uphold or withdraw." }
    ];
    if (g.headMcr) s.push({ route: "mcrlib/" + g.headMcr.id, title: "Goodness of fit, one MCR at a time", text: "The fit panel compares this MCR's profile to its parent event and the best alternative. A weak fit is a rewrite candidate to raise with the RRCM owners before it muddies applicability scoring. MCR metadata also guides the drafted control skeletons the business starts from." });
    s.push(
      { route: "riskid/" + g.story.id, title: "MCRs ride the confirmation", text: "When the front line confirms a compliance event, the top-ranked MCRs beneath it attach to the register row automatically. Your challenge work starts from that suggested set and the ratings built on it, never from a blank page." },
      { route: "controls-key", title: "Key status BACO can defend", text: "Four transparent rules derive key from the live landscape, including being the expected control for a compliance situation. The disagreement tables are where compliance 2LOD looks first, and everything here is challengeable from the record itself." }
    );
    return s;
  }

  function govScenes(ctx) {
    var g = finders(ctx);
    var s = [
      { route: "mywork", state: { role: "RCSA RAU Governance" }, title: "Two queues, all the leverage", text: "The central governance team runs two queues: uniqueness reviews awaiting a decision and requests awaiting final approval. The assistant does the analysis; this team does the deciding. The banner now views the tool as RCSA RAU Governance." }
    ];
    if (g.uq) s.push({ route: "pipeline/" + g.uq.id, title: "Rule on the duplicate gate", text: "The assistant found 82% overlap with an existing unit and laid out its reasons. Governance holds three levers: advance to mapping, return with comments, or decline and redirect the requester to the overlapping RAU's owner. The decision and rationale stay on the request." });
    if (g.gov) s.push({ route: "pipeline/" + g.gov.id, title: "Approval finalizes, not just unblocks", text: "Approving a new RAU finalizes it with its completed, standards-passed process map and assigns all five roles in the same act. The request then moves to metadata creation. Nothing becomes real in the inventory without this signature." });
    if (g.reshape) s.push({ route: "pipeline/" + g.reshape.id, title: "Reshapes come with their blast radius", text: "For mergers, splits, and retirements the impact preview is computed from live links: confirmed risks and handoffs that move if governance approves. The decision is informed by the actual dependency network, not a memo." });
    s.push({ route: "pipeline", title: "One pipeline, no side doors", text: "Every change to the 850-unit inventory moves through stages this team can see and gate. That single fact is what keeps the RAU inventory trustworthy enough for everything downstream to build on." });
    return s;
  }

  /* ==SECTION:catalog== */
  function catalog() {
    return [
      { id: "walkthrough", group: "story", name: "Full walkthrough", blurb: "Capabilities 1 through 5 end to end: inventory, pipeline, workbench, ratings, controls, RCSA.", scenes: walkthroughScenes },
      { id: "birth", group: "story", name: "Birth of a RAU", blurb: "The order of operations, one gate per scene: intake, uniqueness, mapping, standards, governance, metadata, active, risk identification.", scenes: birthScenes },
      { id: "money", group: "story", name: "One risk, front to back", blurb: "The whole spine on one instance: confirm, rate, mitigate, residual, challenge, answer, affirm.", scenes: moneyScenes },
      { id: "role-owner", group: "role", name: "RAU Owner", blurb: "Own the record, take the first pass at risk identification, confirm inbound handoffs.", scenes: ownerScenes },
      { id: "role-delegate", group: "role", name: "RAU Owner Delegate", blurb: "Run the day to day: queues, intakes, survey answers, profile housekeeping.", scenes: delegateScenes },
      { id: "role-bcm", group: "role", name: "BCM Contact", blurb: "Shepherd the business's change requests through the pipeline and coach maps to standard.", scenes: bcmScenes },
      { id: "role-orbo", group: "role", name: "ORBO (Operational Risk)", blurb: "Watch the operational register build, with the rubric and evidence trail challenge will use.", scenes: orboScenes },
      { id: "role-baco", group: "role", name: "BACO (Compliance Risk)", blurb: "Work the MCR library: fit, rewrite candidates, and the rollup under compliance events.", scenes: bacoScenes },
      { id: "role-gov", group: "role", name: "RCSA RAU Governance", blurb: "Rule the two queues: uniqueness decisions and approvals that finalize RAUs.", scenes: govScenes }
    ];
  }

  /* ==SECTION:present== */
  function present(el, ctx) {
    var ui = ctx.ui;
    el.appendChild(ui.el("div", { class: "g-page-head" },
      ui.el("div", {}, [
        ui.el("div", { class: "g-h1" }, "Present: pick a demo"),
        ui.el("div", { class: "g-muted" }, "Two story demos plus one demo per role in the View-as picker. Starting a role demo switches the banner role for you. The overlay drives navigation; you keep full control of the screen and can click anything mid-scene.")])));

    function demoRow(d) {
      var s = d.scenes(ctx);
      var open = false;
      var list = ui.el("ol", { style: "display:none;margin:8px 0 2px;padding-left:22px;color:var(--g-muted);font-size:12.5px" },
        s.map(function (x) { return ui.el("li", { style: "padding:1px 0" }, x.title); }));
      var toggle = ui.el("button", { class: "g-btn sm", onclick: function () { open = !open; list.style.display = open ? "block" : "none"; toggle.textContent = open ? "Hide scenes" : "Scenes"; } }, "Scenes");
      var row = ui.el("div", { style: "padding:10px 0;border-bottom:1px solid var(--g-line-soft)" }, [
        ui.el("div", { class: "g-row" }, [
          ui.el("span", { style: "flex:1;min-width:260px" }, [
            ui.el("b", {}, d.name),
            ui.el("span", { class: "g-muted", style: "display:block;font-size:12.5px" }, d.blurb)]),
          ui.el("span", { class: "g-pill" }, s.length + " scenes"),
          toggle,
          ui.el("button", { class: "g-btn sm g-btn--primary", onclick: function () { GRC.tour(d.scenes(ctx)); } }, "Start")]),
        list]);
      return row;
    }

    var all = catalog();
    var storyBody = ui.el("div");
    all.filter(function (d) { return d.group === "story"; }).forEach(function (d) { storyBody.appendChild(demoRow(d)); });
    el.appendChild(ui.card({ title: "Story demos", body: storyBody }));

    var roleBody = ui.el("div");
    roleBody.appendChild(ui.el("p", { class: "g-muted", style: "font-size:12.5px;margin:0 0 4px" }, "One per role type. Each opens on that role's My Work and follows the workflow that role actually runs."));
    all.filter(function (d) { return d.group === "role"; }).forEach(function (d) { roleBody.appendChild(demoRow(d)); });
    el.appendChild(ui.card({ title: "Role demos", body: roleBody }));

    el.appendChild(ui.card({
      title: "Presenting tips", body: ui.el("ul", { style: "margin:0;padding-left:20px;color:var(--g-muted)" }, [
        ui.el("li", {}, "F11 for full screen; the tour card sits at the bottom and never blocks the rail."),
        ui.el("li", {}, "Off-script questions: Exit, click wherever the question leads, restart anytime."),
        ui.el("li", {}, "Role demos change the View-as role; it stays changed after the demo ends."),
        ui.el("li", {}, "After playing with actions, Preflight > Reset demo data restores the shipped state.")])
    }));
  }

  GRC.register({
    id: "demo", version: "2.4.0", tab: "Home",
    caps: { "present": null },
    routes: { "present": present }
  });
})();

<!-- ==GRC-FILE-END== -->

