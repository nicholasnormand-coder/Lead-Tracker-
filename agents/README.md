# Agent charters

Generated from `src/org/org-structure.json` by `scripts/build-charters.js`. Edit the JSON, then run `npm run build:charters`. Do not edit these files by hand.

AI agents draft, research, track, and recommend. Nick decides, signs, and sends. Anything client-facing, contractual, or financial is approved by Nick before it leaves the building.

## Reporting lines

```
Nick (Owner / Broker Agent)
└── ChatGPT CEO + Chief of Staff
    ├── Grok Workforce
    │   ├── COO / Operations
    │   │   ├── Transaction Manager
    │   │   ├── Buyer Manager
    │   │   ├── Listing Manager
    │   │   ├── Contract Agent
    │   │   └── Compliance Agent
    │   ├── CGO / Growth
    │   │   ├── Lead Manager
    │   │   ├── Qualification Agent
    │   │   ├── Follow-Up Agent
    │   │   ├── Nurture Agent
    │   │   └── Opportunity Hunter
    │   ├── CMO / Marketing
    │   │   ├── Listing Content
    │   │   ├── Social Media
    │   │   ├── Marketplace
    │   │   └── Brand Compliance
    │   ├── CFO / Finance and Business Intelligence
    │   │   ├── Commission Tracker
    │   │   ├── Expense Analyst
    │   │   ├── Lead ROI
    │   │   └── Forecasting
    │   └── Director of Intelligence / Cenla Intelligence
    │       ├── Market Research
    │       ├── MLS Intelligence
    │       ├── Financing Research
    │       ├── Competitor Research
    │       └── Investment Analysis
    ├── Argus Command Center
    └── Claude Code Engineering
```

## Charters

| Agent | Platform | Department | Owns status | File |
|---|---|---|---|---|
| ChatGPT CEO + Chief of Staff | ChatGPT | Executive | | [executive/ceo.md](executive/ceo.md) |
| Argus Command Center | Argus | Platform | | [platforms/argus.md](platforms/argus.md) |
| Claude Code Engineering | Claude Code | Platform | | [platforms/claude-code.md](platforms/claude-code.md) |
| Transaction Manager | Grok | Operations | Under Contract | [operations/transaction-manager.md](operations/transaction-manager.md) |
| Buyer Manager | Grok | Operations | Active Buyer | [operations/buyer-manager.md](operations/buyer-manager.md) |
| Listing Manager | Grok | Operations | Active Seller | [operations/listing-manager.md](operations/listing-manager.md) |
| Contract Agent | Grok | Operations |  | [operations/contract-agent.md](operations/contract-agent.md) |
| Compliance Agent | Grok | Operations |  | [operations/compliance-agent.md](operations/compliance-agent.md) |
| Lead Manager | Grok | Growth | New Lead | [growth/lead-manager.md](growth/lead-manager.md) |
| Qualification Agent | Grok | Growth | Contacted | [growth/qualification-agent.md](growth/qualification-agent.md) |
| Follow-Up Agent | Grok | Growth | Appt Set | [growth/follow-up-agent.md](growth/follow-up-agent.md) |
| Nurture Agent | Grok | Growth | Nurturing | [growth/nurture-agent.md](growth/nurture-agent.md) |
| Opportunity Hunter | Grok | Growth | Dead | [growth/opportunity-hunter.md](growth/opportunity-hunter.md) |
| Listing Content | Grok | Marketing |  | [marketing/listing-content.md](marketing/listing-content.md) |
| Social Media | Grok | Marketing |  | [marketing/social-media.md](marketing/social-media.md) |
| Marketplace | Grok | Marketing |  | [marketing/marketplace.md](marketing/marketplace.md) |
| Brand Compliance | Grok | Marketing |  | [marketing/brand-compliance.md](marketing/brand-compliance.md) |
| Commission Tracker | Grok | Finance and Business Intelligence | Closed | [finance/commission-tracker.md](finance/commission-tracker.md) |
| Expense Analyst | Grok | Finance and Business Intelligence |  | [finance/expense-analyst.md](finance/expense-analyst.md) |
| Lead ROI | Grok | Finance and Business Intelligence |  | [finance/lead-roi.md](finance/lead-roi.md) |
| Forecasting | Grok | Finance and Business Intelligence |  | [finance/forecasting.md](finance/forecasting.md) |
| Market Research | Grok | Cenla Intelligence |  | [intelligence/market-research.md](intelligence/market-research.md) |
| MLS Intelligence | Grok | Cenla Intelligence |  | [intelligence/mls-intelligence.md](intelligence/mls-intelligence.md) |
| Financing Research | Grok | Cenla Intelligence |  | [intelligence/financing-research.md](intelligence/financing-research.md) |
| Competitor Research | Grok | Cenla Intelligence |  | [intelligence/competitor-research.md](intelligence/competitor-research.md) |
| Investment Analysis | Grok | Cenla Intelligence |  | [intelligence/investment-analysis.md](intelligence/investment-analysis.md) |

## Pipeline ownership

| Lead status | Owning agent |
|---|---|
| New Lead | Lead Manager |
| Contacted | Qualification Agent |
| Nurturing | Nurture Agent |
| Appt Set | Follow-Up Agent |
| Active Buyer | Buyer Manager |
| Active Seller | Listing Manager |
| Under Contract | Transaction Manager |
| Closed | Commission Tracker |
| Dead | Opportunity Hunter |
