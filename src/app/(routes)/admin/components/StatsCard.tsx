interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatsCard({ title, value, trend }: StatsCardProps) {
  return (
    <div className="border border-gray-300 p-4">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-xl font-bold">{value}</p>
        {trend && (
          <p className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}% from last month
          </p>
        )}
      </div>
    </div>
  );
}
