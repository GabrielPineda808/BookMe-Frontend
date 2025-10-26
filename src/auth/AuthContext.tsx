import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../api/Api";
import type { UserDto } from "../types/UserDto";
import { userFromToken, isTokenExpired, decodeToken } from "./TokenUtils";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: UserDto | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDto | null>(() => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return null;
      if (isTokenExpired(token)) {
        localStorage.removeItem("accessToken");
        return null;
      }
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return userFromToken(token);
    } catch {
      return null;
    }
  });

  // Auto-logout timer (clears when user/token changes)
  useEffect(() => {
    let timeoutId: number | undefined;
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const payload = decodeToken(token);
        if (payload?.exp) {
          const ms = payload.exp * 1000 - Date.now();
          if (ms <= 0) {
            // already expired
            logout();
          } else {
            timeoutId = window.setTimeout(() => {
              logout();
            }, ms);
          }
        }
      }
    } catch {
      // ignore
    }
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [user]);

  // given a token after login request, persist and set user
  const login = (token: string) => {
    try {
      localStorage.setItem("accessToken", token);
    } catch {
      // ignore storage error
    }
    setUser(userFromToken(token));
  };

  const logout = () => {
    try {
      localStorage.removeItem("accessToken");
    } catch {}
    setUser(null);

    navigate("/login", { replace: true });
  };

  useEffect(() => {
    function onLogoutEvent() {
      // Clear any additional state, then navigate
      logout();
    }
    window.addEventListener("auth:logout", onLogoutEvent);
    return () => window.removeEventListener("auth:logout", onLogoutEvent);
  }, [navigate, logout]);

  const value = useMemo(
    () => ({ user, login, logout, isAuthenticated: !!user }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
