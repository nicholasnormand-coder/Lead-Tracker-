# Lead Tracker

A mobile-first lead tracker for Nick's real estate business in Central Louisiana, plus the AI organization that runs around it.

## What is here

| Path | What it is |
|---|---|
| `src/App.jsx` | The Lead Tracker app: leads, follow-ups, email templates, and the Org tab |
| `src/OrgView.jsx` | The Org tab: the chart, pipeline ownership with live counts, escalation rules, cadence |
| `src/org/org-structure.json` | The single source of truth for the organization: owner, executive, platforms, departments, agents, pipeline ownership, handoffs, escalation rules, cadence |
| `src/org/index.js` | Helpers the app uses to look up owners and count leads per agent |
| `agents/` | One generated charter per agent, ready to paste into ChatGPT, Grok, Argus, or Claude Code |
| `scripts/build-charters.js` | Generates `agents/` from the JSON |
| `scripts/check-org.js` | Validates the JSON and confirms `agents/` is in sync |
| `ORG_STRUCTURE.md` | The organization explained: chart, roles, pipeline flow, escalation, cadence, rollout |
| `lead-tracker-site.zip` | The original upload. The unpacked source above supersedes it. |

## Run it

```
npm install
npm start
```

## Build it

```
npm run build
```

## Change the organization

```
# edit src/org/org-structure.json, then:
npm run build:charters
npm test
```
