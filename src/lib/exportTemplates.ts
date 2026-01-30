import { ExportTemplateConfig, CloudIntegration } from '@/types/cloud-export';

export const EXPORT_TEMPLATES: ExportTemplateConfig[] = [
  {
    id: 'tax-report',
    name: 'Tax Report',
    description: 'IRS-ready expense report with categorized deductions',
    icon: '📋',
    format: 'pdf',
    includeCharts: true,
  },
  {
    id: 'monthly-summary',
    name: 'Monthly Summary',
    description: 'Comprehensive monthly spending overview with charts',
    icon: '📊',
    format: 'excel',
    includeCharts: true,
  },
  {
    id: 'category-analysis',
    name: 'Category Analysis',
    description: 'Deep dive into spending by category with trends',
    icon: '📈',
    format: 'pdf',
    includeCharts: true,
  },
  {
    id: 'yearly-overview',
    name: 'Yearly Overview',
    description: 'Annual financial summary with comparative analysis',
    icon: '📅',
    format: 'pdf',
    includeCharts: true,
  },
  {
    id: 'custom',
    name: 'Custom Export',
    description: 'Build your own export with custom filters and format',
    icon: '⚙️',
    format: 'csv',
    includeCharts: false,
  },
];

export const CLOUD_INTEGRATIONS: CloudIntegration[] = [
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    icon: '📗',
    description: 'Export directly to Google Sheets with auto-sync',
    connected: false,
    status: 'inactive',
  },
  {
    id: 'email',
    name: 'Email',
    icon: '📧',
    description: 'Send exports directly to your email',
    connected: true,
    status: 'active',
    lastSync: '2026-01-30T07:00:00Z',
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: '📦',
    description: 'Auto-save exports to your Dropbox folder',
    connected: false,
    status: 'inactive',
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    icon: '☁️',
    description: 'Sync exports with Microsoft OneDrive',
    connected: false,
    status: 'inactive',
  },
  {
    id: 'webhook',
    name: 'Webhook',
    icon: '🔗',
    description: 'Send data to custom webhook endpoints',
    connected: false,
    status: 'inactive',
  },
];
