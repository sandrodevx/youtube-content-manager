interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

export default function StatCard({ 
  title, 
  value, 
  icon, 
  change, 
  color = 'blue' 
}: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {change && (
            <span className={`inline-flex items-center text-xs mt-2 ${
              change.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
              <span className="ml-1 text-gray-500">vs mes anterior</span>
            </span>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
} 