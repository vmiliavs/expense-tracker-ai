import React from 'react';
import { Category } from '@/types/expense';
import { CATEGORIES } from '@/constants/categories';
import { DateRange } from '@/types/filters';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ExpenseFiltersProps {
  category: Category | 'all';
  dateRange: DateRange | null;
  onCategoryChange: (category: Category | 'all') => void;
  onDateRangeChange: (dateRange: DateRange | null) => void;
  onClearFilters: () => void;
}

export function ExpenseFilters({
  category,
  dateRange,
  onCategoryChange,
  onDateRangeChange,
  onClearFilters,
}: ExpenseFiltersProps) {
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...CATEGORIES.map((cat) => ({ value: cat, label: cat })),
  ];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <Select
            label="Category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value as Category | 'all')}
            options={categoryOptions}
          />
        </div>

        <div className="flex-1">
          <Input
            label="Start Date"
            type="date"
            value={dateRange?.startDate || ''}
            onChange={(e) => {
              const startDate = e.target.value;
              onDateRangeChange(
                startDate
                  ? {
                      startDate,
                      endDate: dateRange?.endDate || startDate,
                    }
                  : null
              );
            }}
          />
        </div>

        <div className="flex-1">
          <Input
            label="End Date"
            type="date"
            value={dateRange?.endDate || ''}
            onChange={(e) => {
              const endDate = e.target.value;
              if (dateRange?.startDate) {
                onDateRangeChange({
                  startDate: dateRange.startDate,
                  endDate,
                });
              }
            }}
            disabled={!dateRange?.startDate}
          />
        </div>

        <Button variant="secondary" onClick={onClearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
