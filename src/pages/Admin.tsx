import { useState } from 'react';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export interface Barber {
  id: string;
  name: string;
  username: string;
  password: string;
}

const barbers: Barber[] = [
  { id: '1', name: 'Kean', username: 'Kean', password: 'Barber' },
  { id: '2', name: 'Pao', username: 'Pao', password: 'Barber' },
  { id: '3', name: 'Gelo', username: 'Gelo', password: 'Barber' }
];

const Admin = () => {
  const [authenticatedBarber, setAuthenticatedBarber] = useState<Barber | null>(null);

  const handleLogin = (username: string, password: string) => {
    const barber = barbers.find(b => b.username === username && b.password === password);
    if (barber) {
      setAuthenticatedBarber(barber);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    // Clear remembered login when logging out
    localStorage.removeItem('barber-remembered-login');
    setAuthenticatedBarber(null);
  };

  if (!authenticatedBarber) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard barber={authenticatedBarber} onLogout={handleLogout} />;
};

export default Admin;