import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import HomePage from "../pages/HomePage"; // No curly braces for default export
import ProtectedRoute from "./ProtectRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import AccountsPage from "../features/accounts/pages/AccountPage";
import TransactionsPage from "../features/transactions/pages/TransactionsPage";
import GoalsPage from "../features/goals/pages/GoalsPage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="goals" element={<GoalsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
