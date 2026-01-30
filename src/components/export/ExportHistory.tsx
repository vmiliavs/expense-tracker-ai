'use client';

import { useState } from 'react';
import { ExportHistory as ExportHistoryType } from '@/types/cloud-export';
import { Button } from '@/components/ui/Button';

export function ExportHistory() {
  const [history] = useState<ExportHistoryType[]>([
    {
      id: '1',
      templateName: 'Monthly Summary',
      destination: 'Email',
      timestamp: '2026-01-30T07:30:00Z',
      recordCount: 45,
      status: 'completed',
      shareLink: 'https://expense.app/share/abc123',
    },
    {
      id: '2',
      templateName: 'Tax Report',
      destination: 'Google Sheets',
      timestamp: '2026-01-29T15:20:00Z',
      recordCount: 120,
      status: 'completed',
      shareLink: 'https://expense.app/share/def456',
    },
    {
      id: '3',
      templateName: 'Category Analysis',
      destination: 'Dropbox',
      timestamp: '2026-01-28T10:15:00Z',
      recordCount: 89,
      status: 'completed',
    },
    {
      id: '4',
      templateName: 'Custom Export',
      destination: 'Email',
      timestamp: '2026-01-27T14:45:00Z',
      recordCount: 34,
      status: 'failed',
    },
  ]);

  const getStatusBadge = (status: ExportHistoryType['status']) => {
    const config = {
      completed: { color: 'bg-green-100 text-green-700', icon: '✓' },
      failed: { color: 'bg-red-100 text-red-700', icon: '✗' },
      processing: { color: 'bg-yellow-100 text-yellow-700', icon: '⋯' },
    };

    const { color, icon } = config[status];

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${color} flex items-center space-x-1`}>
        <span>{icon}</span>
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const handleDownload = (id: string) => {
    alert(`Downloading export ${id}...`);
  };

  const handleShare = (shareLink: string) => {
    navigator.clipboard.writeText(shareLink);
    alert('Share link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Export History</h4>
          <p className="text-xs text-gray-600">
            Track and manage your previous exports
          </p>
        </div>
        <Button variant="secondary" className="text-xs">
          Clear History
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Total Exports</p>
          <p className="text-xl font-bold text-gray-900">{history.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">This Month</p>
          <p className="text-xl font-bold text-gray-900">
            {history.filter((h) => new Date(h.timestamp).getMonth() === new Date().getMonth()).length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Success Rate</p>
          <p className="text-xl font-bold text-green-600">
            {Math.round((history.filter((h) => h.status === 'completed').length / history.length) * 100)}%
          </p>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-sky-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h5 className="text-sm font-semibold text-gray-900">
                    {item.templateName}
                  </h5>
                  {getStatusBadge(item.status)}
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                  <div>
                    <span className="text-gray-500">Destination:</span>{' '}
                    <span className="font-medium text-gray-900">{item.destination}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Records:</span>{' '}
                    <span className="font-medium text-gray-900">{item.recordCount}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Timestamp:</span>{' '}
                    <span className="font-medium text-gray-900">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                {item.shareLink && (
                  <div className="mt-2 flex items-center space-x-2">
                    <button
                      onClick={() => handleShare(item.shareLink!)}
                      className="text-xs text-sky-600 hover:text-sky-700 font-medium"
                    >
                      Copy share link
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                {item.status === 'completed' && (
                  <>
                    <button
                      onClick={() => handleDownload(item.id)}
                      className="p-2 text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded"
                      title="Download"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button
                      className="p-2 text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded"
                      title="View"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
