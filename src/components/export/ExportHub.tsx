'use client';

import { useState } from 'react';
import { Expense } from '@/types/expense';
import { Modal } from '@/components/ui/Modal';
import { ExportTemplates } from './ExportTemplates';
import { ExportIntegrations } from './ExportIntegrations';
import { ExportHistory } from './ExportHistory';
import { ExportSchedule } from './ExportSchedule';
import { ExportSharing } from './ExportSharing';

interface ExportHubProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

type TabType = 'templates' | 'integrations' | 'history' | 'schedule' | 'sharing';

export function ExportHub({ isOpen, onClose, expenses }: ExportHubProps) {
  const [activeTab, setActiveTab] = useState<TabType>('templates');

  const tabs = [
    { id: 'templates' as TabType, label: 'Templates', icon: '📋' },
    { id: 'integrations' as TabType, label: 'Integrations', icon: '🔌' },
    { id: 'schedule' as TabType, label: 'Schedule', icon: '⏰' },
    { id: 'history' as TabType, label: 'History', icon: '📜' },
    { id: 'sharing' as TabType, label: 'Share', icon: '🔗' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Hub" size="large">
      <div className="flex flex-col h-[600px]">
        {/* Header with Cloud Badge */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cloud Export Center</h3>
            <p className="text-sm text-gray-600">
              Export, sync, and share your expense data anywhere
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-3 py-1 bg-green-50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">Cloud Connected</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-sky-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'templates' && <ExportTemplates expenses={expenses} />}
          {activeTab === 'integrations' && <ExportIntegrations />}
          {activeTab === 'history' && <ExportHistory />}
          {activeTab === 'schedule' && <ExportSchedule />}
          {activeTab === 'sharing' && <ExportSharing expenses={expenses} />}
        </div>
      </div>
    </Modal>
  );
}
