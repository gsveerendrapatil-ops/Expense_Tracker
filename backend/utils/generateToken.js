// This utility function is used to generate a JWT token for a given user ID.
import jwt from "jsonwebtoken";

const generateToken = (
  userId,
  expiresIn = process.env.JWT_EXPIRES_IN || "15m",
) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
};

export default generateToken;
