import { useEffect, useState } from "react";
import {
  Wallet,
  CreditCard,
  Banknote,
  TrendingUp,
  Receipt,
  PiggyBank,
  CircleDollarSign,
  Coins,
  ArrowUpRight,
} from "lucide-react";

import Add from "../components/Add";
import Pagination from "../components/Pagination";
import TransactionFilters from "../components/TransactionFilters";
import TransactionItem from "../components/TransactionItem";
import api from "../services/api";

const EMPTY_DATA = {
  transactions: [],
  categories: [],
  summary: { total: 0 },
  pagination: { page: 1, pages: 1, total: 0 },
};

function Income() {
  const [data, setData] = useState(EMPTY_DATA);
  const [timeframe, setTimeframe] = useState("all");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingIncome, setEditingIncome] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIncome = async () => {
      try {
        setLoading(true);

        const response = await api.get("/income", {
          params: {
            timeframe,
            search,
            category,
            page,
            limit: 5,
          },
        });

        setData(response.data);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadIncome, 250);

    return () => clearTimeout(timer);
  }, [timeframe, search, category, page, refreshKey]);

  const resetPage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const refresh = () => {
    setPage(1);
    setRefreshKey((value) => value + 1);
  };

  const addIncome = async (item) => {
    await api.post("/income", item);
    refresh();
  };

  const updateIncome = async (item) => {
    await api.put(`/income/${editingIncome._id}`, item);
    setEditingIncome(null);
    refresh();
  };

  const deleteIncome = async (id) => {
    await api.delete(`/income/${id}`);

    if (editingIncome?._id === id) {
      setEditingIncome(null);
    }

    refresh();
  };

  return (
    <div className="page page-income">

      {/* Background finance icons */}
      <div className="finance-bg-icons">
        <Wallet className="finance-icon income-icon-1" />
        <CreditCard className="finance-icon income-icon-2" />
        <Banknote className="finance-icon income-icon-3" />
        <TrendingUp className="finance-icon income-icon-4" />
        <Receipt className="finance-icon income-icon-5" />
        <PiggyBank className="finance-icon income-icon-6" />
        <CircleDollarSign className="finance-icon income-icon-7" />
        <Coins className="finance-icon income-icon-8" />
      </div>

      {/* Main content */}
      <div className="income-content">

        {/* Page heading */}
        <div className="page-title-row">
          <div>
            <h1 className="page-title">Income</h1>
            <p className="page-subtitle">
              Manage your income transactions
            </p>
          </div>
        </div>

        {/* Add Income */}
        <div className="panel">

          <div className="section-heading">
            <div className="section-icon income-section-icon">
              <CircleDollarSign size={25} />
            </div>

            <div>
              <h2>
                {editingIncome ? "Edit Income" : "Add Income"}
              </h2>

              <p>
                {editingIncome
                  ? "Update your income transaction"
                  : "Add a new income transaction"}
              </p>
            </div>
          </div>

          <Add
            type="Income"
            onAdd={addIncome}
            onUpdate={updateIncome}
            editingData={editingIncome}
            onCancelEdit={() => setEditingIncome(null)}
          />
        </div>

        {/* Income History */}
        <div className="panel">

          <div className="panel-header">

            <div className="history-title">
              <div className="section-icon income-section-icon">
                <ArrowUpRight size={23} />
              </div>

              <div>
                <h2>Income History</h2>

                <p>
                  {data.pagination.total} transaction
                  {data.pagination.total !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Total Income */}
            <div className="history-total income-history-total">

              <div className="total-income-icon">
                <CircleDollarSign size={22} />
              </div>

              <div>
                <span>Total Income</span>

                <strong>
                  ₹{data.summary.total.toLocaleString("en-IN")}
                </strong>
              </div>

            </div>
          </div>

          <TransactionFilters
            timeframe={timeframe}
            search={search}
            category={category}
            categories={data.categories}
            onTimeframeChange={resetPage(setTimeframe)}
            onSearchChange={resetPage(setSearch)}
            onCategoryChange={resetPage(setCategory)}
          />

          <div className="income-transactions">

            {loading ? (
              <div className="income-loading">
                <p>Loading income...</p>
              </div>
            ) : data.transactions.length ? (
              data.transactions.map((item) => (
                <TransactionItem
                  key={item._id}
                  transaction={item}
                  type="income"
                  onDelete={deleteIncome}
                  onEdit={setEditingIncome}
                />
              ))
            ) : (
              <div className="income-empty">
                <p>No income found</p>
              </div>
            )}

          </div>

          <Pagination
            {...data.pagination}
            onPageChange={setPage}
          />

        </div>
      </div>
    </div>
  );
}

export default Income;