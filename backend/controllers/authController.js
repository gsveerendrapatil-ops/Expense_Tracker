import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Expense from "../models/expenseModel.js";
import Income from "../models/incomeModel.js";
import generateToken from "../utils/generateToken.js";
import {
  buildTransactionFilter,
  getPagination,
} from "../utils/transactionQuery.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email configuration error:", error);
  } else {
    console.log("✅ Email server is ready");
  }
});

export const sendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await transporter.sendMail({
      from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Expense Tracker - Password Reset OTP",

      text: `Hi ${user.name},

We received a request to reset your Expense Tracker password.

Your OTP is: ${otp}

This OTP is valid for 10 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
Expense Tracker Team`,

      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset OTP</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#eef2ff;
  font-family:Arial, Helvetica, sans-serif;
">

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      background:linear-gradient(
        135deg,
        #8b5cf6 0%,
        #6366f1 45%,
        #06b6d4 100%
      );
      padding:45px 15px;
    "
  >

    <tr>
      <td align="center">

        <!-- Main Card -->
        <table
          width="600"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width:600px;
            width:100%;
            background:#ffffff;
            border-radius:20px;
            overflow:hidden;
            box-shadow:0 15px 40px rgba(0,0,0,0.18);
          "
        >

          <!-- Gradient Header -->
          <tr>
            <td
              align="center"
              style="
                padding:40px 30px 45px;
                background:linear-gradient(
                  135deg,
                  #8b5cf6,
                  #6366f1,
                  #06b6d4
                );
                color:#ffffff;
              "
            >

              <!-- Icon -->
              <div style="
                width:70px;
                height:70px;
                background:#ffffff;
                border-radius:50%;
                margin:0 auto 20px;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:35px;
                line-height:70px;
              ">
                🔐
              </div>

              <h1 style="
                margin:0;
                font-size:30px;
                line-height:40px;
                color:#ffffff;
              ">
                Password Reset OTP
              </h1>

              <div style="
                width:55px;
                height:3px;
                background:#ffffff;
                margin:18px auto;
                border-radius:10px;
              "></div>

              <p style="
                margin:0;
                font-size:16px;
                line-height:26px;
                color:#f5f3ff;
              ">
                You requested to reset your password.<br>
                Use the OTP below to continue.
              </p>

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:35px 45px 40px;">

              <h2 style="
                margin:0 0 15px;
                color:#1f2937;
                font-size:22px;
              ">
                Hi ${user.name},
              </h2>

              <p style="
                margin:0 0 25px;
                color:#64748b;
                font-size:16px;
                line-height:27px;
              ">
                We received a request to reset the password
                for your <strong>Expense Tracker</strong> account.
                Use the OTP below to verify your identity.
              </p>

              <!-- OTP Box -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>
                  <td
                    align="center"
                    style="
                      background:#f5f3ff;
                      border-radius:15px;
                      padding:25px 15px;
                    "
                  >

                    <div style="
                      font-size:36px;
                      font-weight:bold;
                      letter-spacing:12px;
                      color:#5b21b6;
                      padding-left:12px;
                    ">
                      ${otp}
                    </div>

                  </td>
                </tr>
              </table>

              <!-- Expiration -->
              <p style="
                text-align:center;
                margin:18px 0 28px;
                color:#64748b;
                font-size:15px;
              ">
                ⏱️ This OTP is valid for
                <strong style="color:#5b21b6;">
                  10 minutes
                </strong>.
              </p>

              <!-- Security Note -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  background:#f5f3ff;
                  border-radius:14px;
                "
              >
                <tr>
                  <td style="padding:20px;">

                    <table
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >
                      <tr>

                        <td
                          valign="top"
                          style="
                            width:45px;
                            height:45px;
                            background:#8b5cf6;
                            border-radius:50%;
                            text-align:center;
                            font-size:22px;
                            line-height:45px;
                          "
                        >
                          🛡️
                        </td>

                        <td style="padding-left:15px;">

                          <strong style="
                            display:block;
                            color:#6d28d9;
                            font-size:16px;
                            margin-bottom:7px;
                          ">
                            Security Note
                          </strong>

                          <span style="
                            color:#4b5563;
                            font-size:14px;
                            line-height:22px;
                          ">
                            If you didn't request this password
                            reset, you can safely ignore this email.
                            Your account remains secure.
                          </span>

                        </td>

                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Regards -->
              <div style="
                text-align:center;
                margin-top:32px;
              ">

                <p style="
                  margin:0 0 5px;
                  color:#64748b;
                  font-size:15px;
                ">
                  Best regards,
                </p>

                <strong style="
                  color:#4f46e5;
                  font-size:17px;
                ">
                  Expense Tracker Team
                </strong>

              </div>

              <!-- Divider -->
              <div style="
                height:1px;
                background:#e5e7eb;
                margin:30px 0 20px;
              "></div>

              <!-- Footer -->
              <p style="
                margin:0;
                text-align:center;
                color:#94a3b8;
                font-size:12px;
                line-height:20px;
              ">
                © 2026 Expense Tracker. All rights reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>

  </table>

</body>
</html>
`,
    });

    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP Error:", error);

    res.status(500).json({
      message: "Failed to send OTP",
    });
  }
};
export const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      !user.resetOTP ||
      !user.resetOTPExpires ||
      user.resetOTP !== otp ||
      user.resetOTPExpires < new Date()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    res.status(500).json({
      message: "Failed to verify OTP",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP and new password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      !user.resetOTP ||
      !user.resetOTPExpires ||
      user.resetOTP !== otp ||
      user.resetOTPExpires < new Date()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    user.resetOTP = null;
    user.resetOTPExpires = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    res.status(500).json({
      message: "Failed to reset password",
    });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // create access token and refresh token
    const accessToken = generateToken(user._id);

    const refreshSecret = process.env.REFRESH_SECRET || process.env.JWT_SECRET;
    const refreshToken = jwt.sign({ id: user._id }, refreshSecret, {
      expiresIn: process.env.REFRESH_EXPIRES_IN || "30d",
    });

    // store refresh token
    user.refreshTokens.push(refreshToken);
    await user.save();

    // set httpOnly cookie for refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/api/auth/refresh-token",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      message: "Signup successful",
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const accessToken = generateToken(user._id);

    const refreshSecret = process.env.REFRESH_SECRET || process.env.JWT_SECRET;
    const refreshToken = jwt.sign({ id: user._id }, refreshSecret, {
      expiresIn: process.env.REFRESH_EXPIRES_IN || "30d",
    });

    // persist refresh token
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Get login time
    const loginTime = new Date().toLocaleString("en-IN", {
      dateStyle: "full",
      timeStyle: "short",
    });

    // Send successful login email
    try {
      await transporter.sendMail({
        from: `"Expense Tracker" <${process.env.MAIL_USERNAME}>`,
        to: user.email,
        subject: "🎉 Successful Login - Expense Tracker",

        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8" />

            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, Helvetica, sans-serif;
                background: #f3f4f6;
              }

              .email-wrapper {
                width: 100%;
                padding: 40px 15px;
                background: #f3f4f6;
              }

              .email-card {
                max-width: 600px;
                margin: auto;
                background: #ffffff;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 10px 35px rgba(0, 0, 0, 0.10);
              }

              .header {
                padding: 40px 25px;
                text-align: center;
                color: white;

                background:
                  linear-gradient(
                    135deg,
                    #16a34a,
                    #22c55e,
                    #0ea5a8
                  );
              }

              .success-icon {
                width: 75px;
                height: 75px;
                line-height: 75px;
                margin: 0 auto 18px;

                border-radius: 50%;

                background: rgba(255, 255, 255, 0.20);

                border: 3px solid rgba(255, 255, 255, 0.70);

                font-size: 38px;
              }

              .header h1 {
                margin: 0;
                font-size: 28px;
              }

              .header p {
                margin: 10px 0 0;
                font-size: 15px;
                opacity: 0.9;
              }

              .content {
                padding: 35px 30px;
              }

              .hello {
                font-size: 22px;
                font-weight: bold;
                color: #111827;
                margin-bottom: 12px;
              }

              .message {
                font-size: 15px;
                line-height: 1.7;
                color: #6b7280;
              }

              .login-box {
                margin: 25px 0;

                padding: 20px;

                border-radius: 14px;

                background: linear-gradient(
                  135deg,
                  #f0fdf4,
                  #ecfeff
                );

                border: 1px solid #bbf7d0;
              }

              .login-title {
                font-size: 15px;
                font-weight: bold;
                color: #166534;
                margin-bottom: 15px;
              }

              .login-row {
                margin: 10px 0;
                font-size: 14px;
                color: #374151;
              }

              .login-label {
                font-weight: bold;
                color: #111827;
              }

              .security {
                padding: 16px;

                border-radius: 12px;

                background: #fff7ed;

                border: 1px solid #fed7aa;

                color: #9a3412;

                font-size: 13px;

                line-height: 1.6;
              }

              .footer {
                padding: 22px;

                text-align: center;

                background: #f9fafb;

                border-top: 1px solid #e5e7eb;

                color: #9ca3af;

                font-size: 12px;
              }

              .brand {
                color: #16a34a;
                font-weight: bold;
              }

              @media only screen and (max-width: 600px) {
                .email-wrapper {
                  padding: 20px 10px;
                }

                .content {
                  padding: 25px 20px;
                }

                .header h1 {
                  font-size: 24px;
                }
              }
            </style>
          </head>

          <body>

            <div class="email-wrapper">

              <div class="email-card">

                <!-- HEADER -->

                <div class="header">

                  <div class="success-icon">
                    ✓
                  </div>

                  <h1>Login Successful</h1>

                  <p>Your Expense Tracker account was accessed</p>

                </div>


                <!-- CONTENT -->

                <div class="content">

                  <div class="hello">
                    Hello ${user.name} 👋
                  </div>

                  <div class="message">

                    You have successfully logged in to your
                    <strong>Expense Tracker</strong> account.

                    <br />

                    Your account is now ready to use.

                  </div>


                  <!-- LOGIN DETAILS -->

                  <div class="login-box">

                    <div class="login-title">
                      🔐 Login Details
                    </div>

                    <div class="login-row">
                      <span class="login-label">Email:</span>
                      ${user.email}
                    </div>

                    <div class="login-row">
                      <span class="login-label">Login time:</span>
                      ${loginTime}
                    </div>

                  </div>


                  <!-- SECURITY MESSAGE -->

                  <div class="security">

                    🛡️ <strong>Security notice:</strong>

                    If you did not perform this login,
                    please change your password immediately
                    and secure your account.

                  </div>

                </div>


                <!-- FOOTER -->

                <div class="footer">

                  This email was sent automatically by

                  <span class="brand">
                    Expense Tracker
                  </span>

                  <br />

                  Please do not reply to this email.

                </div>

              </div>

            </div>

          </body>
          </html>
        `,
      });

      console.log("Login success email sent to:", user.email);

    } catch (emailError) {
      // Don't stop login if email sending fails
      console.error("Login email error:", emailError);
    }

    // set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/api/auth/refresh-token",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // Return login response (access token)
    res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.error("Login Error:", error);

    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });

  }
};
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get profile",
    });
  }
};

// Helper to parse refresh token from cookie header
const getRefreshTokenFromHeader = (req) => {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.split(";").map(c => c.trim()).find(c => c.startsWith('refreshToken='));
  if (!match) return null;
  return match.split('=')[1];
};

export const refreshToken = async (req, res) => {
  try {
    const token = getRefreshTokenFromHeader(req) || req.body.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token provided' });

    const refreshSecret = process.env.REFRESH_SECRET || process.env.JWT_SECRET;
    let decoded;
    try {
      decoded = jwt.verify(token, refreshSecret);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    // ensure token exists in user's list
    if (!user.refreshTokens.includes(token)) {
      return res.status(401).json({ message: 'Refresh token revoked' });
    }

    // rotate refresh token
    const newAccessToken = generateToken(user._id);
    const newRefreshToken = jwt.sign({ id: user._id }, refreshSecret, {
      expiresIn: process.env.REFRESH_EXPIRES_IN || '30d',
    });

    // replace the used token with the new one
    user.refreshTokens = user.refreshTokens.filter(t => t !== token);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    // set cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/api/auth/refresh-token',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    console.error('Refresh Token Error:', error);
    res.status(500).json({ message: 'Failed to refresh token' });
  }
};

export const logout = async (req, res) => {
  try {
    const token = getRefreshTokenFromHeader(req) || req.body.refreshToken;
    if (!token) {
      // clear cookie anyway
      res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });
      return res.status(200).json({ message: 'Logged out' });
    }

    const refreshSecret = process.env.REFRESH_SECRET || process.env.JWT_SECRET;
    let decoded;
    try {
      decoded = jwt.verify(token, refreshSecret);
    } catch (err) {
      res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });
      return res.status(200).json({ message: 'Logged out' });
    }

    const user = await User.findById(decoded.id);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(t => t !== token);
      await user.save();
    }

    res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });
    res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
};

export const getProfileActivity = async (req, res) => {
  try {
    const filter = buildTransactionFilter(req.user.id, req.query);
    const { page, limit, skip } = getPagination(req.query);
    const transactionProjection = (type) => ({
      $project: {
        _id: 1,
        title: 1,
        amount: 1,
        category: 1,
        date: 1,
        description: 1,
        type: { $literal: type },
      },
    });
    const [
      user,
      incomeSummary,
      expenseSummary,
      incomeCount,
      expenseCount,
      transactions,
    ] = await Promise.all([
      User.findById(req.user.id).select("-password"),
      Income.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Income.countDocuments(filter),
      Expense.countDocuments(filter),
      Expense.aggregate([
        { $match: filter },
        transactionProjection("expense"),
        {
          $unionWith: {
            coll: Income.collection.name,
            pipeline: [{ $match: filter }, transactionProjection("income")],
          },
        },
        { $sort: { date: -1, _id: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]),
    ]);
    if (!user) return res.status(404).json({ message: "User not found" });
    const total = incomeCount + expenseCount;
    res.status(200).json({
      user,
      summary: {
        totalIncome: incomeSummary[0]?.total || 0,
        totalExpense: expenseSummary[0]?.total || 0,
      },
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load profile activity" });
  }
};
