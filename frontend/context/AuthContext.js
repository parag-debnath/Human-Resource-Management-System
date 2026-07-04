import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("hrms_user") : null;
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("hrms_token", data.token);
    localStorage.setItem("hrms_user", JSON.stringify(data.user));
    setUser(data.user);
    router.push(data.user.role === "admin" ? "/dashboard/admin" : "/dashboard/employee");
  };

  const signup = async (payload) => {
    await api.post("/auth/signup", payload);
  };

  const logout = () => {
    localStorage.removeItem("hrms_token");
    localStorage.removeItem("hrms_user");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
