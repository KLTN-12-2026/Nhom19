// src/pages/Devices/index.jsx
// Trang danh sách thiết bị

import React from "react";


export default function Devices() {
  const dummyDevices = [
    { id: "TB-001", name: "Máy nén khí trục vít Atlas Copco", status: "Bình thường", health: "98%", lastCheck: "28/10/2026" },
    { id: "TB-002", name: "Động cơ điện ABB 55kW", status: "Cảnh báo AI", health: "74%", lastCheck: "27/10/2026" },
    { id: "TB-003", name: "Bơm ly tâm công nghiệp Grundfos", status: "Bình thường", health: "95%", lastCheck: "25/10/2026" },
    { id: "TB-004", name: "Hệ thống làm mát Chiller Daikin", status: "Đang bảo dưỡng", health: "82%", lastCheck: "29/10/2026" },
  ];

  return (
    <div style={{ textAlign: "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
            Danh mục Thiết bị & Máy móc
          </h1>
          <p style={{ color: "#64748b", margin: 0 }}>
            Quản lý thông tin, tình trạng vận hành và lịch sử bảo trì thiết bị trong nhà máy.
          </p>
        </div>
        <button
          type="button"
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Thêm thiết bị mới
        </button>
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", textAlign: "left" }}>
              <th style={{ padding: "12px 16px" }}>Mã thiết bị</th>
              <th style={{ padding: "12px 16px" }}>Tên thiết bị</th>
              <th style={{ padding: "12px 16px" }}>Trạng thái</th>
              <th style={{ padding: "12px 16px" }}>Chỉ số AI Health</th>
              <th style={{ padding: "12px 16px" }}>Kiểm tra gần nhất</th>
            </tr>
          </thead>
          <tbody>
            {dummyDevices.map((d) => (
              <tr key={d.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 16px", fontWeight: 600, color: "#2563eb" }}>{d.id}</td>
                <td style={{ padding: "12px 16px", fontWeight: 500 }}>{d.name}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      backgroundColor:
                        d.status === "Bình thường"
                          ? "#f0fdf4"
                          : d.status === "Cảnh báo AI"
                          ? "#fef3c7"
                          : "#eff6ff",
                      color:
                        d.status === "Bình thường"
                          ? "#16a34a"
                          : d.status === "Cảnh báo AI"
                          ? "#d97706"
                          : "#2563eb",
                    }}
                  >
                    {d.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", fontWeight: 600 }}>{d.health}</td>
                <td style={{ padding: "12px 16px", color: "#64748b" }}>{d.lastCheck}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
