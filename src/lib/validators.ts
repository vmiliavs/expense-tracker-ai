import { Expense, Category } from '@/types/expense';
import { CATEGORIES } from '@/constants/categories';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export function validateExpense(expense: Partial<Expense>): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate date
  if (!expense.date) {
    errors.push({ field: 'date', message: 'Date is required' });
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(expense.date)) {
      errors.push({ field: 'date', message: 'Date must be in YYYY-MM-DD format' });
    }
  }

  // Validate amount
  if (expense.amount === undefined || expense.amount === null) {
    errors.push({ field: 'amount', message: 'Amount is required' });
  } else if (expense.amount <= 0) {
    errors.push({ field: 'amount', message: 'Amount must be greater than 0' });
  }

  // Validate category
  if (!expense.category) {
    errors.push({ field: 'category', message: 'Category is required' });
  } else if (!CATEGORIES.includes(expense.category as Category)) {
    errors.push({ field: 'category', message: 'Invalid category' });
  }

  // Validate description
  if (!expense.description) {
    errors.push({ field: 'description', message: 'Description is required' });
  } else if (expense.description.length < 1 || expense.description.length > 200) {
    errors.push({ field: 'description', message: 'Description must be 1-200 characters' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
