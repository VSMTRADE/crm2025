import { Card } from '../../components/ui/Card';
import { TasksSummary } from './TasksSummary';
import { ContactsSummary } from './ContactsSummary';
import { FinancialSummary } from './FinancialSummary';
import { UpcomingEvents } from './UpcomingEvents';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Tasks" value="12" trend="+2" />
        <Card title="Active Contacts" value="48" trend="+5" />
        <Card title="Monthly Revenue" value="$12,450" trend="+8%" />
        <Card title="Pending Tasks" value="6" trend="-1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TasksSummary />
        <ContactsSummary />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialSummary />
        <UpcomingEvents />
      </div>
    </div>
  );
}