// src/components/common/Navbar.jsx
// Thanh điều hướng chính SaaS hiển thị thông tin tài khoản (Module 1 Auth), menu và đăng xuất

import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { CpuIcon, SparklesIcon, LogOutIcon, KeyIcon } from "../ui/Icons";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const displayName = user?.fullName || user?.email || "Người dùng";
  const displayRole = user?.role || "Kỹ thuật viên";
  const userInitial = (displayName.charAt(0) || "U").toUpperCase();

  return (
    <header className="saas-navbar">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon-box">
            <CpuIcon size={22} className="brand-icon" />
            <SparklesIcon size={12} className="brand-ai-sparkle" />
          </div>
          <div className="brand-text-group">
            <span className="brand-name">QuanLyBaoTri<span className="brand-ai-highlight">AI</span></span>
            <span className="brand-badge-pill">SaaS Enterprise</span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="navbar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Tổng quan (Dashboard)
          </NavLink>
          <NavLink
            to="/devices"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Thiết bị
          </NavLink>
        </nav>

        {/* User Account & Actions */}
        <div className="navbar-user-area">
          <div className="user-profile-badge">
            <div className="user-avatar" title={displayName}>
              {userInitial}
            </div>
            <div className="user-info">
              <span className="user-name">{displayName}</span>
              <span className="user-role">{displayRole}</span>
            </div>
          </div>

          <div className="navbar-action-buttons">
            <Link
              to="/change-password"
              className="action-btn change-pass-btn"
              title="Đổi mật khẩu tài khoản"
            >
              <KeyIcon size={16} />
              <span className="btn-label">Đổi MK</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="action-btn logout-btn"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOutIcon size={16} />
              <span className="btn-label">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
