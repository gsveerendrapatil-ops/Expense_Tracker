import { useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className={`main-area ${sidebarOpen ? "mobile-sidebar-open" : ""}`}>
        <Navbar sidebarOpen={sidebarOpen} onMenuClick={toggleSidebar} />

        <main className="content">{children}</main>
      </div>

      {/* Mobile overlay */}
       {/* // means that when the sidebar is open on mobile, a semi-transparent overlay will cover the rest of the screen. Clicking on this overlay will close the sidebar. */}

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}
    </div>
  );
}

export default Layout;
