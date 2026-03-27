"use client";

import * as React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowRight, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Dynamically import map to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("./MapClient"), { ssr: false });

function Led({ color = "var(--color-accent-blue)", size = 8 }: { color?: string; size?: number }) {
  return (
    <motion.span
      style={{ width: size, height: size, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }}
      animate={{ opacity: [1, 0.3, 1], boxShadow: [`0 0 8px ${color}`, "none", `0 0 8px ${color}`] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function MapPreview() {
  const [issues, setIssues] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function fetchIssues() {
      const { data } = await supabase.from("issues").select("*").order("created_at", { ascending: false });
      if (data) setIssues(data);
    }
    fetchIssues();

    // Subscribe to changes
    const channel = supabase
      .channel("map-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "issues" }, (payload) => {
        setIssues(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section id="map" style={{ background: "var(--color-bg-base)", borderTop: "1px solid rgba(0,50,125,0.08)", borderBottom: "1px solid rgba(0,50,125,0.08)", display: "flex", flexDirection: "column" }}>
      
      {/* Top — Full Width Map */}
      <div style={{ position: "relative", width: "100%", height: "65vh", minHeight: 500, background: "var(--color-bg-surface)" }}>
        <MapComponent issues={issues} />
        
        {/* LIVE Badge */}
        <div style={{ position: "absolute", top: 24, left: 24, zIndex: 500, display: "flex", alignItems: "center", gap: 10, background: "rgba(8,13,26,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(0,50,125,0.2)", padding: "10px 16px" }}>
          <Led color="var(--color-accent-blue)" size={8} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--color-accent-blue)", letterSpacing: "0.3em", fontWeight: 600 }}>LIVE CITY FEED</span>
        </div>

        {/* Scan lines overlay for map */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,50,125,0.015) 2px, rgba(0,50,125,0.015) 3px)" }} />
      </div>

      {/* Bottom — Full Width Content Bar */}
      <div style={{ width: "100%", background: "var(--color-bg-base)", borderTop: "1px solid rgba(0,50,125,0.08)", padding: "48px 5vw" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ display: "flex", flexDirection: "column", gap: 32 }}
        >
          {/* Headline Bar */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: 24 }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: "var(--color-text-primary)", fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1, margin: 0, whiteSpace: "nowrap" }}>
              EVERY ISSUE. <span style={{ color: "var(--color-accent-blue)", textShadow: "0 0 20px rgba(0,50,125,0.35)" }}>VISIBLE.</span> ACCOUNTABLE.
            </h2>
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { label: "OPEN", val: issues.filter(i => i.status === 'open').length || 47, color: "#FF3B3B" },
                { label: "IN PROGRESS", val: issues.filter(i => i.status === 'in-progress').length || 23, color: "#FFB800" },
                { label: "RESOLVED", val: issues.filter(i => i.status === 'resolved').length || 189, color: "#00FF88" }
              ].map(stat => (
                <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,50,125,0.03)", border: "1px solid rgba(0,50,125,0.1)", padding: "8px 16px" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: stat.color, boxShadow: `0 0 8px ${stat.color}` }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--color-text-primary)", fontWeight: 600 }}>{stat.val}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, color: "var(--color-text-secondary)", letterSpacing: "0.1em" }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description Bar */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 32 }}>
            <p style={{ flex: "1 1 500px", fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>
              CivicPulse puts every reported issue on a public map. Nothing gets buried. No report disappears into a form black hole. Every citizen sees exactly what the city knows.
            </p>
            <motion.div whileHover={{ x: 8 }} style={{ flexShrink: 0 }}>
              <a href="#" style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13, color: "var(--color-accent-blue)", textDecoration: "none", letterSpacing: "0.2em", borderBottom: "2px solid rgba(0,50,125,0.3)", paddingBottom: 8, whiteSpace: "nowrap" }}>
                EXPLORE THE LIVE MAP <ArrowRight style={{ width: 16, height: 16 }} />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
