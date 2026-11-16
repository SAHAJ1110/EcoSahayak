# EcoSahayak (इको सहायक) — AI-Powered Community Problem Reporter

> **Empowering Indian citizens and Urban Local Bodies (ULBs) with Multimodal AI Vision, Spatial Duplicate Safeguards, Voice Grievance Reporting, and Verified Civic Rewards.**

Built with **React 19, TypeScript, Tailwind CSS, Supabase (Auth + PostgreSQL + RLS), Google Gemini Multimodal Vision, Leaflet + OpenStreetMap, Browser Web Speech API, and Make.com Webhooks for Looker Studio Analytics**.

---

## 🌿 Neem & Marigold Design Identity

Inspired by the enduring resilience of Indian flora and sustainable civic aesthetics:
- **Neem Green (`#3E7C4A`)**: Trust, environmental stewardship, affirmation.
- **Marigold (`#F2A900`)**: Civic vibrancy, warnings, community engagement.
- **Cream (`#FFF8E7`)**: Accessible, warm canvas surface.
- **Dark Green (`#244D30`)**: Grounding tone for navigation headers, command centers, and footers.
- **Soft Green (`#EAF2E8`)**: Cards, badge backgrounds, and highlighted metrics.
- **Body Text (`#29332B`)**: Deep charcoal forest text with WCAG AAA readability.
- **Typography**: Montserrat (600/700) for headers and actions; Open Sans (400/500/600) for body and telemetry.

---

## 🚀 Key Modules & Capabilities

### 1. 📷 Multimodal AI Civic Photo Vision
- Citizens snap or upload photos of local civic defects.
- **Google Gemini 1.5/2.0 Flash Vision** classifies issues into municipal departments:
  - Solid waste accumulation and overflowing dumpsters
  - Deep carriageway potholes and road fractures
  - High-pressure potable water pipeline ruptures
  - Choked stormwater drains, culverts, and sewage overflows
  - Defective/unlit streetlights and dark unsafe corridors
  - Monsoon waterlogging and flooded underpasses
- Automatically suggests **Title, Tags, Objective Description, Severity, and Recommended Municipal Action**.
- Features 1-click sample benchmarks for seamless live college presentations.

### 2. ⚡ Smart Priority Assessment
- Calculates priority severity: **Low, Medium, High, Critical**.
- Evaluates vehicular accident threat, disease vector risk, affected population estimate, and arterial road disruption.
- Transparently labels AI predictions as recommendations with manual citizen and administrative overrides.

### 3. 🛡️ Geospatial Duplicate Prevention & Community Upvoting
- Calculates real-time Haversine spatial proximity (within 350 meters) and category overlap.
- When an existing report is detected, citizens are alerted and invited to **Upvote & Support** the existing ticket instead of cluttering municipal queues.
- Municipal administrators can merge verified duplicate tickets under a **Master Ticket ID** while preserving all original audit trails.

### 4. 🎙️ Dual-Language Voice Reporting (Web Speech API)
- Citizens can report grievances verbally in **Hindi (`hi-IN`)** or **Indian English (`en-IN`)**.
- Live audio stream transcription with auto-categorization and typing fallback.

### 5. 🗺️ Interactive OpenStreetMap & Leaflet Heatmap
- Visualizes complaints across sectors with colored pulsing pins:
  - 🔴 **Critical Alert** (Red)
  - 🟠 **High Priority** (Orange)
  - 🟡 **Medium Priority** (Marigold)
  - 🟢 **Routine / Low** (Neem Green)
- Category filters, severity chips, and clickable drawer with full details, photos, and support counters.

### 6. 🏆 Eco Rewards & Anti-Fraud Citizen Badges
- Gamification system awarding points:
  - Routine resolution: **+50 Eco-Points**
  - Critical/High hazard resolution: **+100 Eco-Points**
- **Strict Anti-Fraud Guarantee**: Points are credited **only after municipal officer physical verification and status resolution**.
- Citizen badge levels:
  - 🌿 **Eco Starter** (0 pts)
  - 🛡️ **Eco Warrior** (100 pts)
  - 🏅 **Green Guardian** (300 pts)
  - 👑 **Eco Hero** (600 pts)
- Ward Community Leaderboard and celebratory confetti animations.

### 7. 🚁 Drone Aerial Survey Prototype
- Admin-only module for aerial orthomosaic surveillance (e.g. 45m AGL flights).
- Gemini AI scans for illegal riverbank dumping, road corridor craters, and canal silting.
- 1-click **Convert Aerial Detection to Official Municipal Work Order**.
- *Clearly labeled as an academic research prototype.*

### 8. 📊 Admin Command Center
- Executive KPI cards: Total, Pending, In-Progress, Resolved, Critical.
- Workload distribution charts across municipal departments.
- Status update modal with resolution notes and after-repair proof photos.
- Priority override with mandatory reason logging.
- CSV export for Google Sheets / Looker Studio business intelligence dashboards.

### 9. 🔄 Automation & Webhooks
- Non-blocking **Make.com Webhook** forwards new tickets to Google Sheets and Looker Studio.
- Network timeouts or webhook issues do not fail complaint registration.

---

## 🛠️ Tech Stack Architecture

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide React, Canvas Confetti |
| **Maps & GIS** | Leaflet 1.9, OpenStreetMap, HTML DivIcons |
| **Artificial Intelligence** | Google Gemini 1.5/2.0 Flash Vision Multimodal API |
| **Speech** | Browser Web Speech Recognition API (`hi-IN`, `en-IN`) |
| **Database & Auth** | Supabase (PostgreSQL 15, Row Level Security, Auth, Storage) |
| **Automation** | Make.com (Integromat) Webhooks, Google Sheets, Looker Studio |

---

## 💻 Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: v20+ or v22+
- **npm** or **pnpm**

### 2. Clone and Install
```bash
git clone https://github.com/your-username/EcoSahayak.git
cd EcoSahayak
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate your credentials:
```env
# Supabase Authentication & PostgreSQL
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Gemini API (Get from https://aistudio.google.com)
VITE_GEMINI_API_KEY=your-gemini-api-key

# Make.com Webhook for Google Sheets Automation
VITE_MAKE_WEBHOOK_URL=https://hook.eu2.make.com/your-custom-webhook-hash

# Looker Studio Embed URL (Optional)
VITE_LOOKER_STUDIO_URL=https://lookerstudio.google.com/...
```

> **Note**: Even if external API keys are omitted during evaluation, EcoSahayak includes a **resilient local civic heuristic engine** and **localStorage database** that functions out of the box!

### 4. Run the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 🗄️ Supabase PostgreSQL Setup & Migration

1. Create a free project at [supabase.com](https://supabase.com).
2. Navigate to the **SQL Editor** in the Supabase Dashboard.
3. Open [`supabase/schema.sql`](supabase/schema.sql) in this repository and run the entire script.
4. It automatically sets up:
   - `profiles` table extending Supabase Auth
   - `complaints` table with geospatial indexes
   - `complaint_supporters` table (unique 1-vote per citizen constraint)
   - `status_history` audit trail table
   - `eco_rewards_history` table
   - `drone_surveys` table
   - Row Level Security (RLS) policies protecting citizen data and restricting administrative actions to `role = 'admin'`.
   - `complaint-images` public storage bucket.

---

## 🔁 Make.com & Google Sheets / Looker Studio Pipeline

1. In [Make.com](https://make.com), create a new scenario with a **Custom Webhook** trigger.
2. Connect it to **Google Sheets -> Add a Row**.
3. Map the fields dispatched by EcoSahayak:
   - `Tracking ID` -> `1. trackingId`
   - `Title` -> `1. title`
   - `Category` -> `1. category`
   - `Severity` -> `1. severity`
   - `Address` -> `1. address`
   - `Coordinates` -> `1. latitude`, `1. longitude`
   - `Created At` -> `1. createdAt`
   - `Citizen Name` -> `1. citizenName`
4. Copy the webhook URL into your `.env` under `VITE_MAKE_WEBHOOK_URL`.
5. Connect your Google Sheet as a Data Source in [Looker Studio](https://lookerstudio.google.com) to generate interactive charts and SLA resolution time heatmaps!

---

## 🎯 5-7 Minute College Presentation Walkthrough

Follow this battle-tested presentation sequence for academic evaluations:

| Time | Stage | Action & Key Talking Points |
|---|---|---|
| **0:00 - 1:00** | **Introduction** | Open **Home Page**. Highlight Neem & Marigold palette, live community grievance counters, and alignment with Swachh Bharat & UN SDG 11. |
| **1:00 - 2:30** | **AI Citizen Reporting** | Navigate to **Report an Issue**. Click the **Road Pothole** sample photo. Show how Gemini Vision identifies the defect, tags, and recommended action. Test the **Microphone** button with Hindi/English speech. |
| **2:30 - 3:30** | **Duplicate Safeguard** | Pick a location near Connaught Place on the map. Show the **Duplicate Detection Banner** alerting that a similar issue is nearby, allowing 1-click **Upvote & Support** instead of queue clogging. |
| **3:30 - 4:30** | **Interactive Heatmap** | Open **Community Heatmap**. Demonstrate severity-colored pins, department filter chips, and interactive marker detail drawer. |
| **4:30 - 5:30** | **Eco-Rewards** | Show **Eco Rewards** page. Explain the anti-fraud verification: points are awarded only after municipal officer verification. Show badge progression (Eco Warrior -> Green Guardian -> Eco Hero). |
| **5:30 - 7:00** | **Admin Command & Drone** | Click **Admin Mode** in the top bar. Open **Admin Dashboard**. Update ticket status with resolution proof photo, award eco-points, merge duplicate tickets, and showcase the **Drone Survey** aerial vision prototype. |

---

## 📄 License
Created for B.Tech First-Year Engineering Project Showcase. Open-sourced under the MIT License.
