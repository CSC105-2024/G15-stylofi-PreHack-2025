import { Link } from "react-router-dom";
import { Home, Plus } from "lucide-react";

import Logo from "@/components/Logo";

export function AppSidebar() {
  return (
    <aside className="w-16 min-h-screen bg-surface border-r border-border)] flex flex-col items-center py-4 space-y-6">
      <Link to="/" className="mb-6">
        <Logo />
      </Link>

      <nav className="flex flex-col items-center space-y-6">
        <Link
          to="/dashboard"
          className="w-12 h-12 flex items-center justify-center hover:bg-border rounded"
          title="Dashboard"
        >
          <Home className="h-6 w-6 text-text)]" />
        </Link>

        <Link
          to="/creation-tool"
          className="w-12 h-12 flex items-center justify-center hover:bg-border rounded"
          title="Add"
        >
          <Plus className="h-6 w-6 text-text)]" />
        </Link>
      </nav>
    </aside>
  );
}
