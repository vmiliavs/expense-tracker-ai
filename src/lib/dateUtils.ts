import { TimePeriod } from '@/types/analytics';

export function getWeekBounds(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6); // End of week (Saturday)
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function getMonthBounds(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function getYearBounds(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), 0, 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date.getFullYear(), 11, 31);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export function formatPeriodLabel(date: Date, period: TimePeriod): string {
  switch (period) {
    case 'daily':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'weekly':
      return `Week ${getWeekNumber(date)}`;
    case 'monthly':
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    case 'yearly':
      return date.getFullYear().toString();
    default:
      return date.toLocaleDateString();
  }
}

export function generatePeriods(
  startDate: Date,
  endDate: Date,
  period: TimePeriod
): Array<{ start: Date; end: Date; label: string }> {
  const periods: Array<{ start: Date; end: Date; label: string }> = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    let bounds: { start: Date; end: Date };

    switch (period) {
      case 'daily':
        bounds = {
          start: new Date(current),
          end: new Date(current)
        };
        bounds.start.setHours(0, 0, 0, 0);
        bounds.end.setHours(23, 59, 59, 999);
        current.setDate(current.getDate() + 1);
        break;
      case 'weekly':
        bounds = getWeekBounds(current);
        current.setDate(current.getDate() + 7);
        break;
      case 'monthly':
        bounds = getMonthBounds(current);
        current.setMonth(current.getMonth() + 1);
        break;
      case 'yearly':
        bounds = getYearBounds(current);
        current.setFullYear(current.getFullYear() + 1);
        break;
      default:
        bounds = { start: current, end: current };
        current.setDate(current.getDate() + 1);
    }

    if (bounds.start <= endDate) {
      periods.push({
        start: bounds.start,
        end: bounds.end > endDate ? endDate : bounds.end,
        label: formatPeriodLabel(bounds.start, period)
      });
    }
  }

  return periods;
}

export function isSamePeriod(date1: Date, date2: Date, period: TimePeriod): boolean {
  switch (period) {
    case 'daily':
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    case 'weekly':
      return getWeekNumber(date1) === getWeekNumber(date2) &&
        date1.getFullYear() === date2.getFullYear();
    case 'monthly':
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth()
      );
    case 'yearly':
      return date1.getFullYear() === date2.getFullYear();
    default:
      return false;
  }
}

export function getPeriodComparison(period: TimePeriod): {
  currentStart: Date;
  currentEnd: Date;
  previousStart: Date;
  previousEnd: Date;
} {
  const now = new Date();
  let currentStart: Date, currentEnd: Date, previousStart: Date, previousEnd: Date;

  switch (period) {
    case 'daily':
      currentStart = new Date(now);
      currentStart.setHours(0, 0, 0, 0);
      currentEnd = new Date(now);
      currentEnd.setHours(23, 59, 59, 999);

      previousStart = new Date(currentStart);
      previousStart.setDate(previousStart.getDate() - 1);
      previousEnd = new Date(currentEnd);
      previousEnd.setDate(previousEnd.getDate() - 1);
      break;

    case 'weekly':
      ({ start: currentStart, end: currentEnd } = getWeekBounds(now));
      previousStart = new Date(currentStart);
      previousStart.setDate(previousStart.getDate() - 7);
      previousEnd = new Date(currentEnd);
      previousEnd.setDate(previousEnd.getDate() - 7);
      break;

    case 'monthly':
      ({ start: currentStart, end: currentEnd } = getMonthBounds(now));
      previousStart = new Date(currentStart);
      previousStart.setMonth(previousStart.getMonth() - 1);
      previousEnd = new Date(currentEnd);
      previousEnd.setMonth(previousEnd.getMonth() - 1);
      break;

    case 'yearly':
      ({ start: currentStart, end: currentEnd } = getYearBounds(now));
      previousStart = new Date(currentStart);
      previousStart.setFullYear(previousStart.getFullYear() - 1);
      previousEnd = new Date(currentEnd);
      previousEnd.setFullYear(previousEnd.getFullYear() - 1);
      break;

    default:
      currentStart = now;
      currentEnd = now;
      previousStart = now;
      previousEnd = now;
  }

  return { currentStart, currentEnd, previousStart, previousEnd };
}
