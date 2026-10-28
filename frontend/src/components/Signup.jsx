import { useState } from "react";
import { useNavigate } from "react-router-dom";

import show from "../assets/eye.png";
import hide from "../assets/hide.png";

import {
  User,
  Mail,
  Lock,
  Wallet,
} from "lucide-react";

import api from "../services/api";
import { useStatus } from "../context/StatusContext";

function Signup() {
  const navigate = useNavigate();
  const { setStatus } = useStatus();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Used ONLY for field validation
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear previous field validation error
    setError("");

    // --------------------------------
    // FIELD VALIDATION
    // --------------------------------

    if (!name.trim()) {
      setError("Full Name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    // --------------------------------
    // SIGNUP API
    // --------------------------------

    try {
      const response = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      // --------------------------------
      // SUCCESS → STATUS PORTAL ONLY
      // --------------------------------

      const message =
        response.data.message || "Signup successful";

      setStatus({
        type: "success",
        text: message,
      });

      // Go to login
      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      // --------------------------------
      // API ERROR → STATUS PORTAL ONLY
      // --------------------------------

      const message =
        error.response?.data?.message || "Signup failed";

      setStatus({
        type: "error",
        text: message,
      });
    }
  };

  return (
    <div className="auth-page page page-auth">

      {/* Background decorative circles */}
      <div className="finance-circle circle-one"></div>
      <div className="finance-circle circle-two"></div>

      <div className="auth-container">

        {/* =================================
            LEFT INFORMATION SECTION
        ================================= */}

        <div className="auth-info">

          <div className="wallet-icon">
            <Wallet
              size={42}
              strokeWidth={1.8}
            />
          </div>

          <h2>Expense Tracker</h2>

          <h3>
            Start managing your
            <span> money.</span>
          </h3>

          <p>
            Create your account and start
            tracking your expenses, managing
            your budget, and reaching your
            financial goals.
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


        {/* =================================
            SIGNUP CARD
        ================================= */}

        <form
          className="auth-card"
          onSubmit={handleSubmit}
        >

          {/* Mobile Wallet Icon */}
          <div className="mobile-wallet-icon">
            <Wallet size={32} />
          </div>

          <h1>Create Account</h1>

          <p>
            Create your Expense Tracker account
          </p>


          {/* =================================
              VALIDATION ERROR
          ================================= */}

          <div
            className="message-area"
            aria-live="polite"
          >
            {error ? (
              <div className="error">
                {error}
              </div>
            ) : (
              <div className="placeholder"></div>
            )}
          </div>


          {/* =================================
              FULL NAME
          ================================= */}

          <div className="input-wrapper">

            <User
              className="input-icon"
              size={20}
            />

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
            />

          </div>


          {/* =================================
              EMAIL
          ================================= */}

          <div className="input-wrapper">

            <Mail
              className="input-icon"
              size={20}
            />

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


          {/* =================================
              PASSWORD
          ================================= */}

          <div className="password-field">

            <Lock
              className="input-icon password-icon"
              size={20}
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
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
              onClick={() =>
                setShowPassword(
                  (previous) => !previous
                )
              }
            >
              <img
                src={
                  showPassword
                    ? show
                    : hide
                }
                alt="toggle password visibility"
                className="password-eye"
              />
            </button>

          </div>


          {/* =================================
              CREATE ACCOUNT
          ================================= */}

          <button
            type="submit"
            className="login-button"
          >
            Create Account
          </button>


          {/* =================================
              LOGIN
          ================================= */}

          <p className="auth-link">

            Already have an account?

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
            >
              Login
            </button>

          </p>

        </form>

      </div>
    </div>
  );
}

export default Signup;