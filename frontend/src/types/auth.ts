export interface AuthResponse {
  token: string;
  email: string;
  displayName: string;
  role: "User" | "Admin";
  expiresAtUtc: string;
}

export interface AuthUser {
  email: string;
  displayName: string;
  role: "User" | "Admin";
  token: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

export type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: AuthUser }
  | { type: "LOGOUT" };

export interface RegisterPayload {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
