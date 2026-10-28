import TimeFrame from "./TimeFrame";

function TransactionFilters({
  timeframe,
  search,
  category,
  categories,
  onTimeframeChange,
  onSearchChange,
  onCategoryChange,
}) {
  return (
    <div className="transaction-filters">
      <input
        type="search"
        placeholder="Search title, category or note"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <select
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
      >
        <option value="all">All categories</option>
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <TimeFrame value={timeframe} onChange={onTimeframeChange} />
    </div>
  );
}

export default TransactionFilters;
