// this file defines the routes for user authentication,
//  including signup, login, and profile retrieval.
// It uses the authController to handle the logic for each
// route and applies the authMiddleware to protect the profile route.
import express from "express";

import { signup, login, getProfile, getProfileActivity, sendResetOTP, verifyResetOTP, resetPassword, refreshToken, logout } from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/send-reset-otp", sendResetOTP);

router.post("/verify-reset-otp", verifyResetOTP);

router.post("/reset-password", resetPassword);

router.post('/refresh-token', refreshToken);

router.post('/logout', logout);

router.get("/profile", authMiddleware, getProfile);

router.get("/profile/activity", authMiddleware, getProfileActivity);

export default router;
