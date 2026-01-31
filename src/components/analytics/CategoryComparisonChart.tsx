import { CategoryPeriodData, TimePeriod } from '@/types/analytics';
import { Card } from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '@/lib/formatters';

interface CategoryComparisonChartProps {
  data: CategoryPeriodData[];
  period: TimePeriod;
}

export default function CategoryComparisonChart({ data, period }: CategoryComparisonChartProps) {
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
          Category Comparison - {periodLabels[period]}
        </h2>
        <div className="h-[300px] lg:h-[400px] flex items-center justify-center text-gray-500">
          No category data available
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Category Comparison - {periodLabels[period]}
      </h2>
      <ResponsiveContainer width="100%" height={300} className="lg:h-[400px]">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis
            type="category"
            dataKey="category"
            tick={{ fontSize: 12 }}
            width={100}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(value as number), 'Amount']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem'
            }}
          />
          <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
