import { Kanban } from 'lucide-react';

export function TasksSummary() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Tasks Overview</h2>
        <Kanban className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {/* Placeholder data - will be replaced with real data */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">To Do</span>
          <span className="text-sm font-medium">4</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">In Progress</span>
          <span className="text-sm font-medium">3</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Done</span>
          <span className="text-sm font-medium">5</span>
        </div>
      </div>
    </div>
  );
}