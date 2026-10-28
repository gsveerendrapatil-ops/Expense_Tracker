// This utility function is used to get the start and end dates 
// for a given timeframe (week, month, 3 months, or 6 months).
export const getDateRange = (timeframe) => {
  const end = new Date();
  const start = new Date();

  if (timeframe === "week") {
    start.setDate(start.getDate() - 7);
  }

  if (timeframe === "month") {
    start.setMonth(start.getMonth() - 1);
  }

  if (timeframe === "3months") {
    start.setMonth(start.getMonth() - 3);
  }

  if (timeframe === "6months") {
    start.setMonth(start.getMonth() - 6);
  }

  return {
    start,
    end
  };
};