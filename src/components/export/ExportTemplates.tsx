'use client';

import { useState } from 'react';
import { Expense } from '@/types/expense';
import { EXPORT_TEMPLATES } from '@/lib/exportTemplates';
import { Button } from '@/components/ui/Button';

interface ExportTemplatesProps {
  expenses: Expense[];
}

export function ExportTemplates({ expenses }: ExportTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (templateId: string) => {
    setIsExporting(true);
    setSelectedTemplate(templateId);

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert(`Export complete! "${EXPORT_TEMPLATES.find(t => t.id === templateId)?.name}" has been generated.`);
    setIsExporting(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-1">Export Templates</h4>
        <p className="text-xs text-gray-600">
          Pre-configured templates for different export needs
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXPORT_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-sky-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{template.icon}</div>
                <div>
                  <h5 className="text-sm font-semibold text-gray-900">
                    {template.name}
                  </h5>
                  <p className="text-xs text-gray-600 mt-1">
                    {template.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Template Details */}
            <div className="flex items-center space-x-4 mb-3 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <span>Format:</span>
                <span className="font-medium text-gray-700 uppercase">
                  {template.format}
                </span>
              </div>
              {template.includeCharts && (
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  <span>Charts included</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <Button
              variant="primary"
              onClick={() => handleExport(template.id)}
              disabled={isExporting || expenses.length === 0}
              loading={isExporting && selectedTemplate === template.id}
              className="w-full text-sm"
            >
              {isExporting && selectedTemplate === template.id
                ? 'Generating...'
                : 'Use Template'}
            </Button>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg p-4 border border-sky-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 mb-1">Ready to Export</p>
            <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
            <p className="text-xs text-gray-600">expense records</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600 mb-1">Total Value</p>
            <p className="text-2xl font-bold text-gray-900">
              ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
