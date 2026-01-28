import React from 'react';
import { Expense } from '@/types/expense';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { CATEGORY_COLORS } from '@/constants/categories';
import { Button } from '@/components/ui/Button';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <span
            className="px-3 py-1 text-xs font-medium rounded-full text-white"
            style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
          >
            {expense.category}
          </span>
          <span className="text-sm text-gray-600">{formatDate(expense.date)}</span>
        </div>
        <p className="text-gray-900 mb-1">{expense.description}</p>
        <p className="text-lg font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
      </div>

      <div className="flex gap-2 ml-4">
        <Button variant="secondary" onClick={() => onEdit(expense)} className="text-sm px-3 py-1">
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            if (confirm('Are you sure you want to delete this expense?')) {
              onDelete(expense.id);
            }
          }}
          className="text-sm px-3 py-1"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
