import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, UserRole } from "@empowerrural/types";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("er_token"));
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize and load user profile
  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      await loadProfile(token);
    };
    initAuth();
  }, [token]);

  const loadProfile = async (sessionToken: string) => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        // Token might be invalid, fallback to mock user for developer ease
        console.warn("API profile fetch failed, using local mock profile.");
        loadMockUser();
      }
    } catch (err) {
      console.warn("Failed to reach API server. Falling back to local mock user state.");
      loadMockUser();
    } finally {
      setLoading(false);
    }
  };

  const loadMockUser = () => {
    setUser({
      id: "mock-user-123",
      email: "demo.user@empowerrural.org",
      role: "youth",
      full_name: "Ramesh Kumar",
      mobile: "9876543210",
      gender: "male",
      age: 23,
      income_annual: 85000,
      qualification: "12th Pass",
      state: "Telangana",
      district: "Hyderabad",
      skills: ["Data Entry & Office Excel", "Spoken English & Communication"],
      bio: "Ambitious youth seeking skills and regional opportunities.",
      avatar_url: "",
      resume_completed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  };

  const login = async (email: string, role: UserRole = "youth") => {
    setLoading(true);
    try {
      const mockTokenValue = `mock-token-${Date.now()}`;
      localStorage.setItem("er_token", mockTokenValue);
      setToken(mockTokenValue);

      // In real backend, this would hit /api/auth/login. Here we simulate:
      setUser({
        id: "mock-user-123",
        email: email,
        role: role,
        full_name: role === "admin" ? "System Admin" : role === "panchayat" ? "Panchayat Officer" : "Ramesh Kumar",
        mobile: "9876543210",
        gender: "male",
        age: 23,
        income_annual: 85000,
        qualification: "12th Pass",
        state: "Telangana",
        district: "Hyderabad",
        skills: ["Data Entry & Office Excel"],
        avatar_url: "",
        resume_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.error("Login simulation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("er_token");
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!token) return;

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
      } else {
        // If API fails, update local state directly in dev mode
        setUser(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (err) {
      console.warn("Failed to reach API server for updates. Updating state locally.");
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const refreshProfile = async () => {
    if (token) await loadProfile(token);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
