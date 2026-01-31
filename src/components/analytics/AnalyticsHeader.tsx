import { Expense } from '@/types/expense';
import { ExportButton } from '@/components/export/ExportButton';
import { formatCurrency } from '@/lib/formatters';

interface AnalyticsHeaderProps {
  expenseCount: number;
  totalAmount: number;
  expenses: Expense[];
}

export default function AnalyticsHeader({ expenseCount, totalAmount, expenses }: AnalyticsHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {expenseCount} expenses analyzed • {formatCurrency(totalAmount)} total
          </p>
        </div>
        <ExportButton expenses={expenses} />
      </div>
    </div>
  );
}
