import { DashboardOverview } from '../components/dashboard/DashboardOverview';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Painel de Controle</h1>
      </div>

      <DashboardOverview />
    </div>
  );
}
