"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const areas = [
  { rank: 1, name: "Vasant Vihar", score: 89, trend: "up" },
  { rank: 2, name: "Defence Colony", score: 82, trend: "up" },
  { rank: 3, name: "Dwarka Sec 7", score: 68, trend: "down" },
  { rank: 4, name: "Karol Bagh", score: 54, trend: "down" },
  { rank: 5, name: "Rohini Sec 3", score: 41, trend: "down" },
];

function getScoreColor(score: number) {
  if (score >= 80) return "#00FF88";
  if (score >= 50) return "#FFB800";
  return "#FF3B3B";
}

function AnimatedScore({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = target / (1500 / 16);
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
  }, [inView, target]);

  return <span ref={ref}>{count}</span>;
}

export default function CivicHealthScore() {
  const mainScore = 73;
  const scoreColor = getScoreColor(mainScore);
  const arcRef = useRef(null);
  const arcInView = useInView(arcRef, { once: true });
  const [showCalc, setShowCalc] = useState(false);

  // SVG Arc parameters
  const cx = 150, cy = 150, r = 120;
  const startAngle = 210; // 7 o'clock
  const endAngle = -30;   // 5 o'clock (330° = -30° for sweep)
  const sweepAngle = 270;
  const filledAngle = (mainScore / 100) * sweepAngle;

  function describeArc(startDeg: number, sweepDeg: number) {
    const startRad = (startDeg * Math.PI) / 180;
    const endRad = ((startDeg - sweepDeg) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy - r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy - r * Math.sin(endRad);
    const largeArc = sweepDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2}`;
  }

  const trackPath = describeArc(startAngle, sweepAngle);
  const fillPath = describeArc(startAngle, filledAngle);

  // Calculate circumference for animation
  const circumference = (sweepAngle / 360) * 2 * Math.PI * r;
  const filledLen = (filledAngle / 360) * 2 * Math.PI * r;

  return (
    <section className="relative bg-bg-base py-[100px] md:py-[120px] px-6 md:px-[8vw]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-[8vw]">
        {/* Left — Score Gauge */}
        <motion.div
          ref={arcRef}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center"
        >
          <svg width="300" height="300" viewBox="0 0 300 300" className="mb-6">
            {/* Outer dashed ring */}
            <circle
              cx={cx} cy={cy} r={r + 15}
              fill="none"
              stroke="rgba(0,50,125,0.08)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
            {/* Track */}
            <path
              d={trackPath}
              fill="none"
              stroke="rgba(0,50,125,0.08)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Filled arc */}
            <path
              d={fillPath}
              fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 8px ${scoreColor}66)`,
                strokeDasharray: filledLen,
                strokeDashoffset: arcInView ? 0 : filledLen,
                transition: "stroke-dashoffset 1.5s ease-out",
              }}
            />
            {/* Tick marks */}
            {Array.from({ length: 11 }).map((_, i) => {
              const angle = ((startAngle - (i * sweepAngle) / 10) * Math.PI) / 180;
              const x1 = cx + (r - 12) * Math.cos(angle);
              const y1 = cy - (r - 12) * Math.sin(angle);
              const x2 = cx + (r - 4) * Math.cos(angle);
              const y2 = cy - (r - 4) * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="rgba(0,50,125,0.2)"
                  strokeWidth="1"
                />
              );
            })}
            {/* Center score */}
            <text x={cx} y={cy - 5} textAnchor="middle" fontSize="64" fontFamily="var(--font-mono), monospace" fontWeight="500" fill={scoreColor}>
              <AnimatedScore target={mainScore} />
            </text>
            <text x={cx} y={cy + 22} textAnchor="middle" fontSize="16" fontFamily="var(--font-body), sans-serif" fill="#7A8BAD">
              /100
            </text>
          </svg>
          <p className="font-display text-[18px] font-medium text-text-primary">
            New Delhi Central
          </p>
        </motion.div>

        {/* Right — Leaderboard */}
        <div>
          <p className="font-data text-[11px] text-accent-cyan tracking-[0.4em] mb-6">
            AREA RANKINGS
          </p>

          <div className="flex flex-col gap-3">
            {areas.map((area, i) => {
              const color = getScoreColor(area.score);
              return (
                <motion.div
                  key={area.name}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 bg-bg-surface border border-border-subtle px-6 py-4 hover:border-border-strong transition-all duration-300"
                >
                  <span className="font-data text-[13px] text-text-muted w-6">
                    {String(area.rank).padStart(2, "0")}
                  </span>
                  <span className="font-body text-[16px] font-semibold text-text-primary flex-1">
                    {area.name}
                  </span>
                  {/* Mini bar */}
                  <div className="w-16 h-[4px] bg-bg-elevated rounded-none overflow-hidden">
                    <div
                      className="h-full transition-all duration-700"
                      style={{
                        width: `${area.score}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                  <span
                    className="font-data text-[20px] w-10 text-right"
                    style={{ color }}
                  >
                    {area.score}
                  </span>
                  {area.trend === "up" ? (
                    <TrendingUp size={16} className="text-accent-green" />
                  ) : (
                    <TrendingDown size={16} className="text-accent-red" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Expandable explanation */}
          <button
            onClick={() => setShowCalc(!showCalc)}
            className="mt-6 font-data text-[11px] text-text-muted tracking-[0.1em] hover:text-accent-cyan transition-colors"
          >
            {showCalc ? "▲" : "▼"} HOW IS THIS CALCULATED?
          </button>
          {showCalc && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 font-body text-[14px] text-text-secondary leading-[1.7]"
            >
              Score = (Resolved Issues / Total Issues) × 100, weighted by severity
              and recency. Areas with faster resolution times and fewer critical
              open issues score higher.
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
