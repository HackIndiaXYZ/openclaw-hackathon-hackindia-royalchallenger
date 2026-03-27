"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, MapPin, User, LogOut, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "HOW IT WORKS", href: "#how-it-works" },
  { label: "LIVE MAP", href: "/dashboard" },
  { label: "REPORT ISSUE", href: "/report" },
  { label: "IMPACT", href: "#impact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  useEffect(() => {
    // Initial session check
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-[1000] h-[70px] flex items-center justify-between px-6 md:px-[4vw] transition-all duration-300 ${
          scrolled
            ? "bg-bg-base border-b border-[rgba(0,50,125,0.08)] shadow-[0_4px_24px_rgba(0,50,125,0.04)]"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" style={{ marginLeft: "24px" }}>
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent-blue text-white shadow-[0_4px_12px_rgba(0,85,255,0.25)]">
            <MapPin size={20} strokeWidth={2.5} />
          </div>
          <span className="font-display text-[22px] font-extrabold tracking-tight text-text-primary">
            CivicPulse <span className="text-accent-blue font-bold">AI</span>
          </span>
        </Link>

        {/* Center Nav — Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-body text-[12px] font-medium tracking-[0.15em] text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right — CTA + Auth + Hamburger */}
        <div className="flex items-center gap-6 mr-4 lg:mr-10">
          <div className="hidden md:flex items-center gap-6 relative">
            {!user ? (
              <Link
                href="/auth"
                style={{ padding: "12px 28px" }}
                className="inline-flex font-body text-[13px] font-bold tracking-wide bg-accent-blue text-white rounded-lg shadow-[0_4px_12px_rgba(0,85,255,0.2)] hover:bg-accent-blue/90 hover:-translate-y-0.5 transition-all duration-200"
              >
                Sign In
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 font-body text-[13px] font-semibold text-text-primary hover:text-accent-blue transition-colors px-4 py-2.5 rounded-lg bg-bg-surface border border-border-default shadow-sm"
                >
                  <User size={16} />
                  <span>{user.user_metadata?.full_name || "Citizen"}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-bg-surface border border-border-default rounded-xl shadow-[0_8px_32px_rgba(0,50,125,0.1)] p-2 z-[9999] overflow-hidden"
                    >
                      <Link
                        href="/my-reports"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-bold text-text-secondary hover:text-text-primary hover:bg-bg-base rounded-lg transition-colors"
                      >
                        My Reports
                      </Link>
                      <div className="h-[1px] w-full bg-border-subtle my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                      >
                        <LogOut size={14} />
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-text-primary"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[2000] bg-bg-base retro-grid flex flex-col items-center justify-center p-6"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-6 text-text-primary font-data text-[13px] tracking-[0.2em] flex items-center gap-2 hover:text-accent-cyan transition-colors"
              aria-label="Close menu"
            >
              CLOSE <X size={18} />
            </button>

            <div className="flex flex-col items-center gap-6 text-center">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-[32px] font-black text-text-primary hover:text-accent-cyan transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-4 mt-8 w-full max-w-xs"
              >
                {!user ? (
                  <Link
                    href="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex font-body text-[15px] justify-center font-bold bg-accent-blue text-white py-3.5 rounded-lg shadow-[0_4px_12px_rgba(0,85,255,0.2)] hover:bg-accent-blue/90 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-3 text-text-primary mb-2 font-body font-semibold">
                      <User size={20} />
                      {user.user_metadata?.full_name || "Citizen"}
                    </div>
                    <Link
                      href="/my-reports"
                      onClick={() => setMobileOpen(false)}
                      className="font-body text-[15px] font-semibold border border-border-strong text-text-primary py-3.5 rounded-lg text-center hover:bg-bg-surface transition-colors"
                    >
                      My Reports
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="font-body text-[15px] font-semibold border border-red-500/20 bg-red-500/10 text-red-500 py-3.5 rounded-lg text-center hover:bg-red-500/20 transition-colors"
                    >
                      Log Out
                    </button>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
