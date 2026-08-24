/* GRC tools-dev/generate-data.js v1.0.0 2026-08-23
   Outside-the-firewall synthetic data generator (Node). Deterministic
   (seeded). Writes workspace/demo/data/*.js and
   workspace/data-staging/templates/*.csv.
   Run: node generate-data.js   (from tools-dev/)                        */
"use strict";
var fs = require("fs");
var path = require("path");
var OUT = path.join(__dirname, "..", "workspace", "demo", "data");
var TPL = path.join(__dirname, "..", "workspace", "data-staging", "templates");
var TODAY = "2026-08-23";

/* ==SECTION:rng== */
function RNG(seed) {
  var s = 2166136261 >>> 0;
  for (var i = 0; i < seed.length; i++) { s = Math.imul(s ^ seed.charCodeAt(i), 16777619) >>> 0; }
  return function () {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
var rnd = RNG("grc-r1");
function ri(n) { return Math.floor(rnd() * n); }
function pick(a) { return a[ri(a.length)]; }
function picks(a, n) {
  var c = a.slice(), out = [];
  n = Math.min(n, c.length);
  for (var i = 0; i < n; i++) { out.push(c.splice(ri(c.length), 1)[0]); }
  return out;
}
function chance(p) { return rnd() < p; }
function pad(n, w) { var s = String(n); while (s.length < w) s = "0" + s; return s; }
function dateBack(maxDays) {
  var base = new Date("2026-08-23T00:00:00Z").getTime();
  var d = new Date(base - ri(maxDays) * 86400000);
  return d.toISOString().slice(0, 10);
}

/* ==SECTION:org== */
var LOBS = [
  ["Consumer & Small Business Banking", ["Branch Banking", "Consumer Deposits", "Small Business Lending", "Consumer Digital Channels", "ATM & Cash Operations"]],
  ["Consumer Lending", ["Home Lending", "Auto Lending", "Card Services", "Personal Lending", "Loan Servicing Operations"]],
  ["Commercial Banking", ["Middle Market Banking", "Asset Based Lending", "Commercial Real Estate", "Treasury Management", "Equipment Finance"]],
  ["Corporate & Investment Banking", ["Corp Real Estate", "Capital Markets Operations", "Institutional Client Services", "Syndicated Lending", "Trade Services"]],
  ["Wealth & Investment Management", ["Brokerage Operations", "Trust Services", "Retirement Services", "Investment Advisory", "Estate Administration"]],
  ["Payments & Deposits Services", ["Wire Transfer Services", "ACH Operations", "Card Payment Processing", "Deposit Operations", "Fraud Claims Operations"]],
  ["Enterprise Functions", ["Human Resources Operations", "Finance & Accounting Operations", "Corporate Properties", "Procurement Services", "Legal Operations"]],
  ["Technology & Shared Services", ["Enterprise Data Services", "Application Services", "Infrastructure Operations", "Information Security Operations", "Contact Center Shared Services"]]
];
var orgNodes = [{ id: "ORG-0001", level: "enterprise", parentId: null, name: "Enterprise" }];
var subLobs = [];
(function buildOrg() {
  var oi = 2;
  for (var l = 0; l < LOBS.length; l++) {
    var lobId = "ORG-" + pad(oi++, 4);
    orgNodes.push({ id: lobId, level: "lob", parentId: "ORG-0001", name: LOBS[l][0] });
    for (var s = 0; s < LOBS[l][1].length; s++) {
      var subId = "ORG-" + pad(oi++, 4);
      orgNodes.push({ id: subId, level: "sublob", parentId: lobId, name: LOBS[l][1][s] });
      subLobs.push({ id: subId, lobId: lobId, lobName: LOBS[l][0], name: LOBS[l][1][s] });
    }
  }
})();

/* ==SECTION:services== */
var SVC_TREE = [
  ["Payments Services", [["Wire Services", ["Outbound Wire Execution", "Inbound Wire Processing", "Wire Investigations"]], ["ACH Services", ["ACH Origination", "ACH Receipt & Returns"]], ["Card Payments", ["Card Authorization", "Card Settlement", "Chargeback Processing"]]]],
  ["Lending Services", [["Origination Services", ["Application Intake", "Underwriting Services", "Closing & Funding"]], ["Servicing Services", ["Payment Processing", "Escrow Administration", "Default Management", "Collections"]]]],
  ["Deposit Services", [["Account Services", ["Account Opening", "Account Maintenance", "Account Closure"]], ["Transaction Services", ["Item Processing", "Overdraft Management", "Statement Production"]]]],
  ["Customer Servicing", [["Contact Services", ["Inbound Servicing Calls", "Complaint Handling", "Correspondence Processing"]], ["Claims Services", ["Fraud Claims Intake", "Error Resolution Claims"]]]],
  ["Trading & Markets Services", [["Execution Services", ["Trade Capture", "Trade Settlement"]], ["Custody Services", ["Asset Servicing", "Corporate Actions"]]]],
  ["Fiduciary Services", [["Trust Administration", ["Trust Account Administration", "Discretionary Distributions"]], ["Investment Services", ["Portfolio Administration", "Fee Billing"]]]],
  ["Data & Reporting Services", [["Data Services", ["Data Quality Management", "Records Management"]], ["Reporting Services", ["Regulatory Report Production", "Management Reporting"]]]],
  ["Technology Services", [["Application Services", ["Application Support", "Change Implementation"]], ["Access Services", ["User Access Administration", "Privileged Access Management"]]]],
  ["People Services", [["HR Operations", ["Onboarding Administration", "Payroll Processing", "Benefits Administration"]]]],
  ["Finance Services", [["Accounting Services", ["General Ledger Operations", "Reconciliation Services", "Accounts Payable"]]]],
  ["Third Party Services", [["Vendor Services", ["Vendor Onboarding", "Vendor Performance Monitoring"]]]],
  ["Facilities Services", [["Property Services", ["Lease Administration", "Physical Security Services"]]]]
];
var services = [];
(function buildSvc() {
  var si = 1;
  for (var a = 0; a < SVC_TREE.length; a++) {
    var l1 = { id: "SVC-" + pad(si++, 4), parentId: null, level: 1, name: SVC_TREE[a][0] };
    services.push(l1);
    var kids = SVC_TREE[a][1];
    for (var b = 0; b < kids.length; b++) {
      var l2 = { id: "SVC-" + pad(si++, 4), parentId: l1.id, level: 2, name: kids[b][0] };
      services.push(l2);
      for (var c = 0; c < kids[b][1].length; c++) {
        services.push({ id: "SVC-" + pad(si++, 4), parentId: l2.id, level: 3, name: kids[b][1][c] });
      }
    }
  }
})();
var svcLeaves = services.filter(function (s) { return s.level === 3; });

/* ==SECTION:tag-vocab== */
/* Namespaced tags shared by RAU metadata and candidate profiles. */
var TAGS = {
  proc: ["payment-execution", "claims-processing", "account-servicing", "underwriting", "loan-servicing", "trade-processing", "reconciliation", "regulatory-reporting", "records-management", "access-administration", "customer-onboarding", "collections", "trust-administration", "vendor-management", "payroll", "complaint-handling", "statement-production", "change-implementation"],
  prod: ["consumer-deposits", "credit-card", "mortgage", "auto-loan", "commercial-loan", "wires", "ach", "securities", "trust-accounts", "hr-services", "corporate-services", "small-business"],
  cust: ["consumer", "small-business", "commercial", "institutional", "employee", "internal"],
  data: ["pii", "card-data", "account-data", "credit-data", "hr-data", "mnpi"],
  mm: ["moves-money", "wire-out", "ach-origination", "card-settlement", "fee-billing", "no-money-movement"],
  jur: ["us-domestic", "cross-border", "state-regulated"],
  ch: ["branch", "phone", "digital", "mail", "back-office"],
  vol: ["high-volume", "medium-volume", "low-volume"]
};
var EXCL_TOPICS = ["trading", "municipal-securities", "cross-border", "consumer-contact", "card-issuance", "deposit-taking", "credit-decisioning", "custody", "payroll", "government-contracting"];

/* ==SECTION:rau-banks== */
var PROC_WORDS = {
  "Payments & Deposits Services": [["Wire Transfer Operations", "payment-execution", "wires"], ["ACH Exception Handling", "payment-execution", "ach"], ["Card Settlement Operations", "payment-execution", "credit-card"], ["Deposit Reconciliation", "reconciliation", "consumer-deposits"], ["Fraud Claims Intake & Triage", "claims-processing", "consumer-deposits"]],
  generic: [["Account Opening", "customer-onboarding"], ["Account Maintenance", "account-servicing"], ["Payment Processing", "payment-execution"], ["Statement & Notice Production", "statement-production"], ["Complaint Resolution", "complaint-handling"], ["Records Retention", "records-management"], ["Reconciliation & Proofing", "reconciliation"], ["Quality Review", "account-servicing"], ["Exception Processing", "claims-processing"], ["Underwriting Support", "underwriting"], ["Escrow Administration", "loan-servicing"], ["Default & Collections", "collections"], ["User Access Administration", "access-administration"], ["Regulatory Report Production", "regulatory-reporting"], ["Vendor Oversight", "vendor-management"], ["Trade Settlement", "trade-processing"], ["Trust Distributions", "trust-administration"], ["Payroll Administration", "payroll"], ["Change Implementation", "change-implementation"], ["Document Custody", "records-management"], ["Fee Assessment & Billing", "fee-billing"], ["Disclosure Delivery", "statement-production"], ["Customer Correspondence", "complaint-handling"], ["Data Quality Operations", "records-management"]]
};
var FIRST = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Quinn", "Cameron", "Rowan", "Emerson", "Skyler", "Dana", "Jesse", "Kendall", "Logan", "Parker", "Reese", "Sam", "Drew"];
var LAST = ["Bennett", "Carver", "Delgado", "Ellison", "Fournier", "Grant", "Hale", "Ibarra", "Jennings", "Kwan", "Lindqvist", "Marsh", "Nakamura", "Osei", "Pruitt", "Quintero", "Rhodes", "Sato", "Tran", "Underwood", "Vaughn", "Whitfield", "Xiong", "Yates", "Zeller"];
function person() { return pick(FIRST) + " " + pick(LAST); }

/* ==SECTION:raus== */
var raus = [];
var handoffPool = [];
(function buildRaus() {
  var idn = 1;
  var target = 850;
  var perSub = Math.floor(target / subLobs.length); /* ~21 */
  for (var s = 0; s < subLobs.length; s++) {
    var sub = subLobs[s];
    var lobName = sub.lobName;
    var count = perSub + (s < target - perSub * subLobs.length ? 1 : 0);
    var bank = (PROC_WORDS[lobName] || []).concat(PROC_WORDS.generic);
    var used = {};
    for (var k = 0; k < count; k++) {
      var pw = bank[ri(bank.length)];
      var nm = pw[0];
      if (used[nm]) { nm = nm + " - " + ["East", "West", "Central", "National", "Institutional", "Retail"][ri(6)]; }
      if (used[nm]) { nm = nm + " " + (k + 1); }
      used[nm] = 1;
      var id = "RAU-" + pad(idn++, 4);
      var category = lobName === "Technology & Shared Services" ? "shared-services" : (lobName === "Enterprise Functions" ? (chance(0.5) ? "enterprise" : "shared-services") : "business-service");
      var tags = [];
      tags.push("proc:" + (pw[1] || "account-servicing"));
      if (chance(0.5)) tags.push("proc:" + pick(TAGS.proc));
      tags.push("prod:" + pick(TAGS.prod));
      if (chance(0.35)) tags.push("prod:" + pick(TAGS.prod));
      tags.push("cust:" + pick(TAGS.cust));
      tags.push("data:" + pick(TAGS.data));
      if (chance(0.4)) tags.push("data:pii");
      var mm = chance(0.55) ? pick(["moves-money", "wire-out", "ach-origination", "card-settlement", "fee-billing"]) : "no-money-movement";
      tags.push("mm:" + mm);
      tags.push("jur:" + (chance(0.12) ? "cross-border" : "us-domestic"));
      tags.push("ch:" + pick(TAGS.ch));
      tags.push("vol:" + pick(TAGS.vol));
      tags = tags.filter(function (t, i2) { return tags.indexOf(t) === i2; });
      var excl = picks(EXCL_TOPICS.filter(function (e) {
        if (e === "cross-border" && tags.indexOf("jur:cross-border") >= 0) return false;
        if (e === "consumer-contact" && tags.indexOf("cust:consumer") >= 0) return false;
        return true;
      }), 2 + ri(3));
      var stageComplete = chance(0.42);
      var rau = {
        id: id, name: nm, subLobId: sub.id, category: category, stage: "active",
        description: nm + " for " + sub.name + " within " + lobName + ".",
        serviceIds: picks(svcLeaves, 2 + ri(3)).map(function (x) { return x.id; }),
        roles: { owner: person(), delegate: person(), bcmContact: person(), orbo: person(), baco: person() },
        fte: 5 + ri(220), locations: 1 + ri(9),
        annualVolume: (1 + ri(900)) * 10000,
        priorLosses12m: chance(0.3) ? (1 + ri(40)) * 25000 : 0,
        changeLevel: pick(["low", "medium", "medium", "high"]),
        meta: { tags: tags, excl: excl },
        riskIdStatus: stageComplete ? "complete" : (chance(0.5) ? "in-progress" : "not-started"),
        lastRcsaDate: chance(0.85) ? dateBack(540) : null,
        profileUpdated: dateBack(420),
        mapSummary: { phases: 2 + ri(4), steps: 6 + ri(18), handoffs: ri(4) },
        map: null, metaAnswers: null, handoffs: []
      };
      raus.push(rau);
    }
  }
  /* handoff network: ~600 directed handoffs */
  var ARTS = ["settlement file", "exception queue", "approved application package", "reconciliation break report", "customer complaint case", "wire instruction", "collateral documents", "GL adjustment entries", "access request ticket", "chargeback case file"];
  for (var h = 0; h < 600; h++) {
    var a = pick(raus), b = pick(raus);
    if (a.id === b.id) continue;
    var art = pick(ARTS);
    a.handoffs.push({ dir: "out", cp: b.id, art: art, conf: chance(0.8) });
    b.handoffs.push({ dir: "in", cp: a.id, art: art, conf: chance(0.8) });
  }
})();

/* ==SECTION:featured-rau== */
/* Give ~14 featured RAUs a real process map and full survey answers. */
function mkMap(kind) {
  if (kind === "escrow") {
    return { phases: [
      { name: "Receive disbursement request", steps: [
        { n: 1, text: "Receive escrow disbursement request from servicing system queue", type: "task" },
        { n: 2, text: "Validate request against escrow account balance and payee record", type: "task" },
        { n: 3, text: "Is documentation complete?", type: "decision" },
        { n: 4, text: "Return incomplete requests to loan servicing with reason code", type: "handoff-out", cp: "RAU-0301", art: "exception queue" }] },
      { name: "Approve and fund", steps: [
        { n: 5, text: "Route requests above threshold for supervisor approval", type: "decision" },
        { n: 6, text: "Release approved disbursement to payment execution", type: "handoff-out", cp: "RAU-0521", art: "wire instruction" },
        { n: 7, text: "Post disbursement to escrow sub-ledger", type: "task" }] },
      { name: "Reconcile and report", steps: [
        { n: 8, text: "Receive settlement confirmation from payment operations", type: "handoff-in", cp: "RAU-0521", art: "settlement file" },
        { n: 9, text: "Reconcile funded amounts to sub-ledger daily", type: "task" },
        { n: 10, text: "Produce monthly escrow activity statement", type: "task" }] }
    ] };
  }
  return { phases: [
    { name: "Intake", steps: [
      { n: 1, text: "Receive work item from upstream queue", type: "handoff-in", cp: pick(raus).id, art: "exception queue" },
      { n: 2, text: "Validate item completeness against checklist", type: "task" },
      { n: 3, text: "Is item in scope?", type: "decision" }] },
    { name: "Process", steps: [
      { n: 4, text: "Perform core processing per procedure", type: "task" },
      { n: 5, text: "Apply quality review sampling", type: "task" },
      { n: 6, text: "Hand result to downstream partner", type: "handoff-out", cp: pick(raus).id, art: "settlement file" }] }
  ] };
}
var META_QS = [
  { id: "Q01", section: "Trading & Markets", text: "Confirm this RAU does NOT conduct trading or market-making activity.", excl: "trading" },
  { id: "Q02", section: "Trading & Markets", text: "Confirm this RAU does NOT handle municipal securities activity.", excl: "municipal-securities" },
  { id: "Q03", section: "Money Movement", text: "Does this RAU initiate outbound wires on customer instruction?", tag: "mm:wire-out" },
  { id: "Q04", section: "Money Movement", text: "Does this RAU originate ACH entries?", tag: "mm:ach-origination" },
  { id: "Q05", section: "Money Movement", text: "Confirm this RAU does NOT take deposits or open deposit accounts.", excl: "deposit-taking" },
  { id: "Q06", section: "Customer Contact", text: "Does this RAU interact directly with consumers?", tag: "cust:consumer" },
  { id: "Q07", section: "Customer Contact", text: "Confirm this RAU does NOT make credit decisions.", excl: "credit-decisioning" },
  { id: "Q08", section: "Data", text: "Does this RAU handle personally identifiable information (PII)?", tag: "data:pii" },
  { id: "Q09", section: "Data", text: "Does this RAU handle payment card data?", tag: "data:card-data" },
  { id: "Q10", section: "Geography", text: "Does this RAU process cross-border activity?", tag: "jur:cross-border" },
  { id: "Q11", section: "Third Parties", text: "Does a third party perform any step of this process?", tag: "proc:vendor-management" },
  { id: "Q12", section: "Payroll & HR", text: "Confirm this RAU does NOT administer payroll.", excl: "payroll" },
  { id: "Q13", section: "Custody", text: "Confirm this RAU does NOT hold client assets in custody.", excl: "custody" },
  { id: "Q14", section: "Volume", text: "Does this RAU process more than 10,000 items per month?", tag: "vol:high-volume" }
];
var featured = [];
var STORY_ID = null;
(function decorateFeatured() {
  var fseed = raus.filter(function (r) { return r.riskIdStatus === "complete"; }).slice(0, 13);
  for (var i = 0; i < fseed.length; i++) {
    var r = fseed[i];
    r.map = mkMap("generic");
    r.metaAnswers = META_QS.map(function (q) {
      var yes = q.tag ? r.meta.tags.indexOf(q.tag) >= 0 : r.meta.excl.indexOf(q.excl) >= 0;
      var src = chance(0.7) ? ("map:" + (1 + ri(6))) : (chance(0.5) ? "services" : "user");
      return { q: q.id, v: yes ? "yes" : "no", src: src };
    });
    featured.push(r.id);
  }
  /* The story RAU: escrow ops inside Loan Servicing Operations - hand
     crafted so every field is domain-coherent for the guided demo. */
  var story = raus.filter(function (r) { return r.name.indexOf("Escrow") === 0; })[0] || fseed[0];
  var lso = subLobs.filter(function (s) { return s.name === "Loan Servicing Operations"; })[0];
  story.name = "Escrow Administration";
  story.subLobId = lso.id;
  story.category = "business-service";
  story.description = "Administers escrow accounts for serviced mortgage loans: annual escrow analysis, tax and insurance disbursement, shortage and surplus handling, and escrow statements to customers.";
  story.serviceIds = services.filter(function (s) { return ["Escrow Administration", "Payment Processing"].indexOf(s.name) >= 0; }).map(function (s) { return s.id; });
  story.meta.tags = ["proc:loan-servicing", "proc:payment-execution", "prod:mortgage", "cust:consumer", "data:pii", "mm:wire-out", "jur:us-domestic", "ch:back-office", "vol:high-volume"];
  story.meta.excl = ["trading", "municipal-securities", "custody", "payroll"];
  story.fte = 142; story.locations = 2; story.annualVolume = 380000;
  story.priorLosses12m = 425000; story.changeLevel = "medium";
  story.map = mkMap("escrow");
  story.mapSummary = null;
  story.riskIdStatus = "in-progress"; /* leaves live work on the workbench */
  story.metaAnswers = META_QS.map(function (mq) {
    var yes = mq.tag ? story.meta.tags.indexOf(mq.tag) >= 0 : story.meta.excl.indexOf(mq.excl) >= 0;
    return { q: mq.id, v: yes ? "yes" : "no", src: mq.id === "Q01" || mq.id === "Q13" ? "user" : (mq.tag ? "map:" + (1 + ri(9)) : "services") };
  });
  if (featured.indexOf(story.id) < 0) featured.push(story.id);
  STORY_ID = story.id;
})();

/* ==SECTION:risk-events== */
var OP_EVENTS = [
  ["Transaction Capture or Execution Error", "payment-execution", ["processing error", "misdirected payment", "data entry", "execution"]],
  ["Failed or Late Settlement", "payment-execution", ["settlement", "cutoff", "late funding"]],
  ["Reconciliation Failure", "reconciliation", ["unreconciled", "breaks", "proofing"]],
  ["System Availability Disruption", "change-implementation", ["outage", "downtime", "availability"]],
  ["Change Implementation Failure", "change-implementation", ["release", "deployment", "regression"]],
  ["Data Quality Error", "records-management", ["data quality", "incorrect data", "stale data"]],
  ["Records Retention Failure", "records-management", ["retention", "destruction", "legal hold"]],
  ["Unauthorized Access", "access-administration", ["access", "entitlement", "privileged"]],
  ["Internal Fraud - Misappropriation", "payment-execution", ["theft", "embezzlement", "insider"]],
  ["External Fraud - Payment Fraud", "claims-processing", ["fraudulent payment", "account takeover", "social engineering"]],
  ["Third Party Service Failure", "vendor-management", ["vendor", "outsourcing", "SLA"]],
  ["Model or Tool Error", "underwriting", ["model", "calculation", "spreadsheet"]],
  ["Key Person or Capacity Shortfall", "account-servicing", ["staffing", "capacity", "backlog"]],
  ["Business Continuity Event", "account-servicing", ["disaster", "site loss", "resilience"]],
  ["Customer Communication Error", "statement-production", ["disclosure", "statement", "notice"]],
  ["Fee or Billing Error", "fee-billing", ["overcharge", "fee assessment", "billing"]],
  ["Collateral or Document Handling Error", "records-management", ["collateral", "lien", "document custody"]],
  ["Trade Processing Error", "trade-processing", ["trade capture", "settlement", "corporate action"]],
  ["Payroll or HR Processing Error", "payroll", ["payroll", "benefits", "onboarding"]],
  ["Physical Security or Safety Event", "account-servicing", ["physical", "safety", "premises"]]
];
var CM_EVENTS = [
  ["BSA/AML Program Failure", ["aml", "suspicious activity", "ctr", "kyc"], ["payment-execution", "customer-onboarding"]],
  ["Sanctions Screening Failure", ["ofac", "sanctions", "screening"], ["payment-execution"], "cross-border"],
  ["UDAAP - Unfair or Deceptive Practice", ["udaap", "unfair", "deceptive", "abusive"], ["complaint-handling", "statement-production"]],
  ["Fair Lending Violation", ["ecoa", "fair lending", "disparate"], ["underwriting"], "credit-decisioning-req"],
  ["Error Resolution Failure (Reg E)", ["reg e", "error resolution", "provisional credit"], ["claims-processing"]],
  ["Truth in Lending Disclosure Failure (Reg Z)", ["reg z", "apr", "disclosure"], ["underwriting", "statement-production"]],
  ["Mortgage Servicing Rule Violation (Reg X)", ["respa", "escrow", "loss mitigation"], ["loan-servicing"]],
  ["Privacy or Data Protection Violation", ["glba", "privacy", "opt-out"], ["records-management", "statement-production"]],
  ["Credit Reporting Failure (FCRA)", ["fcra", "furnishing", "dispute"], ["collections", "account-servicing"]],
  ["Servicemember Protections Violation (SCRA/MLA)", ["scra", "mla", "servicemember"], ["collections", "loan-servicing"]],
  ["Flood Insurance Requirement Failure", ["flood", "fdpa", "coverage"], ["loan-servicing"]],
  ["Deposit Disclosure Failure (Reg DD)", ["reg dd", "tisa", "apy"], ["statement-production", "customer-onboarding"]],
  ["Funds Availability Failure (Reg CC)", ["reg cc", "holds", "availability"], ["payment-execution", "account-servicing"]],
  ["Debt Collection Practice Violation (FDCPA)", ["fdcpa", "collection", "harassment"], ["collections"]],
  ["Regulatory Reporting Failure", ["call report", "regulatory reporting", "accuracy"], ["regulatory-reporting"]],
  ["Volcker/Trading Compliance Failure", ["volcker", "proprietary trading"], ["trade-processing"], "trading-req"],
  ["Fiduciary Duty Breach", ["fiduciary", "trust", "best interest"], ["trust-administration"]],
  ["Complaint Handling Failure", ["complaint", "response timeliness"], ["complaint-handling"]],
  ["Affiliate Transaction Violation (Reg W)", ["reg w", "23a", "affiliate"], ["fee-billing", "regulatory-reporting"]],
  ["Anti-Bribery / FCPA Violation", ["fcpa", "bribery", "gifts"], ["vendor-management"]]
];
var riskEvents = [];
(function buildEvents() {
  var n = 1;
  for (var i = 0; i < 50; i++) {
    var b = OP_EVENTS[i % OP_EVENTS.length];
    var suffix = i >= OP_EVENTS.length ? " - " + ["Origination", "Servicing", "Operations", "Institutional"][ri(4)] : "";
    riskEvents.push({
      id: "REV-" + pad(n++, 3), side: "operational", name: b[0] + suffix,
      description: "The risk of " + b[0].toLowerCase() + suffix.toLowerCase() + " arising in day-to-day processing.",
      qualification: "Qualifies when the event originates in the RAU's own process execution, systems, people, or third parties.",
      keywords: b[2],
      tags: ["proc:" + b[1], "vol:high-volume"],
      excludedBy: []
    });
  }
  for (var j = 0; j < 40; j++) {
    var c = CM_EVENTS[j % CM_EVENTS.length];
    var sfx = j >= CM_EVENTS.length ? " - " + ["Consumer", "Commercial"][ri(2)] : "";
    riskEvents.push({
      id: "REV-" + pad(n++, 3), side: "compliance", name: c[0] + sfx,
      description: "The risk of failing to meet obligations associated with " + c[0].toLowerCase() + sfx.toLowerCase() + ".",
      qualification: "Qualifies when the RAU performs processes within scope of the underlying regulatory obligations.",
      keywords: c[1],
      tags: c[2].map(function (p) { return "proc:" + p; }),
      excludedBy: c[3] === "cross-border" ? [] : (c[0].indexOf("Volcker") === 0 ? ["trading-inverse"] : []),
      requires: c[3] || null
    });
  }
  /* extra tag seasoning for matching variety */
  riskEvents.forEach(function (ev) {
    if (chance(0.5)) ev.tags.push("prod:" + pick(TAGS.prod));
    if (chance(0.4)) ev.tags.push("cust:" + pick(TAGS.cust));
    if (chance(0.4)) ev.tags.push("data:" + pick(TAGS.data));
    if (chance(0.35)) ev.tags.push("mm:" + pick(["moves-money", "wire-out", "ach-origination", "card-settlement"]));
    if (ev.name.indexOf("Sanctions") === 0) ev.tags.push("jur:cross-border");
    if (ev.name.indexOf("Volcker") === 0) { ev.excludedBy = ["trading"]; ev.excludedBy = []; ev.tags.push("proc:trade-processing"); }
  });
  /* exclusion topics that suppress events */
  var EXCL_MAP = { "Volcker/Trading Compliance Failure": "trading", "Trade Processing Error": "trading", "Fair Lending Violation": "credit-decisioning", "Payroll or HR Processing Error": "payroll", "Fiduciary Duty Breach": "custody", "Deposit Disclosure Failure (Reg DD)": "deposit-taking", "Sanctions Screening Failure": null };
  riskEvents.forEach(function (ev) {
    var base = ev.name.replace(/ - (Origination|Servicing|Operations|Institutional|Consumer|Commercial)$/, "");
    if (EXCL_MAP[base]) ev.excludedBy = [EXCL_MAP[base]];
  });
})();
/* ==SECTION:event-risk-profile== */
/* Capability 3 fields: error propensity, typical severity, enforcement
   history, external visibility. Curated for named obligation families,
   seeded defaults elsewhere. */
var EV_PROFILE = {
  "Sanctions Screening Failure": { sev: 5, enf: 1, vis: 2 },
  "BSA/AML Program Failure": { sev: 4, enf: 1, vis: 2 },
  "UDAAP - Unfair or Deceptive Practice": { sev: 4, enf: 1, vis: 3 },
  "Fair Lending Violation": { sev: 4, enf: 1, vis: 3 },
  "Error Resolution Failure (Reg E)": { sev: 2, enf: 1, vis: 2 },
  "Mortgage Servicing Rule Violation (Reg X)": { sev: 3, enf: 1, vis: 2 },
  "Privacy or Data Protection Violation": { sev: 3, enf: 0, vis: 3 },
  "Debt Collection Practice Violation (FDCPA)": { sev: 2, enf: 1, vis: 2 },
  "Servicemember Protections Violation (SCRA/MLA)": { sev: 3, enf: 1, vis: 3 },
  "Fiduciary Duty Breach": { sev: 4, enf: 0, vis: 2 },
  "Volcker/Trading Compliance Failure": { sev: 4, enf: 0, vis: 1 }
};
riskEvents.forEach(function (ev) {
  var base = ev.name.replace(/ - (Origination|Servicing|Operations|Institutional|Consumer|Commercial)$/, "");
  var p = EV_PROFILE[base] || null;
  if (ev.side === "operational") {
    ev.errClass = pick([2, 3, 3, 4, 4, 5]);
    ev.sevClass = p ? p.sev : pick([2, 2, 3, 3, 4]);
    ev.enfFlag = p ? !!p.enf : chance(0.08);
    ev.visClass = p ? p.vis : (chance(0.15) ? 2 : 1);
  } else {
    ev.errClass = pick([1, 2, 2, 3, 3, 4]);
    ev.sevClass = p ? p.sev : 3;
    ev.enfFlag = p ? !!p.enf : chance(0.2);
    ev.visClass = p ? p.vis : (chance(0.3) ? 2 : 1);
  }
});
var cmEventIds = riskEvents.filter(function (e) { return e.side === "compliance"; }).map(function (e) { return e.id; });

/* ==SECTION:mcrs== */
var REG_FAMS = [
  ["BSA/AML", "31 CFR 1020", "FinCEN"], ["OFAC Sanctions", "31 CFR 501", "OFAC"], ["UDAAP", "12 USC 5531", "CFPB"],
  ["Reg E", "12 CFR 1005", "CFPB"], ["Reg Z", "12 CFR 1026", "CFPB"], ["Reg X", "12 CFR 1024", "CFPB"],
  ["Reg P / GLBA", "12 CFR 1016", "CFPB"], ["FCRA / Reg V", "12 CFR 1022", "CFPB"], ["SCRA", "50 USC 3901", "DOJ"],
  ["MLA", "32 CFR 232", "DoD"], ["FDPA Flood", "12 CFR 339", "OCC"], ["Reg DD", "12 CFR 1030", "CFPB"],
  ["Reg CC", "12 CFR 229", "FRB"], ["FDCPA", "12 CFR 1006", "CFPB"], ["Call Report", "12 CFR 304", "FDIC"],
  ["Volcker", "12 CFR 248", "FRB"], ["Fiduciary / Reg 9", "12 CFR 9", "OCC"], ["Complaints", "12 CFR 1034", "CFPB"],
  ["Reg W", "12 CFR 223", "FRB"], ["FCPA", "15 USC 78dd", "DOJ/SEC"]
];
var OBL_VERBS = ["Provide", "Deliver", "Retain", "File", "Investigate", "Disclose", "Screen", "Verify", "Notify", "Credit", "Document", "Monitor", "Report", "Train on", "Escalate"];
var OBL_OBJS = ["required disclosures", "periodic statements", "error resolution findings", "suspicious activity reports", "customer identification records", "adverse action notices", "escrow analyses", "hold notices", "opt-out notices", "dispute responses", "rate change notices", "records for five years", "transaction monitoring alerts", "annual privacy notices", "complaint acknowledgments"];
var PRO_PHRASES = ["Do not assess fees prohibited under the rule", "Do not release funds before screening completes", "Do not misrepresent terms or conditions", "Do not contact consumers outside permitted hours", "Do not share nonpublic information without notice", "Do not proceed without required coverage in place", "Do not apply payments in a prohibited order", "Do not furnish disputed data without notation"];
var TIMEFRAMES = ["within 10 business days", "within 30 days", "within 45 days", "prior to consummation", "at account opening", "annually", "promptly upon discovery", "before the first transaction"];
var mcrs = [];
(function buildMcrs() {
  var n = 1;
  for (var i = 0; i < 8000; i++) {
    var evId = cmEventIds[i % cmEventIds.length];
    var ev = riskEvents.filter(function (e) { return e.id === evId; })[0];
    var fam = REG_FAMS[i % REG_FAMS.length];
    var head = i < 2000;
    var cite = fam[1] + "." + (2 + ri(38)) + (chance(0.5) ? "(" + "abcdef"[ri(6)] + ")" : "");
    var row;
    if (head) {
      var name = fam[0] + " " + cite + " - " + pick(OBL_VERBS) + " " + pick(OBL_OBJS) + " " + pick(TIMEFRAMES);
      row = {
        id: "MCR-" + pad(n++, 4), name: name, parentEventId: evId, regFamily: fam[0], citation: cite,
        regulator: fam[2], head: true, publishedDate: dateBack(1500),
        tags: picks(ev.tags, Math.min(2, ev.tags.length)).concat(chance(0.5) ? ["prod:" + pick(TAGS.prod)] : []),
        summary: "Requires the bank to " + name.split(" - ")[1].toLowerCase() + " for in-scope activity.",
        obligations: [pick(OBL_VERBS) + " " + pick(OBL_OBJS) + " " + pick(TIMEFRAMES), pick(OBL_VERBS) + " " + pick(OBL_OBJS) + " " + pick(TIMEFRAMES)],
        prohibitions: chance(0.6) ? [pick(PRO_PHRASES)] : []
      };
    } else {
      /* lean tail row - name is family + citation only */
      row = {
        id: "MCR-" + pad(n++, 4), name: fam[0] + " " + cite + " - " + pick(OBL_VERBS).toLowerCase() + " requirement",
        parentEventId: evId, regFamily: fam[0], citation: cite,
        tags: picks(ev.tags, 1)
      };
    }
    mcrs.push(row);
  }
})();

/* ==SECTION:rubric== */
var rubric = {
  version: "1.0", bands: { likely: 70, possible: 40 },
  categories: [
    { key: "proc", label: "Process alignment", weight: 3.0 },
    { key: "prod", label: "Product / service alignment", weight: 2.0 },
    { key: "cust", label: "Customer type alignment", weight: 1.5 },
    { key: "data", label: "Data sensitivity", weight: 1.0 },
    { key: "mm", label: "Money movement exposure", weight: 1.5 },
    { key: "jur", label: "Jurisdiction / geography", weight: 0.5 },
    { key: "ch", label: "Channel / delivery", weight: 0.5 },
    { key: "vol", label: "Volume / scale exposure", weight: 1.0 }
  ],
  questions: [
    { id: "DQ1", cat: "mm", tag: "mm:wire-out", text: "Does this process ever initiate outbound wires on customer instruction?" },
    { id: "DQ2", cat: "mm", tag: "mm:ach-origination", text: "Does this process originate ACH entries to external accounts?" },
    { id: "DQ3", cat: "cust", tag: "cust:consumer", text: "Do the underlying accounts belong to consumers (natural persons)?" },
    { id: "DQ4", cat: "data", tag: "data:card-data", text: "Does the process store, transmit, or view full payment card numbers?" },
    { id: "DQ5", cat: "proc", tag: "proc:collections", text: "Does the process contact customers about past-due balances?" },
    { id: "DQ6", cat: "jur", tag: "jur:cross-border", text: "Are any transactions sent to or received from parties outside the U.S.?" },
    { id: "DQ7", cat: "prod", tag: "prod:mortgage", text: "Is any of the serviced portfolio secured by residential real estate?" },
    { id: "DQ8", cat: "vol", tag: "vol:high-volume", text: "Does monthly volume exceed 10,000 items?" }
  ]
};

/* ==SECTION:engine-mirror== */
/* Simplified mirror of kernel/engine.js scoring, used to pre-build the
   confirmed register so shipped confirmations match live scores. */
function scoreCand(rauTags, candTags) {
  var byNs = {};
  rubric.categories.forEach(function (c) { byNs[c.key] = { r: [], c: [] }; });
  function split(t, side) { var ns = t.slice(0, t.indexOf(":")); if (byNs[ns]) byNs[ns][side].push(t); }
  rauTags.forEach(function (t) { split(t, "r"); });
  candTags.forEach(function (t) { split(t, "c"); });
  var total = 0, wsum = 0, cats = {};
  rubric.categories.forEach(function (c) {
    var b = byNs[c.key];
    var shared = b.c.filter(function (t) { return b.r.indexOf(t) >= 0; }).length;
    var score;
    if (b.c.length === 0) { score = 3; } /* candidate silent on this theme */
    else if (shared === 0) { score = 1; }
    else if (shared === 1) { score = b.c.length === 1 ? 4 : 3; }
    else if (shared === 2) { score = 4; }
    else { score = 5; }
    cats[c.key] = score;
    total += score * c.weight; wsum += 5 * c.weight;
  });
  return { pct: Math.round(100 * total / wsum), cats: cats };
}

/* ==SECTION:register== */
var register = [];
(function buildRegister() {
  raus.forEach(function (r) {
    if (r.riskIdStatus === "not-started" || r.id === STORY_ID) return;
    var partial = r.riskIdStatus === "in-progress";
    riskEvents.forEach(function (ev) {
      if (ev.excludedBy && ev.excludedBy.length && ev.excludedBy.some(function (x) { return r.meta.excl.indexOf(x) >= 0; })) return;
      var sc = scoreCand(r.meta.tags, ev.tags);
      if (sc.pct >= rubric.bands.likely) {
        if (partial && chance(0.5)) return;
        var row = { rauId: r.id, eventId: ev.id, status: "confirmed", score: sc.pct, by: r.roles.owner, date: dateBack(400) };
        if (ev.side === "compliance") {
          row.mcrIds = mcrs.filter(function (m) { return m.parentEventId === ev.id && m.head; }).slice(0, 3 + ri(5)).map(function (m) { return m.id; });
        }
        register.push(row);
      } else if (sc.pct >= rubric.bands.possible && !partial && chance(0.25)) {
        register.push({ rauId: r.id, eventId: ev.id, status: chance(0.6) ? "confirmed" : "rejected", score: sc.pct, by: r.roles.owner, date: dateBack(400), rationale: chance(0.6) ? "Resolved via applicability questions." : "Reviewed with ORBO; determined out of scope for this process." });
      }
    });
  });
  /* Story RAU: mid-flight - likely + strongest middles confirmed, one
     rejected with rationale, the rest of the middle left as live work. */
  var story = raus.filter(function (r) { return r.id === STORY_ID; })[0];
  if (story) {
    var confirmedN = 0;
    riskEvents.forEach(function (ev) {
      if (ev.excludedBy && ev.excludedBy.some(function (x) { return story.meta.excl.indexOf(x) >= 0; })) return;
      var sc = scoreCand(story.meta.tags, ev.tags);
      if (sc.pct >= rubric.bands.likely || (sc.pct >= 58 && confirmedN < 11)) {
        confirmedN++;
        var row = { rauId: story.id, eventId: ev.id, status: "confirmed", score: sc.pct, by: story.roles.owner, date: dateBack(30), rationale: sc.pct < rubric.bands.likely ? "Resolved via applicability questions." : undefined };
        if (ev.side === "compliance") {
          row.mcrIds = mcrs.filter(function (m) { return m.parentEventId === ev.id && m.head; }).slice(0, 4 + ri(4)).map(function (m) { return m.id; });
        }
        register.push(row);
      } else if (sc.pct >= 52 && sc.pct < 58 && confirmedN === 11) {
        confirmedN++;
        register.push({ rauId: story.id, eventId: ev.id, status: "rejected", score: sc.pct, by: story.roles.baco, date: dateBack(20), rationale: "Discussed with BACO: the obligation sits with the counterparty RAU that executes the payment." });
      }
    });
  }
})();

/* ==SECTION:ratings== */
/* Capability 3: inherent ratings per confirmed risk instance.
   Level math MIRRORS kernel/engine.js inherentLevels exactly, so shipped
   suggested levels reconcile with live recomputation. Rows: s = suggested
   [likelihood, financial, customer, regulatory, operational], f = final,
   ov = overridden, note = override rationale. */
function inhHasTag(rau, prefix) {
  var tags = (rau.meta && rau.meta.tags) || [];
  for (var i = 0; i < tags.length; i++) { if (tags[i].indexOf(prefix) === 0) return tags[i]; }
  return null;
}
function inhClamp(x) { return x < 1 ? 1 : x > 5 ? 5 : x; }
function inhLevels(rau, ev, mcrN) {
  var vol = rau.annualVolume || 0;
  var err = ev.errClass || 3, sev = ev.sevClass || 3;
  var l = 1 + (vol >= 6000000 ? 3 : vol >= 2500000 ? 2 : vol >= 500000 ? 1 : 0);
  if (err >= 4) l += 1;
  if ((rau.priorLosses12m || 0) > 0) l += 1;
  if (rau.changeLevel === "high") l += 1;
  if (err <= 1) l -= 1;
  var mm = inhHasTag(rau, "mm:");
  var moves = mm && mm !== "mm:no-money-movement";
  var fin = sev + (moves && vol >= 2500000 ? 1 : 0);
  var cust = 1;
  if (inhHasTag(rau, "cust:consumer")) {
    cust = vol >= 2500000 ? 4 : vol >= 500000 ? 3 : 2;
    if (ev.side === "compliance" && mcrN >= 5) cust += 1;
  }
  var reg;
  if (ev.side === "compliance") reg = 2 + (mcrN >= 3 ? 1 : 0) + (ev.enfFlag ? 1 : 0);
  else reg = 1 + (ev.enfFlag ? 1 : 0);
  var ho = (rau.handoffs || []).length;
  var ops = 1 + (ho >= 6 ? 2 : ho >= 3 ? 1 : 0) + (vol >= 2500000 ? 1 : 0) + (err >= 5 ? 1 : 0);
  return [inhClamp(l), inhClamp(fin), inhClamp(cust), inhClamp(reg), inhClamp(ops)];
}
var OV_NOTES = [
  "Volume overstates exposure here: most items are book-entry with no external movement.",
  "Prior-period remediation added a systemic control; recurrence evidence supports the lower frequency.",
  "Carrier concentration raises the credible customer count above the volume anchor.",
  "Losses in the last cycle exceeded the class anchor; rated to observed severity.",
  "Downstream dependency has a same-day manual workaround; disruption anchor overstated.",
  "Obligation applies to a narrow product slice of this RAU; nexus is thinner than the MCR count implies."
];
var ratings = [];
(function buildRatings() {
  var rauById = {};
  raus.forEach(function (r) { rauById[r.id] = r; });
  var evById = {};
  riskEvents.forEach(function (e) { evById[e.id] = e; });
  var outliersLeft = 10;
  register.forEach(function (g) {
    if (g.status !== "confirmed" || g.rauId === STORY_ID) return;
    var rau = rauById[g.rauId], ev = evById[g.eventId];
    if (!rau || !ev) return;
    var pRated = rau.riskIdStatus === "complete" ? 0.9 : 0.55;
    if (!chance(pRated)) return;
    var mcrN = g.mcrIds ? g.mcrIds.length : 0;
    var s = inhLevels(rau, ev, mcrN);
    var f = s.slice();
    var ov = 0, note;
    if (outliersLeft > 0 && chance(0.004)) {
      /* deliberate peer outlier: a big shove for the attention story */
      outliersLeft--;
      var di = ri(5);
      f[di] = inhClamp(f[di] + pick([-3, 3]));
      if (f[di] !== s[di]) { ov = 1; note = pick(OV_NOTES); }
    } else if (chance(0.12)) {
      var dj = ri(5);
      f[dj] = inhClamp(f[dj] + pick([-1, 1]));
      if (f[dj] !== s[dj]) { ov = 1; note = pick(OV_NOTES); }
    }
    var row = {
      rauId: g.rauId, eventId: g.eventId, s: s, f: f, ov: ov,
      by: chance(0.7) ? rau.roles.owner : rau.roles.delegate,
      date: chance(0.08) ? dateBack(380 + ri(300)) : dateBack(320)
    };
    if (note) row.note = note;
    ratings.push(row);
  });
  /* Story RAU: every confirmed instance rated except one operational
     instance left open for the live demo; two hand-crafted overrides. */
  var story = rauById[STORY_ID];
  if (story) {
    var srows = register.filter(function (g) { return g.rauId === STORY_ID && g.status === "confirmed"; });
    var lastOp = null;
    srows.forEach(function (g) { if (evById[g.eventId].side === "operational") lastOp = g; });
    srows.forEach(function (g) {
      var ev = evById[g.eventId];
      if (g === lastOp) return; /* left unrated for the live demo */
      var mcrN = g.mcrIds ? g.mcrIds.length : 0;
      var s = inhLevels(story, ev, mcrN);
      var f = s.slice();
      var row = { rauId: STORY_ID, eventId: g.eventId, s: s, f: f, ov: 0, by: story.roles.owner, date: dateBack(15) };
      if (ev.name.indexOf("Mortgage Servicing") === 0) {
        f[2] = inhClamp(f[2] + 1); row.ov = 1;
        row.note = "Escrow errors reach the full serviced portfolio; carrier concentration raises the credible customer count above the volume anchor.";
      } else if (ev.name.indexOf("Sanctions") === 0) {
        f[1] = inhClamp(f[1] - 1); row.ov = 1;
        row.note = "Disbursements are dual-approved above threshold; a credible single event sits below the class anchor.";
      }
      ratings.push(row);
    });
  }
})();

/* ==SECTION:controls== */
/* Capability 4: one central control inventory (the GRC is the system of
   record), controls linked to risk instances, shared controls reused
   across RAUs, expected-control rules on FCRM-flavored events with a
   deliberate slice of misses, and declared-key flags kept only to
   contrast with the derived-key math at runtime. */
var CTL_PREV = [
  ["Dual authorization for {K} above threshold", "manual", "per-event"],
  ["System-enforced {K} validation at entry", "automated", "per-event"],
  ["Pre-release checklist for {K}", "manual", "per-event"],
  ["Access restriction on {K} functions", "automated", "quarterly"],
  ["Segregation of duties in {K} processing", "manual", "per-event"]
];
var CTL_DET = [
  ["Daily reconciliation of {K} activity", "automated", "daily"],
  ["Supervisor review of {K} exception queue", "manual", "daily"],
  ["Monthly QA sampling of {K} items", "manual", "monthly"],
  ["Automated anomaly alerting on {K}", "automated", "daily"],
  ["Quarterly access recertification for {K}", "manual", "quarterly"]
];
var EXPECTED_EVENTS = [
  ["Sanctions Screening Failure", "Sanctions screening must complete before any funds release."],
  ["BSA/AML Program Failure", "Transaction monitoring coverage is mandatory wherever AML risk applies."],
  ["Error Resolution Failure (Reg E)", "Dispute intake logging with deadline tracking is required for Reg E scope."],
  ["Privacy or Data Protection Violation", "Access restriction on nonpublic information is required."],
  ["Flood Insurance Requirement Failure", "Coverage verification before closing is required in flood scope."],
  ["Debt Collection Practice Violation (FDCPA)", "Call-time and contact-frequency enforcement is required in collections."]
];
var controls = [], controlLinks = [], expRules = [];
(function buildControls() {
  var cn = 1;
  function ctlId() { return "CTL-" + pad(cn++, 4); }
  var evById = {};
  riskEvents.forEach(function (e) { evById[e.id] = e; });
  var rauById = {};
  raus.forEach(function (r) { rauById[r.id] = r; });
  var confByEvent = {};
  register.forEach(function (g) {
    if (g.status !== "confirmed") return;
    (confByEvent[g.eventId] = confByEvent[g.eventId] || []).push(g);
  });
  var sharedOwners = raus.filter(function (r) { return r.category === "shared-services"; });
  function mk(tpl, kw, owningRauId, shared, evName) {
    var name = tpl[0].replace("{K}", kw);
    return {
      id: ctlId(), name: name,
      desc: "Applied to in-scope " + evName.toLowerCase() + " activity; exceptions are logged, escalated, and retained per procedure.",
      owningRauId: owningRauId, shared: shared,
      type: CTL_DET.indexOf(tpl) >= 0 ? "detective" : "preventive",
      automation: tpl[1], frequency: tpl[2],
      owner: person(), status: "active", created: dateBack(900),
      declaredKey: chance(shared ? 0.6 : 0.18),
      design: pick(["effective", "effective", "effective", "partially-effective"]),
      perf: chance(0.03) ? "ineffective" : pick(["effective", "effective", "partially-effective"])
    };
  }
  function link(c, g) { controlLinks.push({ c: c.id, r: g.rauId, e: g.eventId }); }
  /* shared controls per event, expected rules on the named families */
  var en = 1;
  riskEvents.forEach(function (ev) {
    var insts = (confByEvent[ev.id] || []);
    if (!insts.length) return;
    var base = ev.name.replace(/ - (Origination|Servicing|Operations|Institutional|Consumer|Commercial)$/, "");
    var expDef = null;
    for (var x = 0; x < EXPECTED_EVENTS.length; x++) { if (EXPECTED_EVENTS[x][0] === base) expDef = EXPECTED_EVENTS[x]; }
    var kw = (ev.keywords || ["processing"])[0];
    var tpl = expDef ? CTL_PREV[ri(2)] : (chance(0.6) ? CTL_PREV[ri(CTL_PREV.length)] : CTL_DET[ri(CTL_DET.length)]);
    var sc = mk(tpl, kw, (pick(sharedOwners) || raus[0]).id, true, ev.name);
    controls.push(sc);
    var coverageRate = expDef ? 0.85 : 0.2;
    insts.forEach(function (g) {
      if (g.rauId === STORY_ID) return; /* story links are crafted below */
      if (chance(coverageRate)) link(sc, g);
    });
    if (expDef) {
      expRules.push({ id: "EXP-" + pad(en++, 2), eventId: ev.id, controlId: sc.id, note: expDef[1] });
    }
  });
  /* local controls per confirmed instance; ~8% deliberate zero-control gaps */
  raus.forEach(function (r) {
    if (r.id === STORY_ID) return;
    var mine = register.filter(function (g) { return g.rauId === r.id && g.status === "confirmed"; });
    var prevLocal = null;
    mine.forEach(function (g) {
      if (chance(0.08)) return; /* the gap story */
      var ev = evById[g.eventId];
      var n = 1 + (chance(0.7) ? 1 : 0) + (chance(0.25) ? 1 : 0);
      for (var i = 0; i < n; i++) {
        var tpl2 = chance(0.55) ? CTL_PREV[ri(CTL_PREV.length)] : CTL_DET[ri(CTL_DET.length)];
        var kw2 = (ev.keywords || ["processing"])[ri(Math.max(1, (ev.keywords || []).length))] || "processing";
        var c = mk(tpl2, kw2, r.id, false, ev.name);
        controls.push(c);
        link(c, g);
        if (prevLocal && chance(0.12)) link(c, prevLocal); /* reused within the RAU */
      }
      prevLocal = g;
    });
  });
  /* story RAU: crafted control environment for the demos */
  var story = rauById[STORY_ID];
  if (story) {
    var srows = register.filter(function (g) { return g.rauId === STORY_ID && g.status === "confirmed"; });
    function srow(pfx) {
      for (var i = 0; i < srows.length; i++) { if (evById[srows[i].eventId].name.indexOf(pfx) === 0) return srows[i]; }
      return null;
    }
    function scraft(name, type, automation, frequency, declaredKey) {
      var c = {
        id: ctlId(), name: name,
        desc: name + ". Documented in the escrow disbursement procedure with daily exception reporting to the operations manager.",
        owningRauId: STORY_ID, shared: false, type: type, automation: automation, frequency: frequency,
        owner: story.roles.owner, status: "active", created: dateBack(700), declaredKey: declaredKey,
        design: "effective", perf: "effective"
      };
      controls.push(c);
      return c;
    }
    var cDual = scraft("Dual authorization for escrow disbursements above threshold", "preventive", "manual", "per-event", true);
    var cRecon = scraft("Daily escrow sub-ledger reconciliation", "detective", "automated", "daily", false);
    var cPayee = scraft("Payee master data validation at setup", "preventive", "automated", "per-event", false);
    var regx = srow("Mortgage Servicing"), txn = srow("Transaction Capture"), sanc = srow("Sanctions");
    var lastOp2 = null;
    srows.forEach(function (g) { if (evById[g.eventId].side === "operational") lastOp2 = g; });
    if (regx) { link(cDual, regx); link(cRecon, regx); }
    if (txn && txn !== lastOp2) { link(cRecon, txn); } /* single point of mitigation on purpose */
    if (sanc) { link(cPayee, sanc); } /* expected sanctions screening NOT linked: coverage story */
    srows.forEach(function (g) {
      if (g === regx || g === txn || g === sanc) return;
      if (g === lastOp2) return; /* the live-demo instance keeps zero controls */
      if (chance(0.75)) link(cDual, g);
      if (chance(0.5)) link(cRecon, g);
    });
  }
})();
/* recommended control types on head MCRs (guides the drafted skeleton) */
var REC_TYPES = ["preventive screening", "automated validation", "detective reconciliation", "supervisory review", "records retention"];
mcrs.forEach(function (m) {
  if (m.head) m.recCtl = picks(REC_TYPES, 1 + ri(2));
});

/* ==SECTION:requests== */
var requests = [];
(function buildRequests() {
  var story = {
    id: "RCR-0007", type: "new", stage: "uniqueness-review",
    proposedName: "Escrow Disbursement Processing", subLobId: subLobs.filter(function (s) { return s.name === "Loan Servicing Operations"; })[0].id,
    category: "business-service",
    requester: "T. Whitfield (RAU Owner designate)", submitted: "2026-08-11",
    serviceIds: services.filter(function (s) { return ["Escrow Administration", "Payment Processing"].indexOf(s.name) >= 0; }).map(function (s) { return s.id; }),
    description: "Processes disbursements from escrow accounts for taxes, insurance, and PMI, including validation, funding release, and reconciliation.",
    bullets: ["Receive and validate disbursement requests", "Approve and release funding", "Reconcile disbursements and report"],
    assistant: [
      { who: "assistant", text: "Roughly how many disbursements does this process handle per month?" },
      { who: "user", text: "About 45,000 in peak tax months, 12,000 otherwise." },
      { who: "assistant", text: "Do any disbursements leave the bank by wire, or only by check and ACH?" },
      { who: "user", text: "Wire for insurance carriers, ACH for tax authorities." }
    ],
    uniqueness: {
      similar: [
        { rauId: (raus.filter(function (r) { return r.name === "Escrow Administration"; })[0] || raus[0]).id, score: 82, reasons: ["Shares services: Escrow Administration, Payment Processing", "Bullet 1 resembles its step 'Receive escrow disbursement request'", "Same SubLOB: Loan Servicing Operations"] },
        { rauId: raus.filter(function (r) { return r.subLobId === (subLobs.filter(function (s) { return s.name === "Loan Servicing Operations"; })[0]).id && r.name !== "Escrow Administration"; })[0].id, score: 41, reasons: ["Shares service: Payment Processing", "Same SubLOB: Loan Servicing Operations"] }
      ],
      category: { selected: "business-service", suggested: "business-service", confidence: 88, rationale: "Performs line-of-business servicing work for Consumer Lending customers; no cross-LOB service pattern detected." },
      recommendation: "return-for-refinement",
      rationaleText: "The described work overlaps 82% with RAU Escrow Administration in the same Line of Business. Recommend the requester meet the RAU owner to establish differentiation or absorb this scope."
    }
  };
  requests.push(story);
  var others = [
    { type: "new", stage: "draft-intake", proposedName: "Merchant Dispute Intake", note: "Bullets drafted; assistant awaiting volume answers." },
    { type: "new", stage: "process-mapping", proposedName: "Charitable Trust Grant Processing", note: "2 of 4 phases mapped; 1 handoff identified." },
    { type: "new", stage: "standards-check", proposedName: "Vendor Invoice Exception Handling", note: "1 lint failure: decision step missing second path." },
    { type: "new", stage: "pending-governance", proposedName: "Digital Wallet Provisioning Support", note: "All standards green; roles proposed." },
    { type: "new", stage: "metadata-creation", proposedName: "Fleet Card Program Administration", note: "Survey 71% complete; 4 open questions." },
    { type: "merge", stage: "uniqueness-review", proposedName: "Merge: Statement Production East + West", note: null },
    { type: "split", stage: "pending-governance", proposedName: "Split: Fraud Claims Intake & Triage", note: null },
    { type: "retire", stage: "pending-governance", proposedName: "Retire: Microfilm Records Conversion", note: null },
    { type: "new", stage: "returned-for-refinement", proposedName: "Branch Cash Forecasting", note: "Returned 2026-08-02: overlaps ATM & Cash Operations forecasting." }
  ];
  var n = 1;
  others.forEach(function (o) {
    var sub = pick(subLobs);
    if (n === 7) n++; /* RCR-0007 is the featured story request */
    var id = "RCR-" + pad(n++, 4);
    var row = {
      id: id, type: o.type, stage: o.stage, proposedName: o.proposedName, subLobId: sub.id,
      category: pick(["business-service", "business-service", "shared-services", "enterprise"]),
      requester: person() + " (" + pick(["RAU Owner designate", "Delegate", "BCM team"]) + ")",
      submitted: dateBack(60), note: o.note, serviceIds: picks(svcLeaves, 2).map(function (s) { return s.id; }),
      description: o.proposedName + " request.", bullets: ["Intake work items", "Process and approve", "Reconcile and report"], assistant: [], uniqueness: null
    };
    if (o.type !== "new") {
      var targets = picks(raus, o.type === "merge" ? 2 : 1).map(function (r) { return r.id; });
      row.targetRauIds = targets;
      var t0 = raus.filter(function (r) { return r.id === targets[0]; })[0];
      var evCount = register.filter(function (g) { return g.rauId === t0.id && g.status === "confirmed"; }).length;
      row.impact = { risks: evCount, handoffs: t0.handoffs.length, openQuestions: ri(3), note: (o.type === "merge" ? "Moves " : o.type === "split" ? "Divides " : "Requires reassignment of ") + evCount + " confirmed risks and " + t0.handoffs.length + " handoffs." };
    }
    requests.push(row);
  });
})();

/* ==SECTION:write== */
function writeData(name, rows, extra) {
  var payload = { version: TODAY, rows: rows };
  if (extra) { Object.keys(extra).forEach(function (k) { payload[k] = extra[k]; }); }
  var js = "window.GRC_DATA = window.GRC_DATA || {};\n" +
    "window.GRC_DATA." + name + " = " + JSON.stringify(payload) + ";\n";
  fs.writeFileSync(path.join(OUT, name.toLowerCase() + ".js"), js);
  return js.length;
}
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
if (!fs.existsSync(TPL)) fs.mkdirSync(TPL, { recursive: true });
var sizes = {};
sizes.orgnodes = writeData("orgNodes", orgNodes);
sizes.services = writeData("services", services);
sizes.raus = writeData("raus", raus);
sizes.riskevents = writeData("riskEvents", riskEvents);
sizes.mcrs = writeData("mcrs", mcrs);
sizes.register = writeData("register", register);
sizes.requests = writeData("requests", requests);
sizes.metaquestions = writeData("metaQuestions", META_QS);
sizes.rubric = writeData("rubric", [], { def: rubric });
sizes.ratings = writeData("ratings", ratings);
sizes.controls = writeData("controls", controls);
sizes.controllinks = writeData("controlLinks", controlLinks);
sizes.expectedcontrols = writeData("expectedControls", expRules);
fs.writeFileSync(path.join(OUT, "release.js"),
  "window.GRC_DATA = window.GRC_DATA || {};\n" +
  "window.GRC_DATA.release = {number:\"R6\", date:\"" + TODAY + "\", label:\"Capability 4: controls with derived key and expected controls\"};\n");

/* ==SECTION:csv-templates== */
function csv(name, headers, rows) {
  var lines = [headers.join(",")];
  rows.forEach(function (r) {
    lines.push(headers.map(function (h) {
      var v = r[h]; if (v === undefined || v === null) v = "";
      if (Array.isArray(v)) v = v.join(";");
      v = String(v);
      return v.indexOf(",") >= 0 || v.indexOf("\"") >= 0 ? "\"" + v.replace(/"/g, "\"\"") + "\"" : v;
    }).join(","));
  });
  fs.writeFileSync(path.join(TPL, name + ".csv"), lines.join("\r\n") + "\r\n");
}
csv("raus", ["id", "name", "subLobId", "category", "description", "serviceIds", "owner", "delegate", "bcmContact", "orbo", "baco", "fte", "annualVolume", "changeLevel", "tags", "excl"],
  raus.slice(0, 3).map(function (r) {
    return { id: r.id, name: r.name, subLobId: r.subLobId, category: r.category, description: r.description, serviceIds: r.serviceIds, owner: r.roles.owner, delegate: r.roles.delegate, bcmContact: r.roles.bcmContact, orbo: r.roles.orbo, baco: r.roles.baco, fte: r.fte, annualVolume: r.annualVolume, changeLevel: r.changeLevel, tags: r.meta.tags, excl: r.meta.excl };
  }));
csv("orgnodes", ["id", "level", "parentId", "name"], orgNodes.slice(0, 4));
csv("services", ["id", "parentId", "level", "name"], services.slice(0, 5));
csv("riskevents", ["id", "side", "name", "description", "qualification", "keywords", "tags", "excludedBy"], riskEvents.slice(0, 3));
csv("mcrs", ["id", "name", "parentEventId", "regFamily", "citation", "regulator", "publishedDate", "tags", "obligations", "prohibitions"], mcrs.slice(0, 3));
csv("register", ["rauId", "eventId", "status", "score", "mcrIds", "by", "date", "rationale"], register.slice(0, 3));
csv("ratings", ["rauId", "eventId", "s", "f", "ov", "note", "by", "date"], ratings.slice(0, 3));
csv("controls", ["id", "name", "desc", "owningRauId", "shared", "type", "automation", "frequency", "owner", "declaredKey", "design", "perf", "status", "created"], controls.slice(0, 3));
csv("controllinks", ["c", "r", "e"], controlLinks.slice(0, 3));
csv("expectedcontrols", ["id", "eventId", "controlId", "note"], expRules.slice(0, 2));

/* ==SECTION:stats== */
console.log("orgNodes", orgNodes.length, "| services", services.length, "| raus", raus.length,
  "| events", riskEvents.length, "| mcrs", mcrs.length, "| register", register.length,
  "| requests", requests.length, "| ratings", ratings.length, "| controls", controls.length,
  "| links", controlLinks.length, "| expected", expRules.length, "| featured", featured.length);
Object.keys(sizes).forEach(function (k) { console.log(k, Math.round(sizes[k] / 1024) + " KB"); });
