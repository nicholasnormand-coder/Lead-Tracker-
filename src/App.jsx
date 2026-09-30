import { useState, useRef, useEffect } from "react";

const SOURCES = ["Zillow", "Realtor.com", "Facebook", "Instagram", "Referral", "Open House", "Cold Call", "Website", "Other"];
const TYPES = ["Buyer", "Seller", "Both", "Investor", "Renter"];
const STATUSES = ["New Lead", "Contacted", "Nurturing", "Appt Set", "Active Buyer", "Active Seller", "Under Contract", "Closed", "Dead"];

const STATUS_META = {
  "New Lead":       { color: "#007AFF", bg: "rgba(0,122,255,0.15)",   emoji: "🔵" },
  "Contacted":      { color: "#5856D6", bg: "rgba(88,86,214,0.15)",   emoji: "💬" },
  "Nurturing":      { color: "#FF9500", bg: "rgba(255,149,0,0.15)",   emoji: "🌱" },
  "Appt Set":       { color: "#FF6B00", bg: "rgba(255,107,0,0.15)",   emoji: "📅" },
  "Active Buyer":   { color: "#34C759", bg: "rgba(52,199,89,0.15)",   emoji: "🏃" },
  "Active Seller":  { color: "#30B0C7", bg: "rgba(48,176,199,0.15)",  emoji: "🏠" },
  "Under Contract": { color: "#AF52DE", bg: "rgba(175,82,222,0.15)",  emoji: "📝" },
  "Closed":         { color: "#34C759", bg: "rgba(52,199,89,0.2)",    emoji: "✅" },
  "Dead":           { color: "#8E8E93", bg: "rgba(142,142,147,0.15)", emoji: "💀" },
};

const sampleLeads = [
  { id: 1, dateAdded: "2026-03-01", firstName: "Maria", lastName: "Johnson", phone: "555-123-4567", email: "maria@email.com", source: "Zillow", type: "Buyer", status: "Contacted", budget: "450000", area: "Downtown", beds: "3", notes: "Pre-approved, wants move-in ready. Very motivated buyer.", lastContact: "2026-03-01", nextFollowUp: "2026-03-05", closedDate: "" },
  { id: 2, dateAdded: "2026-02-28", firstName: "DeShawn", lastName: "Williams", phone: "555-987-6543", email: "deshawn@email.com", source: "Referral", type: "Seller", status: "Appt Set", budget: "320000", area: "Midtown", beds: "4", notes: "Relocating in 60 days. Needs quick close.", lastContact: "2026-02-28", nextFollowUp: "2026-03-03", closedDate: "" },
  { id: 3, dateAdded: "2026-02-20", firstName: "Priya", lastName: "Patel", phone: "555-222-3333", email: "priya@email.com", source: "Instagram", type: "Buyer", status: "Nurturing", budget: "275000", area: "Suburbs", beds: "2", notes: "First-time buyer, needs lots of guidance on the process.", lastContact: "2026-02-25", nextFollowUp: "2026-03-07", closedDate: "" },
  { id: 4, dateAdded: "2026-02-15", firstName: "Carlos", lastName: "Reyes", phone: "555-444-5555", email: "carlos@email.com", source: "Open House", type: "Both", status: "Active Buyer", budget: "600000", area: "Westside", beds: "4", notes: "Has a home to sell first. Flexible on timing.", lastContact: "2026-03-01", nextFollowUp: "2026-03-06", closedDate: "" },
  { id: 5, dateAdded: "2026-01-10", firstName: "Amanda", lastName: "Chen", phone: "555-777-8888", email: "amanda@email.com", source: "Referral", type: "Buyer", status: "Closed", budget: "520000", area: "Eastside", beds: "3", notes: "Smooth transaction. Great client! Will refer friends.", lastContact: "2026-02-28", nextFollowUp: "", closedDate: "2026-02-28" },
];

const emailTemplates = [
  { tag: "1 HR", label: "New Lead", color: "#007AFF", subject: "You reached out — let's find your perfect home!", body: `Hi [First Name],\n\nThank you for reaching out! I'd love to learn more about what you're looking for. Whether you're ready to move now or just exploring, I'm here to help every step of the way.\n\nCould we schedule a quick 10-minute call this week?\n\nLooking forward to connecting!\n[Your Name] | [Phone]` },
  { tag: "3 DAYS", label: "Follow-Up #2", color: "#5856D6", subject: "Still thinking about buying/selling?", body: `Hi [First Name],\n\nJust checking in — I know life gets busy! I wanted to make sure my last message didn't get lost.\n\nI've been keeping an eye on listings in [Area] and there are some great options right now.\n\nNo pressure at all — just here when you're ready!\n[Your Name] | [Phone]` },
  { tag: "OPEN HOUSE", label: "Post-Visit", color: "#FF9500", subject: "Great meeting you at [Address]!", body: `Hi [First Name],\n\nIt was wonderful meeting you at the open house! I hope you enjoyed seeing the home.\n\nDid it check the boxes you were hoping for? I have access to several similar listings that might be a great fit.\n\n[Your Name] | [Phone]` },
  { tag: "CONTRACT", label: "Congrats 🎉", color: "#34C759", subject: "You're officially under contract!", body: `Hi [First Name],\n\nThis is such an exciting milestone — congratulations!\n\nHere's what happens next:\n✅ Inspection period: [dates]\n✅ Appraisal: [date]\n✅ Final walkthrough: [date]\n✅ Closing: [date]\n\nI'll be with you every step of the way!\n[Your Name]` },
  { tag: "90 DAYS", label: "Re-Engage", color: "#AF52DE", subject: "Still thinking about a move?", body: `Hi [First Name],\n\nI wanted to reach back out — the market has shifted and it may actually work in your favor right now.\n\nWould you be open to a quick conversation?\n\n[Your Name] | [Phone]` },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
  @keyframes popSheet { from { opacity:0; transform:translateY(60px) scale(0.97) } to { opacity:1; transform:translateY(0) scale(1) } }
  @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
  @keyframes scaleIn  { from { opacity:0; transform:scale(0.9) } to { opacity:1; transform:scale(1) } }

  html, body { background:#000; height:100%; overscroll-behavior:none; }

  .app-bg {
    min-height:100vh;
    background: radial-gradient(ellipse 80% 60% at 30% 10%, #0D1F3C 0%, #000 70%);
    font-family: 'Nunito', -apple-system, sans-serif;
    color: #fff;
  }

  .glass {
    background: rgba(255,255,255,0.055);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.09);
  }

  .lead-card {
    border-radius: 22px;
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease, background 0.18s ease;
    cursor: pointer;
    animation: fadeUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
    overflow: hidden;
  }
  .lead-card:hover  { transform: translateY(-3px) scale(1.005); box-shadow: 0 20px 56px rgba(0,0,0,0.45); }
  .lead-card:active { transform: scale(0.975); }

  .kpi-tile {
    border-radius: 20px;
    padding: 16px 14px;
    text-align: center;
    animation: fadeUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
    transition: transform 0.2s ease;
  }
  .kpi-tile:hover { transform: translateY(-2px); }

  .ios-btn {
    border: none;
    cursor: pointer;
    font-family: 'Nunito', -apple-system, sans-serif;
    transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), opacity 0.15s ease;
  }
  .ios-btn:active { transform: scale(0.91) !important; opacity: 0.75; }

  .pill-tab {
    border: none;
    cursor: pointer;
    font-family: 'Nunito', -apple-system, sans-serif;
    transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
  }
  .pill-tab:active { transform: scale(0.92); }

  .search-input {
    background: rgba(255,255,255,0.07);
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    color: #fff;
    font-family: 'Nunito', -apple-system, sans-serif;
    font-size: 15px;
    font-weight: 500;
    outline: none;
    transition: all 0.2s ease;
    width: 100%;
    padding: 12px 16px 12px 44px;
  }
  .search-input:focus { background: rgba(255,255,255,0.11); border-color: rgba(0,122,255,0.55); box-shadow: 0 0 0 4px rgba(0,122,255,0.12); }
  .search-input::placeholder { color: rgba(255,255,255,0.28); }

  .modal-bg {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(0,0,0,0.65);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    display: flex; align-items: flex-end; justify-content: center;
    animation: fadeIn 0.18s ease;
  }
  .modal-sheet {
    width: 100%; max-width: 680px;
    background: #1C1C1E;
    border-radius: 30px 30px 0 0;
    border: 1px solid rgba(255,255,255,0.10);
    border-bottom: none;
    max-height: 92vh;
    overflow-y: auto;
    animation: popSheet 0.35s cubic-bezier(0.34,1.56,0.64,1);
  }

  .field-box {
    background: rgba(255,255,255,0.06);
    border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 10px 14px;
    transition: border-color 0.2s, background 0.2s;
  }
  .field-box:focus-within { border-color: rgba(0,122,255,0.5); background: rgba(0,122,255,0.07); }

  .inline-input {
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-family: 'Nunito', -apple-system, sans-serif;
    font-size: 15px;
    font-weight: 500;
    width: 100%;
    resize: none;
  }
  .inline-input::placeholder { color: rgba(255,255,255,0.28); }

  .status-pill {
    border: none;
    cursor: pointer;
    font-family: 'Nunito', -apple-system, sans-serif;
    font-weight: 700;
    font-size: 12px;
    border-radius: 20px;
    padding: 4px 12px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), filter 0.15s ease;
  }
  .status-pill:hover  { filter: brightness(1.15); }
  .status-pill:active { transform: scale(0.9); }

  .del-btn {
    background: rgba(255,59,48,0.13);
    color: #FF3B30;
    border: 1.5px solid rgba(255,59,48,0.22);
    border-radius: 14px;
    padding: 12px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    width: 100%;
    font-family: 'Nunito', sans-serif;
    transition: background 0.18s, transform 0.15s;
  }
  .del-btn:hover  { background: rgba(255,59,48,0.22); }
  .del-btn:active { transform: scale(0.96); }

  .tmpl-card {
    border-radius: 22px;
    overflow: hidden;
    animation: fadeUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
    transition: transform 0.2s ease;
  }
  .tmpl-card:hover { transform: translateY(-2px); }

  .copy-btn {
    border: none;
    cursor: pointer;
    font-family: 'Nunito', sans-serif;
    font-weight: 800;
    font-size: 13px;
    border-radius: 11px;
    padding: 8px 16px;
    transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }
  .copy-btn:active { transform: scale(0.88); }

  ::-webkit-scrollbar { width: 0; height: 0; }
  select option { background: #2C2C2E; color: #fff; }
`;

function Avatar({ firstName, lastName, size = 44 }) {
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?";
  const palette = ["#007AFF","#34C759","#FF9500","#AF52DE","#FF3B30","#5856D6","#30B0C7","#FF6B00"];
  const color = palette[(firstName?.charCodeAt(0) || 65) % palette.length];
  return (
    <div style={{ width: size, height: size, borderRadius: size / 2, background: `${color}20`, border: `2px solid ${color}50`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: size * 0.35, fontWeight: 800, color }}>{initials}</span>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="field-box">
      <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}

function InlineEdit({ value, onChange, type = "text", placeholder = "", multiline = false }) {
  if (multiline) return <textarea className="inline-input" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ lineHeight: 1.55 }} />;
  if (type === "select-source") return (
    <select value={value} onChange={e => onChange(e.target.value)} className="inline-input" style={{ cursor: "pointer" }}>
      <option value="">Select…</option>
      {SOURCES.map(s => <option key={s}>{s}</option>)}
    </select>
  );
  if (type === "select-type") return (
    <select value={value} onChange={e => onChange(e.target.value)} className="inline-input" style={{ cursor: "pointer" }}>
      {TYPES.map(s => <option key={s}>{s}</option>)}
    </select>
  );
  return <input className="inline-input" type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />;
}

function StatusDropdown({ status, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const m = STATUS_META[status] || STATUS_META["New Lead"];
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="ios-btn" onClick={() => setOpen(o => !o)} style={{ background: m.bg, color: m.color, borderRadius: 14, padding: "11px 16px", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
        <span>{m.emoji}</span> {status} <span style={{ marginLeft: "auto", opacity: 0.55, fontSize: 12 }}>▾</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 50, background: "#2C2C2E", borderRadius: 18, border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)", animation: "scaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}>
          {STATUSES.map((s, i) => {
            const sm = STATUS_META[s];
            return (
              <div key={s} onClick={() => { onChange(s); setOpen(false); }}
                style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", borderBottom: i < STATUSES.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", transition: "background 0.13s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span style={{ fontSize: 16 }}>{sm.emoji}</span>
                <span style={{ color: sm.color, fontWeight: 700, fontSize: 15 }}>{s}</span>
                {status === s && <span style={{ marginLeft: "auto", color: sm.color, fontSize: 16 }}>✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LeadModal({ lead, onClose, onSave, onDelete }) {
  const [draft, setDraft] = useState({ ...lead });
  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const commission = draft.budget ? Math.round(Number(draft.budget) * 0.025) : 0;

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && (onSave(draft), onClose())}>
      <div className="modal-sheet">
        <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 0" }}>
          <div style={{ width: 40, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.18)" }} />
        </div>
        <div style={{ padding: "18px 22px 36px" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar firstName={draft.firstName} lastName={draft.lastName} size={54} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{draft.firstName || "New"} {draft.lastName || "Lead"}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{draft.type} · {draft.source || "No source"}</div>
              </div>
            </div>
            <button className="ios-btn" onClick={() => { onSave(draft); onClose(); }} style={{ background: "rgba(255,255,255,0.09)", borderRadius: 20, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.55)", fontSize: 15 }}>✕</button>
          </div>

          {/* Status */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Status</div>
            <StatusDropdown status={draft.status} onChange={v => set("status", v)} />
          </div>

          {/* Fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <Field label="First Name"><InlineEdit value={draft.firstName} onChange={v => set("firstName", v)} placeholder="First name" /></Field>
            <Field label="Last Name"><InlineEdit value={draft.lastName} onChange={v => set("lastName", v)} placeholder="Last name" /></Field>
            <Field label="Phone"><InlineEdit value={draft.phone} onChange={v => set("phone", v)} placeholder="555-000-0000" /></Field>
            <Field label="Email"><InlineEdit value={draft.email} onChange={v => set("email", v)} placeholder="email@example.com" /></Field>
            <Field label="Budget"><InlineEdit value={draft.budget} type="number" onChange={v => set("budget", v)} placeholder="0" /></Field>
            <Field label="Area"><InlineEdit value={draft.area} onChange={v => set("area", v)} placeholder="Neighborhood" /></Field>
            <Field label="Bedrooms"><InlineEdit value={draft.beds} onChange={v => set("beds", v)} placeholder="e.g. 3" /></Field>
            <Field label="Type"><InlineEdit value={draft.type} type="select-type" onChange={v => set("type", v)} /></Field>
            <Field label="Source"><InlineEdit value={draft.source} type="select-source" onChange={v => set("source", v)} /></Field>
            <Field label="Date Added"><InlineEdit value={draft.dateAdded} type="date" onChange={v => set("dateAdded", v)} /></Field>
            <Field label="Last Contact"><InlineEdit value={draft.lastContact} type="date" onChange={v => set("lastContact", v)} /></Field>
            <Field label="Next Follow-Up"><InlineEdit value={draft.nextFollowUp} type="date" onChange={v => set("nextFollowUp", v)} /></Field>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Field label="Notes"><InlineEdit value={draft.notes} onChange={v => set("notes", v)} placeholder="Add notes about this lead…" multiline /></Field>
          </div>

          {commission > 0 && (
            <div style={{ background: "rgba(52,199,89,0.1)", border: "1.5px solid rgba(52,199,89,0.22)", borderRadius: 16, padding: "13px 18px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Est. Commission (2.5%)</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#34C759", marginTop: 2 }}>${commission.toLocaleString()}</div>
              </div>
              <span style={{ fontSize: 28 }}>💰</span>
            </div>
          )}

          <button className="ios-btn" onClick={() => { onSave(draft); onClose(); }} style={{ background: "#007AFF", color: "#fff", borderRadius: 16, padding: "14px", fontSize: 16, fontWeight: 800, width: "100%", marginBottom: 10 }}>
            Save Changes
          </button>
          <button className="del-btn" onClick={() => { onDelete(draft.id); onClose(); }}>🗑  Delete Lead</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [leads, setLeads] = useState(sampleLeads);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeTab, setActiveTab] = useState("leads");
  const [selectedLead, setSelectedLead] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const saveLead = updated => setLeads(ls => ls.map(l => l.id === updated.id ? updated : l));
  const deleteLead = id => setLeads(ls => ls.filter(l => l.id !== id));
  const addLead = () => {
    const l = { id: Date.now(), dateAdded: new Date().toISOString().split("T")[0], firstName: "", lastName: "", phone: "", email: "", source: "", type: "Buyer", status: "New Lead", budget: "", area: "", beds: "", notes: "", lastContact: "", nextFollowUp: "", closedDate: "" };
    setLeads(ls => [l, ...ls]);
    setSelectedLead(l);
  };

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    return (!q || [l.firstName, l.lastName, l.email, l.phone, l.area, l.notes].some(v => v?.toLowerCase().includes(q)))
        && (filterStatus === "All" || l.status === filterStatus);
  });

  const today = new Date().toISOString().split("T")[0];
  const stats = {
    total: leads.length,
    active: leads.filter(l => ["Active Buyer","Active Seller","Under Contract"].includes(l.status)).length,
    closed: leads.filter(l => l.status === "Closed").length,
    commission: leads.filter(l => l.budget).reduce((s, l) => s + Number(l.budget) * 0.025, 0),
  };
  const dueToday = leads.filter(l => l.nextFollowUp === today);

  const copy = (i, text) => { navigator.clipboard.writeText(text); setCopiedIdx(i); setTimeout(() => setCopiedIdx(null), 2000); };

  return (
    <>
      <style>{css}</style>
      <div className="app-bg" style={{ paddingBottom: 80 }}>

        {/* Sticky Header */}
        <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(28px) saturate(180%)", WebkitBackdropFilter: "blur(28px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 18px 12px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>Lead Tracker</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginTop: 1, fontWeight: 600 }}>Real Estate Command Center</div>
              </div>
              <button className="ios-btn" onClick={addLead} style={{ background: "#007AFF", borderRadius: 16, padding: "11px 20px", color: "#fff", fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 6px 20px rgba(0,122,255,0.4)" }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>+</span> Add
              </button>
            </div>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 5, background: "rgba(255,255,255,0.07)", borderRadius: 14, padding: 4 }}>
              {[["leads","🏠  Leads"], ["templates","✉️  Templates"]].map(([tab, label]) => (
                <button key={tab} className="pill-tab" onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: "9px", borderRadius: 11, fontSize: 14, fontWeight: 800, background: activeTab === tab ? "rgba(255,255,255,0.14)" : "transparent", color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.38)", letterSpacing: -0.2, boxShadow: activeTab === tab ? "0 2px 10px rgba(0,0,0,0.25)" : "none" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px" }}>

          {activeTab === "leads" && <>
            {/* KPI row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 18 }}>
              {[
                { label: "Total", val: stats.total, color: "#007AFF", delay: "0.04s" },
                { label: "Active", val: stats.active, color: "#34C759", delay: "0.08s" },
                { label: "Closed", val: stats.closed, color: "#AF52DE", delay: "0.12s" },
                { label: "Commission", val: `$${(stats.commission/1000).toFixed(0)}k`, color: "#FF9500", delay: "0.16s" },
              ].map(k => (
                <div key={k.label} className="glass kpi-tile" style={{ animationDelay: k.delay }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: k.color }}>{k.val}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", fontWeight: 700, marginTop: 3, textTransform: "uppercase", letterSpacing: 0.4 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Alert */}
            {dueToday.length > 0 && (
              <div style={{ background: "rgba(255,149,0,0.13)", border: "1.5px solid rgba(255,149,0,0.28)", borderRadius: 18, padding: "13px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12, animation: "fadeUp 0.3s ease" }}>
                <span style={{ fontSize: 22 }}>⚡</span>
                <div>
                  <div style={{ color: "#FF9500", fontWeight: 800, fontSize: 14 }}>{dueToday.length} follow-up{dueToday.length > 1 ? "s" : ""} due today</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 1 }}>{dueToday.map(l => `${l.firstName} ${l.lastName}`).join(" · ")}</div>
                </div>
              </div>
            )}

            {/* Search */}
            <div style={{ position: "relative", marginBottom: 14 }}>
              <span style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.28)", fontSize: 17, pointerEvents: "none" }}>🔍</span>
              <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads…" />
            </div>

            {/* Status filters */}
            <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 6, marginBottom: 18, scrollbarWidth: "none" }}>
              {["All", ...STATUSES].map(s => {
                const active = filterStatus === s;
                const m = STATUS_META[s];
                return (
                  <button key={s} className="pill-tab" onClick={() => setFilterStatus(s)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", border: active ? `1.5px solid ${m ? m.color + "55" : "rgba(255,255,255,0.25)"}` : "1.5px solid transparent", background: active ? (m ? m.bg : "rgba(255,255,255,0.14)") : "rgba(255,255,255,0.06)", color: active ? (m ? m.color : "#fff") : "rgba(255,255,255,0.38)" }}>
                    {m ? `${m.emoji} ` : ""}{s}
                  </button>
                );
              })}
            </div>

            {/* Lead cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "64px 20px", color: "rgba(255,255,255,0.2)", animation: "fadeIn 0.3s ease" }}>
                  <div style={{ fontSize: 48, marginBottom: 14 }}>🏠</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>No leads yet</div>
                  <div style={{ fontSize: 13, marginTop: 6 }}>Tap + Add to get started</div>
                </div>
              )}
              {filtered.map((lead, i) => {
                const m = STATUS_META[lead.status] || STATUS_META["New Lead"];
                const daysIn = lead.dateAdded ? Math.floor((Date.now() - new Date(lead.dateAdded)) / 86400000) : 0;
                const overdue = lead.nextFollowUp && lead.nextFollowUp <= today && lead.status !== "Closed";
                return (
                  <div key={lead.id} className="lead-card glass" onClick={() => setSelectedLead(lead)} style={{ animationDelay: `${i * 0.045}s` }}>
                    <div style={{ padding: "16px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                        <Avatar firstName={lead.firstName} lastName={lead.lastName} size={48} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                            <span style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>{lead.firstName || "New"} {lead.lastName || "Lead"}</span>
                            {overdue && <span style={{ fontSize: 9, background: "rgba(255,149,0,0.2)", color: "#FF9500", borderRadius: 8, padding: "2px 8px", fontWeight: 800, letterSpacing: 0.3 }}>FOLLOW UP</span>}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                            <button className="status-pill" style={{ background: m.bg, color: m.color }} onClick={e => { e.stopPropagation(); setSelectedLead(lead); }}>
                              <span style={{ fontSize: 10 }}>{m.emoji}</span>{lead.status}
                            </button>
                            {lead.area && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.32)", fontWeight: 600 }}>📍 {lead.area}</span>}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          {lead.budget && <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>${(Number(lead.budget)/1000).toFixed(0)}k</div>}
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", marginTop: 3, fontWeight: 600 }}>{daysIn}d in</div>
                        </div>
                      </div>
                      {lead.notes && (
                        <div style={{ marginTop: 11, paddingTop: 11, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 13, color: "rgba(255,255,255,0.38)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, lineHeight: 1.4 }}>
                          {lead.notes}
                        </div>
                      )}
                    </div>
                    {lead.nextFollowUp && (
                      <div style={{ padding: "8px 18px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.18)", display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ fontSize: 12 }}>📅</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: overdue ? "#FF9500" : "rgba(255,255,255,0.32)" }}>
                          Follow up: {lead.nextFollowUp}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>
              {filtered.length} of {leads.length} leads · Tap any card to edit
            </div>
          </>}

          {activeTab === "templates" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <div style={{ background: "rgba(0,122,255,0.1)", border: "1.5px solid rgba(0,122,255,0.22)", borderRadius: 18, padding: "13px 16px", display: "flex", gap: 12, alignItems: "flex-start", animation: "fadeUp 0.3s ease" }}>
                <span style={{ fontSize: 20 }}>💡</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, fontWeight: 500 }}>Copy any template into Gmail as a Canned Response. Then use Zapier to auto-fire it when a new lead row is added to your Google Sheet.</span>
              </div>
              {emailTemplates.map((t, i) => (
                <div key={i} className="glass tmpl-card" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ background: `${t.color}22`, color: t.color, borderRadius: 9, padding: "3px 10px", fontSize: 10, fontWeight: 900, letterSpacing: 0.5 }}>{t.tag}</span>
                      <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>{t.label}</span>
                    </div>
                    <button className="copy-btn" onClick={() => copy(i, `Subject: ${t.subject}\n\n${t.body}`)} style={{ background: copiedIdx === i ? "rgba(52,199,89,0.2)" : `${t.color}22`, color: copiedIdx === i ? "#34C759" : t.color }}>
                      {copiedIdx === i ? "✓ Copied!" : "Copy"}
                    </button>
                  </div>
                  <div style={{ padding: "12px 18px 16px" }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 3 }}>Subject</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 12, fontWeight: 600 }}>{t.subject}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 6 }}>Body</div>
                    <pre style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}>{t.body}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedLead && (
          <LeadModal
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onSave={updated => { saveLead(updated); setSelectedLead(null); }}
            onDelete={id => { deleteLead(id); setSelectedLead(null); }}
          />
        )}
      </div>
    </>
  );
}
