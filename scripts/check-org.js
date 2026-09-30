#!/usr/bin/env node
/**
 * Validates src/org/org-structure.json and confirms agents/ is in sync with it.
 * Run with: npm test
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const org = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "org", "org-structure.json"), "utf8"));

const errors = [];
const agents = {};
for (const d of org.departments) {
  for (const key of ["id", "name", "head", "emoji", "color", "mission"]) if (!d[key]) errors.push(`department ${d.id || "?"} missing ${key}`);
  for (const a of d.agents) {
    if (agents[a.id]) errors.push(`duplicate agent id ${a.id}`);
    agents[a.id] = a;
    for (const key of ["id", "name", "mission", "duties", "inputs", "outputs", "kpis", "escalatesTo"]) if (!a[key] || (Array.isArray(a[key]) && a[key].length === 0)) errors.push(`agent ${a.id} missing ${key}`);
    if (a.escalatesTo !== d.head) errors.push(`agent ${a.id} escalates to ${a.escalatesTo} but department head is ${d.head}`);
  }
}

// Every department referenced by the Grok pillar exists, and every department is under a pillar.
const grok = org.pillars.find(p => p.id === "grok");
for (const id of grok.departmentIds) if (!org.departments.find(d => d.id === id)) errors.push(`pillar grok references unknown department ${id}`);
for (const d of org.departments) if (!grok.departmentIds.includes(d.id)) errors.push(`department ${d.id} is not under any pillar`);

// Pipeline ownership: every status maps to a real agent, and each agent's ownsStatuses matches.
const appSrc = fs.readFileSync(path.join(ROOT, "src", "App.jsx"), "utf8");
const statusMatch = appSrc.match(/const STATUSES = \[([^\]]+)\]/);
const statuses = statusMatch ? statusMatch[1].match(/"([^"]+)"/g).map(s => s.slice(1, -1)) : [];
if (statuses.length === 0) errors.push("could not read STATUSES from src/App.jsx");
for (const s of statuses) if (!org.pipelineOwnership[s]) errors.push(`status "${s}" has no owning agent in pipelineOwnership`);
for (const [s, id] of Object.entries(org.pipelineOwnership)) {
  if (!statuses.includes(s)) errors.push(`pipelineOwnership has unknown status "${s}"`);
  if (!agents[id]) errors.push(`status "${s}" owned by unknown agent ${id}`);
  else if (!(agents[id].ownsStatuses || []).includes(s)) errors.push(`agent ${id} owns "${s}" in pipelineOwnership but not in its ownsStatuses`);
}
for (const a of Object.values(agents)) for (const s of a.ownsStatuses || []) if (org.pipelineOwnership[s] !== a.id) errors.push(`agent ${a.id} lists "${s}" in ownsStatuses but pipelineOwnership says ${org.pipelineOwnership[s]}`);

// Handoffs reference real agents.
for (const h of org.handoffs) {
  if (!agents[h.from]) errors.push(`handoff from unknown agent ${h.from}`);
  if (!agents[h.to]) errors.push(`handoff to unknown agent ${h.to}`);
  if (!h.when) errors.push(`handoff ${h.from} -> ${h.to} missing "when"`);
}

// Generated charters are in sync.
const before = snapshot(path.join(ROOT, "agents"));
execFileSync(process.execPath, [path.join(ROOT, "scripts", "build-charters.js")], { stdio: "ignore" });
const after = snapshot(path.join(ROOT, "agents"));
if (JSON.stringify(before) !== JSON.stringify(after)) errors.push("agents/ was out of date with src/org/org-structure.json (it has now been regenerated; commit the result)");

function snapshot(dir) {
  const out = {};
  if (!fs.existsSync(dir)) return out;
  const walk = d => {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) walk(p); else out[path.relative(dir, p)] = fs.readFileSync(p, "utf8");
    }
  };
  walk(dir);
  return out;
}

const agentCount = Object.keys(agents).length;
if (errors.length) {
  console.error(`org check failed with ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`org check passed: ${org.departments.length} departments, ${agentCount} agents, ${statuses.length} pipeline statuses, ${org.handoffs.length} handoffs, charters in sync`);
