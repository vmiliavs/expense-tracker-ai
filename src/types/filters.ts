import { Category } from './expense';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface ExpenseFilters {
  category: Category | 'all';
  dateRange: DateRange | null;
  searchTerm: string;
}
