// this component is used for both adding and editing transactions.

import { useEffect, useState } from "react";
import { useStatus } from "../context/StatusContext";
import api from "../services/api";

function Add({ type, onAdd, onUpdate, editingData, onCancelEdit }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
  const loadCategories = async () => {
    try {
      const response = await api.get("/categories", {
        params: {
          type: type.toLowerCase(),
        },
      });

      setCategories(response.data);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  loadCategories();
}, [type]);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    description: "",
  });

  // Used ONLY for field validation
  const [error, setError] = useState("");

  const { setStatus } = useStatus();

  useEffect(() => {
    if (editingData) {
      setForm({
        title: editingData.title || "",
        amount: editingData.amount ?? "",
        category: editingData.category || "",
        date: editingData.date ? editingData.date.substring(0, 10) : "",
        description: editingData.description || "",
      });

      setError("");
    } else {
      setForm({
        title: "",
        amount: "",
        category: "",
        date: "",
        description: "",
      });

      setError("");
    }
  }, [editingData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    // --------------------------------
    // TITLE VALIDATION
    // --------------------------------

    if (name === "title") {
      // Allow letters, spaces and common title characters
      // Numbers are not allowed.
      const titleValue = value.replace(/[0-9]/g, "");

      setForm((previous) => ({
        ...previous,
        title: titleValue,
      }));

      setError("");
      return;
    }

    // --------------------------------
    // OTHER FIELDS
    // --------------------------------

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear previous field error
    setError("");

    // --------------------------------
    // FIELD VALIDATION
    // --------------------------------

    if (!form.title.trim()) {
      setError(`${type} title is required`);
      return;
    }

    // Extra protection against numeric title
    if (/\d/.test(form.title)) {
      setError(`${type} title cannot contain numbers`);
      return;
    }

    if (!form.amount) {
      setError("Amount is required");
      return;
    }

    if (Number(form.amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    if (!form.category) {
      setError("Category is required");
      return;
    }

    if (!form.date) {
      setError("Date is required");
      return;
    }

    // --------------------------------
    // ADD / UPDATE
    // --------------------------------

    try {
      const data = {
        ...form,
        amount: Number(form.amount),
      };

      if (editingData) {
        await onUpdate(data);
      } else {
        await onAdd(data);
      }

      // --------------------------------
      // SUCCESS
      // --------------------------------

      setStatus({
        type: "success",
        text: `${type} ${editingData ? "updated" : "added"} successfully`,
      });

      // Reset form only after successful operation
      setForm({
        title: "",
        amount: "",
        category: "",
        date: "",
        description: "",
      });

      setError("");
    } catch (err) {
      // --------------------------------
      // API ERROR
      // --------------------------------
      // Do NOT put API errors in .error.
      // Status Portal handles them.

      const message =
        err.response?.data?.message ||
        err.message ||
        `Failed to ${editingData ? "update" : "add"} ${type.toLowerCase()}`;

      setStatus({
        type: "error",
        text: message,
      });
    }
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      {/* 
        .error is ONLY for field validation.
        API errors/success messages are handled
        by StatusPortal.
      */}
      <div className="message-area" aria-live="polite">
        {error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="placeholder"></div>
        )}
      </div>

      {/* TITLE */}
      <input
        name="title"
        type="text"
        placeholder={`${type} title`}
        value={form.title}
        onChange={handleChange}
      />

      {/* AMOUNT */}
      <input
        name="amount"
        type="number"
        min="0"
        step="0.01"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
      />

      {/* CATEGORY */}
      <select
  name="category"
  value={form.category}
  onChange={handleChange}
>
  <option value="">
    Select category
  </option>

  {!categories.some(
    (category) => category.name === form.category,
  ) &&
    form.category && (
      <option value={form.category}>
        {form.category}
      </option>
    )}

  {categories.map((category) => (
    <option
      key={category._id}
      value={category.name}
    >
      {category.name}
    </option>
  ))}
</select>

      {/* DATE */}
      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
      />

      {/* DESCRIPTION */}
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      {/* BUTTONS */}
      <div className="add-actions">
        <button type="submit">
          {editingData ? `Update ${type}` : `Add ${type}`}
        </button>

        {editingData && (
          <button type="button" className="cancel-edit" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default Add;
