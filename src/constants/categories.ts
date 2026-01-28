import { Category } from '@/types/expense';

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#10b981',           // green
  Transportation: '#3b82f6', // blue
  Entertainment: '#a855f7',  // purple
  Shopping: '#ec4899',       // pink
  Bills: '#ef4444',          // red
  Other: '#6b7280',          // gray
};

export const CATEGORIES: Category[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
];
