# GRC HTML Mockup — Build Plan

A plan for building a convincing, data-rich GRC platform demo out of small static
files, where most construction happens behind a corporate firewall using only
M365 Copilot chat, and no file may exceed what Copilot can reliably regenerate.

**Status: plan only — nothing here is built yet.**

> **Operationalized 2026-08-22:** the executable version of this plan is
> `runbook/GRC-Mockup-Runbook.docx` (step-by-step, amnesia-proof) and the
> `firewall-kit/` folder (the .md contract, schema, prompts, worksheets, and
> 20 task cards that get attached to Copilot sessions). The runbook embeds
> the kit verbatim as appendices; regenerate it with `runbook/build-runbook.js`
> after any kit change. Where this document and the runbook differ, the
> runbook wins.

---

## 1. Goal and hard constraints

**Goal.** An offline, click-through GRC mockup that emulates real platform
behavior (registers, drill-downs, workflow, dashboards) well enough to drive
design conversations with stakeholders — powered by ~3 MB of real
organizational data so the relationships (risk ↔ control ↔ policy ↔ issue ↔
framework requirement) are recognizable and meaningful.

**Hard constraints, and what each one forces:**

| # | Constraint | Consequence for the design |
|---|-----------|---------------------------|
| C1 | Build happens inside the firewall via M365 Copilot chat only | Every buildable unit must be producible from a pasted prompt, in one chat session, as plain text |
| C2 | Copilot instruction-following degrades near 100 KB per file | Per-file **hard ceiling 70–90 KB**, **working target 30–45 KB** (a full file must fit in one Copilot response, ≈1,000 lines) |
| C3 | ~3 MB of real data must be in the demo | Data cannot live inside any Copilot-edited file. Data and code must be fully separated |
| C4 | Runs from a plain local folder (no server, no internet) | On `file://`, browsers block `fetch()`/XHR of local files — but `<script src>` works. **All data ships as `.js` files** |
| C5 | Real data must never leave the firewall | All real-data steps happen inside; everything outside uses synthetic data with identical schemas |

Working assumptions (flag if wrong): inside browser is Edge (Chromium); the demo
is presented from a local folder or screen-share; "GRC" means a
governance/risk/compliance platform (risk register, controls, compliance
frameworks, policies, issues/remediation, assessments, workflow).

---

## 2. Architecture: many modules, one viewer — your instinct, adjusted

Your instinct — *many HTMLs as function modules + a specialized viewer that
knits them together* — is the right decomposition. One adjustment makes it
dramatically more robust: modules are **registered scripts**, not iframed HTML
pages. The "specialized viewer" is a single `index.html` shell; each module is
one small `.js` file that registers itself with the shell.

Why not iframes knitting HTML files:

- On `file://`, every local HTML document is an isolated origin. An iframe
  can't be reached directly — only async `postMessage` plumbing.
- Cross-module navigation ("click risk RSK-042 → open Controls filtered to its
  controls") is **the** feature that makes a GRC demo convincing, because GRC
  *is* the relationships. With iframes that's message-passing plumbing; with
  registered modules it's a function call.
- Each iframe would separately re-parse the 3 MB dataset. One document parses
  it once and indexes it once.
- Shared navigation, theme, global filters, and search come free in one
  document — which is what makes 30 separately-built files feel like one
  product.

The module/viewer concept survives intact: you still build and ship one small
file per function, and the shell knits them. If a standalone per-module page is
ever needed, a ~2 KB thin wrapper (`standalone/risks.html` loading kernel +
data + that one module) is cheap to add later.

### Runtime anatomy

```
grc-demo/                        (a plain folder; double-click index.html)
  index.html                     shell: chrome, nav, theme CSS, boot, preflight panel
  kernel/
    core.js                      module registry, hash router, state bus, data indexing
    ui.js                        component builders: table, card, drawer, tabs, badge, kpi
    charts.js                    hand-rolled SVG charts: bar, line, donut, 5x5 heatmap
  modules/
    dashboard.js                 one file per GRC function, built one per Copilot session
    risks.js
    controls.js
    compliance.js
    policies.js
    issues.js
    assessments.js
    workflow.js
    explorer.js                  relationship graph + global search
    demo.js                      guided demo-mode overlay
  data/
    orgunits.js  frameworks.js  risks.js  controls.js  policies.js
    issues.js    assessments.js trend.js                (~3 MB total — never touched by Copilot)
  tools/
    dataforge.html               standalone CSV → data/*.js converter (built once)
```

`index.html` loads kernel → data → modules via plain `<script>` tags, then calls
`GRC.boot()`. **Integrating a new module = save the file + add one script tag.**
That one hand-edited line is the entire assembly step.

### The module contract (frozen in Phase 1)

Every module file has the same shape — this is what lets ten separate Copilot
sessions produce parts of one coherent app:

```js
/* GRC modules/risks.js v1.0.0 2026-09-04 */
window.GRC.register({
  id: "risks", title: "Risk Register", order: 30, version: "1.0.0",
  routes: {
    "risks":     (el, ctx) => { /* render list into el */ },
    "risks/:id": (el, ctx, params) => { /* render detail */ }
  }
});
```

`ctx` is the kernel's full offering — and the *only* API a module may use:
`ctx.data` (indexed records, byId maps, reverse links), `ctx.go(route)`,
`ctx.ui.*` (components), `ctx.charts.*`, `ctx.state` (global filters, pub/sub),
`ctx.fmt.*` (dates, numbers, status colors). The kernel wraps every module
render in try/catch and its loader tolerates a missing/broken file — one bad
Copilot output degrades to a "module failed" tile, never a dead demo.

Data files are self-registering and versioned, same trick:

```js
window.GRC_DATA = window.GRC_DATA || {};
window.GRC_DATA.risks = { version: "2026-09-12", rows: [ /* ... */ ] };
```

### File size budgets

| File | Working target | Hard ceiling | Notes |
|---|---|---|---|
| index.html | 35 KB | 70 KB | includes theme CSS + design tokens |
| kernel/core.js | 35 KB | 70 KB | |
| kernel/ui.js | 40 KB | 80 KB | |
| kernel/charts.js | 20 KB | 50 KB | |
| each modules/*.js | 30–45 KB | 70 KB | at ceiling, split into `-list.js` / `-detail.js` |
| tools/dataforge.html | 50 KB | 90 KB | built once, rarely edited |
| data/*.js | n/a | ~1 MB each, ~3 MB total | browser-only; Copilot never sees these |

Total app code lands around 400–600 KB across ~15 files — every
Copilot-touched file far below the 100 KB failure zone — plus 3 MB of data the
browser parses in well under a second.

---

## 3. Fidelity across Copilot sessions: contract cards + session protocol

Turn-after-turn fidelity does not come from Copilot remembering anything. It
comes from **never needing it to remember**. Two artifacts do the work:

**Contract Card (≤3 KB, frozen after Phase 1).** A compact spec pasted at the
top of *every* Copilot session: the module registration shape, the `ctx` API
surface (names + one-line signatures), the data entity schemas, the allowed CSS
class/component menu, and the output rules. Small enough to retype by hand if
text can't be pasted across the firewall.

**Task Card (per file, ~1 KB).** What this specific file must do: routes,
views, fields shown, interactions, acceptance checklist. These are pre-written
outside the firewall, one per planned Copilot session.

**The session ritual** (every file, every time):

1. Fresh Copilot chat. Paste Contract Card, then Task Card. If modifying an
   existing file, paste the current file too.
2. Require output as **the entire file in a single code block** — first line a
   version header comment, `/* ==SECTION:name== */` markers every ~150 lines,
   **no placeholders, no "rest of code unchanged", no ellipses**.
3. If the response truncates: "continue from `/* ==SECTION:xxx== */`" and
   stitch — the markers make reassembly deterministic.
4. Save via Notepad/VS Code into the folder (files you create locally carry no
   mark-of-the-web, so Edge runs them without fuss). Refresh. Check the
   preflight panel, then the task card's acceptance list.
5. If Copilot violated the contract (invented an API, added a CDN link):
   regenerate. Never negotiate a contract change mid-session.

**Standing rules baked into the Contract Card:** vanilla JS only; zero external
URLs/CDNs/fonts; no `fetch`/XHR; ASCII quotes only; only kernel APIs and CSS
classes listed on the card; all state in memory; ids and routes exactly as
specified.

**The preflight panel** (built into the shell in Phase 1) is the drift alarm: a
diagnostics view listing kernel/module/data versions, row counts per entity,
dangling-reference check across all foreign keys, and a trapped-error badge.
Green preflight before every stakeholder demo; red immediately after a bad save
tells you exactly which file to regenerate.

---

## 4. Data: pipeline, not payload

The 3 MB never flows through Copilot chat. It flows through a tool Copilot
builds **once**:

**DataForge (`tools/dataforge.html`)** — a standalone page, works on `file://`:
paste or file-pick CSV exports (FileReader on user-selected files is allowed
locally), map columns to the schema, validate (required fields, id uniqueness,
dangling foreign keys — with a visible report), optionally **mask** sensitive
fields (owner names/emails → role labels), then download ready-made
`data/*.js` files via Blob download. Drop them in the folder; done.

**Entities and relationships** (schemas frozen in Phase 1; representative, not
final): `orgUnits` (hierarchy), `frameworks` (+ requirements), `risks`
(inherent/residual scores, treatment, `controlIds`, `orgUnitId`), `controls`
(type, test results, `frameworkRefs`), `policies` (lifecycle dates,
attestation stats, `controlIds`), `issues` (severity, due dates, `riskId`,
`controlId`), `assessments` (campaign, progress), `trend` (monthly snapshots —
dashboards need history, and real exports rarely have it, so DataForge gets a
"backfill plausible trend" option). Relationships are foreign-key id arrays on
records; the kernel builds reverse indexes at boot so every detail view can
show "related everything" instantly.

**Synthetic first, real as a drop-in.** A full-scale synthetic dataset
(~500 risks, ~400 controls, ~100 policies, ~300 issues, 2 frameworks, 24
months of trend) exists from Phase 2. Every module is built and demoed against
it. When real exports are ready, run them through DataForge and swap the files
— **zero module changes**. Real data exists only inside the firewall; the repo
and everything outside only ever holds synthetic data.

---

## 5. Phases

Eight phases, ~30 Copilot sessions total (each session ≈ one file, 20–40 min).
Every phase ends demoable, so the project has value even if it stops early.
The real-data swap (§4) is a parallel track, not a phase — it can happen any
time after Phase 2.

| Phase | Deliverable | Files touched | Sessions | Exit checkpoint |
|---|---|---|---|---|
| **P1 — Contracts & canary** | Contract Card v1 (module API, data schemas, design tokens + component menu); shell skeleton with nav, router, preflight panel; hello-world module; stub data file | index.html, kernel/core.js, modules/hello.js | 3–4 | Double-click boots **on the inside machine in Edge** — proves `file://`, local `.js` loading, and the save→refresh loop before anything else is invested |
| **P2 — Data pipeline** | DataForge converter; full-scale synthetic dataset; kernel indexing/joins; data-health view in preflight | tools/dataforge.html, kernel/core.js, data/* | 3–4 | Preflight shows every entity loaded with counts; dangling-reference report clean; a 3 MB-scale load feels instant |
| **P3 — Chrome & dashboard** | Component library, SVG charts, visual polish, product name/logo mark; executive dashboard (KPIs, 5×5 heatmap, trend, top risks, coverage tiles) | kernel/ui.js, kernel/charts.js, index.html, modules/dashboard.js | 4–5 | **First stakeholder-showable build** |
| **P4 — Risk register** | Filterable/sortable/paginated list; detail drawer (scores, treatment, linked controls/issues/policies); interactive matrix with drill-in | modules/risks.js (+ -detail.js if needed) | 3–4 | Click any heatmap cell → filtered register → record → its relationships |
| **P5 — Controls & compliance** | Control library with test status; framework coverage rollup (framework → requirement → mapped controls → effectiveness) | modules/controls.js, modules/compliance.js | 3–4 | "Where are we against the framework, and which controls are weak" answered on screen |
| **P6 — Policies & issues** | Policy lifecycle + attestation status; issues/CAPs with aging, ownership, due dates; cross-links everywhere | modules/policies.js, modules/issues.js | 3–4 | Any record reaches any related record in ≤2 clicks |
| **P7 — Workflow & assessments** | Record lifecycle emulation (draft → review → approved, role switcher, mock approvals/comments); assessment campaigns + questionnaire progress | modules/workflow.js, modules/assessments.js | 4 | The mockup *behaves* like a GRC (state changes on screen), not just reports like one |
| **P8 — Explorer, search & demo mode** | Global search across entities; SVG relationship graph centered on any record; guided demo overlay (scripted scenes: route + filters + narration, next/prev); dress rehearsal on real data | modules/explorer.js, modules/demo.js | 4–5 | 15-minute scripted walkthrough runs end-to-end from the demo overlay, preflight green |

**Optional P9/P10** if you want the full 7–10 spread: third-party/vendor risk
module; printable board-pack/report view.

Order rationale: P1 is where fidelity is won or lost — contracts locked before
any real building. P2 before UI because every module renders data. P3 gives an
early wow for sponsors. P4–P7 add one wing at a time, each a bounded Copilot
workload. P8 is the "aha": the relationship explorer and demo mode are what
make stakeholders *see* the connections — the stated reason real data matters.

---

## 6. Project risk register (naturally)

| Risk | Mitigation |
|---|---|
| Copilot truncates long outputs | 30–45 KB working targets; section markers + continue-and-stitch protocol |
| Copilot drifts from contract between sessions | Contract Card re-pasted every session; violations → regenerate, never negotiate; preflight catches API misuse at refresh time |
| A module outgrows its ceiling | Split into `-list.js` / `-detail.js`, both registering under one nav entry — the registry makes splits invisible to users |
| Endpoint policy blocks `file://` or local `.js` | P1 canary tests exactly this on day 1, before investment; fallbacks (inline `<script>` blocks, an internal static host) chosen only if actually hit |
| Real data messy / relationships broken | DataForge validation report (orphans, duplicates) before data ever reaches the demo; trim to a coherent slice if the full export is noisy |
| Sensitive values on screen | DataForge masking pass; real data never leaves the inside machine; synthetic everywhere else |
| Demo dies in front of stakeholders | Fully offline/local; preflight green-check ritual; demo mode drives only known-good routes; broken modules degrade to a tile, never a blank page |
| Session fatigue / lost thread across weeks | One file per session, pre-written Task Cards, version headers in every file, preflight shows the live version map — any session is resumable cold |

---

## 7. Division of labor across the firewall

**Outside (Claude + this repo):** architecture and contracts; the Contract
Card; every per-session Task Card (a "prompt pack" per phase); synthetic-data
generator spec; review and course-correction between phases. Cards are
deliberately ≤3 KB so they work even if the inbound path is
read-on-phone-and-retype. If pasting files inbound *is* allowed, we can
additionally pre-build reference files outside and let Copilot do
modifications only — same architecture, faster.

**Inside (you + Copilot):** run the session ritual per Task Card; save,
refresh, verify; everything involving real data (exports → DataForge →
data/*.js) — which never crosses out.

**Next actions when you're ready** (say the word):
1. Draft Contract Card v1 — entity schemas, module API, design tokens, output rules.
2. Draft the Phase 1 prompt pack — Task Cards for index.html, kernel/core.js, hello module.
3. Optionally build a reference implementation of P1 here first, to de-risk the
   contracts before you spend firewall sessions on them.
