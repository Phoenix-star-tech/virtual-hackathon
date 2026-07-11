import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./hooks/useAuth";
import { AdminAuthProvider, useAdminAuth } from "./hooks/useAdminAuth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import FAQPage from "./pages/FAQPage";
import PrivacyPage from "./pages/PrivacyPage";
import RefundPage from "./pages/RefundPage";
import TermsPage from "./pages/TermsPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminModules from "./pages/admin/AdminModules";
import AdminTasks from "./pages/admin/AdminTasks";
import AdminTeams from "./pages/admin/AdminTeams";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminLeaderboard from "./pages/admin/AdminLeaderboard";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash.replace("#", ""));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

function LayoutWithNav() {
  return (
    <div className="bg-[#0a0a0a] antialiased font-sans overflow-x-hidden pt-16 sm:pt-20">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

function LayoutWithoutNav() {
  return <Outlet />;
}

function AdminGuard({ children }) {
  const { admin, loading } = useAdminAuth();
  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-gray-400">Loading...</div>;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<LayoutWithNav />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/refund" element={<RefundPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Route>
            <Route element={<LayoutWithoutNav />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="modules" element={<AdminModules />} />
              <Route path="tasks" element={<AdminTasks />} />
              <Route path="teams" element={<AdminTeams />} />
              <Route path="submissions" element={<AdminSubmissions />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="leaderboard" element={<AdminLeaderboard />} />
            </Route>
          </Routes>
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}