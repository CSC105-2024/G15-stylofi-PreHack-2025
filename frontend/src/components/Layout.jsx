import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router-dom";

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
