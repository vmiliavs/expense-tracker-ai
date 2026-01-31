import { Expense } from '@/types/expense';
import { TimePeriod, TrendDirection, SpendingInsights, PeriodData, CategoryPeriodData, AnalyticsData } from '@/types/analytics';
import { generatePeriods, getPeriodComparison } from './dateUtils';
import { CATEGORY_COLORS } from '@/constants/categories';

export function calculateAverageDaily(expenses: Expense[]): number {
  if (expenses.length === 0) return 0;

  const dates = expenses.map(e => new Date(e.date).toDateString());
  const uniqueDays = new Set(dates).size;

  if (uniqueDays === 0) return 0;

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  return total / uniqueDays;
}

export function calculateAverageWeekly(expenses: Expense[]): number {
  if (expenses.length === 0) return 0;

  const sortedExpenses = [...expenses].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const firstDate = new Date(sortedExpenses[0].date);
  const lastDate = new Date(sortedExpenses[sortedExpenses.length - 1].date);

  const daysDiff = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const weeks = Math.max(1, daysDiff / 7);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  return total / weeks;
}

export function calculateAverageMonthly(expenses: Expense[]): number {
  if (expenses.length === 0) return 0;

  const sortedExpenses = [...expenses].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const firstDate = new Date(sortedExpenses[0].date);
  const lastDate = new Date(sortedExpenses[sortedExpenses.length - 1].date);

  const monthsDiff =
    (lastDate.getFullYear() - firstDate.getFullYear()) * 12 +
    (lastDate.getMonth() - firstDate.getMonth()) + 1;

  const months = Math.max(1, monthsDiff);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  return total / months;
}

export function calculateSpendingVelocity(
  expenses: Expense[]
): { velocity: number; trend: TrendDirection } {
  if (expenses.length < 2) {
    return { velocity: 0, trend: 'stable' };
  }

  const sortedExpenses = [...expenses].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const firstDate = new Date(sortedExpenses[0].date);
  const lastDate = new Date(sortedExpenses[sortedExpenses.length - 1].date);
  const daysDiff = Math.max(1, (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const velocity = total / daysDiff;

  // Calculate trend by comparing first half vs second half
  const midpoint = sortedExpenses.length / 2;
  const firstHalf = sortedExpenses.slice(0, Math.floor(midpoint));
  const secondHalf = sortedExpenses.slice(Math.floor(midpoint));

  const firstHalfTotal = firstHalf.reduce((sum, e) => sum + e.amount, 0);
  const secondHalfTotal = secondHalf.reduce((sum, e) => sum + e.amount, 0);

  const firstHalfAvg = firstHalfTotal / Math.max(1, firstHalf.length);
  const secondHalfAvg = secondHalfTotal / Math.max(1, secondHalf.length);

  const difference = secondHalfAvg - firstHalfAvg;
  const threshold = firstHalfAvg * 0.1; // 10% threshold

  let trend: TrendDirection;
  if (Math.abs(difference) < threshold) {
    trend = 'stable';
  } else if (difference > 0) {
    trend = 'increasing';
  } else {
    trend = 'decreasing';
  }

  return { velocity, trend };
}

export function findHighestSpendingDay(expenses: Expense[]): { date: string; amount: number } | null {
  if (expenses.length === 0) return null;

  const dailyTotals = new Map<string, number>();

  expenses.forEach(expense => {
    const dateKey = new Date(expense.date).toDateString();
    dailyTotals.set(dateKey, (dailyTotals.get(dateKey) || 0) + expense.amount);
  });

  let maxDate = '';
  let maxAmount = 0;

  dailyTotals.forEach((amount, date) => {
    if (amount > maxAmount) {
      maxAmount = amount;
      maxDate = date;
    }
  });

  return maxAmount > 0 ? { date: maxDate, amount: maxAmount } : null;
}

export function findLowestSpendingDay(expenses: Expense[]): { date: string; amount: number } | null {
  if (expenses.length === 0) return null;

  const dailyTotals = new Map<string, number>();

  expenses.forEach(expense => {
    const dateKey = new Date(expense.date).toDateString();
    dailyTotals.set(dateKey, (dailyTotals.get(dateKey) || 0) + expense.amount);
  });

  let minDate = '';
  let minAmount = Infinity;

  dailyTotals.forEach((amount, date) => {
    if (amount > 0 && amount < minAmount) {
      minAmount = amount;
      minDate = date;
    }
  });

  return minAmount < Infinity ? { date: minDate, amount: minAmount } : null;
}

export function calculateOverallTrend(expenses: Expense[]): TrendDirection {
  if (expenses.length < 3) return 'stable';

  const sortedExpenses = [...expenses].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Simple linear regression
  const n = sortedExpenses.length;

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  sortedExpenses.forEach((expense, index) => {
    const x = index;
    const y = expense.amount;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

  const avgAmount = sumY / n;
  const threshold = avgAmount * 0.05; // 5% threshold

  if (Math.abs(slope) < threshold) {
    return 'stable';
  } else if (slope > 0) {
    return 'increasing';
  } else {
    return 'decreasing';
  }
}

export function calculatePeriodComparison(
  expenses: Expense[],
  period: TimePeriod
): {
  current: number;
  previous: number;
  change: number;
  changeDirection: TrendDirection;
} {
  const { currentStart, currentEnd, previousStart, previousEnd } = getPeriodComparison(period);

  const currentExpenses = expenses.filter(e => {
    const date = new Date(e.date);
    return date >= currentStart && date <= currentEnd;
  });

  const previousExpenses = expenses.filter(e => {
    const date = new Date(e.date);
    return date >= previousStart && date <= previousEnd;
  });

  const currentTotal = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
  const previousTotal = previousExpenses.reduce((sum, e) => sum + e.amount, 0);

  const change = previousTotal === 0 ? 0 : ((currentTotal - previousTotal) / previousTotal) * 100;

  let changeDirection: TrendDirection;
  if (Math.abs(change) < 5) {
    changeDirection = 'stable';
  } else if (change > 0) {
    changeDirection = 'increasing';
  } else {
    changeDirection = 'decreasing';
  }

  return {
    current: currentTotal,
    previous: previousTotal,
    change,
    changeDirection
  };
}

export function groupByPeriod(expenses: Expense[], period: TimePeriod): PeriodData[] {
  if (expenses.length === 0) return [];

  const sortedExpenses = [...expenses].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const firstDate = new Date(sortedExpenses[0].date);
  const lastDate = new Date(sortedExpenses[sortedExpenses.length - 1].date);

  const periods = generatePeriods(firstDate, lastDate, period);

  return periods.map(p => {
    const periodExpenses = expenses.filter(e => {
      const date = new Date(e.date);
      return date >= p.start && date <= p.end;
    });

    return {
      period: p.label,
      startDate: p.start.toISOString(),
      endDate: p.end.toISOString(),
      amount: periodExpenses.reduce((sum, e) => sum + e.amount, 0),
      count: periodExpenses.length
    };
  });
}

export function groupByCategory(expenses: Expense[]): CategoryPeriodData[] {
  const categoryTotals = new Map<string, { amount: number; count: number }>();

  expenses.forEach(expense => {
    const existing = categoryTotals.get(expense.category) || { amount: 0, count: 0 };
    categoryTotals.set(expense.category, {
      amount: existing.amount + expense.amount,
      count: existing.count + 1
    });
  });

  const result: CategoryPeriodData[] = [];
  categoryTotals.forEach((data, category) => {
    if (data.amount > 0) {
      result.push({
        category,
        amount: data.amount,
        count: data.count,
        color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other
      });
    }
  });

  return result.sort((a, b) => b.amount - a.amount);
}

export function calculateInsights(expenses: Expense[], period: TimePeriod): SpendingInsights {
  const { velocity, trend: velocityTrend } = calculateSpendingVelocity(expenses);

  return {
    averageDaily: calculateAverageDaily(expenses),
    averageWeekly: calculateAverageWeekly(expenses),
    averageMonthly: calculateAverageMonthly(expenses),
    spendingVelocity: velocity,
    velocityTrend,
    highestSpendingDay: findHighestSpendingDay(expenses),
    lowestSpendingDay: findLowestSpendingDay(expenses),
    overallTrend: calculateOverallTrend(expenses),
    periodComparison: calculatePeriodComparison(expenses, period)
  };
}

export function processAnalyticsData(expenses: Expense[], period: TimePeriod): AnalyticsData {
  return {
    insights: calculateInsights(expenses, period),
    periodData: groupByPeriod(expenses, period),
    categoryData: groupByCategory(expenses),
    totalExpenses: expenses.length,
    totalAmount: expenses.reduce((sum, e) => sum + e.amount, 0)
  };
}
