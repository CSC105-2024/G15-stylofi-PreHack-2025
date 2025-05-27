import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { clearAuthData } from '@/services/auth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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

  const NavItem = ({ to, icon: Icon, title, isActive }) => (
    <Link
      to={to}
      className="group relative w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-300 ease-out transform hover:scale-105"
      title={title}
    >
      {/* Background with gradient and glow effect */}
      <div
        className={`absolute inset-0 rounded-xl transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25'
            : 'bg-surface/50 backdrop-blur-sm border border-border/50 group-hover:bg-gradient-to-br group-hover:from-gray-800 group-hover:to-gray-700 group-hover:border-gray-600/50 group-hover:shadow-md'
        }`}
      />

      {/* Icon */}
      <Icon
        className={`relative z-10 h-6 w-6 transition-all duration-300 ${
          isActive ? 'text-white' : 'text-text/70 group-hover:text-white group-hover:drop-shadow-sm'
        }`}
      />

      {/* Active indicator */}
      {/* {isActive && ( */}
      {/*   <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full shadow-sm" /> */}
      {/* )} */}
    </Link>
  );

  return (
    <>
      <aside className="w-20 min-h-screen bg-gradient-to-b from-surface via-surface to-surface/95 backdrop-blur-xl border-r border-border/30 flex flex-col items-center py-6 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-border/5 to-transparent" />

        {/* Logo section */}
        <div className="relative z-10 mb-8 p-2 rounded-xl bg-surface/50 backdrop-blur-sm border border-border/30 hover:border-border/50 transition-all duration-300 hover:shadow-sm">
          <Link
            to="/"
            className="block transform hover:scale-105 transition-transform duration-200"
          >
            <img
              src="/src/assets/logo.png"
              alt="Stylofi Logo"
              className="w-10 h-10 object-contain"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex flex-col items-center space-y-4 flex-1">
          <NavItem
            to="/dashboard"
            icon={Home}
            title="Dashboard"
            isActive={isActive('/dashboard')}
          />
          <NavItem
            to="/creation-tool"
            icon={Plus}
            title="Create New"
            isActive={isActive('/creation-tool')}
          />
        </nav>

        {/* Logout button */}
        <div className="relative z-10 mt-auto">
          <button
            onClick={() => setShowLogoutDialog(true)}
            title="Sign Out"
            className="group relative w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-300 ease-out transform hover:scale-105 cursor-pointer"
          >
            {/* Background with danger gradient */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25 group-hover:from-red-600 group-hover:to-red-700 group-hover:shadow-red-500/40 transition-all duration-300" />

            {/* Icon */}
            <LogOut className="relative z-10 h-6 w-6 text-white transition-all duration-300 group-hover:drop-shadow-sm" />
          </button>
        </div>
      </aside>

      {/* Enhanced Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="bg-surface/95 backdrop-blur-xl border border-border/50 shadow-2xl">
          <DialogHeader className="space-y-3">
            {/* <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-text to-text/80 bg-clip-text"> */}
            {/*   Sign Out */}
            {/* </DialogTitle> */}
            <DialogDescription className="text-text/70 leading-relaxed">
              Are you sure you want to sign out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="bg-secondary text-white hover:bg-secondary-hover transition-colors duration-200 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowLogoutDialog(false);
                handleLogout();
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-200 cursor-pointer"
            >
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppSidebar;
