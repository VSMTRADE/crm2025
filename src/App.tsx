import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Calendar from './pages/Calendar';
import Tasks from './pages/Tasks';
import Finance from './pages/Finance';
import Login from './pages/Login';
import Backup from './pages/Backup';
import Negotiations from './pages/Negotiations';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastContainer position="bottom-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="finance" element={<Finance />} />
              <Route path="backup" element={<Backup />} />
              <Route path="negotiations" element={<Negotiations />} />
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;