"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/lib/auth/types";
import { ROLE_DASHBOARDS } from "@/lib/auth/types";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<{ error?: string }>;
  register: (
    data: {
      firstName: string;
      lastName: string;
      email: string;
      organization: string;
      role: string;
      reason: string;
    }
  ) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || "Login failed" };
    }

    if (data.accessToken) {
      localStorage.setItem("access_token", data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem("refresh_token", data.refreshToken);
    }

    setUser(data.user);
    router.push(data.redirectTo);
    router.refresh();
    return {};
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    organization: string;
    role: string;
    reason: string;
  }) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok) {
      return { error: resData.error || "Registration failed" };
    }

    if (resData.token) {
      localStorage.setItem("access_token", resData.token);
    }
    if (resData.refreshToken) {
      localStorage.setItem("refresh_token", resData.refreshToken);
    }

    setUser(resData.user);
    router.push(resData.redirectTo || "/dashboard");
    router.refresh();
    return {};
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      await fetch("/api/auth/logout", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
      });
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useDashboardPath(role?: AuthUser["role"]) {
  if (!role) return "/login";
  return ROLE_DASHBOARDS[role];
}
