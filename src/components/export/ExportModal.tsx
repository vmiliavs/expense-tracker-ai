'use client';

import { useState, useMemo } from 'react';
import { Expense, Category } from '@/types/expense';
import { ExportFormat, ExportFilters } from '@/types/export';
import { CATEGORIES } from '@/constants/categories';
import { exportExpenses } from '@/lib/exportFormats';
import { filterExpensesForExport, generateDefaultFilename, calculateExportSummary } from '@/lib/exportUtils';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

export function ExportModal({ isOpen, onClose, expenses }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [filename, setFilename] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [filters, setFilters] = useState<ExportFilters>({
    startDate: '',
    endDate: '',
    categories: [],
  });

  // Filter expenses based on current filters
  const filteredExpenses = useMemo(
    () => filterExpensesForExport(expenses, filters),
    [expenses, filters]
  );

  // Calculate summary
  const summary = useMemo(
    () => calculateExportSummary(filteredExpenses),
    [filteredExpenses]
  );

  // Reset form when modal opens
  const handleModalOpen = () => {
    if (isOpen) {
      setFormat('csv');
      setFilename('');
      setFilters({ startDate: '', endDate: '', categories: [] });
      setShowPreview(false);
    }
  };

  useMemo(handleModalOpen, [isOpen]);

  const handleFormatChange = (newFormat: ExportFormat) => {
    setFormat(newFormat);
    setFilename(''); // Reset filename when format changes
  };

  const handleCategoryToggle = (category: Category) => {
    setFilters((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });
  };

  const handleSelectAllCategories = () => {
    setFilters((prev) => ({ ...prev, categories: [...CATEGORIES] }));
  };

  const handleDeselectAllCategories = () => {
    setFilters((prev) => ({ ...prev, categories: [] }));
  };

  const handleExport = async () => {
    if (filteredExpenses.length === 0) {
      alert('No expenses match the selected filters');
      return;
    }

    setIsLoading(true);

    // Simulate processing delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const exportFilename = filename || generateDefaultFilename(format);
      exportExpenses(filteredExpenses, { filename: exportFilename, format });

      // Reset and close on success
      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 500);
    } catch (error) {
      setIsLoading(false);
      alert('Export failed. Please try again.');
      console.error('Export error:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Data">
      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['csv', 'json', 'pdf'] as ExportFormat[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => handleFormatChange(fmt)}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  format === fmt
                    ? 'border-sky-600 bg-sky-50 text-sky-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium uppercase">{fmt}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Filename Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filename (optional)
          </label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder={generateDefaultFilename(format)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty to use default filename
          </p>
        </div>

        {/* Date Range Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range (optional)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Categories (optional)
            </label>
            <div className="space-x-2">
              <button
                onClick={handleSelectAllCategories}
                className="text-xs text-sky-600 hover:text-sky-700"
              >
                Select All
              </button>
              <button
                onClick={handleDeselectAllCategories}
                className="text-xs text-gray-600 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((category) => (
              <label
                key={category}
                className="flex items-center space-x-2 p-2 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Export Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Export Summary</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600">Records to Export</p>
              <p className="text-2xl font-bold text-gray-900">{summary.recordCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ${summary.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
          {summary.recordCount > 0 && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="mt-3 text-xs text-sky-600 hover:text-sky-700 font-medium"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          )}
        </div>

        {/* Preview Table */}
        {showPreview && filteredExpenses.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExpenses.slice(0, 10).map((expense) => (
                    <tr key={expense.id}>
                      <td className="px-3 py-2 text-xs text-gray-900">{expense.date}</td>
                      <td className="px-3 py-2 text-xs text-gray-900">{expense.category}</td>
                      <td className="px-3 py-2 text-xs text-gray-900">
                        ${expense.amount.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-500 truncate max-w-xs">
                        {expense.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredExpenses.length > 10 && (
              <div className="bg-gray-50 px-3 py-2 text-xs text-gray-600 text-center">
                Showing 10 of {filteredExpenses.length} records
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            loading={isLoading}
            disabled={isLoading || filteredExpenses.length === 0}
          >
            {isLoading ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
