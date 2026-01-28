'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Expense } from '@/types/expense';
import { useChartData } from '@/hooks/useChartData';
import { formatCurrency } from '@/lib/formatters';
import { Card } from '@/components/ui/Card';

interface CategoryChartProps {
  expenses: Expense[];
}

export function CategoryChart({ expenses }: CategoryChartProps) {
  const { categoryData } = useChartData(expenses);

  if (categoryData.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          No data available
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }: { name?: string; percent?: number }) =>
              name && percent !== undefined ? `${name} ${(percent * 100).toFixed(0)}%` : ''
            }
            labelLine={true}
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => (value !== undefined ? formatCurrency(Number(value)) : '')}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
