/**
 * Task service
 * Business logic for task creation, completion, approval, and reward distribution
 */

import { Task, TaskCompletion, TaskCategory } from '@types/task';
import { useTaskStore } from '@stores/taskStore';

export const taskService = {
  /**
   * Create a task assigned to a child
   */
  createTask(
    childId: string,
    parentId: string,
    title: string,
    category: TaskCategory,
    rewardAmount: number,
    description?: string,
    dueDate?: number
  ): Task {
    const task: Task = {
      id: this.generateId(),
      childId,
      parentId,
      title,
      description,
      category,
      rewardAmount,
      dueDate,
      createdAt: Date.now(),
      status: 'pending',
    };
    
    useTaskStore.getState().addTask(task);
    return task;
  },

  /**
   * Child submits task completion with optional proof
   */
  submitTaskCompletion(
    taskId: string,
    childId: string,
    proofPhotoUrl?: string,
    notes?: string
  ): TaskCompletion {
    const completion: TaskCompletion = {
      id: this.generateId(),
      taskId,
      childId,
      completedAt: Date.now(),
      proofPhotoUrl,
      notes,
      status: 'pending_approval',
    };
    
    useTaskStore.getState().submitCompletion(completion);
    return completion;
  },

  /**
   * Parent approves task completion and issues reward
   */
  approveTaskCompletion(completionId: string, parentId: string): void {
    useTaskStore.getState().approveCompletion(completionId, parentId);
  },

  /**
   * Parent rejects task completion with reason
   */
  rejectTaskCompletion(completionId: string, reason: string): void {
    useTaskStore.getState().rejectCompletion(completionId, reason);
  },

  /**
   * Get all pending tasks for a child
   */
  getPendingTasksForChild(childId: string): Task[] {
    return useTaskStore
      .getState()
      .getTasksForChild(childId)
      .filter((t) => t.status === 'pending' && (!t.dueDate || t.dueDate > Date.now()));
  },

  /**
   * Get all pending completions for parent review
   */
  getPendingCompletionsForParent(parentId: string): TaskCompletion[] {
    const store = useTaskStore.getState();
    const completions = Array.from(store.completions.values());
    
    return completions.filter((c) => {
      const task = store.tasks.get(c.taskId);
      return task?.parentId === parentId && c.status === 'pending_approval';
    });
  },

  /**
   * Calculate total coins earned by a child
   */
  getTotalCoinsEarned(childId: string): number {
    return useTaskStore.getState().getTotalRewards(childId);
  },

  /**
   * Get task history for a child
   */
  getTaskHistory(childId: string): Task[] {
    return useTaskStore.getState().getTasksForChild(childId);
  },

  /**
   * Archive expired tasks (auto-expire after dueDate)
   */
  archiveExpiredTasks(childId: string): void {
    const tasks = useTaskStore.getState().getTasksForChild(childId);
    const now = Date.now();
    
    tasks.forEach((task) => {
      if (task.dueDate && task.dueDate < now && task.status === 'pending') {
        useTaskStore.getState().updateTask(task.id, { status: 'expired' });
      }
    });
  },

  // Helpers
  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  },
};
