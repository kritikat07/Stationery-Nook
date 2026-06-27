import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleRegister() {
    setError("");
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill out all fields.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(`Registration failed. ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>

        {error && <div className="auth-error">{error}</div>}

        <label>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Your name"
            className="form-input"
          />
        </label>

        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Your email"
            className="form-input"
          />
        </label>

        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Create a password"
            className="form-input"
          />
        </label>

        <button
          className="checkout-button"
          type="button"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;