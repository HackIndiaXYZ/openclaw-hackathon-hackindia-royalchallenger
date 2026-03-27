# 🏙️ CivicPulse AI

> **AI-powered civic issue reporting platform** — Built for the OpenClaw Hackathon @ HackIndia

[![OpenClaw Hackathon](https://img.shields.io/badge/OpenClaw-HackIndia-blue?style=for-the-badge)](https://hackindia.xyz)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com)

---

## 🎥 Demo Video

**👉 [Watch the Demo on LinkedIn](https://www.linkedin.com/posts/bingidineshkumar18_openclawhackathon-hackindia-24hourhackathon-ugcPost-7443256808019828736-7m_w?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFTRObMBqDe-RsBzglkKQbLnzvIV4pJ3ILQ)**

> Click the link above to see CivicPulse AI in action — from reporting a civic issue to AI-powered classification and real-time map tracking.

---

## 🚀 What is CivicPulse AI?

CivicPulse AI is a next-generation civic engagement platform that empowers citizens to report local issues (potholes, broken streetlights, garbage overflow, etc.) using an AI-powered interface. Reports are automatically classified, routed to the appropriate government department, and tracked in real-time on an interactive map.

### ✨ Key Features

- **📸 AI-Powered Issue Classification** — Upload a photo and let AI automatically detect and categorize the civic issue
- **📍 Real-Time Issue Map** — Live map showing all reported issues across the city with Supabase Realtime
- **📊 My Reports Dashboard** — Track the status of your submitted reports end-to-end
- **🏛️ Department Routing** — Auto-assigns reports to the correct government department
- **🔐 Secure Authentication** — Email/password and magic link auth via Supabase Auth

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** | Full-stack React framework |
| **Supabase** | Database, Auth, Realtime subscriptions |
| **Google Gemini AI** | Issue classification from images |
| **Leaflet.js** | Interactive real-time map |
| **Framer Motion** | Smooth UI animations |
| **TypeScript** | Type-safe development |

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project
- Google Gemini API key

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd civicpulse

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase URL, anon key, and Gemini API key

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

---

## 📁 Project Structure

```
civicpulse/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── auth/         # Authentication page
│   │   ├── dashboard/    # User dashboard
│   │   └── report/       # Issue reporting flow
│   ├── components/
│   │   ├── sections/     # Landing page sections
│   │   └── ui/           # Reusable UI components
│   └── lib/              # Supabase client & utilities
├── public/               # Static assets
└── .env.example          # Environment variable template
```

---

## 🏆 Hackathon

Built in 24 hours for the **OpenClaw Hackathon** at **HackIndia**.

**#OpenClawHackathon #HackIndia #24HourHackathon**

---

## 📄 License

MIT License — feel free to use and build upon this project.
