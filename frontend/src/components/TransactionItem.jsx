// This component is used to display a single transaction item in the list of transactions.
//  It shows the title, category, date, and amount of the transaction,
//  along with buttons to edit or delete the transaction.
function TransactionItem({ transaction, type, onDelete, onEdit }) {
  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${transaction.title}"?`,
    );

    if (confirmed) {
      onDelete(transaction._id);
    }
  };

  return (
    <div className="transaction-item">
      <div>
        <h4>{transaction.title}</h4>

        <p>{transaction.category}</p>

        <small>{new Date(transaction.date).toLocaleDateString("en-IN")}</small>
      </div>

      <div className="transaction-right">
        <strong className={type}>
          {type === "income" ? "+" : "-"}₹
          {Number(transaction.amount).toLocaleString("en-IN")}
        </strong>

        {onEdit && (
          <button
            type="button"
            className="edit-button"
            onClick={() => onEdit(transaction)}
          >
            Edit
          </button>
        )}

        {onDelete && <button type="button" className="delete-button" onClick={handleDelete}>Delete</button>}
      </div>
    </div>
  );
}

export default TransactionItem;
