import { Link, useLocation } from "react-router-dom";
import { Home, Plus } from "lucide-react";

import Logo from "@/components/Logo";

const AppSidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="w-16 min-h-screen bg-surface border-r border-border)] flex flex-col items-center py-4 space-y-6">
      <Link to="/" className="mb-6">
        <Logo />
      </Link>

      <nav className="flex flex-col items-center space-y-6">
        <Link
          to="/dashboard"
          className={`w-12 h-12 flex items-center justify-center rounded-full hover:bg-black group transition-colors ${
            isActive("/dashboard") ? "bg-black text-white" : ""
          }`}
          title="Dashboard"
        >
          <Home
            className={`h-6 w-6 transition-colors ${
              isActive("/dashboard")
                ? "text-white"
                : "text-text group-hover:text-white"
            }`}
          />
        </Link>

        <Link
          to="/creation-tool"
          title="Add"
          className={`w-12 h-12 flex items-center justify-center rounded-full hover:bg-black group transition-colors ${
            isActive("/creation-tool") ? "bg-black text-white" : ""
          }`}
        >
          <Plus
            className={`h-6 w-6 transition-colors ${
              isActive("/creation-tool")
                ? "text-white"
                : "text-text group-hover:text-white"
            }`}
          />
        </Link>
      </nav>
    </aside>
  );
};

export default AppSidebar;
