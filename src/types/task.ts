/**
 * Task domain model
 */

export type TaskStatus = 'pending' | 'completed' | 'expired' | 'approved';
export type TaskCategory = 'chore' | 'learning' | 'health' | 'creative' | 'other';

export interface Task {
  id: string;
  childId: string;
  parentId: string;
  title: string;
  description?: string;
  category: TaskCategory;
  rewardAmount: number; // coins or dollars
  dueDate?: number;
  createdAt: number;
  completedAt?: number;
  approvedAt?: number;
  status: TaskStatus;
  proofPhotoUrl?: string; // optional photo proof from child
}

export interface TaskCompletion {
  id: string;
  taskId: string;
  childId: string;
  completedAt: number;
  proofPhotoUrl?: string;
  notes?: string;
  status: 'pending_approval' | 'approved' | 'rejected';
  approvedAt?: number;
  approvedBy?: string; // parent ID
  rejectionReason?: string;
}

export interface TaskReward {
  id: string;
  taskId: string;
  childId: string;
  amount: number;
  rewardedAt: number;
  type: 'coins' | 'dollars';
}
