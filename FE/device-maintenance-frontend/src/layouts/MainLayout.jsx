// src/layouts/MainLayout.jsx
// Khung giao diện chính SaaS có Navbar, quản lý phiên và nội dung trang được bảo vệ

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import "./MainLayout.css";

export default function MainLayout() {
  return (
    <div className="main-layout-container">
      <Navbar />
      <main className="main-content-area">
        <Outlet />
      </main>
      <footer className="main-footer">
        <div className="footer-inner">
          <p>© 2026 QuanLyBaoTriAI – Hệ thống quản lý và hỗ trợ bảo trì thiết bị tích hợp AI</p>
          <div className="footer-links">
            <span>Module 1: Authentication</span>
            <span className="dot">•</span>
            <span>Trạng thái: Hoạt động</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
