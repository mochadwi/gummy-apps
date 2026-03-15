/**
 * Goal service
 * Business logic for savings goal creation, tracking, and milestone celebration
 */

import { SavingsGoal, GoalMilestone, GoalContribution } from '@types/goal';
import { useGoalStore } from '@stores/goalStore';
import { Cohort } from '@types/index';

export const goalService = {
  /**
   * Create a savings goal for a child
   */
  createGoal(
    childId: string,
    parentId: string,
    name: string,
    targetAmount: number,
    cohort: Cohort,
    imageUrl?: string,
    targetDate?: number,
    description?: string
  ): SavingsGoal {
    const goal: SavingsGoal = {
      id: this.generateId(),
      childId,
      parentId,
      name,
      description,
      targetAmount,
      currentAmount: 0,
      targetDate,
      imageUrl,
      status: 'active',
      createdAt: Date.now(),
    };
    
    useGoalStore.getState().addGoal(goal);
    
    // Auto-create milestones
    const milestones = this.createDefaultMilestones(goal.id, cohort);
    useGoalStore.getState().setMilestones(goal.id, milestones);
    
    return goal;
  },

  /**
   * Contribute coins to a goal (from task reward, bonus, or manual)
   */
  contributeToGoal(
    goalId: string,
    childId: string,
    amount: number,
    source: 'task_reward' | 'bonus' | 'manual'
  ): GoalContribution {
    const contribution: GoalContribution = {
      id: this.generateId(),
      goalId,
      childId,
      amount,
      source,
      createdAt: Date.now(),
    };
    
    useGoalStore.getState().addContribution(contribution);
    
    // Check for milestone completion
    const goal = useGoalStore.getState().goals.get(goalId);
    if (goal) {
      const percentage = (goal.currentAmount / goal.targetAmount) * 100;
      const milestones = useGoalStore.getState().getMilestones(goalId);
      
      milestones.forEach((m) => {
        if (m.threshold <= percentage && !m.reachedAt) {
          useGoalStore.getState().markMilestoneReached(m.id);
        }
      });
    }
    
    return contribution;
  },

  /**
   * Get all active goals for a child
   */
  getActiveGoalsForChild(childId: string): SavingsGoal[] {
    return useGoalStore.getState().getGoalsForChild(childId);
  },

  /**
   * Get goal progress percentage
   */
  getGoalProgress(goalId: string): number {
    const goal = useGoalStore.getState().goals.get(goalId);
    if (!goal) return 0;
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  },

  /**
   * Get milestones for a goal
   */
  getGoalMilestones(goalId: string): GoalMilestone[] {
    return useGoalStore.getState().getMilestones(goalId);
  },

  /**
   * Complete a goal (manual completion by parent)
   */
  completeGoal(goalId: string): void {
    useGoalStore.getState().updateGoal(goalId, {
      status: 'completed',
      completedAt: Date.now(),
    });
  },

  /**
   * Archive a goal
   */
  archiveGoal(goalId: string): void {
    useGoalStore.getState().updateGoal(goalId, { status: 'archived' });
  },

  /**
   * Get contribution history for a goal
   */
  getContributionHistory(goalId: string): GoalContribution[] {
    return useGoalStore.getState().getContributionsForGoal(goalId);
  },

  // Helpers

  private createDefaultMilestones(goalId: string, cohort: Cohort): GoalMilestone[] {
    // All cohorts get 25%, 50%, 75%, 100% milestones
    return [
      {
        id: this.generateId(),
        goalId,
        threshold: 25,
        name: cohort === 'seedling' ? '🌱 Quarter there!' : '25% Towards goal',
      },
      {
        id: this.generateId(),
        goalId,
        threshold: 50,
        name: cohort === 'seedling' ? '🌿 Halfway!' : '50% Progress',
      },
      {
        id: this.generateId(),
        goalId,
        threshold: 75,
        name: cohort === 'seedling' ? '🌳 Almost done!' : '75% Complete',
      },
      {
        id: this.generateId(),
        goalId,
        threshold: 100,
        name: cohort === 'seedling' ? '🎉 You did it!' : '🏆 Goal achieved!',
      },
    ];
  },

  private generateId(): string {
    return `goal_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  },
};
