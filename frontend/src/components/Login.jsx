import show from "../assets/eye.png";
import hide from "../assets/hide.png";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Mail, Lock, Wallet } from "lucide-react";

import api from "../services/api";
import { useStatus } from "../context/StatusContext";

function Login() {
  const navigate = useNavigate();
  const { setStatus } = useStatus();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Used ONLY for field validation
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear previous field error
    setError("");

    // --------------------------------
    // FIELD VALIDATION
    // --------------------------------

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    // --------------------------------
    // LOGIN API
    // --------------------------------

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Save authentication information
      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      // --------------------------------
      // SUCCESS → STATUS PORTAL ONLY
      // --------------------------------

      const message = response.data.message || "Login successful";

      setStatus({
        type: "success",
        text: message,
      });

      // Go to dashboard
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      // --------------------------------
      // API ERROR → STATUS PORTAL ONLY
      // --------------------------------

      const message = error.response?.data?.message || "Login failed";

      setStatus({
        type: "error",
        text: message,
      });
    }
  };

  return (
    <div className="auth-page page page-auth">
      {/* Background decorative elements */}
      <div className="finance-circle circle-one"></div>
      <div className="finance-circle circle-two"></div>

      <div className="auth-container">

        
        {/* LEFT SIDE */}
        <div className="auth-info">
          <div className="wallet-icon">
            <Wallet size={42} strokeWidth={1.8} />
          </div>

          <h2>Expense Tracker</h2>

          <h3>
            Take control of your
            <span> finances.</span>
          </h3>

          <p>
            Track your expenses, manage your budget, and understand where your
            money goes.
          </p>

          <div className="finance-stats">
            <div>
              <strong>Track</strong>
              <small>Expenses</small>
            </div>

            <div>
              <strong>Manage</strong>
              <small>Budget</small>
            </div>

            <div>
              <strong>Save</strong>
              <small>Money</small>
            </div>
          </div>
        </div>

        {/* LOGIN CARD */}
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="mobile-wallet-icon">
            <Wallet size={32} />
          </div>

          <h1>Welcome Back</h1>

          <p>Login to your Expense Tracker</p>

          {/* Validation Error */}
          <div className="message-area" aria-live="polite">
            {error ? (
              <div className="error">{error}</div>
            ) : (
              <div className="placeholder"></div>
            )}
          </div>

          {/* EMAIL */}
          <div className="input-wrapper">
            <Mail className="input-icon" size={20} />

            <input
              type="email"
              placeholder="Email"
              value={email}
              autoComplete="email"
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
            />
          </div>

          {/* PASSWORD */}
          <div className="password-field">
            <Lock className="input-icon password-icon" size={20} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              autoComplete="new-password"
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((previous) => !previous)}
            >
              <img
                src={showPassword ? show : hide}
                alt="toggle password visibility"
                className="password-eye"
              />
            </button>
          </div>

          {/* FORGOT PASSWORD */}
          <button
            type="button"
            className="forgot-password"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>

          {/* LOGIN */}
          <button type="submit" className="login-button">
            Login
          </button>

          {/* SIGN UP */}
          <p className="auth-link">
            Don't have an account?
            <button type="button" onClick={() => navigate("/signup")}>
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
