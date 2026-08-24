/* GRC tools-dev/package-workspace.js v1.0.0 2026-08-24
   Packs workspace/ into the cross-firewall ZIP, deterministically:
   - writes workspace/SHIP-MANIFEST.txt (per-file SHA-256, arrival checklist)
   - writes dist/GRC-Workspace-<Rn>.zip (entries rooted at GRC/ so extracting
     at C:\ yields C:\GRC exactly as README-FIRST.txt expects)
   - writes dist/GRC-Workspace-<Rn>.zip.sha256 (send this hash by a separate
     channel; the receiver compares before trusting the payload)
   Same tree in = same bytes out (fixed timestamps, sorted entries).
   Run: node package-workspace.js   (from tools-dev/; no dependencies)     */
"use strict";
var fs = require("fs");
var path = require("path");
var zlib = require("zlib");
var crypto = require("crypto");

var ROOT = path.join(__dirname, "..");
var WS = path.join(ROOT, "workspace");
var DIST = path.join(ROOT, "dist");
var ZIPROOT = "GRC/";

/* ==SECTION:release== */
var relSrc = fs.readFileSync(path.join(WS, "demo", "data", "release.js"), "utf8");
var relM = relSrc.match(/number:"(R\d+)", date:"([0-9-]+)", label:"([^"]*)"/);
if (!relM) { console.error("cannot read release from demo/data/release.js"); process.exit(1); }
var REL = relM[1], RELDATE = relM[2], RELLABEL = relM[3];
var ZIPNAME = "GRC-Workspace-" + REL + ".zip";

/* ==SECTION:walk== */
function walk(dir, base, out) {
  fs.readdirSync(dir, { withFileTypes: true }).sort(function (a, b) { return a.name < b.name ? -1 : 1; }).forEach(function (e) {
    var full = path.join(dir, e.name);
    var rel = base ? base + "/" + e.name : e.name;
    if (e.isDirectory()) walk(full, rel, out);
    else out.push(rel);
  });
  return out;
}

/* ==SECTION:manifest== */
var MANIFEST = "SHIP-MANIFEST.txt";
var files = walk(WS, "", []).filter(function (f) { return f !== MANIFEST; });
var totalBytes = 0;
var entries = files.map(function (f) {
  var buf = fs.readFileSync(path.join(WS, f));
  totalBytes += buf.length;
  return { rel: f, buf: buf, sha: crypto.createHash("sha256").update(buf).digest("hex") };
});
var man = [];
man.push("GRC MOCKUP - SHIP MANIFEST");
man.push("==========================");
man.push("Release:  " + REL + " (" + RELDATE + ") - " + RELLABEL);
man.push("Packed:   " + files.length + " files, " + (totalBytes / 1024 / 1024).toFixed(2) + " MB unpacked");
man.push("Payload:  the complete self-contained workspace: the app (demo\\),");
man.push("          the Copilot kit (kit\\), CSV templates (data-staging\\),");
man.push("          logs, the runbook, and DataForge (demo\\tools\\).");
man.push("          Nothing else is needed to run, extend, or maintain it.");
man.push("");
man.push("ARRIVAL CHECKLIST (do these five, in order, on the inside machine)");
man.push("1. UNPACK the zip at C:\\ so this file sits at C:\\GRC\\SHIP-MANIFEST.txt");
man.push("   (Documents works too if C:\\ is locked down; keep the layout).");
man.push("2. VERIFY the crossing. Whole-zip check (hash arrives by separate");
man.push("   channel):   certutil -hashfile GRC-Workspace-" + REL + ".zip SHA256");
man.push("   Per-file spot checks against the list below:");
man.push("      certutil -hashfile C:\\GRC\\demo\\index.html SHA256");
man.push("   or all at once in PowerShell:  Get-FileHash -Algorithm SHA256 <file>");
man.push("   Check at minimum: demo\\index.html, demo\\tools\\dataforge.html,");
man.push("   kernel\\core.js, kernel\\engine.js, and one data file.");
man.push("3. BOOT: double-click demo\\index.html (Edge). The red banner must say");
man.push("   " + REL + ". Click Preflight: zero trapped errors, every entity loaded.");
man.push("4. TOOL: open demo\\tools\\dataforge.html, click Run self-test:");
man.push("   all checks green means the data pipeline survived intact.");
man.push("5. READ: README-FIRST.txt (one page), then the runbook");
man.push("   (GRC-Mockup-Runbook.docx) Part 0. Everything else is reference.");
man.push("");
man.push("If step 3 or 4 fails, the crossing corrupted a file: find it with the");
man.push("hash list below and re-transfer that file (or the whole zip). Do not");
man.push("hand-patch. This manifest lists every shipped file; the manifest");
man.push("itself is covered by the whole-zip hash.");
man.push("");
man.push("FILE HASHES (SHA-256)");
entries.forEach(function (e) {
  man.push(e.sha + "  " + String(e.buf.length).padStart(9, " ") + "  " + e.rel.replace(/\//g, "\\"));
});
man.push("");
var manBuf = Buffer.from(man.join("\r\n") + "\r\n", "utf8");
fs.writeFileSync(path.join(WS, MANIFEST), manBuf);
entries.unshift({ rel: MANIFEST, buf: manBuf, sha: crypto.createHash("sha256").update(manBuf).digest("hex") });

/* ==SECTION:zip== */
/* Minimal deterministic ZIP writer: deflate, fixed DOS timestamp. */
var CRC_T = (function () {
  var t = new Int32Array(256);
  for (var n = 0; n < 256; n++) {
    var c = n;
    for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  var c = 0xFFFFFFFF;
  for (var i = 0; i < buf.length; i++) c = CRC_T[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
var DOS_TIME = (12 << 11) >>> 0;                                   /* 12:00:00 */
var DOS_DATE = (((2026 - 1980) << 9) | (8 << 5) | 24) >>> 0;       /* 2026-08-24 */
function u16(n) { var b = Buffer.alloc(2); b.writeUInt16LE(n & 0xFFFF); return b; }
function u32(n) { var b = Buffer.alloc(4); b.writeUInt32LE(n >>> 0); return b; }
var locals = [], centrals = [], offset = 0;
entries.forEach(function (e) {
  var nameBuf = Buffer.from(ZIPROOT + e.rel, "utf8");
  var raw = e.buf;
  var comp = zlib.deflateRawSync(raw, { level: 9 });
  var method = 8, data = comp;
  if (comp.length >= raw.length) { method = 0; data = raw; }
  var crc = crc32(raw);
  var local = Buffer.concat([
    u32(0x04034b50), u16(20), u16(0), u16(method), u16(DOS_TIME), u16(DOS_DATE),
    u32(crc), u32(data.length), u32(raw.length), u16(nameBuf.length), u16(0), nameBuf, data]);
  var central = Buffer.concat([
    u32(0x02014b50), u16(20), u16(20), u16(0), u16(method), u16(DOS_TIME), u16(DOS_DATE),
    u32(crc), u32(data.length), u32(raw.length), u16(nameBuf.length), u16(0), u16(0),
    u16(0), u16(0), u32(0), u32(offset), nameBuf]);
  locals.push(local);
  centrals.push(central);
  offset += local.length;
});
var centralStart = offset;
var centralBuf = Buffer.concat(centrals);
var eocd = Buffer.concat([
  u32(0x06054b50), u16(0), u16(0), u16(entries.length), u16(entries.length),
  u32(centralBuf.length), u32(centralStart), u16(0)]);
var zipBuf = Buffer.concat(locals.concat([centralBuf, eocd]));
if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, ZIPNAME), zipBuf);
var zipSha = crypto.createHash("sha256").update(zipBuf).digest("hex");
fs.writeFileSync(path.join(DIST, ZIPNAME + ".sha256"), zipSha + "  " + ZIPNAME + "\r\n");
console.log("wrote workspace/" + MANIFEST + " (" + entries.length + " files listed)");
console.log("wrote dist/" + ZIPNAME + " " + (zipBuf.length / 1024 / 1024).toFixed(2) + " MB (" + (totalBytes / 1024 / 1024).toFixed(2) + " MB unpacked)");
console.log("SHA-256 " + zipSha);
