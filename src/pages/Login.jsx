import { useState } from "react";
import { Link } from "react-router-dom";
import { signIn } from "../lib/auth";
import "./Auth.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    const { error } = await signIn(
      formData.email,
      formData.password
    );

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    console.log("Login successful");

    setLoading(false);
  }

  return (
    <main className="auth-page">

      <div className="auth-card">

        <span className="section-eyebrow">
          Welcome back
        </span>

        <h1>Log in to CounselConnect</h1>

        <p className="auth-description">
          Sign in to manage your counselling sessions
          and appointments.
        </p>

        {error && (
          <div className="auth-error">
            {error}
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
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">
            Create one
          </Link>
        </p>

      </div>

    </main>
  );
}

export default Login;