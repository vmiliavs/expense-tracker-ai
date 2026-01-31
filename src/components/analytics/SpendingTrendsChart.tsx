import { PeriodData, TimePeriod } from '@/types/analytics';
import { Card } from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/formatters';

interface SpendingTrendsChartProps {
  data: PeriodData[];
  period: TimePeriod;
}

export default function SpendingTrendsChart({ data, period }: SpendingTrendsChartProps) {
  const periodLabels: Record<TimePeriod, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly'
  };

  if (data.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Spending Trends - {periodLabels[period]}
        </h2>
        <div className="h-[300px] lg:h-[400px] flex items-center justify-center text-gray-500">
          No spending data available
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Spending Trends - {periodLabels[period]}
      </h2>
      <ResponsiveContainer width="100%" height={300} className="lg:h-[400px]">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(value as number), 'Amount']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem'
            }}
          />
          <Bar dataKey="amount" fill="#0284c7" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
