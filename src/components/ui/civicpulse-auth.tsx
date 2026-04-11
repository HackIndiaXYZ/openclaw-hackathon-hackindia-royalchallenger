"use client";

import * as React from "react";
import { Mail, Lock, ArrowRight, Landmark, ShieldCheck, Fingerprint, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function CivicPulseAuth() {
  const router = useRouter();
  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Check for existing session on mount
  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("Session check error:", sessionError);
          if (sessionError.message.toLowerCase().includes("refresh token")) {
            await supabase.auth.signOut();
            window.localStorage.removeItem("supabase.auth.token");
          }
        }
        if (session) {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Auth check failed", err);
      }
    };
    checkSession();
  }, [router]);

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
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-[#f0f4f8]">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="bg-[#f0f4f7]/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-10 md:p-12">
          {/* Building Icon Container */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 text-[#0047ab] rounded-full flex items-center justify-center shadow-inner">
              <Landmark className="w-8 h-8" strokeWidth={2.5} />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-[#1b1b25] tracking-tight mb-2">
              {mode === "login" ? "Sign In to CivicPulse" : "Join CivicPulse"}
            </h2>
            <p className="text-[#737784] font-medium leading-relaxed max-w-[280px] mx-auto text-sm">
              Access your city dashboard and manage your reports.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#434653] ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#737784]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-white/50 border border-slate-200 rounded-2xl pl-12 pr-4 text-[#1b1b25] placeholder:text-[#a0a4b0] focus:outline-none focus:ring-2 focus:ring-[#0047ab]/10 focus:border-[#0047ab] transition-all font-medium"
                  placeholder="name@agency.gov"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[13px] font-bold text-[#434653]">Password</label>
                <button type="button" className="text-[13px] font-bold text-[#0047ab] hover:underline transition-all">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#737784]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-white/50 border border-slate-200 rounded-2xl pl-12 pr-4 text-[#1b1b25] placeholder:text-[#a0a4b0] focus:outline-none focus:ring-2 focus:ring-[#0047ab]/10 focus:border-[#0047ab] transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center border border-red-100"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#0047ab] hover:bg-[#00378b] text-white rounded-full text-base font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Secure Gateway Separator */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#f0f4f7] px-4 font-bold tracking-widest text-[#737784]">Secure Gateway</span>
            </div>
          </div>

          {/* Government ID Button */}
          <button className="w-full h-14 bg-white/60 hover:bg-white text-[#434653] rounded-full text-sm font-bold border border-slate-200 transition-all flex items-center justify-center gap-2 mb-8 shadow-sm">
            <Fingerprint className="w-5 h-5 text-[#0047ab]" />
            Sign In with Government ID
          </button>

          {/* Footer Toggle */}
          <div className="text-center">
            <p className="text-[14px] text-[#737784] font-medium">
              {mode === "login" ? "New to the portal?" : "Already have an account?"}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="ml-1.5 font-bold text-[#0047ab] hover:underline"
              >
                {mode === "login" ? "Create Account" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
