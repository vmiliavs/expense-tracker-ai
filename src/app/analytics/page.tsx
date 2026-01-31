'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import TimePeriodSelector from '@/components/analytics/TimePeriodSelector';
import InsightCards from '@/components/analytics/InsightCards';
import SpendingTrendsChart from '@/components/analytics/SpendingTrendsChart';
import CategoryComparisonChart from '@/components/analytics/CategoryComparisonChart';
import HighlightSection from '@/components/analytics/HighlightSection';
import { useExpenses } from '@/hooks/useExpenses';
import { useTimePeriod } from '@/hooks/useTimePeriod';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function AnalyticsPage() {
  const { expenses, addExpense } = useExpenses();
  const { period, setPeriod } = useTimePeriod('monthly');
  const { data } = useAnalytics(expenses, period);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddExpense = () => {
    setIsFormOpen(true);
  };

  if (expenses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onAddExpense={handleAddExpense} />
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
            <p className="text-gray-600 mb-8">
              No expenses to analyze yet. Add your first expense to see insights.
            </p>
            <button
              onClick={handleAddExpense}
              className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              Add Your First Expense
            </button>
          </div>
        </main>
        {isFormOpen && (
          <ExpenseForm
            onSubmit={addExpense}
            onCancel={() => setIsFormOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddExpense={handleAddExpense} />
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnalyticsHeader
          expenseCount={data.totalExpenses}
          totalAmount={data.totalAmount}
          expenses={expenses}
        />

        <div className="space-y-6">
          <TimePeriodSelector period={period} onChange={setPeriod} />

          <InsightCards insights={data.insights} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingTrendsChart data={data.periodData} period={period} />
            <CategoryComparisonChart data={data.categoryData} period={period} />
          </div>

          <HighlightSection
            highestDay={data.insights.highestSpendingDay}
            lowestDay={data.insights.lowestSpendingDay}
          />
        </div>
      </main>

      {isFormOpen && (
        <ExpenseForm
          onSubmit={addExpense}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
