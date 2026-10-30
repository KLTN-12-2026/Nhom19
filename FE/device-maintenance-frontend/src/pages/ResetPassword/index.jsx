// src/pages/ResetPassword/index.jsx
// Trang Đặt lại mật khẩu bằng Token xác thực (Module 1 - Authentication)

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  Input,
  Button,
  Alert,
  KeyIcon,
  LockIcon,
  ShieldCheckIcon,
} from "../../components/ui";
import { validateResetPasswordForm } from "../../utils/validation";
import "./ResetPassword.css";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    token: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Tự động nhận token từ query param ?token=... nếu người dùng mở từ liên kết email
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      setFormData((prev) => ({ ...prev, token: tokenFromUrl }));
    }
  }, [location.search]);

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

    // Validation
    const validation = validateResetPasswordForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API POST /api/v1/auth/reset-password
      await resetPassword({
        token: formData.token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setApiSuccess("Mật khẩu của bạn đã được đặt lại thành công! Đang chuyển hướng về trang đăng nhập...");
      setTimeout(() => {
        navigate("/login?reset=1", { replace: true });
      }, 2000);
    } catch (err) {
      console.error("Lỗi đặt lại mật khẩu:", err);

      let errorMessage = "Không thể đặt lại mật khẩu. Vui lòng kiểm tra lại mã Token.";

      if (err.isNetworkError || err.message?.includes("Network Error") || err.code === "ERR_NETWORK") {
        errorMessage =
          "Không thể kết nối đến máy chủ Backend (http://localhost:8080). Vui lòng kiểm tra dịch vụ Spring Boot đang chạy.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 400 || err.response?.status === 404) {
        errorMessage = "Mã Token không hợp lệ hoặc đã hết hạn sử dụng. Vui lòng yêu cầu mã mới.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-form-container">
      <div className="auth-form-header">
        <h2 className="auth-form-title">Đặt lại mật khẩu</h2>
        <p className="auth-form-subtitle">
          Nhập mã token xác thực nhận từ email và mật khẩu mới để khôi phục tài khoản
        </p>
      </div>

      {apiSuccess && (
        <Alert
          type="success"
          title="Đặt lại mật khẩu thành công"
          message={apiSuccess}
        />
      )}

      {apiError && (
        <Alert
          type="error"
          title="Đặt lại mật khẩu thất bại"
          message={apiError}
          onClose={() => setApiError("")}
        />
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Token */}
        <Input
          id="reset-token"
          name="token"
          type="text"
          label="Mã xác thực (Token)"
          placeholder="Dán mã Token từ email"
          value={formData.token}
          onChange={handleChange}
          error={errors.token}
          icon={<KeyIcon size={18} />}
          required
          autoComplete="off"
          disabled={isLoading}
        />

        {/* Hàng 2 cột: Mật khẩu mới & Xác nhận mật khẩu mới */}
        <div className="form-grid-row">
          <Input
            id="reset-newPassword"
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

          <Input
            id="reset-confirmPassword"
            name="confirmPassword"
            type="password"
            label="Xác nhận mật khẩu mới"
            placeholder="Nhập lại mật khẩu mới"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={<ShieldCheckIcon size={18} />}
            required
            autoComplete="new-password"
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          className="auth-primary-btn"
        >
          {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu mới"}
        </Button>
      </form>

      {/* Điều hướng quay lại */}
      <div className="forgot-footer-nav-row">
        <Link to="/login" className="forgot-nav-link left-link">
          ← Quay lại Đăng nhập
        </Link>
      </div>
    </div>
  );
}
