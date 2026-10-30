// src/pages/Home/index.jsx
// Trang chủ chào đón người dùng sau khi đăng nhập thành công vào QuanLyBaoTriAI

import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  SparklesIcon,
  CpuIcon,
  ShieldCheckIcon,
  KeyIcon,
  WrenchIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "../../components/ui/Icons";
import "./Home.css";

export default function Home() {
  const { user } = useAuth();

  const displayName = user?.fullName || user?.email || "Kỹ thuật viên";

  return (
    <div className="home-dashboard">
      {/* Welcome Banner */}
      <section className="welcome-hero-card">
        <div className="welcome-hero-content">
          <div className="welcome-pill">
            <SparklesIcon size={14} />
            <span>QuanLyBaoTriAI Enterprise Cloud</span>
          </div>
          <h1 className="welcome-heading">Xin chào, {displayName}! 👋</h1>
          <p className="welcome-subtext">
            Hệ thống quản lý và hỗ trợ bảo trì thiết bị tích hợp AI đã sẵn sàng hoạt động.
            Tất cả các mô-đun dữ liệu và phân tích dự đoán đang ở trạng thái tối ưu.
          </p>

          <div className="welcome-action-buttons">
            <Link to="/devices" className="hero-btn hero-primary-btn">
              <WrenchIcon size={16} />
              <span>Quản lý danh sách thiết bị</span>
              <ArrowRightIcon size={16} />
            </Link>
            <Link to="/change-password" className="hero-btn hero-secondary-btn">
              <KeyIcon size={16} />
              <span>Bảo mật & Đổi mật khẩu</span>
            </Link>
          </div>
        </div>

        <div className="welcome-hero-visual">
          <div className="ai-status-card">
            <div className="ai-status-header">
              <CpuIcon size={24} className="ai-status-icon" />
              <div>
                <div className="ai-status-title">Trạng thái AI Engine</div>
                <div className="ai-status-subtitle">Model: PredictiveMaintenance v2.4</div>
              </div>
            </div>
            <div className="ai-metric-grid">
              <div className="ai-metric-item">
                <span className="metric-num">99.8%</span>
                <span className="metric-tag">Độ chính xác chuẩn đoán</span>
              </div>
              <div className="ai-metric-item">
                <span className="metric-num">&lt; 150ms</span>
                <span className="metric-tag">Độ trễ suy luận</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module Overview Cards */}
      <div className="modules-overview-grid">
        <div className="module-status-card">
          <div className="card-top-indicator active">
            <CheckCircleIcon size={18} />
            <span>Đã hoàn thành</span>
          </div>
          <h2 className="module-title">Module 1: Authentication</h2>
          <p className="module-desc">
            Xác thực tài khoản JWT an toàn, hỗ trợ Đăng nhập, Đăng ký, Quên/Đặt lại mật khẩu và Đổi mật khẩu qua chuẩn API.
          </p>
          <div className="module-meta">
            <span className="badge-tag">Spring Boot API</span>
            <span className="badge-tag">Bearer Token</span>
            <span className="badge-tag">React Context</span>
          </div>
        </div>

        <div className="module-status-card">
          <div className="card-top-indicator">
            <ShieldCheckIcon size={18} />
            <span>Tài khoản hiện tại</span>
          </div>
          <h2 className="module-title">{user?.email || "Email chưa cập nhật"}</h2>
          <p className="module-desc">
            Vai trò: <strong>{user?.role || "KỸ THUẬT VIÊN"}</strong> • Số điện thoại:{" "}
            {user?.phone || "Chưa cập nhật"}
          </p>
          <div className="module-meta">
            <Link to="/change-password" className="text-link">
              Quản lý bảo mật tài khoản →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
