/**
 * Savings goal domain model
 */

export type GoalStatus = 'active' | 'completed' | 'archived';

export interface SavingsGoal {
  id: string;
  childId: string;
  parentId: string;
  name: string;
  description?: string;
  targetAmount: number; // in coins
  currentAmount: number;
  targetDate?: number;
  icon?: string; // emoji or icon name
  imageUrl?: string; // for Seedling cohort (picture-based goals)
  status: GoalStatus;
  createdAt: number;
  completedAt?: number;
}

export interface GoalMilestone {
  id: string;
  goalId: string;
  threshold: number; // percentage: 25, 50, 75, 100
  name: string;
  reachedAt?: number;
}

export interface GoalContribution {
  id: string;
  goalId: string;
  childId: string;
  amount: number; // coins contributed
  source: 'task_reward' | 'bonus' | 'manual';
  createdAt: number;
}
