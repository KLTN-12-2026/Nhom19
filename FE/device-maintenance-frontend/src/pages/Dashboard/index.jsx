// src/pages/Dashboard/index.jsx
// Trang tổng quan thống kê hệ thống bảo trì thiết bị AI

import React from "react";
import useAuth from "../../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div style={{ textAlign: "left" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.625rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
          Tổng quan vận hành (Dashboard)
        </h1>
        <p style={{ color: "#64748b", margin: 0 }}>
          Theo dõi các chỉ số bảo trì thiết bị và cảnh báo AI thời gian thực.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "1.25rem",
          }}
        >
          <div style={{ fontSize: "0.8125rem", color: "#64748b", marginBottom: "4px" }}>
            Tổng số thiết bị
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a" }}>48</div>
          <div style={{ fontSize: "0.75rem", color: "#16a34a", marginTop: "4px" }}>
            ● Hoạt động bình thường 96%
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "1.25rem",
          }}
        >
          <div style={{ fontSize: "0.8125rem", color: "#64748b", marginBottom: "4px" }}>
            Cảnh báo rủi ro AI
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f59e0b" }}>02</div>
          <div style={{ fontSize: "0.75rem", color: "#d97706", marginTop: "4px" }}>
            ● Cần kiểm tra vòng bi động cơ
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "1.25rem",
          }}
        >
          <div style={{ fontSize: "0.8125rem", color: "#64748b", marginBottom: "4px" }}>
            Lịch bảo dưỡng tuần này
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#2563eb" }}>05</div>
          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}>
            Phân công cho: {user?.fullName || "Kỹ thuật viên"}
          </div>
        </div>
      </div>
    </div>
  );
}
