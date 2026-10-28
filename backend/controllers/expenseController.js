import Expense from "../models/expenseModel.js";
import {
  buildTransactionFilter,
  getPagination,
} from "../utils/transactionQuery.js";

export const getExpenses = async (req, res) => {
  try {
    const filter = buildTransactionFilter(req.user.id, req.query);
    const { page, limit, skip } = getPagination(req.query);
    const [transactions, total, categories, summary] = await Promise.all([
      Expense.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Expense.countDocuments(filter),
      Expense.distinct("category", { user: req.user.id }),
      Expense.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    res.status(200).json({
      transactions,
      categories: categories.sort(),
      summary: { total: summary[0]?.total || 0 },
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get expenses",
    });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;

    const expense = await Expense.create({
      user: req.user.id,
      title,
      amount,
      category,
      date,
      description,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create expense",
    });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update expense",
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete expense",
    });
  }
};
