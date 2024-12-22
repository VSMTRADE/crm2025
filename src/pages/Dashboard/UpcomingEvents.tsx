import { Calendar } from 'lucide-react';

export function UpcomingEvents() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
        <Calendar className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium">Client Meeting</h3>
            <p className="text-sm text-gray-500">Today at 2:00 PM</p>
          </div>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Meet</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium">Project Review</h3>
            <p className="text-sm text-gray-500">Tomorrow at 10:00 AM</p>
          </div>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Meet</span>
        </div>
      </div>
    </div>
  );
}