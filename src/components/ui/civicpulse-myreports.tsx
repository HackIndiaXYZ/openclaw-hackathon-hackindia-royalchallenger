"use client";

import * as React from "react";
import { 
  History, 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Cpu,
  RefreshCw,
  SearchX,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// ─── TYPES ─────────────────────────────────────────────────────────────────────

type ReportStatus = "open" | "in-progress" | "resolved";

type Report = {
  id: string;
  issue_code: string;
  title: string;
  description: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  department: string;
  ai_summary: string;
  ai_confidence: number;
  status: ReportStatus;
  created_at: string;
  latitude: number;
  longitude: number;
  area_name: string;
  image_url: string;
  estimated_resolution_days?: number;
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<ReportStatus, string> = {
  "open":        "#FF3B3B",
  "in-progress": "#FFB800",
  "resolved":    "#00FF88",
};

const SEVERITY_COLOR: Record<string, string> = {
  low:      "#00FF88",
  medium:   "#FFB800",
  high:     "#FF3B3B",
  critical: "#FF3B3B",
};

function Led({ color = "var(--color-accent-blue)", size = 8 }: { color?: string; size?: number }) {
  return (
    <motion.span
      style={{ width: size, height: size, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }}
      animate={{ opacity: [1, 0.25, 1], boxShadow: [`0 0 8px ${color}`, "none", `0 0 8px ${color}`] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── REPORT CARD ───────────────────────────────────────────────────────────────

function ReportCard({ report }: { report: Report }) {
  const router = useRouter();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.002, borderColor: "rgba(0,50,125,0.3)" }}
      style={{
        background: "var(--color-bg-surface)",
        border: "1px solid rgba(0,50,125,0.12)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: "100%",
        transition: "all 0.2s",
        position: "relative"
      }}
    >
      {/* Visual Indicator for status */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: STATUS_COLOR[report.status], boxShadow: `0 0 12px ${STATUS_COLOR[report.status]}40` }} />

      {/* Header Row */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(0,50,125,0.06)", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--color-accent-blue)", letterSpacing: "0.2em" }}>{report.issue_code}</span>
          <div style={{ width: 1, height: 12, background: "rgba(0,50,125,0.1)" }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#3A4A66", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            LOGGED {new Date(report.created_at).toLocaleDateString()}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ background: `${SEVERITY_COLOR[report.severity]}15`, color: SEVERITY_COLOR[report.severity], fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.2em", padding: "3px 10px", borderRadius: 2, border: `1px solid ${SEVERITY_COLOR[report.severity]}25`, textTransform: "uppercase" }}>
            {report.severity} SEVERITY
          </span>
          <span style={{ background: `${STATUS_COLOR[report.status]}15`, color: STATUS_COLOR[report.status], fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.2em", padding: "3px 10px", borderRadius: 2, border: `1px solid ${STATUS_COLOR[report.status]}25`, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
            {report.status === "resolved" ? <CheckCircle size={10} /> : report.status === "in-progress" ? <Clock size={10} /> : <Led color="#FF3B3B" size={6} />}
            {report.status.replace("-", " ")}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {/* Left Section: Details */}
        <div style={{ flex: 2, padding: "20px", minWidth: 300 }}>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: "#F0F4FF", marginBottom: 8 }}>{report.title}</h3>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: "#7A8BAD", lineHeight: 1.6, marginBottom: 20 }}>{report.description}</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16 }}>
             <div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#3A4A66", letterSpacing: "0.25em", display: "block", marginBottom: 4 }}>LOCATION</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={10} color="var(--color-accent-blue)" />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#F0F4FF" }}>{report.area_name}</span>
              </div>
            </div>
            <div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#3A4A66", letterSpacing: "0.25em", display: "block", marginBottom: 4 }}>UNIT ROUTED</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Cpu size={10} color="var(--color-accent-blue)" />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#F0F4FF" }}>{report.department}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: AI Track & Image */}
        <div style={{ flex: 1.2, padding: "20px", background: "rgba(0,50,125,0.02)", borderLeft: "1px solid rgba(0,50,125,0.06)", minWidth: 280 }}>
          {/* AI Track Progress */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--color-accent-blue)", letterSpacing: "0.2em" }}>NETWORK PROGRESS</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: STATUS_COLOR[report.status] }}>
                {report.status === "resolved" ? "100% COMPLETE" : report.status === "in-progress" ? "50% ANALYZED" : "15% TICKETED"}
              </span>
            </div>
            <div style={{ height: 2, background: "rgba(0,50,125,0.08)", position: "relative" }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: report.status === "resolved" ? "100%" : report.status === "in-progress" ? "50%" : "15%" }}
                style={{ height: "100%", background: STATUS_COLOR[report.status], boxShadow: `0 0 8px ${STATUS_COLOR[report.status]}60` }}
              />
            </div>
          </div>

          {/* AI Summary Snip */}
          <div style={{ background: "rgba(4,7,15,0.6)", padding: 12, border: "1px solid rgba(0,50,125,0.08)", marginBottom: 16 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "#3A4A66", letterSpacing: "0.3em", display: "block", marginBottom: 6 }}>AI TRIAGE NOTE</span>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "#F0F4FF", fontStyle: "italic", lineHeight: 1.5 }}>
              "{report.ai_summary.slice(0, 80)}..."
            </p>
          </div>

          <Button 
            variant="outline"
            onClick={() => router.push(`/dashboard?focus=${report.id}`)}
            style={{ width: "100%", height: 36, background: "transparent", border: "1px solid rgba(0,50,125,0.2)", borderRadius: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.15em", color: "var(--color-accent-blue)" }}
          >
            LOCATE ON GRID →
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export function CivicPulseMyReports() {
  const router = useRouter();
  const [reports, setReports] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth?redirect=/my-reports");
        return;
      }
      setUser(session.user);
      
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!error) setReports(data as Report[]);
      setLoading(false);
    }
    init();
  }, [router]);

  const filtered = reports.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    r.issue_code.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <RefreshCw size={32} className="animate-spin" color="var(--color-accent-blue)" />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.45em", color: "#3A4A66" }}>SEQUENCING CITIZEN DATA...</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%" }}>
      {/* Search Header */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 20 }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <History size={16} color="var(--color-accent-blue)" />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.45em", color: "var(--color-accent-blue)", textTransform: "uppercase" }}>
              USER CONTRIBUTION LOGS
            </span>
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 42, color: "#F0F4FF", lineHeight: 1 }}>CITIZEN <span style={{ color: "var(--color-accent-blue)" }}>HISTORY.</span></h2>
        </div>

        <div style={{ position: "relative", width: "100%", maxWidth: 360 }}>
          <Search size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#3A4A66" }} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="FILTER BY CODE OR TITLE..."
            style={{ width: "100%", padding: "12px 14px 12px 42px", background: "var(--color-bg-surface)", border: "1px solid rgba(0,50,125,0.14)", color: "#F0F4FF", borderRadius: 0, outline: "none", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.05em" }}
          />
        </div>
      </div>

      {/* Reports List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.length > 0 ? (
          filtered.map(report => <ReportCard key={report.id} report={report} />)
        ) : (
          <div style={{ padding: "80px 20px", textAlign: "center", background: "var(--color-bg-surface)", border: "1px dashed rgba(0,50,125,0.12)" }}>
            <SearchX size={40} color="#3A4A66" style={{ margin: "0 auto 20px" }} />
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, color: "#7A8BAD", marginBottom: 24 }}>No matching records found in the ledger.</p>
            <Button 
              onClick={() => router.push("/report")}
              style={{ background: "var(--color-accent-blue)", color: "var(--color-bg-base)", borderRadius: 0, padding: "12px 24px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em" }}
            >
              CREATE NEW ENTRY <ArrowRight size={14} style={{ marginLeft: 8 }} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
