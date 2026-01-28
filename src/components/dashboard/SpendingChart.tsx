'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Expense } from '@/types/expense';
import { useChartData } from '@/hooks/useChartData';
import { formatCurrency } from '@/lib/formatters';
import { Card } from '@/components/ui/Card';

interface SpendingChartProps {
  expenses: Expense[];
}

export function SpendingChart({ expenses }: SpendingChartProps) {
  const { spendingByDate } = useChartData(expenses);

  if (spendingByDate.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold mb-4">Spending Over Time</h2>
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          No data available
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Spending Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={spendingByDate}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            formatter={(value) => (value !== undefined ? formatCurrency(Number(value)) : '')}
            labelFormatter={(label) => {
              const date = new Date(String(label));
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
            }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#0284c7"
            strokeWidth={2}
            dot={{ fill: '#0284c7', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
