import { useState, createContext, useContext } from "react";

const AuthContext = createContext(null);

function loadUser() {
  try {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveUser(data) {
  if (data) {
    localStorage.setItem("auth_user", JSON.stringify(data));
  } else {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  }
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(loadUser);

  const setUser = (data) => {
    saveUser(data);
    setUserState(data);
  };

  async function login(type, credential, password) {
    const { loginApi } = await import("../api/auth");
    const data = await loginApi(type, credential, password);
    const userData = {
      authenticated: true,
      user_id: data.user_id,
      email: data.email,
      full_name: data.full_name,
      registration_type: data.registration_type,
      team_name: data.team_name,
    };
    localStorage.setItem("auth_token", data.access_token);
    saveUser(userData);
    setUserState(userData);
    return data;
  }

  async function logout() {
    try {
      const { logoutApi } = await import("../api/auth");
      await logoutApi();
    } catch {
      // ignore
    }
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
