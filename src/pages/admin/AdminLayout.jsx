import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/admin/users", label: "Users", icon: "👥" },
  { path: "/admin/modules", label: "Modules", icon: "📦" },
  { path: "/admin/tasks", label: "Tasks", icon: "📋" },
  { path: "/admin/teams", label: "Teams", icon: "👤" },
  { path: "/admin/submissions", label: "Submissions", icon: "📝" },
  { path: "/admin/announcements", label: "Announcements", icon: "📢" },
  { path: "/admin/leaderboard", label: "Leaderboard", icon: "🏆" },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/60 border-r border-white/10 backdrop-blur-xl transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}>
        <div className="p-6 border-b border-white/10">
          <Link to="/admin/dashboard" className="font-bebas text-3xl text-red-500 tracking-wider">Admin</Link>
          <p className="text-gray-500 text-xs mt-1">{admin?.email}</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                pathname === item.path
                  ? "bg-red-600/20 text-red-400 border border-red-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-full transition-all">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white text-2xl">☰</button>
          <div className="flex-1" />
          <span className="text-gray-400 text-sm capitalize">{admin?.role?.replace("_", " ") || "Admin"}</span>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}