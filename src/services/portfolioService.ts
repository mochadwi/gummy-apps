/**
 * Portfolio service
 * Business logic for investment simulation (Navigator only)
 */

import { Portfolio, Allocation, Fund, PortfolioUpdate, AllocationChange } from '@types/portfolio';
import { usePortfolioStore } from '@stores/portfolioStore';

const FUNDS: Fund[] = [
  {
    id: 'fund_safe',
    type: 'safe',
    name: 'Safe Fund',
    description: 'Bonds and savings accounts',
    expectedAnnualReturn: 2.1,
    volatility: 'low',
    assets: ['Bonds', 'High-yield savings'],
  },
  {
    id: 'fund_growth',
    type: 'growth',
    name: 'Growth Fund',
    description: 'Diversified stock portfolio',
    expectedAnnualReturn: 8.5,
    volatility: 'medium',
    assets: ['US Stocks', 'International Stocks', 'ETFs'],
  },
  {
    id: 'fund_fun',
    type: 'fun',
    name: 'Fun Fund',
    description: 'High-risk, high-reward assets',
    expectedAnnualReturn: 12.0,
    volatility: 'high',
    assets: ['Tech stocks', 'Crypto-inspired', 'Memes'],
  },
];

export const portfolioService = {
  /**
   * Create initial portfolio for a Navigator child
   */
  createPortfolio(childId: string): Portfolio {
    const portfolio: Portfolio = {
      id: this.generateId(),
      childId,
      totalValue: 0,
      lastUpdatedAt: Date.now(),
      allocations: [],
      createdAt: Date.now(),
    };
    
    usePortfolioStore.getState().createPortfolio(portfolio);
    return portfolio;
  },

  /**
   * Allocate coins to a fund
   */
  allocateCoins(
    portfolioId: string,
    childId: string,
    fundType: 'safe' | 'growth' | 'fun',
    amountCoins: number
  ): Allocation {
    const fund = FUNDS.find((f) => f.type === fundType)!;
    
    const allocation: Allocation = {
      id: this.generateId(),
      portfolioId,
      fundId: fund.id,
      fundType,
      quantityCoins: amountCoins,
      valueCoins: amountCoins,
      percentageOfPortfolio: this.calculatePercentage(portfolioId, amountCoins),
      gainLoss: 0,
      lastUpdatedAt: Date.now(),
    };
    
    usePortfolioStore.getState().updateAllocation(portfolioId, allocation);
    
    // Update portfolio total value
    const portfolio = this.getPortfolio(childId);
    if (portfolio) {
      const newTotal = portfolio.allocations.reduce((sum, a) => sum + a.valueCoins, 0) + amountCoins;
      usePortfolioStore.getState().updatePortfolioValue(portfolioId, newTotal);
    }
    
    return allocation;
  },

  /**
   * Rebalance portfolio (move coins between funds)
   */
  rebalance(
    portfolioId: string,
    fundAllocations: { fundType: 'safe' | 'growth' | 'fun'; percentageTarget: number }[]
  ): void {
    const portfolio = this.getPortfolioById(portfolioId);
    if (!portfolio) return;
    
    const allocations = usePortfolioStore.getState().getAllocations(portfolioId);
    
    // Recalculate allocations based on percentages
    fundAllocations.forEach(({ fundType, percentageTarget }) => {
      const targetValue = (portfolio.totalValue * percentageTarget) / 100;
      const existing = allocations.find((a) => a.fundType === fundType);
      
      if (existing) {
        usePortfolioStore.getState().updateAllocation(portfolioId, {
          ...existing,
          quantityCoins: targetValue,
          valueCoins: targetValue,
          percentageOfPortfolio: percentageTarget,
          lastUpdatedAt: Date.now(),
        });
      }
    });
  },

  /**
   * Simulate daily market returns
   */
  simulateDailyReturns(childId: string): PortfolioUpdate {
    const portfolio = this.getPortfolio(childId);
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }
    
    const allocations = usePortfolioStore.getState().getAllocations(portfolio.id);
    const previousTotal = portfolio.totalValue;
    
    const allocationChanges: AllocationChange[] = allocations.map((allocation) => {
      const fund = FUNDS.find((f) => f.id === allocation.fundId)!;
      
      // Daily return = annual return / 365 with some randomness
      const dailyReturnPercent = (fund.expectedAnnualReturn / 365) * (0.8 + Math.random() * 0.4);
      const newValue = allocation.valueCoins * (1 + dailyReturnPercent / 100);
      
      // Update allocation
      usePortfolioStore.getState().updateAllocation(portfolio.id, {
        ...allocation,
        valueCoins: newValue,
        gainLoss: newValue - allocation.quantityCoins,
        lastUpdatedAt: Date.now(),
      });
      
      return {
        fundType: allocation.fundType,
        previousValue: allocation.valueCoins,
        newValue,
        changeAmount: newValue - allocation.valueCoins,
        changePercent: ((newValue - allocation.valueCoins) / allocation.valueCoins) * 100,
      };
    });
    
    // Update portfolio
    const newTotal = allocations.reduce((sum, a) => sum + a.valueCoins, 0);
    usePortfolioStore.getState().updatePortfolioValue(portfolio.id, newTotal);
    
    const update: PortfolioUpdate = {
      id: this.generateId(),
      portfolioId: portfolio.id,
      timestamp: Date.now(),
      previousTotalValue: previousTotal,
      newTotalValue: newTotal,
      change: newTotal - previousTotal,
      changePercent: ((newTotal - previousTotal) / previousTotal) * 100,
      dailyReturn: newTotal - previousTotal,
      allocationChanges,
    };
    
    usePortfolioStore.getState().recordUpdate(update);
    return update;
  },

  /**
   * Get portfolio for a child
   */
  getPortfolio(childId: string): Portfolio | null {
    return usePortfolioStore.getState().getPortfolio(childId);
  },

  /**
   * Get portfolio by ID
   */
  getPortfolioById(portfolioId: string): Portfolio | null {
    for (const portfolio of usePortfolioStore.getState().portfolios.values()) {
      if (portfolio.id === portfolioId) return portfolio;
    }
    return null;
  },

  /**
   * Get portfolio performance metrics
   */
  getPerformanceMetrics(childId: string): {
    totalValue: number;
    totalGain: number;
    totalGainPercent: number;
    allocations: Allocation[];
  } | null {
    const portfolio = this.getPortfolio(childId);
    if (!portfolio) return null;
    
    const allocations = usePortfolioStore.getState().getAllocations(portfolio.id);
    const totalGain = allocations.reduce((sum, a) => sum + a.gainLoss, 0);
    const totalGainPercent =
      allocations.length > 0
        ? (totalGain / allocations.reduce((sum, a) => sum + a.quantityCoins, 0)) * 100
        : 0;
    
    return {
      totalValue: portfolio.totalValue,
      totalGain,
      totalGainPercent,
      allocations,
    };
  },

  /**
   * Get available funds
   */
  getAvailableFunds(): Fund[] {
    return FUNDS;
  },

  /**
   * Get update history for portfolio
   */
  getUpdateHistory(childId: string): PortfolioUpdate[] {
    const portfolio = this.getPortfolio(childId);
    if (!portfolio) return [];
    return usePortfolioStore.getState().getUpdateHistory(portfolio.id);
  },

  // Helpers

  private calculatePercentage(portfolioId: string, addedCoins: number): number {
    const allocations = usePortfolioStore.getState().getAllocations(portfolioId);
    const currentTotal = allocations.reduce((sum, a) => sum + a.valueCoins, 0);
    const newTotal = currentTotal + addedCoins;
    return (addedCoins / newTotal) * 100;
  },

  private generateId(): string {
    return `port_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  },
};
