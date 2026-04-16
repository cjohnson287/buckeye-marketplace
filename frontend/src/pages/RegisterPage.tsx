import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { validateAuthForm } from "../utils/authValidation";
import styles from "./AuthPage.module.css";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateAuthForm({ email, password });
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    if (!displayName.trim()) {
      setError("Display name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register({ email, password, displayName: displayName.trim() });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1>Register</h1>
        {error && <p className={styles.error}>{error}</p>}

        <label htmlFor="displayName">Display Name</label>
        <input
          id="displayName"
          aria-label="Display Name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          aria-label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          aria-label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <p className={styles.helper}>Password must include 8+ chars, one uppercase letter, and one digit.</p>

        <button type="submit" aria-label="Register" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}
