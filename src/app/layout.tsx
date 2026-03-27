import type { Metadata } from "next";
import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CivicPulse AI — Your City. Your Voice. AI-Powered.",
  description:
    "AI-powered hyperlocal civic issue reporting. Snap a photo, AI classifies the issue, and it appears live on a public map. Track resolution and hold your city accountable.",
  keywords: [
    "civic reporting",
    "AI",
    "city issues",
    "pothole reporting",
    "smart city",
    "civic health",
  ],
  openGraph: {
    title: "CivicPulse AI",
    description:
      "Snap a photo. AI identifies the issue. Your city becomes accountable.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-bg-base text-text-primary">
        <Navbar />
        <main className="pt-[70px]">
          {children}
        </main>
      </body>
    </html>
  );
}
