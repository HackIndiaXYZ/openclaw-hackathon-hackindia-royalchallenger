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
  const [forgotLoading, setForgotLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);

  const getDisplayNameFromEmail = (value: string) => {
    const localPart = value.split("@")[0] || "Citizen";
    return localPart
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

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
          router.replace("/");
          router.refresh();
        }
      } catch (err) {
        console.error("Auth check failed", err);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.replace("/");
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

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
            data: {
              full_name: getDisplayNameFromEmail(email),
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (signUpError) throw signUpError;
      }
      router.replace("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email address first to reset password.");
      setInfo(null);
      return;
    }

    setForgotLoading(true);
    setError(null);
    setInfo(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (resetError) throw resetError;
      setInfo("Password reset link sent. Check your email inbox.");
    } catch (err: any) {
      setError(err.message || "Unable to send reset email.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-3 sm:p-4 bg-[#dde5df]">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-130px] right-[-180px] w-[560px] h-[560px] bg-[#8aa18a]/28 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-180px] left-[-120px] w-[520px] h-[520px] bg-[#c4d1e8]/35 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[286px] z-10"
      >
        <div className="bg-[#eceff3] border border-white/80 shadow-[0_18px_52px_rgba(22,40,74,0.2)] rounded-[10px] px-6 py-7">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-[52px] h-[52px] bg-[#d0dced] text-[#1b4ea2] rounded-full flex items-center justify-center mb-5 shadow-sm">
              <Landmark className="w-[21px] h-[21px]" strokeWidth={2.4} />
            </div>
            <h2 className="text-[28px] leading-[1.1] font-extrabold text-[#18253f] tracking-[-0.02em] mb-2 text-center font-display">
              {mode === "login" ? "Sign In to CivicPulse" : "Create Account"}
            </h2>
            <p className="text-[#6f788b] font-semibold text-center leading-[1.45] max-w-[230px] text-[12px]">
              Access your city dashboard and manage your reports.
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#60697a] ml-1 tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ba4b4]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[42px] bg-[#f7f9fc] border border-slate-200 rounded-full pl-11 pr-4 text-[#1b1b25] placeholder:text-[#a0a4b0] focus:outline-none focus:ring-2 focus:ring-[#1a4fa0]/10 focus:border-[#1a4fa0] transition-all font-medium text-[14px]"
                  placeholder="name@agency.gov"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold text-[#60697a] tracking-wide">
                  Password
                </label>
                <button type="button" onClick={handleForgotPassword} disabled={forgotLoading} className="text-[11px] font-bold text-[#1a4fa0] hover:underline transition-all disabled:opacity-60">
                  {forgotLoading ? "Sending..." : "Forgot Password?"}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ba4b4]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[42px] bg-[#f7f9fc] border border-slate-200 rounded-full pl-11 pr-4 text-[#1b1b25] placeholder:text-[#a0a4b0] focus:outline-none focus:ring-2 focus:ring-[#1a4fa0]/10 focus:border-[#1a4fa0] transition-all font-medium text-[14px]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {info && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl text-center border border-emerald-100 overflow-hidden"
                >
                  {info}
                </motion.div>
              )}
            </AnimatePresence>

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
              className="w-full h-[46px] bg-[#0f4ba9] hover:bg-[#0e4497] text-white rounded-full text-[16px] font-bold shadow-[0_8px_18px_rgba(18,75,169,0.35)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-1"
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
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-[#edf0f4] px-4 font-bold tracking-widest text-[#a0a4b0]">Secure Gateway</span>
            </div>
          </div>

          {/* Social/Government ID Section */}
          <button className="w-full h-[42px] bg-[#f7f9fc] hover:bg-[#f2f4f7] text-[#434653] border border-slate-200 rounded-full text-[14px] font-bold transition-all shadow-sm flex items-center justify-center gap-2.5 mb-6 group">
            <Fingerprint className="w-4 h-4 text-[#1a4fa0] transition-transform group-hover:scale-110" />
            Sign In with Government ID
          </button>

          {/* Footer Section */}
          <div className="text-center">
            <p className="text-[13px] text-[#737784] font-medium">
              {mode === "login" ? "New to the portal?" : "Already have an account?"}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="ml-1.5 font-bold text-[#1a4fa0] hover:underline"
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
