import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Complaint,
  ComplaintCategory,
  ComplaintSeverity,
  ComplaintStatus,
  DroneSurvey,
  DroneDetection,
  EcoRewardTransaction,
  StatusHistoryEntry,
} from '../types';
import { INITIAL_COMPLAINTS, INITIAL_DRONE_SURVEYS } from '../data/mockData';
import { sendComplaintToMakeWebhook } from '../services/webhookService';
import { useAuth } from './AuthContext';

interface ComplaintContextType {
  complaints: Complaint[];
  droneSurveys: DroneSurvey[];
  rewardHistory: EcoRewardTransaction[];
  statusHistory: StatusHistoryEntry[];
  addComplaint: (newComplaint: Omit<Complaint, 'id' | 'trackingId' | 'createdAt' | 'updatedAt' | 'supporterCount'>) => Promise<Complaint>;
  supportComplaint: (complaintId: string) => boolean;
  updateComplaintStatus: (
    complaintId: string,
    newStatus: ComplaintStatus,
    resolutionNotes?: string,
    resolutionImageUrl?: string
  ) => void;
  overrideSeverity: (complaintId: string, newSeverity: ComplaintSeverity, reason: string) => void;
  mergeDuplicates: (masterId: string, duplicateIds: string[]) => void;
  awardRewardPoints: (complaintId: string, points: number, reason: string) => boolean;
  addDroneSurvey: (survey: Omit<DroneSurvey, 'id' | 'capturedAt'>) => void;
  convertDroneDetectionToComplaint: (surveyId: string, detection: DroneDetection) => Promise<Complaint>;
  deleteComplaint: (complaintId: string) => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

const LOCAL_STORAGE_COMPLAINTS_KEY = 'ecosahayak_complaints_db';
const LOCAL_STORAGE_DRONE_KEY = 'ecosahayak_drone_surveys';
const LOCAL_STORAGE_REWARDS_KEY = 'ecosahayak_rewards_history';
const LOCAL_STORAGE_HISTORY_KEY = 'ecosahayak_status_history';

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, addEcoPoints } = useAuth();

  // Load complaints from localStorage or initial seed
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_COMPLAINTS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached complaints:', e);
      }
    }
    return INITIAL_COMPLAINTS;
  });

  // Load drone surveys
  const [droneSurveys, setDroneSurveys] = useState<DroneSurvey[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_DRONE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached drone surveys:', e);
      }
    }
    return INITIAL_DRONE_SURVEYS;
  });

  // Load rewards history
  const [rewardHistory, setRewardHistory] = useState<EcoRewardTransaction[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_REWARDS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached reward history:', e);
      }
    }
    return [
      {
        id: 'rwd-1',
        userId: 'user-citizen-1',
        complaintId: 'comp-103',
        trackingId: 'ECO-2026-8903',
        points: 100,
        reason: 'Verified resolution of Main Water Distribution Pipeline Rupture',
        awardedBy: 'Rajesh Verma (Nodal Officer)',
        createdAt: '2026-11-16T12:00:00Z',
      },
    ];
  });

  // Load status audit history
  const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached status history:', e);
      }
    }
    return [
      {
        id: 'hist-1',
        complaintId: 'comp-103',
        changedBy: 'user-admin-1',
        changedByName: 'Rajesh Verma (Nodal Officer)',
        oldStatus: 'pending',
        newStatus: 'in_progress',
        notes: 'Assigned to Delhi Jal Board emergency repair unit #4.',
        createdAt: '2026-11-14T10:00:00Z',
      },
      {
        id: 'hist-2',
        complaintId: 'comp-103',
        changedBy: 'user-admin-1',
        changedByName: 'Rajesh Verma (Nodal Officer)',
        oldStatus: 'in_progress',
        newStatus: 'resolved',
        notes: 'Pipe replaced and water pressure restored. Work verified on site.',
        createdAt: '2026-11-16T11:45:00Z',
      },
    ];
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_COMPLAINTS_KEY, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_DRONE_KEY, JSON.stringify(droneSurveys));
  }, [droneSurveys]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_REWARDS_KEY, JSON.stringify(rewardHistory));
  }, [rewardHistory]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(statusHistory));
  }, [statusHistory]);

  // Generate unique Indian civic tracking ID
  const generateTrackingId = (): string => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `ECO-2026-${randomNum}`;
  };

  // Add new complaint
  const addComplaint = async (
    newComplaintData: Omit<Complaint, 'id' | 'trackingId' | 'createdAt' | 'updatedAt' | 'supporterCount'>
  ): Promise<Complaint> => {
    const id = `comp-${Date.now()}`;
    const trackingId = generateTrackingId();
    const timestamp = new Date().toISOString();

    const complaint: Complaint = {
      ...newComplaintData,
      id,
      trackingId,
      supporterCount: 1, // Author counts as first supporter
      supportedByCurrentUser: true,
      pointsAwarded: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setComplaints(prev => [complaint, ...prev]);

    // Asynchronously dispatch to Make.com webhook for Google Sheets / Looker Studio sync
    sendComplaintToMakeWebhook({
      trackingId: complaint.trackingId,
      category: complaint.category,
      title: complaint.title,
      description: complaint.description,
      severity: complaint.severity,
      status: complaint.status,
      address: complaint.address,
      latitude: complaint.latitude,
      longitude: complaint.longitude,
      imageUrl: complaint.imageUrl,
      createdAt: complaint.createdAt,
      citizenName: complaint.userName,
    });

    return complaint;
  };

  // Upvote / Support an existing complaint
  const supportComplaint = (complaintId: string): boolean => {
    let success = false;
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          if (c.supportedByCurrentUser) {
            // Unsupport
            success = true;
            return {
              ...c,
              supporterCount: Math.max(1, c.supporterCount - 1),
              supportedByCurrentUser: false,
            };
          } else {
            // Add support
            success = true;
            return {
              ...c,
              supporterCount: c.supporterCount + 1,
              supportedByCurrentUser: true,
            };
          }
        }
        return c;
      })
    );
    return success;
  };

  // Update complaint status (Admin action)
  const updateComplaintStatus = (
    complaintId: string,
    newStatus: ComplaintStatus,
    resolutionNotes?: string,
    resolutionImageUrl?: string
  ) => {
    const timestamp = new Date().toISOString();
    let oldStatus: ComplaintStatus = 'pending';

    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          oldStatus = c.status;
          return {
            ...c,
            status: newStatus,
            resolutionNotes: resolutionNotes || c.resolutionNotes,
            resolutionImageUrl: resolutionImageUrl || c.resolutionImageUrl,
            resolvedAt: newStatus === 'resolved' ? timestamp : c.resolvedAt,
            resolvedBy: newStatus === 'resolved' ? currentUser?.fullName || 'Municipal Officer' : c.resolvedBy,
            updatedAt: timestamp,
          };
        }
        return c;
      })
    );

    // Record audit trail in status history
    const historyEntry: StatusHistoryEntry = {
      id: `hist-${Date.now()}`,
      complaintId,
      changedBy: currentUser?.id || 'admin',
      changedByName: currentUser?.fullName || 'Municipal Admin',
      oldStatus,
      newStatus,
      notes: resolutionNotes || `Status updated from ${oldStatus} to ${newStatus}`,
      createdAt: timestamp,
    };
    setStatusHistory(prev => [historyEntry, ...prev]);
  };

  // Override AI priority
  const overrideSeverity = (complaintId: string, newSeverity: ComplaintSeverity, reason: string) => {
    const timestamp = new Date().toISOString();
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          return {
            ...c,
            severity: newSeverity,
            updatedAt: timestamp,
          };
        }
        return c;
      })
    );

    const historyEntry: StatusHistoryEntry = {
      id: `hist-${Date.now()}`,
      complaintId,
      changedBy: currentUser?.id || 'admin',
      changedByName: currentUser?.fullName || 'Municipal Admin',
      oldStatus: 'pending',
      newStatus: 'pending',
      notes: `Admin overridden severity to ${newSeverity.toUpperCase()}. Reason: ${reason}`,
      createdAt: timestamp,
    };
    setStatusHistory(prev => [historyEntry, ...prev]);
  };

  // Merge duplicates under a master complaint ID
  const mergeDuplicates = (masterId: string, duplicateIds: string[]) => {
    const timestamp = new Date().toISOString();
    let additionalSupporters = 0;

    // Calculate supporters from merged children
    complaints.forEach(c => {
      if (duplicateIds.includes(c.id)) {
        additionalSupporters += c.supporterCount;
      }
    });

    setComplaints(prev =>
      prev.map(c => {
        if (c.id === masterId) {
          return {
            ...c,
            supporterCount: c.supporterCount + additionalSupporters,
            updatedAt: timestamp,
          };
        }
        if (duplicateIds.includes(c.id)) {
          return {
            ...c,
            status: 'merged',
            isDuplicate: true,
            masterComplaintId: masterId,
            updatedAt: timestamp,
          };
        }
        return c;
      })
    );
  };

  // Award Eco-Reward Points (Only after admin verification)
  const awardRewardPoints = (complaintId: string, points: number, reason: string): boolean => {
    let targetComplaint: Complaint | undefined;
    let alreadyAwarded = false;

    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          targetComplaint = c;
          if (c.pointsAwarded) {
            alreadyAwarded = true;
            return c;
          }
          return {
            ...c,
            pointsAwarded: true,
          };
        }
        return c;
      })
    );

    if (alreadyAwarded || !targetComplaint) {
      return false;
    }

    const rewardTransaction: EcoRewardTransaction = {
      id: `rwd-${Date.now()}`,
      userId: targetComplaint.userId,
      complaintId: targetComplaint.id,
      trackingId: targetComplaint.trackingId,
      points,
      reason,
      awardedBy: currentUser?.fullName || 'Municipal Admin',
      createdAt: new Date().toISOString(),
    };

    setRewardHistory(prev => [rewardTransaction, ...prev]);

    // If currentUser is the reporter, increment points in state
    if (currentUser && currentUser.id === targetComplaint.userId) {
      addEcoPoints(points);
    }

    return true;
  };

  // Add a new Drone Survey
  const addDroneSurvey = (surveyData: Omit<DroneSurvey, 'id' | 'capturedAt'>) => {
    const survey: DroneSurvey = {
      ...surveyData,
      id: `drone-survey-${Date.now()}`,
      capturedAt: new Date().toISOString(),
    };
    setDroneSurveys(prev => [survey, ...prev]);
  };

  // Convert aerial drone detection into official complaint
  const convertDroneDetectionToComplaint = async (
    surveyId: string,
    detection: DroneDetection
  ): Promise<Complaint> => {
    // Map issue type to category
    let category: ComplaintCategory = 'other';
    const lower = detection.issueType.toLowerCase();
    if (lower.includes('waste') || lower.includes('dump') || lower.includes('garbage')) category = 'garbage';
    else if (lower.includes('crater') || lower.includes('road')) category = 'pothole';
    else if (lower.includes('drain') || lower.includes('canal') || lower.includes('slab')) category = 'blocked_drainage';
    else if (lower.includes('waterlog') || lower.includes('flood')) category = 'waterlogging';

    const newTicket = await addComplaint({
      userId: currentUser?.id || 'admin',
      userName: `Drone Aerial Survey [${currentUser?.fullName || 'Admin'}]`,
      userPhone: '+91 11 2345 6789',
      title: `[Aerial Survey] ${detection.issueType}`,
      description: `${detection.description} Estimated affected footprint: ${detection.areaEstimate}. Verified from 45m AGL drone flight.`,
      category,
      tags: ['drone-survey', 'aerial-inspection', 'ai-detected', category],
      severity: detection.severity,
      aiSeverity: detection.severity,
      aiConfidence: detection.confidence,
      aiSuggestedAction: detection.suggestedAction,
      aiDetectedIssue: detection.issueType,
      affectedPopulationEstimate: 250,
      status: 'pending',
      latitude: detection.latitude,
      longitude: detection.longitude,
      address: `Aerial Grid Point, ${detection.areaEstimate}, New Delhi`,
      landmark: 'Captured via Municipal Orthomosaic UAV Mission',
      imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
    });

    // Mark drone survey as converted
    setDroneSurveys(prev =>
      prev.map(s => {
        if (s.id === surveyId) {
          return {
            ...s,
            status: 'converted',
            convertedToComplaintId: newTicket.id,
          };
        }
        return s;
      })
    );

    return newTicket;
  };

  // Delete complaint
  const deleteComplaint = (complaintId: string) => {
    setComplaints(prev => prev.filter(c => c.id !== complaintId));
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        droneSurveys,
        rewardHistory,
        statusHistory,
        addComplaint,
        supportComplaint,
        updateComplaintStatus,
        overrideSeverity,
        mergeDuplicates,
        awardRewardPoints,
        addDroneSurvey,
        convertDroneDetectionToComplaint,
        deleteComplaint,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
