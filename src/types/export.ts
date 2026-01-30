import { Category } from './expense';

export type ExportFormat = 'csv' | 'json' | 'pdf';

export interface ExportFilters {
  startDate: string;
  endDate: string;
  categories: Category[];
}

export interface ExportConfig {
  format: ExportFormat;
  filename: string;
  filters: ExportFilters;
}
