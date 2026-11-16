import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { LeafletMap } from '../components/heatmap/LeafletMap';
import { SeverityBadge, StatusBadge, CategoryBadge } from '../components/common/Badge';
import { Complaint, ComplaintCategory, ComplaintSeverity } from '../types';
import {
  MapPin,
  Filter,
  Layers,
  ThumbsUp,
  Sparkles,
  X,
  AlertTriangle,
  Info,
  Calendar,
  ExternalLink
} from 'lucide-react';

export const HeatmapPage: React.FC = () => {
  const { complaints, supportComplaint } = useComplaints();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [showResolved, setShowResolved] = useState<boolean>(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'all' || c.severity === selectedSeverity;
    const matchesResolved = showResolved ? true : c.status !== 'resolved';
    return matchesCategory && matchesSeverity && matchesResolved;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2E8] text-[#3E7C4A] text-xs font-semibold mb-2 border border-[#3E7C4A]/30">
            <MapPin className="w-3.5 h-3.5" />
            <span>Community GIS Incident Map</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-[#244D30]">
            Community Civic Heatmap
          </h1>
          <p className="text-xs sm:text-sm text-[#29332B]/80 font-sans">
            Visualizing verified citizen-reported civic hazards across municipal sectors on OpenStreetMap.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#3E7C4A] bg-white px-3 py-1.5 rounded-xl border border-[#3E7C4A]/30 shadow-xs">
            Showing {filteredComplaints.length} Incidents
          </span>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#3E7C4A]/20 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#3E7C4A]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-medium rounded-xl border border-[#3E7C4A]/30 px-3 py-1.5 bg-[#FFF8E7]/30 text-[#244D30] focus:ring-1 focus:ring-[#3E7C4A]"
            >
              <option value="all">All Categories</option>
              <option value="garbage">Garbage / Waste</option>
              <option value="pothole">Road / Pothole</option>
              <option value="water_leakage">Water Leakage</option>
              <option value="blocked_drainage">Blocked Drainage</option>
              <option value="broken_streetlight">Broken Streetlight</option>
              <option value="waterlogging">Waterlogging</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Severity Buttons */}
          <div className="flex items-center gap-1 bg-[#EAF2E8] p-1 rounded-xl text-xs">
            {['all', 'critical', 'high', 'medium', 'low'].map(sev => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg capitalize text-[11px] font-medium transition-colors ${
                  selectedSeverity === sev
                    ? 'bg-[#3E7C4A] text-white font-bold shadow-xs'
                    : 'text-[#244D30] hover:bg-[#3E7C4A]/20'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Resolved */}
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#244D30]">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
            className="rounded text-[#3E7C4A] focus:ring-[#3E7C4A] w-4 h-4"
          />
          <span>Include Resolved Incidents</span>
        </label>
      </div>

      {/* Map and Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leaflet Map */}
        <div className={selectedComplaint ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <LeafletMap
            complaints={filteredComplaints}
            selectedComplaintId={selectedComplaint?.id}
            onSelectComplaint={(complaint) => setSelectedComplaint(complaint)}
            height="580px"
          />
        </div>

        {/* Selected Complaint Detail Panel */}
        {selectedComplaint && (
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-md border border-[#3E7C4A]/30 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#3E7C4A]/20">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#3E7C4A] bg-[#EAF2E8] px-2 py-0.5 rounded-md">
                    {selectedComplaint.trackingId}
                  </span>
                  <SeverityBadge severity={selectedComplaint.severity} size="sm" />
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Photo Preview */}
              <div className="w-full h-44 rounded-xl overflow-hidden bg-gray-100 border border-[#3E7C4A]/20">
                <img
                  src={selectedComplaint.imageUrl}
                  alt={selectedComplaint.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title and Category */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <CategoryBadge category={selectedComplaint.category} />
                  <StatusBadge status={selectedComplaint.status} size="sm" />
                </div>
                <h3 className="font-heading font-bold text-base text-[#244D30] pt-1">
                  {selectedComplaint.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs text-[#29332B] font-sans leading-relaxed bg-[#FFF8E7]/40 p-3 rounded-xl border border-[#F2A900]/30">
                {selectedComplaint.description}
              </p>

              {/* Location */}
              <div className="flex items-start gap-2 text-xs text-[#29332B]/80 font-sans">
                <MapPin className="w-4 h-4 text-[#3E7C4A] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#244D30]">{selectedComplaint.address}</div>
                  {selectedComplaint.landmark && (
                    <div className="text-[11px] text-gray-500">Near: {selectedComplaint.landmark}</div>
                  )}
                </div>
              </div>

              {/* AI Recommendation */}
              {selectedComplaint.aiSuggestedAction && (
                <div className="bg-[#EAF2E8] p-3 rounded-xl border border-[#3E7C4A]/30 text-xs font-sans space-y-1">
                  <div className="flex items-center gap-1 font-bold text-[#244D30]">
                    <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
                    <span>AI Recommended Action:</span>
                  </div>
                  <p className="text-[11px] text-[#29332B] italic">
                    "{selectedComplaint.aiSuggestedAction}"
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Support Button */}
            <div className="pt-4 border-t border-[#3E7C4A]/20 flex items-center justify-between gap-3">
              <span className="text-xs text-[#3E7C4A] font-semibold">
                👍 {selectedComplaint.supporterCount} Citizens Supporting
              </span>
              <button
                type="button"
                onClick={() => supportComplaint(selectedComplaint.id)}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 transition-all ${
                  selectedComplaint.supportedByCurrentUser
                    ? 'bg-[#3E7C4A] text-white'
                    : 'bg-[#F2A900] text-[#244D30] hover:bg-[#D69400] shadow-xs'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{selectedComplaint.supportedByCurrentUser ? 'Supported!' : 'Upvote & Support'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
