export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type TrendDirection = 'increasing' | 'decreasing' | 'stable';

export interface PeriodData {
  period: string;      // Display label
  startDate: string;
  endDate: string;
  amount: number;
  count: number;
}

export interface CategoryPeriodData {
  category: string;
  amount: number;
  count: number;
  color: string;
}

export interface SpendingInsights {
  averageDaily: number;
  averageWeekly: number;
  averageMonthly: number;
  spendingVelocity: number;
  velocityTrend: TrendDirection;
  highestSpendingDay: { date: string; amount: number } | null;
  lowestSpendingDay: { date: string; amount: number } | null;
  overallTrend: TrendDirection;
  periodComparison: {
    current: number;
    previous: number;
    change: number;
    changeDirection: TrendDirection;
  };
}

export interface AnalyticsData {
  insights: SpendingInsights;
  periodData: PeriodData[];
  categoryData: CategoryPeriodData[];
  totalExpenses: number;
  totalAmount: number;
}
