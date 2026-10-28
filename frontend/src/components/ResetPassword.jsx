import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import show from "../assets/eye.png";
import hide from "../assets/hide.png";

import {
  Lock,
  Wallet,
  ArrowLeft,
} from "lucide-react";

import api from "../services/api";
import { useStatus } from "../context/StatusContext";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setStatus } = useStatus();

  const email = location.state?.email;
  const otp = location.state?.otp;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!newPassword.trim()) {
      setError("New Password is required");
      return;
    }

    if (!confirmPassword.trim()) {
      setError("Confirm Password is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!email || !otp) {
      setStatus({
        type: "error",
        text: "Invalid password reset session",
      });

      navigate("/forgot-password");
      return;
    }

    try {
      const response = await api.post(
        "/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );

      setStatus({
        type: "success",
        text:
          response.data.message ||
          "Password reset successful",
      });

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      setStatus({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to reset password",
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
            Protect your
            <span> account.</span>
          </h3>

          <p>
            Create a strong new password to
            keep your Expense Tracker account
            secure and protected.
          </p>

          <div className="finance-stats">

            <div>
              <strong>Secure</strong>
              <small>Password</small>
            </div>

            <div>
              <strong>Protect</strong>
              <small>Account</small>
            </div>

            <div>
              <strong>Track</strong>
              <small>Expenses</small>
            </div>

          </div>

        </div>


        {/* =================================
            RESET PASSWORD CARD
        ================================= */}

        <form
          className="auth-card"
          onSubmit={handleSubmit}
        >

          {/* Mobile Wallet Icon */}
          <div className="mobile-wallet-icon">
            <Wallet size={32} />
          </div>


          {/* =================================
              BACK TO LOGIN
          ================================= */}

          <button
            type="button"
            className="back-login-button"
            onClick={() => navigate("/login")}
          >
            <ArrowLeft size={17} />
            <span>Back to Login</span>
          </button>


          <h1>Reset Password</h1>

          <p>
            Enter your new password
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
              NEW PASSWORD
          ================================= */}

          <div className="password-field">

            <Lock
              className="input-icon password-icon"
              size={20}
            />

            <input
              type={
                showNewPassword
                  ? "text"
                  : "password"
              }
              placeholder="New Password"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(
                  event.target.value
                );
                setError("");
              }}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowNewPassword(
                  (previous) => !previous
                )
              }
            >
              <img
                src={
                  showNewPassword
                    ? show
                    : hide
                }
                alt="toggle password visibility"
                className="password-eye"
              />
            </button>

          </div>


          {/* =================================
              CONFIRM PASSWORD
          ================================= */}

          <div className="password-field">

            <Lock
              className="input-icon password-icon"
              size={20}
            />

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(
                  event.target.value
                );
                setError("");
              }}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowConfirmPassword(
                  (previous) => !previous
                )
              }
            >
              <img
                src={
                  showConfirmPassword
                    ? show
                    : hide
                }
                alt="toggle password visibility"
                className="password-eye"
              />
            </button>

          </div>


          {/* =================================
              RESET BUTTON
          ================================= */}

          <button
            type="submit"
            className="login-button"
          >
            Reset Password
          </button>


          {/* =================================
              LOGIN LINK
          ================================= */}

          {/* <p className="auth-link">

            Remember your password?

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
            >
              Login
            </button>

          </p> */}

        </form>

      </div>
    </div>
  );
}

export default ResetPassword;