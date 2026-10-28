// This is the main server file for the Expense Tracker application.
// It sets up the Express server, connects to MongoDB, and defines the API routes for authentication,
//  expenses, income, and dashboard data.
import express from "express";
import mongoose from "mongoose";
import cors from "cors"; 
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Expense Tracker API is running"
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/expenses",
  expenseRoutes
);

app.use(
  "/api/income",
  incomeRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB Connection Error:",
      error.message
    );
  });