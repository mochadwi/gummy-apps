/**
 * Dashboard and reporting domain model
 */

export interface ChildSummary {
  childId: string;
  name: string;
  age: number;
  cohort: 'seedling' | 'navigator';
  currentStreak: number;
  coinsEarned: number;
  coinsEarnedThisWeek: number;
  tasksCompleted: number;
  tasksCompletedThisWeek: number;
  activeGoals: number;
  activeChallenges: number;
  lastActivityAt?: number;
}

export interface MonthlyReportCard {
  id: string;
  childId: string;
  month: number; // 0-11
  year: number;
  reportedAt: number;
  
  // Earnings summary
  totalCoinsEarned: number;
  coinsEarnedByCategory: Record<string, number>;
  tasksCompleted: number;
  averageTasksPerDay: number;
  longestStreak: number;
  
  // Goals progress
  goalsCreated: number;
  goalsCompleted: number;
  goalCompletionRate: number;
  topGoal: string;
  
  // Challenges
  challengesCompleted: number;
  challengeFailures: number;
  favoriteChallengeDifficulty: 'easy' | 'medium' | 'hard';
  
  // Portfolio (Navigator only)
  portfolioValue?: number;
  portfolioGain?: number;
  portfolioGainPercent?: number;
  favoriteAllocation?: 'safe' | 'growth' | 'fun';
  
  // Behavior insights
  mostActiveDay: number; // 0-6
  typicalActivityHour: number; // 0-23
  consistencyScore: number; // 0-100
  improvementAreas: string[];
}

export interface ParentDashboard {
  parentId: string;
  childrenSummaries: ChildSummary[];
  recentActivityFeed: ActivityFeedItem[];
  pendingApprovals: number;
  lastUpdatedAt: number;
}

export interface ActivityFeedItem {
  id: string;
  childId: string;
  type: 'task_completed' | 'goal_reached' | 'challenge_completed' | 'milestone' | 'streak';
  description: string;
  timestamp: number;
  icon?: string;
}

export interface DashboardMetrics {
  familyCoinsEarned: number;
  familyTasksCompleted: number;
  familyGoalsCompleted: number;
  familyStreakDays: number;
  averageChildEngagement: number; // percentage
  totalFamilyInvestmentValue?: number;
}
