/**
 * Challenge service
 * Business logic for creating, tracking, and completing patience challenges
 */

import { PatienceChallenge, ChallengeCheckpoint, ChallengeProgress, ChallengeDifficulty } from '@types/challenge';
import { useChallengeStore } from '@stores/challengeStore';
import { useWalletStore } from '@stores/walletStore';

export const challengeService = {
  /**
   * Create a new patience challenge for a child
   */
  createChallenge(
    childId: string,
    parentId: string,
    title: string,
    description: string,
    durationDays: number,
    difficulty: ChallengeDifficulty
  ): PatienceChallenge {
    const baseReward = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;
    const dueAt = Date.now() + durationDays * 24 * 60 * 60 * 1000;
    
    const challenge: PatienceChallenge = {
      id: this.generateId(),
      childId,
      parentId,
      title,
      description,
      durationDays,
      difficulty,
      rewardBonus: baseReward,
      startedAt: Date.now(),
      dueAt,
      status: 'active',
      createdAt: Date.now(),
    };
    
    useChallengeStore.getState().addChallenge(challenge);
    
    // Initialize progress tracking
    const progress: ChallengeProgress = {
      challengeId: challenge.id,
      childId,
      daysCompleted: 0,
      totalDays: durationDays,
      currentStreak: 0,
    };
    useChallengeStore.getState().setProgress(challenge.id, progress);
    
    return challenge;
  },

  /**
   * Child marks a day as complete (check-in)
   */
  markDayComplete(challengeId: string): ChallengeCheckpoint {
    const checkpoint: ChallengeCheckpoint = {
      id: this.generateId(),
      challengeId,
      dayNumber: this.getCurrentDay(challengeId),
      checkedAt: Date.now(),
    };
    
    useChallengeStore.getState().addCheckpoint(checkpoint);
    
    // Update progress
    const progress = useChallengeStore.getState().getProgress(challengeId);
    if (progress) {
      useChallengeStore.getState().updateProgress(challengeId, {
        daysCompleted: progress.daysCompleted + 1,
        currentStreak: progress.currentStreak + 1,
        lastCheckpointAt: Date.now(),
      });
    }
    
    return checkpoint;
  },

  /**
   * Complete a challenge (give reward)
   */
  completeChallenge(challengeId: string): void {
    const challenge = useChallengeStore.getState().challenges.get(challengeId);
    
    if (!challenge) return;
    
    useChallengeStore.getState().updateChallenge(challengeId, {
      status: 'completed',
      completedAt: Date.now(),
    });
    
    // Award coins to child
    useWalletStore.getState().addCoins(challenge.childId, challenge.rewardBonus);
  },

  /**
   * Fail a challenge (broke the streak)
   */
  failChallenge(challengeId: string): void {
    useChallengeStore.getState().updateChallenge(challengeId, {
      status: 'failed',
    });
  },

  /**
   * Get all active challenges for a child
   */
  getActiveChallengesForChild(childId: string): PatienceChallenge[] {
    return useChallengeStore
      .getState()
      .getChallengesForChild(childId)
      .filter((c) => c.status === 'active');
  },

  /**
   * Get challenge progress
   */
  getChallengeProgress(challengeId: string): ChallengeProgress | null {
    return useChallengeStore.getState().getProgress(challengeId);
  },

  /**
   * Get days completed for a challenge
   */
  getDaysCompleted(challengeId: string): number {
    const checkpoints = useChallengeStore.getState().getCheckpointsForChallenge(challengeId);
    return checkpoints.length;
  },

  /**
   * Check if challenge is expired
   */
  isExpired(challengeId: string): boolean {
    const challenge = useChallengeStore.getState().challenges.get(challengeId);
    if (!challenge) return false;
    return Date.now() > challenge.dueAt && challenge.status === 'active';
  },

  /**
   * Auto-expire challenges that have passed their due date
   */
  expireOverdueChallengess(childId: string): void {
    const challenges = useChallengeStore.getState().getChallengesForChild(childId);
    
    challenges.forEach((c) => {
      if (this.isExpired(c.id)) {
        const progress = useChallengeStore.getState().getProgress(c.id);
        // If all days completed, mark as completed; else failed
        if (progress && progress.daysCompleted === progress.totalDays) {
          this.completeChallenge(c.id);
        } else {
          this.failChallenge(c.id);
        }
      }
    });
  },

  // Helpers

  private getCurrentDay(challengeId: string): number {
    const challenge = useChallengeStore.getState().challenges.get(challengeId);
    if (!challenge) return 1;
    
    const elapsedMs = Date.now() - challenge.startedAt;
    const elapsedDays = Math.floor(elapsedMs / (24 * 60 * 60 * 1000)) + 1;
    return Math.min(elapsedDays, challenge.durationDays);
  },

  private generateId(): string {
    return `challenge_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  },
};
