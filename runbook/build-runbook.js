/* Builds GRC-Mockup-Runbook.docx from the runbook content below plus the
   firewall-kit files (embedded verbatim as appendices).
   Run: node build-runbook.js   (from this directory) */
const fs = require("fs");
const path = require("path");
const D = require("docx");

const KIT = path.join(__dirname, "..", "firewall-kit");
const OUT = path.join(__dirname, "GRC-Mockup-Runbook.docx");

const ACCENT = "14557B";
const INKMUT = "6A7280";
const CODEBG = "F2F4F7";
const CALLBG = "FDF3E3";
const CALLBR = "B96A00";
const HDRBG = "E8EEF2";
const PAGE_W = 12240, PAGE_H = 15840, MARGIN = 1440;
const BODY_W = PAGE_W - 2 * MARGIN; // 9360

let stepInstance = 0; // each numbered list gets its own instance so it restarts

const T = (text, o = {}) => new D.TextRun(Object.assign({ text }, o));
const P = (children, o = {}) =>
  new D.Paragraph(Object.assign({
    children: typeof children === "string" ? [T(children)] : children,
    spacing: { after: 120 },
  }, o));
const H1 = (text) => new D.Paragraph({
  heading: D.HeadingLevel.HEADING_1, pageBreakBefore: true,
  spacing: { before: 0, after: 200 }, children: [T(text)],
});
const H2 = (text) => new D.Paragraph({
  heading: D.HeadingLevel.HEADING_2,
  spacing: { before: 260, after: 140 }, children: [T(text)],
});
const H3 = (text) => new D.Paragraph({
  heading: D.HeadingLevel.HEADING_3,
  spacing: { before: 200, after: 100 }, children: [T(text)],
});
const LEAD = (lead, rest, o = {}) => P([T(lead, { bold: true }), T(rest)], o);
const BUL = (children) => P(children, { numbering: { reference: "bul", level: 0 }, spacing: { after: 80 } });
const MONO = { font: "Consolas", size: 17 };
const newSteps = () => { stepInstance += 1; return stepInstance; };
const STEP = (children, inst) => P(children, {
  numbering: { reference: "steps", level: 0, instance: inst }, spacing: { after: 100 },
});

function codeBlock(text, opts = {}) {
  const size = opts.size || 17;
  return text.replace(/\s+$/, "").split("\n").map((line) => new D.Paragraph({
    children: [new D.TextRun({ text: line.length ? line : " ", font: "Consolas", size })],
    shading: { type: D.ShadingType.CLEAR, fill: CODEBG },
    spacing: { before: 0, after: 0, line: 235, lineRule: D.LineRuleType.AUTO },
    indent: { left: 120, right: 120 },
  }));
}

function callout(title, body) {
  const kids = [P([T(title, { bold: true, color: CALLBR })], {
    shading: { type: D.ShadingType.CLEAR, fill: CALLBG },
    border: { left: { style: D.BorderStyle.SINGLE, size: 24, color: CALLBR, space: 6 } },
    spacing: { after: 40 }, indent: { left: 120, right: 120 },
  })];
  const lines = Array.isArray(body) ? body : [body];
  lines.forEach((b, i) => kids.push(P(b, {
    shading: { type: D.ShadingType.CLEAR, fill: CALLBG },
    border: { left: { style: D.BorderStyle.SINGLE, size: 24, color: CALLBR, space: 6 } },
    spacing: { after: i === lines.length - 1 ? 160 : 40 }, indent: { left: 120, right: 120 },
  })));
  return kids;
}

function cell(content, width, o = {}) {
  const paras = (Array.isArray(content) ? content : [content]).map((c) =>
    c instanceof D.Paragraph ? c : new D.Paragraph({
      children: typeof c === "string" ? [T(c, o.run || {})] : c,
      spacing: { after: 0, line: 235, lineRule: D.LineRuleType.AUTO },
    }));
  return new D.TableCell({
    width: { size: width, type: D.WidthType.DXA },
    margins: { top: 70, bottom: 70, left: 100, right: 100 },
    shading: o.fill ? { type: D.ShadingType.CLEAR, fill: o.fill } : undefined,
    children: paras,
  });
}

function table(headers, rows, widths) {
  const total = widths.reduce((a, b) => a + b, 0);
  if (total !== BODY_W) { // normalize
    const f = BODY_W / total;
    widths = widths.map((w) => Math.round(w * f));
    widths[widths.length - 1] += BODY_W - widths.reduce((a, b) => a + b, 0);
  }
  return new D.Table({
    columnWidths: widths,
    width: { size: BODY_W, type: D.WidthType.DXA },
    rows: [
      new D.TableRow({ tableHeader: true, children: headers.map((h, i) => cell([[T(h, { bold: true, size: 19 })]], widths[i], { fill: HDRBG })) }),
      ...rows.map((r) => new D.TableRow({ children: r.map((c, i) => cell(c, widths[i])) })),
    ],
  });
}
const gap = () => P(" ", { spacing: { after: 40 } });

/* ---------------- content ---------------- */
const children = [];

/* Cover */
children.push(
  new D.Paragraph({ spacing: { before: 3200, after: 200 }, children: [T("GRC Mockup", { size: 72, bold: true, color: ACCENT })] }),
  new D.Paragraph({ spacing: { after: 300 }, children: [T("Build Runbook", { size: 44, color: "333B45" })] }),
  P([T("How to construct a convincing, data-rich GRC platform demo from inside the firewall, using only M365 Copilot chat, one small file at a time.", { size: 24, color: INKMUT })], { spacing: { after: 2200 } }),
  P([T("Version 1.0  ·  2026-08-22", { size: 20, color: INKMUT })], { spacing: { after: 60 } }),
  P([T("Companion folder: firewall-kit (CONTRACT.md, SCHEMA.md, PROMPTS.md, WORKSHEET.md, cards/). Full contents reproduced in the Appendices, so this document alone is enough.", { size: 20, color: INKMUT })], { spacing: { after: 60 } }),
  P([T("If you remember nothing about this project, start at Part 0. It is one page.", { size: 20, bold: true })]),
  new D.Paragraph({ children: [new D.PageBreak()] }),
  H2("Table of contents"),
  new D.TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-2" }),
  P([T("In Word: right-click the table and choose Update Field to fill it in.", { italics: true, color: INKMUT, size: 18 })])
);

/* Part 0 */
children.push(H1("Part 0 — What is this, and why am I doing it?"));
children.push(LEAD("What are we building. ", "A working mockup of a GRC platform (governance, risk, and compliance): dashboards, a risk register, controls, framework coverage, policies, issues, assessments, an approvals inbox, a relationship explorer, and a guided presentation mode. It is a folder of small files. You double-click index.html and it runs in Edge. No server, no install, no internet, nothing to deploy."));
children.push(LEAD("Why. ", "We are designing a real GRC. Slides do not persuade anyone, and stakeholders cannot evaluate a design they cannot click. This mockup is a design argument you can click — and because it carries our own data (about 3 MB of it), people will recognize the risks, controls, and policies on screen and finally see how they relate to each other. Showing those relationships is the entire point."));
children.push(LEAD("Why is it built this strange way. ", "Four constraints shaped everything:"));
children.push(BUL([T("The only build tool inside the firewall is M365 Copilot chat. Every file is created by pasting instructions into Copilot and saving what it outputs.")]));
children.push(BUL([T("Copilot becomes unreliable when a file approaches 100 KB. So the app is many small files — a shell, a small kernel, and one file per function — each rebuildable in a single Copilot session.")]));
children.push(BUL([T("Browsers refuse to read .json data files from a local folder, but happily load .js script files. So all data ships as data/*.js files, which Copilot never touches.")]));
children.push(BUL([T("Real data must never leave the network. So all data work happens inside, with a converter tool; everything else is designed to run on synthetic data until the real data is dropped in.")]));
children.push(LEAD("How the work happens. ", "About 20 build sessions with Copilot, each 20–40 minutes, each producing exactly ONE file. In each session you attach three or four small .md instruction files (Copilot accepts up to 20 attachments; it rejects .json and .py, which is why everything attachable is .md), type a four-line standard prompt, copy Copilot's output into Notepad, save it into the demo folder, refresh the browser, and run a short checklist. The instruction files carry all the context, so it does not matter that Copilot remembers nothing between sessions — and it does not matter if YOU remember nothing either. That is what this runbook is for."));
children.push(LEAD("What 'done' looks like. ", "A sidebar with ten modules, live numbers that reconcile with each other, click-through from any record to everything related to it, an approvals queue where things visibly change, and a Present button that walks stakeholders through an eight-scene story."));
children.push(LEAD("Where do I start. ", "Nothing built yet: go to Part 3 (one-time setup). Partly built: open demo\\index.html, click Preflight — it lists every file and its version — then find the first unchecked session in Part 5 and continue. Lost mid-session: re-read Part 4 and start that session over in a fresh Copilot chat; starting over is always safe."));
children.push(...callout("The one-sentence version", "You are a courier between this runbook and Copilot: attach the cards, type the prompt, save the file, run the checks. The thinking has already been done."));

/* Part 1 */
children.push(H1("Part 1 — How the machine works"));
children.push(H2("1.1  The folders"));
children.push(...codeBlock(
`C:\\GRC\\
  demo\\                 THE APP - open index.html here
    index.html           shell: layout, styling, list of script tags
    kernel\\              core.js (brain), ui.js (widgets), charts.js (SVG charts)
    modules\\             one .js file per function (dashboard, risks, ...)
    data\\                one .js file per entity (~3 MB total; never via Copilot)
    tools\\               dataforge.html - CSV converter + synthetic generator
  kit\\                  .md files you ATTACH to Copilot sessions
    CONTRACT.md  SCHEMA.md  PROMPTS.md  WORKSHEET.md  KIT-README.md
    cards\\               one TASK-*.md card per build session
  mirror\\               .md copies of files made just before an EDIT session
  backup\\               dated copies of files about to be overwritten
  LOG.txt                one line per completed session`));
children.push(H2("1.2  How the app runs"));
children.push(P("index.html loads the kernel, then every data file, then every module file, in plain script tags, and calls GRC.boot(). Each module file registers itself with the kernel (its name, its screens); the kernel draws the sidebar from whatever registered, joins all the data in memory, and routes clicks between screens. Integrating a new module is: save the file, add one script tag line to index.html. That one line is the entire assembly step."));
children.push(H2("1.3  Why 20 separate Copilot sessions produce ONE coherent app"));
children.push(P("Two attachments enforce consistency. CONTRACT.md is the law: output format, forbidden things, the exact list of functions and CSS classes a module may use. SCHEMA.md is the truth: every entity, field, vocabulary, relationship, and metric formula. Both are attached to every single session, so every file is built against the same law and the same truth. The TASK card is the work order for that one file. Copilot needs no memory; neither do you."));
children.push(H2("1.4  Glossary"));
children.push(table(["Term", "Meaning"], [
  [["Demo folder"], ["C:\\GRC\\demo — the app itself. Double-click index.html to run it."]],
  [["Kit"], ["C:\\GRC\\kit — the .md files you attach to Copilot. Reproduced in the Appendices."]],
  [["Shell"], ["index.html: page layout, styling, and the list of script tags."]],
  [["Kernel"], ["kernel/*.js: shared brain — routing, data joins, widgets, charts. Built once, modules reuse it."]],
  [["Module"], ["One .js file = one function of the GRC (risk register, policies, ...). One Copilot session each."]],
  [["Data file"], ["data/<entity>.js — holds the records. Produced by DataForge, never by Copilot chat."]],
  [["Entity"], ["A record type: risks, controls, policies, issues, assessments, frameworks, orgUnits, trend."]],
  [["Card"], ["A small .md instruction file. CONTRACT (the law), SCHEMA (the data truth), TASK (one work order)."]],
  [["Session"], ["One Copilot conversation producing one file: attach cards, prompt, save, verify. 20–40 min."]],
  [["Preflight"], ["Diagnostics panel inside the app (top-right button): file versions, record counts, broken links, errors. Green preflight = healthy build."]],
  [["DataForge"], ["tools/dataforge.html — converts CSV exports into data files; also generates the synthetic dataset."]],
  [["Canary"], ["The Phase 1 checklist proving the whole approach works on YOUR machine before real investment."]],
  [["Mirror copy"], ["Before asking Copilot to EDIT a file, save a copy as CURRENT-<name>.md so it can be attached (.js cannot be attached; .md can)."]],
  [["Ceiling"], ["The size limit on a file, from its TASK card (45–90 KB). Beyond ~100 KB Copilot degrades — never let a file get there."]],
  [["Dangling reference"], ["A record pointing at an id that does not exist (e.g. a risk listing a deleted control). Preflight counts them."]],
  [["Synthetic data"], ["Generated fake-but-plausible dataset. The demo runs on it until real exports are converted."]],
  [["Tour"], ["The guided presentation overlay (Present module): eight scripted scenes with next/prev."]],
], [1700, 7660]));
children.push(H2("1.5  The ten golden rules"));
(() => { const i = newSteps();
children.push(STEP([T("One file per session. Never ask Copilot for two things at once (the single flagged exception is card P1-03).")], i));
children.push(STEP([T("Always attach CONTRACT.md and SCHEMA.md. Every session, no exceptions.")], i));
children.push(STEP([T("Always start a NEW Copilot conversation per session. Old chats are never resumed.")], i));
children.push(STEP([T("Never accept placeholders. If the output contains \u201C...\u201D or \u201Crest unchanged\u201D, regenerate. A file is complete or it is rejected.")], i));
children.push(STEP([T("Code never passes through Word. Copilot output goes into Notepad, not into a document. (Card text FROM this document is fine.)")], i));
children.push(STEP([T("Back up before overwriting: copy the old file into backup\\ with the date in the name.")], i));
children.push(STEP([T("Check Preflight after every save. Red means the LAST file you saved. Fix or restore before doing anything else.")], i));
children.push(STEP([T("Regenerate, don't hand-debug. Three failed FIX rounds = start the session over in a fresh chat. Hand-editing is allowed only for script tags in index.html and the ids in the demo SCENES list.")], i));
children.push(STEP([T("Real data never leaves the firewall. The demo is shown from an inside machine or screen-share, never sent out.")], i));
children.push(STEP([T("Log every completed session: one line in LOG.txt (date, file, version, OK). Tomorrow-you will thank you.")], i));
})();

/* Part 2 */
children.push(H1("Part 2 — Your decisions (terms, fields, relationships)"));
children.push(P("Everything below has a working default. If you change nothing, the build succeeds with standard GRC vocabulary and synthetic data. Only D7–D9 genuinely need you, and only when real data arrives. Record decisions where the table says — the cards and worksheets are the single source of truth, not your memory."));
children.push(table(["#", "Decision", "Default (works as-is)", "Record it in"], [
  [["D1"], ["Product name shown in the sidebar"], ["Meridian GRC"], ["Card TASK-P3-03 (write it on the card before the session)"]],
  [["D2"], ["Display terminology (what your org calls Risks, Issues, ...)"], ["Standard GRC labels"], ["WORKSHEET W1, then run session P2-01"]],
  [["D3"], ["Scoring scale"], ["5x5, likelihood x impact"], ["WORKSHEET W2, then P2-01"]],
  [["D4"], ["Severity bands and colors"], ["Low 1–4, Moderate 5–9, High 10–15, Critical 16–25"], ["WORKSHEET W2, then P2-01"]],
  [["D5"], ["Risk categories"], ["Strategic, Operational, Financial, Compliance, Technology, Third-Party, People"], ["SCHEMA.md via P2-01"]],
  [["D6"], ["Frameworks shown"], ["NIST CSF 2.0 + ISO 27001:2022 subsets"], ["SCHEMA.md via P2-01"]],
  [["D7"], ["Which column in YOUR exports feeds each field"], ["— (needed only for real data)"], ["WORKSHEET W3; used live inside DataForge"]],
  [["D8"], ["Which relationships exist in your exports (risk→controls, issue→risk, ...)"], ["All assumed present; missing ones just show fewer connections"], ["WORKSHEET W4; used inside DataForge"]],
  [["D9"], ["Masking of sensitive fields"], ["Owner names/emails become role labels"], ["WORKSHEET W6; applied in DataForge step 4"]],
  [["D10"], ["The four featured records in the presentation"], ["Any well-connected synthetic ids"], ["WORKSHEET W7, then card TASK-M-DEMO"]],
], [500, 2600, 3260, 3000]));
children.push(...callout("Field names are frozen", "Your org's words change LABELS only (what the screen says). The underlying field and entity names in SCHEMA.md never change — every file already built depends on them. Session P2-01 enforces this automatically."));

/* Part 3 */
children.push(H1("Part 3 — One-time setup (Day 0)"));
children.push(H2("3.1  Prepare the machine (10 minutes)"));
(() => { const i = newSteps();
children.push(STEP([T("In File Explorer: View menu → check \u201CFile name extensions\u201D. Without this you will save core.js.txt by accident and nothing will load.")], i));
children.push(STEP([T("Create the folder tree from section 1.1 exactly: C:\\GRC with demo (and kernel, modules, data, tools inside it), kit (and cards inside it), mirror, backup. If C:\\ is locked down, use your Documents folder — but avoid OneDrive-synced locations if you can; if unavoidable, pause syncing during sessions.")], i));
children.push(STEP([T("Create an empty LOG.txt in C:\\GRC.")], i));
children.push(STEP([T("Confirm you can open Notepad and save a file with an arbitrary extension: save a file named test.js containing hello, confirm Explorer shows it as .js (not .js.txt), then delete it. When saving in Notepad, put the filename in quotes — \u201Ccore.js\u201D — and keep encoding UTF-8.")], i));
})();
children.push(H2("3.2  Get the kit onto the machine (20–40 minutes, once)"));
children.push(P("The kit is 25 small .md files: CONTRACT.md, SCHEMA.md, PROMPTS.md, WORKSHEET.md, KIT-README.md in kit\\, and 20 TASK cards in kit\\cards\\. Their complete contents are in the Appendices of this document. Use whichever path works:"));
children.push(BUL([T("Option A — files can be copied in: copy the firewall-kit folder contents into C:\\GRC\\kit. Done.")]));
children.push(BUL([T("Option B — only this document made it in: for each appendix, select its text, paste into Notepad, save with the exact filename shown at the top of the appendix, UTF-8, into kit\\ or kit\\cards\\.")]));
children.push(BUL([T("Option C — this document is attached to Copilot: attach the .docx and prompt: \u201COutput the exact contents of Appendix A (CONTRACT.md) from the attached document as one fenced code block, preserving every line.\u201D Copy the block into Notepad and save. Repeat per appendix. Spot-check that quotes came through as straight quotes.")]));
children.push(P("Whichever path: when finished, kit\\ has 5 files and kit\\cards\\ has 20. That inventory is your check."));
children.push(H2("3.3  Sessions 1–3: build the skeleton"));
children.push(P("Now run your first three build sessions using the standard recipe in Part 4, in this order: TASK-P1-01 (index.html), TASK-P1-02 (kernel/core.js), TASK-P1-03 (hello module + sample data). Read Part 4 first — then it is mechanical."));
children.push(H2("3.4  The canary — do not skip"));
children.push(P("After session 3, run the five acceptance checks on card TASK-P1-03 (table renders, clicks navigate, filter works, Preflight green, hand-edit round-trip works). All five passing proves the entire approach on YOUR machine: local files load, scripts run, the save-refresh loop works. If any check fails, go to Part 7 before building anything else — better to discover a blocked environment on day one than in week three."));

/* Part 4 */
children.push(H1("Part 4 — The standard session recipe"));
children.push(P("Every build session is this same loop. Laminate this page mentally."));
(() => { const i = newSteps();
children.push(STEP([T("Pick the next unchecked session in Part 5. Its row names the TASK card, the prompt type (BUILD or EDIT), and the file you will save.")], i));
children.push(STEP([T("EDIT sessions only: make the mirror copy. Open the current file in Notepad → Save As into C:\\GRC\\mirror with .md stuck on a hyphenated name: core.js becomes CURRENT-core-js.md, index.html becomes CURRENT-index-html.md, dataforge.html becomes CURRENT-dataforge-html.md. (Copilot rejects .js attachments; it accepts .md.)")], i));
children.push(STEP([T("Open a NEW Copilot chat.")], i));
children.push(STEP([T("Attach: kit\\CONTRACT.md + kit\\SCHEMA.md + the session's TASK card (+ the CURRENT-*.md mirror for EDIT sessions).")], i));
children.push(STEP([T("Type the BUILD or EDIT prompt from kit\\PROMPTS.md (they are four lines; copy them verbatim). Send.")], i));
children.push(STEP([T("Wait for one fenced code block containing the whole file. If the reply ends with the word CONTINUES, send the CONTINUE prompt naming the last SECTION marker, and join the pieces in Notepad — delete the duplicated marker line at the seam.")], i));
children.push(STEP([T("Inspect before saving — 60 seconds: line 1 is the version header with today's date and the right path? No \u201C...\u201D, no \u201Crest unchanged\u201D, no TODO? No http:// or https:// anywhere? No curly quotes in code? Wrong → send the FIX prompt or regenerate; do not save garbage.")], i));
children.push(STEP([T("Overwriting an existing file? Copy the old one into backup\\ first, date in the name (core-2026-09-04.js).")], i));
children.push(STEP([T("Copy the code block into Notepad. Save As, filename in quotes exactly as the card says, UTF-8, into the folder the card says.")], i));
children.push(STEP([T("Brand-new file? Add its script tag line to index.html in the commented script list (data files before module files; the card reminds you).")], i));
children.push(STEP([T("Refresh index.html in Edge (F5). Open Preflight. New file listed with the right version? Errors list empty?")], i));
children.push(STEP([T("Run the card's ACCEPTANCE checks, top to bottom. All pass → add a line to LOG.txt (\u201C2026-09-04 core.js v2.0.0 OK\u201D) and you are done.")], i));
children.push(STEP([T("A check fails → send the FIX prompt quoting the failed check and what you see. You get a whole corrected file; repeat from step 7. Three failed FIX rounds → close the chat and rerun the session fresh (attach the same files); still failing → restore the backup, log the failure, and consult Part 7.")], i));
})();
children.push(...callout("Why so rigid", "The rigidity is the feature. Any session can be run cold, by anyone, on any day, with zero memory of the project — because the cards carry the context and this loop never varies."));

/* Part 5 */
children.push(H1("Part 5 — The build sequence"));
children.push(P("Phases 1–3 are strictly in order (each file depends on the previous). After Phase 3, module order is free — the listed order builds the demo's story best. Tick the box in the margin when a session's acceptance passes; LOG.txt is the backup record. Every phase ends with something you can show."));
const sessTable = (rows) => table(["Done", "Session", "Card (kit\\cards\\)", "Type", "You save", "Done when"], rows, [560, 760, 2360, 700, 2280, 2700]);
children.push(H2("Phase 1 — Skeleton and canary (sessions 1–3)"));
children.push(sessTable([
  [["[  ]"], ["1"], ["TASK-P1-01-index.md"], ["BUILD"], ["demo\\index.html"], ["Page frame renders; only expected missing-file errors"]],
  [["[  ]"], ["2"], ["TASK-P1-02-core.md"], ["BUILD"], ["demo\\kernel\\core.js"], ["Boots clean once session 3 exists"]],
  [["[  ]"], ["3"], ["TASK-P1-03-hello.md"], ["BUILD"], ["demo\\modules\\hello.js + demo\\data\\sample.js"], ["ALL FIVE canary checks pass (3.4)"]],
]));
children.push(P([T("You now have: ", { bold: true }), T("a booting app with navigation, routing, an org filter, and a Preflight panel — proof the whole method works here.")]));
children.push(H2("Phase 2 — Data pipeline (sessions 4–7)"));
children.push(sessTable([
  [["[  ]"], ["4 (opt)"], ["TASK-P2-01-schema-update.md"], ["special"], ["kit\\SCHEMA.md (replaces)"], ["Only labels/vocab/bands changed; skip if all defaults accepted"]],
  [["[  ]"], ["5"], ["TASK-P2-02-dataforge.md"], ["BUILD"], ["demo\\tools\\dataforge.html"], ["3-row CSV test walks all five steps"]],
  [["[  ]"], ["6"], ["TASK-P2-03-dataforge-generator.md"], ["EDIT"], ["demo\\tools\\dataforge.html"], ["Seeded generation reproducible"]],
  [["[  ]"], ["—"], ["(no Copilot: use DataForge)"], ["task"], ["8 files into demo\\data\\ + 8 script tags; delete sample.js and its tag"], ["Preflight: all entities, correct counts"]],
  [["[  ]"], ["7"], ["TASK-P2-04-core-v2.md"], ["EDIT"], ["demo\\kernel\\core.js"], ["Links/metrics/search live; tour test works; zero dangling refs on synthetic data"]],
]));
children.push(P([T("You now have: ", { bold: true }), T("a full-scale, fully-linked synthetic dataset and a kernel that can join, filter, and measure it. Real data can now be loaded any time via Part 6 — no session depends on it.")]));
children.push(H2("Phase 3 — Look, feel, and the first wow (sessions 8–11)"));
children.push(sessTable([
  [["[  ]"], ["8"], ["TASK-P3-01-ui.md"], ["BUILD"], ["demo\\kernel\\ui.js"], ["Console toast/drawer test passes"]],
  [["[  ]"], ["9"], ["TASK-P3-02-charts.md"], ["BUILD"], ["demo\\kernel\\charts.js"], ["Console heatmap/bar/line/donut tests pass"]],
  [["[  ]"], ["10"], ["TASK-P3-03-index-v2.md"], ["EDIT"], ["demo\\index.html"], ["Looks like one product; print preview clean"]],
  [["[  ]"], ["11"], ["TASK-P3-04-dashboard.md"], ["BUILD"], ["demo\\modules\\dashboard.js"], ["KPIs reconcile with Preflight counts"]],
]));
children.push(P([T("You now have: ", { bold: true }), T("a stakeholder-showable executive dashboard. This is the earliest point worth demoing to a sponsor.")]));
children.push(H2("Phases 4–8 — The wings (sessions 12–20)"));
children.push(sessTable([
  [["[  ]"], ["12"], ["TASK-M-RISKS.md"], ["BUILD"], ["demo\\modules\\risks.js"], ["Heatmap drill-through works; retire hello.js tag after"]],
  [["[  ]"], ["13"], ["TASK-M-CONTROLS.md"], ["BUILD"], ["demo\\modules\\controls.js"], ["Cross-links to/from risks work"]],
  [["[  ]"], ["14"], ["TASK-M-COMPLIANCE.md"], ["BUILD"], ["demo\\modules\\compliance.js"], ["Coverage matches dashboard donuts"]],
  [["[  ]"], ["15"], ["TASK-M-POLICIES.md"], ["BUILD"], ["demo\\modules\\policies.js"], ["Review cycle actions work"]],
  [["[  ]"], ["16"], ["TASK-M-ISSUES.md"], ["BUILD"], ["demo\\modules\\issues.js"], ["Aging tiles reconcile; links navigate"]],
  [["[  ]"], ["17"], ["TASK-M-ASSESSMENTS.md"], ["BUILD"], ["demo\\modules\\assessments.js"], ["Findings link to issues"]],
  [["[  ]"], ["18"], ["TASK-M-WORKFLOW.md"], ["BUILD"], ["demo\\modules\\workflow.js"], ["Role queues act and numbers move; Reset restores"]],
  [["[  ]"], ["19"], ["TASK-M-EXPLORER.md"], ["BUILD"], ["demo\\modules\\explorer.js"], ["Any record maps its two-ring neighborhood"]],
  [["[  ]"], ["20"], ["TASK-M-DEMO.md"], ["BUILD"], ["demo\\modules\\demo.js"], ["Eight-scene tour runs end to end (fill W7 ids on the card FIRST)"]],
]));
children.push(P([T("You now have: ", { bold: true }), T("the complete mockup. Remaining work is data (Part 6) and rehearsal (Part 8). Optional extensions if asked: a vendor-risk module and a printable board pack — write their cards by copying the closest existing card's pattern.")]));

/* Part 6 */
children.push(H1("Part 6 — Loading the real data"));
children.push(P("Do this any time after session 7. Nothing else changes: modules cannot tell synthetic from real. Budget a half day for the first full pass."));
children.push(H2("6.1  Get exports"));
children.push(P("From the current systems/spreadsheets, export one CSV per entity you have (risks, controls, policies, issues, assessments, org units, framework mappings). Excel: File → Save As → \u201CCSV UTF-8\u201D. Fill WORKSHEET W3 (which of your columns feeds which field) and W4 (which relationships your data actually carries) as you go — DataForge will ask exactly those questions."));
children.push(H2("6.2  Convert, in dependency order"));
(() => { const i = newSteps();
children.push(STEP([T("Open demo\\tools\\dataforge.html. Import any previously exported data\\*.js files first (\u201CImport existing\u201D) so cross-entity checks work.")], i));
children.push(STEP([T("Convert in this order, so references can be validated: orgUnits → frameworks/requirements → controls → risks → policies → assessments → issues. For each: Load CSV → Map columns (W3) → Validate → Mask (W6) → Export.")], i));
children.push(STEP([T("Read each validation report. Dangling references and unmapped statuses are listed with row numbers — fix the mapping, or accept and move on (a FEW orphans are harmless; the related panels just show less).")], i));
children.push(STEP([T("Trend: if you have no history export, load everything else, then use \u201CBackfill trend from loaded data\u201D.")], i));
})();
children.push(H2("6.3  Swap and verify"));
(() => { const i = newSteps();
children.push(STEP([T("Copy the whole current demo\\data\\ folder into backup\\ (this is your instant rollback).")], i));
children.push(STEP([T("Move the newly exported files into demo\\data\\, replacing the synthetic ones. Filenames are identical, so index.html needs no changes.")], i));
children.push(STEP([T("Refresh. Preflight: every entity listed with plausible counts; read the data-health section. Skim every module for five minutes.")], i));
children.push(STEP([T("Update the presentation: pick the four featured records (W7) — use the Explorer to find well-connected ones — and put their ids into the SCENES list at the top of modules\\demo.js by hand (this hand-edit is allowed), or rerun session 20 with the filled card.")], i));
})();
children.push(...callout("Sensitivity", ["Masking (owner names → roles) happened in DataForge if you chose it in W6. Real data stays on inside machines; present from one of them or via screen-share. The kit, this runbook, and the synthetic dataset are the only things that ever exist outside."]));

/* Part 7 */
children.push(H1("Part 7 — When things break"));
children.push(P("First rule: the problem is almost always the LAST file you saved. Second rule: regenerating a file from its card in a fresh chat fixes 90% of everything — the cards are the source of truth, files are disposable."));
children.push(table(["Symptom", "Likely cause", "Fix"], [
  [["Page is completely blank"], ["JavaScript crash in the last saved file"], ["F12 → Console → first red line names the file. Restore its backup, or regenerate it from its card."]],
  [["Console: Failed to load ... ERR_FILE_NOT_FOUND"], ["Script tag path doesn't match the filename, or the file saved as name.js.txt"], ["Check Explorer (extensions visible per 3.1); fix the name or the tag."]],
  [["Console: Refused to execute script (MIME)"], ["Wrong file extension"], ["Rename to .js exactly."]],
  [["SyntaxError: Invalid or unexpected token"], ["Curly quotes crept into code"], ["One or two: fix by hand in Notepad. More: regenerate — and check you didn't route code through Word."]],
  [["Module missing from the sidebar"], ["Its script tag is missing, or the file crashed before register()"], ["Add the tag; else console/Preflight names the error."]],
  [["An entity shows 0 records"], ["Data file overwritten badly or entity key misspelled inside it"], ["Preflight data table shows what registered; re-export from DataForge."]],
  [["Preflight lists many dangling references"], ["Real-data FK columns mapped wrong (ids vs names), or W4 said a link exists that doesn't"], ["Re-run that entity through DataForge with the mapping corrected. A handful of orphans is fine."]],
  [["Copilot's reply cut off mid-file"], ["Response limit"], ["Send the CONTINUE prompt with the last SECTION marker; stitch in Notepad."]],
  [["Copilot ignores the contract / invents libraries / refuses"], ["Session drift"], ["New chat, re-attach, resend. Persists → do the card in two halves: BUILD the first half of the SPEC, then EDIT in the rest."]],
  [["Copilot says the file is too long to produce"], ["Spec vs ceiling tension"], ["Accept the split the card names (every big card pre-authorizes one). Never accept a truncated file instead."]],
  [["A file crossed its ceiling"], ["Feature creep across FIX rounds"], ["EDIT session: \u201Creduce size, keep behavior identical\u201D, or take the card's split."]],
  [["Filter shows nothing anywhere"], ["Org-unit filter set to a unit with no records"], ["Set it back to All org units."]],
  [["Demo must run on a different machine"], ["—"], ["Copy the whole C:\\GRC folder. It is fully self-contained."]],
  [["The canary itself fails (3.4)"], ["Endpoint policy blocks local scripts"], ["Try a non-synced folder (not Downloads/Desktop); right-click each file → Properties → Unblock if shown. Still blocked: STOP and talk to IT about a sanctioned local-web location — do not build further until the canary passes."]],
], [2340, 2760, 4260]));

/* Part 8 */
children.push(H1("Part 8 — Demo day"));
children.push(H2("The day before"));
(() => { const i = newSteps();
children.push(STEP([T("Full rehearsal: run all eight tour scenes, clicking everything you plan to click.")], i));
children.push(STEP([T("Preflight green, zero errors. Fix or restore anything red today, not tomorrow.")], i));
children.push(STEP([T("Copy C:\\GRC to a second location (or the presentation machine) — the folder is the whole app.")], i));
children.push(STEP([T("Reset demo data (Approvals → Reset) so yesterday's clicking isn't on screen.")], i));
})();
children.push(H2("In the room"));
(() => { const i = newSteps();
children.push(STEP([T("Open index.html before the meeting; F11 full screen; close everything else.")], i));
children.push(STEP([T("Open with the Part 0 framing: \u201Cthis is a clickable design proposal carrying our real data — watch how everything connects.\u201D")], i));
children.push(STEP([T("Drive from the Present module. Off-script questions: Exit the tour, click wherever the question leads (the Explorer is your friend), restart the tour at will.")], i));
children.push(STEP([T("If a screen ever fails, click a different module and keep talking — modules are isolated by design.")], i));
children.push(STEP([T("Afterwards: Reset demo data, and write down every \u201Ccould it also...\u201D question — those are the requirements for the real platform. That list is why this demo exists.")], i));
})();

/* Appendices */
children.push(H1("Appendices — the kit, verbatim"));
children.push(P("Each appendix is the exact content of one kit file. The filename to save it as is in the heading. Everything here is ASCII with straight quotes — preserve that when copying."));
const app = (label, file, sub) => {
  const full = path.join(KIT, file);
  const txt = fs.readFileSync(full, "utf8");
  const name = path.basename(file);
  const out = [H2(`Appendix ${label} — ${name}`)];
  if (sub) out.push(P([T(sub, { italics: true, color: INKMUT })]));
  out.push(P([T(`Save as: kit\\${file.replace("/", "\\")}`, { bold: true, ...MONO })], { spacing: { after: 100 } }));
  out.push(...codeBlock(txt));
  out.push(gap());
  return out;
};
children.push(...app("A", "CONTRACT.md", "Attached to every session. The law."));
children.push(...app("B", "SCHEMA.md", "Attached to every session. The data truth: entities, relationships, metrics."));
children.push(...app("C", "PROMPTS.md", "The only four prompts you ever type."));
children.push(...app("D", "WORKSHEET.md", "Where your terms, mappings, and choices are recorded."));
children.push(...app("E", "KIT-README.md", "Orientation note that lives in the kit folder."));
children.push(H2("Appendix F — Task cards (kit\\cards\\)"));
children.push(P("One card per session, in build order."));
const cardOrder = [
  "TASK-P1-01-index.md", "TASK-P1-02-core.md", "TASK-P1-03-hello.md",
  "TASK-P2-01-schema-update.md", "TASK-P2-02-dataforge.md",
  "TASK-P2-03-dataforge-generator.md", "TASK-P2-04-core-v2.md",
  "TASK-P3-01-ui.md", "TASK-P3-02-charts.md", "TASK-P3-03-index-v2.md",
  "TASK-P3-04-dashboard.md", "TASK-M-RISKS.md", "TASK-M-CONTROLS.md",
  "TASK-M-COMPLIANCE.md", "TASK-M-POLICIES.md", "TASK-M-ISSUES.md",
  "TASK-M-ASSESSMENTS.md", "TASK-M-WORKFLOW.md", "TASK-M-EXPLORER.md",
  "TASK-M-DEMO.md",
];
cardOrder.forEach((f, idx) => {
  const txt = fs.readFileSync(path.join(KIT, "cards", f), "utf8");
  children.push(H3(`F.${idx + 1}  ${f}`));
  children.push(P([T(`Save as: kit\\cards\\${f}`, { bold: true, ...MONO })], { spacing: { after: 100 } }));
  children.push(...codeBlock(txt));
  children.push(gap());
});

/* ---------------- document ---------------- */
const doc = new D.Document({
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: "Calibri", size: 21 }, paragraph: { spacing: { line: 264, lineRule: D.LineRuleType.AUTO } } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: "Calibri", size: 34, bold: true, color: ACCENT },
        paragraph: { spacing: { before: 240, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: "Calibri", size: 26, bold: true, color: "2A3540" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: "Calibri", size: 22, bold: true, color: ACCENT },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bul", levels: [{ level: 0, format: D.LevelFormat.BULLET, text: "\u2013", alignment: D.AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 220 } } } }] },
      { reference: "steps", levels: [{ level: 0, format: D.LevelFormat.DECIMAL, text: "%1.", alignment: D.AlignmentType.LEFT, style: { paragraph: { indent: { left: 460, hanging: 300 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } },
    },
    headers: {
      default: new D.Header({ children: [new D.Paragraph({ alignment: D.AlignmentType.RIGHT, children: [T("GRC Mockup — Build Runbook v1.0", { size: 16, color: INKMUT })] })] }),
    },
    footers: {
      default: new D.Footer({ children: [new D.Paragraph({ alignment: D.AlignmentType.CENTER, children: [T("Page ", { size: 16, color: INKMUT }), new D.TextRun({ children: [D.PageNumber.CURRENT], size: 16, color: INKMUT }), T(" of ", { size: 16, color: INKMUT }), new D.TextRun({ children: [D.PageNumber.TOTAL_PAGES], size: 16, color: INKMUT })] })] }),
    },
    children,
  }],
});

D.Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT, buf);
  console.log("Wrote", OUT, buf.length, "bytes");
});
