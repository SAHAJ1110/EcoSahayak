export type UserRole = 'citizen' | 'admin';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  ecoPoints: number;
  badgeLevel: 'Eco Starter' | 'Eco Warrior' | 'Green Guardian' | 'Eco Hero';
  avatarUrl?: string;
  createdAt: string;
}

export type ComplaintCategory =
  | 'garbage'
  | 'pothole'
  | 'water_leakage'
  | 'blocked_drainage'
  | 'broken_streetlight'
  | 'waterlogging'
  | 'other';

export type ComplaintSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected' | 'merged';

export interface Complaint {
  id: string;
  trackingId: string; // e.g., ECO-2026-1042
  userId: string;
  userName: string;
  userPhone?: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  tags: string[];
  severity: ComplaintSeverity;
  aiSeverity?: ComplaintSeverity;
  aiConfidence?: number; // 0 to 100
  aiSuggestedAction?: string;
  aiDetectedIssue?: string;
  affectedPopulationEstimate?: number;
  status: ComplaintStatus;
  latitude: number;
  longitude: number;
  address: string;
  landmark?: string;
  imageUrl?: string;
  voiceTranscript?: string;
  supporterCount: number;
  supportedByCurrentUser?: boolean;
  masterComplaintId?: string | null;
  isDuplicate?: boolean;
  duplicateScore?: number;
  resolutionNotes?: string;
  resolutionImageUrl?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  pointsAwarded?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistoryEntry {
  id: string;
  complaintId: string;
  changedBy: string;
  changedByName: string;
  oldStatus: ComplaintStatus;
  newStatus: ComplaintStatus;
  notes?: string;
  createdAt: string;
}

export interface EcoRewardTransaction {
  id: string;
  userId: string;
  complaintId: string;
  trackingId: string;
  points: number;
  reason: string;
  awardedBy: string;
  createdAt: string;
}

export interface DroneDetection {
  id: string;
  issueType: string;
  confidence: number;
  severity: ComplaintSeverity;
  suggestedAction: string;
  areaEstimate: string;
  latitude: number;
  longitude: number;
  description: string;
}

export interface DroneSurvey {
  id: string;
  title: string;
  locationLabel: string;
  latitude: number;
  longitude: number;
  altitudeMeters: number;
  imageUrl: string;
  capturedAt: string;
  detections: DroneDetection[];
  convertedToComplaintId?: string;
  status: 'scanned' | 'converted';
}

export interface MakeWebhookPayload {
  trackingId: string;
  category: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  createdAt: string;
  citizenName: string;
}
