import { DollarSign } from 'lucide-react';

export function FinancialSummary() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Financial Overview</h2>
        <DollarSign className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Revenue</span>
          <span className="text-sm font-medium text-green-600">$24,500</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Expenses</span>
          <span className="text-sm font-medium text-red-600">$12,050</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Profit</span>
          <span className="text-sm font-medium">$12,450</span>
        </div>
      </div>
    </div>
  );
}