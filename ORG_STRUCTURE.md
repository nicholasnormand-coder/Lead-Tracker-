# Organization structure

This is the operating model for Nick's real estate business in Central Louisiana. One human, one executive, three platforms, five departments, twenty-three specialist agents.

The single source of truth is `src/org/org-structure.json`. The Lead Tracker app reads it to render the **Org** tab and to tag every lead with its owning agent. `npm run build:charters` turns it into one paste-ready charter per agent under `agents/`. `npm test` checks that the JSON is consistent and that the charters are in sync.

## Operating principle

AI agents draft, research, track, and recommend. Nick decides, signs, and sends. Anything client-facing, contractual, or financial is approved by Nick before it leaves the building.

## The chart

```
NICK
 │  Owner / Broker Agent. Final decision on everything. Only human signature.
 ▼
CHATGPT CEO + CHIEF OF STAFF
 │  Runs the company day to day. Daily brief, weekly scorecard, routes work, escalates only true decisions.
 │
 ├── GROK WORKFORCE ─────────── the five operating departments (below)
 ├── ARGUS COMMAND CENTER ───── monitoring, alerts, dashboards, audit log
 └── CLAUDE CODE ENGINEERING ── builds and maintains the tools, starting with this Lead Tracker

GROK WORKFORCE
 ├── COO / OPERATIONS ........ first appointment to closed file
 │     Transaction Manager, Buyer Manager, Listing Manager, Contract Agent, Compliance Agent
 ├── CGO / GROWTH ............ inquiry to qualified appointment, nothing goes cold
 │     Lead Manager, Qualification Agent, Follow-Up Agent, Nurture Agent, Opportunity Hunter
 ├── CMO / MARKETING ......... every listing and milestone visible, on brand, compliant
 │     Listing Content, Social Media, Marketplace, Brand Compliance
 ├── CFO / FINANCE AND BI .... where money comes from, goes, and is heading
 │     Commission Tracker, Expense Analyst, Lead ROI, Forecasting
 └── CENLA INTELLIGENCE ...... the most informed agent in Central Louisiana
       Market Research, MLS Intelligence, Financing Research, Competitor Research, Investment Analysis
```

## Who does what

| Layer | Platform | Job |
|---|---|---|
| Nick | Human | Owns the client relationship. Approves every recommendation that touches a client, a contract, or money. Handles showings, appointments, negotiation, closings. |
| CEO + Chief of Staff | ChatGPT | Turns Nick's goals into a weekly plan. Routes work to department heads. Compiles the daily brief and weekly scorecard. Escalates only real decisions. |
| Grok Workforce | Grok | The five departments and their twenty-three agents. All day-to-day work. |
| Argus Command Center | Argus | Watches the pipeline, deadlines, and follow-up queue. Fires alerts. Serves dashboards. Logs every agent action. |
| Claude Code Engineering | Claude Code | Builds and maintains the Lead Tracker and integrations. Keeps the org chart and charters in code. Feeds Argus clean data. |

## Pipeline ownership

Every lead status in the tracker has exactly one owning agent. The Leads tab shows the owner on each card, and the Org tab shows live counts per owner.

| Lead status | Owning agent | Department |
|---|---|---|
| New Lead | Lead Manager | Growth |
| Contacted | Qualification Agent | Growth |
| Nurturing | Nurture Agent | Growth |
| Appt Set | Follow-Up Agent | Growth |
| Active Buyer | Buyer Manager | Operations |
| Active Seller | Listing Manager | Operations |
| Under Contract | Transaction Manager | Operations |
| Closed | Commission Tracker | Finance and BI |
| Dead | Opportunity Hunter | Growth |

## How a lead moves through the organization

1. **Lead Manager** logs the lead and drafts the first touch within one hour.
2. **Qualification Agent** scores it. Ready leads go to appointment setting. Warm leads go to **Nurture Agent**, who hands them back when a buying signal appears.
3. **Follow-Up Agent** confirms the appointment and preps Nick. After the appointment the lead becomes an active buyer under **Buyer Manager** or an active seller under **Listing Manager**.
4. **Contract Agent** prepares offers, counters, and addenda as drafts for Nick's signature.
5. **Transaction Manager** runs the executed deal to closing and hands the file to **Compliance Agent** for brokerage submission.
6. **Commission Tracker** records the closing. **Nurture Agent** picks the client back up for referrals and repeat business.
7. Dead leads go to **Opportunity Hunter** for the 90-day re-engagement. Social and Marketplace inquiries flow back to the Lead Manager.

The complete handoff list, with the trigger for each, is in `src/org/org-structure.json` under `handoffs`.

## Escalation rules

- Any agent may escalate to its department head at any time.
- Department heads escalate to the CEO. Only the CEO escalates to Nick.
- Anything that touches a client, a contract, or money is a Nick decision. Agents prepare it, Nick approves it.
- A deadline at risk goes to Argus immediately, not through the chain.
- A compliance question stops the work until the Compliance Agent or Brand Compliance clears it.

## Operating cadence

| Rhythm | Owner | When | Contains |
|---|---|---|---|
| Daily brief | CEO | Every morning | Follow-ups due, deadlines this week, stuck items, decisions needed from Nick |
| Weekly scorecard | CEO | Monday | Leads by source, pipeline by stage, closings, GCI vs. goal, forecast, top risks |
| Monthly close | CFO / BI | By the 5th | P&L, commission ledger, lead ROI by source |
| Market snapshot | Cenla Intelligence | By the 3rd | Inventory, days on market, absorption, price trends by parish |
| Quarterly review | Nick | First week of the quarter | Goals vs. actual, competitor report, what to scale or cut |

## Rolling this out

1. **Stand up the CEO first.** Paste `agents/executive/ceo.md` into a ChatGPT project as its instructions. Give it Nick's goals for the quarter. It will produce the first weekly plan.
2. **Stand up Growth next.** The five Growth charters under `agents/growth/` go into Grok. Growth touches every lead, so it produces value on day one.
3. **Then Operations.** The five Operations charters go live when the first lead reaches Appt Set.
4. **Marketing, Finance, and Intelligence** come online as listings and closings start to flow.
5. **Argus** gets fed by the Lead Tracker. Start with the two alerts that matter most: overdue follow-ups and contract deadlines inside 48 hours.
6. **Claude Code** owns this repo. Feature requests from any department head come here.

## Changing the structure

Edit `src/org/org-structure.json`, then run:

```
npm run build:charters
npm test
```

The app, the charters, and this document's pipeline table must agree. The test fails if a lead status has no owner, an agent's `ownsStatuses` disagrees with `pipelineOwnership`, a handoff points at an unknown agent, or the charters are stale.
