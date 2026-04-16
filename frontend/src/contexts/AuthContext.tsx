/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { clearStoredToken, getStoredToken, setStoredToken } from "../api/http";
import { authReducer, initialAuthState } from "../reducers/authReducer";
import * as authApi from "../api/auth";
import type { AuthResponse, AuthState, LoginPayload, RegisterPayload } from "../types/auth";

interface AuthContextType {
  state: AuthState;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_STORAGE_KEY = "buckeye.auth.user";

function mapAuthResponseToUser(response: AuthResponse) {
  return {
    token: response.token,
    email: response.email,
    displayName: response.displayName,
    role: response.role,
  } as const;
}

function loadInitialState(): AuthState {
  const serializedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!serializedUser) {
    return initialAuthState;
  }

  try {
    const parsedUser = JSON.parse(serializedUser) as AuthState["user"];
    if (!parsedUser?.token && !getStoredToken()) {
      return initialAuthState;
    }

    const hydratedUser = {
      token: parsedUser?.token || getStoredToken() || "",
      email: parsedUser?.email || "",
      displayName: parsedUser?.displayName || "",
      role: parsedUser?.role || "User",
    };

    return {
      isAuthenticated: true,
      user: hydratedUser,
    };
  } catch {
    return initialAuthState;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, undefined, loadInitialState);

  const login = async (payload: LoginPayload) => {
    const response = await authApi.login(payload);
    const user = mapAuthResponseToUser(response);
    setStoredToken(user.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    dispatch({ type: "LOGIN_SUCCESS", payload: user });
  };

  const registerUser = async (payload: RegisterPayload) => {
    const response = await authApi.register(payload);
    const user = mapAuthResponseToUser(response);
    setStoredToken(user.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    dispatch({ type: "LOGIN_SUCCESS", payload: user });
  };

  const logout = () => {
    clearStoredToken();
    localStorage.removeItem(USER_STORAGE_KEY);
    dispatch({ type: "LOGOUT" });
  };

  const value = useMemo(
    () => ({
      state,
      login,
      register: registerUser,
      logout,
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
