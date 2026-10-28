import mongoose from "mongoose";

export const getDateFilter = (timeframe) => {
  if (!timeframe || timeframe === "all") return {};

  const end = new Date();
  const start = new Date(end);
  const ranges = {
    week: () => start.setDate(start.getDate() - 7),
    month: () => start.setMonth(start.getMonth() - 1),
    "3months": () => start.setMonth(start.getMonth() - 3),
    "6months": () => start.setMonth(start.getMonth() - 6),
  };

  if (!ranges[timeframe]) return {};
  ranges[timeframe]();
  return { date: { $gte: start, $lte: end } };
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const buildTransactionFilter = (userId, query) => {
  const filter = {
    user: new mongoose.Types.ObjectId(userId),
    ...getDateFilter(query.timeframe),
  };

  if (query.category && query.category !== "all")
    filter.category = query.category;

  if (query.search?.trim()) {
    const search = new RegExp(escapeRegExp(query.search.trim()), "i");
    filter.$or = [
      { title: search },
      { category: search },
      { description: search },
    ];
  }

  return filter;
};

export const getPagination = (query) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(Number.parseInt(query.limit, 10) || 10, 1),
    50,
  );
  return { page, limit, skip: (page - 1) * limit };
};
