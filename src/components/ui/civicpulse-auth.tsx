"use client";

import * as React from "react";
import {
  Shield,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Zap,
  Globe,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// ─── FLOATING PARTICLES ────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 4 + 4,
  delay: Math.random() * 3,
}));

// ─── LED DOT ───────────────────────────────────────────────────────────────────
function Led({ color = "var(--color-accent-blue)", size = 8 }: { color?: string; size?: number }) {
  return (
    <motion.span
      style={{
        width: size, height: size, borderRadius: "50%",
        background: color, display: "inline-block", flexShrink: 0,
      }}
      animate={{
        opacity: [1, 0.25, 1],
        boxShadow: [`0 0 8px ${color}`, "none", `0 0 8px ${color}`],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon, value, label, color, delay,
}: {
  icon: React.ElementType; value: string; label: string; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      style={{
        display: "flex", flexDirection: "column", gap: 4,
        padding: "12px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
        <Led color={color} size={6} />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
          color: color, letterSpacing: "0.3em", textTransform: "uppercase",
        }}>
          {label}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Icon style={{ width: 18, height: 18, color }} />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 500,
          fontSize: 28, color: "#F0F4FF",
          textShadow: `0 0 20px ${color}60, 0 0 40px ${color}30`,
        }}>
          {value}
        </span>
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export function CivicPulseAuth() {
  const router = useRouter();
  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [scanX, setScanX] = React.useState(0);

  // Scanning line animation on the left panel
  React.useEffect(() => {
    let frame: number;
    let x = 0;
    const tick = () => {
      x = (x + 0.4) % 110;
      setScanX(x);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });
        if (signUpError) throw signUpError;
      }
      
      // Successfully authenticated
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh", display: "flex",
        background: "var(--color-bg-base)", color: "#F0F4FF",
        fontFamily: "'Space Grotesk', sans-serif",
        overflow: "hidden", position: "relative",
      }}
    >
      {/* ── NOISE GRAIN ── */}
      <div
        aria-hidden
        style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.2,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ══════════════════════════════════════════
          LEFT PANEL — Brand / Identity
      ══════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 55%", position: "relative", overflow: "hidden",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "80px 8vw", zIndex: 1,
        }}
        className="hidden md:flex"
      >
        {/* Retro grid floor */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,50,125,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,50,125,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            transform: "perspective(600px) rotateX(55deg) scale(2.8)",
            transformOrigin: "50% 100%",
            maskImage: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)",
          }}
        />

        {/* Scan lines */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,50,125,0.01) 2px, rgba(0,50,125,0.01) 4px)",
          }}
        />

        {/* Animated vertical scan beam */}
        <div
          aria-hidden
          style={{
            position: "absolute", top: 0, bottom: 0,
            left: `${scanX}%`, width: 2,
            background: "linear-gradient(to bottom, transparent, rgba(0,50,125,0.18), transparent)",
            pointerEvents: "none", zIndex: 2,
          }}
        />

        {/* Radial glow */}
        <div
          aria-hidden
          style={{
            position: "absolute", bottom: -200, left: "30%",
            width: 600, height: 400,
            background: "radial-gradient(ellipse, rgba(0,50,125,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Corner accents — top-left only on left panel */}
        <div aria-hidden style={{ position: "absolute", top: 24, left: 24, width: 40, height: 1, background: "var(--color-accent-blue)", opacity: 0.45 }} />
        <div aria-hidden style={{ position: "absolute", top: 24, left: 24, width: 1, height: 40, background: "var(--color-accent-blue)", opacity: 0.45 }} />
        <div aria-hidden style={{ position: "absolute", bottom: 24, left: 24, width: 40, height: 1, background: "var(--color-accent-blue)", opacity: 0.45 }} />
        <div aria-hidden style={{ position: "absolute", bottom: 24, left: 24, width: 1, height: 40, background: "var(--color-accent-blue)", opacity: 0.45 }} />

        {/* Floating particles */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            aria-hidden
            style={{
              position: "absolute",
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              borderRadius: "50%",
              background: "var(--color-accent-blue)", opacity: 0.18,
              pointerEvents: "none", zIndex: 1,
            }}
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Content */}
        <div style={{ position: "relative", zIndex: 3 }}>

          {/* Secure node tag */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              border: "1px solid rgba(0,50,125,0.28)",
              padding: "6px 16px", marginBottom: 36,
            }}
          >
            <Shield style={{ width: 13, height: 13, color: "var(--color-accent-blue)" }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              letterSpacing: "0.35em", color: "var(--color-accent-blue)", textTransform: "uppercase",
            }}>
              SECURE NODE-ID: CP-2026
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 80, damping: 14 }}
            style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 800,
              fontSize: "clamp(48px, 5.5vw, 84px)", lineHeight: 0.88,
              marginBottom: 28, textTransform: "uppercase",
            }}
          >
            <span style={{ display: "block", color: "#F0F4FF" }}>ACCESS THE</span>
            <span
              style={{
                display: "block", color: "var(--color-accent-blue)",
                textShadow: "0 0 24px rgba(0,50,125,0.55), 0 0 80px rgba(0,50,125,0.2)",
              }}
            >
              CITY GRID.
            </span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 16,
              color: "#7A8BAD", maxWidth: 380, lineHeight: 1.75, marginBottom: 48,
            }}
          >
            Synchronize your device to the CivicPulse network. Your authentication
            ensures a verifiable and transparent urban response protocol.
          </motion.p>

          {/* Divider */}
          <div style={{ width: "100%", height: 1, background: "rgba(0,50,125,0.1)", marginBottom: 36 }} />

          {/* Stats row */}
          <div style={{ display: "flex", gap: 48 }}>
            <StatCard icon={Globe}  value="99.9%" label="UPTIME PROTOCOL"     color="#00FF88" delay={0.7} />
            <StatCard icon={Users}  value="12.4K" label="IDENTIFIED CITIZENS" color="var(--color-accent-blue)" delay={0.85} />
            <StatCard icon={Zap}    value="3s"    label="AI RESPONSE TIME"    color="#FFB800" delay={1.0} />
          </div>

          {/* Protocol tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            style={{ display: "flex", gap: 16, marginTop: 36 }}
          >
            {["AES-256 ENCRYPTED", "SUPABASE AUTH", "ZERO-KNOWLEDGE"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                  color: "#3A4A66", letterSpacing: "0.2em", textTransform: "uppercase",
                  border: "1px solid rgba(0,50,125,0.08)", padding: "4px 10px",
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — Auth Form
      ══════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 45%", display: "flex", alignItems: "center",
          justifyContent: "center", padding: "60px 5vw",
          borderLeft: "1px solid rgba(0,50,125,0.08)",
          background: "var(--color-bg-surface)", position: "relative", zIndex: 1,
        }}
        className="w-full md:w-[45%]"
      >
        {/* Corner accents — right panel */}
        <div aria-hidden style={{ position: "absolute", top: 24, right: 24, width: 40, height: 1, background: "var(--color-accent-blue)", opacity: 0.35 }} />
        <div aria-hidden style={{ position: "absolute", top: 24, right: 24, width: 1, height: 40, background: "var(--color-accent-blue)", opacity: 0.35 }} />
        <div aria-hidden style={{ position: "absolute", bottom: 24, right: 24, width: 40, height: 1, background: "var(--color-accent-blue)", opacity: 0.35 }} />
        <div aria-hidden style={{ position: "absolute", bottom: 24, right: 24, width: 1, height: 40, background: "var(--color-accent-blue)", opacity: 0.35 }} />

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 80, damping: 16 }}
          style={{ width: "100%", maxWidth: 400 }}
        >
          {/* Form header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Led color="var(--color-accent-blue)" size={8} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                letterSpacing: "0.45em", color: "var(--color-accent-blue)", textTransform: "uppercase",
              }}>
                IDENTITY VERIFICATION
              </span>
            </div>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 800,
              fontSize: 32, color: "#F0F4FF", lineHeight: 1, marginBottom: 8,
            }}>
              {mode === "login" ? "Initialize Session" : "Request Access"}
            </h2>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 14,
              color: "#7A8BAD", lineHeight: 1.6,
            }}>
              {mode === "login"
                ? "Enter your secure credentials to bypass the grid lock."
                : "Register your identity on the CivicPulse network."}
            </p>
          </div>

          {/* Mode toggle */}
          <div
            style={{
              display: "flex", marginBottom: 36,
              border: "1px solid rgba(0,50,125,0.14)", position: "relative",
            }}
          >
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  letterSpacing: "0.25em", textTransform: "uppercase",
                  background: mode === m ? "var(--color-accent-blue)" : "transparent",
                  color: mode === m ? "var(--color-bg-base)" : "#7A8BAD",
                  fontWeight: mode === m ? 700 : 400,
                  transition: "all 0.2s",
                }}
              >
                {m === "login" ? "SIGN IN" : "SIGN UP"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            
            {error && (
              <div style={{ 
                padding: "10px 14px", 
                background: "rgba(255, 59, 59, 0.1)", 
                border: "1px solid rgba(255, 59, 59, 0.3)", 
                color: "#FF3B3B",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12
              }}>
                {error}
              </div>
            )}

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                letterSpacing: "0.35em", color: "var(--color-accent-blue)", textTransform: "uppercase",
              }}>
                EMAIL ADDRESS
              </label>
              <div style={{ position: "relative" }}>
                <Mail style={{
                  position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                  width: 15, height: 15, color: "#3A4A66", pointerEvents: "none",
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EN@GRID.NODE"
                  required
                  style={{
                    width: "100%", padding: "13px 14px 13px 40px",
                    background: "#0D1526", border: "1px solid rgba(0,50,125,0.14)",
                    color: "#F0F4FF", borderRadius: 0, outline: "none",
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                    letterSpacing: "0.05em", transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent-blue)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,50,125,0.14)")}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                  letterSpacing: "0.35em", color: "var(--color-accent-blue)", textTransform: "uppercase",
                }}>
                  PASSWORD
                </label>
                {mode === "login" && (
                  <a href="/auth/reset-password" style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    color: "#3A4A66", textDecoration: "none", letterSpacing: "0.15em",
                    textTransform: "uppercase", transition: "color 0.2s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent-blue)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#3A4A66")}
                  >
                    FORGOT?
                  </a>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <Lock style={{
                  position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                  width: 15, height: 15, color: "#3A4A66", pointerEvents: "none",
                }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{
                    width: "100%", padding: "13px 44px 13px 40px",
                    background: "#0D1526", border: "1px solid rgba(0,50,125,0.14)",
                    color: "#F0F4FF", borderRadius: 0, outline: "none",
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                    letterSpacing: "0.1em", transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent-blue)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,50,125,0.14)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "#3A4A66", padding: 0, display: "flex", alignItems: "center",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent-blue)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#3A4A66")}
                >
                  {showPassword
                    ? <EyeOff style={{ width: 15, height: 15 }} />
                    : <Eye style={{ width: 15, height: 15 }} />
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", borderRadius: 0, marginTop: 8,
                background: loading ? "#0D1526" : "var(--color-accent-blue)",
                color: loading ? "var(--color-accent-blue)" : "var(--color-bg-base)",
                border: loading ? "1px solid rgba(0,50,125,0.32)" : "none",
                fontFamily: "'Outfit', sans-serif", fontWeight: 700,
                fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase",
                padding: "16px 0", cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s", position: "relative", overflow: "hidden",
              }}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                    }}
                  >
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      ▮▮▮
                    </motion.span>
                    AUTHENTICATING...
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    INITIALIZE SESSION
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </form>

          {/* Switch mode */}
          <div style={{ marginTop: 28, textAlign: "center" }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              color: "#3A4A66", letterSpacing: "0.15em",
            }}>
              {mode === "login" ? "LACKING SYSTEM AUTHORIZATION? " : "ALREADY SYNCHRONIZED? "}
            </span>
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                color: "var(--color-accent-blue)", letterSpacing: "0.15em", textTransform: "uppercase",
                textDecoration: "underline", padding: 0,
              }}
            >
              {mode === "login" ? "APPLY FOR CITIZEN ACCESS" : "SIGN IN →"}
            </button>
          </div>

          {/* Bottom meta */}
          <div style={{
            marginTop: 36, paddingTop: 24,
            borderTop: "1px solid rgba(0,50,125,0.06)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
              color: "#3A4A66", letterSpacing: "0.2em", textTransform: "uppercase",
            }}>
              AES-256 ENCRYPTED
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
              color: "#3A4A66", letterSpacing: "0.2em", textTransform: "uppercase",
            }}>
              NODE_SYNC_2026.04
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── BACK LINK (top center) ── */}
      <motion.a
        href="/"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        style={{
          position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          color: "#3A4A66", textDecoration: "none", letterSpacing: "0.35em",
          textTransform: "uppercase", zIndex: 100,
          display: "flex", alignItems: "center", gap: 8,
          border: "1px solid rgba(0,50,125,0.06)", padding: "6px 16px",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--color-accent-blue)";
          e.currentTarget.style.borderColor = "rgba(0,50,125,0.28)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#3A4A66";
          e.currentTarget.style.borderColor = "rgba(0,50,125,0.06)";
        }}
      >
        ← BACK TO HOME
      </motion.a>
    </div>
  );
}
