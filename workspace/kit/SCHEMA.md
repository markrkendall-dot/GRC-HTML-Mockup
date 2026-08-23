# GRC MOCKUP - DATA SCHEMA v1.0 (SCHEMA.md)

Single source of truth for entities, fields, vocabularies, relationships, and
metric formulas. Modules and DataForge must match this file exactly.
Lines marked ">> DECISION" hold an org-specific choice. Every default works
as-is: if you change nothing, the demo still builds correctly.

## ID CONVENTIONS
orgUnits ORG-####   frameworks FRW-##   requirements REQ-####   risks RSK-####
controls CTL-####   policies POL-####   issues ISS-####   assessments ASM-####
Dates are ISO strings "YYYY-MM-DD". Percentages are plain numbers 0-100.

## ENTITIES

orgUnits: { id, name, parentId (null = top), type: enterprise|division|department }

frameworks: { id, name, version }
requirements: { id, frameworkId, ref, title, domain }
  ref examples: "GV.OC-01", "A.5.1". domain groups requirements for display.
  >> DECISION D6 - which frameworks. Default: "NIST CSF 2.0" and
     "ISO 27001:2022" (representative subsets).

risks: { id, title, description, category, orgUnitId, ownerRole,
  status: open|under-treatment|pending-acceptance|accepted|closed,
  inherentL 1-5, inherentI 1-5, residualL 1-5, residualI 1-5,
  treatment: mitigate|accept|transfer|avoid, reviewDate, controlIds[] }
  >> DECISION D5 - risk categories. Default: Strategic, Operational,
     Financial, Compliance, Technology, Third-Party, People.
  >> DECISION D3 - scoring scale. Default 5x5 (L and I each 1-5).
  >> DECISION D4 - status vocabulary. Default as above.

controls: { id, name, description, type: preventive|detective|corrective,
  automation: manual|semi-automated|automated,
  frequency: continuous|daily|weekly|monthly|quarterly|annual,
  ownerRole, orgUnitId, status: active|draft|retired, lastTestDate,
  lastTestResult: effective|partially-effective|ineffective|not-tested,
  requirementIds[] }

policies: { id, name, category, ownerRole,
  status: active|under-review|draft|retired,
  effectiveDate, nextReviewDate, attestationPct, controlIds[] }

issues: { id, title, severity: critical|high|medium|low,
  status: open|in-progress|overdue|closed,
  source: internal-audit|self-assessment|external-audit|incident,
  orgUnitId, ownerRole, openedDate, dueDate, closedDate (null if open),
  riskId (may be null), controlId (may be null), assessmentId (may be null),
  remediationSummary }

assessments: { id, name,
  type: internal-audit|self-assessment|external-audit|vendor-review,
  frameworkId (may be null), orgUnitId,
  status: planned|in-progress|complete, startDate, endDate, progressPct }

trend: rows { month "YYYY-MM", openRisks, highResidualRisks, openIssues,
  overdueIssues, controlEffectivePct, attestationPct }
  Trend is global (not per org unit).

## RELATIONSHIP MAP (the kernel builds reverse indexes for all of these)
risk.controlIds        -> controls        (reverse: control -> its risks)
control.requirementIds -> requirements    -> requirement.frameworkId -> framework
policy.controlIds      -> controls        (reverse: control -> its policies)
issue.riskId           -> risk            (reverse: risk -> its issues)
issue.controlId        -> control         (reverse: control -> its issues)
issue.assessmentId     -> assessment      (reverse: assessment -> its findings)
every .orgUnitId       -> orgUnits        (hierarchy via parentId; the global
                                           org filter includes descendants)
Two-hop, for display: risk -> controls -> policies;
                      risk -> controls -> requirements.

## SEVERITY BANDS (residual score = residualL * residualI)
Low 1-4, Moderate 5-9, High 10-15, Critical 16-25.
Band colors: Low = ok (green), Moderate = info (blue), High = warn (amber),
Critical = bad (red).
>> DECISION D-BANDS - change only if your org bands differently.

## COVERAGE RULE (used by the compliance module and dashboard)
A requirement is COVERED if at least one mapped control has status=active AND
lastTestResult=effective. It is PARTIAL if it has mapped controls but none
effective. Otherwise UNCOVERED.
Framework coveragePct = covered requirements / total requirements * 100.

## METRICS - ctx.data.metrics() returns exactly these keys
openRisks           risks with status not closed
criticalHighRisks   open risks whose residual band is High or Critical
openIssues          issues with status open or in-progress or overdue
overdueIssues       issues not closed with dueDate earlier than today
controlEffectivePct active controls with lastTestResult=effective
                    divided by all active controls, times 100
attestationAvgPct   mean attestationPct across active policies
coverage            object { frameworkId: coveragePct }
All metrics respect the global org-unit filter. Trend does not.

## DISPLAY LABELS
>> DECISION D-TERMS (Worksheet W1) - if your org says "Finding" instead of
"Issue", etc., change ONLY these labels. Never rename fields or entity keys.
labels: { risks: "Risks", controls: "Controls", policies: "Policies",
  issues: "Issues", assessments: "Assessments", frameworks: "Frameworks",
  orgUnits: "Org Units" }

## SYNTHETIC DATA DEFAULTS (DataForge generator)
45 orgUnits (3 levels), 2 frameworks with ~250 requirements total, 600 risks,
450 controls, 120 policies, 400 issues, 40 assessments, 24 months of trend.
Owner-role bank: CISO, Risk Manager, Control Owner, Compliance Lead,
Department Head, Internal Audit, IT Operations, Privacy Officer.
Relationship rules: every risk maps 1-4 controls; every control maps 1-5
requirements; every policy maps 2-8 controls; about 70% of issues link a risk
or control; dates fall within the last 30 months; statuses and test results
use plausible weighted distributions (mostly healthy, visibly imperfect).
