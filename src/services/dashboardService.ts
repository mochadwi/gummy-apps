/**
 * Dashboard service
 * Generates parent dashboard summaries and monthly report cards
 */

import { ChildSummary, MonthlyReportCard, ParentDashboard, ActivityFeedItem, DashboardMetrics } from '@types/dashboard';
import { useTaskStore } from '@stores/taskStore';
import { useGoalStore } from '@stores/goalStore';
import { useChallengeStore } from '@stores/challengeStore';
import { usePortfolioStore } from '@stores/portfolioStore';
import { useSafetyStore } from '@stores/safetyStore';
import { useWalletStore } from '@stores/walletStore';

export const dashboardService = {
  /**
   * Generate summary for a single child
   */
  getChildSummary(childId: string): ChildSummary | null {
    // Fetch from stores - in real app would come from backend
    const taskStore = useTaskStore.getState();
    const goalStore = useGoalStore.getState();
    const challengeStore = useChallengeStore.getState();
    const walletStore = useWalletStore.getState();
    const safetyStore = useSafetyStore.getState();
    
    const tasks = taskStore.getTasksForChild(childId);
    const completedTasks = tasks.filter((t) => t.status === 'approved');
    const goals = goalStore.getGoalsForChild(childId);
    const challenges = challengeStore.getChallengesForChild(childId).filter((c) => c.status === 'active');
    const coinsEarned = walletStore.getBalance(childId);
    const logs = safetyStore.getActivityLogs(childId);
    const lastActivity = logs[logs.length - 1];
    
    // Calculate streak
    const weekStart = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeekTasks = completedTasks.filter((t) => t.approvedAt && t.approvedAt > weekStart);
    
    // Get child info from logs
    const childName = `Child ${childId.slice(0, 6)}`;
    const cohort = 'seedling' as const;
    
    return {
      childId,
      name: childName,
      age: 8,
      cohort,
      currentStreak: challenges.length > 0 ? 5 : 0, // placeholder
      coinsEarned,
      coinsEarnedThisWeek: thisWeekTasks.reduce((sum, t) => sum + t.rewardAmount, 0),
      tasksCompleted: completedTasks.length,
      tasksCompletedThisWeek: thisWeekTasks.length,
      activeGoals: goals.length,
      activeChallenges: challenges.length,
      lastActivityAt: lastActivity?.timestamp,
    };
  },

  /**
   * Generate parent dashboard
   */
  getParentDashboard(parentId: string, childIds: string[]): ParentDashboard {
    const childrenSummaries = childIds
      .map((id) => this.getChildSummary(id))
      .filter((s) => s !== null) as ChildSummary[];
    
    const recentActivityFeed = this.getRecentActivityFeed(childIds, 10);
    const pendingApprovals = this.getPendingApprovalsCount(parentId);
    
    return {
      parentId,
      childrenSummaries,
      recentActivityFeed,
      pendingApprovals,
      lastUpdatedAt: Date.now(),
    };
  },

  /**
   * Generate monthly report card for a child
   */
  generateMonthlyReportCard(childId: string, month: number, year: number): MonthlyReportCard {
    const taskStore = useTaskStore.getState();
    const goalStore = useGoalStore.getState();
    const challengeStore = useChallengeStore.getState();
    const portfolioStore = usePortfolioStore.getState();
    
    // Date range for month
    const startDate = new Date(year, month, 1).getTime();
    const endDate = new Date(year, month + 1, 1).getTime();
    
    // Get tasks completed this month
    const tasks = taskStore.getTasksForChild(childId);
    const monthlyTasks = tasks.filter((t) => t.approvedAt && t.approvedAt >= startDate && t.approvedAt < endDate);
    
    // Get goals completed this month
    const goals = goalStore.getGoalsForChild(childId);
    const monthlyGoals = goals.filter((g) => g.completedAt && g.completedAt >= startDate && g.completedAt < endDate);
    
    // Get challenges completed this month
    const challenges = challengeStore.getChallengesForChild(childId);
    const monthlyChallenges = challenges.filter(
      (c) => c.completedAt && c.completedAt >= startDate && c.completedAt < endDate && c.status === 'completed'
    );
    const monthlyChallengeFailures = challenges.filter(
      (c) => c.completedAt && c.completedAt >= startDate && c.completedAt < endDate && c.status === 'failed'
    );
    
    // Portfolio stats
    const portfolio = portfolioStore.getPortfolio(childId);
    
    // Calculate metrics
    const totalCoinsEarned = monthlyTasks.reduce((sum, t) => sum + t.rewardAmount, 0);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const averageTasksPerDay = monthlyTasks.length / daysInMonth;
    
    // Task categories
    const coinsEarnedByCategory: Record<string, number> = {};
    monthlyTasks.forEach((t) => {
      coinsEarnedByCategory[t.category] = (coinsEarnedByCategory[t.category] ?? 0) + t.rewardAmount;
    });
    
    return {
      id: `report_${childId}_${year}_${month}`,
      childId,
      month,
      year,
      reportedAt: Date.now(),
      totalCoinsEarned,
      coinsEarnedByCategory,
      tasksCompleted: monthlyTasks.length,
      averageTasksPerDay,
      longestStreak: 12, // placeholder
      goalsCreated: goals.length,
      goalsCompleted: monthlyGoals.length,
      goalCompletionRate: goals.length > 0 ? (monthlyGoals.length / goals.length) * 100 : 0,
      topGoal: monthlyGoals[0]?.name ?? 'N/A',
      challengesCompleted: monthlyChallenges.length,
      challengeFailures: monthlyChallengeFailures.length,
      favoriteChallengeDifficulty: 'medium',
      portfolioValue: portfolio?.totalValue,
      portfolioGain: portfolio ? portfolio.totalValue - (portfolio.allocations.length > 0 ? 100 : 0) : undefined,
      mostActiveDay: 3, // placeholder (0-6)
      typicalActivityHour: 17, // placeholder (0-23)
      consistencyScore: Math.round((monthlyTasks.length / (daysInMonth * 2)) * 100),
      improvementAreas: monthlyTasks.length < 10 ? ['Increase task completion frequency'] : [],
    };
  },

  /**
   * Get family-wide dashboard metrics
   */
  getFamilyMetrics(childIds: string[]): DashboardMetrics {
    const taskStore = useTaskStore.getState();
    const goalStore = useGoalStore.getState();
    const challengeStore = useChallengeStore.getState();
    const portfolioStore = usePortfolioStore.getState();
    
    let totalCoinsEarned = 0;
    let totalTasksCompleted = 0;
    let totalGoalsCompleted = 0;
    let totalInvestmentValue = 0;
    
    childIds.forEach((childId) => {
      const tasks = taskStore.getTasksForChild(childId).filter((t) => t.status === 'approved');
      const goals = goalStore.getGoalsForChild(childId).filter((g) => g.status === 'completed');
      const portfolio = portfolioStore.getPortfolio(childId);
      
      totalCoinsEarned += tasks.reduce((sum, t) => sum + t.rewardAmount, 0);
      totalTasksCompleted += tasks.length;
      totalGoalsCompleted += goals.length;
      
      if (portfolio) {
        totalInvestmentValue += portfolio.totalValue;
      }
    });
    
    const averageEngagement = childIds.length > 0 ? (totalTasksCompleted / childIds.length / 30) * 100 : 0;
    
    return {
      familyCoinsEarned: totalCoinsEarned,
      familyTasksCompleted: totalTasksCompleted,
      familyGoalsCompleted: totalGoalsCompleted,
      familyStreakDays: 12, // placeholder
      averageChildEngagement: Math.min(averageEngagement, 100),
      totalFamilyInvestmentValue: totalInvestmentValue,
    };
  },

  /**
   * Get recent activity feed
   */
  private getRecentActivityFeed(childIds: string[], limit: number = 10): ActivityFeedItem[] {
    const safetyStore = useSafetyStore.getState();
    const items: ActivityFeedItem[] = [];
    
    childIds.forEach((childId) => {
      const logs = safetyStore.getParentVisibleLogs(childId);
      logs.slice(-20).forEach((log) => {
        if (log.action === 'task_completed' || log.action === 'goal_reached' || log.action === 'challenge_completed') {
          items.push({
            id: log.id,
            childId,
            type: log.action as any,
            description: `${log.action}: ${JSON.stringify(log.details)}`,
            timestamp: log.timestamp,
          });
        }
      });
    });
    
    return items.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  },

  /**
   * Get count of pending approvals for parent
   */
  private getPendingApprovalsCount(parentId: string): number {
    const taskStore = useTaskStore.getState();
    const completions = Array.from(taskStore.completions.values()).filter(
      (c) => c.status === 'pending_approval'
    );
    return completions.length;
  },
};
