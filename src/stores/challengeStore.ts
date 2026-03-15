/**
 * Challenge state management
 * Tracks patience challenges, checkpoints, and progress
 */

import { create } from 'zustand';
import { PatienceChallenge, ChallengeCheckpoint, ChallengeProgress } from '@types/challenge';

interface ChallengeStore {
  challenges: Map<string, PatienceChallenge>; // challengeId -> PatienceChallenge
  checkpoints: Map<string, ChallengeCheckpoint[]>; // challengeId -> checkpoints
  progress: Map<string, ChallengeProgress>; // challengeId -> ChallengeProgress
  
  // Challenge actions
  addChallenge: (challenge: PatienceChallenge) => void;
  updateChallenge: (challengeId: string, updates: Partial<PatienceChallenge>) => void;
  getChallengesForChild: (childId: string) => PatienceChallenge[];
  
  // Checkpoint actions
  addCheckpoint: (checkpoint: ChallengeCheckpoint) => void;
  getCheckpointsForChallenge: (challengeId: string) => ChallengeCheckpoint[];
  
  // Progress actions
  setProgress: (challengeId: string, progress: ChallengeProgress) => void;
  getProgress: (challengeId: string) => ChallengeProgress | null;
  updateProgress: (challengeId: string, updates: Partial<ChallengeProgress>) => void;
}

export const useChallengeStore = create<ChallengeStore>((set, get) => ({
  challenges: new Map(),
  checkpoints: new Map(),
  progress: new Map(),
  
  // Challenge actions
  addChallenge: (challenge) => {
    set((state) => {
      const newChallenges = new Map(state.challenges);
      newChallenges.set(challenge.id, challenge);
      return { challenges: newChallenges };
    });
  },
  
  updateChallenge: (challengeId, updates) => {
    set((state) => {
      const newChallenges = new Map(state.challenges);
      const challenge = newChallenges.get(challengeId);
      if (challenge) {
        newChallenges.set(challengeId, { ...challenge, ...updates });
      }
      return { challenges: newChallenges };
    });
  },
  
  getChallengesForChild: (childId) => {
    const { challenges } = get();
    return Array.from(challenges.values()).filter((c) => c.childId === childId);
  },
  
  // Checkpoint actions
  addCheckpoint: (checkpoint) => {
    set((state) => {
      const newCheckpoints = new Map(state.checkpoints);
      const existing = newCheckpoints.get(checkpoint.challengeId) ?? [];
      newCheckpoints.set(checkpoint.challengeId, [...existing, checkpoint]);
      return { checkpoints: newCheckpoints };
    });
  },
  
  getCheckpointsForChallenge: (challengeId) => {
    return get().checkpoints.get(challengeId) ?? [];
  },
  
  // Progress actions
  setProgress: (challengeId, progress) => {
    set((state) => {
      const newProgress = new Map(state.progress);
      newProgress.set(challengeId, progress);
      return { progress: newProgress };
    });
  },
  
  getProgress: (challengeId) => {
    return get().progress.get(challengeId) ?? null;
  },
  
  updateProgress: (challengeId, updates) => {
    set((state) => {
      const newProgress = new Map(state.progress);
      const existing = newProgress.get(challengeId);
      if (existing) {
        newProgress.set(challengeId, { ...existing, ...updates });
      }
      return { progress: newProgress };
    });
  },
}));
