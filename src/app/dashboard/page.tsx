"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Footer from "@/components/sections/Footer";
import { LayoutGrid, Map as MapIcon, Filter, Search, ArrowUpRight, Clock, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getStatusColor, getSeverityColor } from "@/lib/utils";

const MapClient = dynamic(() => import("@/components/sections/MapClient"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#05080F] flex items-center justify-center font-data text-accent-cyan animate-pulse">BOOTING PROJECTOR...</div>
});

export default function DashboardPage() {
  const [view, setView] = useState<"map" | "grid">("map");
  const [issues, setIssues] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch issues
        const { data: issuesData } = await supabase
          .from("issues")
          .select("*")
          .order("created_at", { ascending: false });
        
        // Fetch area scores
        const { data: scoresData } = await supabase
          .from("area_scores")
          .select("*")
          .order("score", { ascending: false });

        if (issuesData) setIssues(issuesData);
        if (scoresData) setStats(scoresData);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    // Realtime subscription
    const channel = supabase
      .channel("schema-db-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "issues" }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const openCount = issues.filter(i => i.status === 'open').length;
  const inProgressCount = issues.filter(i => i.status === 'in-progress').length;
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;

  return (
    <>
      <div className="h-[60vh] md:h-[calc(100vh-120px)] min-h-[400px] mb-8 w-full mt-6 relative z-10 border-y border-[rgba(0,120,255,0.15)] bg-bg-surface">
        <MapClient issues={issues} />
      </div>
      <Footer />
    </>
  );
}
