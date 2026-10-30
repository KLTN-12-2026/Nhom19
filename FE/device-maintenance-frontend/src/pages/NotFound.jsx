// src/pages/NotFound.jsx
// Trang 404 Không tìm thấy trang

import React from "react";
import { Link } from "react-router-dom";
import { Button, ArrowLeftIcon, CpuIcon } from "../components/ui";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}
      >
        <CpuIcon size={32} />
      </div>

      <h1
        style={{
          fontSize: "4rem",
          fontWeight: 800,
          color: "#0f172a",
          margin: "0 0 0.5rem",
          letterSpacing: "-0.04em",
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#334155",
          margin: "0 0 1rem",
        }}
      >
        Không tìm thấy trang
      </h2>
      <p
        style={{
          color: "#64748b",
          maxWidth: "460px",
          lineHeight: 1.6,
          marginBottom: "2rem",
        }}
      >
        Đường dẫn bạn đang truy cập không tồn tại hoặc đã được thay đổi trong hệ thống QuanLyBaoTriAI.
      </p>

      <Link to="/login" style={{ textDecoration: "none" }}>
        <Button variant="primary" iconLeft={<ArrowLeftIcon size={18} />}>
          Về trang Đăng nhập
        </Button>
      </Link>
    </div>
  );
}
