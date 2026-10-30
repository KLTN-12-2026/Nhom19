// src/pages/Register/index.jsx
// Trang Đăng ký tài khoản mới chuẩn hóa Module 1 - Authentication

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  Input,
  Button,
  Alert,
  UserIcon,
  MailIcon,
  PhoneIcon,
  LockIcon,
  ShieldCheckIcon,
} from "../../components/ui";
import { validateRegisterForm } from "../../utils/validation";
import "./Register.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setApiSuccess("");

    // Validation các trường bắt buộc
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API đăng ký chuẩn hóa: POST /api/v1/auth/register
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      await register(payload);

      setApiSuccess("Tài khoản đã được đăng ký thành công! Đang chuyển hướng sang trang đăng nhập...");
      setTimeout(() => {
        navigate("/login?registered=1", { replace: true });
      }, 1500);
    } catch (err) {
      console.error("Lỗi đăng ký:", err);

      let errorMessage = "Đăng ký không thành công. Vui lòng thử lại sau.";

      if (err.isNetworkError || err.message?.includes("Network Error") || err.code === "ERR_NETWORK") {
        errorMessage =
          "Không thể kết nối đến máy chủ Backend (http://localhost:8080). Vui lòng kiểm tra dịch vụ Spring Boot đang chạy.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        errorMessage = err.response.data.errors.join(", ");
      } else if (err.response?.status === 409) {
        errorMessage = "Email hoặc số điện thoại này đã được đăng ký trong hệ thống.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-form-container">
      <div className="auth-form-header">
        <h2 className="auth-form-title">Đăng ký tài khoản mới</h2>
        <p className="auth-form-subtitle">
          Tạo tài khoản để gửi yêu cầu báo hỏng và theo dõi tiến độ xử lý bảo trì
        </p>
      </div>

      {apiSuccess && (
        <Alert
          type="success"
          title="Đăng ký thành công"
          message={apiSuccess}
        />
      )}

      {apiError && (
        <Alert
          type="error"
          title="Đăng ký thất bại"
          message={apiError}
          onClose={() => setApiError("")}
        />
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Họ và tên */}
        <Input
          id="register-fullname"
          name="fullName"
          type="text"
          label="Họ và tên"
          placeholder="Ví dụ: Nguyễn Văn A"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          icon={<UserIcon size={18} />}
          required
          autoComplete="name"
          disabled={isLoading}
        />

        {/* Hàng 2 cột: Địa chỉ Email & Số điện thoại */}
        <div className="form-grid-row">
          <Input
            id="register-email"
            name="email"
            type="email"
            label="Địa chỉ Email"
            placeholder="nguyenvana@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={<MailIcon size={18} />}
            required
            autoComplete="email"
            disabled={isLoading}
          />

          <Input
            id="register-phone"
            name="phone"
            type="tel"
            label="Số điện thoại"
            placeholder="0912345678 (Tùy chọn)"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            icon={<PhoneIcon size={18} />}
            autoComplete="tel"
            disabled={isLoading}
          />
        </div>

        {/* Hàng 2 cột: Mật khẩu & Xác nhận mật khẩu */}
        <div className="form-grid-row">
          <Input
            id="register-password"
            name="password"
            type="password"
            label="Mật khẩu"
            placeholder="Tối thiểu 6 ký tự"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={<LockIcon size={18} />}
            required
            autoComplete="new-password"
            disabled={isLoading}
          />

          <Input
            id="register-confirmPassword"
            name="confirmPassword"
            type="password"
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={<ShieldCheckIcon size={18} />}
            required
            autoComplete="new-password"
            disabled={isLoading}
          />
        </div>

        {/* Dòng điều khoản quy định bảo trì */}
        <p className="register-agreement-text">
          Bằng việc đăng ký, bạn đồng ý tuân thủ các quy định bảo trì và an toàn thiết bị của hệ thống.
        </p>

        {/* Nút gửi form */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          className="auth-primary-btn"
        >
          {isLoading ? "Đang xử lý đăng ký..." : "Hoàn tất đăng ký"}
        </Button>
      </form>

      {/* Chuyển hướng sang đăng nhập */}
      <div className="auth-footer-prompt">
        <span>Đã có tài khoản trên hệ thống? </span>
        <Link to="/login" className="auth-action-link">
          Đăng nhập tại đây
        </Link>
      </div>
    </div>
  );
}
