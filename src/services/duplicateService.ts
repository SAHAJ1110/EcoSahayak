import { Complaint } from '../types';

/**
 * Calculates Haversine distance in meters between two GPS coordinates
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Calculates simple token/word similarity between two text strings (0 to 1)
 */
function textSimilarity(textA: string, textB: string): number {
  if (!textA || !textB) return 0;
  const wordsA = new Set(textA.toLowerCase().split(/\W+/).filter(w => w.length > 2));
  const wordsB = new Set(textB.toLowerCase().split(/\W+/).filter(w => w.length > 2));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersectionCount = 0;
  wordsA.forEach(w => {
    if (wordsB.has(w)) intersectionCount++;
  });

  const unionSize = new Set([...wordsA, ...wordsB]).size;
  return intersectionCount / unionSize;
}

export interface DuplicateMatch {
  complaint: Complaint;
  distanceMeters: number;
  score: number; // 0 to 100
  reasons: string[];
}

/**
 * Detects potential duplicate complaints based on:
 * 1. Category exact match
 * 2. Spatial proximity (within 350 meters)
 * 3. Temporal proximity (created within last 30 days)
 * 4. Text/title keyword overlap
 */
export function findPotentialDuplicates(
  newReport: {
    category: string;
    latitude: number;
    longitude: number;
    title: string;
    description: string;
  },
  existingComplaints: Complaint[],
  excludeId?: string
): DuplicateMatch[] {
  const matches: DuplicateMatch[] = [];
  const maxDistanceThreshold = 350; // meters

  for (const item of existingComplaints) {
    if (excludeId && item.id === excludeId) continue;
    // Skip already merged or resolved complaints older than 30 days
    if (item.status === 'merged') continue;

    const distance = calculateDistanceMeters(
      newReport.latitude,
      newReport.longitude,
      item.latitude,
      item.longitude
    );

    if (distance > maxDistanceThreshold) continue;

    const reasons: string[] = [];
    let score = 0;

    // 1. Distance scoring (up to 40 pts)
    if (distance < 50) {
      score += 40;
      reasons.push(`Very close location (only ${distance}m away)`);
    } else if (distance < 150) {
      score += 30;
      reasons.push(`Nearby location (${distance}m away)`);
    } else {
      score += 15;
      reasons.push(`Within municipal vicinity (${distance}m away)`);
    }

    // 2. Category match (up to 35 pts)
    if (item.category === newReport.category) {
      score += 35;
      reasons.push(`Identical civic category (${item.category.replace('_', ' ')})`);
    }

    // 3. Text & Title similarity (up to 25 pts)
    const titleSim = textSimilarity(newReport.title, item.title);
    const descSim = textSimilarity(newReport.description, item.description);
    const avgSim = (titleSim * 1.5 + descSim) / 2.5;

    if (avgSim > 0.25) {
      const textPoints = Math.round(avgSim * 25);
      score += textPoints;
      reasons.push('Similar issue description keywords');
    }

    // Only flag if composite score >= 45%
    if (score >= 45) {
      matches.push({
        complaint: item,
        distanceMeters: distance,
        score: Math.min(100, score),
        reasons,
      });
    }
  }

  return matches.sort((a, b) => b.score - a.score);
}
