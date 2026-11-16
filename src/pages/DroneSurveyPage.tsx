import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { analyzeDroneFootage } from '../services/geminiService';
import { SeverityBadge } from '../components/common/Badge';
import { DroneDetection } from '../types';
import {
  Plane,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  RefreshCw,
  Layers,
  ArrowRight,
  Info,
  ShieldCheck
} from 'lucide-react';

export const DroneSurveyPage: React.FC = () => {
  const { role, switchRole } = useAuth();
  const { droneSurveys, convertDroneDetectionToComplaint } = useComplaints();

  const [selectedSurvey, setSelectedSurvey] = useState(droneSurveys[0] || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [conversionMessage, setConversionMessage] = useState<string | null>(null);

  // Guard for admin role
  if (role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E7] text-[#F2A900] flex items-center justify-center mx-auto border border-[#F2A900]/40">
          <Plane className="w-8 h-8 text-[#244D30]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-heading font-extrabold text-[#244D30]">
            UAV Aerial Surveillance Module (Admin Only)
          </h2>
          <p className="text-xs sm:text-sm text-[#29332B]/80 font-sans max-w-md mx-auto">
            Drone orthomosaic uploads and aerial hazard conversions are restricted to municipal survey inspectors.
          </p>
        </div>
        <button
          onClick={() => switchRole('admin')}
          className="px-6 py-3 rounded-xl bg-[#3E7C4A] text-white font-heading font-bold text-sm hover:bg-[#32643B] transition-colors shadow-md inline-flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-[#F2A900]" />
          <span>Switch to Admin Mode to Test Drone Survey</span>
        </button>
      </div>
    );
  }

  // Handle Converting Aerial Detection into Official Complaint
  const handleConvert = async (detection: DroneDetection) => {
    if (!selectedSurvey) return;
    try {
      const ticket = await convertDroneDetectionToComplaint(selectedSurvey.id, detection);
      setConversionMessage(`Successfully converted detection into official municipal ticket: ${ticket.trackingId}`);
      setTimeout(() => setConversionMessage(null), 7000);
    } catch (err) {
      console.error('Failed to convert drone detection:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Prototype Banner as explicitly requested in instructions */}
      <div className="bg-[#FFF8E7] border-2 border-[#F2A900] rounded-2xl p-4 flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-[#F2A900] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-[#244D30] font-sans">
          <div className="font-heading font-bold uppercase tracking-wide flex items-center gap-1.5">
            <span>Research & Prototype Module Notice</span>
            <span className="text-[10px] bg-[#F2A900] text-[#244D30] px-2 py-0.2 rounded-full font-bold">
              B.Tech Project Prototype
            </span>
          </div>
          <p className="leading-relaxed">
            This module demonstrates aerial orthomosaic inspection using multimodal AI vision.
            It processes simulated and drone-captured aerial imagery to detect large-scale civic hazards
            (riverbank dumping, canal silting, road corridor craters) and automatically converts them to tickets.
            <b> Note: This is an engineering prototype; it does not operate live active drone flights.</b>
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2E8] text-[#3E7C4A] text-xs font-semibold mb-2 border border-[#3E7C4A]/30">
            <Plane className="w-3.5 h-3.5" />
            <span>Aerial UAV Geospatial AI</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-[#244D30]">
            Drone Survey & Orthomosaic Hazard Detection
          </h1>
          <p className="text-xs sm:text-sm text-[#29332B]/80 font-sans">
            AI-powered aerial scanning for illegal dumping, road deterioration corridors, and waterlogging buffers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#3E7C4A] bg-white px-3 py-1.5 rounded-xl border border-[#3E7C4A]/30 shadow-xs">
            Flight Altitude: 45m AGL
          </span>
        </div>
      </div>

      {conversionMessage && (
        <div className="bg-[#EAF2E8] border border-[#3E7C4A] text-[#244D30] rounded-2xl p-4 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#3E7C4A]" />
            <span>{conversionMessage}</span>
          </div>
          <button onClick={() => setConversionMessage(null)}>
            <Info className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Drone Viewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Aerial Image Viewer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#3E7C4A]/20 space-y-4">
            <div className="flex justify-between items-center text-xs font-sans">
              <span className="font-heading font-bold text-[#244D30]">
                {selectedSurvey.title}
              </span>
              <span className="text-gray-500 font-mono">
                {new Date(selectedSurvey.capturedAt).toLocaleDateString('en-IN')}
              </span>
            </div>

            {/* High Resolution Orthomosaic Preview */}
            <div className="relative rounded-2xl overflow-hidden bg-black/90 aspect-video shadow-md border border-gray-200 group">
              <img
                src={selectedSurvey.imageUrl}
                alt={selectedSurvey.title}
                className="w-full h-full object-cover"
              />

              {/* Drone HUD Overlay */}
              <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between text-white font-mono text-[10px]">
                <div className="flex justify-between bg-black/40 backdrop-blur-xs p-2 rounded-lg">
                  <span>GPS: {selectedSurvey.latitude.toFixed(4)}°N, {selectedSurvey.longitude.toFixed(4)}°E</span>
                  <span>ALT: {selectedSurvey.altitudeMeters}m</span>
                  <span>CAM: GEMINI VISION 4K</span>
                </div>

                {/* Simulated Target Detection Boxes */}
                <div className="relative w-full h-full my-2">
                  <div className="absolute top-1/4 left-1/3 w-28 h-20 border-2 border-red-500 bg-red-500/20 rounded-xs flex items-start p-1 animate-pulse">
                    <span className="text-[9px] bg-red-600 text-white px-1">HAZARD #1</span>
                  </div>
                  <div className="absolute bottom-1/4 right-1/4 w-36 h-16 border-2 border-amber-400 bg-amber-400/20 rounded-xs flex items-start p-1">
                    <span className="text-[9px] bg-[#F2A900] text-black px-1 font-bold">HAZARD #2</span>
                  </div>
                </div>

                <div className="flex justify-between bg-black/40 backdrop-blur-xs p-1.5 rounded-lg text-emerald-400">
                  <span>STATUS: MULTI-POINT SCAN COMPLETE</span>
                  <span>TARGETS: {selectedSurvey.detections.length} IDENTIFIED</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600 font-sans pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#3E7C4A]" />
                <span>{selectedSurvey.locationLabel}</span>
              </div>
              <span className="font-semibold text-[#3E7C4A]">
                {selectedSurvey.detections.length} AI Anomalies Flagged
              </span>
            </div>
          </div>
        </div>

        {/* Right: AI Detections & Conversion Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#3E7C4A]/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#3E7C4A]/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F2A900]" />
                <h3 className="font-heading font-bold text-sm text-[#244D30]">
                  Gemini Aerial Detections
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#3E7C4A]">
                {selectedSurvey.detections.length} Hazards
              </span>
            </div>

            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {selectedSurvey.detections.map((det, idx) => (
                <div
                  key={det.id}
                  className="bg-[#FFF8E7]/40 border border-[#F2A900]/30 rounded-2xl p-4 space-y-3 text-xs font-sans hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-[#244D30]">
                      Detection #{idx + 1}: {det.issueType}
                    </span>
                    <SeverityBadge severity={det.severity} size="sm" />
                  </div>

                  <p className="text-[#29332B]/80 text-[11px] leading-relaxed">
                    {det.description}
                  </p>

                  <div className="bg-white p-2.5 rounded-xl border border-gray-100 space-y-1 text-[11px]">
                    <div className="text-gray-500">
                      <b>Estimated Area:</b> {det.areaEstimate}
                    </div>
                    <div className="text-gray-500">
                      <b>Confidence:</b> {det.confidence}%
                    </div>
                    <div className="text-[#3E7C4A]">
                      <b>Suggested Action:</b> {det.suggestedAction}
                    </div>
                  </div>

                  <button
                    onClick={() => handleConvert(det)}
                    className="w-full py-2 px-3 rounded-xl bg-[#3E7C4A] text-white font-heading font-bold text-xs hover:bg-[#32643B] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Convert to Official Complaint Ticket</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
