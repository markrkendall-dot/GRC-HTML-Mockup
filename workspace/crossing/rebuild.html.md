<!doctype html>
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
picker, choose your empty <code>demo\</code> folder and the tree is written in
place. Otherwise each file downloads and the move map below tells you where
each one goes.</p>
<p>
 <input type="file" id="pick" accept=".md,text/markdown,text/plain">
 <button id="go" disabled>Rebuild</button>
</p>
<div id="log">Waiting for a codebook file&hellip;</div>
<script>
"use strict";
var BEGIN=/<!--\s*==GRC-FILE-BEGIN\s+path=(\S+)\s+bytes=(\d+)\s+sha256=([0-9a-f]{64})==\s*-->\n/g;
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
    var name=e.path.split("/").pop(), folder=e.path.indexOf("/")<0?"(demo root)":e.path.slice(0,e.path.lastIndexOf("/"))+"\\";
    var tr=document.createElement("tr");
    tr.innerHTML="<td><code>"+name+"</code></td><td><code>"+folder+"</code></td>";
    t.appendChild(tr);
  });
  logEl.appendChild(t);
  log("Downloads go to your Downloads folder; move each per the map above.");
}
</script>
</body></html>
