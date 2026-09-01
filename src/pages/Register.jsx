import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../lib/auth";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    const { data, error } = await signUp(
      formData.email,
      formData.password
    );

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      setMessage(
        "Account created. Please check your email to confirm your account."
      );
    }

    setLoading(false);
  }

  return (
    <main className="auth-page">

      <div className="auth-card">

        <span className="section-eyebrow">
          Join CounselConnect
        </span>

        <h1>Create your account</h1>

        <p className="auth-description">
          Create an account to connect with counsellors
          and manage your sessions.
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {message && (
          <div className="auth-success">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Log in
          </Link>
        </p>

      </div>

    </main>
  );
}

export default Register;