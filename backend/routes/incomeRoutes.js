import express from "express";

import {
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
} from "../controllers/incomeController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getIncome);

router.post("/", createIncome);

router.put("/:id", updateIncome);

router.delete("/:id", deleteIncome);

export default router;
