'use client';

import { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { RecentExpenses } from '@/components/dashboard/RecentExpenses';
import { Modal } from '@/components/ui/Modal';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Expense } from '@/types/expense';

export default function DashboardPage() {
  const { expenses, addExpense, updateExpense } = useExpenses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

  const handleAddExpense = () => {
    setEditingExpense(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(undefined);
  };

  const handleSubmit = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, expenseData);
    } else {
      await addExpense(expenseData);
    }
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddExpense={handleAddExpense} />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        </div>

        <div className="space-y-6">
          <SummaryCards expenses={expenses} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingChart expenses={expenses} />
            <CategoryChart expenses={expenses} />
          </div>

          <RecentExpenses expenses={expenses} />
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <ExpenseForm expense={editingExpense} onSubmit={handleSubmit} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
}
