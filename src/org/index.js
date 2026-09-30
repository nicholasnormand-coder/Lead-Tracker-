import org from "./org-structure.json";

export const ORG = org;

export const DEPT_BY_ID = Object.fromEntries(org.departments.map(d => [d.id, d]));

export const AGENT_BY_ID = (() => {
  const map = {};
  for (const d of org.departments) for (const a of d.agents) map[a.id] = { ...a, department: d };
  return map;
})();

export const agentName = id => (AGENT_BY_ID[id] && AGENT_BY_ID[id].name) || id;

/** Returns the agent (with its department attached) that owns a given lead status, or null. */
export function ownerForStatus(status) {
  const id = org.pipelineOwnership[status];
  return id ? AGENT_BY_ID[id] : null;
}

/** Counts leads per owning agent id. */
export function leadCountsByAgent(leads) {
  const counts = {};
  for (const l of leads) {
    const id = org.pipelineOwnership[l.status];
    if (id) counts[id] = (counts[id] || 0) + 1;
  }
  return counts;
}
