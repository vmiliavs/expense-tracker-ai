import React from 'react';
import Link from 'next/link';
import { Expense } from '@/types/expense';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { CATEGORY_COLORS } from '@/constants/categories';
import { Card } from '@/components/ui/Card';

interface RecentExpensesProps {
  expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (recentExpenses.length === 0) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Expenses</h2>
        </div>
        <div className="text-center py-8 text-gray-500">No expenses yet</div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Expenses</h2>
        <Link href="/expenses" className="text-sm text-sky-600 hover:text-sky-700">
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {recentExpenses.map((expense) => (
          <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="px-2 py-0.5 text-xs font-medium rounded text-white"
                  style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
                >
                  {expense.category}
                </span>
                <span className="text-xs text-gray-600">{formatDate(expense.date)}</span>
              </div>
              <p className="text-sm text-gray-900">{expense.description}</p>
            </div>
            <p className="text-sm font-semibold text-gray-900 ml-4">
              {formatCurrency(expense.amount)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
