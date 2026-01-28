import { useState, useMemo } from 'react';
import { Expense, Category } from '@/types/expense';
import { ExpenseFilters, DateRange } from '@/types/filters';

interface UseFiltersReturn {
  filters: ExpenseFilters;
  setCategory: (category: Category | 'all') => void;
  setDateRange: (dateRange: DateRange | null) => void;
  setSearchTerm: (searchTerm: string) => void;
  clearFilters: () => void;
  filteredExpenses: Expense[];
}

const defaultFilters: ExpenseFilters = {
  category: 'all',
  dateRange: null,
  searchTerm: '',
};

export function useFilters(expenses: Expense[]): UseFiltersReturn {
  const [filters, setFilters] = useState<ExpenseFilters>(defaultFilters);

  const setCategory = (category: Category | 'all') => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const setDateRange = (dateRange: DateRange | null) => {
    setFilters((prev) => ({ ...prev, dateRange }));
  };

  const setSearchTerm = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      // Filter by category
      if (filters.category !== 'all' && expense.category !== filters.category) {
        return false;
      }

      // Filter by date range
      if (filters.dateRange) {
        const expenseDate = new Date(expense.date);
        const startDate = new Date(filters.dateRange.startDate);
        const endDate = new Date(filters.dateRange.endDate);

        if (expenseDate < startDate || expenseDate > endDate) {
          return false;
        }
      }

      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return expense.description.toLowerCase().includes(searchLower);
      }

      return true;
    });
  }, [expenses, filters]);

  return {
    filters,
    setCategory,
    setDateRange,
    setSearchTerm,
    clearFilters,
    filteredExpenses,
  };
}
