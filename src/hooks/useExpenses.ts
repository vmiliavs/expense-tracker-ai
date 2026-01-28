import { useState } from 'react';
import { Expense } from '@/types/expense';
import { useLocalStorage } from './useLocalStorage';
import { validateExpense } from '@/lib/validators';

interface UseExpensesReturn {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useExpenses(): UseExpensesReturn {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);

    try {
      const validation = validateExpense(expense);
      if (!validation.isValid) {
        throw new Error(validation.errors[0].message);
      }

      const newExpense: Expense = {
        ...expense,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setExpenses((prev) => [...prev, newExpense]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add expense';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateExpense = async (id: string, updatedFields: Partial<Expense>) => {
    setIsLoading(true);
    setError(null);

    try {
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === id
            ? {
                ...expense,
                ...updatedFields,
                updatedAt: new Date().toISOString(),
              }
            : expense
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update expense';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete expense';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    isLoading,
    error,
  };
}
