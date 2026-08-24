/* GRC modules/demo.js v2.3.0 2026-08-23 */
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
    id: "demo", version: "2.3.0", tab: "Home",
    caps: { "present": null },
    routes: { "present": present }
  });
})();
