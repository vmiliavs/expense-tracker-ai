import { TimePeriod } from '@/types/analytics';

interface TimePeriodSelectorProps {
  period: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

export default function TimePeriodSelector({ period, onChange }: TimePeriodSelectorProps) {
  const periods: { value: TimePeriod; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-2 overflow-x-auto">
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">View:</span>
        <div className="flex gap-2">
          {periods.map(p => (
            <button
              key={p.value}
              onClick={() => onChange(p.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                period === p.value
                  ? 'bg-sky-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
