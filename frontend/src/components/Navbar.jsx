import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  CircleUserRound,
} from "lucide-react";

function Navbar({ sidebarOpen, onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      setUser(storedUser);
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/login");
  };

  const openProfile = () => {
    setOpen(false);
    navigate("/profile");
  };

  const userName = user?.name || "User";
  const userEmail = user?.email || "user@example.com";
  const firstLetter = userName.charAt(0).toUpperCase();

  const pageTitles = {
    "/": "Dashboard",
    "/income": "Income",
    "/expenses": "Expenses",
    "/categories": "Master Category",
    "/profile": "Profile",
  };

  const pageTitle = pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="menu-button"
          onClick={onMenuClick}
          aria-label="Toggle menu"
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="navbar-title">
          <span>Page</span>
          <h2>{pageTitle}</h2>
        </div>
      </div>

      <div className="user-menu-wrapper" ref={dropdownRef}>
        <button
          type="button"
          className="user-menu-button"
          onClick={() => setOpen(!open)}
        >
          <div className="user-avatar">
            {firstLetter}
            <span className="online-dot"></span>
          </div>

          <div className="user-details">
            <strong>{userName}</strong>
            <span>{userEmail}</span>
          </div>

          <ChevronDown
            size={17}
            className={`user-arrow ${open ? "open" : ""}`}
          />
        </button>

        {open && (
          <div className="user-dropdown">
            <div className="dropdown-user-info">
              <div className="dropdown-avatar">{firstLetter}</div>

              <div>
                <strong>{userName}</strong>
                <span>{userEmail}</span>
              </div>
            </div>

            <div className="dropdown-divider"></div>

            <button
              type="button"
              className="dropdown-item"
              onClick={openProfile}
            >
              <span className="dropdown-icon">
                <User size={17} />
              </span>
              <span>Profile</span>
            </button>

            <button
              type="button"
              className="dropdown-item logout-item"
              onClick={logout}
            >
              <span className="dropdown-icon">
                <LogOut size={17} />
              </span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
