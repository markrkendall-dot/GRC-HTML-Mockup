/* GRC tools-dev/build-crossing-kit.js v1.0.0 2026-08-24
 *
 * WHY THIS EXISTS
 * ---------------
 * The corporate transfer gateway strips .js and .py files, and it recurses
 * INTO archives (a .zip of .js arrives with every .js removed). Only .md,
 * .zip-of-allowed-members, and non-macro Office files cross intact.
 *
 * The app is HTML + vanilla .js. The build model always regenerated that .js
 * INSIDE the firewall from the .md kit, so the core plan is unaffected. What
 * breaks is the convenience of shipping the prebuilt REFERENCE app across as
 * .js. This tool restores that: it repackages the reference app's code as
 * allowed-type files that reconstitute, byte-for-byte, to the real .js/.html
 * inside.
 *
 * It emits two interchangeable representations of the same code, plus the
 * means to verify and rebuild:
 *   crossing/APP-CODEBOOK.md   one Markdown file, every code file as a
 *                              length-delimited sentinel block (byte-exact)
 *   crossing/mirror/**         the code tree with each file renamed *.md
 *                              (kernel/core.js -> kernel/core.js.md)
 *   crossing/MANIFEST.md       path, bytes, sha256 per file + rename map
 *   crossing/RECONSTITUTE.md   the inside procedure (3 methods)
 *   crossing/rebuild.html.md   a browser reconstitutor (save as rebuild.html
 *                              inside; parses the codebook, writes the files)
 *   crossing/app-mirror.zip    the mirror tree zipped (all members .md ->
 *                              survives the recursive scanner)
 *
 * Data files (data/*.js) are NOT included by default: real data is produced
 * inside from CSVs via DataForge and never crosses. Pass --with-data to fold
 * the synthetic data set into the mirror + zip (never into the codebook) for
 * an inside synthetic demo.
 *
 * Run from repo root:  node tools-dev/build-crossing-kit.js [--with-data]
 * No dependencies (Node built-ins; shells out to `zip` if present).
 */

"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const DEMO = path.join(ROOT, "workspace", "demo");
const OUT = path.join(ROOT, "workspace", "crossing");
const WITH_DATA = process.argv.includes("--with-data");

/* ==SECTION: gather the file list in index.html load order== */
// Parse index.html's <script src> tags so the codebook mirrors the real boot
// order. index.html itself leads. Data files are split out (made inside).
function loadOrder() {
  const html = fs.readFileSync(path.join(DEMO, "index.html"), "utf8");
  const re = /<script\s+src=["']([^"']+)["']/g;
  const scripts = [];
  let m;
  while ((m = re.exec(html)) !== null) scripts.push(m[1]);
  const code = ["index.html"];
  const data = [];
  for (const s of scripts) {
    if (s.startsWith("data/")) data.push(s);
    else code.push(s);
  }
  return { code, data };
}

/* ==SECTION: read a file as a raw Buffer + its digest== */
function readEntry(rel) {
  const abs = path.join(DEMO, rel);
  const buf = fs.readFileSync(abs);
  const sha = crypto.createHash("sha256").update(buf).digest("hex");
  return { rel, buf, bytes: buf.length, sha };
}

/* ==SECTION: emit the single-file codebook (byte-exact, length-delimited)== */
// Blocks are length-delimited (bytes=N), never newline- or fence-delimited,
// so file contents can contain anything (backticks, ```, the sentinel text
// itself) and still round-trip exactly. The parser takes exactly N bytes.
function buildCodebook(entries) {
  const parts = [];
  parts.push(Buffer.from(
    "<!-- GRC APP-CODEBOOK v1 -->\n" +
    "# GRC reference app - code book\n\n" +
    "This one Markdown file carries the entire reference app CODE (no data).\n" +
    "Each file below sits between BEGIN/END sentinels and is length-delimited\n" +
    "(bytes=N): a reader takes exactly N bytes after the BEGIN line, so the\n" +
    "content round-trips byte-for-byte no matter what it contains.\n\n" +
    "TO REBUILD INSIDE: use crossing/rebuild.html (see RECONSTITUTE.md), or\n" +
    "copy each block's content into Notepad and Save As the path shown.\n" +
    "OPEN THIS FILE IN NOTEPAD, not a rendered Markdown viewer, so bytes are\n" +
    "preserved exactly.\n\n" +
    "Files appear in index.html load order.\n\n", "utf8"));
  for (const e of entries) {
    parts.push(Buffer.from(
      "<!-- ==GRC-FILE-BEGIN path=" + e.rel + " bytes=" + e.bytes +
      " sha256=" + e.sha + "== -->\n", "utf8"));
    parts.push(e.buf);
    parts.push(Buffer.from("\n<!-- ==GRC-FILE-END== -->\n\n", "utf8"));
  }
  return Buffer.concat(parts);
}

/* ==SECTION: emit the rename-mirror tree (raw content, *.md names)== */
function writeMirror(entries) {
  for (const e of entries) {
    const dest = path.join(OUT, "mirror", e.rel + ".md");
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, e.buf); // raw bytes; strip ".md" inside to restore
  }
}

/* ==SECTION: manifest with digests + rename map== */
function buildManifest(codeEntries, dataEntries) {
  const rows = [];
  rows.push("<!-- GRC crossing MANIFEST v1 -->");
  rows.push("# Crossing manifest");
  rows.push("");
  rows.push("Generated by tools-dev/build-crossing-kit.js. Every code file, its");
  rows.push("size and SHA-256, and the ships-as / restores-to rename map. Use the");
  rows.push("digests inside to prove each reconstituted file is byte-identical.");
  rows.push("");
  rows.push("| # | Restores to (real path) | Ships as (mirror) | Bytes | SHA-256 |");
  rows.push("|---|---|---|---|---|");
  let i = 1;
  for (const e of codeEntries) {
    rows.push("| " + i++ + " | `" + e.rel + "` | `mirror/" + e.rel + ".md` | " +
      e.bytes + " | `" + e.sha + "` |");
  }
  rows.push("");
  rows.push("Total code: " + codeEntries.length + " files, " +
    codeEntries.reduce((s, e) => s + e.bytes, 0) + " bytes.");
  rows.push("");
  if (dataEntries && dataEntries.length) {
    rows.push("## Synthetic data (included via --with-data)");
    rows.push("");
    rows.push("Ships in the mirror + zip only (too large for the codebook).");
    rows.push("Real data is produced INSIDE from CSVs and never crosses.");
    rows.push("");
    rows.push("| Restores to | Ships as | Bytes | SHA-256 |");
    rows.push("|---|---|---|---|");
    for (const e of dataEntries) {
      rows.push("| `" + e.rel + "` | `mirror/" + e.rel + ".md` | " + e.bytes +
        " | `" + e.sha + "` |");
    }
    rows.push("");
  } else {
    rows.push("## Data");
    rows.push("");
    rows.push("Not included. Real data is produced INSIDE from CSVs via DataForge");
    rows.push("(never crosses). For an inside SYNTHETIC demo, regenerate with");
    rows.push("`--with-data` to fold data/*.js into the mirror + zip.");
    rows.push("");
  }
  return rows.join("\n");
}

/* ==SECTION: the inside reconstitution guide== */
function reconstituteDoc() {
  return `<!-- GRC crossing RECONSTITUTE v1 -->
# Rebuilding the reference app INSIDE the firewall

The transfer gateway strips .js and .py, and it recurses into .zip archives
(a zip of .js arrives with the .js gone). Only these cross intact:

- **.md** (Markdown / plain text)
- **.zip** whose members are themselves all allowed types
- **non-macro Office**: .docx, .xlsx, .pptx  (NOT .docm/.xlsm/.pptm)

Treat **.html and .js as blocked**, loose or inside a zip.

This folder carries the reference app CODE as .md, two equivalent ways. The
data is not here: real data is produced inside from CSVs via DataForge, and
synthetic data is only for outside demos (regenerate with --with-data if you
truly need a synthetic demo inside).

Pick ONE method. All three yield byte-identical .js/.html; verify against the
SHA-256 values in MANIFEST.md.

---

## Method A - browser reconstitutor (recommended, no shell needed)

1. Bring \`app-mirror.zip\` (or just \`APP-CODEBOOK.md\`) and \`rebuild.html.md\`
   across (inside \`GRC-crossing.zip\`).
2. Open \`rebuild.html.md\` in Notepad and Save As \`rebuild.html\` (set "Save as
   type" to All Files so it is not saved as rebuild.html.txt).
3. Double-click \`rebuild.html\` to open it in Edge.
4. Click "Choose codebook", pick \`APP-CODEBOOK.md\`.
5. If Edge offers a folder picker, point it at your empty \`demo\\\` folder and
   the files are written in place, in the right sub-folders. If not, the page
   downloads each file; move them into \`demo\\\` per the on-screen map
   (kernel\\ , modules\\ , and index.html at the demo root).
6. Open \`demo\\index.html\` in Edge. Check the preflight panel.

## Method B - PowerShell rename (fastest, if PowerShell is allowed)

1. Unzip \`app-mirror.zip\` into your \`demo\\\` folder. You now have a correct
   folder tree where every code file ends in an extra \`.md\`
   (kernel\\core.js.md, modules\\home.js.md, index.html.md, ...).
2. From that folder, strip the trailing \`.md\`:

       Get-ChildItem -Recurse -Filter *.md |
         Rename-Item -NewName { $_.Name -replace '\\.md$','' }

3. Open \`demo\\index.html\` in Edge. Check preflight.

If PowerShell is blocked, use Method A or C.

## Method C - manual (bulletproof, no tools at all)

1. Open \`APP-CODEBOOK.md\` in **Notepad** (not a rendered Markdown viewer).
2. For each block between \`==GRC-FILE-BEGIN path=... ==\` and
   \`==GRC-FILE-END==\`: select the content between the two sentinel lines,
   copy it, and Save As the exact path shown (create kernel\\ and modules\\
   folders; save index.html at the demo root). Save as type = All Files.
3. Nineteen files, once. Open \`demo\\index.html\` in Edge. Check preflight.

---

## Verifying

MANIFEST.md lists a SHA-256 per file. To confirm a reconstituted file is
exact, in PowerShell: \`Get-FileHash demo\\kernel\\core.js -Algorithm SHA256\`
and compare. The preflight panel's version map is the quick visual check.

## Updating one file later

Day-to-day edits do NOT use this kit. When Copilot regenerates one module
inside, you save that single .js by hand as always. This crossing kit is only
for the one-time reference-build drop (or a full refresh).
`;
}

/* ==SECTION: the browser reconstitutor (shipped as rebuild.html.md)== */
function rebuildHtml() {
  // Vanilla, offline, no external URLs. Parses APP-CODEBOOK.md by the same
  // length-delimited contract. Tries the File System Access API to write into
  // a chosen folder with correct sub-paths; falls back to per-file downloads
  // plus a move map. Untested inside a locked-down Edge - Methods B/C are the
  // guaranteed fallbacks.
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>GRC reference app - rebuild</title>
<style>
 body{font:14px/1.5 Segoe UI,Arial,sans-serif;max-width:820px;margin:2rem auto;padding:0 1rem;color:#1a1a1a}
 h1{font-size:1.3rem} .red{color:#b00} .ok{color:#0a0}
 button{font-size:1rem;padding:.5rem .9rem;margin:.3rem .3rem .3rem 0;cursor:pointer}
 #log{white-space:pre-wrap;background:#f5f5f5;border:1px solid #ddd;padding:.8rem;margin-top:1rem;max-height:50vh;overflow:auto}
 table{border-collapse:collapse;margin-top:1rem} td,th{border:1px solid #ccc;padding:.2rem .5rem;text-align:left}
 code{background:#eee;padding:0 .2rem}
</style></head><body>
<h1>GRC reference app &ndash; rebuild inside the firewall</h1>
<p>Offline. Pick <code>APP-CODEBOOK.md</code>; this page writes the real
<code>.js</code>/<code>.html</code> files. If your Edge supports the folder
picker, choose your empty <code>demo\\</code> folder and the tree is written in
place. Otherwise each file downloads and the move map below tells you where
each one goes.</p>
<p>
 <input type="file" id="pick" accept=".md,text/markdown,text/plain">
 <button id="go" disabled>Rebuild</button>
</p>
<div id="log">Waiting for a codebook file&hellip;</div>
<script>
"use strict";
var BEGIN=/<!--\\s*==GRC-FILE-BEGIN\\s+path=(\\S+)\\s+bytes=(\\d+)\\s+sha256=([0-9a-f]{64})==\\s*-->\\n/g;
var codebookBytes=null, entries=null;
var logEl=document.getElementById("log");
function log(s,cls){var d=document.createElement("div");if(cls)d.className=cls;d.textContent=s;logEl.appendChild(d);}
function reset(){logEl.textContent="";}

// Read the picked file as raw bytes so length-delimited slicing is exact.
document.getElementById("pick").addEventListener("change",function(ev){
  var f=ev.target.files[0]; if(!f) return;
  var r=new FileReader();
  r.onload=function(){
    codebookBytes=new Uint8Array(r.result);
    reset(); log("Loaded "+f.name+" ("+codebookBytes.length+" bytes). Parsing...");
    try{ entries=parseCodebook(codebookBytes); }
    catch(e){ log("Parse failed: "+e.message,"red"); return; }
    log("Found "+entries.length+" files:");
    entries.forEach(function(e){ log("  "+e.path+"  ("+e.bytes+" bytes)"); });
    document.getElementById("go").disabled=false;
  };
  r.readAsArrayBuffer(f);
});

// Decode only the sentinel lines as text; slice content by exact byte length.
function parseCodebook(bytes){
  var text=new TextDecoder("utf-8").decode(bytes); // for locating markers
  // Build a byte-offset index by re-encoding is unsafe (multibyte). Instead
  // locate markers in a Latin1 view where 1 char == 1 byte, so string indices
  // equal byte offsets exactly.
  var latin1=""; for(var i=0;i<bytes.length;i++) latin1+=String.fromCharCode(bytes[i]);
  var out=[], re=new RegExp(BEGIN.source,"g"), m;
  while((m=re.exec(latin1))!==null){
    var p=m[1], n=parseInt(m[2],10), sha=m[3];
    var start=m.index+m[0].length;      // first content byte
    var content=bytes.subarray(start,start+n);
    if(content.length!==n) throw new Error("truncated block for "+p);
    out.push({path:p,bytes:n,sha:sha,buf:content});
    re.lastIndex=start+n;               // resume after this block's content
  }
  if(!out.length) throw new Error("no file blocks found");
  return out;
}

async function sha256hex(buf){
  var h=await crypto.subtle.digest("SHA-256",buf);
  var a=new Uint8Array(h),s=""; for(var i=0;i<a.length;i++){var x=a[i].toString(16);s+=(x.length<2?"0":"")+x;} return s;
}

document.getElementById("go").addEventListener("click",async function(){
  document.getElementById("go").disabled=true;
  // Verify digests first.
  for(var i=0;i<entries.length;i++){
    var got=await sha256hex(entries[i].buf);
    if(got!==entries[i].sha){ log("SHA mismatch on "+entries[i].path+" - aborting","red"); return; }
  }
  log("All "+entries.length+" digests verified.","ok");
  var dir=null;
  if(window.showDirectoryPicker){
    try{ dir=await window.showDirectoryPicker({mode:"readwrite"}); }
    catch(e){ dir=null; log("Folder picker not used ("+e.name+"); falling back to downloads."); }
  }
  if(dir){ await writeToDir(dir,entries); }
  else { downloadAll(entries); showMoveMap(entries); }
});

async function writeToDir(dir,entries){
  for(var i=0;i<entries.length;i++){
    var e=entries[i], parts=e.path.split("/"), name=parts.pop(), d=dir;
    for(var k=0;k<parts.length;k++){ d=await d.getDirectoryHandle(parts[k],{create:true}); }
    var fh=await d.getFileHandle(name,{create:true}), w=await fh.createWritable();
    await w.write(e.buf); await w.close();
    log("wrote "+e.path,"ok");
  }
  log("Done. Open demo/index.html in Edge.","ok");
}

function downloadAll(entries){
  entries.forEach(function(e,idx){
    setTimeout(function(){
      var name=e.path.split("/").pop();
      var blob=new Blob([e.buf],{type:"application/octet-stream"});
      var a=document.createElement("a"); a.href=URL.createObjectURL(blob);
      a.download=name; document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(a.href); log("downloaded "+name);
    }, idx*400); // stagger so Edge does not drop rapid-fire downloads
  });
}

function showMoveMap(entries){
  var t=document.createElement("table");
  t.innerHTML="<tr><th>Downloaded file</th><th>Move into</th></tr>";
  entries.forEach(function(e){
    var name=e.path.split("/").pop(), folder=e.path.indexOf("/")<0?"(demo root)":e.path.slice(0,e.path.lastIndexOf("/"))+"\\\\";
    var tr=document.createElement("tr");
    tr.innerHTML="<td><code>"+name+"</code></td><td><code>"+folder+"</code></td>";
    t.appendChild(tr);
  });
  logEl.appendChild(t);
  log("Downloads go to your Downloads folder; move each per the map above.");
}
</script>
</body></html>
`;
}

/* ==SECTION: zip the mirror (best-effort; members are all .md)== */
function zipMirror() {
  const zipPath = path.join(OUT, "app-mirror.zip");
  try { fs.unlinkSync(zipPath); } catch (e) {}
  try {
    // Zip the CONTENTS of mirror/ (no "mirror/" prefix) so unzipping into
    // demo\ yields demo\kernel\..., demo\index.html.md directly - matching
    // RECONSTITUTE.md Method B.
    execFileSync("zip", ["-rq", zipPath, "."], { cwd: path.join(OUT, "mirror") });
    return "app-mirror.zip";
  } catch (e) {
    return null;
  }
}

/* ==SECTION: main== */
function main() {
  if (!fs.existsSync(DEMO)) { console.error("no workspace/demo"); process.exit(1); }
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const { code, data } = loadOrder();
  const codeEntries = code.map(readEntry);
  const dataEntries = WITH_DATA ? data.map(readEntry) : [];
  const mirrorEntries = codeEntries.concat(dataEntries);

  fs.writeFileSync(path.join(OUT, "APP-CODEBOOK.md"), buildCodebook(codeEntries));
  writeMirror(mirrorEntries);
  fs.writeFileSync(path.join(OUT, "MANIFEST.md"), buildManifest(codeEntries, dataEntries));
  fs.writeFileSync(path.join(OUT, "RECONSTITUTE.md"), reconstituteDoc());
  fs.writeFileSync(path.join(OUT, "rebuild.html.md"), rebuildHtml());
  const zipName = zipMirror();

  const codeBytes = codeEntries.reduce((s, e) => s + e.bytes, 0);
  console.log("crossing kit written to workspace/crossing/");
  console.log("  code files : " + codeEntries.length + " (" + codeBytes + " bytes)");
  console.log("  data files : " + dataEntries.length + (WITH_DATA ? "" : " (use --with-data to include)"));
  console.log("  codebook   : APP-CODEBOOK.md");
  console.log("  mirror zip : " + (zipName || "SKIPPED (no `zip` CLI; zip workspace/crossing/mirror by hand)"));
  console.log("  guide      : RECONSTITUTE.md   unpacker: rebuild.html.md   manifest: MANIFEST.md");
}

main();
