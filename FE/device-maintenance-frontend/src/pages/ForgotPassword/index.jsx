// src/pages/ForgotPassword/index.jsx
// Trang Yêu cầu đặt lại mật khẩu qua Email (Module 1 - Authentication)

import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  Input,
  Button,
  Alert,
  MailIcon,
} from "../../components/ui";
import { validateForgotPasswordForm } from "../../utils/validation";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setApiSuccess("");

    const validation = validateForgotPasswordForm({ email });
    if (!validation.isValid) {
      setError(validation.errors.email);
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API POST /api/v1/auth/forgot-password
      await forgotPassword(email);

      setApiSuccess(
        `Hướng dẫn đặt lại mật khẩu và mã Token đã được gửi tới địa chỉ ${email}. Vui lòng kiểm tra hòm thư của bạn.`
      );
    } catch (err) {
      console.error("Lỗi yêu cầu đặt lại mật khẩu:", err);

      let errorMessage = "Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại.";

      if (err.isNetworkError || err.message?.includes("Network Error") || err.code === "ERR_NETWORK") {
        errorMessage =
          "Không thể kết nối đến máy chủ Backend (http://localhost:8080). Vui lòng kiểm tra dịch vụ Spring Boot đang chạy.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 404) {
        errorMessage = "Email này không tồn tại trong hệ thống tài khoản.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-form-container">
      <div className="auth-form-header">
        <h2 className="auth-form-title">Quên mật khẩu?</h2>
        <p className="auth-form-subtitle">
          Nhập địa chỉ email liên kết với tài khoản của bạn để nhận mã token đặt lại mật khẩu
        </p>
      </div>

      {apiSuccess && (
        <Alert
          type="success"
          title="Yêu cầu đã được gửi thành công!"
          message={apiSuccess}
        />
      )}

      {apiError && (
        <Alert
          type="error"
          title="Gửi yêu cầu thất bại"
          message={apiError}
          onClose={() => setApiError("")}
        />
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <Input
          id="forgot-email"
          name="email"
          type="email"
          label="Địa chỉ Email tài khoản"
          placeholder="user@example.com"
          value={email}
          onChange={handleChange}
          error={error}
          icon={<MailIcon size={18} />}
          required
          autoComplete="email"
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          className="auth-primary-btn"
        >
          {isLoading ? "Đang gửi yêu cầu..." : "Gửi yêu cầu đặt lại mật khẩu"}
        </Button>
      </form>

      {/* Điều hướng 2 bên chuẩn xác theo mẫu thiết kế */}
      <div className="forgot-footer-nav-row">
        <Link to="/login" className="forgot-nav-link left-link">
          ← Quay lại Đăng nhập
        </Link>

        <Link to="/reset-password" className="forgot-nav-link right-link">
          Đã có mã token? →
        </Link>
      </div>
    </div>
  );
}
