
export type Screen = 'home' | 'report' | 'ai' | 'events' | 'education' | 'profile' | 'about' | 'predictor' | 'podcast';

export enum Severity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum PollutionType {
  PLASTIC = 'Plastic Waste',
  OIL = 'Oil Spill',
  CHEMICAL = 'Chemical Pollution',
  SEWAGE = 'Sewage',
  DEBRIS = 'Marine Debris',
  MICROPLASTICS = 'Microplastics',
  INDUSTRIAL = 'Industrial Waste',
  OTHER = 'Other'
}

export enum ContentType {
  ARTICLE = 'Article',
  VIDEO = 'Video',
  INFOGRAPHIC = 'Infographic'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  points: number;
  level: number;
  rank: number;
  streak: number;
  joinedDate: string;
}

export interface Report {
  id: string;
  userId: string;
  type: PollutionType;
  severity: Severity;
  location: { lat: number; lng: number; name: string };
  description: string;
  image?: string;
  timestamp: string;
  status: 'Pending' | 'Verified' | 'Resolved';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  image: string;
  participants: number;
  maxParticipants: number;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  isJoined?: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  earnedDate?: string;
  isLocked: boolean;
  gradient: string;
}

export interface Activity {
  id: string;
  type: 'report' | 'event' | 'education' | 'ai';
  title: string;
  context: string;
  points: number;
  timestamp: string;
}

export interface EducationContent {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  category: string;
  image: string;
  duration: string;
  content: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  level: number;
  points: number;
  isCurrentUser?: boolean;
}
