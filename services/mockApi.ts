
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

const STORAGE_USER = 'ecowave_user_v2';
const STORAGE_REPORTS = 'ecowave_reports_v2';
const STORAGE_ACTIVITIES = 'ecowave_activities_v2';
const STORAGE_JOINED_EVENTS = 'ecowave_joined_events_v2';

const INITIAL_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  email: 'alex@ecowave.org',
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
  { id: 'e3', title: 'Family Fun Shoreline Pick-up', description: 'Perfect for families and children to learn about nature.', date: 'Apr 02, 2025', time: '11:00 AM', location: 'Newport Beach', organizer: 'Shoreline Watch', image: 'https://images.unsplash.com/photo-1459245330819-1b6d75fbaa35?auto=format&fit=crop&q=80&w=800', participants: 28, maxParticipants: 50, difficulty: 'Easy' },
  { id: 'e4', title: 'Emergency Oil Spill Cleanup', description: 'Volunteers needed for secondary cleanup efforts.', date: 'Mar 10, 2025', time: '08:00 AM', location: 'Santa Barbara Coast', organizer: 'Coast Guard Auxiliary', image: 'https://images.unsplash.com/photo-1469122312224-c5846569efe1?auto=format&fit=crop&q=80&w=800', participants: 88, maxParticipants: 150, difficulty: 'Hard' }
];

const MOCK_EDUCATION: EducationContent[] = [
  { id: 'ed1', title: 'Understanding Ocean Plastic Pollution', description: 'A deep dive into how plastics enter our oceans and their impact.', type: ContentType.ARTICLE, category: 'Environment', image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400', duration: '6 min read', content: 'Long article text...' },
  { id: 'ed2', title: 'How to Conduct a Beach Cleanup', description: 'A step-by-step guide on organizing your own community cleanup.', type: ContentType.VIDEO, category: 'Action', image: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=400', duration: '12:45', content: 'Video summary...' },
  { id: 'ed3', title: 'Marine Ecosystem Balance', description: 'Visualizing the delicate interdependencies in our oceans.', type: ContentType.INFOGRAPHIC, category: 'Education', image: 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&q=80&w=400', duration: '5 min view', content: 'Infographic detail...' },
  { id: 'ed4', title: 'Coral Reef Conservation', description: 'Why reefs are dying and what we can do to save them.', type: ContentType.VIDEO, category: 'Wildlife', image: 'https://images.unsplash.com/photo-1546026423-9d20b795643e?auto=format&fit=crop&q=80&w=400', duration: '15:20', content: 'Coral reef health...' },
  { id: 'ed5', title: 'Sustainable Fishing Practices', description: 'Guide to choosing seafood that doesn\'t harm the ocean.', type: ContentType.ARTICLE, category: 'Consumption', image: 'https://images.unsplash.com/photo-1534818113099-dbe2b2e800ad?auto=format&fit=crop&q=80&w=400', duration: '8 min read', content: 'Fishing impacts...' },
  { id: 'ed6', title: 'Ocean Pollution Statistics 2025', description: 'Latest data on global marine debris trends.', type: ContentType.INFOGRAPHIC, category: 'Data', image: 'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&q=80&w=400', duration: '4 min view', content: 'Statistics breakdown...' }
];

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'ac1', name: 'First Report', description: 'Submit your first pollution report', icon: '📝', points: 50, earnedDate: 'Jan 20, 2024', isLocked: false, gradient: 'from-cyan-400 to-blue-500' },
  { id: 'ac2', name: 'Event Champion', description: 'Attend 5 cleanup events', icon: '🏆', points: 100, earnedDate: 'Feb 15, 2024', isLocked: false, gradient: 'from-amber-400 to-orange-500' },
  { id: 'ac3', name: 'Knowledge Seeker', description: 'Read 10 educational articles', icon: '📚', points: 75, earnedDate: 'Mar 01, 2024', isLocked: false, gradient: 'from-emerald-400 to-teal-500' },
  { id: 'ac4', name: 'Weekly Warrior', description: '7-day active streak', icon: '⚡', points: 150, earnedDate: 'Mar 05, 2024', isLocked: false, gradient: 'from-purple-400 to-indigo-500' },
  { id: 'ac5', name: 'Pollution Fighter', description: 'Report 5 verified pollution sites', icon: '🥊', points: 200, earnedDate: 'Mar 10, 2024', isLocked: false, gradient: 'from-red-400 to-pink-500' },
  { id: 'ac6', name: 'Community Leader', description: 'Help 50 people join events', icon: '🤝', points: 500, isLocked: true, gradient: 'from-gray-300 to-gray-400' },
  { id: 'ac7', name: 'Master Volunteer', description: '100 hours of volunteer work', icon: '🎖️', points: 1000, isLocked: true, gradient: 'from-gray-300 to-gray-400' },
  { id: 'ac8', name: 'Eco Legend', description: 'Reach Level 10', icon: '🌟', points: 5000, isLocked: true, gradient: 'from-gray-300 to-gray-400' }
];

const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Sarah Green', avatar: '🌱', level: 15, points: 8450 },
  { rank: 2, name: 'OceanGuardian', avatar: '🐳', level: 12, points: 6200 },
  { rank: 3, name: 'EcoDave', avatar: '🧔', level: 10, points: 5100 },
  { rank: 4, name: 'Luna_Sea', avatar: '🌙', level: 8, points: 3900 },
  { rank: 5, name: 'Marlin_44', avatar: '🐟', level: 7, points: 3150 },
  { rank: 6, name: 'BeachBum88', avatar: '🏖️', level: 6, points: 2800 },
];

export class MockApiService {
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

  static async fetchProfile() {
    const user = this.getUser();
    const activities = this.getActivities();
    const leaderboard = await this.fetchLeaderboard();
    return { user, activities, achievements: MOCK_ACHIEVEMENTS, leaderboard };
  }

  static async fetchHomeData() {
    const user = this.getUser();
    const reports = this.getReports();
    return {
      user,
      stats: {
        reports: reports.length,
        events: this.getJoinedEvents().length,
        activeUsers: 1240,
        level: user.level
      },
      recentActivity: this.getActivities().slice(0, 5)
    };
  }

  static async submitReport(report: Omit<Report, 'id' | 'userId' | 'timestamp' | 'status'>) {
    const user = this.getUser();
    const newReport: Report = {
      ...report,
      id: `r${Date.now()}`,
      userId: user.id,
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };

    const reports = [newReport, ...this.getReports()];
    localStorage.setItem(STORAGE_REPORTS, JSON.stringify(reports));

    await this.addPoints(50, 'report', `Reported ${report.type}`, report.location.name);
    return { success: true, pointsAwarded: 50 };
  }

  static async fetchEvents() {
    const joinedIds = this.getJoinedEvents();
    return MOCK_EVENTS.map(e => ({
      ...e,
      isJoined: joinedIds.includes(e.id),
      participants: joinedIds.includes(e.id) ? e.participants + 1 : e.participants
    }));
  }

  static async toggleEventJoin(eventId: string) {
    const joinedIds = this.getJoinedEvents();
    const isJoining = !joinedIds.includes(eventId);
    
    let newJoinedIds;
    if (isJoining) {
      newJoinedIds = [...joinedIds, eventId];
      const event = MOCK_EVENTS.find(e => e.id === eventId);
      await this.addPoints(100, 'event', 'Joined cleanup event', event?.title || 'Unknown Event');
    } else {
      newJoinedIds = joinedIds.filter(id => id !== eventId);
    }
    
    localStorage.setItem(STORAGE_JOINED_EVENTS, JSON.stringify(newJoinedIds));
    return { success: true, isJoined: isJoining };
  }

  static async fetchEducation(filterType: string = 'All') {
    if (filterType === 'All') return MOCK_EDUCATION;
    return MOCK_EDUCATION.filter(item => item.type === filterType);
  }

  static async completeArticle(articleId: string) {
    const article = MOCK_EDUCATION.find(a => a.id === articleId);
    await this.addPoints(25, 'education', 'Completed article', article?.title || 'Educational Content');
  }

  static async fetchLeaderboard(): Promise<LeaderboardUser[]> {
    const user = this.getUser();
    const currentLB = [...MOCK_LEADERBOARD, {
      rank: 12,
      name: user.name,
      avatar: user.avatar,
      level: user.level,
      points: user.points,
      isCurrentUser: true
    }];
    return currentLB.sort((a, b) => b.points - a.points).map((u, idx) => ({ ...u, rank: idx + 1 }));
  }

  private static async addPoints(amount: number, type: Activity['type'], title: string, context: string) {
    const user = this.getUser();
    const newPoints = user.points + amount;
    const newLevel = Math.floor(newPoints / 500) + 1;
    
    const updatedUser = { ...user, points: newPoints, level: newLevel };
    this.saveUser(updatedUser);

    const newActivity: Activity = {
      id: `a${Date.now()}`,
      type,
      title,
      context,
      points: amount,
      timestamp: 'Just now'
    };
    
    const activities = [newActivity, ...this.getActivities()];
    localStorage.setItem(STORAGE_ACTIVITIES, JSON.stringify(activities.slice(0, 50)));
  }
}
