/**
 * Patience challenge domain model
 */

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';
export type ChallengeStatus = 'active' | 'completed' | 'failed' | 'pending';

export interface PatienceChallenge {
  id: string;
  childId: string;
  parentId: string;
  title: string;
  description: string;
  durationDays: number;
  difficulty: ChallengeDifficulty;
  rewardBonus: number; // bonus coins for completing
  startedAt: number;
  dueAt: number;
  completedAt?: number;
  status: ChallengeStatus;
  createdAt: number;
}

export interface ChallengeCheckpoint {
  id: string;
  challengeId: string;
  dayNumber: number; // 1-indexed
  checkedAt?: number; // when child marked this day as complete
}

export interface ChallengeProgress {
  challengeId: string;
  childId: string;
  daysCompleted: number;
  totalDays: number;
  currentStreak: number; // consecutive days without breaking challenge
  lastCheckpointAt?: number;
}

export interface ChallengeTemplate {
  id: string;
  name: string;
  description: string;
  durationDays: number;
  difficulty: ChallengeDifficulty;
  bonusMultiplier: number; // multiplier on base reward
  rules: string[]; // rules for this challenge type
}
