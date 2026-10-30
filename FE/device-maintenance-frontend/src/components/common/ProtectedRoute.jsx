// src/components/common/ProtectedRoute.jsx
// Bảo vệ các route yêu cầu đăng nhập (Dashboard, Devices, Đổi mật khẩu...)

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Spinner } from "../ui/Icons";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        gap: "12px",
        color: "#2563eb",
      }}>
        <Spinner size={36} />
        <p style={{ color: "#64748b", fontSize: "0.9375rem", fontWeight: 500 }}>
          Đang xác thực thông tin tài khoản...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
