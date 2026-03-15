/**
 * Goal state management
 * Tracks savings goals, milestones, and contributions
 */

import { create } from 'zustand';
import { SavingsGoal, GoalMilestone, GoalContribution } from '@types/goal';

interface GoalStore {
  goals: Map<string, SavingsGoal>; // goalId -> SavingsGoal
  milestones: Map<string, GoalMilestone[]>; // goalId -> milestones
  contributions: Map<string, GoalContribution>; // contributionId -> GoalContribution
  
  // Goal actions
  addGoal: (goal: SavingsGoal) => void;
  updateGoal: (goalId: string, updates: Partial<SavingsGoal>) => void;
  deleteGoal: (goalId: string) => void;
  getGoalsForChild: (childId: string) => SavingsGoal[];
  
  // Milestone actions
  setMilestones: (goalId: string, milestones: GoalMilestone[]) => void;
  getMilestones: (goalId: string) => GoalMilestone[];
  markMilestoneReached: (milestoneId: string) => void;
  
  // Contribution actions
  addContribution: (contribution: GoalContribution) => void;
  getContributionsForGoal: (goalId: string) => GoalContribution[];
}

export const useGoalStore = create<GoalStore>((set, get) => ({
  goals: new Map(),
  milestones: new Map(),
  contributions: new Map(),
  
  // Goal actions
  addGoal: (goal) => {
    set((state) => {
      const newGoals = new Map(state.goals);
      newGoals.set(goal.id, goal);
      return { goals: newGoals };
    });
  },
  
  updateGoal: (goalId, updates) => {
    set((state) => {
      const newGoals = new Map(state.goals);
      const goal = newGoals.get(goalId);
      if (goal) {
        newGoals.set(goalId, { ...goal, ...updates });
      }
      return { goals: newGoals };
    });
  },
  
  deleteGoal: (goalId) => {
    set((state) => {
      const newGoals = new Map(state.goals);
      newGoals.delete(goalId);
      const newMilestones = new Map(state.milestones);
      newMilestones.delete(goalId);
      return { goals: newGoals, milestones: newMilestones };
    });
  },
  
  getGoalsForChild: (childId) => {
    const { goals } = get();
    return Array.from(goals.values()).filter((g) => g.childId === childId && g.status !== 'archived');
  },
  
  // Milestone actions
  setMilestones: (goalId, milestones) => {
    set((state) => {
      const newMilestones = new Map(state.milestones);
      newMilestones.set(goalId, milestones);
      return { milestones: newMilestones };
    });
  },
  
  getMilestones: (goalId) => {
    return get().milestones.get(goalId) ?? [];
  },
  
  markMilestoneReached: (milestoneId) => {
    set((state) => {
      const newMilestones = new Map(state.milestones);
      
      for (const [goalId, ms] of newMilestones) {
        const updated = ms.map((m) =>
          m.id === milestoneId ? { ...m, reachedAt: Date.now() } : m
        );
        newMilestones.set(goalId, updated);
      }
      
      return { milestones: newMilestones };
    });
  },
  
  // Contribution actions
  addContribution: (contribution) => {
    set((state) => {
      const newContributions = new Map(state.contributions);
      newContributions.set(contribution.id, contribution);
      
      // Update goal amount
      const newGoals = new Map(state.goals);
      const goal = newGoals.get(contribution.goalId);
      if (goal) {
        newGoals.set(goal.id, {
          ...goal,
          currentAmount: goal.currentAmount + contribution.amount,
          completedAt: goal.currentAmount + contribution.amount >= goal.targetAmount ? Date.now() : undefined,
          status: goal.currentAmount + contribution.amount >= goal.targetAmount ? 'completed' : goal.status,
        });
      }
      
      return { contributions: newContributions, goals: newGoals };
    });
  },
  
  getContributionsForGoal: (goalId) => {
    const { contributions } = get();
    return Array.from(contributions.values()).filter((c) => c.goalId === goalId);
  },
}));
