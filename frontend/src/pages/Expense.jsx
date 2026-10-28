import { useEffect, useState } from "react";

import {
  Wallet,
  Coins,
  TrendingDown,
  Receipt,
  CreditCard,
  CircleDollarSign,
  ChartNoAxesCombined,
  ShoppingCart,
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

function Expense() {
  const [data, setData] = useState(EMPTY_DATA);
  const [timeframe, setTimeframe] = useState("all");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true);

        const response = await api.get("/expenses", {
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

    const timer = setTimeout(loadExpenses, 250);

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

  const addExpense = async (item) => {
    await api.post("/expenses", item);
    refresh();
  };

  const updateExpense = async (item) => {
    await api.put(`/expenses/${editingExpense._id}`, item);

    setEditingExpense(null);
    refresh();
  };

  const deleteExpense = async (id) => {
    await api.delete(`/expenses/${id}`);

    if (editingExpense?._id === id) {
      setEditingExpense(null);
    }

    refresh();
  };

  return (
    <div className="page page-expense">

      {/* =================================
          BACKGROUND FINANCE ICONS
      ================================= */}

      <div className="finance-bg-icons">

        <Wallet className="finance-icon expense-icon-1" />

        <Coins className="finance-icon expense-icon-2" />

        <TrendingDown className="finance-icon expense-icon-3" />

        <Receipt className="finance-icon expense-icon-4" />

        <CreditCard className="finance-icon expense-icon-5" />

        <CircleDollarSign className="finance-icon expense-icon-6" />

        <ChartNoAxesCombined className="finance-icon expense-icon-7" />

        <ShoppingCart className="finance-icon expense-icon-8" />

      </div>


      {/* =================================
          MAIN CONTENT
      ================================= */}

      <div className="expense-content">

        {/* =================================
            PAGE TITLE
        ================================= */}

        <div className="page-title-row">

          <div>
            <h1 className="page-title">
              Expenses
            </h1>

            <p className="page-subtitle">
              Manage your expense transactions
            </p>
          </div>

        </div>


        {/* =================================
            ADD / EDIT EXPENSE
        ================================= */}

        <div className="panel">

          <div className="section-heading">

            <div className="section-icon expense-section-icon">
              <CircleDollarSign size={23} />
            </div>

            <div>

              <h2>
                {editingExpense
                  ? "Edit Expense"
                  : "Add Expense"}
              </h2>

              <p>
                {editingExpense
                  ? "Update your expense transaction"
                  : "Add a new expense transaction"}
              </p>

            </div>

          </div>


          <Add
            type="Expense"
            onAdd={addExpense}
            onUpdate={updateExpense}
            editingData={editingExpense}
            onCancelEdit={() =>
              setEditingExpense(null)
            }
          />

        </div>


        {/* =================================
            EXPENSE HISTORY
        ================================= */}

        <div className="panel">

          <div className="panel-header">

            <div className="history-title">

              <div className="section-icon expense-section-icon">
                <Receipt size={23} />
              </div>

              <div>

                <h2>
                  Expense History
                </h2>

                <p>
                  {data.pagination.total} transaction
                  {data.pagination.total !== 1
                    ? "s"
                    : ""}
                </p>

              </div>

            </div>


            {/* TOTAL EXPENSE */}

            <div className="history-total expense-history-total">

              <div className="total-expense-icon">
                <TrendingDown size={21} />
              </div>

              <div>

                <span>
                  Total Expense
                </span>

                <strong>
                  ₹
                  {data.summary.total.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            </div>

          </div>


          {/* =================================
              FILTERS
          ================================= */}

          <TransactionFilters
            timeframe={timeframe}
            search={search}
            category={category}
            categories={data.categories}
            onTimeframeChange={resetPage(
              setTimeframe
            )}
            onSearchChange={resetPage(
              setSearch
            )}
            onCategoryChange={resetPage(
              setCategory
            )}
          />


          {/* =================================
              TRANSACTIONS
          ================================= */}

          <div className="expense-transactions">

            {loading ? (

              <div className="expense-loading">

                <TrendingDown size={30} />

                <p>
                  Loading expenses...
                </p>

              </div>

            ) : data.transactions.length ? (

              data.transactions.map((item) => (

                <TransactionItem
                  key={item._id}
                  transaction={item}
                  type="expense"
                  onDelete={deleteExpense}
                  onEdit={setEditingExpense}
                />

              ))

            ) : (

              <div className="expense-empty">

                <Receipt size={30} />

                <p>
                  No expenses found
                </p>

              </div>

            )}

          </div>


          {/* =================================
              PAGINATION
          ================================= */}

          <Pagination
            {...data.pagination}
            onPageChange={setPage}
          />

        </div>

      </div>

    </div>
  );
}

export default Expense;