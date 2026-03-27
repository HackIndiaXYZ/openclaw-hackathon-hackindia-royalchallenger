"use client";

import * as React from "react";
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Filter,
  Eye,
  Building,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

// ─── TYPES ─────────────────────────────────────────────────────────────────────

type Status = "open" | "in-progress" | "resolved" | "analysing";
type Severity = "low" | "medium" | "high" | "critical";

type Report = {
  id: string;
  issue_code: string;
  title: string;
  ai_summary: string;
  category: string;
  severity: Severity;
  status: Status;
  department: string;
  area_name: string;
  latitude: number;
  longitude: number;
  created_at: string;
};

const SEVERITY_COLOR: Record<Severity, string> = {
  low:      "var(--color-accent-green, #10b981)",
  medium:   "var(--color-accent-amber, #f59e0b)",
  high:     "var(--color-accent-red, #ef4444)",
  critical: "var(--color-accent-red, #ef4444)",
};

const CATEGORY_COLOR: Record<string, string> = {
  pothole:     "var(--color-accent-red, #ef4444)",
  garbage:     "var(--color-accent-amber, #f59e0b)",
  lighting:    "#FFD700",
  water:       "var(--color-accent-blue, #0055ff)",
  road_damage: "#FF6B35",
  flooding:    "var(--color-accent-purple, #8b5cf6)",
  other:       "var(--color-text-secondary, #6b7280)",
};

const STATUS: Record<Status, { label: string; color: string }> = {
  "open":        { label: "Open",        color: "var(--color-accent-red, #ef4444)"   },
  "in-progress": { label: "In Progress", color: "var(--color-accent-amber, #f59e0b)" },
  "resolved":    { label: "Resolved",    color: "var(--color-accent-green, #10b981)" },
  "analysing":   { label: "Analysing",   color: "var(--color-accent-blue, #0055ff)"  },
};

const FILTERS = [
  { label: "All",         value: "all"         },
  { label: "Open",        value: "open"        },
  { label: "In Progress", value: "in-progress" },
  { label: "Resolved",    value: "resolved"    },
  { label: "Analysing",   value: "analysing"   },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function ago(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60)   return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400)return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

// ─── STAT CARD ─────────────────────────────────────────────────────────────────

function Stat({ n, label, color, i }: { n: number; label: string; color: string; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: i * 0.05, duration: 0.4 }}
      style={{
        flex: "1 1 180px",
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-default)",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 8px 24px rgba(27,27,37,0.02)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)" }}>
          {label}
        </span>
      </div>
      <span style={{ fontFamily: "var(--font-manrope), sans-serif", fontWeight: 700, fontSize: 42, color: "var(--color-text-primary)", lineHeight: 1 }}>
        {n}
      </span>
    </motion.div>
  );
}

// ─── REPORT CARD ───────────────────────────────────────────────────────────────

function Card({ r, i }: { r: Report; i: number }) {
  const cat = CATEGORY_COLOR[r.category] ?? "var(--color-text-secondary)";
  const sev = SEVERITY_COLOR[r.severity];
  const currentStatus = r.status as Status;
  const st = STATUS[currentStatus] || STATUS["open"];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ delay: i * 0.05, type: "spring", stiffness: 90, damping: 20 }}
      style={{
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-default)",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 4px 12px rgba(27,27,37,0.03)",
        position: "relative",
        overflow: "hidden",
      }}
      whileHover={{ borderColor: "var(--color-border-strong)", boxShadow: "0 12px 32px rgba(27,27,37,0.06)" }}
    >
      {/* Decorative left accent line */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: st.color }} />

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingLeft: "8px" }}>
        
        {/* Header: ID + Status + Severity */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: 14, color: "var(--color-accent-blue)" }}>
            #{r.issue_code}
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ background: `${sev}15`, color: sev, fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: "999px" }}>
              {r.severity} Priority
            </span>
            <span style={{ background: `${st.color}15`, color: st.color, display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: "999px" }}>
              {r.status === "resolved" && <CheckCircle size={14} />}
              {r.status === "open" && <AlertCircle size={14} />}
              {r.status === "analysing" && (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <RotateCcw size={14} />
                </motion.span>
              )}
              {r.status === "in-progress" && <Clock size={14} />}
              {st.label}
            </span>
          </div>
        </div>

        {/* Title & Summary */}
        <div>
          <h3 style={{ fontFamily: "var(--font-manrope), sans-serif", fontWeight: 700, fontSize: 22, color: "var(--color-text-primary)", marginBottom: "8px" }}>
            {r.title}
          </h3>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            {r.ai_summary}
          </p>
        </div>

        {/* Meta / Footer */}
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "24px", paddingTop: "12px", borderTop: "1px solid var(--color-border-default)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", maxWidth: "200px" }}>
            <MapPin style={{ flexShrink: 0 }} size={16} color="var(--color-text-muted)" />
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--color-text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {r.area_name || "City District"} {r.latitude ? `(${r.latitude.toFixed(4)}, ${r.longitude.toFixed(4)})` : ""}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Building size={16} color="var(--color-text-muted)" />
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--color-text-secondary)" }}>
              {r.department || "Municipal Services"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Clock size={16} color="var(--color-text-muted)" />
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--color-text-secondary)" }}>{ago(r.created_at)}</span>
          </div>
          
          <button style={{
            marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px",
            background: "transparent", color: "var(--color-accent-blue)", border: "none",
            fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            <Eye size={16} /> View Details
          </button>
        </div>

      </div>
    </motion.article>
  );
}

// ─── EMPTY STATE ───────────────────────────────────────────────────────────────

function Empty() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border-default)", borderRadius: "24px", padding: "64px 40px", textAlign: "center", boxShadow: "0 8px 32px rgba(27,27,37,0.02)" }}>
      <div style={{ background: "var(--color-bg-base)", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
        <MapPin size={32} color="var(--color-text-muted)" />
      </div>
      <h3 style={{ fontFamily: "var(--font-manrope), sans-serif", fontWeight: 700, fontSize: 24, color: "var(--color-text-primary)", marginBottom: "12px" }}>No reports found</h3>
      <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 16, color: "var(--color-text-secondary)", maxWidth: "380px", margin: "0 auto 32px", lineHeight: 1.6 }}>We couldn't find any issues matching this filter. File a new report to get started.</p>
      <Button onClick={() => window.location.href = "/report"} style={{ background: "linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))", color: "white", borderRadius: "9999px", fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: 14, padding: "12px 32px", border: "none" }}>
        File a Report <ArrowRight size={16} style={{ marginLeft: "8px" }} />
      </Button>
    </motion.div>
  );
}

// ─── MAIN ──────────────────────────────────────────────────────────────────────

export function CivicPulseMyReports() {
  const [filter, setFilter] = React.useState("all");
  const [reports, setReports] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/auth?redirect=/my-reports";
        return;
      }
      
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!error) setReports(data as Report[]);
      setLoading(false);
    }
    init();
  }, []);

  const filtered = filter === "all" ? reports : reports.filter(r => r.status === filter);
  const count = (s: Status) => reports.filter(r => r.status === s).length;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-bg-base)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
          <RotateCcw size={32} color="var(--color-accent-blue)" />
        </motion.div>
        <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 500, color: "var(--color-text-secondary)" }}>Loading your reports...</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-base)", color: "var(--color-text-primary)", fontFamily: "var(--font-inter), sans-serif", paddingTop: 100 }}>
      {/* Page content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", marginBottom: "48px" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-manrope), sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 48px)", color: "var(--color-text-primary)", lineHeight: 1.1, marginBottom: "12px" }}>
              My Contributions
            </h1>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 16, color: "var(--color-text-secondary)", maxWidth: "500px", lineHeight: 1.6 }}>
              Track the status of your reported civic issues and see the impact you're making in the community.
            </p>
          </div>
          <Button
            onClick={() => window.location.href = "/report"}
            style={{ background: "linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))", color: "white", borderRadius: "9999px", fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: 15, padding: "12px 32px", border: "none", boxShadow: "0 8px 16px rgba(0,50,125,0.15)" }}
          >
            <Plus size={18} style={{ marginRight: "8px" }} />
            New Report
          </Button>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "48px" }}>
          <Stat n={reports.length}   label="Total Filed"  color="var(--color-accent-blue)"  i={0} />
          <Stat n={count("open")}    label="Open"         color="var(--color-accent-red)"   i={1} />
          <Stat n={count("in-progress")} label="In Progress" color="var(--color-accent-amber)" i={2} />
          <Stat n={count("resolved")} label="Resolved"    color="var(--color-accent-green)" i={3} />
        </div>

        {/* ── FILTER BAR ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", overflowX: "auto", paddingBottom: "16px", marginBottom: "24px", scrollbarWidth: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingRight: "16px", borderRight: "1px solid var(--color-border-default)" }}>
            <Filter size={18} color="var(--color-text-muted)" />
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: 14, color: "var(--color-text-secondary)" }}>Filters</span>
          </div>
          {FILTERS.map(f => {
            const active = filter === f.value;
            return (
              <button key={f.value} onClick={() => setFilter(f.value)} style={{ 
                background: active ? "var(--color-accent-blue)" : "var(--color-bg-surface)", 
                border: `1px solid ${active ? "var(--color-accent-blue)" : "var(--color-border-default)"}`, 
                color: active ? "white" : "var(--color-text-secondary)", 
                fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: 14, 
                padding: "8px 20px", borderRadius: "9999px", cursor: "pointer", transition: "all 0.2s",
                whiteSpace: "nowrap"
              }}>
                {f.label}
              </button>
            );
          })}
        </div>

        {/* ── CARDS LIST ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <AnimatePresence mode="popLayout">
            {filtered.length === 0
              ? <Empty key="empty" />
              : filtered.map((r, i) => <Card key={r.id} r={r} i={i} />)
            }
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
