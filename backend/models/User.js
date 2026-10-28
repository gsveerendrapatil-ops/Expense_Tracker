// This file defines the User model for the Expense Tracker application using Mongoose.
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
    resetOTP: {
      type: String,
      default: null,
    },

    resetOTPExpires: {
      type: Date,
      default: null,
    },
    refreshTokens: {
      type: [String],
      default: [],
    },
  },

  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
