function TimeFrame({ value, onChange }) {
  return (
    <select
      className="time-frame"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="all">All Time</option>

      <option value="week">Last 7 Days</option>

      <option value="month">Last Month</option>

      <option value="3months">Last 3 Months</option>

      <option value="6months">Last 6 Months</option>
    </select>
  );
}

export default TimeFrame;