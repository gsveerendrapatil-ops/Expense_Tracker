import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import CategoryMaster from "./pages/CategoryMaster";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

import Dashboard from "./pages/Dashboard";

import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Profile from "./pages/Profile";
import { StatusProvider, StatusPortal } from "./context/StatusContext";

function App() {
  return (
    <BrowserRouter>
      <StatusProvider>
        <StatusPortal />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Layout>
                  <CategoryMaster />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/income"
            element={
              <ProtectedRoute>
                <Layout>
                  <Income />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Layout>
                  <Expense />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </StatusProvider>
    </BrowserRouter>
  );
}

export default App;
