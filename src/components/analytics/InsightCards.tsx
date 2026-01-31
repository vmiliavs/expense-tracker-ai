import { SpendingInsights } from '@/types/analytics';
import { Card } from '@/components/ui/Card';
import TrendIndicator from './TrendIndicator';
import { formatCurrency } from '@/lib/formatters';

interface InsightCardsProps {
  insights: SpendingInsights;
}

export default function InsightCards({ insights }: InsightCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600">Average Daily</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(insights.averageDaily)}
          </p>
          <TrendIndicator trend={insights.overallTrend} showText={false} size="sm" />
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600">Average Weekly</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(insights.averageWeekly)}
          </p>
          <TrendIndicator trend={insights.overallTrend} showText={false} size="sm" />
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600">Average Monthly</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(insights.averageMonthly)}
          </p>
          <TrendIndicator trend={insights.overallTrend} showText={false} size="sm" />
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600">Spending Velocity</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(insights.spendingVelocity)}/day
          </p>
          <TrendIndicator trend={insights.velocityTrend} showText={false} size="sm" />
        </div>
      </Card>
    </div>
  );
}
