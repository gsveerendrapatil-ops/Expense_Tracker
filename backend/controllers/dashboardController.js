import Expense from "../models/expenseModel.js";
import Income from "../models/incomeModel.js";
import { buildTransactionFilter } from "../utils/transactionQuery.js";

export const getDashboard = async (req, res) => {
  try {
    const expenseFilter = buildTransactionFilter(req.user.id, req.query);
    const incomeFilter = buildTransactionFilter(req.user.id, req.query);
    const [
      expenseSummary,
      incomeSummary,
      categoryTotals,
      recentExpenses,
      recentIncome,
    ] = await Promise.all([
      Expense.aggregate([
        { $match: expenseFilter },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Income.aggregate([
        { $match: incomeFilter },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        { $match: expenseFilter },
        { $group: { _id: "$category", value: { $sum: "$amount" } } },
        { $project: { _id: 0, name: "$_id", value: 1 } },
        { $sort: { value: -1 } },
      ]),
      Expense.find(expenseFilter).sort({ date: -1, createdAt: -1 }).limit(5),
      Income.find(incomeFilter).sort({ date: -1, createdAt: -1 }).limit(5),
    ]);

    const totalExpense = expenseSummary[0]?.total || 0;
    const totalIncome = incomeSummary[0]?.total || 0;
    res.status(200).json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryTotals,
      recentExpenses,
      recentIncome,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
