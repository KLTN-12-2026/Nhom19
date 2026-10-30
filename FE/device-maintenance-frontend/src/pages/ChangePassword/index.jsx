// src/pages/ChangePassword/index.jsx
// Trang Đổi mật khẩu tài khoản người dùng (Module 1 - Authentication)

import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import {
  Input,
  Button,
  Alert,
  PasswordStrength,
  LockIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  UserIcon,
} from "../../components/ui";
import { validateChangePasswordForm } from "../../utils/validation";
import "./ChangePassword.css";

export default function ChangePassword() {
  const { user, changePassword } = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setApiSuccess("");

    // Validate form
    const validation = validateChangePasswordForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API POST /api/v1/auth/change-password
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setApiSuccess("Mật khẩu của bạn đã được thay đổi thành công! Hãy ghi nhớ mật khẩu mới cho lần đăng nhập tiếp theo.");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);

      let errorMessage = "Không thể đổi mật khẩu. Vui lòng kiểm tra lại thông tin.";

      if (err.isNetworkError || err.message?.includes("Network Error") || err.code === "ERR_NETWORK") {
        errorMessage =
          "Không thể kết nối đến máy chủ Backend (http://localhost:8080). Vui lòng kiểm tra dịch vụ Spring Boot đang chạy.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 400) {
        errorMessage = "Mật khẩu hiện tại không chính xác hoặc dữ liệu không hợp lệ.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-badge">
          <ShieldCheckIcon size={16} />
          <span>Bảo mật tài khoản</span>
        </div>
        <h1 className="page-title">Đổi mật khẩu tài khoản</h1>
        <p className="page-subtitle">
          Cập nhật mật khẩu định kỳ giúp bảo vệ tài khoản kỹ thuật viên và dữ liệu thiết bị của doanh nghiệp.
        </p>
      </div>

      <div className="change-password-grid">
        {/* Form đổi mật khẩu */}
        <div className="change-password-card">
          {apiSuccess && (
            <Alert
              type="success"
              title="Cập nhật thành công!"
              message={apiSuccess}
              onClose={() => setApiSuccess("")}
            />
          )}

          {apiError && (
            <Alert
              type="error"
              title="Đổi mật khẩu thất bại"
              message={apiError}
              onClose={() => setApiError("")}
            />
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Mật khẩu hiện tại */}
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              label="Mật khẩu hiện tại"
              placeholder="Nhập mật khẩu bạn đang dùng"
              value={formData.currentPassword}
              onChange={handleChange}
              error={errors.currentPassword}
              icon={<LockIcon size={18} />}
              required
              autoComplete="current-password"
              disabled={isLoading}
            />

            {/* Mật khẩu mới */}
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              label="Mật khẩu mới"
              placeholder="Tối thiểu 6 ký tự"
              value={formData.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              icon={<LockIcon size={18} />}
              required
              autoComplete="new-password"
              disabled={isLoading}
            />

            {/* Độ mạnh mật khẩu */}
            <PasswordStrength password={formData.newPassword} />

            {/* Xác nhận mật khẩu mới */}
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới vừa gõ"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<LockIcon size={18} />}
              required
              autoComplete="new-password"
              disabled={isLoading}
            />

            <div className="form-actions">
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={isLoading}
                iconLeft={<ShieldCheckIcon size={18} />}
              >
                {isLoading ? "Đang lưu thay đổi..." : "Lưu mật khẩu mới"}
              </Button>
            </div>
          </form>
        </div>

        {/* Cột thông tin tài khoản hiện tại (lấy qua /api/v1/auth/me) & Khuyến nghị bảo mật */}
        <div className="account-info-sidebar">
          {/* Card thông tin tài khoản */}
          <div className="info-card user-account-box">
            <h3 className="card-box-title">
              <UserIcon size={18} />
              <span>Tài khoản đang đăng nhập</span>
            </h3>
            <div className="user-detail-list">
              <div className="user-detail-row">
                <span className="detail-label">Họ và tên:</span>
                <span className="detail-value">{user?.fullName || "Chưa cập nhật"}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user?.email || "—"}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Số điện thoại:</span>
                <span className="detail-value">{user?.phone || "—"}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Vai trò:</span>
                <span className="role-chip">{user?.role || "KỸ THUẬT VIÊN"}</span>
              </div>
            </div>
          </div>

          {/* Card khuyến nghị bảo mật */}
          <div className="info-card security-tips-box">
            <h3 className="card-box-title">
              <CheckCircleIcon size={18} />
              <span>Tiêu chuẩn mật khẩu an toàn</span>
            </h3>
            <ul className="security-tips-list">
              <li>Độ dài tối thiểu từ 6 đến 8 ký tự trở lên.</li>
              <li>Kết hợp chữ hoa, chữ thường và ít nhất một chữ số.</li>
              <li>Không sử dụng lại mật khẩu của các hệ thống khác.</li>
              <li>Không chia sẻ tài khoản cho người không thuộc quyền quản lý.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
