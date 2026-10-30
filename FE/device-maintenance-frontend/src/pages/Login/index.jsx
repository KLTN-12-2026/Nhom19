// src/pages/Login/index.jsx
// Trang Đăng nhập tài khoản chuẩn hóa Module 1 - Authentication

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  Input,
  Button,
  Alert,
  MailIcon,
  LockIcon,
  UserIcon,
  WrenchIcon,
  UsersIcon,
} from "../../components/ui";
import { validateLoginForm } from "../../utils/validation";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Đọc query parameters (nếu được chuyển hướng sau khi đăng ký hoặc hết hạn phiên)
  const searchParams = new URLSearchParams(location.search);
  const isRegisteredSuccess = searchParams.get("registered") === "1";
  const isSessionExpired = searchParams.get("expired") === "1";
  const isResetSuccess = searchParams.get("reset") === "1";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Xoá lỗi khi người dùng bắt đầu chỉnh sửa
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");
  };

  // Tính năng điền nhanh tài khoản demo tiện lợi cho thử nghiệm / bảo vệ đồ án
  const handleFillDemo = (role) => {
    let demoEmail = "";
    const demoPassword = "Password123@";

    if (role === "admin") {
      demoEmail = "admin@example.com";
    } else if (role === "ktv") {
      demoEmail = "ktv@example.com";
    } else if (role === "user") {
      demoEmail = "user@example.com";
    }

    setFormData({
      email: demoEmail,
      password: demoPassword,
    });
    setErrors({});
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Validate form
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API đăng nhập thật: POST /api/v1/auth/login
      await login(formData.email, formData.password);

      // Nếu có trang trước đó muốn vào, chuyển hướng về đó, ngược lại về Dashboard
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      // Xử lý lỗi API hoặc lỗi mạng mà không giả lập đăng nhập thành công
      console.error("Lỗi đăng nhập:", err);

      let errorMessage = "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.";

      if (err.isNetworkError || err.message?.includes("Network Error") || err.code === "ERR_NETWORK") {
        errorMessage =
          "Không thể kết nối đến máy chủ Backend (http://localhost:8080). Vui lòng kiểm tra dịch vụ Spring Boot đang chạy.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 401 || err.response?.status === 400) {
        errorMessage = "Email hoặc mật khẩu không chính xác. Vui lòng thử lại.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="auth-form-header">
        <h2 className="auth-form-title">Đăng nhập tài khoản</h2>
        <p className="auth-form-subtitle">
          Nhập thông tin xác thực để truy cập hệ thống quản lý thiết bị và bảo trì
        </p>
      </div>

      {/* Thông báo thông tin nếu có query param */}
      {isRegisteredSuccess && (
        <Alert
          type="success"
          title="Đăng ký thành công!"
          message="Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để bắt đầu sử dụng."
        />
      )}

      {isResetSuccess && (
        <Alert
          type="success"
          title="Mật khẩu đã được đặt lại!"
          message="Vui lòng đăng nhập bằng mật khẩu mới của bạn."
        />
      )}

      {isSessionExpired && (
        <Alert
          type="warning"
          title="Phiên đăng nhập đã hết hạn"
          message="Vui lòng đăng nhập lại để tiếp tục thao tác."
        />
      )}

      {/* Thông báo lỗi khi API thất bại */}
      {apiError && (
        <Alert
          type="error"
          title="Đăng nhập thất bại"
          message={apiError}
          onClose={() => setApiError("")}
        />
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Địa chỉ Email */}
        <Input
          id="login-email"
          name="email"
          type="email"
          label="Địa chỉ Email"
          placeholder="admin@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={<MailIcon size={18} />}
          required
          autoComplete="email"
          disabled={isLoading}
        />

        {/* Mật khẩu */}
        <div className="password-input-group">
          <Input
            id="login-password"
            name="password"
            type="password"
            label="Mật khẩu"
            placeholder="Password123@"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={<LockIcon size={18} />}
            required
            autoComplete="current-password"
            disabled={isLoading}
          />

          <div className="forgot-password-align-right">
            <Link to="/forgot-password" className="forgot-password-link">
              Quên mật khẩu?
            </Link>
          </div>
        </div>

        {/* Nút Submit Đăng nhập */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          className="auth-primary-btn"
        >
          {isLoading ? "Đang xác thực..." : "Đăng nhập"}
        </Button>

        {/* KHỐI ĐIỀN NHANH TÀI KHOẢN DEMO (THỬ NGHIỆM) */}
        <div className="demo-accounts-box">
          <div className="demo-accounts-title">
            ĐIỀN NHANH TÀI KHOẢN DEMO (THỬ NGHIỆM)
          </div>
          <div className="demo-buttons-row">
            <button
              type="button"
              className="demo-chip-btn"
              onClick={() => handleFillDemo("admin")}
              title="Điền tài khoản Admin"
            >
              <UserIcon size={14} />
              <span>Admin (Quản trị)</span>
            </button>
            <button
              type="button"
              className="demo-chip-btn"
              onClick={() => handleFillDemo("ktv")}
              title="Điền tài khoản Kỹ thuật viên"
            >
              <WrenchIcon size={14} />
              <span>Kỹ thuật viên (KTV)</span>
            </button>
            <button
              type="button"
              className="demo-chip-btn"
              onClick={() => handleFillDemo("user")}
              title="Điền tài khoản Người dùng"
            >
              <UsersIcon size={14} />
              <span>Người dùng (User)</span>
            </button>
          </div>
        </div>
      </form>

      {/* Chuyển hướng sang đăng ký */}
      <div className="auth-footer-prompt">
        <span>Chưa có tài khoản trên hệ thống? </span>
        <Link to="/register" className="auth-action-link">
          Đăng ký tài khoản mới
        </Link>
      </div>
    </div>
  );
}
