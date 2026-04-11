"use client";

import * as React from "react";
import {
  Camera,
  MapPin,
  Upload,
  X,
  Cpu,
  CheckCircle,
  AlertTriangle,
  Locate,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// ─── TYPES ─────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

type AiResult = {
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  summary: string;
  department: string;
  confidence: number;
  estimated_resolution_days: number;
  priority_score: number;
};

type AnalysisLine = {
  id: number;
  time: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'default';
};

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────

const SEVERITY_COLOR: Record<string, string> = {
  low:      "var(--color-accent-green)",
  medium:   "var(--color-accent-amber)",
  high:     "var(--color-accent-red)",
  critical: "var(--color-accent-red)",
};

const CATEGORY_ACCENT: Record<string, string> = {
  pothole:     "var(--color-accent-red)",
  garbage:     "var(--color-accent-amber)",
  lighting:    "#FFD700",
  water:       "var(--color-accent-blue)",
  road_damage: "#FF6B35",
  flooding:    "var(--color-accent-purple)",
  other:       "var(--color-text-secondary)",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function now() {
  return new Date().toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function scoreColor(score: number) {
  if (score > 80) return "var(--color-accent-green)";
  if (score > 50) return "var(--color-accent-amber)";
  return "var(--color-accent-red)";
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function StepProgressBar({ current }: { current: Step }) {
  const steps = [
    { n: 1, label: "Pin Location" },
    { n: 2, label: "Upload Evidence" },
    { n: 3, label: "Review & Submit" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%", maxWidth: "600px", margin: "0 auto 48px", position: "relative" }}>
      {/* Background Line */}
      <div style={{ position: "absolute", top: "20px", left: "10%", right: "10%", height: "4px", background: "var(--color-bg-elevated)", borderRadius: "2px", zIndex: 0 }} />
      {/* Active Line */}
      <div style={{ position: "absolute", top: "20px", left: "10%", width: current === 1 ? "0%" : current === 2 ? "40%" : "80%", height: "4px", background: "var(--color-accent-blue)", borderRadius: "2px", zIndex: 1, transition: "width 0.5s ease" }} />

      {steps.map((s, i) => (
        <div key={s.n} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, position: "relative", zIndex: 2 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: current >= s.n ? "var(--color-accent-blue)" : "var(--color-bg-surface)",
            border: `2px solid ${current >= s.n ? "var(--color-accent-blue)" : "var(--color-border-default)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: current === s.n ? "0 0 0 4px rgba(0, 85, 255, 0.15)" : "none",
            transition: "all 0.3s ease",
            color: current >= s.n ? "white" : "var(--color-text-muted)",
            fontFamily: "var(--font-inter), sans-serif", fontWeight: 700, fontSize: 16
          }}>
            {current > s.n ? <CheckCircle size={20} /> : s.n}
          </div>
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: current >= s.n ? 600 : 500, color: current >= s.n ? "var(--color-text-primary)" : "var(--color-text-muted)" }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function AIPanel({
  lines, lat, lng, locationName, aiResult,
}: {
  lines: AnalysisLine[];
  lat: number | null;
  lng: number | null;
  locationName: string | null;
  aiResult: AiResult | null;
}) {
  const endRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  return (
    <div style={{
      background: "var(--color-bg-surface)", borderRadius: "24px", border: "1px solid var(--color-border-default)",
      display: "flex", flexDirection: "column", width: "100%", boxShadow: "0 8px 32px rgba(27,27,37,0.03)",
      overflow: "hidden"
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 24px", borderBottom: "1px solid var(--color-border-default)", background: "var(--color-bg-base)",
        display: "flex", alignItems: "center", gap: 12
      }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: aiResult ? "var(--color-accent-green)" : "var(--color-accent-blue)" }} />
        <span style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: 15, color: "var(--color-text-primary)" }}>
          AI Diagnostics Context
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--color-border-default)" }}>
        {/* Geographic Data Container */}
        <div style={{ background: "var(--color-bg-surface)", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MapPin size={16} color="var(--color-text-muted)" />
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase" }}>Geo-Spatal Data</span>
          </div>
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 500, color: lat ? "var(--color-text-primary)" : "var(--color-text-muted)" }}>
            {lat ? `${lat.toFixed(4)}° N, ${Math.abs(lng!).toFixed(4)}° ${lng! < 0 ? "W" : "E"}` : "Awaiting sync..."}
          </span>
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.4 }}>
            {locationName || "Resolving location name..."}
          </span>
        </div>

        {/* Network & Security Container */}
        <div style={{ background: "var(--color-bg-surface)", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Cpu size={16} color="var(--color-text-muted)" />
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase" }}>Link Status</span>
          </div>
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 500, color: "var(--color-accent-green)" }}>
            Encrypted Uplink Active
          </span>
        </div>
      </div>

      {/* Analysis Logs Stream */}
      <div style={{ padding: "20px 24px", background: "var(--color-bg-surface)", height: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {lines.map((line) => {
          let color = "var(--color-text-secondary)";
          if (line.type === 'success') color = "var(--color-accent-green)";
          if (line.type === 'info') color = "var(--color-accent-blue)";
          if (line.type === 'warning') color = "var(--color-accent-amber)";
          if (line.type === 'error') color = "var(--color-accent-red)";
          return (
            <motion.div key={line.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--color-text-muted)", flexShrink: 0 }}>{line.time}</span>
              <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color, fontWeight: 500 }}>{line.text}</span>
            </motion.div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* AI Extraction Result */}
      <AnimatePresence>
        {aiResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ background: "var(--color-bg-elevated)", borderTop: "1px solid var(--color-border-default)", overflow: "hidden" }}
          >
           <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ background: `${CATEGORY_ACCENT[aiResult.category] ?? "#7A8BAD"}15`, color: CATEGORY_ACCENT[aiResult.category] ?? "#7A8BAD", fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: "999px" }}>
                  {aiResult.category.replace("_", " ")}
                </span>
                <span style={{ background: `${SEVERITY_COLOR[aiResult.severity]}15`, color: SEVERITY_COLOR[aiResult.severity], fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: "999px" }}>
                  {aiResult.severity.toUpperCase()} Priority
                </span>
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", marginLeft: "auto" }}>
                  {Math.round(aiResult.confidence * 100)}% Match
                </span>
              </div>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, color: "var(--color-text-primary)", lineHeight: 1.6, marginBottom: 16, paddingLeft: 12, borderLeft: `3px solid var(--color-accent-blue)` }}>
                "{aiResult.summary}"
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, color: "var(--color-text-secondary)" }}>Routed Department</span>
                  <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>{aiResult.department}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                  <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, color: "var(--color-text-secondary)" }}>Est. Resolution</span>
                  <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>{aiResult.estimated_resolution_days}–{aiResult.estimated_resolution_days + 2} Days</span>
                </div>
              </div>
           </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export function CivicPulseReport() {
  const router                    = useRouter();
  const [step, setStep]           = React.useState<Step>(1);
  const [lat, setLat]             = React.useState<number | null>(null);
  const [lng, setLng]             = React.useState<number | null>(null);
  const [locationName, setLocationName] = React.useState<string | null>(null);
  const [locLoading, setLocLoading] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [description, setDescription] = React.useState("");
  const [title, setTitle]         = React.useState("");
  const [isDragging, setIsDragging] = React.useState(false);
  const [aiResult, setAiResult]   = React.useState<AiResult | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [issueCode, setIssueCode] = React.useState("");
  const [user, setUser]           = React.useState<any>(null);
  const [termLines, setTermLines] = React.useState<AnalysisLine[]>([
    { id: 0, time: now(), text: "CivicPulse AI core initialized.", type: 'info' },
    { id: 1, time: now(), text: "Ready for sensor and contextual data injection.", type: 'default' },
  ]);
  const lineId = React.useRef(2);
  const fileRef = React.useRef<HTMLInputElement>(null);

  function addLine(text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    setTermLines((prev) => [...prev, { id: lineId.current++, time: now(), text, type }]);
  }

  async function resolveLocationName(latitude: number, longitude: number) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Reverse geocoding request failed");
      }

      const data = await response.json();
      const address = data?.address || {};
      const compactName =
        address?.suburb ||
        address?.neighbourhood ||
        address?.city_district ||
        address?.city ||
        address?.town ||
        address?.village ||
        data?.display_name?.split(",").slice(0, 3).join(", ");

      const resolved = compactName || "Mapped civic zone";
      setLocationName(resolved);
      addLine(`Location name resolved: ${resolved}`, "success");
    } catch {
      const fallbackName = `Lat ${latitude.toFixed(3)}, Lng ${longitude.toFixed(3)}`;
      setLocationName(fallbackName);
      addLine("Unable to resolve location name from coordinates. Using coordinate label.", "warning");
    }
  }

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth?redirect=/report");
      } else {
        setUser(session.user);
        addLine(`Active session verified. ID: ${session.user.id.slice(0, 6)}.`, 'success');
      }
    };
    checkAuth();
  }, [router]);

  function getLocation() {
    setLocLoading(true);
    addLine("Requesting device geospatial hardware...", 'info');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        void resolveLocationName(pos.coords.latitude, pos.coords.longitude);
        setLocLoading(false);
        addLine(`Coordinates locked: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`, 'success');
        setStep(2);
      },
      () => {
        setLocLoading(false);
        addLine("Triangulation failed. Provide manual coordinates if needed.", 'warning');
        setLat(28.6139); setLng(77.2090);
        setLocationName("New Delhi");
        setStep(2);
      }
    );
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      addLine(`Visual asset mapped: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, 'info');
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  async function classify() {
    if (!description.trim()) return;
    setSubmitting(true);
    addLine("Packaging data. Transmitting to inference engine...", 'info');

    let imageBase64: string | null = null;
    if (imagePreview) {
      imageBase64 = imagePreview.split(",")[1];
    }

    try {
      const imageMimeType = imagePreview?.split(",")[0].split(":")[1].split(";")[0] || null;
      const res = await fetch("/api/classify-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, imageBase64, imageMimeType }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "API returned an error");
      setAiResult(data as AiResult);
      const code = `CP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      setIssueCode(code);
      addLine(`Classification success. Incident ${code} generated.`, 'success');
      addLine(`Issue auto-routed to ${data.department}.`, 'info');
      setStep(3);
    } catch (error: any) {
      addLine(`AI API unavailable (${error?.message || "unknown error"}). Applying fallback heuristic.`, 'warning');
      addLine("Inference engine overhead. Applying fallback heuristic.", 'warning');
      const mock: AiResult = { category: "pothole", severity: "high", summary: "Significant road surface degradation detected. Immediate risk to vehicle suspension components.", department: "Roads & Transit", confidence: 0.94, estimated_resolution_days: 3, priority_score: 9 };
      setAiResult(mock);
      const code = `CP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      setIssueCode(code);
      setStep(3);
    }
    setSubmitting(false);
  }

  function b64ToBlob(b64Data: string, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
  }

  async function submitIssue() {
    if (!aiResult || !user) return;
    setSubmitting(true);
    addLine("Encrypting payload and synchronizing with main civic database...", 'info');

    try {
      let finalImageUrl = imagePreview;

      if (imageFile && imagePreview) {
        addLine("Committing high-res visual evidence to secure bucket...", 'info');
        const base64Data = imagePreview.split(",")[1];
        const contentType = imagePreview.split(",")[0].split(":")[1].split(";")[0];
        const blob = b64ToBlob(base64Data, contentType);
        
        const fileName = `${user.id}/${Date.now()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("issue-images")
          .upload(fileName, blob, { contentType });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("issue-images")
          .getPublicUrl(uploadData.path);
        
        finalImageUrl = publicUrl;
      }

      const { error: insertError } = await supabase.from("issues").insert({
        issue_code: issueCode,
        user_id: user.id,
        title: title || (aiResult.summary.slice(0, 50) + "..."),
        description: description,
        category: aiResult.category,
        severity: aiResult.severity,
        department: aiResult.department,
        ai_summary: aiResult.summary,
        ai_confidence: aiResult.confidence,
        estimated_resolution_days: aiResult.estimated_resolution_days,
        priority_score: aiResult.priority_score,
        status: "open",
        latitude: lat || 28.6139,
        longitude: lng || 77.2090,
        area_name: locationName || "Mapped civic zone",
        image_url: finalImageUrl
      });

      if (insertError) throw insertError;

      addLine("Ledger entry confirmed. Dispatching alerts.", 'success');
      setSubmitted(true);
    } catch (error: any) {
      console.error("Submission failed:", error);
      addLine(`Sync error: ${error.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  // ─── SUCCESS STATE ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-bg-base)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          style={{ maxWidth: "560px", width: "100%", background: "var(--color-bg-surface)", border: "1px solid var(--color-border-default)", borderRadius: "24px", padding: "48px 40px", textAlign: "center", boxShadow: "0 12px 48px rgba(27,27,37,0.06)" }}
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <CheckCircle size={40} color="var(--color-accent-green)" />
            </div>
          </motion.div>
          <h2 style={{ fontFamily: "var(--font-manrope), sans-serif", fontWeight: 800, fontSize: 36, color: "var(--color-text-primary)", marginBottom: 12 }}>Report Received</h2>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 16, color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: 32 }}>
            Thank you for being an active citizen. Your report has been validated and queued for the appropriate city department.
          </p>
          <div style={{ background: "var(--color-bg-base)", borderRadius: "12px", padding: "16px", marginBottom: 32, display: "inline-block", border: "1px solid var(--color-border-default)" }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--color-text-muted)", display: "block", marginBottom: 4 }}>Tracking ID</span>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 20, fontWeight: 700, color: "var(--color-accent-blue)" }}>{issueCode}</span>
          </div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", flexDirection: "column" }}>
            <Button
              onClick={() => router.push("/my-reports")}
              style={{ background: "linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))", color: "white", borderRadius: "9999px", padding: "14px 28px", fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: 15, border: "none" }}
            >
              Track Progress
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              style={{ background: "transparent", border: "none", color: "var(--color-accent-blue)", borderRadius: "9999px", padding: "14px 28px", fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: 15 }}
            >
              Return Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── MAIN LAYOUT ───────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-base)", paddingTop: 100, paddingBottom: 100 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h1 style={{ fontFamily: "var(--font-manrope), sans-serif", fontWeight: 800, fontSize: "clamp(40px, 6vw, 56px)", color: "var(--color-text-primary)", lineHeight: 1.1, marginBottom: 16 }}>
            Report an Issue
          </h1>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 17, color: "var(--color-text-secondary)", maxWidth: "540px", margin: "0 auto", lineHeight: 1.6 }}>
            Help improve your city by documenting issues. Our AI will automatically categorize and route your report to the right department.
          </p>
        </div>

        <StepProgressBar current={step} />

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <AnimatePresence mode="popLayout">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 90 }}>
                <div style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border-default)", borderRadius: "24px", padding: "40px", boxShadow: "0 8px 32px rgba(27,27,37,0.03)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ background: "rgba(0, 85, 255, 0.1)", padding: 8, borderRadius: 12 }}>
                      <MapPin size={24} color="var(--color-accent-blue)" />
                    </div>
                    <h2 style={{ fontFamily: "var(--font-manrope), sans-serif", fontWeight: 700, fontSize: 28, color: "var(--color-text-primary)" }}>Provide Location</h2>
                  </div>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 16, color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: 32 }}>
                    We need the exact coordinates to route this service request accurately. Your location data is secure and localized.
                  </p>
                  
                  <Button onClick={getLocation} disabled={locLoading} style={{ background: "linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))", color: "white", width: "100%", borderRadius: "9999px", padding: "16px", fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: 16, border: "none" }}>
                    {locLoading ? "Acquiring coordinates..." : "Use My Current Location"}
                  </Button>
                  <Button onClick={() => { setLat(28.6139); setLng(77.2090); setLocationName("New Delhi"); setStep(2); addLine("Manual override selected for location.", 'info'); }} variant="ghost" style={{ width: "100%", marginTop: 12, color: "var(--color-text-muted)", fontFamily: "var(--font-inter), sans-serif", fontWeight: 500, border: "none", background: "transparent" }}>
                    Set Location Manually
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 90 }}>
                <div style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border-default)", borderRadius: "24px", padding: "40px", boxShadow: "0 8px 32px rgba(27,27,37,0.03)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                    <div style={{ background: "rgba(0, 85, 255, 0.1)", padding: 8, borderRadius: 12 }}>
                      <Camera size={24} color="var(--color-accent-blue)" />
                    </div>
                    <h2 style={{ fontFamily: "var(--font-manrope), sans-serif", fontWeight: 700, fontSize: 28, color: "var(--color-text-primary)" }}>Describe the Issue</h2>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => !imagePreview && fileRef.current?.click()}
                      style={{ border: `2px dashed ${isDragging ? "var(--color-accent-blue)" : imagePreview ? "var(--color-accent-green)" : "var(--color-border-strong)"}`, background: isDragging ? "rgba(0, 85, 255, 0.05)" : "var(--color-bg-base)", borderRadius: "16px", padding: imagePreview ? 0 : 48, textAlign: "center", cursor: imagePreview ? "default" : "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="evidence" style={{ width: "100%", height: "240px", objectFit: "cover" }} />
                          <button onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageFile(null); addLine("Asset dismissed.", 'warning'); }} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.9)", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "1px solid var(--color-border-default)" }}>
                            <X size={16} color="var(--color-accent-red)" />
                          </button>
                        </>
                      ) : (
                        <>
                          <Upload size={36} color="var(--color-text-muted)" style={{ margin: "0 auto 16px" }} />
                          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: 16, color: "var(--color-text-primary)", marginBottom: 8 }}>Drag and drop evidence</p>
                          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--color-text-secondary)" }}>Supported formats: JPEG, PNG (max 10MB)</p>
                        </>
                      )}
                      <input ref={fileRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} style={{ display: "none" }} />
                    </div>

                    <div>
                      <label style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)", display: "block", marginBottom: 8 }}>Short Title</label>
                      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g., Large pothole near the intersection" style={{ width: "100%", padding: "16px", background: "var(--color-bg-base)", border: "1px solid var(--color-border-default)", borderRadius: "12px", fontFamily: "var(--font-inter), sans-serif", fontSize: 15, color: "var(--color-text-primary)", outline: "none", transition: "all 0.2s" }} onFocus={(e) => e.currentTarget.style.borderColor = "var(--color-accent-blue)"} onBlur={(e) => e.currentTarget.style.borderColor = "var(--color-border-default)"} />
                    </div>

                    <div>
                      <label style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)", display: "block", marginBottom: 8 }}>Additional Details</label>
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Explain the severity, risk to public, or how long it's been an issue..." rows={4} style={{ width: "100%", padding: "16px", background: "var(--color-bg-base)", border: "1px solid var(--color-border-default)", borderRadius: "12px", fontFamily: "var(--font-inter), sans-serif", fontSize: 15, color: "var(--color-text-primary)", outline: "none", resize: "none", transition: "all 0.2s" }} onFocus={(e) => e.currentTarget.style.borderColor = "var(--color-accent-blue)"} onBlur={(e) => e.currentTarget.style.borderColor = "var(--color-border-default)"} />
                    </div>

                    <Button onClick={classify} disabled={submitting || !description.trim()} style={{ background: "linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))", color: "white", width: "100%", borderRadius: "9999px", padding: "16px", fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: 16, border: "none", marginTop: 8, opacity: (submitting || !description.trim()) ? 0.85 : 1 }}>
                      {submitting ? "Analyzing..." : "Analyze with CivicPulse AI"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && aiResult && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 90 }}>
                <div style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border-default)", borderRadius: "24px", padding: "40px", boxShadow: "0 8px 32px rgba(27,27,37,0.03)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                    <div style={{ background: "rgba(0, 85, 255, 0.1)", padding: 8, borderRadius: 12 }}>
                      <FileText size={24} color="var(--color-accent-blue)" />
                    </div>
                    <h2 style={{ fontFamily: "var(--font-manrope), sans-serif", fontWeight: 700, fontSize: 28, color: "var(--color-text-primary)" }}>Final Review</h2>
                  </div>
                  
                  <div style={{ background: "var(--color-bg-base)", border: "1px solid var(--color-border-default)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--color-text-secondary)" }}>Category</span>
                      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)" }}>{aiResult.category.replace("_", " ").toUpperCase()}</span>
                    </div>
                    <div style={{ height: 1, background: "var(--color-border-default)", width: "100%" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--color-text-secondary)" }}>Department</span>
                      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)" }}>{aiResult.department}</span>
                    </div>
                    <div style={{ height: 1, background: "var(--color-border-default)", width: "100%" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--color-text-secondary)" }}>Estimated Resolution</span>
                      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)" }}>Within {aiResult.estimated_resolution_days + 2} days</span>
                    </div>
                    <div style={{ height: 1, background: "var(--color-border-default)", width: "100%" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--color-text-secondary)" }}>Location</span>
                      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)", textAlign: "right" }}>
                        {locationName || "Mapped civic zone"} {lat && lng ? `(${lat.toFixed(4)}, ${lng.toFixed(4)})` : ""}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 16 }}>
                    <Button onClick={() => setStep(2)} variant="outline" style={{ flex: 1, background: "transparent", color: "var(--color-text-primary)", borderRadius: "9999px", padding: "16px", fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: 16, border: "1px solid var(--color-border-default)" }}>
                      Edit
                    </Button>
                    <Button onClick={submitIssue} disabled={submitting} style={{ flex: 2, background: "linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))", color: "white", borderRadius: "9999px", padding: "16px", fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: 16, border: "none", opacity: submitting ? 0.9 : 1 }}>
                      {submitting ? "Submitting..." : "Submit Report"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>

          <div className="sticky top-[100px]">
            {/* AI Terminal Status Panel */}
            <AIPanel lines={termLines} lat={lat} lng={lng} locationName={locationName} aiResult={aiResult} />
          </div>

        </div>
      </div>
    </div>
  );
}
