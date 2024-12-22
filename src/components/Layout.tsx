import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  Calendar as CalendarIcon, 
  DollarSign,
  Menu,
  X
} from 'lucide-react';

const navigation = [
  { 
    name: 'Painel', 
    href: '/', 
    icon: LayoutDashboard,
    color: 'purple',
    bgColor: 'bg-purple-50',
    hoverBg: 'hover:bg-purple-50',
    activeColor: 'text-purple-600',
    activeBg: 'bg-purple-50'
  },
  { 
    name: 'Contatos', 
    href: '/contacts', 
    icon: Users,
    color: 'blue',
    bgColor: 'bg-blue-50',
    hoverBg: 'hover:bg-blue-50',
    activeColor: 'text-blue-600',
    activeBg: 'bg-blue-50'
  },
  { 
    name: 'Tarefas', 
    href: '/tasks', 
    icon: Kanban,
    color: 'green',
    bgColor: 'bg-green-50',
    hoverBg: 'hover:bg-green-50',
    activeColor: 'text-green-600',
    activeBg: 'bg-green-50'
  },
  { 
    name: 'Calendário', 
    href: '/calendar', 
    icon: CalendarIcon,
    color: 'orange',
    bgColor: 'bg-orange-50',
    hoverBg: 'hover:bg-orange-50',
    activeColor: 'text-orange-600',
    activeBg: 'bg-orange-50'
  },
  { 
    name: 'Finanças', 
    href: '/finance', 
    icon: DollarSign,
    color: 'emerald',
    bgColor: 'bg-emerald-50',
    hoverBg: 'hover:bg-emerald-50',
    activeColor: 'text-emerald-600',
    activeBg: 'bg-emerald-50'
  },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <button
          className="fixed top-4 left-4 p-2 rounded-md bg-white shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="h-16 flex items-center justify-center border-b">
          <h1 className="text-xl font-bold text-gray-900">Modern CRM</h1>
        </div>

        <nav className="mt-6">
          <ul className="space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                      isActive
                        ? `${item.activeBg} ${item.activeColor}`
                        : `text-gray-700 ${item.hoverBg}`
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? item.activeColor : `text-${item.color}-400`
                      }`}
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main
        className={`lg:pl-64 min-h-screen transition-all duration-300 ease-in-out`}
      >
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}