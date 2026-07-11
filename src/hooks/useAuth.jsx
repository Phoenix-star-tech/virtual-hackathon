import { useState, useEffect, createContext, useContext } from "react";
import { getSessionApi, loginApi, registerApi, logoutApi } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Wrapper to sync state with localStorage
  const setUser = (data) => {
    if (data) {
      localStorage.setItem("auth_user", JSON.stringify(data));
      setUserState(data);
    } else {
      localStorage.removeItem("auth_user");
      setUserState(null);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      // If we already have a user in localStorage, we can trust it for now
      // since the backend doesn't use HTTP cookies for auth state effectively
      if (localStorage.getItem("auth_user")) {
        setLoading(false);
        return;
      }
      const data = await getSessionApi();
      if (data.authenticated) {
        setUser(data);
      }
    } catch {
      // Not authenticated
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const data = await loginApi(email, password);
    setUser({
      authenticated: true,
      user_id: data.user_id,
      email: data.email,
      full_name: data.full_name,
    });
    return data;
  }

  async function register(fullName, email, phone, college, password) {
    const data = await registerApi(fullName, email, phone, college, password);
    if (data.user_id) {
      setUser({
        authenticated: true,
        user_id: data.user_id,
        email: data.email,
        full_name: data.full_name,
      });
    }
    return data;
  }

  async function logout() {
    try {
      await logoutApi();
    } catch {
      // ignore
    }
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}