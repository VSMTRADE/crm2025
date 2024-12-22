interface CardProps {
  title: string;
  value: string;
  trend: string;
}

export function Card({ title, value, trend }: CardProps) {
  const isPositive = trend.startsWith('+');
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className={`ml-2 text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend}
        </p>
      </div>
    </div>
  );
}