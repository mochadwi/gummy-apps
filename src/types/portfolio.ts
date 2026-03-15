/**
 * Portfolio and investment simulation domain model
 * Navigator cohort only (10-14)
 */

export type FundType = 'safe' | 'growth' | 'fun';
export type AllocationChangeType = 'rebalance' | 'dividend_reinvest';

export interface Fund {
  id: string;
  type: FundType;
  name: string;
  description: string;
  expectedAnnualReturn: number; // percentage, e.g., 2.1
  volatility: 'low' | 'medium' | 'high';
  assets: string[]; // e.g., ["Bonds", "Savings"], ["Stocks"], ["Crypto Memes"]
}

export interface Portfolio {
  id: string;
  childId: string;
  totalValue: number; // in dollars or coins
  lastUpdatedAt: number;
  allocations: Allocation[];
  createdAt: number;
}

export interface Allocation {
  id: string;
  portfolioId: string;
  fundId: string;
  fundType: FundType;
  quantityCoins: number; // coins invested
  valueCoins: number; // current value in coins
  percentageOfPortfolio: number;
  gainLoss: number; // realized gain/loss
  lastUpdatedAt: number;
}

export interface PortfolioUpdate {
  id: string;
  portfolioId: string;
  timestamp: number;
  previousTotalValue: number;
  newTotalValue: number;
  change: number; // positive or negative
  changePercent: number;
  dailyReturn: number; // today's simulated return
  allocationChanges: AllocationChange[];
}

export interface AllocationChange {
  fundType: FundType;
  previousValue: number;
  newValue: number;
  changeAmount: number;
  changePercent: number;
}

export interface PortfolioChallenge {
  id: string;
  portfolioId: string;
  title: string;
  description: string;
  target: 'hold_volatile' | 'achieve_return' | 'rebalance';
  durationDays: number;
  rewardBonus: number;
  startedAt: number;
  completedAt?: number;
}
