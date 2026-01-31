import { useState } from 'react';
import { TimePeriod } from '@/types/analytics';

export function useTimePeriod(initialPeriod: TimePeriod = 'monthly') {
  const [period, setPeriod] = useState<TimePeriod>(initialPeriod);

  return {
    period,
    setPeriod
  };
}
