// src/routes/AppRoutes.jsx
// Cấu hình định tuyến React Router hoàn chỉnh cho Module 1 - Authentication và các màn hình chính

import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

// Các trang xác thực
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import ChangePassword from "../pages/ChangePassword";

// Các trang nghiệp vụ
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Devices from "../pages/Devices";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Nhóm các trang Xác thực (Guest/Public Routes bọc trong AuthLayout SaaS) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* 2. Nhóm các trang Yêu cầu Đăng nhập (Protected Routes bọc trong MainLayout) */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>

      {/* 3. Trang 404 Not Found */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
