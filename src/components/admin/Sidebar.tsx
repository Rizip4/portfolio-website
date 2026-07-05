import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderOpen, Tag, Mail, Settings, LogOut, Link, Palette } from "lucide-react";
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
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-[#0C0C0C] border-r border-[#D7E2EA]/10 z-50 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#D7E2EA]/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-[#D7E2EA] uppercase tracking-wider">Admin</h1>
                <p className="text-[10px] text-[#D7E2EA]/40 uppercase tracking-widest">Portfolio</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} onClick={onClose}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-orange-600/20 to-orange-500/10 text-orange-400 border border-orange-500/20"
                    : "text-[#D7E2EA]/50 hover:bg-[#D7E2EA]/5 hover:text-[#D7E2EA]/80"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* View Site + Logout */}
          <div className="p-3 border-t border-[#D7E2EA]/10 space-y-1">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#D7E2EA]/40 hover:bg-[#D7E2EA]/5 hover:text-[#D7E2EA]/70 transition-all duration-200">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="text-sm">View Site</span>
            </a>
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[#D7E2EA]/40 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200">
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
