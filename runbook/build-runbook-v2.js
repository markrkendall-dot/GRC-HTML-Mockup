/* Builds GRC-Mockup-Runbook.docx v2 (as-built system, release R9).
   Run: node build-runbook-v2.js   (docx npm package required) */
"use strict";
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  TableOfContents, PageBreak, LevelFormat, Header, Footer, PageNumber
} = require("docx");
const fs = require("fs");

const MONO = "Consolas";
const BODY = "Calibri";
const RED = "B01E24";
const GRAY = "6A7280";

function p(text, opts) {
  opts = opts || {};
  return new Paragraph({
    spacing: { after: opts.after === undefined ? 120 : opts.after },
    children: [new TextRun({ text: text, font: BODY, size: opts.size || 22, bold: opts.bold, italics: opts.italics, color: opts.color })]
  });
}
function rich(runs, after) {
  return new Paragraph({
    spacing: { after: after === undefined ? 120 : after },
    children: runs.map(r => new TextRun({ font: r.mono ? MONO : BODY, size: r.mono ? 19 : 22, text: r.t, bold: r.b, italics: r.i, color: r.c }))
  });
}
function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 280, after: 160 }, children: [new TextRun({ text: text, font: BODY, color: RED, size: 32, bold: true })] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 220, after: 120 }, children: [new TextRun({ text: text, font: BODY, size: 26, bold: true })] });
}
function bullet(text, level) {
  return new Paragraph({
    numbering: { reference: "bullets", level: level || 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text: text, font: BODY, size: 22 })]
  });
}
function num(text) {
  return new Paragraph({
    numbering: { reference: "steps", level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text: text, font: BODY, size: 22 })]
  });
}
function mono(lines) {
  return lines.map(function (ln, i) {
    return new Paragraph({
      spacing: { after: i === lines.length - 1 ? 140 : 20 },
      shading: { type: ShadingType.CLEAR, fill: "F2F4F6" },
      children: [new TextRun({ text: ln.length ? ln : " ", font: MONO, size: 18 })]
    });
  });
}
function cell(text, opts) {
  opts = opts || {};
  return new TableCell({
    width: { size: opts.w, type: WidthType.DXA },
    shading: opts.head ? { type: ShadingType.CLEAR, fill: "F2E3E4" } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: text, font: opts.mono ? MONO : BODY, size: opts.mono ? 18 : 20, bold: opts.head })] })]
  });
}
function table(widths, rows) {
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: widths,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "D9DDE3" }, bottom: { style: BorderStyle.SINGLE, size: 4, color: "D9DDE3" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "D9DDE3" }, right: { style: BorderStyle.SINGLE, size: 4, color: "D9DDE3" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "D9DDE3" }, insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "D9DDE3" }
    },
    rows: rows.map(function (r, ri) {
      return new TableRow({
        children: r.map(function (c, ci) { return cell(c, { w: widths[ci], head: ri === 0, mono: ri > 0 && r === rows[ri] && false }); })
      });
    })
  });
}
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }

const body = [];

/* ===== COVER ===== */
body.push(new Paragraph({ spacing: { before: 2400, after: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "GRC MOCKUP", font: BODY, size: 64, bold: true, color: RED })] }));
body.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: "Operating Runbook, version 2", font: BODY, size: 34 })] }));
body.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: "As built through release R10: capabilities 1 through 5, nine demos, the feedback loop, the work list, and the DataForge real-data pipeline", font: BODY, size: 22, color: GRAY })] }));
body.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: "2026-08-24. Supersedes runbook v1 (planning phase) entirely.", font: BODY, size: 20, color: GRAY })] }));
body.push(pageBreak());

/* ===== TOC ===== */
body.push(p("CONTENTS", { bold: true, size: 26, after: 160 }));
body.push(new TableOfContents("Contents", { hyperlink: true, headingStyleRange: "1-2" }));
body.push(pageBreak());

/* ===== PART 0 ===== */
body.push(h1("Part 0. Read this first (especially if you remember nothing)"));
body.push(p("This binder assumes total amnesia. If you have forgotten everything: you built a clickable HTML mockup of your bank's future GRC platform (Governance, Risk and Compliance, the RCSA tool) to drive design decisions with stakeholders. It is not software to ship; it is an argument you can click. It runs entirely from local files in a browser, on synthetic data shaped like the real inventory, and every screen exists to settle a design question in a meeting room."));
body.push(p("The build happened OUTSIDE the firewall with a capable AI assistant across ten releases (R1 through R10). Inside the firewall you have only Microsoft 365 Copilot chat, which accepts up to 20 attached files, refuses .js and .py attachments (use .md mirrors), and degrades on files near 100 KB. Everything about this project is engineered around those constraints: small files, .md contract cards, one file per session, versions on everything. The one job that needs no Copilot at all is data: DataForge (demo\\tools\\dataforge.html) converts your CSV exports into data files entirely in the browser."));
body.push(h2("What exists right now"));
body.push(bullet("Capabilities 1 through 5, built end to end: RAU inventory and pipeline, risk identification, evidence-anchored inherent ratings, controls with derived key status, and the living RCSA with annual affirmation, challenge, and residual risk."));
body.push(bullet("Nine guided demos behind the Present button, including one demo per role and the One-risk-front-to-back money path."));
body.push(bullet("A feedback pill on every page that records the page and file with each item, and a My-list work cart that collects tasks as you browse."));
body.push(bullet("Synthetic data at true scale: 850 RAUs, 90 risk events, 8,000 MCRs, about 2,900 confirmed risk instances, 5,100 controls, 375 affirmation records."));
body.push(bullet("DataForge (demo\\tools\\dataforge.html): the real-data pipeline. Load a CSV export, map your columns to the schema, validate (with a dangling-reference report), mask people names, download a ready data file. Offline like the app; has a one-click self-test."));
body.push(bullet("Capabilities 6 through 10 are recognized on the home map but not built; the trace strip and the lens keep that honest on every screen."));
body.push(h2("The sixty-second start"));
body.push(num("Unpack the workspace ZIP (this folder) somewhere writable, keeping the layout."));
body.push(num("Open demo\\index.html in Edge. The red banner shows the release number (R10)."));
body.push(num("Click Present (guided demo) in the left rail and start the Full walkthrough."));
body.push(num("When someone reacts to anything, click the red feedback pill, bottom left."));
body.push(p("Everything else in this book is detail on those four steps."));

/* ===== PART 1 ===== */
body.push(h1("Part 1. What you are holding: the workspace"));
body.push(table([2400, 6800], [
  ["Folder", "What it is"],
  ["demo\\", "THE APP. index.html plus kernel\\ (4 files), modules\\ (14 files), data\\ (16 files). Open index.html; there is no install and no network."],
  ["demo\\tools\\", "DataForge (dataforge.html): the CSV-to-data-file converter for real data. Standalone page, offline, never loaded by the app itself."],
  ["kit\\", "The firewall kit v2: the .md cards you attach to Copilot sessions. Start with KIT-README.md."],
  ["kit\\cards\\", "One TASK card per kind of job: edit a module, run a feedback round, swap real data, add a module, plus the per-item FB template."],
  ["data-staging\\", "Where raw CSV exports land before conversion. templates\\ holds one CSV per entity with the exact expected columns."],
  ["releases\\", "Frozen numbered copies (R1, R2, ...). Reviewers only ever open these; demo\\ is the workbench."],
  ["mirror\\", ".md copies of files made just before an EDIT session (Copilot will not take .js)."],
  ["backup\\", "Dated copies of files about to be overwritten."],
  ["logs\\", "FEEDBACK.md (the register), CHANGELOG.md (per release), LOG.txt (one line per session)."],
  ["GRC-Mockup-Runbook.docx", "This book."]
]));
body.push(p(" ", { after: 40 }));
body.push(p("Rule one, repeated everywhere: users only ever see releases\\R<n>\\. Rule two: every change is a numbered release with a changelog entry. Rule three: never hand-edit what a generator or Copilot session owns; rerun the session instead.", { italics: true }));

/* ===== PART 2 ===== */
body.push(h1("Part 2. Running the demo"));
body.push(h2("The chrome"));
body.push(p("Red banner: search box, release chip (quote it in every piece of feedback), the View-as role picker (RAU Owner, Owner Delegate, BCM Contact, ORBO, BACO, RCSA RAU Governance), and Preflight. Tabs: Home and RCSA are live; Signals, Testing, Monitoring, Policy show honest SOON pages for capabilities 6 through 10. Under the tabs, the capability trace strip names the capability behind every screen (built on / will feed); key actions pulse their chip. Left rail: Always-available links on top (My Work, Present, About/Preflight), then the tab's contextual entries numbered in process order."));
body.push(h2("The nine demos (Present, in the rail)"));
body.push(table([2600, 6600], [
  ["Demo", "Use it when"],
  ["Full walkthrough (21 scenes)", "First contact with any audience: capabilities 1 through 5 end to end."],
  ["Birth of a RAU (8)", "Proving the order of operations: intake, uniqueness, mapping, standards, governance with the five roles, metadata, active, risk identification."],
  ["One risk, front to back (8)", "The money path on one instance: confirm, rate, mitigate, residual, challenge, answer, affirm. Best single demo for executives."],
  ["Six role demos", "One per View-as role; scene one switches the banner role. Use when a specific team asks what is in it for me."]
]));
body.push(p(" ", { after: 40 }));
body.push(p("The overlay drives navigation but never locks the screen: presenters can go off script, click anything, and restart. After playing with actions, Preflight has Reset demo data."));
body.push(h2("The feedback pill and My list"));
body.push(p("Bottom left, every page: Provide Feedback for this Demo. The drawer captures I-do-not-like-this / change-it-to-that and records the page route and source file with each item, so the fixing session knows exactly where to go. Gallery votes (Keep / Discuss / Cut) ride along with the export. Bottom right: My list, a shopping cart for work. + My list buttons sit on gaps, unrated instances, challenges, and affirmations; the drawer shows what you collected, marks items that look finished, and Work-through mode walks the list item by item."));
body.push(h2("Preflight"));
body.push(p("The Preflight button opens the health panel: any trapped errors, the live version matrix of every file and data entity, and the reset. Zero errors is the shipping bar; if a reviewer sees the button turn into an error count, screenshot it into feedback."));

/* ===== PART 3 ===== */
body.push(h1("Part 3. How the system is put together"));
body.push(h2("Three layers, one contract"));
body.push(p("kernel\\ owns the machine: routing, data indexing and the data API, state, the capability model and trace, the tour, feedback, and the work cart (core.js); all standardized math (engine.js); shared widgets (ui.js, charts.js). modules\\ are one file per screen family and may only use the contract in kit\\CONTRACT.md. data\\ is plain script files assigning window.GRC_DATA; the kernel clones it at boot, so every session action is reversible by reset."));
body.push(h2("The honest-math doctrine"));
body.push(p("Everything presented as the assistant is deterministic computation over real fields: applicability scoring against the published rubric, uniqueness token overlap, the inherent-rating suggestions with evidence chips naming their sources, derived key status from four rules, the residual knockdown, the 2LOD attention ranking. No canned magic; every number can be defended in a room, which is the point of the mockup. The math lives in kernel\\engine.js and is documented as spec in kit\\ENGINE.md; three calculations are mirrored in the data generator so shipped data reconciles with live recomputation."));
body.push(h2("The living record"));
body.push(p("There is no assessment cycle. Facts are stored (instances, ratings, links, challenges, affirmation signatures); judgments are computed on demand (bands, key status, environment strength, residual, affirmation state, attention). Every mutation goes through a data-API mutator that queues a human-readable change on the RAU, which the owner adopts and annually affirms. That is why screens always agree with each other."));

/* ===== PART 4 ===== */
body.push(h1("Part 4. The operating rhythm: feedback to release"));
body.push(p("Proven over R2 through R9. The full checklist is kit\\cards\\TASK-FEEDBACK-ROUND.md; this is the shape:"));
body.push(num("COLLECT: reviewers use the pill where the problem lives and send you the drawer export."));
body.push(num("REGISTER: append items to logs\\FEEDBACK.md as FB-<n>. States move one way: NEW, then ACCEPTED or DECLINED with a dated reason, then BUILT (file and versions), then RELEASED (R number). Never renumber, never delete."));
body.push(num("BUILD: one Copilot EDIT session per touched module, driven by a filled FB card."));
body.push(num("GATE: Preflight clean, changed screens walked, release.js bumped, CHANGELOG block written, FB items flipped, demo\\ copied to releases\\R<n>\\."));
body.push(num("ANNOUNCE: the release number, the headlines, and where each FB item landed."));
body.push(p("A release is small and frequent rather than large and rare. Nine releases in, the pattern holds: every complaint becomes a numbered item, every item has a fate, and nobody argues about which version they saw because the number is in the banner."));

/* ===== PART 5 ===== */
body.push(h1("Part 5. Working with Copilot inside the firewall"));
body.push(p("The kit exists because Copilot is your only tool inside. Its constraints and the countermeasures:"));
body.push(table([3400, 5800], [
  ["Constraint", "Countermeasure"],
  ["20 attached files maximum", "A session needs 4: CONTRACT + SCHEMA or ENGINE + TASK card + the CURRENT mirror."],
  ["No .js or .py attachments", "Copy the file to mirror\\CURRENT-<name>.md before the session."],
  ["Output degrades near 100 KB", "Ceilings per file (default 55 KB); the CONTINUES protocol for long files."],
  ["Loses the thread across turns", "One file per session, new conversation every time, prompts copied verbatim from PROMPTS.md."],
  ["Invents APIs when unsupervised", "The contract forbids anything not in CONTRACT/SCHEMA/ENGINE/TASK; the FIX prompt corrects instead of hand-patching."]
]));
body.push(p(" ", { after: 40 }));
body.push(h2("The everyday session, end to end"));
body.push(num("Pick the file with kit\\MODULES.md. Back it up; mirror it to .md."));
body.push(num("Fill kit\\cards\\TASK-EDIT-MODULE.md: one concrete change, the do-not-touch list, the ceiling."));
body.push(num("New Copilot chat. Attach the 4 files. Paste the EDIT prompt from PROMPTS.md."));
body.push(num("Save the output over the original. Run the acceptance list on the card (version header, ASCII, Preflight, walk the screen)."));
body.push(num("Failures go back with the FIX prompt in the same session. Log one line in logs\\LOG.txt."));

/* ===== PART 6 ===== */
body.push(h1("Part 6. Versioning: how this stays sane"));
body.push(bullet("Releases: R<n>, shown in the banner from data\\release.js. Bump it for anything a reviewer can see."));
body.push(bullet("Files: every file's first line is /* GRC <path> v<X.Y.Z> <date> */. Minor bump for behavior, patch for copy. Copilot bumps it as part of the EDIT output."));
body.push(bullet("The truth table: the in-app Preflight version matrix is live; kit\\MODULES.md is its paper copy; CHANGELOG.md is the history."));
body.push(bullet("Feedback: FB numbers are permanent; states one-way; the register is append-only."));
body.push(bullet("Data: each entity file carries a version date; the generator stamps them together and DataForge stamps the export date automatically on real-data conversions."));
body.push(bullet("Frozen copies: releases\\R<n>\\ is never edited after the copy. If R7 had a bug, R8 fixes it; history stays honest."));

/* ===== PART 7 ===== */
body.push(h1("Part 7. Swapping in real data: DataForge"));
body.push(p("The app reads only data\\*.js; real data replaces synthetic one file at a time with the same names and shapes, and DataForge (demo\\tools\\dataforge.html) does the converting - no Copilot, nothing leaves the machine. The complete procedure, entity notes, and the empty-history option are in kit\\cards\\TASK-REAL-DATA.md; the shape of it:"));
body.push(num("Export one CSV per entity from your source systems into data-staging\\ (Excel: Save As, CSV UTF-8). templates\\ shows the expected columns per entity; your headers do not need to match."));
body.push(num("Open DataForge in Edge and click Run self-test once: all green means the tool survived the crossing intact."));
body.push(num("Per entity, in the order data-staging\\README.txt lists: pick the entity, load the CSV, map your columns (this is WORKSHEET W3 on screen), Validate, read the report (errors block export; dangling-reference warnings are informational - a handful is normal), optionally Mask people names, Download."));
body.push(num("Back up the old file to backup\\, save the download over demo\\data\\<entity>.js, refresh the app, Preflight, walk one record end to end."));
body.push(num("Not importing history? Use the Empty history files panel: register, ratings, controls, links, expected controls, affirmations, challenges, and requests ship as valid empty files and the tool fills them live."));
body.push(...[
  bullet("Masking replaces every distinct name with a stable pseudonym (Person 001, ...) consistently across entities in the sitting. Copy the mask map from its panel and keep it INSIDE the firewall; it never ships."),
  bullet("Each finished conversion becomes the cross-check reference for the next one, so convert parents before children. Resuming another day: Import a converted data\\*.js brings finished files back into the working set."),
  bullet("Copilot fallback: if the tool is somehow unavailable, TASK-REAL-DATA.md carries the one-entity-per-session conversion prompt. It gets no validation and no masking; treat it as the spare tire.")
]);
body.push(p("Nothing else changes: every derived number recomputes. If the MATH must change to fit your fields, that is an engine session plus the generator mirror (kit\\ENGINE.md explains), not a data session."));

/* ===== PART 8 ===== */
body.push(h1("Part 8. Presenting: which demo, which room"));
body.push(bullet("Executives, 15 minutes: One risk, front to back. It lands the whole design in eight scenes and ends on the bank-wide board."));
body.push(bullet("Process owners: Birth of a RAU, then the RAU Owner role demo. The order of operations is the argument."));
body.push(bullet("Second line: the ORBO or BACO role demo; the attention view and challenge-anywhere are the moments that convert skeptics."));
body.push(bullet("Working sessions: skip demos; open the Feature gallery and vote Keep / Discuss / Cut item by item. Votes export with feedback."));
body.push(bullet("Any room: leave the trace strip visible and say it out loud once: what is grayed does not exist yet. It manages expectations better than any caveat slide."));
body.push(bullet("Collect actions in My list live during the meeting, then Copy list into the minutes."));

/* ===== PART 9 ===== */
body.push(h1("Part 9. Extending: capabilities 6 through 10"));
body.push(p("The seams are already cut. kit\\cards\\TASK-NEW-MODULE.md is the procedure; these are the natural starts:"));
body.push(bullet("6 Signals: the adoption queue on every RAU is the landing zone; a signals module dispositions inbound change into exactly those pending entries plus new-RAU or new-instance actions."));
body.push(bullet("7 Control testing: control records already carry design and performance ratings with a labeled seam; test results replace owner judgment on performance, and everything downstream recomputes."));
body.push(bullet("8 Audit testing: same control spine, third-line records beside second-line results."));
body.push(bullet("9 Monitoring: the Program health card on Home is the seed; a monitoring module grows it into KRI views reading the same live computations."));
body.push(bullet("10 Policy governance: the capability model already renders the governance map; policies attach to capabilities and controls."));

/* ===== APPENDICES ===== */
body.push(h1("Appendix A. Entity cheat sheet"));
body.push(p("Full field lists live in kit\\SCHEMA.md; this is the mental model:"));
body.push(table([2700, 6500], [
  ["Entity", "One line"],
  ["orgNodes, services", "WF > LOB > SubLOB hierarchy; the enterprise services catalog tree."],
  ["raus (850)", "A RAU is a business times a service, created at SubLOB level; five roles; demographics describe, attributes obligate."],
  ["riskEvents (90)", "50 operational, 40 compliance; keywords and tags drive applicability; four risk-profile fields drive rating suggestions."],
  ["mcrs (8,000)", "Major Compliance Requirements from RRCM, each with a parent compliance event; a 2,000-row head carries 80 percent of RCSA frequency."],
  ["register", "Risk instances: RAU times event dispositions with score, decider, rationale, attached MCRs."],
  ["requests", "The RAU change pipeline: new, merge, split, retire, across governed stages."],
  ["ratings", "Inherent ratings per instance: suggested and final levels; override flag requires rationale; band always computed."],
  ["controls (5,100) + controlLinks", "One central inventory; shared controls cross RAUs; key status derived, never declared."],
  ["expectedControls", "When a situation is live, this control is expected; misses are the loudest gap."],
  ["affirmations", "Last signature, snapshot, and the unadopted-change queue per RAU: the living record."],
  ["challenges", "Second-line challenge-anytime records with respond and resolve states."],
  ["metaQuestions, rubric, release", "The survey; the applicability rubric; the banner release number."]
]));
body.push(h1("Appendix B. The math on one page"));
body.push(h2("Applicability (Capability 2)"));
body.push(p("Eight tag categories, weighted 1-to-5 overlap scores, scaled 0-100. Likely at 70, possible at 40. Exclusions from the survey suppress events outright. Disambiguation answers update the RAU's metadata so the whole stack rescores."));
body.push(h2("Inherent rating (Capability 3)"));
body.push(p("Likelihood (frequency-anchored, from volume, losses, error propensity, change) times impact (worst credible outcome across four fact-anchored lenses: financial dollars, customer count, regulatory obligation profile, operational disruption). Reputational is a derived flag, not a lens. The 5x5 grid yields Low / Moderate / High / Critical. Suggestions carry evidence chips; overrides carry rationale."));
body.push(h2("Derived key (Capability 4)"));
body.push(p("K1 sole mitigant on a High or Critical instance; K2 expected control for a live situation; K3 concentration (5+ instances or 3+ RAUs); K4 mitigates a Critical instance. Any rule true means key, recomputed as the landscape moves."));
body.push(h2("Residual (Capability 5)"));
body.push(p("Control effectiveness is the weaker of design and performance. Environment: Strong (an effective key-or-expected control and no expected gap), Weak (nothing effective), else Adequate. Knockdown: Strong minus two bands, Adequate minus one, Weak minus zero; result maps to High / Moderate / Low. Unrated instances cannot compute and block affirmation."));
body.push(h1("Appendix C. Glossary"));
body.push(table([2200, 7000], [
  ["Term", "Meaning"],
  ["RAU", "Risk Assessable Unit: the process unit of RCSA, a business times a service at SubLOB level."],
  ["Risk instance", "One confirmed RAU-times-event register row; the thing that gets rated, mitigated, and assessed."],
  ["MCR / RRCM", "Major Compliance Requirement, the regulatory widget; published from the RRCM system with a parent risk event."],
  ["ORBO / BACO", "Operational and Compliance second-line officers assigned to each RAU."],
  ["BCM", "Business Control Management, the first-line control team that shepherds intakes and coverage."],
  ["CARA", "Compliance Aggregated Risk Assessment: offline compliance aggregation; MCR-level ratings and control mapping live there, not in RCSA."],
  ["RCR / FB / R<n>", "RAU change request; feedback register item; release number in the banner."],
  ["Trace strip / lens", "The bar naming each screen's capability; the home-map selection that grays out everything outside a chosen scope."],
  ["My list", "The work cart: collect items while browsing, work through them item by item."]
]));
body.push(p(" ", { after: 40 }));
body.push(p("End of runbook v2. The kit cards are the operational detail; the app is the truth; this book is the map.", { italics: true, color: GRAY }));

const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "-", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 200 } } } }, { level: 1, format: LevelFormat.BULLET, text: "-", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 200 } } } }] },
      { reference: "steps", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 260 } } } }] }
    ]
  },
  styles: { default: { document: { run: { font: BODY, size: 22 } } } },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, bottom: 1080, left: 1240, right: 1240 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "GRC Mockup Runbook v2 (R10)", font: BODY, size: 16, color: GRAY })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], font: BODY, size: 16, color: GRAY })] })] }) },
    children: body
  }]
});

Packer.toBuffer(doc).then(function (buf) {
  fs.writeFileSync("GRC-Mockup-Runbook.docx", buf);
  console.log("wrote GRC-Mockup-Runbook.docx", buf.length, "bytes");
});
