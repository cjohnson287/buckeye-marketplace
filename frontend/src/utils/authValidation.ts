interface AuthValidationInput {
  email: string;
  password: string;
}

interface AuthValidationResult {
  valid: boolean;
  message: string;
}

export function validateAuthForm({ email, password }: AuthValidationInput): AuthValidationResult {
  if (!email.trim() || !password.trim()) {
    return {
      valid: false,
      message: "Email and password are required",
    };
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      message: "Email format is invalid",
    };
  }

  return {
    valid: true,
    message: "",
  };
}
