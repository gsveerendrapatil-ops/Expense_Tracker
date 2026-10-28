import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/navbar.css";
import "./styles/sidebar.css";
import "./styles/dashboard.css";
import "./styles/forms.css";
import "./styles/transactions.css";
import "./styles/auth.css";
import "./styles/profile.css";
import "./styles/category-master.css";
import "./styles/status.css";
import "./styles/responsive.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
