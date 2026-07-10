import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function DashboardLayout({ children }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold text-blue-600">Society Manager</h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              {user?.name} <span className="text-gray-400">({user?.role})</span>
            </span>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;