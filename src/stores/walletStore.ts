/**
 * Wallet state management
 * Tracks child's coin balance and spending
 */

import { create } from 'zustand';

interface WalletStore {
  balances: Map<string, number>; // childId -> coins
  
  addCoins: (childId: string, amount: number) => void;
  spendCoins: (childId: string, amount: number) => boolean; // returns success
  getBalance: (childId: string) => number;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  balances: new Map(),
  
  addCoins: (childId, amount) => {
    set((state) => {
      const newBalances = new Map(state.balances);
      const current = newBalances.get(childId) ?? 0;
      newBalances.set(childId, current + amount);
      return { balances: newBalances };
    });
  },
  
  spendCoins: (childId, amount) => {
    const state = get();
    const current = state.balances.get(childId) ?? 0;
    
    if (current < amount) return false;
    
    set((prevState) => {
      const newBalances = new Map(prevState.balances);
      newBalances.set(childId, current - amount);
      return { balances: newBalances };
    });
    
    return true;
  },
  
  getBalance: (childId) => {
    return get().balances.get(childId) ?? 0;
  },
}));
