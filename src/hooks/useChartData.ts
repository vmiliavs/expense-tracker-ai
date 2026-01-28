import { useMemo } from 'react';
import { Expense, Category } from '@/types/expense';
import { CATEGORY_COLORS } from '@/constants/categories';

interface SpendingByDate {
  date: string;
  amount: number;
}

interface CategoryData {
  category: string;
  amount: number;
  color: string;
}

interface UseChartDataReturn {
  spendingByDate: SpendingByDate[];
  categoryData: CategoryData[];
}

export function useChartData(expenses: Expense[]): UseChartDataReturn {
  const spendingByDate = useMemo(() => {
    const dateMap = new Map<string, number>();

    expenses.forEach((expense) => {
      const currentAmount = dateMap.get(expense.date) || 0;
      dateMap.set(expense.date, currentAmount + expense.amount);
    });

    return Array.from(dateMap.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [expenses]);

  const categoryData = useMemo(() => {
    const categoryMap = new Map<Category, number>();

    expenses.forEach((expense) => {
      const currentAmount = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentAmount + expense.amount);
    });

    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        color: CATEGORY_COLORS[category],
      }))
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  return {
    spendingByDate,
    categoryData,
  };
}
