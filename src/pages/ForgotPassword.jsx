import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../lib/auth";
import "./Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "If an account exists with this email address, a password reset link has been sent."
    );

    setLoading(false);
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <span className="section-eyebrow">Account recovery</span>

        <h1>Forgot your password?</h1>

        <p className="auth-description">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        {error && <div className="auth-error">{error}</div>}

        {message && <div className="auth-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="auth-footer">
          Remember your password? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}

export default ForgotPassword;