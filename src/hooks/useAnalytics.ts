import { useMemo } from 'react';
import { Expense } from '@/types/expense';
import { TimePeriod, AnalyticsData } from '@/types/analytics';
import { processAnalyticsData } from '@/lib/analytics';

export function useAnalytics(expenses: Expense[], period: TimePeriod): { data: AnalyticsData } {
  const data = useMemo(() => {
    return processAnalyticsData(expenses, period);
  }, [expenses, period]);

  return { data };
}
