export const formatCurrency = (amount) => {
  // this function formats a number into Indian currency format with the rupee symbol.
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
};

export const getTotal = (items) => {
  // this function calculates the total amount of a list of items.
  return items.reduce((total, item) => total + Number(item.amount || 0), 0);
};

export const filterByTimeframe = (items, timeframe) => {
  // this function filters a list of items based on a time frame.
  if (timeframe === "all") {
    return items;
  }

  const now = new Date();
  const start = new Date();

  if (timeframe === "week") {
    start.setDate(now.getDate() - 7);
  }

  if (timeframe === "month") {
    start.setMonth(now.getMonth() - 1);
  }

  if (timeframe === "3months") {
    start.setMonth(now.getMonth() - 3);
  }

  if (timeframe === "6months") {
    start.setMonth(now.getMonth() - 6);
  }

  return items.filter((item) => new Date(item.date) >= start);
};
