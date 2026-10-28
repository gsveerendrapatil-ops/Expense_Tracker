import { useEffect, useState } from "react";

import {
  Wallet,
  Coins,
  TrendingUp,
  Receipt,
  CreditCard,
  CircleDollarSign,
  TrendingDown,
  ChartNoAxesCombined,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import GaugeCard from "../components/GaugeCard";
import TimeFrame from "../components/TimeFrame";
import TransactionItem from "../components/TransactionItem";
import api from "../services/api";

const COLORS = [
  "#4f46e5",
  "#06b6d4",
  "#f97316",
  "#ef4444",
  "#a78bfa",
  "#10b981",
];

function Dashboard() {
  const [timeframe, setTimeframe] = useState("all");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError("");

        const response = await api.get("/dashboard", {
          params: { timeframe },
        });

        setData(response.data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Failed to load dashboard",
        );
      }
    };

    loadDashboard();
  }, [timeframe]);

  if (!data && !error) {
    return <div className="loading-screen">Loading dashboard...</div>;
  }

  return (
    <div className="page page-dashboard">
      {/* =================================
          BACKGROUND FINANCE ICONS
      ================================= */}

      <div className="finance-bg-icons">
        <Wallet className="finance-icon icon-1" />

        <Coins className="finance-icon icon-2" />

        <TrendingUp className="finance-icon icon-3" />

        <Receipt className="finance-icon icon-4" />

        <CreditCard className="finance-icon icon-5" />

        <CircleDollarSign className="finance-icon icon-6" />

        <TrendingDown className="finance-icon icon-7" />

        <ChartNoAxesCombined className="finance-icon icon-8" />
      </div>

      {/* =================================
          HEADER
      ================================= */}

      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Overview</h1>

          <p>Track your financial activity</p>
        </div>

        <TimeFrame value={timeframe} onChange={setTimeframe} />
      </div>

      {/* =================================
          ERROR
      ================================= */}

      {error && <div className="error">{error}</div>}

      {data && (
        <>
          {/* =================================
              SUMMARY CARDS
          ================================= */}

          <div className="cards">
            <GaugeCard
              title="Total Balance"
              amount={data.balance}
              type="balance"
            />

            <GaugeCard
              title="Total Income"
              amount={data.totalIncome}
              type="income"
            />

            <GaugeCard
              title="Total Expense"
              amount={data.totalExpense}
              type="expense"
            />
          </div>

          {/* =================================
              EXPENSE BY CATEGORY
          ================================= */}

          <div className="dashboard-grid">
            <div className="panel category-panel">
              <div className="panel-heading">
                <div className="panel-icon category-icon">
                  <ChartNoAxesCombined size={23} />
                </div>

                <div>
                  <h2>Expense by Category</h2>

                  <p>See where your money is going</p>
                </div>
              </div>

              {data.categoryTotals.length ? (
                <div className="category-content">
                  <div className="chart">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={data.categoryTotals}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={105}
                          innerRadius={55}
                          paddingAngle={2}
                          label
                        >
                          {data.categoryTotals.map((item, index) => (
                            <Cell
                              key={item.name}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>

                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Category list */}

                  <div className="category-list">
                    {data.categoryTotals.map((item, index) => (
                      <div className="category-item" key={item.name}>
                        <div className="category-name">
                          <span
                            className="category-dot"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />

                          <span>{item.name}</span>
                        </div>

                        <strong>
                          ₹{Number(item.value).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="empty">No expense data for this period</p>
              )}
            </div>
          </div>

          {/* =================================
              RECENT TRANSACTIONS
          ================================= */}

          <div className="transactions-grid">
            {/* =================================
                RECENT INCOME
            ================================= */}

            <div className="panel transaction-panel">
              <div className="panel-heading">
                <div className="panel-icon income-panel-icon">
                  <ArrowDownToLine size={22} />
                </div>

                <div>
                  <h2>Recent Income</h2>

                  <p>Your latest earnings</p>
                </div>
              </div>

              {data.recentIncome.length ? (
                <div className="transaction-list">
                  {data.recentIncome.map((item) => (
                    <TransactionItem
                      key={item._id}
                      transaction={item}
                      type="income"
                    />
                  ))}
                </div>
              ) : (
                <p className="empty">No income for this period</p>
              )}
            </div>

            {/* =================================
                RECENT EXPENSES
            ================================= */}

            <div className="panel transaction-panel">
              <div className="panel-heading">
                <div className="panel-icon expense-panel-icon">
                  <ArrowUpFromLine size={22} />
                </div>

                <div>
                  <h2>Recent Expenses</h2>

                  <p>Your latest spending</p>
                </div>
              </div>

              {data.recentExpenses.length ? (
                <div className="transaction-list">
                  {data.recentExpenses.map((item) => (
                    <TransactionItem
                      key={item._id}
                      transaction={item}
                      type="expense"
                    />
                  ))}
                </div>
              ) : (
                <p className="empty">No expenses for this period</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
