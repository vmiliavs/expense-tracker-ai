'use client';

import { useState } from 'react';
import { ScheduledExport, ExportFrequency, ExportTemplate, IntegrationType } from '@/types/cloud-export';
import { Button } from '@/components/ui/Button';
import { EXPORT_TEMPLATES } from '@/lib/exportTemplates';

export function ExportSchedule() {
  const [schedules, setSchedules] = useState<ScheduledExport[]>([
    {
      id: '1',
      template: 'monthly-summary',
      destination: 'email',
      frequency: 'monthly',
      nextRun: '2026-02-01T09:00:00Z',
      enabled: true,
      email: 'user@example.com',
    },
    {
      id: '2',
      template: 'tax-report',
      destination: 'google-sheets',
      frequency: 'quarterly',
      nextRun: '2026-04-01T09:00:00Z',
      enabled: false,
    },
  ]);

  const [showNewSchedule, setShowNewSchedule] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    template: 'monthly-summary' as ExportTemplate,
    destination: 'email' as IntegrationType,
    frequency: 'weekly' as ExportFrequency,
    email: '',
  });

  const handleToggleSchedule = (id: string) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === id ? { ...schedule, enabled: !schedule.enabled } : schedule
      )
    );
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
  };

  const handleCreateSchedule = () => {
    const nextRunDate = new Date();
    nextRunDate.setDate(nextRunDate.getDate() + 7); // Next week for demo

    const newScheduleItem: ScheduledExport = {
      id: Date.now().toString(),
      template: newSchedule.template,
      destination: newSchedule.destination,
      frequency: newSchedule.frequency,
      nextRun: nextRunDate.toISOString(),
      enabled: true,
      email: newSchedule.email || undefined,
    };

    setSchedules((prev) => [...prev, newScheduleItem]);
    setShowNewSchedule(false);
    setNewSchedule({
      template: 'monthly-summary',
      destination: 'email',
      frequency: 'weekly',
      email: '',
    });
  };

  const getFrequencyBadge = (frequency: ExportFrequency) => {
    const colors = {
      daily: 'bg-purple-100 text-purple-700',
      weekly: 'bg-blue-100 text-blue-700',
      monthly: 'bg-green-100 text-green-700',
      quarterly: 'bg-orange-100 text-orange-700',
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${colors[frequency]}`}>
        {frequency}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Scheduled Exports</h4>
          <p className="text-xs text-gray-600">
            Automate your exports with recurring schedules
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowNewSchedule(!showNewSchedule)}
          className="text-xs"
        >
          + New Schedule
        </Button>
      </div>

      {/* New Schedule Form */}
      {showNewSchedule && (
        <div className="border border-sky-300 rounded-lg p-4 bg-sky-50">
          <h5 className="text-sm font-semibold text-gray-900 mb-3">Create New Schedule</h5>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Template
              </label>
              <select
                value={newSchedule.template}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, template: e.target.value as ExportTemplate })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              >
                {EXPORT_TEMPLATES.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.icon} {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Destination
              </label>
              <select
                value={newSchedule.destination}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, destination: e.target.value as IntegrationType })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              >
                <option value="email">📧 Email</option>
                <option value="google-sheets">📗 Google Sheets</option>
                <option value="dropbox">📦 Dropbox</option>
                <option value="onedrive">☁️ OneDrive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                value={newSchedule.frequency}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, frequency: e.target.value as ExportFrequency })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>

            {newSchedule.destination === 'email' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newSchedule.email}
                  onChange={(e) => setNewSchedule({ ...newSchedule, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>
            )}

            <div className="flex items-center space-x-2 pt-2">
              <Button variant="primary" onClick={handleCreateSchedule} className="text-xs">
                Create Schedule
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowNewSchedule(false)}
                className="text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Schedules */}
      {schedules.length > 0 ? (
        <div className="space-y-3">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className={`border rounded-lg p-4 transition-all ${
                schedule.enabled
                  ? 'border-sky-300 bg-sky-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h5 className="text-sm font-semibold text-gray-900">
                      {EXPORT_TEMPLATES.find((t) => t.id === schedule.template)?.name}
                    </h5>
                    {getFrequencyBadge(schedule.frequency)}
                    {schedule.enabled ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                        Paused
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-gray-600">
                    <div>
                      <span className="text-gray-500">Destination:</span>{' '}
                      <span className="font-medium text-gray-900 capitalize">
                        {schedule.destination.replace('-', ' ')}
                      </span>
                    </div>
                    {schedule.email && (
                      <div>
                        <span className="text-gray-500">Email:</span>{' '}
                        <span className="font-medium text-gray-900">{schedule.email}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Next run:</span>{' '}
                      <span className="font-medium text-gray-900">
                        {new Date(schedule.nextRun).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleToggleSchedule(schedule.id)}
                    className="p-2 text-gray-600 hover:text-sky-600 hover:bg-sky-100 rounded"
                    title={schedule.enabled ? 'Pause' : 'Resume'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {schedule.enabled ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      )}
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">No scheduled exports yet</p>
          <p className="text-xs text-gray-500">
            Create your first automated export schedule
          </p>
        </div>
      )}
    </div>
  );
}
