import { TrendDirection } from '@/types/analytics';

interface TrendIndicatorProps {
  trend: TrendDirection;
  value?: number;
  showIcon?: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function TrendIndicator({
  trend,
  value,
  showIcon = true,
  showText = true,
  size = 'md'
}: TrendIndicatorProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  const getTrendConfig = () => {
    switch (trend) {
      case 'increasing':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          text: 'Increasing',
          icon: (
            <svg
              width={iconSizes[size]}
              height={iconSizes[size]}
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L8 8L4 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 4H12V8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )
        };
      case 'decreasing':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          text: 'Decreasing',
          icon: (
            <svg
              width={iconSizes[size]}
              height={iconSizes[size]}
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12L8 8L4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 12H12V8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )
        };
      case 'stable':
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          text: 'Stable',
          icon: (
            <svg
              width={iconSizes[size]}
              height={iconSizes[size]}
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 8H13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )
        };
    }
  };

  const config = getTrendConfig();

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${config.bgColor} ${config.color} ${sizeClasses[size]}`}>
      {showIcon && config.icon}
      {showText && <span className="font-medium">{config.text}</span>}
      {value !== undefined && <span className="font-semibold">{value.toFixed(1)}%</span>}
    </div>
  );
}
