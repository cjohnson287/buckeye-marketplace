import { apiFetch } from "./http";
import type { AuthResponse, LoginPayload, RegisterPayload } from "../types/auth";

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => ({}));
    throw new Error(problem.detail ?? "Failed to register");
  }

  return response.json();
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => ({}));
    throw new Error(problem.detail ?? "Failed to login");
  }

  return response.json();
}
