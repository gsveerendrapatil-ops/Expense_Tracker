import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Mail,
  KeyRound,
  Wallet,
} from "lucide-react";

import api from "../services/api";
import { useStatus } from "../context/StatusContext";

function ForgotPassword() {
  const navigate = useNavigate();
  const { setStatus } = useStatus();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      const response = await api.post(
        "/auth/send-reset-otp",
        {
          email,
        }
      );

      setOtpSent(true);

      setStatus({
        type: "success",
        text:
          response.data.message ||
          "OTP sent successfully",
      });
    } catch (error) {
      setStatus({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to send OTP",
      });
    }
  };

  const handleVerifyOTP = async (event) => {
    event.preventDefault();
    setError("");

    if (!otp.trim()) {
      setError("OTP is required");
      return;
    }

    try {
      const response = await api.post(
        "/auth/verify-reset-otp",
        {
          email,
          otp,
        }
      );

      setStatus({
        type: "success",
        text:
          response.data.message ||
          "OTP verified successfully",
      });

      navigate("/reset-password", {
        state: {
          email,
          otp,
        },
      });
    } catch (error) {
      setStatus({
        type: "error",
        text:
          error.response?.data?.message ||
          "Invalid or expired OTP",
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
            Keep your account
            <span> secure.</span>
          </h3>

          <p>
            Don't worry if you forgot your
            password. Verify your email with
            an OTP and securely create a new
            password.
          </p>

          <div className="finance-stats">

            <div>
              <strong>Secure</strong>
              <small>Account</small>
            </div>

            <div>
              <strong>Verify</strong>
              <small>Email</small>
            </div>

            <div>
              <strong>Reset</strong>
              <small>Password</small>
            </div>

          </div>

        </div>


        {/* =================================
            RESET PASSWORD CARD
        ================================= */}

        <form
          className="auth-card"
          onSubmit={
            otpSent
              ? handleVerifyOTP
              : handleSendOTP
          }
        >

          {/* Mobile Wallet Icon */}
          <div className="mobile-wallet-icon">
            <Wallet size={32} />
          </div>


          <h1>Reset Password</h1>

          <p>
            {otpSent
              ? "Enter the OTP sent to your email"
              : "Enter your email to receive an OTP"}
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
              disabled={otpSent}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
            />

          </div>


          {/* =================================
              OTP
          ================================= */}

          {otpSent && (
            <div className="input-wrapper">

              <KeyRound
                className="input-icon"
                size={20}
              />

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                maxLength="6"
                inputMode="numeric"
                onChange={(event) => {
                  setOtp(event.target.value);
                  setError("");
                }}
              />

            </div>
          )}


          {/* =================================
              SEND / VERIFY BUTTON
          ================================= */}

          <button
            type="submit"
            className="login-button"
          >
            {otpSent
              ? "Verify OTP"
              : "Send OTP"}
          </button>


          {/* =================================
              LOGIN
          ================================= */}

          <p className="auth-link">

            Remember your password?

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

export default ForgotPassword;