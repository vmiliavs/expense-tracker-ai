import { Expense } from '@/types/expense';
import { ExportFilters } from '@/types/export';

export function filterExpensesForExport(
  expenses: Expense[],
  filters: ExportFilters
): Expense[] {
  return expenses.filter((expense) => {
    // Date range filter
    const expenseDate = new Date(expense.date);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    if (startDate && expenseDate < startDate) return false;
    if (endDate && expenseDate > endDate) return false;

    // Category filter
    if (filters.categories.length > 0) {
      if (!filters.categories.includes(expense.category)) return false;
    }

    return true;
  });
}

export function generateDefaultFilename(format: string): string {
  const date = new Date().toISOString().split('T')[0];
  return `expenses-export-${date}.${format}`;
}

export function calculateExportSummary(expenses: Expense[]) {
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categoryBreakdown: Record<string, number> = {};

  expenses.forEach((expense) => {
    if (!categoryBreakdown[expense.category]) {
      categoryBreakdown[expense.category] = 0;
    }
    categoryBreakdown[expense.category] += expense.amount;
  });

  return {
    recordCount: expenses.length,
    totalAmount,
    categoryBreakdown,
  };
}
