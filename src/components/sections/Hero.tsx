"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

function CountUp({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

const words1 = ["YOUR", "CITY", "HAS"];
const words2 = ["A", "VOICE", "NOW."];

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden scanlines bg-bg-base">
      {/* Retro Perspective Grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,50,125,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,50,125,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: "perspective(800px) rotateX(60deg)",
          transformOrigin: "center 120%",
        }}
      />

      {/* Radial Cyan Glow */}
      <div
        className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(0,50,125,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Floating Particles */}
      {mounted && Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[3px] h-[3px] bg-accent-blue rounded-full opacity-30"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -20 - Math.random() * 30, 0],
            opacity: [0.1, 0.5, 0.1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Eyebrow Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 font-data text-[11px] text-accent-cyan tracking-[0.2em] border border-border-strong px-4 py-1.5 mb-8"
        >
          LIVE <span className="led bg-accent-blue" /> CITYWIDE REPORTING SYSTEM
        </motion.div>

        {/* Main Headline */}
        <div className="mb-4">
          <div className="flex flex-wrap justify-center gap-x-[0.35em]">
            {words1.map((word, i) => (
              <motion.span
                key={`w1-${i}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 100 }}
                className="font-display font-extrabold text-text-primary leading-[1.1]"
                style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-[0.35em]">
            {words2.map((word, i) => (
              <motion.span
                key={`w2-${i}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.54 + i * 0.08, type: "spring", stiffness: 100 }}
                className={`font-display font-extrabold text-accent-blue crt-glow leading-[1.1] ${word === "VOICE" ? "glitch" : ""
                  }`}
                style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Powered by AI */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="font-data text-[14px] text-text-secondary mb-6 cursor-blink"
        >
          Powered by AI
        </motion.p>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="font-body text-[18px] text-text-secondary max-w-[560px] mx-auto leading-[1.8] mb-10"
        >
          Snap a photo. AI identifies the issue, classifies severity, and routes
          it to the right department — automatically.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <Link
            href="/report"
            className="font-display text-[14px] font-bold tracking-[0.15em] bg-accent-blue text-white px-8 py-4 rounded-full shine-sweep hover:bg-accent-purple hover:shadow-[0_20px_40px_rgba(27,27,37,0.08)] transition-all duration-200"
          >
            REPORT AN ISSUE
          </Link>
          <Link
            href="/dashboard"
            className="font-display text-[14px] font-bold tracking-[0.15em] text-accent-blue border border-border-strong px-8 py-4 rounded-full hover:bg-bg-elevated hover:border-accent-blue hover:shadow-[0_20px_40px_rgba(27,27,37,0.06)] transition-all duration-200"
          >
            VIEW LIVE MAP →
          </Link>
        </motion.div>

        {/* Live Stats Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center divide-y sm:divide-y-0 sm:divide-x divide-border-subtle"
        >
          <div className="flex flex-col items-center px-8 py-4 sm:py-0">
            <div className="flex items-center gap-2">
              <span className="led bg-accent-blue" />
              <span className="font-data text-[28px] text-text-primary">
                <CountUp target={2847} />+
              </span>
            </div>
            <span className="font-body text-[11px] text-text-secondary tracking-[0.15em]">
              ISSUES REPORTED
            </span>
          </div>
          <div className="flex flex-col items-center px-8 py-4 sm:py-0">
            <div className="flex items-center gap-2">
              <span className="led bg-accent-green" />
              <span className="font-data text-[28px] text-text-primary">
                <CountUp target={142} />
              </span>
            </div>
            <span className="font-body text-[11px] text-text-secondary tracking-[0.15em]">
              RESOLVED TODAY
            </span>
          </div>
          <div className="flex flex-col items-center px-8 py-4 sm:py-0">
            <div className="flex items-center gap-2">
              <span className="led bg-accent-amber" />
              <span className="font-data text-[28px] text-text-primary">
                <CountUp target={73} />/100
              </span>
            </div>
            <span className="font-body text-[11px] text-text-secondary tracking-[0.15em]">
              CITY SCORE
            </span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 2 }, y: { repeat: Infinity, duration: 2 } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-data text-[10px] text-text-muted tracking-[0.3em] rotate-90 origin-center translate-y-4">
          SCROLL
        </span>
        <div className="w-[2px] h-[48px] bg-accent-blue opacity-40" />
      </motion.div>
    </section>
  );
}
