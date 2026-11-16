import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, PhoneCall, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#244D30] text-[#FFF8E7] border-t-4 border-[#F2A900] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Brand & Civic Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#3E7C4A] border border-[#F2A900] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-[#F2A900]" />
              </div>
              <span className="font-heading font-bold text-lg text-white">EcoSahayak</span>
            </div>
            <p className="text-xs text-[#FFF8E7]/80 leading-relaxed font-sans">
              AI-Powered Community Problem Reporter enabling Indian citizens and municipal urban local bodies (ULBs)
              to collaborate on real-time civic grievance redressal, hazard detection, and ecological preservation.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A3823] text-[#F2A900] text-[11px] font-semibold border border-[#3E7C4A]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Aligned with UN SDG 11</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-[#F2A900] uppercase tracking-wider mb-3">
              Citizen Portal
            </h4>
            <ul className="space-y-2 text-xs text-[#FFF8E7]/80 font-sans">
              <li>
                <Link to="/report" className="hover:text-[#F2A900] transition-colors flex items-center gap-1">
                  <span>Report an Issue</span>
                  <span className="text-[10px] bg-[#3E7C4A] text-white px-1.5 py-0.2 rounded-sm font-mono">AI</span>
                </Link>
              </li>
              <li>
                <Link to="/my-reports" className="hover:text-[#F2A900] transition-colors">
                  My Grievance Tracking
                </Link>
              </li>
              <li>
                <Link to="/heatmap" className="hover:text-[#F2A900] transition-colors">
                  Community Heatmap
                </Link>
              </li>
              <li>
                <Link to="/rewards" className="hover:text-[#F2A900] transition-colors flex items-center gap-1">
                  <span>Eco Rewards Badges</span>
                  <Sparkles className="w-3 h-3 text-[#F2A900]" />
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F2A900] transition-colors">
                  About the Initiative
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Administration & Tech Modules */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-[#F2A900] uppercase tracking-wider mb-3">
              Municipal & AI Tools
            </h4>
            <ul className="space-y-2 text-xs text-[#FFF8E7]/80 font-sans">
              <li>
                <Link to="/admin" className="hover:text-[#F2A900] transition-colors">
                  Admin Command Center
                </Link>
              </li>
              <li>
                <Link to="/drone" className="hover:text-[#F2A900] transition-colors flex items-center gap-1">
                  <span>Drone Aerial Surveillance</span>
                  <span className="text-[10px] bg-[#F2A900] text-[#244D30] font-bold px-1.5 py-0.2 rounded-sm">Proto</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://aistudio.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#F2A900] transition-colors flex items-center gap-1"
                >
                  <span>Google Gemini Vision API</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://make.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#F2A900] transition-colors flex items-center gap-1"
                >
                  <span>Make.com & Sheets Webhook</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#F2A900] transition-colors flex items-center gap-1"
                >
                  <span>Supabase PostgreSQL + RLS</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: National Civic Emergency Hotlines */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-[#F2A900] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" />
              <span>Civic Helplines (India)</span>
            </h4>
            <div className="space-y-2 text-xs text-[#FFF8E7]/80 font-sans">
              <div className="flex justify-between py-1 border-b border-[#3E7C4A]/40">
                <span>All-in-One Emergency:</span>
                <span className="font-bold text-white font-mono">112</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#3E7C4A]/40">
                <span>Jal Board (Water & Sewage):</span>
                <span className="font-bold text-white font-mono">1916</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#3E7C4A]/40">
                <span>Electricity Grid & Lines:</span>
                <span className="font-bold text-white font-mono">1912</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#3E7C4A]/40">
                <span>Swachhata App Helpline:</span>
                <span className="font-bold text-white font-mono">155304</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 mt-6 border-t border-[#3E7C4A]/40 flex flex-col sm:flex-row justify-between items-center text-xs text-[#FFF8E7]/70 font-sans gap-3">
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" />
            <span>for cleaner, safer Indian communities • B.Tech Engineering Showcase</span>
          </div>
          <div>
            <span>Neem & Marigold Theme • Powered by Google Gemini & OpenStreetMap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
