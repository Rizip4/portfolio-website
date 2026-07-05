import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { authService } from "@/services/auth";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) { navigate("/admin/login"); return; }
      try { await authService.getProfile(); setLoading(false); }
      catch { navigate("/admin/login"); }
    };
    checkAuth();
  }, [navigate]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin") return "Dashboard";
    if (path.includes("/projects")) return "Projects";
    if (path.includes("/skills")) return "Skills";
    if (path.includes("/socials")) return "Socials";
    if (path.includes("/messages")) return "Messages";
    if (path.includes("/settings")) return "Settings";
    return "Portfolio Admin";
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0C0C0C]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-64 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} title={getPageTitle()} />
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  );
}
