#!/usr/bin/env node
/**
 * Generates one markdown charter per agent from src/org/org-structure.json.
 *
 * Usage: node scripts/build-charters.js
 *
 * Output: agents/README.md plus agents/<department>/<agent>.md.
 * Each charter is written so it can be pasted straight into the platform
 * that runs that agent (ChatGPT, Grok, Argus, Claude Code) as its
 * standing instructions.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src", "org", "org-structure.json");
const OUT = path.join(ROOT, "agents");

const org = JSON.parse(fs.readFileSync(SRC, "utf8"));

const agentIndex = {};
for (const d of org.departments) for (const a of d.agents) agentIndex[a.id] = { ...a, department: d };
agentIndex[org.executive.id] = org.executive;
agentIndex[org.owner.id] = org.owner;
for (const p of org.pillars) agentIndex[p.id] = p;

const nameOf = id => (agentIndex[id] && agentIndex[id].name) || id;

function list(items) {
  return (items || []).map(i => `- ${i}`).join("\n");
}

function section(title, items) {
  if (!items || items.length === 0) return "";
  return `## ${title}\n\n${list(items)}\n\n`;
}

function charter({ name, platform, mission, duties, inputs, outputs, kpis, ownsStatuses, escalatesTo, id, department }) {
  const reportsTo = department ? `${department.head} (${department.name})` : escalatesTo ? nameOf(escalatesTo) : "";
  const outgoing = org.handoffs.filter(h => h.from === id);
  const incoming = org.handoffs.filter(h => h.to === id);

  let md = `# ${name}\n\n`;
  md += `**Platform:** ${platform || (department ? org.pillars[0].platform : "")}  \n`;
  if (department) md += `**Department:** ${department.name} (${department.head})  \n`;
  if (reportsTo) md += `**Reports to:** ${reportsTo}  \n`;
  if (ownsStatuses && ownsStatuses.length) md += `**Owns pipeline status:** ${ownsStatuses.join(", ")}  \n`;
  md += `\n`;

  md += `## Standing instructions\n\n`;
  md += `You are the **${name}** for ${org.business.name} in ${org.business.market}. `;
  md += `Your mission: ${mission}\n\n`;
  md += `Operating principle for every agent in this organization: ${org.business.principle}\n\n`;

  md += section("Responsibilities", duties);
  md += section("Inputs you work from", inputs);
  md += section("Outputs you produce", outputs);
  md += section("How you are measured", kpis);

  if (incoming.length || outgoing.length) {
    md += `## Handoffs\n\n`;
    for (const h of incoming) md += `- **Receive from ${nameOf(h.from)}** when: ${h.when}\n`;
    for (const h of outgoing) md += `- **Hand to ${nameOf(h.to)}** when: ${h.when}\n`;
    md += `\n`;
  }

  md += `## Escalation\n\n`;
  if (reportsTo) md += `- Escalate to ${reportsTo} when blocked, when a deadline is at risk, or when a decision is outside this charter.\n`;
  md += `- Anything client-facing, contractual, or financial goes to Nick for approval before it is sent or signed.\n`;
  md += `- A deadline at risk goes to Argus Command Center immediately.\n`;
  md += `\n`;

  md += `## Output format\n\n`;
  md += `Lead with the recommendation or the finished draft. Then list what you need from Nick, if anything. Keep status updates to five lines or fewer.\n`;
  return md;
}

function write(rel, content) {
  const p = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  return rel;
}

fs.rmSync(OUT, { recursive: true, force: true });

const written = [];

written.push(write("executive/ceo.md", charter(org.executive)));
for (const p of org.pillars) {
  if (p.id === "grok") continue;
  written.push(write(`platforms/${p.id}.md`, charter(p)));
}
for (const d of org.departments) {
  for (const a of d.agents) written.push(write(`${d.id}/${a.id}.md`, charter({ ...a, platform: org.pillars[0].platform, department: d })));
}

// Index
let idx = `# Agent charters\n\n`;
idx += `Generated from \`src/org/org-structure.json\` by \`scripts/build-charters.js\`. Edit the JSON, then run \`npm run build:charters\`. Do not edit these files by hand.\n\n`;
idx += `${org.business.principle}\n\n`;
idx += `## Reporting lines\n\n`;
idx += "```\n";
idx += `${org.owner.name} (${org.owner.title})\n`;
idx += `└── ${org.executive.name}\n`;
org.pillars.forEach((p, i) => {
  const last = i === org.pillars.length - 1;
  idx += `    ${last ? "└──" : "├──"} ${p.name}\n`;
  if (p.departmentIds) {
    p.departmentIds.forEach((did, j) => {
      const d = org.departments.find(x => x.id === did);
      const dlast = j === p.departmentIds.length - 1;
      idx += `    ${last ? "   " : "│  "} ${dlast ? "└──" : "├──"} ${d.head} / ${d.name}\n`;
      d.agents.forEach((a, k) => {
        const alast = k === d.agents.length - 1;
        idx += `    ${last ? "   " : "│  "} ${dlast ? "   " : "│  "} ${alast ? "└──" : "├──"} ${a.name}\n`;
      });
    });
  }
});
idx += "```\n\n";

idx += `## Charters\n\n`;
idx += `| Agent | Platform | Department | Owns status | File |\n|---|---|---|---|---|\n`;
idx += `| ${org.executive.name} | ${org.executive.platform} | Executive | | [executive/ceo.md](executive/ceo.md) |\n`;
for (const p of org.pillars) if (p.id !== "grok") idx += `| ${p.name} | ${p.platform} | Platform | | [platforms/${p.id}.md](platforms/${p.id}.md) |\n`;
for (const d of org.departments) for (const a of d.agents) idx += `| ${a.name} | ${org.pillars[0].platform} | ${d.name} | ${(a.ownsStatuses || []).join(", ")} | [${d.id}/${a.id}.md](${d.id}/${a.id}.md) |\n`;

idx += `\n## Pipeline ownership\n\n| Lead status | Owning agent |\n|---|---|\n`;
for (const [s, a] of Object.entries(org.pipelineOwnership)) idx += `| ${s} | ${nameOf(a)} |\n`;

written.push(write("README.md", idx));

console.log(`Wrote ${written.length} files to agents/`);
