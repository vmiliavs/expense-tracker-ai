import { Category } from './expense';

export type ExportTemplate =
  | 'tax-report'
  | 'monthly-summary'
  | 'category-analysis'
  | 'yearly-overview'
  | 'custom';

export type IntegrationType =
  | 'google-sheets'
  | 'email'
  | 'dropbox'
  | 'onedrive'
  | 'webhook';

export type ExportFrequency =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly';

export interface ExportTemplateConfig {
  id: ExportTemplate;
  name: string;
  description: string;
  icon: string;
  format: 'csv' | 'pdf' | 'excel';
  includeCharts: boolean;
  filters?: {
    categories?: Category[];
    dateRange?: string;
  };
}

export interface CloudIntegration {
  id: IntegrationType;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
  lastSync?: string;
  status: 'active' | 'inactive' | 'pending' | 'error';
}

export interface ExportHistory {
  id: string;
  templateName: string;
  destination: string;
  timestamp: string;
  recordCount: number;
  status: 'completed' | 'failed' | 'processing';
  shareLink?: string;
}

export interface ScheduledExport {
  id: string;
  template: ExportTemplate;
  destination: IntegrationType;
  frequency: ExportFrequency;
  nextRun: string;
  enabled: boolean;
  email?: string;
}

export interface ShareableLink {
  id: string;
  url: string;
  expiresAt: string;
  accessCount: number;
  createdAt: string;
}
