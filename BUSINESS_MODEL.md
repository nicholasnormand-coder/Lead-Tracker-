# Cenla Realtor OS: Business Model v2

Nicholas Normand, REALTOR®
The Walker Group at Keller Williams Realty Cenla Partners

An AI-run real estate business. One human owner sets direction and makes every client-facing and contractual decision. An orchestration layer turns that direction into work. Specialist agents carry it out. A single system of record keeps everyone honest.

This is version 2. Version 1 is the chart in section 1. Section 2 is what was wrong with it. Sections 3 onward are the fixed, orchestrated model.

---

## 1. The Original Chart (v1)

```
                      NICK NORMAND
                  Owner / Final Authority
                           │
                           ▼
                 ┌──────────────────┐
                 │     CHATGPT      │
                 │ CEO / Chief of   │
                 │ Staff / Control  │
                 └────────┬─────────┘
                          │
            ┌─────────────┼─────────────┐
            │             │             │
            ▼             ▼             ▼
         GROK BOT       ARGUS        CLAUDE CODE
        WORKFORCE      DASHBOARD       ENGINEER
            │
    ┌───────┼────────┬────────┬────────┐
    ▼       ▼        ▼        ▼        ▼
   COO     CGO      CMO      CFO     INTEL
Operations Growth  Marketing Finance  Research
```

---

## 2. Debug: What Breaks in v1

Ten problems, each with the fix applied in v2.

| # | Problem | Why it matters | Fix in v2 |
|---|---------|----------------|-----------|
| 1 | **No system of record.** The chart has a dashboard (Argus) but nothing for it to read from. Three AI vendors, zero shared memory. | ChatGPT assigns a task, Grok does it, Claude never hears about it. Every handoff is a copy-paste. | Add a **System of Record** layer (section 4). Every agent reads from it and writes to it. |
| 2 | **The workforce is assigned to the wrong platform.** Most of the Grok agents already exist as built Claude skills with live connectors to Gmail, Google Calendar, Drive, and MLS Roam. | You would rebuild, on a platform with no access to your email or MLS, what already runs on one that has both. | Route each agent to the platform that has the tools (section 5). Grok keeps what it is good at: research, X/Twitter signal, drafting. |
| 3 | **Compliance is buried.** LREC compliance is one agent inside COO. Brand compliance is one agent inside CMO. | Compliance is not a department. It is a gate every outbound item passes through. Buried, it gets skipped. | Pull compliance out as a **cross-cutting gate** (section 6). Nothing client-facing leaves without it. |
| 4 | **No approval gates defined.** "Nick is final authority" but the chart never says which actions need him. | Agents either ask about everything (useless) or nothing (dangerous). | Explicit **Human Gate** list (section 6). Everything else runs without him. |
| 5 | **No triggers.** Nothing says what starts work. | A workforce with no inbox does nothing. | **Event triggers** (section 7): new lead, executed contract, listing signed, deadline approaching, and so on. |
| 6 | **Single point of failure at CEO.** Every task routes through ChatGPT. | If that layer is down or wrong, the whole business stalls. | CEO owns **planning and weekly review**. Event-driven work routes **directly** to the owning agent. CEO is informed, not in the path. |
| 7 | **Overlapping agents.** Lead ROI (CFO) vs Lead Manager (CGO). Market Research vs MLS Intelligence vs Competitor Research (Intel). Opportunity Hunter vs Nurture. | Two agents doing one job means two answers and no owner. | Merged and renamed (section 5). Each agent has one input and one output. |
| 8 | **Too much hierarchy for one person.** Five C-suite layers, twenty-plus agents, for a solo REALTOR®. | Every layer is a place for a task to get lost. | Flattened to **5 departments, 12 agents**. Titles kept for clarity, not for reporting lines. |
| 9 | **No metrics.** The chart has a CFO but no numbers anyone is accountable for. | You cannot debug a business you cannot measure. | **KPIs per department** (section 8). |
| 10 | **Client data across three vendors.** Lead names, phone numbers, contract terms flowing ChatGPT → Grok → Claude. | Privacy exposure and three places to leak. | Client PII stays in the system of record and in the platform with the connectors. Other layers get **summaries, not records**. |

---

## 3. The Fixed Chart (v2)

```
                          NICK NORMAND
                      Owner / Final Authority
                    (signs, sends, decides)
                               │
                 ┌─────────────┴─────────────┐
                 │  HUMAN GATE               │
                 │  Approves: offers, prices,│
                 │  contracts, outbound msgs │
                 └─────────────┬─────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   CEO / CHIEF OF    │
                    │   STAFF (ChatGPT)   │
                    │   Plans. Reviews.   │
                    │   Not in the path.  │
                    └──────────┬──────────┘
                               │
  ┌────────────────────────────┼────────────────────────────┐
  │                            │                            │
  ▼                            ▼                            ▼
┌────────────────┐   ┌──────────────────────┐   ┌────────────────────┐
│  SYSTEM OF     │◄──│   OPERATING AGENTS   │──►│   ARGUS DASHBOARD  │
│  RECORD        │   │                      │   │   (reads SoR only) │
│  Google Sheet  │   │  COO  Operations     │   └────────────────────┘
│  + Drive       │   │  CGO  Growth         │
│  + Calendar    │   │  CMO  Marketing      │   ┌────────────────────┐
│  + Gmail       │   │  CFO  Finance        │   │   CLAUDE CODE      │
└────────────────┘   │  INTEL Research      │   │   ENGINEER         │
                     └──────────┬───────────┘   │   Builds the tools │
                                │               └────────────────────┘
                     ┌──────────▼───────────┐
                     │   COMPLIANCE GATE    │
                     │   LREC · NAR · Fair  │
                     │   Housing · Brand    │
                     └──────────────────────┘
```

Two things changed structurally. The **system of record** is now the hub everything reads and writes. The **compliance gate** and **human gate** are now in the path, not inside a department.

---

## 4. System of Record

One source of truth. Nothing else is authoritative.

| Data | Lives in | Owner agent |
|------|----------|-------------|
| Leads and pipeline | Google Sheet (Lead Tracker) | Lead Manager |
| Deals under contract, deadlines | Cenla Closing Desk board + Google Calendar | Transaction Manager |
| Contracts, disclosures, closing docs | Google Drive, one folder per deal | Transaction Manager |
| Client communication | Gmail (drafts staged, Nick sends) | Follow-Up Agent |
| Commission and expenses | Google Sheet (Finance tab) | Commission Tracker |
| Listing content and graphics | Google Drive, one folder per listing | Listing Content |

Rules:
- An agent that changes state writes it to the system of record **before** reporting it.
- Argus reads from the system of record only. It never has its own data.
- The Lead Tracker app in this repo is the front end for the Leads sheet. Today it holds data in memory; the next engineering task is to wire it to the sheet.

---

## 5. Operating Agents

Flattened from 22 agents to 12. Each has one input, one output, one platform. **Already built** means a working Claude skill exists in Nick's account today.

### COO / Operations
| Agent | Input | Output | Platform | Status |
|-------|-------|--------|----------|--------|
| **Transaction Manager** | Executed purchase agreement, Authentisign / dotloop events | Deadline calendar, stuck-signature flags, staged emails, Lone Wolf filing | Claude | **Already built** (`cenla-transaction-coordinator`, `contract-to-close-deadline-tracker`) |
| **Showing Coordinator** | List of addresses, buyer name | Route, agent prep card, buyer presentation card, calendar event | Claude | **Already built** (`buyer-showing-prep`, `showing-route-optimizer`, `schedule-appointment`) |

*Merged:* Buyer Manager and Listing Manager fold into Transaction Manager and Showing Coordinator. Contract Agent folds into Transaction Manager. Compliance Agent moves to the gate.

### CGO / Growth
| Agent | Input | Output | Platform | Status |
|-------|-------|--------|----------|--------|
| **Lead Manager** | New lead from any source | Lead row in sheet, qualified or not, next follow-up date set | Claude (Lead Tracker app + sheet) | Partial. App exists, sheet wiring is next. |
| **Follow-Up Agent** | Follow-up due today | Staged draft in Gmail in Nick's voice | Claude | Partial. Templates exist in app, drafting via `nicholas-preferences`. |
| **Opportunity Hunter** | Weekly | Expired listings, FSBOs, price drops, X/Twitter and Facebook signals in Cenla | Grok | Not built. Grok's real-time search is the right tool. |

*Merged:* Qualification Agent folds into Lead Manager. Nurture Agent folds into Follow-Up Agent (a 90-day nurture is a follow-up with a longer date).

### CMO / Marketing
| Agent | Input | Output | Platform | Status |
|-------|-------|--------|----------|--------|
| **Listing Content** | Listing status change | Compliant captions for FB, IG, Marketplace, Groups + branded graphics | Claude | **Already built** (`cenla-social-content`, `listing-graphic-generator`) |
| **Client Guides** | New buyer or seller client | Branded buyer guide in Nick's voice | Claude | **Already built** (`branded-buyer-skill-generator`) |

*Merged:* Social Media and Marketplace fold into Listing Content. Brand Compliance moves to the gate.

### CFO / Finance
| Agent | Input | Output | Platform | Status |
|-------|-------|--------|----------|--------|
| **Commission Tracker** | Deal status changes | Stage-weighted pipeline forecast, closed GCI, per-deal rate | Claude (Lead Tracker + sheet) | Partial. App shows a flat 2.5% total; needs stage weighting and editable rate. |
| **Lead ROI** | Monthly | Cost and closed GCI per lead source | Claude | Not built. Needs an expense tab in the sheet. |

*Merged:* Expense Analyst and Forecasting fold into Commission Tracker and Lead ROI.

### INTEL / Research
| Agent | Input | Output | Platform | Status |
|-------|-------|--------|----------|--------|
| **Pricing Strategist** | Address, buyer or seller side | Comps, price tiers, offer strategy, agent and client reports | Claude (MLS Roam in Cowork) | **Already built** (`comp-price-strategy`, `acadia-parish-price-strategy-comps`) |
| **Market Analyst** | Monthly, or on request | Cenla market snapshot, rates, competitor activity, investment reads | Grok + Claude | Partial. Grok for real-time signal, Claude for the report. |
| **The Council** | Any hard decision | Multi-expert deliberation and recommendation | Claude | **Already built** (`cenla-council`) |

*Merged:* Market Research, MLS Intelligence, Financing Research, Competitor Research, and Investment Analysis fold into Pricing Strategist and Market Analyst.

### Platform assignment, summarized
- **Claude (Cowork + Code):** anything that touches Gmail, Calendar, Drive, MLS, or a client. Nine of twelve agents.
- **Grok:** real-time public signal. Opportunity Hunter, Market Analyst research half.
- **ChatGPT:** CEO layer. Planning, weekly review, strategic writing. No client PII.
- **Argus:** display only.

---

## 6. Gates

### Human Gate (Nick decides, every time)
1. Any offer, counter, or price recommendation to a client
2. Any contract, amendment, or extension
3. Any email or text that goes to a client, another agent, or a vendor
4. Any social post or ad
5. Any expense over $100
6. Any new vendor or tool with access to client data

Everything not on this list runs without him.

### Compliance Gate (automated, before the Human Gate)
Every outbound item is checked against, in order:
1. **LREC** Chapter 25 (advertising, brokerage name, license disclosure)
2. **NAR** Article 12 (true picture in advertising)
3. **Fair Housing Act** §804(c) (no protected-class language or steering)
4. **Brand**: REALTOR® in caps, compliant signature block, banned-phrase list, no em dashes

An item that fails goes back to the agent with the reason. It never reaches Nick broken.

---

## 7. Orchestration: How Work Flows

### Event-driven (runs when something happens)

| Trigger | Routes to | Then | Gate |
|---------|-----------|------|------|
| New lead arrives (any source) | Lead Manager | Row created, follow-up set for today, Follow-Up Agent drafts the 1-hour reply | Human |
| Follow-up date reached | Follow-Up Agent | Draft staged in Gmail | Human |
| Lead moves to Appt Set | Showing Coordinator | Calendar event, prep cards | Human (send invite) |
| Buyer wants to write an offer | Pricing Strategist | Comps and offer strategy | Human |
| Agreement to Buy or Sell executed | Transaction Manager | Deal opened, deadlines on calendar, Drive folder created, Commission Tracker updated | None (internal) |
| Signing invitation sent, not completed in 48h | Transaction Manager | Stuck flag on the desk board | None |
| Inspection response executed | Transaction Manager | 72-hour clocks started | None |
| Listing signed | Pricing Strategist → Listing Content | Price strategy, then Coming Soon / Just Listed content and graphics | Compliance, then Human |
| Listing status changes (price, pending, sold) | Listing Content | Milestone post and graphic | Compliance, then Human |
| Deal closes | Commission Tracker → Follow-Up Agent | GCI recorded, 30-day and 90-day check-ins scheduled | Human |
| Hard decision surfaces | The Council | Deliberation and recommendation | Human |

### Scheduled (runs on a clock)

| When | What | Owner |
|------|------|-------|
| Weekday 7:00 AM | Morning brief: today's showings, follow-ups due, deadlines in 72h, stuck signatures | CEO (via `morning` skill) |
| Weekday 7:15 AM | TC sweep: every open deal checked against its deadline list | Transaction Manager |
| Monday 8:00 AM | Opportunity Hunter report: expireds, FSBOs, price drops, signals | Opportunity Hunter |
| Friday 4:00 PM | Weekly review: pipeline movement, forecast, what stalled, next week's three priorities | CEO |
| 1st of month | Lead ROI and market snapshot | Lead ROI, Market Analyst |

### Escalation
- An agent that cannot complete a task writes **BLOCKED + reason** to the system of record and stops. It does not guess.
- Blocked items surface in the next morning brief. Nothing waits more than one business day.
- Deadline within 24 hours with no action taken: Transaction Manager escalates directly to Nick, outside the brief.

---

## 8. KPIs

One number per department. Reviewed every Friday.

| Department | KPI | Target |
|------------|-----|--------|
| CGO / Growth | Speed to lead (minutes from arrival to first draft ready) | Under 60 |
| COO / Operations | Deadlines missed | Zero |
| CMO / Marketing | Hours from listing signed to Coming Soon content ready | Under 24 |
| CFO / Finance | Forecast accuracy (stage-weighted forecast vs actual closed GCI, quarterly) | Within 15% |
| INTEL / Research | Comps delivered before showing or listing appointment | 100% |

---

## 9. Build Order (Claude Code Engineer)

What to build, in the order it pays off.

1. **Wire the Lead Tracker to a Google Sheet.** Leads survive a refresh. The app becomes the front end of the system of record. Unblocks Lead Manager, Follow-Up Agent, Commission Tracker.
2. **Fix the commission math.** Stage-weighted forecast, editable rate per deal, exclude Dead and Closed from the pipeline number.
3. **Follow-up automation.** Follow-up date reached → draft staged in Gmail via the Follow-Up Agent.
4. **Cenla defaults.** Areas, sources, and templates with the real signature block.
5. **Argus v1.** One read-only page: pipeline, deadlines in 72h, forecast, blocked items.
6. **Opportunity Hunter on Grok.** Weekly Cenla signal report into the system of record.
7. **Expense tab and Lead ROI.**

---

## 10. Rules

- Agents draft. Nick sends and signs.
- The system of record is written before anything is reported.
- Nothing client-facing skips the Compliance Gate.
- One agent owns each task. If two could, the table in section 5 says which.
- Blocked means stopped, flagged, and surfaced within one business day. Never guessed.
- Client PII stays in Claude and the Google system of record. Other platforms get summaries.
