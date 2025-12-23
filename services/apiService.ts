
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
  rank: 5,
  streak: 5,
  joinedDate: '2024-01-15'
};

const INITIAL_ACTIVITIES: Activity[] = [
  { id: 'a1', type: 'report', title: 'Reported plastic pollution', context: 'Venice Beach', points: 50, timestamp: '2 hours ago' },
  { id: 'a2', type: 'event', title: 'Attended cleanup event', context: 'Coastal Clean 2025', points: 100, timestamp: 'Yesterday' },
  { id: 'a3', type: 'education', title: 'Completed article', context: 'Coral Health 101', points: 25, timestamp: '2 days ago' }
];

const MOCK_EVENTS: Event[] = [
  { id: 'e1', title: 'Great Coastal Cleanup', description: 'Help us clean 5 miles of coastline from plastic debris. We provide gloves and bags.', date: 'Mar 15, 2025', time: '09:00 AM', location: 'Malibu Beach, CA', organizer: 'Green Ocean Foundation', image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80fbe5e?auto=format&fit=crop&q=80&w=800', participants: 45, maxParticipants: 100, difficulty: 'Moderate' },
  { id: 'e2', title: 'Bay Area Survey', description: 'Science-focused event to sample water for microplastics using specialized filters.', date: 'Mar 22, 2025', time: '10:30 AM', location: 'San Francisco Bay', organizer: 'EcoResearch Group', image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800', participants: 12, maxParticipants: 20, difficulty: 'Hard' },
  { id: 'e3', title: 'Coral Reef Watch', description: 'Monitoring reef health and reporting bleaching incidents via snorkeling.', date: 'Apr 05, 2025', time: '08:00 AM', location: 'Florida Keys', organizer: 'Reef Rescue', image: 'https://images.unsplash.com/photo-1546026423-9d20b795643e?auto=format&fit=crop&q=80&w=800', participants: 30, maxParticipants: 50, difficulty: 'Moderate' },
  { id: 'e4', title: 'Mangrove Planting', description: 'Restoring vital coastal ecosystems by planting native mangrove saplings.', date: 'Apr 12, 2025', time: '07:30 AM', location: 'Everglades, FL', organizer: 'Wetland Warriors', image: 'https://images.unsplash.com/photo-1590065582387-48675988b52d?auto=format&fit=crop&q=80&w=800', participants: 18, maxParticipants: 40, difficulty: 'Hard' }
];

const MOCK_EDUCATION: EducationContent[] = [
  { 
    id: 'ed1', 
    title: 'The Plastic Tide: Understanding Oceanic Debris', 
    description: 'A deep dive into how 8 million tons of plastic enter our oceans annually.', 
    type: ContentType.ARTICLE, 
    category: 'Environment', 
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600', 
    duration: '6 min read', 
    content: 'Plastic pollution has become an omnipresent threat to marine life. From the Great Pacific Garbage Patch to the deepest trenches, microplastics are now found in every corner of the ocean. This article explores the journey of single-use plastics from land to sea and the chemical impact they have on marine food chains. We discuss the breakdown process (photodegradation) and why "biodegradable" plastics often fail in marine environments.' 
  },
  { 
    id: 'ed2', 
    title: 'Coral Reefs: The Underwater Cities', 
    description: 'Why these biodiversity hotspots are critical for our planet survival.', 
    type: ContentType.ARTICLE, 
    category: 'Wildlife', 
    image: 'https://images.unsplash.com/photo-1546026423-9d20b795643e?auto=format&fit=crop&q=80&w=600', 
    duration: '8 min read', 
    content: 'Coral reefs occupy less than 0.1% of the ocean floor but support 25% of all marine life. Currently, they face unprecedented stress from rising sea temperatures and ocean acidification. Learn about the symbiotic relationship between corals and zooxanthellae, and how "bleaching" occurs when this bond is broken. This module also highlights restoration efforts like 3D printed reefs and larval seeding.' 
  },
  { 
    id: 'ed3', 
    title: 'Ghost Nets: The Silent Killers', 
    description: 'The devastating impact of abandoned fishing gear on marine mammals.', 
    type: ContentType.ARTICLE, 
    category: 'Action', 
    image: 'https://images.unsplash.com/photo-1498330177096-689e3fb901ca?auto=format&fit=crop&q=80&w=600', 
    duration: '5 min read', 
    content: 'Ghost nets are fishing nets that have been left or lost in the ocean by fishermen. These nets, often nearly invisible in the dim light, can be left tangled on a rocky reef or drifting in the open sea. They can entangle fish, dolphins, sea turtles, sharks, dugongs, crocodiles, seabirds, crabs, and other creatures, including the occasional human diver. Acting as a silent predator, they continue to "fish" for decades.' 
  },
  { 
    id: 'ed4', 
    title: 'Microplastics in the Human Food Chain', 
    description: 'How marine pollution eventually finds its way back to us.', 
    type: ContentType.INFOGRAPHIC, 
    category: 'Health', 
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600', 
    duration: '4 min read', 
    content: 'Bioaccumulation is the process by which toxins enter the food web by building up in individual organisms. As we move up the trophic levels, from plankton to apex predators (including humans), the concentration of microplastics increases significantly. New research shows microplastics in human blood and lung tissue, highlighting that ocean health is directly linked to human health.' 
  },
  { 
    id: 'ed5', 
    title: 'Mangrove Forests: The Blue Carbon Sinks', 
    description: 'Restoring coastal buffers to combat climate change.', 
    type: ContentType.ARTICLE, 
    category: 'Climate', 
    image: 'https://images.unsplash.com/photo-1590065582387-48675988b52d?auto=format&fit=crop&q=80&w=600', 
    duration: '7 min read', 
    content: 'Mangroves are among the most carbon-rich forests in the tropics. They can sequester up to four times more carbon than terrestrial forests. Beyond climate mitigation, they provide essential nurseries for juvenile fish and protect coastlines from storm surges and erosion. This module focuses on the restoration projects in Southeast Asia and Florida that are bringing these vital ecosystems back.' 
  }
];

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'ac1', name: 'First Report', description: 'Submit your first pollution report', icon: '📝', points: 50, earnedDate: 'Jan 20, 2024', isLocked: false, gradient: 'from-cyan-400 to-blue-500' },
  { id: 'ac2', name: 'Ocean Guard', description: 'Reach Level 5', icon: '🛡️', points: 200, isLocked: true, gradient: 'from-blue-400 to-indigo-500' }
];

const BASE_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Farah', avatar: '✨', level: 18, points: 9450 },
  { rank: 2, name: 'Hassam', avatar: '💻', level: 15, points: 7200 },
  { rank: 3, name: 'Sarah Green', avatar: '🌱', level: 12, points: 5100 },
  { rank: 4, name: 'Ali', avatar: '🦁', level: 9, points: 3850 },
  { rank: 5, name: 'Ocean Hero', avatar: '🧜‍♂️', level: 8, points: 2900 },
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
    const newReport: Report = { 
      ...report, 
      id: `r${Date.now()}`, 
      userId: user.id,
      timestamp: new Date().toISOString(), 
      status: 'Pending' 
    };
    const reports = [newReport, ...this.getReports()];
    localStorage.setItem(STORAGE_REPORTS, JSON.stringify(reports));
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
    const updatedUser = { ...user, points: user.points + 50 };
    updatedUser.level = Math.floor(updatedUser.points / 500) + 1;
    this.saveUser(updatedUser);
    return { success: true, pointsAwarded: 50 };
  }

  static async fetchProfile() {
    const user = this.getUser();
    const activities = this.getActivities();
    const reports = this.getReports();
    const joinedEvents = this.getJoinedEvents();
    
    const leaderboardRaw = [
      ...BASE_LEADERBOARD,
      { 
        rank: 0, 
        name: user.name, 
        avatar: user.avatar, 
        level: user.level, 
        points: user.points, 
        isCurrentUser: true 
      }
    ];

    const leaderboard = leaderboardRaw
      .sort((a, b) => b.points - a.points)
      .map((u, idx) => ({ ...u, rank: idx + 1 }));

    const currentUserInLB = leaderboard.find(u => u.isCurrentUser);
    if (currentUserInLB && currentUserInLB.rank !== user.rank) {
      const updatedUser = { ...user, rank: currentUserInLB.rank };
      this.saveUser(updatedUser);
    }

    return { 
      user: this.getUser(), 
      activities, 
      achievements: MOCK_ACHIEVEMENTS, 
      leaderboard,
      totalReports: reports.length,
      totalEvents: joinedEvents.length
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
