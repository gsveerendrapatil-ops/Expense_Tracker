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
  FolderKanban,
} from "lucide-react";

import api from "../services/api";
import { useStatus } from "../context/StatusContext";
function CategoryMaster() {
  const { setStatus } = useStatus();

  // income or expense
  const [type, setType] = useState("income");

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const title =
    type === "income" ? "Income Master Category" : "Expense Master Category";

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/categories", {
        params: { type },
      });

      setCategories(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Failed to load categories",
      );
    } finally {
      setLoading(false);
    }
  };

  // Load categories whenever Income/Expense changes
  useEffect(() => {
    loadCategories();

    // Clear edit form when switching type
    setEditingId(null);
    setName("");
    setError("");
  }, [type]);

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      if (editingId) {
        const response = await api.put(`/categories/${editingId}`, {
          name: name.trim(),
        });

        setCategories((previous) =>
          previous.map((category) =>
            category._id === editingId ? response.data.category : category,
          ),
        );

        setStatus({
          type: "success",
          text: "Category updated successfully",
        });

        setEditingId(null);
      } else {
        const response = await api.post("/categories", {
          name: name.trim(),
          type,
        });

        setCategories((previous) => [...previous, response.data.category]);

        setStatus({
          type: "success",
          text: "Category added successfully",
        });
      }

      setName("");
    } catch (requestError) {
      const message =
        requestError.response?.data?.message || "Failed to save category";

      setStatus({
        type: "error",
        text: message,
      });

      setError(message);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setName(category.name);
    setError("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/categories/${id}`);

      setCategories((previous) =>
        previous.filter((category) => category._id !== id),
      );

      setStatus({
        type: "success",
        text: "Category deleted successfully",
      });
    } catch (requestError) {
      const message =
        requestError.response?.data?.message || "Failed to delete category";

      setStatus({
        type: "error",
        text: message,
      });
    }
  };

  return (
    <div className="page page-category">
      {/* =================================
    BACKGROUND FINANCE ICONS
================================= */}

      <div className="finance-bg-icons category-bg-icons">
        <Wallet className="finance-icon icon-1" />
        <Coins className="finance-icon icon-2" />
        <TrendingUp className="finance-icon icon-3" />
        <Receipt className="finance-icon icon-4" />
        <CreditCard className="finance-icon icon-5" />
        <CircleDollarSign className="finance-icon icon-6" />
        <TrendingDown className="finance-icon icon-7" />
        <ChartNoAxesCombined className="finance-icon icon-8" />
        <FolderKanban className="finance-icon icon-9" />
      </div>

      <div className="page-title-row">
        <div>
          <h1 className="page-title">Master Category</h1>

          <p className="page-subtitle">Manage income and expense categories</p>
        </div>
      </div>

      {/* ================================
          INCOME / EXPENSE RADIO BUTTONS
          ================================ */}
      <div className="panel category-type-panel">
        <h2>Category Type</h2>

        <div className="category-type-radio-group">
          <label className="category-type-radio">
            <input
              type="radio"
              name="categoryType"
              value="income"
              checked={type === "income"}
              onChange={handleTypeChange}
            />

            <span>Income</span>
          </label>

          <label className="category-type-radio">
            <input
              type="radio"
              name="categoryType"
              value="expense"
              checked={type === "expense"}
              onChange={handleTypeChange}
            />

            <span>Expense</span>
          </label>
        </div>
      </div>

      {/* ================================
          ADD / EDIT CATEGORY
          ================================ */}
      <div className="panel">
        <h2>{title}</h2>

        <form className="add-form" onSubmit={handleSubmit}>
          <div className="message-area" aria-live="polite">
            {error ? (
              <div className="error">{error}</div>
            ) : (
              <div className="placeholder"></div>
            )}
          </div>

          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(event) => {
              const value = event.target.value.replace(/[0-9]/g, "");

              setName(value);
              setError("");
            }}
          />

          <div className="add-actions">
            <button type="submit">
              {editingId ? "Update Category" : "Add Category"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-edit"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ================================
          CATEGORY LIST
          ================================ */}
      <div className="panel">
        <h2>{title.replace(" Master Category", " Categories")}</h2>

        {loading ? (
          <p className="empty">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="empty">No {type} categories found</p>
        ) : (
          <div className="category-list">
            {categories.map((category) => (
              <div className="transaction-item" key={category._id}>
                <div>
                  <h4>{category.name}</h4>
                </div>

                <div className="transaction-right">
                  <button
                    className="edit-button"
                    type="button"
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => handleDelete(category._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryMaster;
