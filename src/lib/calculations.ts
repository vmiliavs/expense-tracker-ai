import { Expense, ExpenseSummary, Category } from '@/types/expense';

export function calculateSummary(expenses: Expense[]): ExpenseSummary {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const categoryBreakdown: Record<Category, number> = {
    Food: 0,
    Transportation: 0,
    Entertainment: 0,
    Shopping: 0,
    Bills: 0,
    Other: 0,
  };

  let totalSpending = 0;
  let monthlySpending = 0;

  expenses.forEach((expense) => {
    const amount = expense.amount;
    totalSpending += amount;

    // Check if expense is in current month
    const expenseDate = new Date(expense.date);
    if (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    ) {
      monthlySpending += amount;
    }

    // Add to category breakdown
    categoryBreakdown[expense.category] += amount;
  });

  // Find top category
  let topCategory: { category: Category; amount: number } | null = null;
  let maxAmount = 0;

  (Object.keys(categoryBreakdown) as Category[]).forEach((category) => {
    const amount = categoryBreakdown[category];
    if (amount > maxAmount) {
      maxAmount = amount;
      topCategory = { category, amount };
    }
  });

  return {
    totalSpending,
    monthlySpending,
    categoryBreakdown,
    topCategory,
    expenseCount: expenses.length,
  };
}
