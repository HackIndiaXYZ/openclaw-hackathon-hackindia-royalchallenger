"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const words = ["YOUR", "CITY", "NEEDS", "YOU."];

export default function CallToAction() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-bg-base scanlines">
      {/* Retro Grid */}
      <div className="absolute inset-0 retro-grid opacity-40" />

      {/* Radial Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
        style={{
          background: "radial-gradient(ellipse, rgba(0,50,125,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Corner L-accents */}
      {/* Top-left */}
      <div className="absolute top-8 left-8">
        <div className="w-[40px] h-[1px] bg-accent-cyan opacity-30" />
        <div className="w-[1px] h-[40px] bg-accent-cyan opacity-30" />
      </div>
      {/* Top-right */}
      <div className="absolute top-8 right-8 flex flex-col items-end">
        <div className="w-[40px] h-[1px] bg-accent-cyan opacity-30" />
        <div className="w-[1px] h-[40px] bg-accent-cyan opacity-30 self-end" />
      </div>
      {/* Bottom-left */}
      <div className="absolute bottom-8 left-8 flex flex-col justify-end">
        <div className="w-[1px] h-[40px] bg-accent-cyan opacity-30" />
        <div className="w-[40px] h-[1px] bg-accent-cyan opacity-30" />
      </div>
      {/* Bottom-right */}
      <div className="absolute bottom-8 right-8 flex flex-col items-end justify-end">
        <div className="w-[1px] h-[40px] bg-accent-cyan opacity-30 self-end" />
        <div className="w-[40px] h-[1px] bg-accent-cyan opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-data text-[11px] text-accent-cyan tracking-[0.5em] mb-8"
        >
          THE CHOICE
        </motion.p>

        <div ref={ref} className="mb-4 flex flex-wrap justify-center gap-x-[0.35em]">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 80 }}
              className="font-display font-extrabold text-text-primary leading-[1.1]"
              style={{ fontSize: "clamp(48px, 8vw, 100px)" }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        <motion.span
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, type: "spring", stiffness: 80 }}
          className="block font-display font-extrabold text-accent-cyan crt-glow glitch leading-[1.1] mb-8"
          style={{ fontSize: "clamp(48px, 8vw, 100px)" }}
        >
          NOW.
        </motion.span>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="font-body text-[18px] text-text-secondary max-w-[480px] mx-auto leading-[1.8] mb-12"
        >
          Stop watching problems pile up. One photo. 30 seconds. Real impact.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <Link
            href="/report"
            className="font-display text-[14px] font-bold tracking-[0.15em] bg-accent-cyan text-bg-base px-12 py-5 shine-sweep hover:shadow-[0_0_40px_rgba(0,50,125,0.3)] transition-all duration-200"
          >
            START REPORTING
          </Link>
          <Link
            href="/dashboard"
            className="font-display text-[14px] font-bold tracking-[0.15em] text-accent-cyan border border-[rgba(0,50,125,0.2)] px-12 py-5 hover:border-accent-cyan hover:shadow-[0_0_20px_rgba(0,50,125,0.15)] transition-all duration-200"
          >
            VIEW THE MAP
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="font-data text-[11px] text-text-muted tracking-[0.2em]"
        >
          FREE · OPEN TO ALL CITIZENS · NO ACCOUNT REQUIRED TO VIEW
        </motion.p>
      </div>
    </section>
  );
}
