import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/formatters';

interface HighlightSectionProps {
  highestDay: { date: string; amount: number } | null;
  lowestDay: { date: string; amount: number } | null;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export default function HighlightSection({ highestDay, lowestDay }: HighlightSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <h3 className="text-lg font-semibold text-gray-900">Highest Spending Day</h3>
          </div>
          {highestDay ? (
            <>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(highestDay.amount)}
              </p>
              <p className="text-sm text-gray-600">
                {formatDate(highestDay.date)}
              </p>
            </>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <h3 className="text-lg font-semibold text-gray-900">Lowest Spending Day</h3>
          </div>
          {lowestDay ? (
            <>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(lowestDay.amount)}
              </p>
              <p className="text-sm text-gray-600">
                {formatDate(lowestDay.date)}
              </p>
            </>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
      </Card>
    </div>
  );
}
