import React from 'react';
import { Link } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { SeverityBadge, StatusBadge, CategoryBadge } from '../components/common/Badge';
import {
  Camera,
  MapPin,
  Mic,
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plane,
  Users,
  AlertTriangle,
  Sparkles,
  Search
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { complaints } = useComplaints();

  // Statistics
  const totalReports = complaints.length;
  const resolvedReports = complaints.filter(c => c.status === 'resolved').length;
  const inProgressReports = complaints.filter(c => c.status === 'in_progress').length;
  const criticalReports = complaints.filter(c => c.severity === 'critical' && c.status !== 'resolved').length;
  const totalSupporters = complaints.reduce((sum, c) => sum + c.supporterCount, 0);

  // Recent 3 reports
  const recentReports = complaints.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#244D30] to-[#1A3823] text-[#FFF8E7] pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#3E7C4A]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#F2A900]/15 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3E7C4A]/40 border border-[#F2A900]/40 text-[#F2A900] text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-4 h-4 text-[#F2A900]" />
                <span>Next-Gen Civic Redressal • Google Gemini 1.5/2.0 Vision</span>
              </div>

              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
                Empower Your Community with <span className="text-[#F2A900]">AI-Driven</span> Civic Action
              </h1>

              <p className="font-sans text-base sm:text-lg text-[#FFF8E7]/90 max-w-2xl leading-relaxed">
                Report garbage dumps, treacherous road potholes, contaminated water leaks, broken streetlights, and drainage failures.
                Powered by Gemini multimodal image detection, automated smart priority matrix, and OpenStreetMap civic heatmaps.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#F2A900] text-[#244D30] font-heading font-bold text-sm sm:text-base hover:bg-[#D69400] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Camera className="w-5 h-5 text-[#244D30]" />
                  <span>Report an Issue Now</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/heatmap"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#3E7C4A] text-white font-heading font-bold text-sm sm:text-base hover:bg-[#32643B] border border-[#FFF8E7]/30 transition-all shadow-md hover:-translate-y-0.5"
                >
                  <MapPin className="w-5 h-5 text-[#F2A900]" />
                  <span>View Live Heatmap</span>
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#FFF8E7]/80">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#F2A900]" />
                  <span>Verified Municipal Redressal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-[#F2A900]" />
                  <span>Voice Reporting in Hindi & English</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#F2A900]" />
                  <span>Earn Eco Rewards Badges</span>
                </div>
              </div>
            </div>

            {/* Hero Quick Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-[#FFF8E7]/20 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#FFF8E7]/20">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                    <span className="font-heading font-bold text-sm text-white">Live Civic Incident Stream</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#F2A900]">Delhi Municipal Zone</span>
                </div>

                {/* Micro preview ticket */}
                <div className="bg-white rounded-2xl p-4 text-[#29332B] shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#3E7C4A]">ECO-2026-8902</span>
                    <SeverityBadge severity="critical" size="sm" />
                  </div>
                  <h4 className="font-heading font-bold text-sm text-[#244D30] line-clamp-1">
                    Hazardous Road Crater & Asphalt Depression
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-[#29332B]/80">
                    <MapPin className="w-3.5 h-3.5 text-[#3E7C4A]" />
                    <span className="truncate">Barakhamba Road Junction, New Delhi</span>
                  </div>
                  <div className="bg-[#EAF2E8] p-2.5 rounded-xl text-xs space-y-1">
                    <div className="font-semibold text-[#244D30] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
                      <span>AI Smart Recommendation:</span>
                    </div>
                    <p className="text-[#29332B]/80 text-[11px]">
                      High danger for two-wheelers. Deploy cold-mix asphalt patch team within 24 hours.
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[#3E7C4A] font-semibold">28 Citizens Supported</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium text-[11px]">
                      Pending Review
                    </span>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <Link
                    to="/heatmap"
                    className="text-xs text-[#F2A900] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Inspect all 6 active community incidents on map</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Civic KPI Counters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-[#3E7C4A]/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#EAF2E8] text-[#3E7C4A] flex items-center justify-center shrink-0">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#244D30]">{totalReports}</div>
              <div className="text-xs text-[#29332B]/70 font-medium">Total Issues Filed</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-[#3E7C4A]/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#EAF2E8] text-[#3E7C4A] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#3E7C4A]">{resolvedReports}</div>
              <div className="text-xs text-[#29332B]/70 font-medium">Verified Resolved</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-red-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-red-600">{criticalReports}</div>
              <div className="text-xs text-[#29332B]/70 font-medium">Critical Emergencies</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-[#F2A900]/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] text-[#F2A900] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#B87A00]">{totalSupporters}</div>
              <div className="text-xs text-[#29332B]/70 font-medium">Citizen Upvotes</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Pillars / Feature Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-heading font-bold text-[#3E7C4A] uppercase tracking-wider bg-[#EAF2E8] px-3 py-1 rounded-full border border-[#3E7C4A]/30">
            Intelligent Civic Infrastructure
          </span>
          <h2 className="text-2xl sm:text-4xl font-heading font-bold text-[#244D30]">
            How EcoSahayak Solves Community Challenges
          </h2>
          <p className="text-sm sm:text-base text-[#29332B]/80 font-sans">
            Designed specifically for Indian municipal dynamics — combining edge AI vision, multimodal speech, spatial duplicate prevention, and transparent civic rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#3E7C4A]/20 hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EAF2E8] text-[#3E7C4A] flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#244D30]">Gemini Multimodal Photo Vision</h3>
            <p className="text-xs sm:text-sm text-[#29332B]/80 leading-relaxed font-sans">
              Snap a picture on mobile. Gemini AI classifies the problem (garbage, potholes, water leaks, blocked nalas, streetlights), generates title/tags, and assesses severity in seconds.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#3E7C4A]/20 hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] text-[#F2A900] flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#244D30]">Voice Reporting (Hindi & English)</h3>
            <p className="text-xs sm:text-sm text-[#29332B]/80 leading-relaxed font-sans">
              Speak naturally into your device in Hindi or English. The Browser Web Speech API converts your voice to editable text with auto-department categorization and manual fallback.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#3E7C4A]/20 hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EAF2E8] text-[#3E7C4A] flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#244D30]">Smart Duplicate Elimination</h3>
            <p className="text-xs sm:text-sm text-[#29332B]/80 leading-relaxed font-sans">
              Haversine geospatial calculations detect nearby existing complaints. Instead of clogging queues with duplicates, citizens can upvote existing reports to escalate priority.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#3E7C4A]/20 hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EAF2E8] text-[#3E7C4A] flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#244D30]">Interactive Leaflet Heatmap</h3>
            <p className="text-xs sm:text-sm text-[#29332B]/80 leading-relaxed font-sans">
              Color-coded pins identify high-risk zones, cluster counts, and civic hotspots. Filter by department or severity to track municipal progress across sectors.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#3E7C4A]/20 hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] text-[#F2A900] flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#244D30]">Eco Rewards & Badges</h3>
            <p className="text-xs sm:text-sm text-[#29332B]/80 leading-relaxed font-sans">
              Earn Eco-Points verified by municipal officers. Unlock prestigious badges: Eco Warrior, Green Guardian, and Eco Hero while tracking your environmental impact.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#3E7C4A]/20 hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EAF2E8] text-[#3E7C4A] flex items-center justify-center">
              <Plane className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#244D30]">Drone Aerial Survey Prototype</h3>
            <p className="text-xs sm:text-sm text-[#29332B]/80 leading-relaxed font-sans">
              Admin inspection module for orthomosaic drone footage. Automatically scans for illegal riverbank dumping, road corridors, and converts aerial hazards into official work orders.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Recent Verified Community Reports */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <span className="text-xs font-heading font-bold text-[#F2A900] uppercase tracking-wider bg-[#FFF8E7] px-3 py-1 rounded-full border border-[#F2A900]/40">
              Community Transparency
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#244D30] mt-2">
              Recent Issues & Verified Resolutions
            </h2>
          </div>
          <Link
            to="/my-reports"
            className="text-sm font-heading font-bold text-[#3E7C4A] hover:text-[#244D30] flex items-center gap-1"
          >
            <span>View All Reports</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentReports.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#3E7C4A]/20 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-[#244D30]/90 text-white backdrop-blur-xs">
                      {item.trackingId}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <SeverityBadge severity={item.severity} size="sm" />
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <CategoryBadge category={item.category} />
                    <StatusBadge status={item.status} size="sm" />
                  </div>

                  <h3 className="font-heading font-bold text-base text-[#244D30] line-clamp-1">{item.title}</h3>

                  <p className="text-xs text-[#29332B]/80 line-clamp-2 font-sans">{item.description}</p>

                  <div className="flex items-center gap-1.5 text-xs text-[#29332B]/70 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#3E7C4A] shrink-0" />
                    <span className="truncate">{item.address}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-[#EAF2E8]/40 border-t border-[#3E7C4A]/20 flex items-center justify-between text-xs">
                <span className="text-[#3E7C4A] font-semibold">👍 {item.supporterCount} Citizens Supporting</span>
                <Link to="/heatmap" className="font-heading font-bold text-[#244D30] hover:text-[#3E7C4A]">
                  Track on Map →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 3-Step Simple Reporting Guide */}
      <section className="bg-[#FFF8E7] border-y border-[#F2A900]/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#244D30]">
              Report an Issue in 3 Simple Steps
            </h2>
            <p className="text-xs sm:text-sm text-[#29332B]/80 font-sans">
              No complicated bureaucratic forms. AI assists you from capture to resolution verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-[#3E7C4A] text-[#FFF8E7] flex items-center justify-center font-heading font-extrabold text-2xl mx-auto shadow-md">
                1
              </div>
              <h3 className="font-heading font-bold text-lg text-[#244D30]">Capture or Upload Photo</h3>
              <p className="text-xs text-[#29332B]/80 font-sans max-w-xs mx-auto">
                Take a clear picture of the garbage, pothole, water leak or damaged light pole right from your phone.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-[#F2A900] text-[#244D30] flex items-center justify-center font-heading font-extrabold text-2xl mx-auto shadow-md">
                2
              </div>
              <h3 className="font-heading font-bold text-lg text-[#244D30]">AI Analyzes & Prioritizes</h3>
              <p className="text-xs text-[#29332B]/80 font-sans max-w-xs mx-auto">
                Gemini detects the problem, suggests municipal category, tags, and estimates urgency for rapid dispatch.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-[#244D30] text-[#FFF8E7] flex items-center justify-center font-heading font-extrabold text-2xl mx-auto shadow-md">
                3
              </div>
              <h3 className="font-heading font-bold text-lg text-[#244D30]">Track & Earn Eco Rewards</h3>
              <p className="text-xs text-[#29332B]/80 font-sans max-w-xs mx-auto">
                Receive live status alerts. Once resolved and verified by officials, earn Eco-Points and community badges!
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#3E7C4A] text-white font-heading font-bold text-sm sm:text-base hover:bg-[#32643B] transition-all shadow-md"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
