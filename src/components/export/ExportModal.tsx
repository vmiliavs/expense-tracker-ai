import React, { useState } from 'react';
import { Expense } from '@/types/expense';
import { exportToCSV, exportToJSON, exportToPDF } from '@/lib/export';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

type ExportFormat = 'csv' | 'json' | 'pdf';

interface FormatOption {
  id: ExportFormat;
  name: string;
  description: string;
  icon: JSX.Element;
}

const formatOptions: FormatOption[] = [
  {
    id: 'csv',
    name: 'CSV',
    description: 'Spreadsheet format compatible with Excel and Google Sheets',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    id: 'json',
    name: 'JSON',
    description: 'Data format with metadata and summary information',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    id: 'pdf',
    name: 'PDF',
    description: 'Formatted report with summary and category breakdown',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

export function ExportModal({ isOpen, onClose, expenses }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Use setTimeout to ensure loading state is visible
      await new Promise(resolve => setTimeout(resolve, 100));

      switch (selectedFormat) {
        case 'csv':
          exportToCSV(expenses);
          break;
        case 'json':
          exportToJSON(expenses);
          break;
        case 'pdf':
          exportToPDF(expenses);
          break;
      }

      // Close modal after successful export
      setTimeout(() => {
        onClose();
        setIsExporting(false);
      }, 300);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
      setIsExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Data">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Select a format to export your expense data:
        </p>

        <div className="space-y-3">
          {formatOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedFormat(option.id)}
              className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                selectedFormat === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`flex-shrink-0 ${
                    selectedFormat === option.id ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3
                      className={`font-semibold ${
                        selectedFormat === option.id ? 'text-blue-900' : 'text-gray-900'
                      }`}
                    >
                      {option.name}
                    </h3>
                    {selectedFormat === option.id && (
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 inline"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Exporting...
              </>
            ) : (
              'Export'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
