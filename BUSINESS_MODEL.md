# Cenla Realtor OS: Business Model v2

Nicholas Normand, REALTOR®
The Walker Group at Keller Williams Realty Cenla Partners

An AI-run real estate business. One human owner sets direction and makes every client-facing and contractual decision. ChatGPT runs the company as CEO. Grok Bot is the workforce. Claude Code builds the tools. Argus shows the state of everything. A single system of record keeps them all honest.

Section 1 is the original chart. Section 2 is what was missing from it. Sections 3 onward are the orchestrated model.

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

## 2. Debug: What Was Missing in v1

The structure is right. What was missing is the plumbing. Eight gaps, each with the fix applied in v2.

| # | Gap | Why it matters | Fix in v2 |
|---|-----|----------------|-----------|
| 1 | **No system of record.** Argus is a dashboard with nothing to read from. ChatGPT, Grok, and Claude Code have no shared memory. | ChatGPT assigns a task, Grok does it, nobody else knows. Every handoff is a copy-paste. | Add a **System of Record** (section 4). Every agent reads from it and writes to it. Argus reads only from it. |
| 2 | **Compliance is buried.** LREC compliance is one agent inside COO. Brand compliance is one agent inside CMO. | Compliance is not a department. It is a gate every outbound item passes through. Buried, it gets skipped. | Pull it out as a **Compliance Gate** (section 6). |
| 3 | **No approval gates defined.** Nick is final authority, but nothing says which actions need him. | Bots either ask about everything or nothing. | Explicit **Human Gate** list (section 6). Everything else runs without him. |
| 4 | **No triggers.** Nothing says what starts work. | A workforce with no inbox does nothing. | **Event triggers and a schedule** (section 7). |
| 5 | **CEO is a single point of failure.** Every task routes through ChatGPT. | If that layer is down or wrong, the business stalls. | ChatGPT owns **planning, review, and exceptions**. Routine event-driven work routes **directly** to the owning Grok agent. ChatGPT is informed, not in the path. |
| 6 | **Overlapping agents.** Lead ROI (CFO) vs Lead Manager (CGO). Five Intel agents covering three jobs. Opportunity Hunter vs Nurture. | Two agents on one job means two answers and no owner. | Merged. 22 agents become **12**, each with one input and one output (section 5). |
| 7 | **No metrics.** A CFO with no number anyone is accountable for. | You cannot debug a business you cannot measure. | **One KPI per department** (section 8). |
| 8 | **No engineering backlog.** Claude Code is in the chart with nothing assigned. | The tools the workforce runs on never get built. | **Build order** (section 9). |

---

## 3. The Orchestrated Chart (v2)

```
                          NICK NORMAND
                      Owner / Final Authority
                    (signs, sends, decides)
                               │
                 ┌─────────────┴─────────────┐
                 │        HUMAN GATE         │
                 │  Offers · Prices · Contracts │
                 │  Outbound messages · Spend │
                 └─────────────┬─────────────┘
                               │
                    ┌──────────▼──────────┐
                    │      CHATGPT        │
                    │  CEO / Chief of     │
                    │  Staff / Control    │
                    │  Plans · Reviews ·  │
                    │  Handles exceptions │
                    └──────────┬──────────┘
                               │
  ┌────────────────────────────┼────────────────────────────┐
  │                            │                            │
  ▼                            ▼                            ▼
┌────────────────┐   ┌──────────────────────┐   ┌────────────────────┐
│  SYSTEM OF     │◄──│  GROK BOT WORKFORCE  │──►│  ARGUS DASHBOARD   │
│  RECORD        │   │                      │   │  (reads SoR only)  │
│                │   │  COO   Operations    │   └────────────────────┘
│  Leads · Deals │   │  CGO   Growth        │
│  Docs · Money  │   │  CMO   Marketing     │   ┌────────────────────┐
│  Calendar      │   │  CFO   Finance       │   │  CLAUDE CODE       │
└────────────────┘   │  INTEL Research      │   │  ENGINEER          │
                     └──────────┬───────────┘   │  Builds SoR, Argus,│
                                │               │  Lead Tracker      │
                     ┌──────────▼───────────┐   └────────────────────┘
                     │   COMPLIANCE GATE    │
                     │  LREC · NAR · Fair   │
                     │  Housing · Brand     │
                     └──────────────────────┘
```

Two structural additions. The **System of Record** is the hub everything reads and writes. The **Compliance Gate** and **Human Gate** sit in the path, not inside a department.

---

## 4. System of Record

One source of truth. Nothing else is authoritative.

| Data | Lives in | Owner agent |
|------|----------|-------------|
| Leads and pipeline | Lead Tracker (this repo) backed by a Google Sheet | Lead Manager |
| Deals under contract, deadlines | Deal board + Google Calendar | Transaction Manager |
| Contracts, disclosures, closing docs | Google Drive, one folder per deal | Transaction Manager |
| Client communication | Gmail (drafts staged, Nick sends) | Follow-Up Agent |
| Commission and expenses | Finance tab of the sheet | Commission Tracker |
| Listing content and graphics | Google Drive, one folder per listing | Listing Content |
| Blocked items and exceptions | Exceptions tab of the sheet | ChatGPT (CEO) |

Rules:
- An agent that changes state writes it to the system of record **before** reporting it.
- Argus reads from the system of record only. It never keeps its own data.
- The Lead Tracker app in this repo is the front end for the Leads sheet. Today it holds data in memory. Wiring it to the sheet is engineering task #1.

---

## 5. Grok Bot Workforce

Flattened from 22 agents to 12. Each has one input and one output. Titles are kept for clarity; every agent reports to the system of record, and ChatGPT reads it.

### COO / Operations
| Agent | Input | Output |
|-------|-------|--------|
| **Transaction Manager** | Executed purchase agreement, signing events, inspection responses | Deal opened, deadlines on calendar, Drive folder, stuck-signature flags, 72-hour response clocks |
| **Showing Coordinator** | Appointment set, list of addresses | Route order, prep notes, calendar event |

*Merged:* Buyer Manager, Listing Manager, and Contract Agent fold into these two. Compliance Agent moves to the gate.

### CGO / Growth
| Agent | Input | Output |
|-------|-------|--------|
| **Lead Manager** | New lead from any source | Lead row created, qualified or not, next follow-up date set |
| **Follow-Up Agent** | Follow-up date reached | Draft message staged in Nick's voice, from the template library |
| **Opportunity Hunter** | Weekly | Expireds, FSBOs, price drops, and social signals in Cenla |

*Merged:* Qualification Agent folds into Lead Manager. Nurture Agent folds into Follow-Up Agent (a 90-day nurture is a follow-up with a longer date).

### CMO / Marketing
| Agent | Input | Output |
|-------|-------|--------|
| **Listing Content** | Listing status change | Captions for Facebook, Instagram, Marketplace, Groups, plus graphics |
| **Client Guides** | New buyer or seller client | Branded buyer or seller guide |

*Merged:* Social Media and Marketplace fold into Listing Content. Brand Compliance moves to the gate.

### CFO / Finance
| Agent | Input | Output |
|-------|-------|--------|
| **Commission Tracker** | Deal status change | Stage-weighted pipeline forecast, closed GCI, rate per deal |
| **Lead ROI** | Monthly | Cost and closed GCI per lead source |

*Merged:* Expense Analyst and Forecasting fold into these two.

### INTEL / Research
| Agent | Input | Output |
|-------|-------|--------|
| **Pricing Strategist** | Address, buyer or seller side | Comps, price tiers, offer or list strategy |
| **Market Analyst** | Monthly, or on request | Cenla market snapshot, rates, competitor activity, investment reads |
| **Advisory Council** | Any hard decision | Multi-angle deliberation and a recommendation |

*Merged:* Market Research, MLS Intelligence, Financing Research, Competitor Research, and Investment Analysis fold into Pricing Strategist and Market Analyst.

---

## 6. Gates

### Human Gate (Nick decides, every time)
1. Any offer, counter, or price recommendation to a client
2. Any contract, amendment, or extension
3. Any email or text to a client, another agent, or a vendor
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
| Follow-up date reached | Follow-Up Agent | Draft staged | Human |
| Lead moves to Appt Set | Showing Coordinator | Calendar event, route, prep notes | Human (send invite) |
| Buyer wants to write an offer | Pricing Strategist | Comps and offer strategy | Human |
| Agreement to Buy or Sell executed | Transaction Manager | Deal opened, deadlines on calendar, Drive folder, Commission Tracker updated | None (internal) |
| Signing invitation not completed in 48h | Transaction Manager | Stuck flag on the deal board | None |
| Inspection response executed | Transaction Manager | 72-hour clocks started | None |
| Listing signed | Pricing Strategist → Listing Content | List strategy, then Coming Soon and Just Listed content | Compliance, then Human |
| Listing status changes (price, pending, sold) | Listing Content | Milestone post and graphic | Compliance, then Human |
| Deal closes | Commission Tracker → Follow-Up Agent | GCI recorded, 30-day and 90-day check-ins scheduled | Human |
| Hard decision surfaces | Advisory Council | Deliberation and recommendation | Human |

### Scheduled (runs on a clock)

| When | What | Owner |
|------|------|-------|
| Weekday 7:00 AM | Morning brief: today's showings, follow-ups due, deadlines in 72h, stuck signatures, blocked items | ChatGPT (CEO) |
| Weekday 7:15 AM | TC sweep: every open deal checked against its deadline list | Transaction Manager |
| Monday 8:00 AM | Opportunity report: expireds, FSBOs, price drops, signals | Opportunity Hunter |
| Friday 4:00 PM | Weekly review: pipeline movement, forecast, what stalled, next week's three priorities | ChatGPT (CEO) |
| 1st of month | Lead ROI and market snapshot | Lead ROI, Market Analyst |

### Escalation
- An agent that cannot complete a task writes **BLOCKED + reason** to the Exceptions tab and stops. It does not guess.
- ChatGPT reviews the Exceptions tab every morning. Nothing waits more than one business day.
- Deadline within 24 hours with no action taken: Transaction Manager escalates straight to Nick, outside the brief.

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
3. **Exceptions tab and deal board** in the same sheet, so Transaction Manager and ChatGPT have somewhere to write.
4. **Cenla defaults.** Real areas, sources, and templates with Nick's signature block.
5. **Argus v1.** One read-only page: pipeline, deadlines in 72h, forecast, blocked items.
6. **Expense tab** for Lead ROI.

---

## 10. Rules

- Agents draft. Nick sends and signs.
- The system of record is written before anything is reported.
- Nothing client-facing skips the Compliance Gate.
- One agent owns each task. If two could, the table in section 5 says which.
- Blocked means stopped, flagged, and surfaced within one business day. Never guessed.
- Client PII stays in the system of record. Agents get what the task needs, not the whole record.
