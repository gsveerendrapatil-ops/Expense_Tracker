// This component is used to protect routes that require authentication. 
// If the user is not authenticated (i.e., no token is found in localStorage), 
// they will be redirected to the login page.

import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
