import Link from "next/link";

const platformLinks = [
  { label: "Live Map", href: "/dashboard" },
  { label: "Report Issue", href: "/report" },
  { label: "My Reports", href: "/my-reports" },
  { label: "How It Works", href: "#how-it-works" },
];

const dataLinks = [
  { label: "API Docs", href: "#" },
  { label: "Area Scores", href: "#" },
  { label: "Issue Feed", href: "#" },
  { label: "Download Data", href: "#" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Contact", href: "#" },
];

function Led({ color = "var(--color-accent-blue)", size = 8 }: { color?: string; size?: number }) {
  return (
    <span
      style={{ width: size, height: size, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0, boxShadow: `0 0 8px ${color}` }}
    />
  );
}

export default function Footer() {
  return (
    <footer style={{ background: "var(--color-bg-base)", borderTop: "1px solid rgba(0,50,125,0.08)", padding: "64px 5vw 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-12">
          <div className="col-span-1 md:col-span-4 lg:col-span-2">
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: "var(--color-text-primary)" }}>CIVIC</span>
              <Led color="var(--color-accent-blue)" size={8} />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: "var(--color-accent-blue)", textShadow: "none" }}>PULSE</span>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-text-secondary)", marginTop: 12, marginBottom: 8 }}>AI-powered civic accountability.</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--color-text-muted)" }}>Built for OpenClaw Hackathon · HackIndia 2026</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
              <Led color="var(--color-accent-green)" size={7} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--color-accent-green)", letterSpacing: "0.2em" }}>SYSTEM OPERATIONAL</span>
            </div>
          </div>
          {[
            { heading: "PLATFORM", links: ["Live Map", "Report Issue", "My Reports", "How It Works"] },
            { heading: "OPEN DATA", links: ["Area Scores", "Issue Feed", "API Docs", "Download Data"] },
            { heading: "LEGAL", links: ["Privacy Policy", "Terms of Service", "Contact"] },
          ].map((col) => (
            <div key={col.heading}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.5em", color: "var(--color-accent-blue)", textTransform: "uppercase", marginBottom: 16 }}>{col.heading}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map((link) => (
                  <Link key={link} href="#" style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-text-secondary)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--color-text-primary)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-secondary)")}
                  >{link}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(0,50,125,0.06)", paddingTop: 32, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--color-text-muted)" }}>© 2026 CIVICPULSE AI — ALL RIGHTS RESERVED</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--color-text-muted)" }}>OPEN SOURCE · BUILT IN INDIA 🇮🇳</span>
        </div>
      </div>
    </footer>
  );
}
