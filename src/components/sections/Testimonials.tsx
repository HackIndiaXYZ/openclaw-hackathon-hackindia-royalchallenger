"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "I reported a massive pothole outside my apartment. Within 5 days it was fixed. First time I&apos;ve ever seen the system work this fast.",
    name: "Priya Sharma",
    city: "New Delhi",
    initials: "PS",
    category: "pothole",
    categoryColor: "#ba1a1a",
  },
  {
    quote: "The garbage situation in our colony was terrible. After 12 of us reported on CivicPulse, the municipal team showed up the next morning.",
    name: "Rahul Verma",
    city: "Gurugram",
    initials: "RV",
    category: "garbage",
    categoryColor: "#0047ab",
  },
  {
    quote: "As a journalist, this platform gives me data I couldn&apos;t get before. I can see which areas are neglected and hold authorities accountable.",
    name: "Ananya Roy",
    city: "Mumbai",
    initials: "AR",
    category: "data",
    categoryColor: "#2559bd",
  },
  {
    quote: "Street lights on our entire block were dead for months. One report on CivicPulse, and the electricity board fixed it within a week.",
    name: "Vikash Patel",
    city: "Ahmedabad",
    initials: "VP",
    category: "lighting",
    categoryColor: "#b1c5ff",
  },
  {
    quote: "The water leak near our school was creating a small flood every day. CivicPulse routed it directly to the water authority. Fixed in 3 days.",
    name: "Meera Nair",
    city: "Bengaluru",
    initials: "MN",
    category: "water",
    categoryColor: "#00327d",
  },
  {
    quote: "I love that everything is public. The municipality can&apos;t just ignore complaints anymore. The map shows exactly what&apos;s pending.",
    name: "Arjun Reddy",
    city: "Hyderabad",
    initials: "AR",
    category: "transparency",
    categoryColor: "#38684f",
  },
];

export default function Testimonials() {
  return (
    <section className="relative bg-bg-surface py-[80px] md:py-[100px] px-6 md:px-[8vw]">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2
            className="font-display font-extrabold text-text-primary leading-[1.1]"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            REAL PEOPLE.{" "}
            <span className="relative inline-block">
              REAL CHANGE.
              {/* Hand-drawn underline */}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                height="12"
              >
                <motion.path
                  d="M 0 8 Q 40 2, 80 6 Q 120 10, 160 4 Q 180 2, 200 6"
                  fill="none"
                  stroke="var(--color-accent-blue)"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </svg>
            </span>
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-bg-elevated border border-border-default rounded-[1.5rem] p-8 border-glow hover:shadow-[0_20px_40px_rgba(27,27,37,0.06)] transition-all duration-300"
            >
              {/* Category tag */}
              <span
                className="inline-block text-[10px] font-semibold tracking-[0.1em] px-2.5 py-1 rounded-full mb-4 uppercase"
                style={{
                  color: t.categoryColor,
                  backgroundColor: `${t.categoryColor}15`,
                  border: `1px solid ${t.categoryColor}30`,
                }}
              >
                {t.category}
              </span>

              {/* Quote */}
              <p className="font-body text-[16px] text-text-primary leading-[1.8] mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 flex items-center justify-center text-[13px] font-bold text-white rounded-full shadow-sm"
                  style={{ backgroundColor: t.categoryColor }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-body text-[14px] font-semibold text-text-primary">
                    {t.name}
                  </p>
                  <p className="font-body text-[12px] text-text-secondary">
                    {t.city} · <span className="text-accent-blue font-bold">Verified Reporter</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Bar */}
        <div className="flex items-center justify-center gap-3 mt-12">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill="#FFB800">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="font-data text-[13px] text-text-primary tracking-[0.05em]">
            4.8 · 500+ VERIFIED REPORTS RESOLVED
          </span>
        </div>
      </div>
    </section>
  );
}
