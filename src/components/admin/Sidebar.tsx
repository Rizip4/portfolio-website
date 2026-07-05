import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderOpen, Tag, Mail, Settings, LogOut, Link } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps { isOpen: boolean; onClose: () => void; }

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/projects", icon: FolderOpen, label: "Projects" },
  { to: "/admin/skills", icon: Tag, label: "Skills" },
  { to: "/admin/socials", icon: Link, label: "Socials" },
  { to: "/admin/messages", icon: Mail, label: "Messages" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/admin/login";
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-[#111] border-r border-gray-700 z-50 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-xl font-bold">Portfolio Admin</h1>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} onClick={onClose}
                className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-colors", isActive ? "bg-orange-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white")}
              >
                <item.icon className="w-5 h-5" /><span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-700">
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" /><span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
