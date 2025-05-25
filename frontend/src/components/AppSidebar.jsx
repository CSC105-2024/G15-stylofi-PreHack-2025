import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { clearAuthData } from '@/services/auth';

import Logo from '@/components/Logo';

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    try {
      await clearAuthData();
      toast.success('Successfully signed out');
      navigate('/signin');
    } catch (error) {
      toast.error('An error occurred while signing out');
    }
  };

  return (
    <aside className="w-16 min-h-screen bg-surface border-r border-border flex flex-col items-center py-4 space-y-6">
      <Link to="/" className="mb-6">
        <Logo />
      </Link>

      <nav className="flex flex-col items-center space-y-6 flex-1">
        <Link
          to="/dashboard"
          className={`w-12 h-12 flex items-center justify-center rounded-full hover:bg-black group transition-colors ${
            isActive('/dashboard') ? 'bg-black text-white' : ''
          }`}
          title="Dashboard"
        >
          <Home
            className={`h-6 w-6 transition-colors ${
              isActive('/dashboard') ? 'text-white' : 'text-text group-hover:text-white'
            }`}
          />
        </Link>

        <Link
          to="/creation-tool"
          title="Add"
          className={`w-12 h-12 flex items-center justify-center rounded-full hover:bg-black group transition-colors ${
            isActive('/creation-tool') ? 'bg-black text-white' : ''
          }`}
        >
          <Plus
            className={`h-6 w-6 transition-colors ${
              isActive('/creation-tool') ? 'text-white' : 'text-text group-hover:text-white'
            }`}
          />
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        title="Sign Out"
        className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-black group transition-colors mb-4 cursor-pointer"
      >
        <LogOut className="h-6 w-6 text-text group-hover:text-white transition-colors" />
      </button>
    </aside>
  );
};

export default AppSidebar;
