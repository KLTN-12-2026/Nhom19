// src/layouts/AuthLayout.jsx
// Khung giao diện xác thực đồng bộ chuẩn thiết kế QuanLyBaoTriAI

import React from "react";
import { Outlet } from "react-router-dom";
import { WrenchIcon, BotIcon, BoxIcon } from "../components/ui/Icons";
import "./AuthLayout.css";

export default function AuthLayout() {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-modal-card">
        {/* CỘT TRÁI: BANNER THƯƠNG HIỆU & TÍNH NĂNG */}
        <aside className="auth-sidebar-banner">
          {/* Header thương hiệu */}
          <div className="auth-banner-header">
            <div className="auth-banner-logo-box">
              <WrenchIcon size={24} className="auth-wrench-icon" />
            </div>
            <div className="auth-banner-brand-text">
              <h1 className="auth-brand-name">QuanLyBaoTriAI</h1>
              <span className="auth-brand-pill">Smart Maintenance AI</span>
            </div>
          </div>

          {/* Danh sách 3 tính năng đặc sắc */}
          <div className="auth-banner-features">
            <div className="auth-banner-feature-item">
              <div className="feature-icon-wrapper">
                <BotIcon size={20} />
              </div>
              <div className="feature-content">
                <h3 className="feature-heading">AI Triage & Chẩn đoán sự cố</h3>
                <p className="feature-description">
                  Tự động nhận diện mức độ rủi ro, phân loại lỗi và đề xuất khuyến cáo an toàn tức thì.
                </p>
              </div>
            </div>

            <div className="auth-banner-feature-item">
              <div className="feature-icon-wrapper">
                <WrenchIcon size={20} />
              </div>
              <div className="feature-content">
                <h3 className="feature-heading">Quy trình bảo trì khép kín</h3>
                <p className="feature-description">
                  Từ báo hỏng, phê duyệt, phân công kỹ thuật viên đến nghiệm thu phiếu bảo trì chuẩn chỉnh.
                </p>
              </div>
            </div>

            <div className="auth-banner-feature-item">
              <div className="feature-icon-wrapper">
                <BoxIcon size={20} />
              </div>
              <div className="feature-content">
                <h3 className="feature-heading">Quản lý thiết bị & QR Code</h3>
                <p className="feature-description">
                  Theo dõi vòng đời, điểm sức khỏe thiết bị và tra cứu nhanh qua mã QR.
                </p>
              </div>
            </div>
          </div>

          {/* Footer chân trang cột trái */}
          <div className="auth-banner-footer">
            <span>Đồ án tốt nghiệp Công nghệ thông tin</span>
            <span>Phiên bản v1.0</span>
          </div>
        </aside>

        {/* CỘT PHẢI: FORM CHỨC NĂNG */}
        <main className="auth-content-panel">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
