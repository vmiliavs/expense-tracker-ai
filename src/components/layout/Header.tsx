import React from 'react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  onAddExpense: () => void;
}

export function Header({ onAddExpense }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="text-sm text-gray-600">Manage your expenses efficiently</p>
        </div>
        <Button onClick={onAddExpense}>Add Expense</Button>
      </div>
    </header>
  );
}
