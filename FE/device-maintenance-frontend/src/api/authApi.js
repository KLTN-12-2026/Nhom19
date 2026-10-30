// src/api/authApi.js
// Chuẩn hóa toàn bộ API xác thực (Authentication Module 1) theo đúng quy ước đồ án

import axiosClient from "./axiosClient";

const authApi = {
  /**
   * Đăng ký tài khoản mới
   * POST /api/v1/auth/register
   * Body: { fullName, email, phone, password, confirmPassword }
   * Response dự kiến: { id, fullName, email, role, createdAt }
   */
  register: (data) => {
    return axiosClient.post("/api/v1/auth/register", {
      fullName: data.fullName?.trim(),
      email: data.email?.trim(),
      phone: data.phone?.trim(),
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
  },

  /**
   * Đăng nhập hệ thống
   * POST /api/v1/auth/login
   * Body: { email, password }
   * Response dự kiến: { accessToken, refreshToken, tokenType, expiresIn, user }
   */
  login: (data) => {
    return axiosClient.post("/api/v1/auth/login", {
      email: data.email?.trim(),
      password: data.password,
    });
  },

  /**
   * Làm mới Access Token
   * POST /api/v1/auth/refresh-token
   * Body: { refreshToken }
   */
  refreshToken: (refreshToken) => {
    return axiosClient.post("/api/v1/auth/refresh-token", {
      refreshToken,
    });
  },

  /**
   * Đăng xuất khỏi hệ thống
   * POST /api/v1/auth/logout
   * Body: { refreshToken }
   */
  logout: (refreshToken) => {
    return axiosClient.post("/api/v1/auth/logout", {
      refreshToken: refreshToken || undefined,
    });
  },

  /**
   * Yêu cầu đặt lại mật khẩu (quên mật khẩu)
   * POST /api/v1/auth/forgot-password
   * Body: { email }
   */
  forgotPassword: (data) => {
    return axiosClient.post("/api/v1/auth/forgot-password", {
      email: data.email?.trim(),
    });
  },

  /**
   * Đặt lại mật khẩu bằng Token
   * POST /api/v1/auth/reset-password
   * Body: { token, newPassword, confirmPassword }
   */
  resetPassword: (data) => {
    return axiosClient.post("/api/v1/auth/reset-password", {
      token: data.token?.trim(),
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  },

  /**
   * Đổi mật khẩu tài khoản
   * POST /api/v1/auth/change-password
   * Body: { currentPassword, newPassword, confirmPassword }
   */
  changePassword: (data) => {
    return axiosClient.post("/api/v1/auth/change-password", {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  },

  /**
   * Lấy thông tin tài khoản hiện tại qua Access Token
   * GET /api/v1/auth/me
   */
  getMe: () => {
    return axiosClient.get("/api/v1/auth/me");
  },
};

export default authApi;
