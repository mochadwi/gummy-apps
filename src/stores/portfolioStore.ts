/**
 * Portfolio state management
 * Tracks Navigator-only investment simulation state
 */

import { create } from 'zustand';
import { Portfolio, Allocation, PortfolioUpdate } from '@types/portfolio';

interface PortfolioStore {
  portfolios: Map<string, Portfolio>; // childId -> Portfolio
  updates: Map<string, PortfolioUpdate[]>; // portfolioId -> updates
  
  // Portfolio actions
  createPortfolio: (portfolio: Portfolio) => void;
  updatePortfolioValue: (portfolioId: string, newValue: number) => void;
  getPortfolio: (childId: string) => Portfolio | null;
  
  // Allocation actions
  updateAllocation: (portfolioId: string, allocation: Allocation) => void;
  getAllocations: (portfolioId: string) => Allocation[];
  
  // History actions
  recordUpdate: (update: PortfolioUpdate) => void;
  getUpdateHistory: (portfolioId: string) => PortfolioUpdate[];
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  portfolios: new Map(),
  updates: new Map(),
  
  // Portfolio actions
  createPortfolio: (portfolio) => {
    set((state) => {
      const newPortfolios = new Map(state.portfolios);
      newPortfolios.set(portfolio.childId, portfolio);
      return { portfolios: newPortfolios };
    });
  },
  
  updatePortfolioValue: (portfolioId, newValue) => {
    set((state) => {
      const newPortfolios = new Map(state.portfolios);
      
      for (const [childId, portfolio] of newPortfolios) {
        if (portfolio.id === portfolioId) {
          newPortfolios.set(childId, {
            ...portfolio,
            totalValue: newValue,
            lastUpdatedAt: Date.now(),
          });
          break;
        }
      }
      
      return { portfolios: newPortfolios };
    });
  },
  
  getPortfolio: (childId) => {
    return get().portfolios.get(childId) ?? null;
  },
  
  // Allocation actions
  updateAllocation: (portfolioId, allocation) => {
    set((state) => {
      const newPortfolios = new Map(state.portfolios);
      
      for (const [childId, portfolio] of newPortfolios) {
        if (portfolio.id === portfolioId) {
          const allocations = portfolio.allocations.map((a) =>
            a.id === allocation.id ? allocation : a
          );
          newPortfolios.set(childId, {
            ...portfolio,
            allocations,
            lastUpdatedAt: Date.now(),
          });
          break;
        }
      }
      
      return { portfolios: newPortfolios };
    });
  },
  
  getAllocations: (portfolioId) => {
    for (const portfolio of get().portfolios.values()) {
      if (portfolio.id === portfolioId) {
        return portfolio.allocations;
      }
    }
    return [];
  },
  
  // History actions
  recordUpdate: (update) => {
    set((state) => {
      const newUpdates = new Map(state.updates);
      const existing = newUpdates.get(update.portfolioId) ?? [];
      newUpdates.set(update.portfolioId, [...existing, update]);
      return { updates: newUpdates };
    });
  },
  
  getUpdateHistory: (portfolioId) => {
    return get().updates.get(portfolioId) ?? [];
  },
}));
