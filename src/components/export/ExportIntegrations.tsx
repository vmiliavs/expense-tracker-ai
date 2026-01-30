'use client';

import { useState } from 'react';
import { CLOUD_INTEGRATIONS } from '@/lib/exportTemplates';
import { CloudIntegration } from '@/types/cloud-export';
import { Button } from '@/components/ui/Button';

export function ExportIntegrations() {
  const [integrations, setIntegrations] = useState(CLOUD_INTEGRATIONS);
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (integrationId: string) => {
    setConnecting(integrationId);

    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === integrationId
          ? {
              ...int,
              connected: !int.connected,
              status: int.connected ? 'inactive' : 'active',
              lastSync: int.connected ? undefined : new Date().toISOString(),
            }
          : int
      )
    );

    setConnecting(null);
  };

  const getStatusBadge = (integration: CloudIntegration) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-700', label: 'Connected' },
      inactive: { color: 'bg-gray-100 text-gray-700', label: 'Not Connected' },
      pending: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
      error: { color: 'bg-red-100 text-red-700', label: 'Error' },
    };

    const config = statusConfig[integration.status];

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-1">
          Cloud Integrations
        </h4>
        <p className="text-xs text-gray-600">
          Connect your favorite services for seamless export and sync
        </p>
      </div>

      {/* Integration Cards */}
      <div className="space-y-3">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className={`border rounded-lg p-4 transition-all ${
              integration.connected
                ? 'border-sky-300 bg-sky-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="text-3xl">{integration.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h5 className="text-sm font-semibold text-gray-900">
                      {integration.name}
                    </h5>
                    {getStatusBadge(integration)}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    {integration.description}
                  </p>

                  {/* Connection Details */}
                  {integration.connected && integration.lastSync && (
                    <div className="text-xs text-gray-500">
                      Last synced:{' '}
                      {new Date(integration.lastSync).toLocaleString()}
                    </div>
                  )}

                  {/* Special Features */}
                  {integration.id === 'google-sheets' && integration.connected && (
                    <div className="mt-2 text-xs text-sky-600">
                      ✓ Auto-sync enabled • Sheet: &ldquo;Expenses 2026&rdquo;
                    </div>
                  )}

                  {integration.id === 'email' && integration.connected && (
                    <div className="mt-2 space-y-1">
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                        defaultValue="user@example.com"
                      />
                    </div>
                  )}

                  {integration.id === 'webhook' && integration.connected && (
                    <div className="mt-2 space-y-1">
                      <input
                        type="text"
                        placeholder="https://your-webhook-url.com/endpoint"
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="ml-4">
                <Button
                  variant={integration.connected ? 'danger' : 'primary'}
                  onClick={() => handleConnect(integration.id)}
                  loading={connecting === integration.id}
                  disabled={connecting !== null}
                  className="text-xs px-3 py-1"
                >
                  {connecting === integration.id
                    ? 'Connecting...'
                    : integration.connected
                    ? 'Disconnect'
                    : 'Connect'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* API Access Section */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-sm font-semibold text-gray-900">API Access</h5>
          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
            Pro Feature
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          Generate API keys for programmatic access to your expense data
        </p>
        <Button variant="secondary" className="text-xs">
          Generate API Key
        </Button>
      </div>
    </div>
  );
}
