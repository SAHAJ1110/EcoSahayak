import React from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  ShieldCheck,
  Award,
  Sparkles,
  Camera,
  MapPin,
  Mic,
  Database,
  ArrowRight,
  Code2,
  CheckCircle2,
  Layers
} from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2E8] text-[#3E7C4A] text-xs font-semibold border border-[#3E7C4A]/30">
          <Leaf className="w-3.5 h-3.5 text-[#F2A900]" />
          <span>Swachh Bharat & Smart Cities AI Initiative</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#244D30] tracking-tight">
          About EcoSahayak (इको सहायक)
        </h1>
        <p className="text-sm sm:text-base text-[#29332B]/80 font-sans leading-relaxed">
          Bridging the gap between Indian citizens and municipal urban local bodies (ULBs) through multimodal artificial intelligence, spatial awareness, and community gamification.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-[#3E7C4A]/20 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF2E8] text-[#3E7C4A] flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-bold text-xl text-[#244D30]">Our Civic Mission</h2>
          <p className="text-xs sm:text-sm text-[#29332B]/80 font-sans leading-relaxed">
            Every citizen encounters civic hazards daily — open manholes, leaking drinking water pipelines, suffocating garbage heaps, broken streetlights, and cratered roads. EcoSahayak provides an effortless reporting interface using camera and voice, converting everyday observations into structured, prioritized municipal work orders.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#3E7C4A]/20 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF8E7] text-[#F2A900] flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-bold text-xl text-[#244D30]">AI for Public Good</h2>
          <p className="text-xs sm:text-sm text-[#29332B]/80 font-sans leading-relaxed">
            Rather than burdening municipal engineers with vague descriptions, Google Gemini AI inspects photos in real-time to detect defects, formulate actionable repair recommendations, estimate public safety risk, and prevent duplicate tickets within 350 meters using Haversine geospatial calculations.
          </p>
        </div>
      </div>

      {/* Complete Tech Stack Architecture */}
      <div className="bg-[#FFF8E7] border border-[#F2A900]/30 rounded-3xl p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-heading font-bold text-[#3E7C4A] uppercase tracking-wider">
            Architecture Blueprint
          </span>
          <h2 className="text-2xl font-heading font-bold text-[#244D30]">
            Full-Stack Modern Technology Stack
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs font-sans">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-2">
            <div className="font-heading font-bold text-[#244D30] text-sm">Frontend & Theme</div>
            <p className="text-gray-600">
              React 19 + TypeScript + Vite. Styled with Tailwind CSS in an Indian nature-inspired Neem & Marigold palette.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-2">
            <div className="font-heading font-bold text-[#244D30] text-sm">AI Multimodal Vision</div>
            <p className="text-gray-600">
              Google Gemini 1.5/2.0 Flash for zero-shot civic classification, risk ranking, and aerial drone analysis.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-2">
            <div className="font-heading font-bold text-[#244D30] text-sm">GIS & Voice API</div>
            <p className="text-gray-600">
              Leaflet & OpenStreetMap for cluster heatmaps. Browser Web Speech Recognition API for Hindi & English voice reports.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-2">
            <div className="font-heading font-bold text-[#244D30] text-sm">Backend & Automation</div>
            <p className="text-gray-600">
              Supabase PostgreSQL with RLS. Non-blocking Make.com webhooks synchronizing live records to Google Sheets & Looker Studio.
            </p>
          </div>
        </div>
      </div>

      {/* 5-7 Minute Presentation Demo Script Guide */}
      <div className="bg-white rounded-3xl p-8 border border-[#3E7C4A]/20 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-[#F2A900]" />
          <h2 className="font-heading font-bold text-xl text-[#244D30]">
            B.Tech College Project Demonstration Walkthrough (5-7 Minutes)
          </h2>
        </div>

        <div className="space-y-4 text-xs font-sans leading-relaxed">
          <div className="p-4 rounded-2xl bg-[#EAF2E8]/50 border border-[#3E7C4A]/20 space-y-1">
            <span className="font-heading font-bold text-sm text-[#244D30]">Minute 1: Introduction & Theme</span>
            <p className="text-gray-700">
              Show Home page. Explain the Neem & Marigold design system, community counters, and alignment with Swachh Bharat and UN SDG 11.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EAF2E8]/50 border border-[#3E7C4A]/20 space-y-1">
            <span className="font-heading font-bold text-sm text-[#244D30]">Minute 2-3: Citizen Reporting, Gemini Vision & Voice</span>
            <p className="text-gray-700">
              Go to "Report Issue". Click the 1-click sample button (e.g. "Road Pothole"). Watch Gemini AI automatically generate title, tags, and severity recommendation. Demonstrate the microphone button for Hindi/English speech recording.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EAF2E8]/50 border border-[#3E7C4A]/20 space-y-1">
            <span className="font-heading font-bold text-sm text-[#244D30]">Minute 4: Spatial Heatmap & Duplicate Safeguards</span>
            <p className="text-gray-700">
              Navigate to "Heatmap". Show how complaint pins are color-coded by severity (red for critical craters/floods, orange for water leaks, yellow for garbage). Show duplicate prevention alert that prompts citizens to upvote existing issues.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EAF2E8]/50 border border-[#3E7C4A]/20 space-y-1">
            <span className="font-heading font-bold text-sm text-[#244D30]">Minute 5: Eco-Rewards & Gamification</span>
            <p className="text-gray-700">
              Open "Eco Rewards". Explain the anti-fraud mechanism: points are credited only after municipal officer inspection. Show badge levels: Eco Warrior, Green Guardian, and Eco Hero.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EAF2E8]/50 border border-[#3E7C4A]/20 space-y-1">
            <span className="font-heading font-bold text-sm text-[#244D30]">Minute 6-7: Admin Command Center & Drone Prototype</span>
            <p className="text-gray-700">
              Toggle role to "Admin Mode". Show the executive dashboard, resolve an issue with resolution proof photo, award eco-points, merge duplicates, and showcase the Drone Survey aerial analysis prototype.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
