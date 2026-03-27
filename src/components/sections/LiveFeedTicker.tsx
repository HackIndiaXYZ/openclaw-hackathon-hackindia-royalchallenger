"use client";

const tickerItems = [
  { category: "pothole", icon: "🕳️", area: "Karol Bagh", summary: "Large pothole on main road near metro station", time: "3 min ago", severity: "high" },
  { category: "garbage", icon: "🗑️", area: "Connaught Place", summary: "Overflowing garbage bins on Janpath Lane", time: "7 min ago", severity: "medium" },
  { category: "lighting", icon: "💡", area: "Lajpat Nagar", summary: "Street light not working near Central Market", time: "12 min ago", severity: "low" },
  { category: "water", icon: "💧", area: "Dwarka Sec 10", summary: "Water pipeline leak flooding the sidewalk", time: "18 min ago", severity: "critical" },
  { category: "road_damage", icon: "🚧", area: "Saket", summary: "Road surface cracked after heavy rain", time: "25 min ago", severity: "medium" },
  { category: "garbage", icon: "🗑️", area: "Rohini Sec 3", summary: "Construction debris dumped on residential road", time: "31 min ago", severity: "high" },
  { category: "flooding", icon: "🌊", area: "Moti Bagh", summary: "Waterlogging near underpass after rainfall", time: "42 min ago", severity: "critical" },
  { category: "lighting", icon: "💡", area: "Vasant Kunj", summary: "Multiple street lights flickering on D-Block", time: "55 min ago", severity: "low" },
];

const severityColors: Record<string, string> = {
  critical: "#FF3B3B",
  high: "#FF3B3B",
  medium: "#FFB800",
  low: "#00FF88",
};

export default function LiveFeedTicker() {
  const items = [...tickerItems, ...tickerItems]; // duplicate for seamless loop

  return (
    <div className="w-full h-[48px] bg-bg-surface border-t border-b border-border-subtle flex items-center overflow-hidden">
      {/* LIVE FEED label */}
      <div className="flex-shrink-0 flex items-center gap-2 px-5 border-r border-border-subtle h-full">
        <span className="led bg-accent-cyan" />
        <span className="font-data text-[10px] text-accent-cyan tracking-[0.3em]">
          LIVE FEED
        </span>
      </div>

      {/* Scrolling Ticker */}
      <div className="flex-1 overflow-hidden relative">
        <div className="ticker-scroll flex items-center gap-0 whitespace-nowrap">
          {items.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-4">
              <span
                className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                style={{ backgroundColor: severityColors[item.severity] || "#7A8BAD" }}
              />
              <span className="text-[13px]">{item.icon}</span>
              <span className="font-data text-[12px] text-text-secondary">
                <span className="text-text-primary font-medium">{item.area}</span>
                {" — "}
                {item.summary}
                <span className="text-text-muted ml-2">· {item.time}</span>
              </span>
              <span className="text-accent-cyan mx-3 text-[10px]">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
