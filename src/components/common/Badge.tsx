import React from 'react';
import { ComplaintCategory, ComplaintSeverity, ComplaintStatus } from '../../types';
import { AlertCircle, CheckCircle2, Clock, Trash2, Droplets, Zap, Waves, Flame, Ban } from 'lucide-react';

interface SeverityBadgeProps {
  severity: ComplaintSeverity;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const styles = {
    low: 'bg-[#EAF2E8] text-[#244D30] border-[#3E7C4A]/30',
    medium: 'bg-[#FFF8E7] text-[#B87A00] border-[#F2A900]/40',
    high: 'bg-orange-50 text-orange-800 border-orange-300',
    critical: 'bg-red-50 text-red-700 border-red-300 animate-pulse',
  };

  const labels = {
    low: 'Low Priority',
    medium: 'Medium Priority',
    high: 'High Priority',
    critical: 'Critical Alert',
  };

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${styles[severity]} ${padding}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${severity === 'critical' ? 'bg-red-600' : severity === 'high' ? 'bg-orange-500' : severity === 'medium' ? 'bg-[#F2A900]' : 'bg-[#3E7C4A]'}`} />
      {labels[severity]}
    </span>
  );
};

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const styles = {
    pending: 'bg-amber-50 text-amber-800 border-amber-300',
    in_progress: 'bg-blue-50 text-blue-800 border-blue-300',
    resolved: 'bg-[#EAF2E8] text-[#244D30] border-[#3E7C4A]/40',
    rejected: 'bg-gray-100 text-gray-700 border-gray-300',
    merged: 'bg-purple-50 text-purple-800 border-purple-300',
  };

  const labels = {
    pending: 'Pending Review',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
    merged: 'Merged Duplicate',
  };

  const icons = {
    pending: <Clock className="w-3 h-3" />,
    in_progress: <AlertCircle className="w-3 h-3" />,
    resolved: <CheckCircle2 className="w-3 h-3" />,
    rejected: <Ban className="w-3 h-3" />,
    merged: <CheckCircle2 className="w-3 h-3" />,
  };

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${styles[status]} ${padding}`}>
      {icons[status]}
      {labels[status]}
    </span>
  );
};

interface CategoryBadgeProps {
  category: ComplaintCategory;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const meta: Record<ComplaintCategory, { label: string; icon: React.ReactNode; color: string }> = {
    garbage: { label: 'Solid Waste', icon: <Trash2 className="w-3.5 h-3.5" />, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    pothole: { label: 'Road / Pothole', icon: <Flame className="w-3.5 h-3.5" />, color: 'bg-stone-100 text-stone-800 border-stone-300' },
    water_leakage: { label: 'Water Leak', icon: <Droplets className="w-3.5 h-3.5" />, color: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
    blocked_drainage: { label: 'Sewage / Drain', icon: <Waves className="w-3.5 h-3.5" />, color: 'bg-teal-50 text-teal-800 border-teal-200' },
    broken_streetlight: { label: 'Streetlight', icon: <Zap className="w-3.5 h-3.5" />, color: 'bg-amber-50 text-amber-800 border-amber-200' },
    waterlogging: { label: 'Waterlogging', icon: <Waves className="w-3.5 h-3.5" />, color: 'bg-blue-50 text-blue-800 border-blue-200' },
    other: { label: 'Civic Issue', icon: <AlertCircle className="w-3.5 h-3.5" />, color: 'bg-gray-50 text-gray-800 border-gray-200' },
  };

  const item = meta[category] || meta.other;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-xs font-medium ${item.color}`}>
      {item.icon}
      {item.label}
    </span>
  );
};
