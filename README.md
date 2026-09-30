# Lead Tracker

A single-page real estate lead tracker built with React. Track leads from first contact to closing, see your pipeline at a glance, and copy follow-up email templates.

## Features

- Lead pipeline: New Lead → Contacted → Nurturing → Appt Set → Active Buyer / Active Seller → Under Contract → Closed
- Lead sources, client types, budget, area, and notes on every lead
- Follow-up dates with a "due today" banner and overdue flags
- Dashboard tiles for total, active, closed, and estimated commission
- Five ready-to-copy follow-up email templates

## Run it locally

```bash
npm install
npm start
```

Opens at http://localhost:3000.

## Build for deployment

```bash
npm run build
```

The `build/` folder is a static site you can host on GitHub Pages, Vercel, or Netlify.

## Notes

- Leads are held in memory only. Refreshing the page resets to the sample data.
- Estimated commission uses a fixed 2.5% of each lead's budget.
