import { useState, useEffect, createContext, useContext } from "react";
import { getAdminMe, adminLogin as loginApi, adminLogout as logoutApi } from "../api/admin";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      getAdminMe()
        .then((data) => setAdmin(data))
        .catch(() => localStorage.removeItem("admin_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, password) {
    const data = await loginApi(email, password);
    const adminData = { id: data.admin_id, email: data.email, full_name: data.full_name, role: data.role };
    setAdmin(adminData);
    return data;
  }

  async function logout() {
    logoutApi();
    setAdmin(null);
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, setAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}