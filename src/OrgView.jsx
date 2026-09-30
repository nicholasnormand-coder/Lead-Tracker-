import { useState } from "react";
import { ORG, AGENT_BY_ID, agentName, leadCountsByAgent } from "./org";

const muted = "rgba(255,255,255,0.4)";
const faint = "rgba(255,255,255,0.28)";

function Label({ children }) {
  return <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>{children}</div>;
}

function Bullets({ items, color }) {
  return (
    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
      {items.map((t, i) => (
        <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.45, fontWeight: 500 }}>
          <span style={{ color, flexShrink: 0 }}>•</span><span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Connector() {
  return <div style={{ width: 2, height: 18, background: "rgba(255,255,255,0.12)", margin: "0 auto" }} />;
}

function NodeCard({ node, color, subtitle, badge, children, delay = "0s" }) {
  return (
    <div className="glass" style={{ borderRadius: 20, padding: "14px 16px", border: `1.5px solid ${color}33`, animation: "fadeUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both", animationDelay: delay }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 13, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, flexShrink: 0 }}>{node.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{node.name}</div>
          {subtitle && <div style={{ fontSize: 12, color: muted, fontWeight: 600, marginTop: 1 }}>{subtitle}</div>}
        </div>
        {badge}
      </div>
      {children}
    </div>
  );
}

function AgentCard({ agent, color, count, open, onToggle }) {
  const outgoing = ORG.handoffs.filter(h => h.from === agent.id);
  const incoming = ORG.handoffs.filter(h => h.to === agent.id);
  return (
    <div className="glass" onClick={onToggle} style={{ borderRadius: 16, padding: "12px 14px", cursor: "pointer", transition: "background 0.18s", background: open ? "rgba(255,255,255,0.08)" : undefined }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: color, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{agent.name}</div>
          <div style={{ fontSize: 12, color: muted, fontWeight: 500, marginTop: 2, lineHeight: 1.4 }}>{agent.mission}</div>
        </div>
        {agent.ownsStatuses && (
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color }}>{count || 0}</div>
            <div style={{ fontSize: 9, color: faint, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>{agent.ownsStatuses[0]}</div>
          </div>
        )}
        <span style={{ color: faint, fontSize: 12, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
      </div>
      {open && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: 12, animation: "fadeIn 0.2s ease" }} onClick={e => e.stopPropagation()}>
          <div><Label>Responsibilities</Label><Bullets items={agent.duties} color={color} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><Label>Inputs</Label><Bullets items={agent.inputs} color={color} /></div>
            <div><Label>Outputs</Label><Bullets items={agent.outputs} color={color} /></div>
          </div>
          <div><Label>Measured by</Label><Bullets items={agent.kpis} color={color} /></div>
          {(incoming.length > 0 || outgoing.length > 0) && (
            <div>
              <Label>Handoffs</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {incoming.map((h, i) => <div key={"in" + i} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}><b style={{ color: "#fff" }}>From {agentName(h.from)}</b> · {h.when}</div>)}
                {outgoing.map((h, i) => <div key={"out" + i} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}><b style={{ color: "#fff" }}>To {agentName(h.to)}</b> · {h.when}</div>)}
              </div>
            </div>
          )}
          <div style={{ fontSize: 12, color: faint, fontWeight: 600 }}>Escalates to {agent.escalatesTo}</div>
        </div>
      )}
    </div>
  );
}

function Department({ dept, counts, delay }) {
  const [open, setOpen] = useState(false);
  const [openAgent, setOpenAgent] = useState(null);
  const deptCount = dept.agents.reduce((s, a) => s + (counts[a.id] || 0), 0);
  return (
    <NodeCard node={dept} color={dept.color} subtitle={`${dept.head} · ${dept.agents.length} agents`} delay={delay}
      badge={
        <button className="ios-btn" onClick={() => setOpen(o => !o)} style={{ background: `${dept.color}22`, color: dept.color, borderRadius: 12, padding: "7px 12px", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
          {deptCount > 0 && <span>{deptCount} {deptCount === 1 ? "lead" : "leads"}</span>}
          <span style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
        </button>
      }>
      <div style={{ fontSize: 13, color: muted, marginTop: 10, lineHeight: 1.5, fontWeight: 500 }}>{dept.mission}</div>
      {open && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8, animation: "fadeIn 0.2s ease" }}>
          {dept.agents.map(a => (
            <AgentCard key={a.id} agent={a} color={dept.color} count={counts[a.id]} open={openAgent === a.id} onToggle={() => setOpenAgent(openAgent === a.id ? null : a.id)} />
          ))}
        </div>
      )}
    </NodeCard>
  );
}

function Pillar({ pillar, delay }) {
  const [open, setOpen] = useState(false);
  const hasDetail = pillar.duties && pillar.duties.length > 0;
  return (
    <NodeCard node={pillar} color={pillar.color} subtitle={pillar.platform} delay={delay}
      badge={hasDetail && (
        <button className="ios-btn" onClick={() => setOpen(o => !o)} style={{ background: `${pillar.color}22`, color: pillar.color, borderRadius: 12, padding: "7px 12px", fontSize: 12, fontWeight: 800 }}>
          <span style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
        </button>
      )}>
      <div style={{ fontSize: 13, color: muted, marginTop: 10, lineHeight: 1.5, fontWeight: 500 }}>{pillar.mission}</div>
      {open && hasDetail && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: 12, animation: "fadeIn 0.2s ease" }}>
          <div><Label>Responsibilities</Label><Bullets items={pillar.duties} color={pillar.color} /></div>
          <div><Label>Measured by</Label><Bullets items={pillar.kpis} color={pillar.color} /></div>
        </div>
      )}
    </NodeCard>
  );
}

export default function OrgView({ leads, statusMeta }) {
  const counts = leadCountsByAgent(leads);
  const grok = ORG.pillars.find(p => p.id === "grok");
  const otherPillars = ORG.pillars.filter(p => p.id !== "grok");
  const [showExec, setShowExec] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Principle */}
      <div style={{ background: "rgba(255,214,10,0.08)", border: "1.5px solid rgba(255,214,10,0.2)", borderRadius: 18, padding: "13px 16px", display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 18, animation: "fadeUp 0.3s ease" }}>
        <span style={{ fontSize: 20 }}>🧭</span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, fontWeight: 500 }}>{ORG.business.principle}</span>
      </div>

      {/* Owner */}
      <NodeCard node={ORG.owner} color={ORG.owner.color} subtitle={ORG.owner.title} delay="0.04s">
        <div style={{ fontSize: 13, color: muted, marginTop: 10, lineHeight: 1.5, fontWeight: 500 }}>{ORG.owner.mission}</div>
      </NodeCard>
      <Connector />

      {/* Executive */}
      <NodeCard node={ORG.executive} color={ORG.executive.color} subtitle={ORG.executive.platform} delay="0.08s"
        badge={
          <button className="ios-btn" onClick={() => setShowExec(o => !o)} style={{ background: `${ORG.executive.color}22`, color: ORG.executive.color, borderRadius: 12, padding: "7px 12px", fontSize: 12, fontWeight: 800 }}>
            <span style={{ transform: showExec ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
          </button>
        }>
        <div style={{ fontSize: 13, color: muted, marginTop: 10, lineHeight: 1.5, fontWeight: 500 }}>{ORG.executive.mission}</div>
        {showExec && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: 12, animation: "fadeIn 0.2s ease" }}>
            <div><Label>Responsibilities</Label><Bullets items={ORG.executive.duties} color={ORG.executive.color} /></div>
            <div><Label>Outputs</Label><Bullets items={ORG.executive.outputs} color={ORG.executive.color} /></div>
            <div><Label>Measured by</Label><Bullets items={ORG.executive.kpis} color={ORG.executive.color} /></div>
          </div>
        )}
      </NodeCard>
      <Connector />

      {/* Three pillars */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
        <NodeCard node={grok} color={grok.color} subtitle={`${grok.platform} · ${ORG.departments.length} departments`} delay="0.12s">
          <div style={{ fontSize: 13, color: muted, marginTop: 10, lineHeight: 1.5, fontWeight: 500 }}>{grok.mission}</div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {ORG.departments.map((d, i) => <Department key={d.id} dept={d} counts={counts} delay={`${0.16 + i * 0.04}s`} />)}
          </div>
        </NodeCard>
        {otherPillars.map((p, i) => <Pillar key={p.id} pillar={p} delay={`${0.36 + i * 0.04}s`} />)}
      </div>

      {/* Pipeline ownership */}
      <div style={{ marginTop: 22 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", letterSpacing: -0.4, marginBottom: 4 }}>Who owns each stage</div>
        <div style={{ fontSize: 12, color: faint, fontWeight: 600, marginBottom: 12 }}>Live counts from your pipeline</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {Object.entries(ORG.pipelineOwnership).map(([status, agentId]) => {
            const m = statusMeta[status];
            const a = AGENT_BY_ID[agentId];
            const n = leads.filter(l => l.status === status).length;
            return (
              <div key={status} className="glass" style={{ borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ background: m.bg, color: m.color, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, display: "inline-flex", gap: 5, alignItems: "center", flexShrink: 0 }}>{m.emoji} {status}</span>
                <span style={{ color: faint, fontSize: 12 }}>→</span>
                <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>🤖 {a.name}</span>
                  <span style={{ fontSize: 11, color: faint, fontWeight: 600 }}>{a.department.name}</span>
                </span>
                <span style={{ fontSize: 15, fontWeight: 900, color: n ? m.color : faint }}>{n}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Escalation rules */}
      <div style={{ marginTop: 22 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", letterSpacing: -0.4, marginBottom: 12 }}>Escalation rules</div>
        <div className="glass" style={{ borderRadius: 18, padding: "14px 16px" }}>
          <Bullets items={ORG.escalationRules} color="#FF9500" />
        </div>
      </div>

      {/* Cadence */}
      <div style={{ marginTop: 22 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", letterSpacing: -0.4, marginBottom: 12 }}>Operating cadence</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ORG.cadence.map(c => (
            <div key={c.name} className="glass" style={{ borderRadius: 16, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{c.name}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#30B0C7", textTransform: "uppercase", letterSpacing: 0.4, flexShrink: 0 }}>{c.when}</span>
              </div>
              <div style={{ fontSize: 12, color: muted, marginTop: 4, lineHeight: 1.5, fontWeight: 500 }}>{c.contains}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 22, fontSize: 12, color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>
        Edit src/org/org-structure.json to change the chart · Charters in /agents
      </div>
    </div>
  );
}
