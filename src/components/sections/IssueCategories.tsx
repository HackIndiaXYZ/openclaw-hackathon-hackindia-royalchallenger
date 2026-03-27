"use client";

import { motion } from "framer-motion";

const categories = [
  { name: "POTHOLES", icon: "🕳️", color: "#FF3B3B", count: "1,243", resolved: 72 },
  { name: "GARBAGE", icon: "🗑️", color: "#FFB800", count: "987", resolved: 65 },
  { name: "LIGHTING", icon: "💡", color: "#FFD700", count: "654", resolved: 81 },
  { name: "WATER", icon: "💧", color: "var(--color-accent-blue)", count: "432", resolved: 58 },
  { name: "ROAD DAMAGE", icon: "🚧", color: "#FF6B35", count: "321", resolved: 44 },
  { name: "FLOODING", icon: "🌊", color: "#7B61FF", count: "198", resolved: 37 },
];

export default function IssueCategories() {
  return (
    <section id="impact" className="relative bg-bg-surface py-[80px] md:py-[100px] px-6 md:px-[8vw]">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-data text-[11px] text-accent-cyan tracking-[0.4em] mb-4"
        >
          ISSUE CATEGORIES
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-extrabold text-text-primary mb-14 leading-[1.1]"
          style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
        >
          WHAT YOUR CITY
          <br />
          <span className="text-accent-cyan crt-glow">IS FACING.</span>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 20 }}
              whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="relative bg-bg-elevated border border-border-subtle p-6 md:p-8 overflow-hidden group transition-all duration-300 hover:border-border-strong"
              style={{
                borderTopColor: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderTopColor = cat.color;
                (e.currentTarget as HTMLDivElement).style.borderTopWidth = "3px";
                (e.currentTarget as HTMLDivElement).style.backgroundColor = `${cat.color}08`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderTopColor = "transparent";
                (e.currentTarget as HTMLDivElement).style.borderTopWidth = "1px";
                (e.currentTarget as HTMLDivElement).style.backgroundColor = "";
              }}
            >
              {/* Icon */}
              <span className="text-[40px] block mb-4 group-hover:scale-110 transition-transform duration-300 origin-left">
                {cat.icon}
              </span>

              {/* Name */}
              <h3 className="font-display text-[18px] md:text-[22px] font-bold text-text-primary mb-1 group-hover:-translate-y-0.5 transition-transform duration-300">
                {cat.name}
              </h3>

              {/* Count */}
              <p className="font-data text-[12px] text-text-muted tracking-[0.05em] mb-4">
                {cat.count} reports
              </p>

              {/* Resolved bar */}
              <div className="w-full h-[3px] bg-bg-base overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${cat.resolved}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
              <p className="font-data text-[10px] text-text-muted mt-1.5 tracking-[0.05em]">
                {cat.resolved}% resolved
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
