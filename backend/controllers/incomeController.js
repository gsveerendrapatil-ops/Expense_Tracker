import Income from "../models/incomeModel.js";
import {
  buildTransactionFilter,
  getPagination,
} from "../utils/transactionQuery.js";

export const getIncome = async (req, res) => {
  try {
    const filter = buildTransactionFilter(req.user.id, req.query);
    const { page, limit, skip } = getPagination(req.query);
    const [transactions, total, categories, summary] = await Promise.all([
      Income.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Income.countDocuments(filter),
      Income.distinct("category", { user: req.user.id }),
      Income.aggregate([
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
      message: "Failed to get income",
    });
  }
};

export const createIncome = async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;

    const income = await Income.create({
      user: req.user.id,
      title,
      amount,
      category,
      date,
      description,
    });

    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create income",
    });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndUpdate(
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

    if (!income) {
      return res.status(404).json({
        message: "Income not found",
      });
    }

    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update income",
    });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!income) {
      return res.status(404).json({
        message: "Income not found",
      });
    }

    res.status(200).json({
      message: "Income deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete income",
    });
  }
};
