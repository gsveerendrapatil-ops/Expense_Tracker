import { useEffect, useState } from "react";
import {
  User,
  Mail,
  ArrowUpCircle,
  ArrowDownCircle,
  Activity as ActivityIcon,
} from "lucide-react";

import Pagination from "../components/Pagination";
import TimeFrame from "../components/TimeFrame";
import TransactionItem from "../components/TransactionItem";
import api from "../services/api";

const EMPTY_DATA = {
  user: null,
  summary: { totalIncome: 0, totalExpense: 0 },
  transactions: [],
  pagination: { page: 1, pages: 1, total: 0 },
};

function Profile() {
  const [data, setData] = useState(EMPTY_DATA);
  const [timeframe, setTimeframe] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/auth/profile/activity", {
          params: {
            timeframe,
            search,
            page,
            limit: 10,
          },
        });

        setData(response.data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Failed to load profile",
        );
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadProfile, 250);

    return () => clearTimeout(timer);
  }, [timeframe, search, page]);

  if (loading && !data.user) {
    return (
      <div className="loading-screen">
        Loading profile...
      </div>
    );
  }

  if (!data.user) {
    return (
      <div className="page page-profile">
        <div className="error">
          {error || "Profile not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="page page-profile">

      {/* PAGE TITLE */}
      <div className="profile-page-heading">
        <div className="profile-page-title-icon">
          <User size={24} />
        </div>

        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">
            Manage your profile and view your activity
          </p>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="profile-card">

        <div className="large-avatar">
          {data.user.name.charAt(0).toUpperCase()}
        </div>

        <div className="profile-info">

          <div className="profile-info-item">
            <User size={18} />
            <div>
              <span>Name</span>
              <h2>{data.user.name}</h2>
            </div>
          </div>

          <div className="profile-info-item">
            <Mail size={18} />
            <div>
              <span>Email</span>
              <p>{data.user.email}</p>
            </div>
          </div>

        </div>
      </div>

      {/* ACTIVITY PANEL */}
      <div className="panel profile-transactions-panel">

        <div className="panel-header profile-activity-header">

          <div className="history-title">

            <div className="profile-activity-icon">
              <ActivityIcon size={20} />
            </div>

            <div>
              <h2>Activity</h2>
              <p>
                Income and expenses in the {timeframe}
              </p>
            </div>

          </div>

        </div>

        {/* FILTERS */}
        <div className="transaction-filters profile-filters">

          <input
            type="search"
            placeholder="Search your activity"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />

          <TimeFrame
            value={timeframe}
            onChange={(value) => {
              setTimeframe(value);
              setPage(1);
            }}
          />

        </div>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {/* TRANSACTIONS */}
        {loading ? (
          <p className="empty">
            Loading activity...
          </p>
        ) : data.transactions.length ? (

          <div className="profile-transactions-list">

            {data.transactions.map((item) => {

              const isIncome = item.type === "income";

              return (
                <div
                  className={`profile-transaction-wrapper ${
                    isIncome
                      ? "profile-income"
                      : "profile-expense"
                  }`}
                  key={`${item.type}-${item._id}`}
                >

                  {/* INCOME / EXPENSE ICON */}
                  <div className="profile-transaction-icon">
                    {isIncome ? (
                      <ArrowUpCircle size={22} />
                    ) : (
                      <ArrowDownCircle size={22} />
                    )}
                  </div>

                  {/* TRANSACTION */}
                  <div className="profile-transaction-content">
                    <TransactionItem
                      transaction={item}
                      type={item.type}
                    />
                  </div>

                </div>
              );
            })}

          </div>

        ) : (
          <p className="empty">
            No activity found
          </p>
        )}

        <Pagination
          {...data.pagination}
          onPageChange={setPage}
        />

      </div>
    </div>
  );
}

export default Profile;