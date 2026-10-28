import {
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

function GaugeCard({ title, amount, type }) {
  const icons = {
    balance: Wallet,
    income: TrendingUp,
    expense: TrendingDown,
  };

  const Icon = icons[type] || Wallet;

  return (
    <div className={`gauge-card ${type}`}>

      <div className="gauge-card-content">

        <div className="gauge-icon">
          <Icon size={30} strokeWidth={1.8} />
        </div>

        <div className="gauge-details">
          <p>{title}</p>

          <h2>
            ₹{Number(amount || 0).toLocaleString("en-IN")}
          </h2>

          <span>
            {type === "balance"
              ? "Available balance"
              : type === "income"
              ? "Total income"
              : "Total expenses"}
          </span>
        </div>

      </div>

    </div>
  );
}

export default GaugeCard;