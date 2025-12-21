
import { 
  User, 
  Report, 
  Event, 
  EducationContent, 
  Achievement, 
  Activity, 
  LeaderboardUser,
  Severity,
  PollutionType,
  ContentType
} from '../types';

const STORAGE_USER = 'ecowave_user_v3';
const STORAGE_REPORTS = 'ecowave_reports_v3';
const STORAGE_ACTIVITIES = 'ecowave_activities_v3';
const STORAGE_JOINED_EVENTS = 'ecowave_joined_events_v3';

const INITIAL_USER: User = {
  id: 'u1',
  name: 'Abdullah',
  email: 'abdullah@ecowave.org',
  avatar: '🌊',
  points: 1250,
  level: 3,
  rank: 12,
  streak: 5,
  joinedDate: '2024-01-15'
};

const INITIAL_ACTIVITIES: Activity[] = [
  { id: 'a1', type: 'report', title: 'Reported plastic pollution', context: 'Venice Beach', points: 50, timestamp: '2 hours ago' },
  { id: 'a2', type: 'event', title: 'Attended cleanup event', context: 'Coastal Clean 2025', points: 100, timestamp: 'Yesterday' },
  { id: 'a3', type: 'education', title: 'Completed article', context: 'Coral Health 101', points: 25, timestamp: '2 days ago' }
];

const MOCK_EVENTS: Event[] = [
  { id: 'e1', title: 'Great Coastal Cleanup', description: 'Help us clean 5 miles of coastline from plastic debris.', date: 'Mar 15, 2025', time: '09:00 AM', location: 'Malibu Beach, CA', organizer: 'Green Ocean Foundation', image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80fbe5e?auto=format&fit=crop&q=80&w=800', participants: 45, maxParticipants: 100, difficulty: 'Moderate' },
  { id: 'e2', title: 'Bay Area Microplastic Survey', description: 'Science-focused event to sample water for microplastics.', date: 'Mar 22, 2025', time: '10:30 AM', location: 'San Francisco Bay', organizer: 'EcoResearch Group', image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800', participants: 12, maxParticipants: 20, difficulty: 'Hard' },
  { id: 'e3', title: 'Coral Reef Watch', description: 'Monitoring reef health and reporting bleaching incidents.', date: 'Apr 05, 2025', time: '08:00 AM', location: 'Florida Keys', organizer: 'Reef Rescue', image: 'https://images.unsplash.com/photo-1546026423-9d20b795643e?auto=format&fit=crop&q=80&w=800', participants: 30, maxParticipants: 50, difficulty: 'Moderate' }
];

const MOCK_EDUCATION: EducationContent[] = [
  { id: 'ed1', title: 'Understanding Ocean Plastic Pollution', description: 'A deep dive into how plastics enter our oceans and their impact.', type: ContentType.ARTICLE, category: 'Environment', image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400', duration: '6 min read', content: 'Long article text...' }
];

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'ac1', name: 'First Report', description: 'Submit your first pollution report', icon: '📝', points: 50, earnedDate: 'Jan 20, 2024', isLocked: false, gradient: 'from-cyan-400 to-blue-500' },
  { id: 'ac2', name: 'Ocean Guard', description: 'Reach Level 5', icon: '🛡️', points: 200, isLocked: true, gradient: 'from-blue-400 to-indigo-500' }
];

const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Sarah Green', avatar: '🌱', level: 15, points: 8450 },
  { rank: 2, name: 'Ocean Hero', avatar: '🧜‍♂️', level: 12, points: 6200 },
  { rank: 12, name: 'Abdullah', avatar: '🌊', level: 3, points: 1250, isCurrentUser: true }
];

export class ApiService {
  private static getUser(): User {
    const data = localStorage.getItem(STORAGE_USER);
    return data ? JSON.parse(data) : INITIAL_USER;
  }

  private static saveUser(user: User) {
    localStorage.setItem(STORAGE_USER, JSON.stringify(user));
  }

  private static getReports(): Report[] {
    const data = localStorage.getItem(STORAGE_REPORTS);
    return data ? JSON.parse(data) : [];
  }

  private static getActivities(): Activity[] {
    const data = localStorage.getItem(STORAGE_ACTIVITIES);
    return data ? JSON.parse(data) : INITIAL_ACTIVITIES;
  }

  private static getJoinedEvents(): string[] {
    const data = localStorage.getItem(STORAGE_JOINED_EVENTS);
    return data ? JSON.parse(data) : [];
  }

  static async fetchHomeData() {
    const user = this.getUser();
    const reports = this.getReports();
    const activities = this.getActivities();
    const joined = this.getJoinedEvents();

    return {
      user,
      stats: {
        reports: reports.length,
        events: joined.length,
        activeUsers: 1240 + reports.length,
        level: user.level
      },
      recentActivity: activities.slice(0, 5)
    };
  }

  static async submitReport(report: Omit<Report, 'id' | 'userId' | 'timestamp' | 'status'>) {
    const user = this.getUser();
    
    // Create new report object
    const newReport: Report = { 
      ...report, 
      id: `r${Date.now()}`, 
      userId: user.id,
      timestamp: new Date().toISOString(), 
      status: 'Pending' 
    };
    
    // Save report
    const reports = [newReport, ...this.getReports()];
    localStorage.setItem(STORAGE_REPORTS, JSON.stringify(reports));

    // Update Activity
    const newActivity: Activity = {
      id: `a${Date.now()}`,
      type: 'report',
      title: `Reported ${report.type}`,
      context: report.location.name,
      points: 50,
      timestamp: 'Just now'
    };
    const activities = [newActivity, ...this.getActivities()];
    localStorage.setItem(STORAGE_ACTIVITIES, JSON.stringify(activities));

    // Update User XP/Points
    const updatedUser = { ...user, points: user.points + 50 };
    updatedUser.level = Math.floor(updatedUser.points / 500) + 1;
    this.saveUser(updatedUser);

    return { success: true, pointsAwarded: 50 };
  }

  static async fetchProfile() {
    const user = this.getUser();
    const activities = this.getActivities();
    
    // Dynamically update user in leaderboard for the UI
    const leaderboard = MOCK_LEADERBOARD.map(u => 
      u.name === user.name ? { ...u, points: user.points, level: user.level } : u
    ).sort((a, b) => b.points - a.points);

    return { 
      user, 
      activities, 
      achievements: MOCK_ACHIEVEMENTS, 
      leaderboard
    };
  }

  static async fetchEvents() {
    const joined = this.getJoinedEvents();
    return MOCK_EVENTS.map(e => ({
      ...e,
      isJoined: joined.includes(e.id),
      participants: joined.includes(e.id) ? e.participants + 1 : e.participants
    }));
  }

  static async toggleEventJoin(id: string) {
    const joined = this.getJoinedEvents();
    const isJoined = joined.includes(id);
    let newJoined;

    if (isJoined) {
      newJoined = joined.filter(itemId => itemId !== id);
    } else {
      newJoined = [...joined, id];
      
      // Add activity for joining
      const event = MOCK_EVENTS.find(e => e.id === id);
      const newActivity: Activity = {
        id: `a${Date.now()}`,
        type: 'event',
        title: `Joined ${event?.title || 'Event'}`,
        context: event?.location || 'Coastline',
        points: 100,
        timestamp: 'Just now'
      };
      localStorage.setItem(STORAGE_ACTIVITIES, JSON.stringify([newActivity, ...this.getActivities()]));
      
      const user = this.getUser();
      const updatedUser = { ...user, points: user.points + 100 };
      updatedUser.level = Math.floor(updatedUser.points / 500) + 1;
      this.saveUser(updatedUser);
    }

    localStorage.setItem(STORAGE_JOINED_EVENTS, JSON.stringify(newJoined));
    return { success: true, isJoined: !isJoined };
  }

  static async fetchEducation() { return MOCK_EDUCATION; }
  
  static async completeArticle(id: string) {
    const article = MOCK_EDUCATION.find(e => e.id === id);
    const newActivity: Activity = {
      id: `a${Date.now()}`,
      type: 'education',
      title: `Learned about ${article?.category || 'Ocean'}`,
      context: article?.title || 'Article',
      points: 25,
      timestamp: 'Just now'
    };
    localStorage.setItem(STORAGE_ACTIVITIES, JSON.stringify([newActivity, ...this.getActivities()]));
    
    const user = this.getUser();
    const updatedUser = { ...user, points: user.points + 25 };
    updatedUser.level = Math.floor(updatedUser.points / 500) + 1;
    this.saveUser(updatedUser);
  }
}
