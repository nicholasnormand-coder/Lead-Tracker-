# Cenla Realtor OS: Business Model

Nicholas Normand, REALTOR®
The Walker Group at Keller Williams Realty Cenla Partners

An AI-run real estate business. Nick owns the license, the relationships, and every final decision. ChatGPT runs the company as CEO and Chief of Staff. Grok Bot is the workforce. Argus is the dashboard. Claude Code is the engineer.

---

## The Model

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

### Grok Bot Workforce

```
GROK BOT WORKFORCE
  │
  ├── COO / OPERATIONS
  │      ├── Transaction Manager
  │      ├── Buyer Manager
  │      ├── Listing Manager
  │      ├── Contract Agent
  │      └── Compliance Agent
  │
  ├── CGO / GROWTH
  │      ├── Lead Manager
  │      ├── Qualification Agent
  │      ├── Follow-Up Agent
  │      ├── Nurture Agent
  │      └── Opportunity Hunter
  │
  ├── CMO / MARKETING
  │      ├── Listing Content
  │      ├── Social Media
  │      ├── Marketplace
  │      └── Brand Compliance
  │
  ├── CFO / BI
  │      ├── Commission Tracker
  │      ├── Expense Analyst
  │      ├── Lead ROI
  │      └── Forecasting
  │
  └── CENLA INTELLIGENCE
         ├── Market Research
         ├── MLS Intelligence
         ├── Financing Research
         ├── Competitor Research
         └── Investment Analysis
```

### Layers

**Nick Normand (Owner / Final Authority).** The only human. Nothing is signed, sent, or committed without him.

**ChatGPT (CEO / Chief of Staff / Control).** Takes Nick's goals and turns them into assignments. Decides what gets worked on, in what order, and by which department. Reports back what got done, what's stuck, what needs a human.

**Grok Bot Workforce.** Five departments, twenty-three agents. Operations moves deals from contract to close. Growth fills the pipeline. Marketing gets listings seen. BI keeps score. Cenla Intelligence knows the market.

**Argus Dashboard.** One place to see the pipeline, deadlines, money, and every agent's status.

**Claude Code Engineer.** Builds and maintains the tools the rest of the system runs on, starting with this repo.

---

## Audit

The structure is sound. These are the gaps an auditor would flag. None of them change the chart. Each is something to add around it.

| # | Finding | Risk if left alone |
|---|---------|--------------------|
| 1 | **No shared system of record.** ChatGPT, Grok Bot, and Argus have no common place to read and write. Argus has nothing to display. | Every handoff is manual. Status lives in three chat histories. Nothing is auditable. |
| 2 | **Approval boundaries are not written down.** Nick is final authority, but the model does not say which actions require him. | Bots either stall waiting on approval for everything, or act on something they shouldn't. |
| 3 | **Compliance Agent and Brand Compliance are inside departments.** Each checks only its own department's work. | Output from Growth (follow-up texts) and BI (client-facing numbers) is never checked. |
| 4 | **No triggers.** The model does not say what event starts which agent. | Agents only work when prompted by hand. |
| 5 | **No escalation path.** Nothing says what an agent does when it cannot finish. | Silent failures. A missed deadline is found after the fact. |
| 6 | **No metrics.** CFO / BI tracks money but no department has a number it is accountable for. | No way to tell if the system is working. |
| 7 | **Overlaps without a tiebreaker.** Lead ROI (BI) and Lead Manager (Growth) both touch lead sources. Nurture Agent and Follow-Up Agent both send follow-ups. Five Intel agents share sources. | Two agents answer the same question differently. Nobody owns it. |
| 8 | **ChatGPT is on every path.** All work routes through the CEO layer. | One slow or wrong layer stalls everything. |
| 9 | **Client data across platforms.** Names, phones, contract terms would flow through ChatGPT and Grok Bot. | Privacy exposure. Multiple places to leak. |
| 10 | **Claude Code has no backlog.** The engineer is in the chart with nothing assigned. | The tools never get built. |

---

## Enhancements

Additions only. The chart, departments, and agents stay as they are.

### 1. System of Record
One Google Sheet with tabs: **Leads**, **Deals**, **Finance**, **Exceptions**. Google Drive for documents, one folder per deal and per listing. Google Calendar for deadlines.
- Every agent writes its result here before reporting to ChatGPT.
- Argus reads from here and nowhere else.
- The Lead Tracker in this repo becomes the front end of the Leads tab.

### 2. Human Gate
Actions that always require Nick:
1. Any offer, counter, or price recommendation to a client
2. Any contract, amendment, or extension
3. Any message to a client, another agent, or a vendor
4. Any social post or ad
5. Any expense over $100
6. Any new vendor or tool with access to client data

Everything else runs without him.

### 3. Compliance Gate
Compliance Agent (COO) and Brand Compliance (CMO) stay where they are, and additionally act as a shared gate for **all** outbound items from **any** department, in this order: LREC Chapter 25, NAR Article 12, Fair Housing Act §804(c), then brand rules (REALTOR® in caps, signature block, banned phrases, no em dashes). A failing item returns to its agent with the reason.

### 4. Triggers
| Event | Starts | Gate |
|-------|--------|------|
| New lead arrives | Lead Manager → Qualification Agent → Follow-Up Agent (1-hour reply) | Human |
| Follow-up date reached | Follow-Up Agent | Human |
| Lead inactive 30+ days | Nurture Agent | Human |
| Lead moves to Appt Set | Buyer Manager or Listing Manager | Human (invite) |
| Buyer ready to offer | MLS Intelligence → Contract Agent | Human |
| Purchase agreement executed | Transaction Manager, Contract Agent, Commission Tracker | None |
| Signature not completed in 48h | Transaction Manager | None |
| Inspection response executed | Contract Agent (72-hour clocks) | None |
| Listing signed | Market Research → Listing Content → Social Media → Marketplace | Compliance, Human |
| Listing status changes | Listing Content → Social Media | Compliance, Human |
| Deal closes | Commission Tracker, Follow-Up Agent (30 and 90-day check-ins) | Human |
| Weekly (Monday) | Opportunity Hunter, Competitor Research | None |
| Monthly (1st) | Lead ROI, Expense Analyst, Forecasting, Market Research, Financing Research, Investment Analysis | None |

### 5. Daily and Weekly Rhythm
| When | What | Owner |
|------|------|-------|
| Weekday 7:00 AM | Morning brief: showings, follow-ups due, deadlines in 72h, stuck signatures, exceptions | ChatGPT |
| Weekday 7:15 AM | Transaction sweep across every open deal | Transaction Manager |
| Friday 4:00 PM | Weekly review: pipeline movement, forecast, what stalled, next week's three priorities | ChatGPT |

### 6. Escalation
- An agent that cannot finish writes **BLOCKED + reason** to the Exceptions tab and stops. It does not guess.
- ChatGPT clears the Exceptions tab every morning. Nothing waits past one business day.
- Any deadline inside 24 hours with no action goes straight to Nick, outside the brief.

### 7. Tiebreakers for Overlaps
- Lead source **data** is owned by Lead Manager. Lead source **ROI** is owned by Lead ROI. Lead ROI reads, never writes, the Leads tab.
- Follow-Up Agent owns leads under 30 days old. Nurture Agent owns leads over 30 days. Handoff is automatic on day 30.
- Within Cenla Intelligence, MLS Intelligence owns anything with an address. Market Research owns anything without one.

### 8. One KPI per Department
| Department | KPI | Target |
|------------|-----|--------|
| CGO / Growth | Minutes from lead arrival to first draft ready | Under 60 |
| COO / Operations | Deadlines missed | Zero |
| CMO / Marketing | Hours from listing signed to Coming Soon content ready | Under 24 |
| CFO / BI | Forecast vs actual closed GCI, quarterly | Within 15% |
| Cenla Intelligence | Comps delivered before every showing or listing appointment | 100% |

### 9. ChatGPT Off the Routine Path
Triggered work (section 4) routes straight to the owning agent. ChatGPT is notified through the system of record, runs the morning brief and Friday review, and handles exceptions. It assigns non-routine work; it does not relay routine work.

### 10. Client Data Rule
Client PII lives in the system of record. Agents receive only the fields the task needs. ChatGPT receives summaries and status, not client records.

### 11. Claude Code Backlog
1. Wire the Lead Tracker to the Leads tab of the Google Sheet so leads persist.
2. Fix the commission number: stage-weighted forecast, editable rate per deal, exclude Dead and Closed from the pipeline total.
3. Build the Deals, Finance, and Exceptions tabs.
4. Cenla defaults: real areas, sources, and templates with Nick's signature block.
5. Argus v1: one read-only page showing pipeline, deadlines in 72h, forecast, exceptions.
