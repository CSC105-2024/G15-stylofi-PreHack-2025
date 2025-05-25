import { SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';

const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <MainContent />
    </SidebarProvider>
  );
};

const MainContent = () => (
  <main className="flex-1 gap-6 transition-all duration-300">
    <div className="overflow-y-auto h-screen">
      <Outlet />
    </div>
  </main>
);

export default Layout;
