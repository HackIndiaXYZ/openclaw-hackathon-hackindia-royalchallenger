"use client";

import * as React from "react";
import { Mail, Lock, ArrowRight, Landmark, Fingerprint, Loader2 } from "lucide-react";
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
          // Redirect to mainpage as requested
          router.push("/");
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
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (signUpError) throw signUpError;
      }
      // Redirect to mainpage as requested
      router.push("/");
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#e5e9ef]">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-100/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[460px] z-10"
      >
        <div className="bg-[#f0f2f5] border border-white/60 shadow-xl rounded-[2.5rem] p-8 md:p-12">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-[#dee6f0] text-[#1a4fa0] rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Landmark className="w-7 h-7" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1b1b25] tracking-tight mb-3">
              {mode === "login" ? "Sign In to CivicPulse" : "Create Account"}
            </h2>
            <p className="text-[#737784] font-medium text-center leading-relaxed max-w-[300px] text-sm md:text-base">
              Access your city dashboard and manage your reports.
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#434653] ml-1 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a4b0]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-[#f8f9fb] border border-slate-200 rounded-2xl pl-12 pr-4 text-[#1b1b25] placeholder:text-[#a0a4b0] focus:outline-none focus:ring-2 focus:ring-[#1a4fa0]/10 focus:border-[#1a4fa0] transition-all font-medium"
                  placeholder="name@agency.gov"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[13px] font-bold text-[#434653] uppercase tracking-wide">
                  Password
                </label>
                <button type="button" className="text-[12px] font-bold text-[#1a4fa0] hover:underline transition-all">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a4b0]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-[#f8f9fb] border border-slate-200 rounded-2xl pl-12 pr-4 text-[#1b1b25] placeholder:text-[#a0a4b0] focus:outline-none focus:ring-2 focus:ring-[#1a4fa0]/10 focus:border-[#1a4fa0] transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center border border-red-100 overflow-hidden"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#1a4fa0] hover:bg-[#154185] text-white rounded-full text-base font-bold shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Get Started"}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Separator Section */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-[#f0f2f5] px-4 font-bold tracking-widest text-[#a0a4b0]">Secure Gateway</span>
            </div>
          </div>

          {/* Social/Government ID Section */}
          <button className="w-full h-14 bg-[#f8f9fb] hover:bg-[#f2f4f7] text-[#434653] border border-slate-200 rounded-full text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-3 mb-8 group">
            <Fingerprint className="w-5 h-5 text-[#1a4fa0] transition-transform group-hover:scale-110" />
            Sign In with Government ID
          </button>

          {/* Footer Section */}
          <div className="text-center">
            <p className="text-[14px] text-[#737784] font-medium">
              {mode === "login" ? "New to the portal?" : "Already have an account?"}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="ml-2 font-bold text-[#1a4fa0] hover:underline"
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
