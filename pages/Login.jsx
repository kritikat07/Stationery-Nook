import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../components/UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  async function handleLogin() {
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data?.error || "Login failed.");
        setLoading(false);
        return;
      }
      // Save user in context
      login(data.customer);
      navigate("/");
    } catch (err) {
      setError(`Login failed. ${err?.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>

        {error && <div className="auth-error">{error}</div>}

        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            className="form-input"
          />
        </label>

        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
            className="form-input"
          />
        </label>

        <button
          className="checkout-button"
          type="button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="auth-footer">
          <span>Don’t have an account?</span>
          <Link to="/register" className="auth-link">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;