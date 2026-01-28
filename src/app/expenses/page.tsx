'use client';

import { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useFilters } from '@/hooks/useFilters';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { ExpenseFilters } from '@/components/expenses/ExpenseFilters';
import { ExpenseSearch } from '@/components/expenses/ExpenseSearch';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExportButton } from '@/components/export/ExportButton';
import { Modal } from '@/components/ui/Modal';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Expense } from '@/types/expense';

export default function ExpensesPage() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const { filters, setCategory, setDateRange, setSearchTerm, clearFilters, filteredExpenses } = useFilters(expenses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

  const handleAddExpense = () => {
    setEditingExpense(undefined);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
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

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddExpense={handleAddExpense} />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Expenses</h2>
            <p className="text-gray-600 mt-1">
              {filteredExpenses.length} of {expenses.length} expenses
            </p>
          </div>
          <ExportButton expenses={filteredExpenses} />
        </div>

        <div className="space-y-6">
          <ExpenseFilters
            category={filters.category}
            dateRange={filters.dateRange}
            onCategoryChange={setCategory}
            onDateRangeChange={setDateRange}
            onClearFilters={clearFilters}
          />

          <ExpenseSearch onSearch={setSearchTerm} />

          <ExpenseList
            expenses={filteredExpenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
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
