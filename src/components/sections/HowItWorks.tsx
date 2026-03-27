"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Camera, Cpu, MapPin, CheckCircle } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Camera,
    iconColor: "var(--color-accent-blue)",
    title: "Capture the Issue",
    body: "Take a photo directly in the app or upload from your gallery. GPS location auto-detected.",
    accentColor: "var(--color-accent-blue)",
  },
  {
    num: "02",
    icon: Cpu,
    iconColor: "#7B61FF",
    title: "AI Classifies Instantly",
    body: "Claude AI reads your photo and description — auto-assigns category, severity level, and responsible department in under 3 seconds.",
    accentColor: "#7B61FF",
  },
  {
    num: "03",
    icon: MapPin,
    iconColor: "#00FF88",
    title: "Goes Live on the Map",
    body: "Your report appears on the real-time public dashboard. Every citizen can see it. No more lost forms.",
    accentColor: "#00FF88",
  },
  {
    num: "04",
    icon: CheckCircle,
    iconColor: "#FFB800",
    title: "Track to Resolution",
    body: "Get status updates as your issue moves from open → in-progress → resolved. The city is accountable now.",
    accentColor: "#FFB800",
  },
];

const titleWords = ["FROM", "SNAP", "TO", "RESOLUTION."];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      id="how-it-works"
      className="relative bg-bg-base py-[100px] md:py-[120px] px-6 md:px-[8vw] retro-grid"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-data text-[11px] text-accent-cyan tracking-[0.4em] mb-4"
        >
          SYSTEM OVERVIEW
        </motion.p>

        {/* Section Heading — word by word */}
        <div ref={ref} className="mb-16 flex flex-wrap gap-x-[0.3em]">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 80 }}
              className={`font-display font-extrabold leading-[1.1] ${
                word === "RESOLUTION."
                  ? "text-accent-cyan crt-glow"
                  : "text-text-primary"
              }`}
              style={{ fontSize: "clamp(40px, 6vw, 80px)" }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-[50%] left-0 right-0 h-[1px] border-t border-dashed border-[rgba(0,50,125,0.15)] -translate-y-1/2 z-0" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 80 }}
                className="relative z-10 bg-bg-surface border border-border-subtle p-8 group hover:border-border-strong transition-all duration-300"
                style={{
                  boxShadow: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px ${step.accentColor}10`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                {/* Step Number */}
                <span className="absolute top-4 right-4 font-data text-[11px] text-text-muted tracking-[0.2em]">
                  {step.num}
                </span>

                {/* Icon */}
                <Icon
                  size={28}
                  style={{ color: step.iconColor }}
                  className="mb-5 group-hover:scale-110 transition-transform duration-300"
                />

                {/* Title */}
                <h3 className="font-display text-[22px] font-bold text-text-primary mb-3">
                  {step.title}
                </h3>

                {/* Body */}
                <p className="font-body text-[15px] text-text-secondary leading-[1.7]">
                  {step.body}
                </p>

                {/* Accent Line */}
                <div
                  className="w-10 h-[2px] mt-6"
                  style={{ backgroundColor: step.accentColor }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
