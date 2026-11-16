import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { SeverityBadge, StatusBadge, CategoryBadge } from '../components/common/Badge';
import { ComplaintStatus } from '../types';
import {
  FileText,
  Search,
  Filter,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Image as ImageIcon
} from 'lucide-react';

export const MyReportsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { complaints, statusHistory, supportComplaint } = useComplaints();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter complaints: citizens see their own; admin can toggle or see all
  const userReports = complaints.filter(c => {
    // If citizen, match userId; if admin, can view all reports or own
    const matchesUser = currentUser?.role === 'admin' ? true : c.userId === currentUser?.id;
    const matchesSearch =
      c.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;

    return matchesUser && matchesSearch && matchesStatus;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2E8] text-[#3E7C4A] text-xs font-semibold mb-2 border border-[#3E7C4A]/30">
            <FileText className="w-3.5 h-3.5" />
            <span>Grievance Tracker</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-[#244D30]">
            {currentUser?.role === 'admin' ? 'Municipal Incident Registry' : 'My Reported Issues'}
          </h1>
          <p className="text-xs sm:text-sm text-[#29332B]/80 font-sans">
            Track real-time status updates, field engineer progress, resolution proofs, and community support.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F2A900] text-[#244D30] font-heading font-bold text-xs sm:text-sm hover:bg-[#D69400] transition-colors shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>File New Grievance</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#3E7C4A]/20 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#29332B]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID (e.g. ECO-2026-8901), title, road..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#3E7C4A]/30 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#3E7C4A] bg-[#FFF8E7]/30"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Statuses' },
            { id: 'pending', label: 'Pending' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'resolved', label: 'Resolved' },
            { id: 'merged', label: 'Merged' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedStatus === tab.id
                  ? 'bg-[#3E7C4A] text-white font-semibold shadow-xs'
                  : 'bg-[#EAF2E8]/60 text-[#244D30] hover:bg-[#EAF2E8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      {userReports.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#3E7C4A]/20 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF2E8] text-[#3E7C4A] flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-lg text-[#244D30]">No Complaints Found</h3>
            <p className="text-xs text-[#29332B]/70 max-w-sm mx-auto font-sans">
              No civic issues match your current filter. Report an issue in your locality to start tracking!
            </p>
          </div>
          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3E7C4A] text-white font-heading font-semibold text-xs hover:bg-[#32643B]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report First Issue</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userReports.map(report => {
            const isExpanded = expandedId === report.id;
            const history = statusHistory.filter(h => h.complaintId === report.id);

            return (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-[#3E7C4A]/20 shadow-sm overflow-hidden transition-all hover:border-[#3E7C4A]/50"
              >
                {/* Main Card Summary */}
                <div
                  onClick={() => toggleExpand(report.id)}
                  className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none hover:bg-[#FFF8E7]/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Small Image Thumbnail */}
                    <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-[#3E7C4A]/20">
                      <img
                        src={report.imageUrl}
                        alt={report.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#3E7C4A] bg-[#EAF2E8] px-2 py-0.5 rounded-md">
                          {report.trackingId}
                        </span>
                        <CategoryBadge category={report.category} />
                        <SeverityBadge severity={report.severity} size="sm" />
                        <StatusBadge status={report.status} size="sm" />
                      </div>

                      <h3 className="font-heading font-bold text-base text-[#244D30] line-clamp-1">
                        {report.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-[#29332B]/70 font-sans">
                        <MapPin className="w-3.5 h-3.5 text-[#3E7C4A] shrink-0" />
                        <span className="truncate max-w-md">{report.address}</span>
                        <span className="text-gray-300">•</span>
                        <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{new Date(report.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        supportComplaint(report.id);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-semibold transition-colors ${
                        report.supportedByCurrentUser
                          ? 'bg-[#3E7C4A] text-white'
                          : 'bg-[#FFF8E7] text-[#244D30] border border-[#F2A900]/40 hover:bg-[#F2A900]'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{report.supporterCount}</span>
                    </button>

                    <div className="w-8 h-8 rounded-full bg-[#EAF2E8] text-[#244D30] flex items-center justify-center">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#3E7C4A]/10 bg-[#FAFBF9] space-y-6">
                    {/* Description & AI Assessment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                      <div className="space-y-3">
                        <h4 className="font-heading font-bold text-xs text-[#244D30] uppercase tracking-wide">
                          Citizen Report Summary
                        </h4>
                        <p className="text-xs text-[#29332B] font-sans leading-relaxed bg-white p-3.5 rounded-xl border border-[#3E7C4A]/20">
                          {report.description}
                        </p>
                        {report.landmark && (
                          <p className="text-xs text-[#29332B]/80 font-sans">
                            <b>Landmark:</b> {report.landmark}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {report.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded-md bg-[#EAF2E8] text-[#244D30] text-[11px] font-mono">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* AI Intelligence Card */}
                      <div className="space-y-3">
                        <h4 className="font-heading font-bold text-xs text-[#244D30] uppercase tracking-wide flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
                          <span>Gemini AI Municipal Recommendation</span>
                        </h4>
                        <div className="bg-[#FFF8E7] p-3.5 rounded-xl border border-[#F2A900]/30 space-y-2 text-xs font-sans">
                          {report.aiDetectedIssue && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-[#244D30]">Defect Classification:</span>
                              <p className="font-semibold text-[#244D30]">{report.aiDetectedIssue}</p>
                            </div>
                          )}
                          {report.aiSuggestedAction && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-[#3E7C4A]">Action Directive:</span>
                              <p className="italic text-[#29332B]">{report.aiSuggestedAction}</p>
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-1 border-t border-[#F2A900]/20 text-[11px]">
                            <span>AI Confidence: <b>{report.aiConfidence || 92}%</b></span>
                            <span>Affected Pop: <b>~{report.affectedPopulationEstimate || 50} citizens</b></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resolution Section if Resolved */}
                    {report.status === 'resolved' && (
                      <div className="bg-[#EAF2E8] border border-[#3E7C4A]/30 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#3E7C4A]" />
                            <h4 className="font-heading font-bold text-sm text-[#244D30]">
                              Municipal Field Resolution Report
                            </h4>
                          </div>
                          {report.resolvedAt && (
                            <span className="text-xs font-mono text-[#3E7C4A]">
                              Resolved on {new Date(report.resolvedAt).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        {report.resolutionNotes && (
                          <p className="text-xs text-[#29332B] font-sans">
                            {report.resolutionNotes}
                          </p>
                        )}
                        {report.resolutionImageUrl && (
                          <div className="pt-2">
                            <span className="text-[11px] font-bold text-[#244D30] block mb-1.5">
                              After-Resolution Proof Photo:
                            </span>
                            <div className="w-48 h-32 rounded-xl overflow-hidden border border-[#3E7C4A]/30 shadow-xs">
                              <img
                                src={report.resolutionImageUrl}
                                alt="Resolution Proof"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                        {report.pointsAwarded && (
                          <div className="pt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#B87A00] text-xs font-bold border border-[#F2A900]/40">
                            <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
                            <span>Eco-Points Awarded & Credited to Citizen Wallet!</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Timeline Audit Trail */}
                    <div className="space-y-2 pt-2">
                      <h4 className="font-heading font-bold text-xs text-[#244D30] uppercase tracking-wide">
                        Lifecycle Audit Trail
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-3 text-xs font-sans">
                          <div className="w-2 h-2 rounded-full bg-[#3E7C4A] mt-1.5 shrink-0" />
                          <div>
                            <span className="font-semibold text-[#244D30]">Grievance Registered</span>
                            <span className="text-gray-400 ml-2">
                              {new Date(report.createdAt).toLocaleString('en-IN')}
                            </span>
                            <p className="text-[11px] text-[#29332B]/70">Submitted by {report.userName}</p>
                          </div>
                        </div>

                        {history.map(entry => (
                          <div key={entry.id} className="flex items-start gap-3 text-xs font-sans">
                            <div className="w-2 h-2 rounded-full bg-[#F2A900] mt-1.5 shrink-0" />
                            <div>
                              <span className="font-semibold text-[#244D30]">Status Updated to: </span>
                              <span className="uppercase font-bold text-xs text-[#3E7C4A]">{entry.newStatus}</span>
                              <span className="text-gray-400 ml-2">
                                {new Date(entry.createdAt).toLocaleString('en-IN')}
                              </span>
                              {entry.notes && <p className="text-[11px] text-[#29332B]/80">{entry.notes}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
