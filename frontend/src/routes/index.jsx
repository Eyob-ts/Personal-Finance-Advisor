import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import HomePage from "../pages/HomePage"; // No curly braces for default export
import { ProtectedRoute } from "../ProtectedRoute ";

export const AppRoutes = () => {
  return (
    <Routes>


      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
        
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
};