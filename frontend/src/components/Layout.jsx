import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <MainContent />
      </div>
    </SidebarProvider>
  );
};

const MainContent = () => (
  <main className="flex-1 gap-6 transition-all duration-300">
    <div className="p-4 overflow-y-auto h-screen">
      <Outlet />
    </div>
  </main>
);

export default Layout;
