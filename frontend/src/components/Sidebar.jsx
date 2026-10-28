import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Tags,
  TrendingUp,
  TrendingDown,
  WalletCards,
} from "lucide-react";

function Sidebar({ isOpen, onClose }) {
  const handleNavigation = () => {
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/categories",
      label: "Master Category",
      icon: Tags,
    },
    {
      path: "/income",
      label: "Income",
      icon: TrendingUp,
      type: "income",
    },
    {
      path: "/expenses",
      label: "Expenses",
      icon: TrendingDown,
      type: "expense",
    },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <WalletCards size={21} />
        </div>

        <div className="sidebar-brand">
          <span>Expense</span>
          <strong>Tracker</strong>
        </div>
      </div>

      <div className="sidebar-menu-title">MENU</div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavigation}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""} ${
                  item.type ? `sidebar-${item.type}` : ""
                }`
              }
            >
              <span className="sidebar-icon">
                <Icon size={19} strokeWidth={2} />
              </span>

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;