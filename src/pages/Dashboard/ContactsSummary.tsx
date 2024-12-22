import { Users } from 'lucide-react';

export function ContactsSummary() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Contacts Overview</h2>
        <Users className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Clients</span>
          <span className="text-sm font-medium">24</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Partners</span>
          <span className="text-sm font-medium">12</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Leads</span>
          <span className="text-sm font-medium">32</span>
        </div>
      </div>
    </div>
  );
}