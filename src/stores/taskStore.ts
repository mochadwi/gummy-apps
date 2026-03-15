/**
 * Task state management
 * Handles task creation, completion, approval, and reward distribution
 */

import { create } from 'zustand';
import { Task, TaskCompletion, TaskReward, TaskStatus } from '@types/task';

interface TaskStore {
  tasks: Map<string, Task>; // taskId -> Task
  completions: Map<string, TaskCompletion>; // completionId -> TaskCompletion
  rewards: Map<string, TaskReward>; // rewardId -> TaskReward
  
  // Task actions
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  getTasksForChild: (childId: string) => Task[];
  
  // Completion actions
  submitCompletion: (completion: TaskCompletion) => void;
  approveCompletion: (completionId: string, approvedBy: string) => void;
  rejectCompletion: (completionId: string, reason: string) => void;
  getCompletionsForTask: (taskId: string) => TaskCompletion[];
  
  // Reward actions
  addReward: (reward: TaskReward) => void;
  getTotalRewards: (childId: string) => number;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: new Map(),
  completions: new Map(),
  rewards: new Map(),
  
  // Task actions
  addTask: (task) => {
    set((state) => {
      const newTasks = new Map(state.tasks);
      newTasks.set(task.id, task);
      return { tasks: newTasks };
    });
  },
  
  updateTask: (taskId, updates) => {
    set((state) => {
      const newTasks = new Map(state.tasks);
      const task = newTasks.get(taskId);
      if (task) {
        newTasks.set(taskId, { ...task, ...updates });
      }
      return { tasks: newTasks };
    });
  },
  
  deleteTask: (taskId) => {
    set((state) => {
      const newTasks = new Map(state.tasks);
      newTasks.delete(taskId);
      return { tasks: newTasks };
    });
  },
  
  getTasksForChild: (childId) => {
    const { tasks } = get();
    return Array.from(tasks.values()).filter((t) => t.childId === childId);
  },
  
  // Completion actions
  submitCompletion: (completion) => {
    set((state) => {
      const newCompletions = new Map(state.completions);
      newCompletions.set(completion.id, completion);
      
      // Update task status
      const newTasks = new Map(state.tasks);
      const task = newTasks.get(completion.taskId);
      if (task) {
        newTasks.set(task.id, { ...task, status: 'pending' as TaskStatus });
      }
      
      return { completions: newCompletions, tasks: newTasks };
    });
  },
  
  approveCompletion: (completionId, approvedBy) => {
    set((state) => {
      const newCompletions = new Map(state.completions);
      const completion = newCompletions.get(completionId);
      
      if (completion) {
        newCompletions.set(completionId, {
          ...completion,
          status: 'approved',
          approvedAt: Date.now(),
          approvedBy,
        });
        
        // Update task status
        const newTasks = new Map(state.tasks);
        const task = newTasks.get(completion.taskId);
        if (task) {
          newTasks.set(task.id, { ...task, status: 'approved' as TaskStatus });
        }
        
        // Create reward
        const newRewards = new Map(state.rewards);
        const rewardId = `reward_${Date.now()}`;
        newRewards.set(rewardId, {
          id: rewardId,
          taskId: completion.taskId,
          childId: completion.childId,
          amount: task?.rewardAmount ?? 0,
          rewardedAt: Date.now(),
          type: 'coins',
        });
        
        return { completions: newCompletions, tasks: newTasks, rewards: newRewards };
      }
      
      return state;
    });
  },
  
  rejectCompletion: (completionId, reason) => {
    set((state) => {
      const newCompletions = new Map(state.completions);
      const completion = newCompletions.get(completionId);
      
      if (completion) {
        newCompletions.set(completionId, {
          ...completion,
          status: 'rejected',
          rejectionReason: reason,
        });
        
        // Revert task to pending
        const newTasks = new Map(state.tasks);
        const task = newTasks.get(completion.taskId);
        if (task) {
          newTasks.set(task.id, { ...task, status: 'pending' as TaskStatus });
        }
        
        return { completions: newCompletions, tasks: newTasks };
      }
      
      return state;
    });
  },
  
  getCompletionsForTask: (taskId) => {
    const { completions } = get();
    return Array.from(completions.values()).filter((c) => c.taskId === taskId);
  },
  
  // Reward actions
  addReward: (reward) => {
    set((state) => {
      const newRewards = new Map(state.rewards);
      newRewards.set(reward.id, reward);
      return { rewards: newRewards };
    });
  },
  
  getTotalRewards: (childId) => {
    const { rewards } = get();
    return Array.from(rewards.values())
      .filter((r) => r.childId === childId)
      .reduce((sum, r) => sum + r.amount, 0);
  },
}));
