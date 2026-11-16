import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { SeverityBadge, StatusBadge, CategoryBadge } from '../components/common/Badge';
import { Complaint, ComplaintSeverity, ComplaintStatus } from '../types';
import {
  BarChart3,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Edit3,
  Merge,
  Award,
  ExternalLink,
  X,
  FileSpreadsheet,
  Layers,
  MapPin,
  RefreshCw
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { currentUser, role, switchRole } = useAuth();
  const {
    complaints,
    updateComplaintStatus,
    overrideSeverity,
    mergeDuplicates,
    awardRewardPoints,
  } = useComplaints();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modals
  const [resolutionModalComplaint, setResolutionModalComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('resolved');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionImageUrl, setResolutionImageUrl] = useState('');

  const [overrideModalComplaint, setOverrideModalComplaint] = useState<Complaint | null>(null);
  const [newSeverity, setNewSeverity] = useState<ComplaintSeverity>('high');
  const [overrideReason, setOverrideReason] = useState('');

  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [masterId, setMasterId] = useState('');
  const [duplicateIds, setDuplicateIds] = useState<string[]>([]);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // If user is not admin, provide role switch guard
  if (role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-300">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-heading font-extrabold text-[#244D30]">
            Municipal Officer Access Restricted
          </h2>
          <p className="text-xs sm:text-sm text-[#29332B]/80 font-sans max-w-md mx-auto">
            You are currently viewing in <b>Citizen Persona ({currentUser?.fullName})</b>.
            Municipal complaint dispatching, duplicate merging, and reward verification require admin credentials.
          </p>
        </div>
        <button
          onClick={() => switchRole('admin')}
          className="px-6 py-3 rounded-xl bg-[#3E7C4A] text-white font-heading font-bold text-sm hover:bg-[#32643B] transition-colors shadow-md inline-flex items-center gap-2"
        >
          <ShieldAlert className="w-4 h-4 text-[#F2A900]" />
          <span>Switch to Nodal Officer Persona (Rajesh Verma)</span>
        </button>
      </div>
    );
  }

  // Analytics Metrics
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'pending').length;
  const inProgress = complaints.filter(c => c.status === 'in_progress').length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const critical = complaints.filter(c => c.severity === 'critical' && c.status !== 'resolved').length;

  // Category counts
  const categoryCounts = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter complaints
  const filtered = complaints.filter(c => {
    const matchesSearch =
      c.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || c.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle Resolution Update
  const handleSaveResolution = () => {
    if (!resolutionModalComplaint) return;
    updateComplaintStatus(
      resolutionModalComplaint.id,
      newStatus,
      resolutionNotes,
      resolutionImageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=800&q=80'
    );
    setResolutionModalComplaint(null);
    setResolutionNotes('');
    setResolutionImageUrl('');
  };

  // Handle Override Severity
  const handleSaveOverride = () => {
    if (!overrideModalComplaint) return;
    overrideSeverity(
      overrideModalComplaint.id,
      newSeverity,
      overrideReason || 'Administrative field inspection recommendation.'
    );
    setOverrideModalComplaint(null);
    setOverrideReason('');
  };

  // Handle Merging Duplicates
  const handleExecuteMerge = () => {
    if (!masterId || duplicateIds.length === 0) {
      alert('Please select one master complaint and at least one duplicate to merge.');
      return;
    }
    mergeDuplicates(masterId, duplicateIds);
    setMergeModalOpen(false);
    setMasterId('');
    setDuplicateIds([]);
  };

  // Export CSV for Looker Studio
  const exportLookerStudioCSV = () => {
    const headers = [
      'Tracking ID',
      'Title',
      'Category',
      'Severity',
      'Status',
      'Address',
      'Latitude',
      'Longitude',
      'Supporters',
      'Created At',
      'Resolved At',
    ];
    const rows = complaints.map(c => [
      c.trackingId,
      `"${c.title.replace(/"/g, '""')}"`,
      c.category,
      c.severity,
      c.status,
      `"${c.address.replace(/"/g, '""')}"`,
      c.latitude,
      c.longitude,
      c.supporterCount,
      c.createdAt,
      c.resolvedAt || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecosahayak_municipal_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2E8] text-[#3E7C4A] text-xs font-semibold mb-2 border border-[#3E7C4A]/30">
            <ShieldAlert className="w-3.5 h-3.5 text-[#F2A900]" />
            <span>Nodal Officer Command Console</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-[#244D30]">
            Municipal Administrator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#29332B]/80 font-sans">
            Officer: <b>{currentUser?.fullName}</b> • Central Delhi Zone • Real-Time Redressal & Duplicate Audits
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setMergeModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-300 text-xs font-heading font-bold hover:bg-purple-100 transition-colors shadow-xs"
          >
            <Merge className="w-4 h-4 text-purple-700" />
            <span>Merge Duplicates</span>
          </button>

          <button
            onClick={exportLookerStudioCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3E7C4A] text-white text-xs font-heading font-bold hover:bg-[#32643B] transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#F2A900]" />
            <span>Export Looker CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#3E7C4A]/20 shadow-xs">
          <div className="text-xs text-[#29332B]/70 font-sans">Total Incidents</div>
          <div className="text-3xl font-heading font-extrabold text-[#244D30] mt-1">{total}</div>
          <div className="text-[10px] text-gray-500 mt-1 font-mono">100% Ingested</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs">
          <div className="text-xs text-amber-800 font-sans">Pending Review</div>
          <div className="text-3xl font-heading font-extrabold text-amber-700 mt-1">{pending}</div>
          <div className="text-[10px] text-amber-600 mt-1">Awaiting Field Crew</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-blue-200 shadow-xs">
          <div className="text-xs text-blue-800 font-sans">In Progress</div>
          <div className="text-3xl font-heading font-extrabold text-blue-700 mt-1">{inProgress}</div>
          <div className="text-[10px] text-blue-600 mt-1">Work Orders Active</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#3E7C4A]/30 shadow-xs">
          <div className="text-xs text-[#3E7C4A] font-sans">Verified Resolved</div>
          <div className="text-3xl font-heading font-extrabold text-[#3E7C4A] mt-1">{resolved}</div>
          <div className="text-[10px] text-[#3E7C4A] mt-1">Field Proof Submitted</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-red-200 shadow-xs">
          <div className="text-xs text-red-800 font-sans">Critical Emergencies</div>
          <div className="text-3xl font-heading font-extrabold text-red-600 mt-1">{critical}</div>
          <div className="text-[10px] text-red-500 mt-1">SLA &lt;12 Hours</div>
        </div>
      </div>

      {/* Category Analytics Distribution */}
      <div className="bg-white rounded-2xl p-6 border border-[#3E7C4A]/20 shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-sm text-[#244D30]">
          Municipal Department Workload Distribution
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {Object.entries({
            garbage: 'Garbage & Waste',
            pothole: 'Roads & Potholes',
            water_leakage: 'Water Supply',
            blocked_drainage: 'Drainage & Sewage',
            broken_streetlight: 'Street Lighting',
            waterlogging: 'Monsoon Flood',
          }).map(([key, label]) => {
            const count = categoryCounts[key] || 0;
            const pct = Math.round((count / (total || 1)) * 100);
            return (
              <div key={key} className="bg-[#FFF8E7]/40 p-3 rounded-xl border border-[#F2A900]/20 text-xs font-sans">
                <div className="text-gray-500 truncate">{label}</div>
                <div className="text-xl font-heading font-bold text-[#244D30] mt-1">{count}</div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#3E7C4A] h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#3E7C4A]/20 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, title, citizen, address..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#3E7C4A]/30 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#3E7C4A] bg-[#FFF8E7]/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs font-medium rounded-xl border border-[#3E7C4A]/30 px-3 py-1.5 bg-white text-[#244D30]"
          >
            <option value="all">All Departments</option>
            <option value="garbage">Garbage / Waste</option>
            <option value="pothole">Roads / Pothole</option>
            <option value="water_leakage">Water Leakage</option>
            <option value="blocked_drainage">Blocked Drainage</option>
            <option value="broken_streetlight">Broken Streetlight</option>
            <option value="waterlogging">Waterlogging</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-medium rounded-xl border border-[#3E7C4A]/30 px-3 py-1.5 bg-white text-[#244D30]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="merged">Merged</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-[#3E7C4A]/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-[#244D30] text-[#FFF8E7] font-heading font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Tracking ID</th>
                <th className="py-3 px-4">Photo</th>
                <th className="py-3 px-4">Issue Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Citizen / Supporters</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3E7C4A]/10">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-[#FFF8E7]/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#3E7C4A]">
                    {item.trackingId}
                  </td>

                  <td className="py-3 px-4">
                    <div
                      onClick={() => setPreviewImage(item.imageUrl || null)}
                      className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden cursor-pointer hover:opacity-80 border border-gray-200"
                    >
                      <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-bold text-[#244D30] line-clamp-1">{item.title}</div>
                    <div className="text-[11px] text-gray-500 line-clamp-1">{item.address}</div>
                    {item.isDuplicate && (
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded-sm">
                        Merged under {item.masterComplaintId}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <CategoryBadge category={item.category} />
                  </td>

                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <SeverityBadge severity={item.severity} size="sm" />
                      <button
                        onClick={() => {
                          setOverrideModalComplaint(item);
                          setNewSeverity(item.severity);
                        }}
                        className="block text-[10px] text-[#3E7C4A] hover:underline"
                      >
                        Override Priority
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-[#244D30]">{item.userName}</div>
                    <div className="text-[11px] text-gray-500">👍 {item.supporterCount} supporters</div>
                  </td>

                  <td className="py-3 px-4 text-right space-y-1">
                    <button
                      onClick={() => {
                        setResolutionModalComplaint(item);
                        setNewStatus(item.status);
                        setResolutionNotes(item.resolutionNotes || '');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#3E7C4A] text-white text-[11px] font-semibold hover:bg-[#32643B] transition-colors"
                    >
                      Update Status
                    </button>

                    {item.status === 'resolved' && !item.pointsAwarded && (
                      <button
                        onClick={() => {
                          const pts = item.severity === 'critical' || item.severity === 'high' ? 100 : 50;
                          const ok = awardRewardPoints(
                            item.id,
                            pts,
                            `Verified municipal resolution of ${item.title}`
                          );
                          if (ok) alert(`Awarded ${pts} Eco-Points to ${item.userName}!`);
                        }}
                        className="block ml-auto px-2 py-0.5 rounded-lg bg-[#F2A900] text-[#244D30] text-[10px] font-bold hover:bg-[#D69400]"
                      >
                        Award Points
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="relative max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewImage} alt="Large preview" className="w-full max-h-[80vh] object-contain" />
          </div>
        </div>
      )}

      {/* Resolution Update Modal */}
      {resolutionModalComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-heading font-bold text-base text-[#244D30]">
                Update Complaint Status
              </h3>
              <button onClick={() => setResolutionModalComplaint(null)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <span className="text-gray-500">Ticket:</span>{' '}
                <b>{resolutionModalComplaint.trackingId}</b> - {resolutionModalComplaint.title}
              </div>

              <div>
                <label className="block font-bold text-[#244D30] mb-1">New Status:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full p-2 rounded-xl border border-gray-300 font-medium"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#244D30] mb-1">Resolution / Officer Notes:</label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Detail work performed, equipment used, crew assignment..."
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-[#244D30] mb-1">Resolution Proof Photo URL:</label>
                <input
                  type="text"
                  value={resolutionImageUrl}
                  onChange={(e) => setResolutionImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2 rounded-xl border border-gray-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setResolutionModalComplaint(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveResolution}
                className="px-5 py-2 rounded-xl text-xs font-heading font-bold bg-[#3E7C4A] text-white hover:bg-[#32643B]"
              >
                Save Status Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Priority Override Modal */}
      {overrideModalComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-heading font-bold text-base text-[#244D30]">
                Override AI Priority Severity
              </h3>
              <button onClick={() => setOverrideModalComplaint(null)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <span className="text-gray-500">Ticket:</span>{' '}
                <b>{overrideModalComplaint.trackingId}</b> - Current: {overrideModalComplaint.severity.toUpperCase()}
              </div>

              <div>
                <label className="block font-bold text-[#244D30] mb-1">Select New Severity Level:</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as ComplaintSeverity)}
                  className="w-full p-2 rounded-xl border border-gray-300 font-medium"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical Alert</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#244D30] mb-1">Administrative Override Reason:</label>
                <textarea
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g. Field inspection confirmed near hospital entrance requiring immediate critical escalation."
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setOverrideModalComplaint(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOverride}
                className="px-5 py-2 rounded-xl text-xs font-heading font-bold bg-[#F2A900] text-[#244D30] hover:bg-[#D69400]"
              >
                Confirm Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Merging Modal */}
      {mergeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-heading font-bold text-base text-[#244D30]">
                Merge Verified Duplicate Incidents
              </h3>
              <button onClick={() => setMergeModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <p className="text-gray-600">
                Merging clusters duplicate reports under a single Master Incident ID. Original citizen tickets are preserved for transparency, and supporter counts are aggregated.
              </p>

              <div>
                <label className="block font-bold text-[#244D30] mb-1">1. Choose Master Ticket ID:</label>
                <select
                  value={masterId}
                  onChange={(e) => setMasterId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                >
                  <option value="">-- Select Master Complaint --</option>
                  {complaints.filter(c => c.status !== 'merged').map(c => (
                    <option key={c.id} value={c.id}>
                      {c.trackingId} - {c.title} ({c.supporterCount} votes)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#244D30] mb-1">2. Select Duplicate Tickets to Merge:</label>
                <div className="max-h-48 overflow-y-auto space-y-2 border p-3 rounded-xl">
                  {complaints
                    .filter(c => c.id !== masterId && c.status !== 'merged')
                    .map(c => (
                      <label key={c.id} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={duplicateIds.includes(c.id)}
                          onChange={(e) => {
                            if (e.target.checked) setDuplicateIds([...duplicateIds, c.id]);
                            else setDuplicateIds(duplicateIds.filter(id => id !== c.id));
                          }}
                          className="rounded text-purple-600"
                        />
                        <span className="font-mono font-bold text-[#3E7C4A]">{c.trackingId}</span>
                        <span className="truncate">{c.title}</span>
                      </label>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setMergeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteMerge}
                className="px-5 py-2 rounded-xl text-xs font-heading font-bold bg-purple-700 text-white hover:bg-purple-800"
              >
                Execute Safe Merge ({duplicateIds.length} tickets)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
