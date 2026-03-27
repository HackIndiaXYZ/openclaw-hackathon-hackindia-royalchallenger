"use client";

import * as React from "react";
import {
  MapPin,
  Camera,
  Cpu,
  CheckCircle,
  ArrowRight,
  Menu,
  Zap,
  Droplets,
  Lightbulb,
  Trash2,
  Waves,
  Construction,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Star,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { motion, useAnimation, useInView, useMotionValue, animate, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";

const MapPreview = dynamic(() => import("../sections/MapPreview"), { ssr: false });

// ─── NAVIGATION ────────────────────────────────────────────────────────────────

const navLinks = [
  { title: "HOW IT WORKS", href: "#how-it-works" },
  { title: "LIVE MAP", href: "#map" },
  { title: "IMPACT", href: "#impact" },
  { title: "REPORT", href: "#report" },
];

// ─── HERO DATA ─────────────────────────────────────────────────────────────────

const heroStats = [
  { value: 2847, label: "ISSUES REPORTED", color: "var(--color-accent-blue)" },
  { value: 143, label: "RESOLVED TODAY", color: "var(--color-accent-green)" },
  { value: 71, label: "CITY SCORE", color: "var(--color-accent-amber)", suffix: "/100" },
];

const heroWords = ["YOUR", "CITY", "HAS", "A", "VOICE", "NOW."];

// ─── HOW IT WORKS ──────────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "Capture the Issue",
    body: "Take a photo in-app or upload from your gallery. GPS location is detected automatically.",
    accent: "var(--color-accent-blue)",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Classifies Instantly",
    body: "Claude AI reads your photo and description — assigns category, severity, and department in under 3 seconds.",
    accent: "var(--color-accent-blue)",
  },
  {
    number: "03",
    icon: MapPin,
    title: "Goes Live on the Map",
    body: "Your report appears instantly on the public city dashboard. Total transparency. No lost forms.",
    accent: "var(--color-accent-green)",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "Track to Resolution",
    body: "Status updates as your issue moves open → in-progress → resolved. Your city is now accountable.",
    accent: "var(--color-accent-amber)",
  },
];

// ─── CATEGORIES ────────────────────────────────────────────────────────────────

const categories = [
  { icon: AlertCircle, label: "POTHOLES", count: "4,218 reports", accent: "var(--color-accent-red)", resolved: 62 },
  { icon: Trash2, label: "GARBAGE", count: "3,107 reports", accent: "var(--color-accent-amber)", resolved: 74 },
  { icon: Lightbulb, label: "LIGHTING", count: "1,892 reports", accent: "var(--color-accent-amber)", resolved: 81 },
  { icon: Droplets, label: "WATER", count: "2,441 reports", accent: "var(--color-accent-blue)", resolved: 58 },
  { icon: Construction, label: "ROAD DAMAGE", count: "1,673 reports", accent: "var(--color-accent-red)", resolved: 49 },
  { icon: Waves, label: "FLOODING", count: "891 reports", accent: "var(--color-accent-blue)", resolved: 67 },
];

// ─── AREA LEADERBOARD ──────────────────────────────────────────────────────────

const areas = [
  { rank: "01", name: "Connaught Place", score: 88, trend: "up" },
  { rank: "02", name: "Karol Bagh", score: 73, trend: "up" },
  { rank: "03", name: "Lajpat Nagar", score: 61, trend: "down" },
  { rank: "04", name: "Rohini Sector 9", score: 54, trend: "down" },
  { rank: "05", name: "Dwarka Sector 12", score: 47, trend: "down" },
];

// ─── TESTIMONIALS ──────────────────────────────────────────────────────────────

const testimonials = [
  {
    quote: "Filed a pothole report on Monday. It was patched by Thursday. I've lived here 12 years and never seen anything move that fast.",
    name: "Rahul Sharma", city: "New Delhi", initials: "RS", category: "POTHOLES", accent: "var(--color-accent-red)",
  },
  {
    quote: "Three broken streetlights on my street had been ignored for months. CivicPulse got all three replaced within a week.",
    name: "Priya Menon", city: "Mumbai", initials: "PM", category: "LIGHTING", accent: "var(--color-accent-amber)",
  },
  {
    quote: "The AI classification is scary accurate. It knew exactly which department to route my water leakage report to instantly.",
    name: "Arjun Bose", city: "Kolkata", initials: "AB", category: "WATER", accent: "var(--color-accent-blue)",
  },
  {
    quote: "Our NGO uses CivicPulse to track systemic issues across the city. The area health scores are invaluable for our reports.",
    name: "Sneha Kulkarni", city: "Pune", initials: "SK", category: "ROAD DAMAGE", accent: "var(--color-accent-red)",
  },
  {
    quote: "I was skeptical at first. But seeing my report on the public map and watching the status update in real time — this is real accountability.",
    name: "Vikram Nair", city: "Bangalore", initials: "VN", category: "GARBAGE", accent: "var(--color-accent-amber)",
  },
  {
    quote: "During the monsoon flooding I submitted 4 reports in one morning. All were routed and acknowledged before noon. Incredible.",
    name: "Ananya Das", city: "Chennai", initials: "AD", category: "FLOODING", accent: "var(--color-accent-blue)",
  },
];

// ─── UTILS ─────────────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score > 80) return "var(--color-accent-green)";
  if (score > 50) return "var(--color-accent-amber)";
  return "var(--color-accent-red)";
}

// ─── ANIMATED COUNTER ──────────────────────────────────────────────────────────

function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const count = useMotionValue(0);
  const [display, setDisplay] = React.useState("0");
  React.useEffect(() => {
    const controls = animate(count, to, { duration: 2, ease: "easeOut" });
    const unsub = count.on("change", (v) => setDisplay(Math.round(v).toLocaleString()));
    return () => { controls.stop(); unsub(); };
  }, [to, count]);
  return <span>{display}{suffix}</span>;
}

// ─── PULSING LED ───────────────────────────────────────────────────────────────

function Led({ color = "var(--color-accent-blue)", size = 8 }: { color?: string; size?: number }) {
  return (
    <motion.span
      style={{ width: size, height: size, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }}
      animate={{ opacity: [1, 0.3, 1], boxShadow: [`0 0 8px ${color}`, "none", `0 0 8px ${color}`] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── REPORTING MODAL ──────────────────────────────────────────────────────────


// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export function CivicPulsePlatform() {
  const [scrolled, setScrolled] = React.useState(false);
  const [stats, setStats] = React.useState({ reported: 2847, resolved: 143, score: 71 });
  const [randomId, setRandomId] = React.useState(""); 
  const [mounted, setMounted] = React.useState(false);
  const howRef = React.useRef(null);
  const mapRef = React.useRef<HTMLElement>(null);
  const catRef = React.useRef(null);
  const scoreRef = React.useRef(null);
  const testRef = React.useRef(null);
  const howInView = useInView(howRef, { once: true, amount: 0.15 });
  const catInView = useInView(catRef, { once: true, amount: 0.1 });
  const scoreInView = useInView(scoreRef, { once: true, amount: 0.3 });
  const testInView = useInView(testRef, { once: true, amount: 0.1 });

  React.useEffect(() => {
    setMounted(true);
    // Generate initial ID only on client
    setRandomId(Math.random().toString(36).substr(2, 6).toUpperCase());
    
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    
    // Fetch real stats
    async function fetchStats() {
      const { count: reported } = await supabase.from("issues").select("*", { count: 'exact', head: true });
      const { count: resolved } = await supabase.from("issues").select("*", { count: 'exact', head: true }).eq("status", "resolved");
      
      if (reported !== null) setStats(prev => ({ ...prev, reported: 2847 + reported }));
      if (resolved !== null) setStats(prev => ({ ...prev, resolved: 143 + resolved }));
    }
    fetchStats();

    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div
      style={{ background: "var(--color-bg-base)", color: "var(--color-text-primary)", fontFamily: "var(--font-body)", overflowX: "hidden" }}
    >

      {/* ── NOISE GRAIN ── */}
      <div
        aria-hidden
        style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.22,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ══════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════ */}
      {/* Navbar global in layout */}

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section style={{ position: "relative", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        
        {/* Background Overlay */}
        <div style={{ position: "absolute", inset: 0, background: "transparent", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.35) contrast(1.1)", opacity: 0.65, zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, var(--color-bg-base) 95%)", zIndex: 1 }} />

        {/* Retro grid floor */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "linear-gradient(rgba(195,198,213,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(195,198,213,0.3) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          transform: "perspective(600px) rotateX(55deg) scale(2.5)",
          transformOrigin: "50% 100%",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
        }} />

        {/* Radial glow */}
        <div aria-hidden style={{ position: "absolute", bottom: -180, left: "50%", transform: "translateX(-50%)", width: 700, height: 380, background: "radial-gradient(ellipse, rgba(195,198,213,0.25) 0%, transparent 68%)", pointerEvents: "none", zIndex: 1 }} />

        {/* Scan lines */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(195,198,213,0.1) 2px, rgba(195,198,213,0.1) 4px)",
        }} />

        {/* Corner accents */}
        {[["top:16px;left:16px", "top:0;left:0", "top:0;left:0"], ["top:16px;right:16px", "top:0;right:0", "top:0;right:0"], ["bottom:16px;left:16px", "bottom:0;left:0", "bottom:0;left:0"], ["bottom:16px;right:16px", "bottom:0;right:0", "bottom:0;right:0"]].map((_, i) => (
          <React.Fragment key={i}>
            <div aria-hidden style={{
              position: "absolute", width: 40, height: 1, background: "var(--color-accent-blue)", opacity: 0.4, zIndex: 3,
              top: i < 2 ? 16 : "auto", bottom: i >= 2 ? 16 : "auto",
              left: i % 2 === 0 ? 16 : "auto", right: i % 2 === 1 ? 16 : "auto",
            }} />
            <div aria-hidden style={{
              position: "absolute", width: 1, height: 40, background: "var(--color-accent-blue)", opacity: 0.4, zIndex: 3,
              top: i < 2 ? 16 : "auto", bottom: i >= 2 ? 16 : "auto",
              left: i % 2 === 0 ? 16 : "auto", right: i % 2 === 1 ? 16 : "auto",
            }} />
          </React.Fragment>
        ))}

        {/* City silhouette */}
        <svg aria-hidden viewBox="0 0 1440 160" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", height: 160, zIndex: 2 }}>
          <path fill="var(--color-bg-surface)" d="M0,160 L0,110 L60,110 L60,80 L100,80 L100,60 L120,60 L120,80 L160,80 L160,40 L190,40 L190,80 L230,80 L230,90 L270,90 L270,50 L300,50 L300,30 L320,30 L320,50 L360,50 L360,90 L400,90 L400,70 L440,70 L440,100 L500,100 L500,55 L530,55 L530,35 L555,35 L555,55 L600,55 L600,100 L650,100 L650,65 L690,65 L690,45 L710,45 L710,65 L760,65 L760,100 L820,100 L820,80 L860,80 L860,50 L890,50 L890,80 L940,80 L940,95 L980,95 L980,60 L1010,60 L1010,40 L1030,40 L1030,60 L1080,60 L1080,95 L1130,95 L1130,75 L1170,75 L1170,55 L1195,55 L1195,75 L1250,75 L1250,100 L1300,100 L1300,65 L1340,65 L1340,85 L1380,85 L1380,110 L1440,110 L1440,160 Z" />
        </svg>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: 920, width: "100%", padding: "0 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(0,50,125,0.28)", padding: "8px 20px", marginBottom: 16 }}
          >
            <Led color="var(--color-accent-blue)" size={7} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.35em", color: "var(--color-accent-blue)", textTransform: "uppercase" }}>CITYWIDE AI REPORTING SYSTEM</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            style={{ height: 24, overflow: "hidden", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, borderTop: "1px solid rgba(0,50,125,0.05)", borderBottom: "1px solid rgba(0,50,125,0.05)", width: "100%", maxWidth: 600 }}
          >
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--color-text-muted)", letterSpacing: "0.2em" }}>RECENT ACTIVITY:</span>
            <div style={{ flex: 1, position: "relative", height: "100%" }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={stats.reported}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  style={{ position: "absolute", left: 0, width: "100%", textAlign: "left", fontFamily: "var(--font-body)", fontSize: 11, color: "var(--color-accent-blue)", fontWeight: 500 }}
                >
                  {mounted && randomId ? `NEW REPORT: #${randomId} • JUST NOW IN CENTRAL AREA` : "SCANNING FEED..."}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Headline (Static · Centred · Single Line) */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 0 24px",
              padding: 0,
              whiteSpace: "nowrap",
            }}
          >
            {heroWords.map((word, i) => (
              <span
                key={word + i}
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(36px, 5vw, 84px)",
                  lineHeight: 0.88,
                  display: "inline-block",
                  color: word === "VOICE" ? "var(--color-accent-blue)" : "var(--color-text-primary)",
                  textShadow: "none",
                }}
              >
                {word}
              </span>
            ))}
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            style={{ fontFamily: "var(--font-body)", fontSize: 18, color: "var(--color-text-secondary)", maxWidth: 540, lineHeight: 1.75, marginBottom: 40 }}
          >
            Snap a photo. AI identifies the issue, classifies severity, routes it to the right department — in 3 seconds.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 64 }}
          >
            <Button
              onClick={() => window.location.href = '/report'}
              size="lg"
              style={{ background: "var(--color-accent-blue)", color: "var(--color-bg-base)", borderRadius: 9999, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.18em", padding: "16px 40px", border: "none" }}
            >
              REPORT AN ISSUE <ArrowRight style={{ marginLeft: 8, width: 16, height: 16 }} />
            </Button>
            <Button
              onClick={() => window.location.href = '/dashboard'}
              size="lg"
              variant="outline"
              style={{ background: "transparent", border: "1px solid rgba(0,50,125,0.28)", color: "var(--color-accent-blue)", borderRadius: 9999, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.18em", padding: "16px 40px" }}
            >
              VIEW LIVE MAP →
            </Button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            style={{ display: "flex", gap: 0, width: "100%", maxWidth: 560, justifyContent: "center" }}
          >
            {heroStats.map((stat, i) => (
              <div key={stat.label} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                padding: "0 24px",
                borderLeft: i > 0 ? "1px solid rgba(0,50,125,0.12)" : "none",
              }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, fontSize: 32, color: "var(--color-text-primary)", textShadow: "none", lineHeight: 1 }}>
                  <AnimatedCounter to={i === 0 ? stats.reported : i === 1 ? stats.resolved : stats.score} suffix={stat.suffix ?? ""} />
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.25em", color: "var(--color-text-secondary)", textTransform: "uppercase" }}>{stat.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Led color={stat.color} size={6} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.4em", color: "var(--color-accent-blue)", textTransform: "uppercase" }}>LIVE</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 10 }}>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 2, height: 52, background: "var(--color-accent-blue)", opacity: 0.4 }}
          />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.5em", color: "var(--color-text-muted)", textTransform: "uppercase" }}>SCROLL</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section id="how-it-works" ref={howRef} style={{ background: "var(--color-bg-base)", padding: "120px 5vw", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(195,198,213,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(195,198,213,0.15) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.5em", color: "var(--color-accent-blue)", textTransform: "uppercase", marginBottom: 16 }}>SYSTEM OVERVIEW</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6vw,80px)", lineHeight: 0.9, color: "var(--color-text-primary)" }}>
              FROM SNAP TO{" "}
              <span style={{ color: "var(--color-accent-blue)", textShadow: "none" }}>RESOLUTION.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 1 }}>
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                animate={howInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 80, damping: 16 }}
                style={{ background: "var(--color-bg-surface)", border: "1px solid rgba(0,50,125,0.1)", padding: "32px 28px", display: "flex", flexDirection: "column", gap: 16, position: "relative", cursor: "default", transition: "border-color 0.25s, box-shadow 0.25s" }}
                whileHover={{ y: -8, borderColor: "rgba(0,50,125,0.32)", boxShadow: "0 0 30px rgba(0,50,125,0.08)" }}
              >
                <span style={{ position: "absolute", top: 20, right: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--color-text-muted)", letterSpacing: "0.2em" }}>{step.number}</span>
                <step.icon style={{ width: 28, height: 28, color: step.accent }} />
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--color-text-primary)", margin: 0 }}>{step.title}</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.7, margin: 0 }}>{step.body}</p>
                <div style={{ width: 36, height: 3, background: step.accent, marginTop: "auto" }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ══════════════════════════════════════════
          LIVE MAP PREVIEW
      ══════════════════════════════════════════ */}
      <section id="map" ref={mapRef}>
        <MapPreview />
      </section>

      {/* ══════════════════════════════════════════
          CIVIC HEALTH SCORE
      ══════════════════════════════════════════ */}
      <section ref={scoreRef} style={{ background: "var(--color-bg-base)", padding: "120px 5vw" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8vw", alignItems: "center" }}>

          {/* Gauge */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg viewBox="0 0 240 160" style={{ width: 300, overflow: "visible" }}>
              <defs>
                <filter id="crt">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <circle cx="120" cy="120" r="90" fill="none" stroke="rgba(0,50,125,0.08)" strokeWidth="8" strokeDasharray="4 6" />
              <path d="M 30 120 A 90 90 0 1 1 210 120" fill="none" stroke="rgba(0,50,125,0.08)" strokeWidth="8" strokeLinecap="square" />
              <motion.path
                d="M 30 120 A 90 90 0 1 1 210 120"
                fill="none"
                stroke={scoreColor(71)}
                strokeWidth="8"
                strokeLinecap="square"
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                animate={scoreInView ? { strokeDashoffset: 283 * (1 - 71 / 100) } : {}}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <text x="120" y="112" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight="500" fontSize="52" fill="var(--color-text-primary)" filter="url(#crt)">71</text>
              <text x="120" y="135" textAnchor="middle" fontFamily="var(--font-body)" fontSize="14" fill="var(--color-text-secondary)">/100</text>
            </svg>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--color-text-primary)", marginTop: 16, letterSpacing: "0.05em" }}>NEW DELHI CENTRAL</p>
          </div>

          {/* Leaderboard */}
          <div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.5em", color: "var(--color-accent-blue)", textTransform: "uppercase", marginBottom: 24 }}>AREA RANKINGS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {areas.map((area, i) => (
                <motion.div
                  key={area.name}
                  initial={{ opacity: 0, x: 40 }}
                  animate={scoreInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 90, damping: 16 }}
                  style={{ background: "var(--color-bg-surface)", border: "1px solid rgba(0,50,125,0.1)", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16, transition: "border-color 0.25s" }}
                  whileHover={{ borderColor: "rgba(0,50,125,0.32)", y: -2 }}
                >
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "var(--color-text-muted)", width: 24 }}>{area.rank}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 16, color: "var(--color-text-primary)", flex: 1 }}>{area.name}</span>
                  <div style={{ width: 80, height: 4, background: "var(--color-bg-surface)", position: "relative", borderRadius: 9999 }}>
                    <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${area.score}%`, background: scoreColor(area.score) }} />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, color: scoreColor(area.score), width: 40, textAlign: "right" }}>{area.score}</span>
                  {area.trend === "up"
                    ? <TrendingUp style={{ width: 14, height: 14, color: "var(--color-accent-green)" }} />
                    : <TrendingDown style={{ width: 14, height: 14, color: "var(--color-accent-red)" }} />
                  }
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ISSUE CATEGORIES
      ══════════════════════════════════════════ */}
      <section ref={catRef} style={{ background: "var(--color-bg-surface)", padding: "100px 5vw" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.5em", color: "var(--color-accent-blue)", textTransform: "uppercase", marginBottom: 16 }}>WHAT WE TRACK</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px,5vw,72px)", lineHeight: 0.9, color: "var(--color-text-primary)" }}>
              THE{" "}
              <span style={{ color: "var(--color-accent-blue)", textShadow: "none" }}>6</span>
              {" "}CATEGORIES.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {categories.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 40 }}
                animate={catInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 80, damping: 16 }}
                style={{ background: "var(--color-bg-surface)", border: "1px solid rgba(0,50,125,0.08)", padding: "32px 28px", display: "flex", flexDirection: "column", gap: 12, cursor: "default", transition: "all 0.25s" }}
                whileHover={{ y: -8, borderColor: "rgba(0,50,125,0.32)", boxShadow: "0 0 30px rgba(0,50,125,0.07)" }}
              >
                <cat.icon style={{ width: 40, height: 40, color: cat.accent }} />
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--color-text-primary)", margin: 0 }}>{cat.label}</h3>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--color-text-secondary)", letterSpacing: "0.15em" }}>{cat.count}</span>
                <div style={{ marginTop: "auto", width: "100%", height: 3, background: "var(--color-bg-surface)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={catInView ? { width: `${cat.resolved}%` } : {}}
                    transition={{ delay: 0.4 + i * 0.08, duration: 1, ease: "easeOut" }}
                    style={{ height: "100%", background: cat.accent }}
                  />
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--color-text-muted)", letterSpacing: "0.2em" }}>{cat.resolved}% RESOLVED</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS  (full white — contrast break)
      ══════════════════════════════════════════ */}
      <section ref={testRef} style={{ background: "var(--color-bg-surface)", padding: "100px 5vw", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -50, right: -50, width: 600, height: 600, background: "transparent", backgroundSize: "contain", backgroundRepeat: "no-repeat", opacity: 0.1, zIndex: 0, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px,4vw,64px)", lineHeight: 0.9, color: "var(--color-text-primary)", marginBottom: 16 }}>
              REAL <span style={{ color: "var(--color-accent-blue)" }}>PEOPLE.</span> REAL <span style={{ color: "var(--color-accent-blue)" }}>CHANGE.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                animate={testInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-strong)", padding: 32, display: "flex", flexDirection: "column", gap: 16, transition: "all 0.2s" }}
                whileHover={{ background: "var(--color-bg-surface)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
              >
                <span style={{ display: "inline-block", background: `${t.accent}18`, color: t.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.2em", padding: "4px 12px", borderRadius: 999 }}>{t.category}</span>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "var(--color-text-primary)", lineHeight: 1.8, margin: 0 }}>"{t.quote}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--color-bg-base)" }}>{t.initials}</div>
                  <div>
                    <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 15, color: "var(--color-text-primary)", margin: 0 }}>{t.name}</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--color-text-secondary)", margin: 0 }}>{t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CALL TO ACTION
      ══════════════════════════════════════════ */}
      <section style={{ position: "relative", height: "100vh", background: "var(--color-bg-base)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "transparent", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15, zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, var(--color-bg-base) 0%, transparent 40%, var(--color-bg-base) 100%)", zIndex: 1 }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(195,198,213,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(195,198,213,0.3) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -100, left: "50%", transform: "translateX(-50%)", width: 900, height: 500, background: "transparent", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(195,198,213,0.1) 2px, rgba(195,198,213,0.1) 4px)", pointerEvents: "none" }} />
        {[0, 1, 2, 3].map(i => (
          <React.Fragment key={i}>
            <div aria-hidden style={{ position: "absolute", width: 40, height: 1, background: "var(--color-accent-blue)", opacity: 0.4, top: i < 2 ? 16 : "auto", bottom: i >= 2 ? 16 : "auto", left: i % 2 === 0 ? 16 : "auto", right: i % 2 === 1 ? 16 : "auto" }} />
            <div aria-hidden style={{ position: "absolute", width: 1, height: 40, background: "var(--color-accent-blue)", opacity: 0.4, top: i < 2 ? 16 : "auto", bottom: i >= 2 ? 16 : "auto", left: i % 2 === 0 ? 16 : "auto", right: i % 2 === 1 ? 16 : "auto" }} />
          </React.Fragment>
        ))}
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px", maxWidth: 800 }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.6em", color: "var(--color-accent-blue)", textTransform: "uppercase", marginBottom: 32 }}
          >
            THE CHOICE
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 0 24px",
              padding: 0,
              whiteSpace: "nowrap",
            }}
          >
            {["YOUR", "CITY", "NEEDS", "YOU."].map((word, i) => (
              <span
                key={word + i}
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(36px, 5vw, 84px)",
                  lineHeight: 0.88,
                  display: "inline-block",
                  color: word === "NEEDS" ? "var(--color-accent-blue)" : "var(--color-text-primary)",
                  textShadow: "none",
                }}
              >
                {word}
              </span>
            ))}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ fontFamily: "var(--font-body)", fontSize: 18, color: "var(--color-text-secondary)", maxWidth: 440, margin: "0 auto 48px" }}
          >
            Stop watching problems pile up. One photo. 30 seconds. Real impact.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.6 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 64 }}
          >
            <Button onClick={() => window.location.href = '/report'} size="lg" style={{ background: "var(--color-accent-blue)", color: "var(--color-bg-base)", borderRadius: 9999, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.18em", padding: "16px 48px", minWidth: 260, border: "none" }}>
              START REPORTING
            </Button>
            <Button onClick={() => mapRef.current?.scrollIntoView({ behavior: "smooth" })} size="lg" variant="outline" style={{ background: "transparent", border: "1px solid rgba(0,50,125,0.28)", color: "var(--color-accent-blue)", borderRadius: 9999, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.18em", padding: "16px 48px", minWidth: 260 }}>
              VIEW THE MAP
            </Button>
          </motion.div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.25em", color: "var(--color-text-muted)", textTransform: "uppercase" }}>
            FREE · OPEN TO ALL CITIZENS · NO ACCOUNT REQUIRED TO VIEW MAP
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer style={{ background: "var(--color-bg-base)", borderTop: "1px solid rgba(0,50,125,0.08)", padding: "64px 5vw 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-12">
          <div className="col-span-1 md:col-span-4 lg:col-span-2">
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: "var(--color-text-primary)" }}>CIVIC</span>
                <Led color="var(--color-accent-blue)" size={8} />
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: "var(--color-accent-blue)", textShadow: "none" }}>PULSE</span>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-text-secondary)", marginTop: 12, marginBottom: 8 }}>AI-powered civic accountability.</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--color-text-muted)" }}>Built for OpenClaw Hackathon · HackIndia 2026</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                <Led color="var(--color-accent-green)" size={7} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--color-accent-green)", letterSpacing: "0.2em" }}>SYSTEM OPERATIONAL</span>
              </div>
            </div>
            {[
              { heading: "PLATFORM", links: ["Live Map", "Report Issue", "My Reports", "How It Works"] },
              { heading: "OPEN DATA", links: ["Area Scores", "Issue Feed", "API Docs", "Download Data"] },
              { heading: "LEGAL", links: ["Privacy Policy", "Terms of Service", "Contact"] },
            ].map((col) => (
              <div key={col.heading}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.5em", color: "var(--color-accent-blue)", textTransform: "uppercase", marginBottom: 16 }}>{col.heading}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {col.links.map((link) => (
                    <a key={link} href="#" style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-text-secondary)", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--color-text-primary)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-secondary)")}
                    >{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(0,50,125,0.06)", paddingTop: 32, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--color-text-muted)" }}>© 2026 CIVICPULSE AI — ALL RIGHTS RESERVED</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--color-text-muted)" }}>OPEN SOURCE · BUILT IN INDIA 🇮🇳</span>
          </div>
        </div>
      </footer>


    </div>
  );
}
